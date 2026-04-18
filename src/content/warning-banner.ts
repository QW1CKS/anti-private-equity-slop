/**
 * Warning Banner - Injects a warning banner into YouTube pages using Shadow-DOM
 */

import { getMessage } from './i18n.js';

// New banner storage shape (per-channel dismissals)
interface BannerStorage {
  visibleChannel?: string | null;
  dismissedChannels?: Record<string, { dismissed: boolean; dismissTime: number }>;
}

// Storage key
const BANNER_STORAGE_KEY = 'banner-state';

// Default suppress duration: 4 hours
const SUPPRESS_DURATION_MS = 4 * 60 * 60 * 1000;

let bannerElement: HTMLElement | null = null;
let currentChannelKey: string | undefined;

async function getBannerStorage(): Promise<BannerStorage> {
  try {
    const result = await chrome.storage.local.get(BANNER_STORAGE_KEY);
    const stored = result[BANNER_STORAGE_KEY] as BannerStorage | undefined;
    // Option B: ignore legacy global dismissal shape and return fresh object if not present
    if (!stored || typeof stored !== 'object') return {};
    return stored;
  } catch (err) {
    console.warn('Failed to read banner storage (extension context may be invalidated):', err);
    return {};
  }
}

async function saveBannerStorage(storage: BannerStorage): Promise<void> {
  try {
    await chrome.storage.local.set({ [BANNER_STORAGE_KEY]: storage });
  } catch (err) {
    console.warn('Failed to save banner storage (extension context may be invalidated):', err);
  }
}

async function isChannelDismissed(channelKey?: string): Promise<boolean> {
  if (!channelKey) return false;
  const storage = await getBannerStorage();
  const entry = storage.dismissedChannels?.[channelKey];
  if (!entry) return false;
  if (entry.dismissed && entry.dismissTime) {
    if (Date.now() - entry.dismissTime > SUPPRESS_DURATION_MS) {
      // expired - remove and persist
      try {
        delete (storage.dismissedChannels as Record<string, any>)[channelKey];
        await saveBannerStorage(storage);
      } catch (e) {
        // ignore
      }
      return false;
    }
    return entry.dismissed === true;
  }
  return false;
}

async function setChannelDismissed(channelKey?: string): Promise<void> {
  if (!channelKey) return;
  const storage = await getBannerStorage();
  storage.dismissedChannels = storage.dismissedChannels || {};
  storage.dismissedChannels[channelKey] = { dismissed: true, dismissTime: Date.now() };
  await saveBannerStorage(storage);
}

async function clearChannelDismissed(channelKey?: string): Promise<void> {
  if (!channelKey) {
    try {
      await chrome.storage.local.remove(BANNER_STORAGE_KEY);
    } catch (err) {
      console.warn('clearBannerState: failed to remove storage key:', err);
    }
    return;
  }
  const storage = await getBannerStorage();
  if (storage.dismissedChannels && storage.dismissedChannels[channelKey]) {
    delete storage.dismissedChannels[channelKey];
    await saveBannerStorage(storage);
  }
}

