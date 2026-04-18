/**
 * Blacklist Schema - Lightweight runtime validation and TypeScript types
 *
 * Note: This file avoids runtime dependencies so it can run inside the
 * extension service worker without bundling external libraries.
 */

// TypeScript types
export interface ChannelEntry {
  channelId?: string;
  channelName: string;
  addedAt: string; // ISO date
  reason?: string;
  handles?: string[];
  customUrl?: string;
  historicNames?: string[];
}

export interface BlacklistSnapshot {
  version: string;
  updatedAt: string; // ISO date
  signature: string;
  entries: ChannelEntry[];
}

export interface Manifest {
  version: string;
  updatedAt: string;
  totalChannels: number;
  entryCount: number;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isISODateString(v: unknown): boolean {
  if (!isNonEmptyString(v)) return false;
  const d = new Date(v as string);
  return !Number.isNaN(d.getTime());
}

// Validation functions (lightweight and permissive)
export function isValidChannelEntry(entry: unknown): entry is ChannelEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;

  // Require at least one stable identifier: channelId, handles, or customUrl
  const hasChannelId = isNonEmptyString(e.channelId);
  const hasHandles = Array.isArray(e.handles) && (e.handles as unknown[]).length > 0;
  const hasCustomUrl = isNonEmptyString(e.customUrl);
  if (!hasChannelId && !hasHandles && !hasCustomUrl) return false;

  if (!isNonEmptyString(e.channelName)) return false;
  if (!isISODateString(e.addedAt)) return false;
  if (e.reason !== undefined && typeof e.reason !== 'string') return false;
  if (e.handles !== undefined && !Array.isArray(e.handles)) return false;
  if (e.customUrl !== undefined && typeof e.customUrl !== 'string') return false;
  if (e.historicNames !== undefined && !Array.isArray(e.historicNames)) return false;
  return true;
}

export function isValidSnapshot(data: unknown): data is BlacklistSnapshot {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (!isNonEmptyString(d.version)) return false;
  if (!isISODateString(d.updatedAt)) return false;
  if (!isNonEmptyString(d.signature)) return false;
  if (!Array.isArray(d.entries)) return false;
  for (const entry of d.entries) {
    if (!isValidChannelEntry(entry)) return false;
  }
  return true;
}

export function isValidManifest(data: unknown): data is Manifest {
  if (typeof data !== 'object' || data === null) return false;
  const m = data as Record<string, unknown>;
  if (!isNonEmptyString(m.version)) return false;
  if (!isISODateString(m.updatedAt)) return false;
  if (typeof m.totalChannels !== 'number' || !Number.isInteger(m.totalChannels) || m.totalChannels < 0)
    return false;
  if (typeof m.entryCount !== 'number' || !Number.isInteger(m.entryCount) || m.entryCount < 0) return false;
  return true;
}

// Schema version for forward compatibility
export const SCHEMA_VERSION = '1.0.0';