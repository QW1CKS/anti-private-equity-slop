/**
 * Blacklist Sync - Remote blacklist synchronization with ETag caching
 */

import { isValidSnapshot } from '../shared/blacklist-schema.js';
import type { BlacklistSnapshot } from '../shared/blacklist-schema.js';
import { STORAGE_KEYS } from '../shared/types.js';
import { BLACKLIST_RAW_URL } from '../shared/config.js';

// Storage interface wrapper
async function getStorage<T>(key: string): Promise<T | null> {
  try {
    const result = await chrome.storage.local.get(key) as Record<string, T>;
    return result[key] ?? null;
  } catch (err) {
    console.warn('getStorage: chrome.storage.local.get failed:', err);
    return null;
  }
}

async function setStorage<T>(key: string, value: T): Promise<void> {
  try {
    await chrome.storage.local.set({ [key]: value });
  } catch (err) {
    console.warn('setStorage: chrome.storage.local.set failed:', err);
  }
}

// Fetch with ETag support
async function fetchWithETag(
  url: string,
  etag?: string
): Promise<{ data: unknown; etag?: string; notModified: boolean }> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (etag) {
    headers['If-None-Match'] = etag;
  }

  const response = await fetch(url, { headers });

  if (response.status === 304) {
    return { data: null, etag, notModified: true };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const newEtag = response.headers.get('ETag') || etag;
  const data = await response.json();

  return { data, etag: newEtag, notModified: false };
}

// Verify signature (simplified - in production use proper crypto)
async function verifySignature(
  data: unknown,
  _signature: string,
  _publicKey: string
): Promise<boolean> {
  // TODO: Implement proper Ed25519 or RSA signature verification
  // For now, just check signature format
  if (!_signature || _signature.length < 10) {
    return false;
  }
  
  // Placeholder: accept any signature for demo
  // Real implementation would:
  // 1. Fetch public key from API_ENDPOINTS.SIGNATURE_PUBLIC_KEY
  // 2. Verify signature using Web Crypto API
  console.log('Signature verification (placeholder):', _signature.substring(0, 20) + '...');
  return true;
}

// Fetch the raw blacklist JSON from a GitHub raw URL (configured in src/shared/config.ts)
async function fetchSnapshotFromRawUrl(): Promise<BlacklistSnapshot | null> {
  if (!BLACKLIST_RAW_URL || BLACKLIST_RAW_URL.includes('USERNAME')) {
    console.warn('BLACKLIST_RAW_URL is not configured; skipping remote fetch');
    return null;
  }

  try {
    const { data, etag, notModified } = await fetchWithETag(
      BLACKLIST_RAW_URL,
      await getStorage<string>(STORAGE_KEYS.ETAG) ?? undefined
    );

    if (notModified) {
      return null;
    }

    if (!isValidSnapshot(data)) {
      console.error('Invalid snapshot format from raw URL');
      return null;
    }

    if (etag) {
      await setStorage(STORAGE_KEYS.ETAG, etag);
    }

    return data as BlacklistSnapshot;
  } catch (error) {
    console.error('Failed to fetch snapshot from raw URL:', error);
    return null;
  }
}

// Get current blacklist from storage
export async function getBlacklist(): Promise<BlacklistSnapshot | null> {
  return await getStorage<BlacklistSnapshot>(STORAGE_KEYS.BLACKLIST);
}

// Get cached version info
export async function getCachedVersion(): Promise<string | null> {
  const blacklist = await getBlacklist();
  return blacklist?.version ?? null;
}

// Sync blacklist from remote
export async function syncBlacklist(force = false): Promise<{
  success: boolean;
  updated: boolean;
  cached: boolean;
  version?: string;
  error?: string;
}> {
  try {
    // Try to fetch a snapshot from the configured raw GitHub URL
    const snapshot = await fetchSnapshotFromRawUrl();

    if (!snapshot) {
      // Nothing updated or fetch failed; return cached state
      const cached = await getBlacklist();
      return {
        success: true,
        updated: false,
        cached: !!cached,
        version: cached?.version,
      };
    }

    // Store new snapshot
    await setStorage(STORAGE_KEYS.BLACKLIST, snapshot);
    await setStorage(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    return {
      success: true,
      updated: true,
      cached: false,
      version: snapshot.version,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Blacklist sync failed:', errorMessage);

    const cached = await getBlacklist();
    return {
      success: false,
      updated: false,
      cached: !!cached,
      version: cached?.version,
      error: errorMessage,
    };
  }
}

// Stale-while-revalidate: return cached immediately, update in background
export async function getBlacklistWithRevalidate(): Promise<{
  blacklist: BlacklistSnapshot | null;
  isStale: boolean;
}> {
  const cached = await getBlacklist();

  // Trigger background sync
  syncBlacklist().then((result) => {
    if (result.updated) {
      console.log('Blacklist updated to version:', result.version);
    }
  });

  // Determine if cached data is stale (older than 24 hours)
  const lastSyncStr = await getStorage<string>(STORAGE_KEYS.LAST_SYNC);
  const lastSyncTime = lastSyncStr ? new Date(lastSyncStr).getTime() : 0;

  const staleThreshold = 24 * 60 * 60 * 1000; // 24 hours
  const isStale = Date.now() - lastSyncTime > staleThreshold;

  return { blacklist: cached, isStale };
}