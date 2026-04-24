/**
 * Matcher - Local blacklist matching with alias resolution
 */

import type { BlacklistSnapshot, ChannelEntry } from './blacklist-schema.js';
import {
  createChannelIdentifier,
  matchIdentifier,
  buildAliasIndex,
  lookupInIndex,
  normalizeHandle,
  normalizeCustomUrl,
  normalizeChannelName,
} from '../content/channel-normalize.js';

// Cached alias index with version tracking
let aliasIndex: Map<string, ChannelEntry[]> | null = null;
let cachedVersion: string | null = null;

// Build or get cached alias index (with version validation)
function getAliasIndex(snapshot: BlacklistSnapshot): Map<string, ChannelEntry[]> {
  // Invalidate cache if version changed
  if (!aliasIndex || cachedVersion !== snapshot.version) {
    aliasIndex = buildAliasIndex(snapshot.entries);
    cachedVersion = snapshot.version;
  }
  return aliasIndex;
}

// Invalidate cache when blacklist is updated
export function invalidateCache(): void {
  aliasIndex = null;
  cachedVersion = null;
}

// Check if a channel is blacklisted
export function isBlacklisted(
  snapshot: BlacklistSnapshot,
  identifier: string,
  type?: 'channelId' | 'handle' | 'customUrl' | 'channelName'
): { isBlacklisted: boolean; entry?: ChannelEntry } {
  const channelId = createChannelIdentifier(identifier, type);
  const index = getAliasIndex(snapshot);

  // Normalize identifier for index lookup based on type
  let lookupKey = identifier;
  if (type === 'handle') {
    lookupKey = normalizeHandle(identifier);
  } else if (type === 'customUrl') {
    lookupKey = normalizeCustomUrl(identifier);
  } else if (type === 'channelName') {
    lookupKey = normalizeChannelName(identifier);
  }

  // Fast lookup using index
  const candidates = lookupInIndex(index, lookupKey);
  
  for (const entry of candidates) {
    if (matchIdentifier(channelId, entry)) {
      return { isBlacklisted: true, entry };
    }
  }

  // Fallback: check channel ID directly (for entries not yet indexed)
  for (const entry of snapshot.entries) {
    if (entry.channelId === identifier || entry.channelId === channelId.value) {
      return { isBlacklisted: true, entry };
    }
  }

  return { isBlacklisted: false };
}

// Check multiple identifiers (e.g., channel ID + handle)
export function isBlacklistedAny(
  snapshot: BlacklistSnapshot,
  identifiers: Array<{ identifier: string; type?: 'channelId' | 'handle' | 'customUrl' | 'channelName' }>
): { isBlacklisted: boolean; entry?: ChannelEntry; matchedIdentifier?: string } {
  for (const { identifier, type } of identifiers) {
    const result = isBlacklisted(snapshot, identifier, type);
    if (result.isBlacklisted && result.entry) {
      return { 
        isBlacklisted: true, 
        entry: result.entry,
        matchedIdentifier: identifier 
      };
    }
  }

  return { isBlacklisted: false };
}

// Get all matching entries for an identifier (for debugging)
export function findMatches(
  snapshot: BlacklistSnapshot,
  identifier: string
): ChannelEntry[] {
  const channelId = createChannelIdentifier(identifier);
  const index = getAliasIndex(snapshot);
  const candidates = lookupInIndex(index, identifier);

  return candidates.filter(entry => matchIdentifier(channelId, entry));
}

// Get blacklist statistics
export function getBlacklistStats(snapshot: BlacklistSnapshot): {
  totalEntries: number;
  entriesWithHandles: number;
  entriesWithCustomUrls: number;
  entriesWithHistoricNames: number;
} {
  let entriesWithHandles = 0;
  let entriesWithCustomUrls = 0;
  let entriesWithHistoricNames = 0;

  for (const entry of snapshot.entries) {
    if (entry.handles && entry.handles.length > 0) entriesWithHandles++;
    if (entry.customUrl) entriesWithCustomUrls++;
    if (entry.historicNames && entry.historicNames.length > 0) entriesWithHistoricNames++;
  }

  return {
    totalEntries: snapshot.entries.length,
    entriesWithHandles,
    entriesWithCustomUrls,
    entriesWithHistoricNames,
  };
}

// Search blacklist by channel name (partial match)
export function searchByName(
  snapshot: BlacklistSnapshot,
  query: string
): ChannelEntry[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];

  return snapshot.entries.filter(entry => 
    entry.channelName.toLowerCase().includes(normalizedQuery) ||
    entry.historicNames?.some(name => name.toLowerCase().includes(normalizedQuery))
  );
}