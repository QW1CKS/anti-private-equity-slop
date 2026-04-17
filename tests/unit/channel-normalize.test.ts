/**
 * Unit tests for channel normalization
 */

import {
  normalizeHandle,
  normalizeCustomUrl,
  normalizeChannelName,
  normalizeChannelId,
  isYouTubeChannelId,
  createChannelIdentifier,
  matchIdentifier,
  buildAliasIndex,
  lookupInIndex,
} from '../../src/content/channel-normalize';
import { ChannelEntry } from '../../src/shared/blacklist-schema';

describe('normalizeHandle', () => {
  it('should remove @ prefix', () => {
    expect(normalizeHandle('@username')).toBe('username');
  });

  it('should handle handle without @', () => {
    expect(normalizeHandle('username')).toBe('username');
  });

  it('should convert to lowercase', () => {
    expect(normalizeHandle('@UserName')).toBe('username');
  });
});

describe('normalizeCustomUrl', () => {
  it('should convert to lowercase', () => {
    expect(normalizeCustomUrl('MyChannel')).toBe('mychannel');
  });
});

describe('normalizeChannelName', () => {
  it('should convert to lowercase', () => {
    expect(normalizeChannelName('My Channel')).toBe('my channel');
  });

  it('should collapse multiple spaces', () => {
    expect(normalizeChannelName('My    Channel')).toBe('my channel');
  });

  it('should trim whitespace', () => {
    expect(normalizeChannelName('  My Channel  ')).toBe('my channel');
  });
});

describe('normalizeChannelId', () => {
  it('should return channel ID as-is', () => {
    expect(normalizeChannelId('UC123456')).toBe('UC123456');
  });
});

describe('isYouTubeChannelId', () => {
  it('should return true for valid channel ID', () => {
    expect(isYouTubeChannelId('UC1234567890123456789Ab')).toBe(true);
  });

  it('should return false for invalid channel ID', () => {
    expect(isYouTubeChannelId('invalid')).toBe(false);
  });

  it('should return false for handle', () => {
    expect(isYouTubeChannelId('@username')).toBe(false);
  });
});

describe('createChannelIdentifier', () => {
  it('should auto-detect channel ID', () => {
    const id = createChannelIdentifier('UC1234567890123456789Ab');
    expect(id.type).toBe('channelId');
  });

  it('should auto-detect handle', () => {
    const id = createChannelIdentifier('@username');
    expect(id.type).toBe('handle');
  });

  it('should use provided type when specified', () => {
    const id = createChannelIdentifier('custom', 'customUrl');
    expect(id.type).toBe('customUrl');
  });
});

describe('matchIdentifier', () => {
  const mockEntry: ChannelEntry = {
    channelId: 'UC123456',
    channelName: 'Test Channel',
    addedAt: '2024-01-01T00:00:00Z',
    handles: ['@testhandle'],
    customUrl: 'testchannel',
    historicNames: ['Old Name', 'Previous Channel'],
  };

  it('should match by channel ID', () => {
    const id = createChannelIdentifier('UC123456', 'channelId');
    expect(matchIdentifier(id, mockEntry)).toBe(true);
  });

  it('should match by handle', () => {
    const id = createChannelIdentifier('@testhandle', 'handle');
    expect(matchIdentifier(id, mockEntry)).toBe(true);
  });

  it('should match by handle normalization', () => {
    const id = createChannelIdentifier('TESTHANDLE', 'handle');
    expect(matchIdentifier(id, mockEntry)).toBe(true);
  });

  it('should match by custom URL', () => {
    const id = createChannelIdentifier('testchannel', 'customUrl');
    expect(matchIdentifier(id, mockEntry)).toBe(true);
  });

  it('should match by historic name', () => {
    const id = createChannelIdentifier('Old Name', 'channelName');
    expect(matchIdentifier(id, mockEntry)).toBe(true);
  });

  it('should not match unrelated identifier', () => {
    const id = createChannelIdentifier('unrelated', 'channelName');
    expect(matchIdentifier(id, mockEntry)).toBe(false);
  });
});

describe('buildAliasIndex', () => {
  const entries: ChannelEntry[] = [
    {
      channelId: 'UC111111',
      channelName: 'Channel One',
      addedAt: '2024-01-01T00:00:00Z',
      handles: ['@one'],
    },
    {
      channelId: 'UC222222',
      channelName: 'Channel Two',
      addedAt: '2024-01-01T00:00:00Z',
      customUrl: 'two',
    },
  ];

  it('should index by channel ID', () => {
    const index = buildAliasIndex(entries);
    const results = lookupInIndex(index, 'UC111111');
    expect(results.length).toBe(1);
    expect(results[0].channelId).toBe('UC111111');
  });

  it('should index by handle', () => {
    const index = buildAliasIndex(entries);
    const results = lookupInIndex(index, 'one');
    expect(results.length).toBe(1);
    expect(results[0].channelId).toBe('UC111111');
  });

  it('should index by custom URL', () => {
    const index = buildAliasIndex(entries);
    const results = lookupInIndex(index, 'two');
    expect(results.length).toBe(1);
    expect(results[0].channelId).toBe('UC222222');
  });
});