/**
 * Shared Types - TypeScript types used across background and content scripts
 */

// Channel information
export interface ChannelInfo {
  channelId: string;
  channelName: string;
  videoId?: string;
}

// Blacklist entry
export interface BlacklistEntry {
  channelId: string;
  channelName: string;
  addedAt: string;
  reason?: string;
}

// Blacklist snapshot
export interface BlacklistSnapshot {
  version: string;
  updatedAt: string;
  signature: string;
  entries: BlacklistEntry[];
}

// Message types
export type MessageType = 
  | 'CHECK_CHANNEL' 
  | 'BLACKLIST_SYNC' 
  | 'CHANNEL_RESULT' 
  | 'SYNC_RESULT';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface ChannelCheckMessage extends Message {
  type: 'CHECK_CHANNEL';
  payload: ChannelInfo;
}

export interface ChannelResultMessage extends Message {
  type: 'CHANNEL_RESULT';
  payload: {
    isBlacklisted: boolean;
    channelName?: string;
  };
}

export interface BlacklistSyncMessage extends Message {
  type: 'BLACKLIST_SYNC';
  payload?: {
    force?: boolean;
  };
}

export interface SyncResultMessage extends Message {
  type: 'SYNC_RESULT';
  payload: {
    success: boolean;
    cached?: boolean;
    version?: string;
  };
}

// Storage keys
export const STORAGE_KEYS = {
  BLACKLIST: 'blacklist',
  ETAG: 'blacklist-etag',
  LAST_SYNC: 'last-sync',
  DISMISSED: 'dismissed-channels',
} as const;

// API endpoints (placeholder - will be configured in Phase 2)
export const API_ENDPOINTS = {
  BLACKLIST_SNAPSHOT: 'https://api.privateequityblacklist.com/v1/snapshot',
  SIGNATURE_PUBLIC_KEY: 'https://api.privateequityblacklist.com/v1/keys',
} as const;