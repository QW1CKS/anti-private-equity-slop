/** @jest-environment jsdom */

import {
  clearBannerState,
  isBannerVisible,
  removeInjectedBanner,
  showWarningBanner,
} from '../../src/content/warning-banner';

type StorageRecord = Record<string, unknown>;

const STORAGE_KEY = 'banner-state';

function createChromeMock() {
  const storage: StorageRecord = {};
  const sendMessage = jest.fn().mockResolvedValue(undefined);

  return {
    storage,
    chrome: {
      runtime: {
        sendMessage,
      },
      storage: {
        local: {
          get: jest.fn(async (key: string) => ({ [key]: storage[key] })),
          set: jest.fn(async (values: StorageRecord) => {
            Object.assign(storage, values);
          }),
          remove: jest.fn(async (key: string) => {
            delete storage[key];
          }),
        },
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

  it('suppresses reappearance after explicit dismiss for the same channel key', async () => {
    await showWarningBanner('Dismissed Channel', 'Ownership warning', '@dismissed');
    const dismissButton = getShadowElement('#pew-dismiss');

    dismissButton.click();
    await flush();
    jest.advanceTimersByTime(300);
    await flush();

    expect(isBannerVisible()).toBe(false);

    await showWarningBanner('Dismissed Channel', 'Ownership warning', '@dismissed');

    expect(isBannerVisible()).toBe(false);
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

  it('stores and reads dismissal data in bounded banner storage format', async () => {
    const chromeStorage = (global as unknown as {
      chrome: { storage: { local: { get: jest.Mock } } };
    }).chrome.storage.local;

    await showWarningBanner('Storage Channel', 'Ownership warning', '@storage-channel');
    getShadowElement('#pew-dismiss').click();
    jest.advanceTimersByTime(300);
    await flush();

    await showWarningBanner('Storage Channel', 'Ownership warning', '@storage-channel');

    const stored = await chromeStorage.get(STORAGE_KEY);
    expect(stored[STORAGE_KEY]).toBeDefined();
    expect(isBannerVisible()).toBe(false);
  });
});