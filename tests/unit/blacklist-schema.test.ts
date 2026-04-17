/**
 * Unit tests for blacklist schema validation
 */

import {
  ChannelEntrySchema,
  BlacklistSnapshotSchema,
  ManifestSchema,
  isValidChannelEntry,
  isValidSnapshot,
  isValidManifest,
  SCHEMA_VERSION,
} from '../../src/shared/blacklist-schema';

describe('ChannelEntrySchema', () => {
  it('should validate a valid channel entry', () => {
    const entry = {
      channelId: 'UC123456',
      channelName: 'Test Channel',
      addedAt: '2024-01-01T00:00:00Z',
    };
    expect(ChannelEntrySchema.safeParse(entry).success).toBe(true);
  });

  it('should validate with optional fields', () => {
    const entry = {
      channelId: 'UC123456',
      channelName: 'Test Channel',
      addedAt: '2024-01-01T00:00:00Z',
      reason: 'Private equity owned',
      handles: ['@handle'],
      customUrl: 'custom',
      historicNames: ['old'],
    };
    expect(ChannelEntrySchema.safeParse(entry).success).toBe(true);
  });

  it('should reject entry without channelId', () => {
    const entry = {
      channelName: 'Test Channel',
      addedAt: '2024-01-01T00:00:00Z',
    };
    expect(ChannelEntrySchema.safeParse(entry).success).toBe(false);
  });

  it('should reject entry with empty channelId', () => {
    const entry = {
      channelId: '',
      channelName: 'Test Channel',
      addedAt: '2024-01-01T00:00:00Z',
    };
    expect(ChannelEntrySchema.safeParse(entry).success).toBe(false);
  });

  it('should reject entry without channelName', () => {
    const entry = {
      channelId: 'UC123456',
      addedAt: '2024-01-01T00:00:00Z',
    };
    expect(ChannelEntrySchema.safeParse(entry).success).toBe(false);
  });
});

describe('BlacklistSnapshotSchema', () => {
  it('should validate a valid snapshot', () => {
    const snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
      entries: [
        { channelId: 'UC123', channelName: 'Test', addedAt: '2024-01-01T00:00:00Z' },
      ],
    };
    expect(BlacklistSnapshotSchema.safeParse(snapshot).success).toBe(true);
  });

  it('should reject snapshot without entries', () => {
    const snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig123',
    };
    expect(BlacklistSnapshotSchema.safeParse(snapshot).success).toBe(false);
  });
});

describe('ManifestSchema', () => {
  it('should validate a valid manifest', () => {
    const manifest = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      totalChannels: 100,
      entryCount: 100,
    };
    expect(ManifestSchema.safeParse(manifest).success).toBe(true);
  });

  it('should reject negative entryCount', () => {
    const manifest = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      totalChannels: 100,
      entryCount: -1,
    };
    expect(ManifestSchema.safeParse(manifest).success).toBe(false);
  });
});

describe('isValidChannelEntry', () => {
  it('should return true for valid entry', () => {
    const entry = {
      channelId: 'UC123456',
      channelName: 'Test',
      addedAt: '2024-01-01T00:00:00Z',
    };
    expect(isValidChannelEntry(entry)).toBe(true);
  });

  it('should return false for invalid entry', () => {
    expect(isValidChannelEntry({})).toBe(false);
    expect(isValidChannelEntry(null)).toBe(false);
    expect(isValidChannelEntry(undefined)).toBe(false);
  });
});

describe('isValidSnapshot', () => {
  it('should return true for valid snapshot', () => {
    const snapshot = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      signature: 'sig',
      entries: [{ channelId: 'UC1', channelName: 'A', addedAt: '2024-01-01T00:00:00Z' }],
    };
    expect(isValidSnapshot(snapshot)).toBe(true);
  });

  it('should return false for invalid snapshot', () => {
    expect(isValidSnapshot({})).toBe(false);
  });
});

describe('isValidManifest', () => {
  it('should return true for valid manifest', () => {
    const manifest = {
      version: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      totalChannels: 100,
      entryCount: 100,
    };
    expect(isValidManifest(manifest)).toBe(true);
  });

  it('should return false for invalid manifest', () => {
    expect(isValidManifest({})).toBe(false);
  });
});

describe('SCHEMA_VERSION', () => {
  it('should be defined', () => {
    expect(SCHEMA_VERSION).toBe('1.0.0');
  });
});