// Create the warning banner using Shadow-DOM for isolation
function createBannerElement(): HTMLElement {
  const container = document.createElement('div');
  container.id = 'pew-warning-banner';
  
  // Attach Shadow-DOM for style isolation (open for testability)
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Create styles
  const style = document.createElement('style');
  style.textContent = `
    :host {
      --pew-banner-bg: #fef3cd;
      --pew-banner-border: #ffc107;
      --pew-banner-text: #664d03;
      --pew-banner-icon: #856404;
      --pew-banner-dismiss: #664d03;
    }
    
    .banner {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      max-width: 600px;
      width: 90%;
      background: var(--pew-banner-bg);
      border: 1px solid var(--pew-banner-border);
      border-radius: 8px;
      padding: 16px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: pew-slide-down 0.3s ease-out;
    }
    
    @keyframes pew-slide-down {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    .banner-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .banner-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: var(--pew-banner-icon);
    }
    
    .banner-text {
      flex: 1;
      color: var(--pew-banner-text);
      font-size: 14px;
      line-height: 1.5;
    }
    
    .banner-title {
      font-weight: 600;
      margin: 0 0 4px 0;
      font-size: 15px;
    }
    
    .banner-message {
      margin: 0;
    }
    
    .banner-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    
    .banner-button {
      background: transparent;
      border: 1px solid var(--pew-banner-border);
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      color: var(--pew-banner-text);
      transition: background-color 0.2s, border-color 0.2s;
    }
    
    .banner-button:hover {
      background: rgba(255, 193, 7, 0.2);
      border-color: var(--pew-banner-icon);
    }
    
    .banner-button:focus {
      outline: 2px solid var(--pew-banner-border);
      outline-offset: 2px;
    }
    
    .banner-dismiss {
      flex-shrink: 0;
      background: transparent;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--pew-banner-dismiss);
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    
    .banner-dismiss:hover {
      opacity: 1;
    }
    
    .banner-dismiss:focus {
      outline: 2px solid var(--pew-banner-border);
      outline-offset: 2px;
    }
    
    .banner-dismiss svg {
      width: 18px;
      height: 18px;
      display: block;
    }
  `;
  
  // Create HTML content
  const bannerHTML = `
    <div class="banner" role="alert" aria-labelledby="pew-banner-title" aria-describedby="pew-banner-message">
      <div class="banner-content">
        <svg class="banner-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <div class="banner-text">
          <p class="banner-title" id="pew-banner-title">${getMessage('banner_title')}</p>
          <p class="banner-message" id="pew-banner-message"></p>
          <div class="banner-actions">
            <button class="banner-button" id="pew-more-info">${getMessage('more_info')}</button>
            <button class="banner-button" id="pew-dismiss">${getMessage('dismiss')}</button>
          </div>
        </div>
        <button class="banner-dismiss" id="pew-close" aria-label="${getMessage('close')}">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  shadow.appendChild(style);
  shadow.innerHTML += bannerHTML;
  
  return container;
}

// Show the warning banner
export async function showWarningBanner(channelName: string, reason?: string, channelKey?: string): Promise<void> {
  // If this channel was explicitly dismissed recently, do not show
  if (await isChannelDismissed(channelKey)) {
    console.log('Banner is suppressed for', channelKey, 'not showing');
    return;
  }

  // Remove existing banner DOM-only (do not persist dismissal)
  try { await hideWarningBanner(false); } catch (e) { /* ignore */ }

  // Create and insert banner
  bannerElement = createBannerElement();
  currentChannelKey = channelKey;

  // Set message with channel name
  const messageEl = bannerElement.shadowRoot?.querySelector('.banner-message');
  if (messageEl) {
    const reasonText = reason ? ` ${reason}` : '';
    messageEl.textContent = `${getMessage('banner_message').replace('{channel}', channelName)}${reasonText}`;
  }

  // Add event listeners
  const moreInfoBtn = bannerElement.shadowRoot?.getElementById('pew-more-info');
  const dismissBtn = bannerElement.shadowRoot?.getElementById('pew-dismiss');
  const closeBtn = bannerElement.shadowRoot?.getElementById('pew-close');

  moreInfoBtn?.addEventListener('click', () => {
    try {
      const p = chrome.runtime.sendMessage({ type: 'OPEN_DETAILS_PAGE' });
      if (p && typeof (p as Promise<unknown>).catch === 'function') {
        (p as Promise<unknown>).catch(() => {});
      }
    } catch (err) {
      console.warn('Failed to send OPEN_DETAILS_PAGE message (extension may be reloading):', err);
    }
    // DOM-only hide
    void hideWarningBanner(false);
  });

  const dismissHandler = async () => {
    try {
      await setChannelDismissed(channelKey);
    } catch (err) {
      console.warn('Failed to persist dismissal:', err);
    }
    void hideWarningBanner(false);
  };

  // Persist only when the user clicks the explicit dismiss button.
  dismissBtn?.addEventListener('click', dismissHandler);
  // Close (X) should only hide DOM and NOT persist dismissal to avoid accidental "don't show again".
  closeBtn?.addEventListener('click', () => { void hideWarningBanner(false); });

  // Insert into page
  document.body.appendChild(bannerElement);

  // Optionally track visible channel in storage (non-critical)
  try {
    const s = await getBannerStorage();
    s.visibleChannel = channelKey || channelName;
    await saveBannerStorage(s);
  } catch (err) {
    // ignore storage errors
  }
}

// Hide the warning banner
export async function hideWarningBanner(persist = false, channelKey?: string): Promise<void> {
  if (bannerElement) {
    try { bannerElement.remove(); } catch { /* ignore */ }
    bannerElement = null;
    currentChannelKey = undefined;
  }

  if (persist && channelKey) {
    try {
      await setChannelDismissed(channelKey);
    } catch (err) {
      console.warn('hideWarningBanner: setChannelDismissed failed:', err);
    }
  }
}

// Check if banner is currently visible
export function isBannerVisible(): boolean {
  return bannerElement !== null;
}

// Clear banner state (for testing or reset)
export async function clearBannerState(): Promise<void> {
  await clearChannelDismissed();
  try { await hideWarningBanner(false); } catch (e) { /* ignore */ }
}

// Remove injected banner element without updating persisted dismissal state.
// Useful when the page navigates (SPA) and we need to clear DOM-only UI.
export function removeInjectedBanner(): void {
  if (bannerElement) {
    try {
      bannerElement.remove();
    } catch (err) {
      // ignore
    }
    bannerElement = null;
  }
}

// Dev helpers (exposed for debugging in content script console)
try {
  (window as any).__APE_getBannerStorage = async () => await getBannerStorage();
  (window as any).__APE_clearBannerForKey = async (key?: string) => await clearChannelDismissed(key);
} catch (e) {
  // ignore in non-window contexts
}