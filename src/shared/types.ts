/**
 * Shared Types - TypeScript types used across background and content scripts
 */

import type { BlacklistSnapshot as SchemaBlacklistSnapshot, ChannelEntry } from './blacklist-schema.js';

// Channel information
export interface ChannelInfo {
  channelId?: string;
  channelName: string;
  videoId?: string;
}

export interface ChannelCheckPayload {
  channelId?: string;
  channelName?: string;
  handle?: string;
  customUrl?: string;
}

// Blacklist entry
export type BlacklistEntry = ChannelEntry;

// Blacklist snapshot
export type BlacklistSnapshot = SchemaBlacklistSnapshot;

// Message types
export type MessageType = 
  | 'PING'
  | 'CHECK_CHANNEL' 
  | 'BLACKLIST_SYNC' 
  | 'OPEN_DETAILS_PAGE'
  | 'CHANNEL_RESULT' 
  | 'SYNC_RESULT';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface ChannelCheckMessage extends Message {
  type: 'CHECK_CHANNEL';
  payload: ChannelCheckPayload;
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