import { __testing } from '../../src/content/warning-banner';

describe('warning banner dismissal state', () => {
  it('removes expired dismissals based on suppression window', () => {
    const now = 1_700_000_000_000;
    const staleAt = now - __testing.SUPPRESS_DURATION_MS - 1;
    const freshAt = now - 5_000;

    const pruned = __testing.pruneDismissedChannels(
      {
        stale: { dismissedAt: staleAt },
        fresh: { dismissedAt: freshAt },
      },
      now
    );

    expect(pruned).toEqual({
      fresh: { dismissedAt: freshAt },
    });
  });

  it('keeps only the most recent dismissal entries up to the configured max', () => {
    const now = 1_700_000_000_000;
    const entries: Record<string, { dismissedAt: number }> = {};

    for (let i = 0; i < __testing.MAX_DISMISSED_CHANNELS + 25; i += 1) {
      entries[`channel-${i}`] = { dismissedAt: now - i };
    }

    const pruned = __testing.pruneDismissedChannels(entries, now);
    const keys = Object.keys(pruned);

    expect(keys).toHaveLength(__testing.MAX_DISMISSED_CHANNELS);
    expect(keys).toContain('channel-0');
    expect(keys).not.toContain(`channel-${__testing.MAX_DISMISSED_CHANNELS + 24}`);
  });
});
