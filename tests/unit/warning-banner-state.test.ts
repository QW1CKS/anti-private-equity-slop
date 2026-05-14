import { __testing } from '../../src/content/warning-banner';

describe('warning banner dismissal state', () => {
  beforeEach(() => {
    __testing.clearSessionDismissals();
  });

  it('suppresses only dismissed channel keys in the current session', () => {
    __testing.setChannelDismissed('@example');

    expect(__testing.isChannelDismissed('@example')).toBe(true);
    expect(__testing.isChannelDismissed('@other')).toBe(false);
  });

  it('normalizes channel keys before storing dismissals', () => {
    __testing.setChannelDismissed('  @ExampleChannel  ');

    expect(__testing.isChannelDismissed('@examplechannel')).toBe(true);
    expect(__testing.isChannelDismissed('@ExampleChannel')).toBe(true);
    expect(__testing.getSessionDismissedCount()).toBe(1);
  });

  it('clears all dismissals when session state is reset', () => {
    __testing.setChannelDismissed('@channel-a');
    __testing.setChannelDismissed('@channel-b');

    expect(__testing.getSessionDismissedCount()).toBe(2);

    __testing.clearSessionDismissals();

    expect(__testing.getSessionDismissedCount()).toBe(0);
    expect(__testing.isChannelDismissed('@channel-a')).toBe(false);
    expect(__testing.isChannelDismissed('@channel-b')).toBe(false);
  });

  it('clears a specific dismissed channel key', () => {
    __testing.setChannelDismissed('@channel-a');
    __testing.setChannelDismissed('@channel-b');

    __testing.clearChannelDismissed('@channel-a');

    expect(__testing.isChannelDismissed('@channel-a')).toBe(false);
    expect(__testing.isChannelDismissed('@channel-b')).toBe(true);
  });
});
