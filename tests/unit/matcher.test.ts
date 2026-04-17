/**
 * Unit tests for matcher
 */

import { isBlacklisted, isBlacklistedAny, getBlacklistStats, searchByName, invalidateCache } from '../../src/shared/matcher';
import { BlacklistSnapshot } from '../../src/shared/blacklist-schema';

describe('isBlacklisted', () => {
  let snapshot: BlacklistSnapshot;

  beforeEach(() => {
    invalidateCache();
    snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
      entries: [
        {
          channelId: 'UC123456',
          channelName: 'Private Equity Channel',
          addedAt: '2024-01-01T00:00:00Z',
          reason: 'Owned by Private Equity Firm',
          handles: ['@pehandle'],
          customUrl: 'pe-channel',
          historicNames: ['Old Name'],
        },
      ],
    };
  });

  it('should find blacklisted channel by ID', () => {
    const result = isBlacklisted(snapshot, 'UC123456', 'channelId');
    expect(result.isBlacklisted).toBe(true);
    expect(result.entry?.channelName).toBe('Private Equity Channel');
  });

  it('should find blacklisted channel by handle', () => {
    const result = isBlacklisted(snapshot, 'pehandle', 'handle');
    expect(result.isBlacklisted).toBe(true);
  });

  it('should find blacklisted channel by custom URL', () => {
    const result = isBlacklisted(snapshot, 'pe-channel', 'customUrl');
    expect(result.isBlacklisted).toBe(true);
  });

  it('should not find non-blacklisted channel', () => {
    const result = isBlacklisted(snapshot, 'UC999999', 'channelId');
    expect(result.isBlacklisted).toBe(false);
  });
});

describe('isBlacklistedAny', () => {
  let snapshot: BlacklistSnapshot;

  beforeEach(() => {
    invalidateCache();
    snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
      entries: [
        {
          channelId: 'UC123456',
          channelName: 'Test Channel',
          addedAt: '2024-01-01T00:00:00Z',
        },
      ],
    };
  });

  it('should return true if any identifier is blacklisted', () => {
    const result = isBlacklistedAny(snapshot, [
      { identifier: 'UC999999', type: 'channelId' },
      { identifier: 'UC123456', type: 'channelId' },
    ]);
    expect(result.isBlacklisted).toBe(true);
  });

  it('should return false if no identifiers are blacklisted', () => {
    const result = isBlacklistedAny(snapshot, [
      { identifier: 'UC111111', type: 'channelId' },
      { identifier: 'UC222222', type: 'channelId' },
    ]);
    expect(result.isBlacklisted).toBe(false);
  });

  it('should return matched identifier', () => {
    const result = isBlacklistedAny(snapshot, [
      { identifier: 'UC123456', type: 'channelId' },
    ]);
    expect(result.matchedIdentifier).toBe('UC123456');
  });
});

describe('getBlacklistStats', () => {
  it('should calculate correct statistics', () => {
    const snapshot: BlacklistSnapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
      entries: [
        { channelId: 'UC1', channelName: 'A', addedAt: '2024-01-01T00:00:00Z', handles: ['@a'] },
        { channelId: 'UC2', channelName: 'B', addedAt: '2024-01-01T00:00:00Z', customUrl: 'b' },
        { channelId: 'UC3', channelName: 'C', addedAt: '2024-01-01T00:00:00Z', historicNames: ['old'] },
        { channelId: 'UC4', channelName: 'D', addedAt: '2024-01-01T00:00:00Z' },
      ],
    };

    const stats = getBlacklistStats(snapshot);
    expect(stats.totalEntries).toBe(4);
    expect(stats.entriesWithHandles).toBe(1);
    expect(stats.entriesWithCustomUrls).toBe(1);
    expect(stats.entriesWithHistoricNames).toBe(1);
  });
});

describe('searchByName', () => {
  let snapshot: BlacklistSnapshot;

  beforeEach(() => {
    snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
      entries: [
        { channelId: 'UC1', channelName: 'Tech Review', addedAt: '2024-01-01T00:00:00Z' },
        { channelId: 'UC2', channelName: 'Gaming Channel', addedAt: '2024-01-01T00:00:00Z', historicNames: ['Old Gaming'] },
        { channelId: 'UC3', channelName: 'Cooking Show', addedAt: '2024-01-01T00:00:00Z' },
      ],
    };
  });

  it('should find by channel name', () => {
    const results = searchByName(snapshot, 'tech');
    expect(results.length).toBe(1);
    expect(results[0].channelId).toBe('UC1');
  });

  it('should find by historic name', () => {
    const results = searchByName(snapshot, 'gaming');
    expect(results.length).toBe(1); // "Gaming Channel" matches (channel name AND historic name)
  });

  it('should return empty for no match', () => {
    const results = searchByName(snapshot, 'xyz');
    expect(results.length).toBe(0);
  });

  it('should be case insensitive', () => {
    const results = searchByName(snapshot, 'TECH');
    expect(results.length).toBe(1);
  });
});