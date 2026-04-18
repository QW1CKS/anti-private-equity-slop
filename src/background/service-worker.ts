/**
 * Service Worker - Background processing for the extension
 * Handles blacklist sync, message routing, and alarm scheduling
 */

import { syncBlacklist, getBlacklist } from './blacklist-sync.js';
import { isBlacklisted, invalidateCache } from '../shared/matcher.js';

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
    channelId: string;
    channelName?: string;
    handle?: string;
    customUrl?: string;
  };
}

// Message handler
chrome.runtime.onMessage.addListener(
  (message: Message, sender: any, sendResponse: (response?: unknown) => void) => {
    handleMessage(message).then((res) => sendResponse(res));
    return true; // Keep channel open for async response
  }
);

async function handleMessage(message: Message): Promise<unknown> {
  switch (message.type) {
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
  const snapshot = await getBlacklist();
  
  if (!snapshot || !snapshot.entries || snapshot.entries.length === 0) {
    console.log('No blacklist available');
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
  if (alarm && alarm.name === 'blacklist-sync') {
    syncBlacklist();
  }
});

// Install event
chrome.runtime.onInstalled.addListener((details: any) => {
  if (details && details.reason === 'install') {
    // Schedule initial sync
    chrome.alarms.create('blacklist-sync', { delayInMinutes: 5 });
  }
});