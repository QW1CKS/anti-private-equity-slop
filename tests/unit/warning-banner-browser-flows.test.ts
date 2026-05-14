/** @jest-environment jsdom */

import {
  clearSessionDismissals,
  clearBannerState,
  isBannerVisible,
  removeInjectedBanner,
  showWarningBanner,
} from '../../src/content/warning-banner';

function createChromeMock() {
  const sendMessage = jest.fn().mockResolvedValue(undefined);

  return {
    chrome: {
      runtime: {
        sendMessage,
      },
    },
    sendMessage,
  };
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function getShadowElement(selector: string): HTMLElement {
  const host = document.getElementById('pew-warning-banner');
  expect(host).not.toBeNull();
  const shadow = host?.shadowRoot;
  expect(shadow).not.toBeNull();
  const element = shadow?.querySelector(selector) as HTMLElement | null;
  expect(element).not.toBeNull();
  return element as HTMLElement;
}

describe('warning banner browser-like flows', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
    const { chrome } = createChromeMock();
    (global as unknown as { chrome: typeof chrome }).chrome = chrome;
    await clearBannerState();
  });

  afterEach(async () => {
    removeInjectedBanner();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    await flush();
  });

  it('shows the banner for a positive-match flow', async () => {
    await showWarningBanner('Matched Channel', 'Ownership warning', '@matched');

    expect(isBannerVisible()).toBe(true);
    expect(document.getElementById('pew-warning-banner')).not.toBeNull();
  });

  it('does not show a banner for non-match flow when no warning is triggered', () => {
    expect(isBannerVisible()).toBe(false);
    expect(document.getElementById('pew-warning-banner')).toBeNull();
  });

  it('suppresses in-page reappearance after explicit dismiss for the same channel key', async () => {
    await showWarningBanner('Dismissed Channel', 'Ownership warning', '@dismissed');
    const dismissButton = getShadowElement('#pew-dismiss');

    dismissButton.click();
    await flush();
    jest.advanceTimersByTime(300);
    await flush();

    expect(isBannerVisible()).toBe(false);

    // Simulate SPA navigation reset handled by content script.
    clearSessionDismissals();

    await showWarningBanner('Dismissed Channel', 'Ownership warning', '@dismissed');

    expect(isBannerVisible()).toBe(true);
  });

  it('close action hides the UI without persisting dismissal', async () => {
    await showWarningBanner('Closable Channel', 'Ownership warning', '@close-only');
    const closeButton = getShadowElement('#pew-close');

    closeButton.click();
    jest.advanceTimersByTime(300);
    await flush();

    expect(isBannerVisible()).toBe(false);

    await showWarningBanner('Closable Channel', 'Ownership warning', '@close-only');

    expect(isBannerVisible()).toBe(true);
    expect(document.getElementById('pew-warning-banner')).not.toBeNull();
  });

  it('more-info action sends OPEN_DETAILS_PAGE and hides the banner', async () => {
    const chromeMock = (global as unknown as { chrome: { runtime: { sendMessage: jest.Mock } } }).chrome;

    await showWarningBanner('Info Channel', 'Ownership warning', '@more-info');
    const moreInfoButton = getShadowElement('#pew-more-info');

    moreInfoButton.click();
    jest.advanceTimersByTime(300);
    await flush();

    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith({ type: 'OPEN_DETAILS_PAGE' });
    expect(isBannerVisible()).toBe(false);
  });

  it('clears and re-renders correctly across SPA-like route transitions', async () => {
    await showWarningBanner('Watch Route Channel', 'Ownership warning', '@watch-route');
    expect(isBannerVisible()).toBe(true);

    removeInjectedBanner();
    expect(isBannerVisible()).toBe(false);

    await showWarningBanner('Channel Route Channel', 'Ownership warning', '@channel-route');

    expect(isBannerVisible()).toBe(true);
    const message = getShadowElement('.banner-message');
    expect(message.textContent).toContain('Channel Route Channel');
  });

  it('dismissal does not carry to a new route once navigation clears session state', async () => {
    await showWarningBanner('Route A Channel', 'Ownership warning', '@route-a');
    getShadowElement('#pew-dismiss').click();
    jest.advanceTimersByTime(300);
    await flush();

    await showWarningBanner('Route A Channel', 'Ownership warning', '@route-a');
    expect(isBannerVisible()).toBe(false);

    removeInjectedBanner();
    clearSessionDismissals();

    await showWarningBanner('Route B Channel', 'Ownership warning', '@route-a');
    expect(isBannerVisible()).toBe(true);
  });
});
