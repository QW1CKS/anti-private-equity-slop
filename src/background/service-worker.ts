/**
 * Service Worker - Background processing for the extension
 * Handles blacklist sync, message routing, and alarm scheduling
 */

import { syncBlacklist, getBlacklist } from './blacklist-sync.js';
import { isBlacklisted, invalidateCache } from '../shared/matcher.js';
import type { Message, BlacklistSyncMessage, ChannelCheckMessage } from '../shared/types.js';

type RuntimeMessageSender = {
  id?: string;
  url?: string;
  tab?: {
    id?: number;
    url?: string;
  };
};

type Tab = {
  id?: number;
  url?: string;
};

type InstalledDetails = {
  reason?: string;
};

type Alarm = {
  name?: string;
};

// Log on startup to help debugging service worker lifecycle
console.log('APE service worker started');
// On startup, ensure we have a cached blacklist; if not, attempt one-shot sync.
(async function ensureInitialSync() {
  try {
    const cached = await getBlacklist();
    if (!cached || !Array.isArray(cached.entries) || cached.entries.length === 0) {
      console.log('No cached blacklist found on SW start — running initial sync');
      await syncBlacklist();
    } else {
      console.debug('Cached blacklist present, version:', cached.version);
    }
  } catch (err) {
    console.warn('Initial sync check failed:', err);
  }
})();

// Message handler
chrome.runtime.onMessage.addListener(
  (message: Message, sender: RuntimeMessageSender, sendResponse: (response?: unknown) => void) => {
    // Keep the async message channel open and ensure any handler errors
    // are returned as a safe service-unavailable response instead of
    // letting an exception crash the service worker.
    handleMessage(message, sender)
      .then((res) => sendResponse(res))
      .catch((err) => {
        console.error('Service worker message handler failed:', err);
        sendResponse({ success: false, error: 'service-unavailable', details: getErrorMessage(err) });
      });
    return true; // Keep channel open for async response
  }
);

async function handleMessage(message: Message, sender: RuntimeMessageSender): Promise<unknown> {
  try {
    if (!isTrustedSender(message, sender)) {
      console.warn('Rejected runtime message from untrusted sender for type:', message?.type, sender?.url || sender?.tab?.url || 'unknown-url');
      return { success: false, error: 'forbidden' };
    }

    switch (message.type) {
      case 'PING':
        return { ok: true, ts: Date.now() };
      case 'BLACKLIST_SYNC':
        return await handleSyncBlacklist((message as BlacklistSyncMessage).payload?.force);
      case 'CHECK_CHANNEL':
        return await handleCheckChannel(message as ChannelCheckMessage);
      case 'OPEN_DETAILS_PAGE':
        await chrome.runtime.openOptionsPage();
        return { success: true };
      default:
        console.warn('Unknown message type:', message.type);
        return { success: false, error: 'Unknown message type' };
    }
  } catch (err) {
    console.error('Error in handleMessage:', err);
    return { success: false, error: 'service-unavailable', details: getErrorMessage(err) };
  }
}

// Blacklist sync handler
async function handleSyncBlacklist(force = false): Promise<{
  success: boolean;
  updated: boolean;
  cached: boolean;
  version?: string;
  error?: string;
}> {
  console.log('Blacklist sync requested, force:', force);
  const result = await syncBlacklist(force);
  
  // Invalidate matcher cache on update
  if (result.updated) {
    invalidateCache();
    
    // Notify all content scripts about the update so they can refresh their local caches
    chrome.tabs.query({}, (tabs: Tab[]) => {
      for (const tab of tabs) {
        if (tab.id && tab.url && (tab.url.includes('youtube.com'))) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'BLACKLIST_UPDATED',
            payload: { version: result.version }
          }).catch(() => {
            // Ignore errors - tab may not have content script loaded
          });
        }
      }
    });
  }
  
  return result;
}

// Channel check handler with full identifier support
async function handleCheckChannel(message: ChannelCheckMessage): Promise<{
  isBlacklisted: boolean;
  channelName?: string;
  reason?: string;
}> {
  const { channelId, channelName, handle, customUrl } = message.payload;
  
  console.log('Channel check requested:', { channelId, channelName, handle, customUrl });

  // Get current blacklist
  let snapshot = await getBlacklist();

  if (!snapshot || !snapshot.entries || snapshot.entries.length === 0) {
    console.log('No blacklist available - attempting one-shot sync');
    const syncResult = await syncBlacklist();
    if (syncResult.updated) {
      snapshot = await getBlacklist();
    }
  }

  if (!snapshot || !snapshot.entries || snapshot.entries.length === 0) {
    console.log('No blacklist available after sync');
    return { isBlacklisted: false };
  }

  // Build list of identifiers to check
  const identifiers: Array<{ identifier: string; type?: 'channelId' | 'handle' | 'customUrl' | 'channelName' }> = [];
  
  if (channelId) {
    identifiers.push({ identifier: channelId, type: 'channelId' });
  }
  if (handle) {
    identifiers.push({ identifier: handle, type: 'handle' });
  }
  if (customUrl) {
    identifiers.push({ identifier: customUrl, type: 'customUrl' });
  }
  if (channelName) {
    identifiers.push({ identifier: channelName, type: 'channelName' });
  }

  // Check each identifier
  for (const { identifier, type } of identifiers) {
    const result = isBlacklisted(snapshot, identifier, type);
    if (result.isBlacklisted && result.entry) {
      return {
        isBlacklisted: true,
        channelName: result.entry.channelName,
        reason: result.entry.reason,
      };
    }
  }

  return { isBlacklisted: false };
}

// Alarm handler for periodic sync
chrome.alarms.onAlarm.addListener((alarm: Alarm) => {
  if (!alarm) return;
  if (alarm.name === 'blacklist-sync' || alarm.name === 'blacklist-sync-initial') {
    syncBlacklist();
    if (alarm.name === 'blacklist-sync-initial') {
      chrome.alarms.clear('blacklist-sync-initial');
    }
  }
});

// Install event
chrome.runtime.onInstalled.addListener((details: InstalledDetails) => {
  // Schedule periodic sync every 12 hours
  chrome.alarms.create('blacklist-sync', { periodInMinutes: 12 * 60 });

  if (details && details.reason === 'install') {
    // Schedule a near-term one-shot to ensure a quick first sync
    chrome.alarms.create('blacklist-sync-initial', { delayInMinutes: 5 });
  }
});

// Ensure a sync when the browser starts
chrome.runtime.onStartup.addListener(() => {
  syncBlacklist();
});

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function isTrustedSender(message: Message, sender: RuntimeMessageSender): boolean {
  if (!message || typeof message.type !== 'string') {
    return false;
  }

  // Guard against forged cross-extension sender metadata.
  if (sender?.id && sender.id !== chrome.runtime.id) {
    return false;
  }

  if (message.type === 'PING' || message.type === 'BLACKLIST_SYNC') {
    return true;
  }

  if (message.type === 'CHECK_CHANNEL' || message.type === 'OPEN_DETAILS_PAGE') {
    const senderUrl = sender?.url || sender?.tab?.url || '';
    return /^https:\/\/(?:www\.)?youtube\.com\//i.test(senderUrl);
  }

  return true;
}