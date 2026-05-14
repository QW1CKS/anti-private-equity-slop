import { __testing } from '../../src/content/warning-banner';

describe('warning banner dismissal state', () => {
  beforeEach(() => {
    __testing.clearSessionDismissals();
  });

  it('suppresses only dismissed channel keys in the current session', async () => {
    await __testing.setChannelDismissed('@example');

    await expect(__testing.isChannelDismissed('@example')).resolves.toBe(true);
    await expect(__testing.isChannelDismissed('@other')).resolves.toBe(false);
  });

  it('normalizes channel keys before storing dismissals', async () => {
    await __testing.setChannelDismissed('  @ExampleChannel  ');

    await expect(__testing.isChannelDismissed('@examplechannel')).resolves.toBe(true);
    await expect(__testing.isChannelDismissed('@ExampleChannel')).resolves.toBe(true);
    expect(__testing.getSessionDismissedCount()).toBe(1);
  });

  it('clears all dismissals when session state is reset', async () => {
    await __testing.setChannelDismissed('@channel-a');
    await __testing.setChannelDismissed('@channel-b');

    expect(__testing.getSessionDismissedCount()).toBe(2);

    __testing.clearSessionDismissals();

    expect(__testing.getSessionDismissedCount()).toBe(0);
    await expect(__testing.isChannelDismissed('@channel-a')).resolves.toBe(false);
    await expect(__testing.isChannelDismissed('@channel-b')).resolves.toBe(false);
  });

  it('clears a specific dismissed channel key', async () => {
    await __testing.setChannelDismissed('@channel-a');
    await __testing.setChannelDismissed('@channel-b');

    await __testing.clearChannelDismissed('@channel-a');

    await expect(__testing.isChannelDismissed('@channel-a')).resolves.toBe(false);
    await expect(__testing.isChannelDismissed('@channel-b')).resolves.toBe(true);
  });
});
