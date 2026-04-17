/**
 * Channel Normalize - Normalize channel identifiers for matching
 */

import type { ChannelEntry } from '../shared/blacklist-schema.js';

export type ChannelIdentifier = 
  | { type: 'channelId'; value: string }
  | { type: 'handle'; value: string }
  | { type: 'customUrl'; value: string }
  | { type: 'channelName'; value: string };

// Normalize a handle (remove @ prefix, lowercase)
export function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, '').toLowerCase();
}

// Normalize a custom URL
export function normalizeCustomUrl(customUrl: string): string {
  return customUrl.toLowerCase();
}

// Normalize a channel name for comparison
export function normalizeChannelName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize a channel ID (YouTube channel IDs are case-sensitive, keep as-is)
export function normalizeChannelId(channelId: string): string {
  return channelId;
}

// Check if string looks like a YouTube channel ID (starts with UC)
export function isYouTubeChannelId(id: string): boolean {
  return /^UC[a-zA-Z0-9_-]{21,22}$/.test(id);
}

// Create a ChannelIdentifier from various input types
export function createChannelIdentifier(
  input: string,
  type?: 'channelId' | 'handle' | 'customUrl' | 'channelName'
): ChannelIdentifier {
  // Auto-detect type if not provided
  if (!type) {
    if (isYouTubeChannelId(input)) {
      type = 'channelId';
    } else if (input.startsWith('@')) {
      type = 'handle';
    } else if (input.includes('/')) {
      type = 'customUrl';
    } else {
      type = 'channelName';
    }
  }

  return { type, value: input };
}

// Match an identifier against a blacklist entry
export function matchIdentifier(
  identifier: ChannelIdentifier,
  entry: ChannelEntry
): boolean {
  const normalizedValue = normalizeValue(identifier);

  // Check channel ID
  if (identifier.type === 'channelId' || normalizedValue.type === 'channelId') {
    if (entry.channelId === identifier.value || 
        entry.channelId === normalizedValue.value) {
      return true;
    }
  }

  // Check handles
  if (entry.handles) {
    for (const handle of entry.handles) {
      if (normalizeHandle(handle) === normalizeHandle(identifier.value)) {
        return true;
      }
    }
  }

  // Check custom URL
  if (entry.customUrl) {
    if (normalizeCustomUrl(entry.customUrl) === normalizeCustomUrl(identifier.value)) {
      return true;
    }
  }

  // Check historic names
  if (entry.historicNames) {
    const normalizedInput = normalizeChannelName(identifier.value);
    for (const name of entry.historicNames) {
      if (normalizeChannelName(name) === normalizedInput) {
        return true;
      }
    }
  }

  // Check channel name (exact match only, not normalized due to false positives)
  if (identifier.type === 'channelName' || entry.channelName) {
    if (entry.channelName?.toLowerCase() === identifier.value.toLowerCase()) {
      return true;
    }
  }

  return false;
}

// Normalize identifier value based on type
function normalizeValue(identifier: ChannelIdentifier): { type: string; value: string } {
  switch (identifier.type) {
    case 'handle':
      return { type: 'handle', value: normalizeHandle(identifier.value) };
    case 'customUrl':
      return { type: 'customUrl', value: normalizeCustomUrl(identifier.value) };
    case 'channelName':
      return { type: 'channelName', value: normalizeChannelName(identifier.value) };
    case 'channelId':
    default:
      return { type: 'channelId', value: identifier.value };
  }
}

// Build alias index from blacklist entries for faster lookup
export function buildAliasIndex(entries: ChannelEntry[]): Map<string, ChannelEntry[]> {
  const index = new Map<string, ChannelEntry[]>();

  for (const entry of entries) {
    // Index by channel ID
    addToIndex(index, entry.channelId, entry);

    // Index by handles
    if (entry.handles) {
      for (const handle of entry.handles) {
        addToIndex(index, normalizeHandle(handle), entry);
      }
    }

    // Index by custom URL
    if (entry.customUrl) {
      addToIndex(index, normalizeCustomUrl(entry.customUrl), entry);
    }

    // Index by historic names
    if (entry.historicNames) {
      for (const name of entry.historicNames) {
        addToIndex(index, normalizeChannelName(name), entry);
      }
    }
  }

  return index;
}

// Add entry to index
function addToIndex(
  index: Map<string, ChannelEntry[]>,
  key: string,
  entry: ChannelEntry
): void {
  const existing = index.get(key) || [];
  existing.push(entry);
  index.set(key, existing);
}

// Lookup in alias index
export function lookupInIndex(
  index: Map<string, ChannelEntry[]>,
  identifier: string
): ChannelEntry[] {
  return index.get(identifier) || [];
}