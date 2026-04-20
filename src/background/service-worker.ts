/**
 * Service Worker - Background processing for the extension
 * Handles blacklist sync, message routing, and alarm scheduling
 */

import { syncBlacklist, getBlacklist } from './blacklist-sync.js';
import { isBlacklisted, invalidateCache } from '../shared/matcher.js';

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

// Types for message passing
export interface Message {
  type: string;
  payload?: unknown;
}

export interface BlacklistSyncMessage extends Message {
  type: 'BLACKLIST_SYNC';
  payload?: {
    force?: boolean;
  };
}

export interface ChannelCheckMessage extends Message {
  type: 'CHECK_CHANNEL';
  payload: {
    channelId?: string;
    channelName?: string;
    handle?: string;
    customUrl?: string;
  };
}

// Message handler
chrome.runtime.onMessage.addListener(
  (message: Message, sender: any, sendResponse: (response?: unknown) => void) => {
    // Keep the async message channel open and ensure any handler errors
    // are returned as a safe service-unavailable response instead of
    // letting an exception crash the service worker.
    handleMessage(message)
      .then((res) => sendResponse(res))
      .catch((err) => {
        console.error('Service worker message handler failed:', err);
        sendResponse({ success: false, error: 'service-unavailable', details: (err && (err as any).message) || String(err) });
      });
    return true; // Keep channel open for async response
  }
);

async function handleMessage(message: Message): Promise<unknown> {
  try {
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
    return { success: false, error: 'service-unavailable', details: (err && (err as any).message) || String(err) };
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
chrome.alarms.onAlarm.addListener((alarm: any) => {
  if (!alarm) return;
  if (alarm.name === 'blacklist-sync' || alarm.name === 'blacklist-sync-initial') {
    syncBlacklist();
    if (alarm.name === 'blacklist-sync-initial') {
      chrome.alarms.clear('blacklist-sync-initial');
    }
  }
});

// Install event
chrome.runtime.onInstalled.addListener((details: any) => {
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