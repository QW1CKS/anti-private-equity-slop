/**
 * Warning Banner - Injects a warning banner into YouTube pages using Shadow-DOM
 */

import { getMessage } from './i18n.js';

type BannerVisibilityState = 'hidden' | 'visible' | 'exiting';

const sessionDismissedChannels = new Set<string>();

let bannerElement: HTMLElement | null = null;
let bannerVisibilityState: BannerVisibilityState = 'hidden';

function normalizeChannelKey(channelKey?: string): string {
  return (channelKey || '').trim().toLowerCase();
}

async function isChannelDismissed(channelKey?: string): Promise<boolean> {
  const normalizedKey = normalizeChannelKey(channelKey);
  if (!normalizedKey) {
    return false;
  }

  return sessionDismissedChannels.has(normalizedKey);
}

async function setChannelDismissed(channelKey?: string): Promise<void> {
  const normalizedKey = normalizeChannelKey(channelKey);
  if (!normalizedKey) {
    return;
  }

  sessionDismissedChannels.add(normalizedKey);
}

async function clearChannelDismissed(channelKey?: string): Promise<void> {
  const normalizedKey = normalizeChannelKey(channelKey);
  if (!channelKey) {
    sessionDismissedChannels.clear();
    return;
  }
  if (normalizedKey) {
    sessionDismissedChannels.delete(normalizedKey);
  }
}

// Create the warning banner using Shadow-DOM for isolation (dark mode only)
function createBannerElement(): HTMLElement {
  const container = document.createElement('div');
  container.id = 'pew-warning-banner';
  
  // Attach Shadow-DOM for style isolation (open for testability)
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Create styles (dark theme only)
  const style = document.createElement('style');
  style.textContent = `
    :host {
      --pew-banner-bg: #1f1f1f;
      --pew-banner-accent: #ff6b6b;
      --pew-banner-border: #2b2b2b;
      --pew-banner-text: #f1f1f1;
      --pew-banner-text-muted: #b3b3b3;
      --pew-banner-shadow: rgba(0, 0, 0, 0.6);
      --pew-banner-radius: 12px;
      --pew-button-bg: #f1f1f1;
      --pew-button-hover: #e6e6e6;
      --pew-button-text: #1f1f1f;
    }
    
    .banner {
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      max-width: 580px;
      width: 90%;
      background: var(--pew-banner-bg);
      border: 2px solid var(--pew-banner-accent);
      border-radius: var(--pew-banner-radius);
      padding: 18px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      box-shadow: 0 8px 24px var(--pew-banner-shadow), 0 2px 8px rgba(0, 0, 0, 0.04);
      animation: pew-slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes pew-slide-down {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-16px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    @keyframes pew-exit {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-12px);
      }
    }
    
    .banner.exiting {
      animation: pew-exit 0.25s ease-in forwards;
    }
    
    .banner-content {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    
    .banner-icon {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      color: var(--pew-banner-accent);
      margin-top: 2px;
      animation: pew-icon-pulse 2s ease-in-out infinite;
    }
    
    @keyframes pew-icon-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.08);
      }
    }
    
    .banner-icon svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    .banner-text {
      flex: 1;
      color: var(--pew-banner-text);
      font-size: 14px;
      line-height: 1.6;
    }
    
    .banner-title {
      font-weight: 600;
      margin: 0 0 6px 0;
      font-size: 15px;
      color: var(--pew-banner-text);
      letter-spacing: -0.01em;
      animation: pew-fade-in 0.4s ease-out 0.1s both;
    }
    
    @keyframes pew-fade-in {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .banner-message {
      margin: 0;
      color: var(--pew-banner-text-muted);
      font-size: 13px;
      line-height: 1.55;
      animation: pew-fade-in 0.4s ease-out 0.15s both;
    }
    
    .banner-actions {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      animation: pew-fade-in 0.4s ease-out 0.2s both;
    }
    
    .banner-button {
      background: var(--pew-button-bg);
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      color: var(--pew-button-text);
      transition: all 0.2s ease;
      font-family: inherit;
    }
    
    .banner-button:hover {
      background: var(--pew-button-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .banner-button:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    
    .banner-button.secondary:active {
      background: var(--pew-banner-border);
      transform: scale(0.98);
    }
    
    .banner-button:focus {
      outline: 2px solid var(--pew-banner-accent);
      outline-offset: 2px;
    }
    
    .banner-button.secondary {
      background: transparent;
      color: var(--pew-banner-text-muted);
      border: 1px solid var(--pew-banner-border);
    }
    
    .banner-button.secondary:hover {
      background: var(--pew-banner-border);
      color: var(--pew-banner-text);
      box-shadow: none;
      transform: none;
    }
    
    .banner-dismiss {
      flex-shrink: 0;
      background: transparent;
      border: none;
      padding: 6px;
      cursor: pointer;
      color: var(--pew-banner-text-muted);
      opacity: 0.5;
      transition: all 0.2s ease;
      border-radius: 6px;
      margin: -4px -4px -4px 0;
    }
    
    .banner-dismiss:hover {
      opacity: 1;
      background: var(--pew-banner-border);
    }
    
    .banner-dismiss:focus {
      outline: 2px solid var(--pew-banner-accent);
      outline-offset: 2px;
    }
    
    .banner-dismiss svg {
      width: 20px;
      height: 20px;
      display: block;
    }
    
    @media (max-width: 480px) {
      .banner {
        top: 50px;
        padding: 14px 16px;
      }
      
      .banner-icon {
        width: 24px;
        height: 24px;
      }
      
      .banner-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .banner-button {
        width: 100%;
        text-align: center;
      }
    }
  `;
  
  // Create static HTML content and inject text via textContent to avoid HTML injection.
  const bannerHTML = `
    <div class="banner" role="alert" aria-labelledby="pew-banner-title" aria-describedby="pew-banner-message">
      <div class="banner-content">
        <svg class="banner-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <div class="banner-text">
          <p class="banner-title" id="pew-banner-title"></p>
          <p class="banner-message" id="pew-banner-message"></p>
          <div class="banner-actions">
            <button class="banner-button secondary" id="pew-more-info"></button>
            <button class="banner-button secondary" id="pew-dismiss"></button>
          </div>
        </div>
        <button class="banner-dismiss" id="pew-close" aria-label="">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  shadow.appendChild(style);
  shadow.innerHTML += bannerHTML;

  const titleEl = shadow.getElementById('pew-banner-title');
  if (titleEl) {
    titleEl.textContent = getMessage('banner_title');
  }
  const moreInfoEl = shadow.getElementById('pew-more-info');
  if (moreInfoEl) {
    moreInfoEl.textContent = getMessage('more_info');
  }
  const dismissEl = shadow.getElementById('pew-dismiss');
  if (dismissEl) {
    dismissEl.textContent = getMessage('dismiss');
  }
  const closeEl = shadow.getElementById('pew-close');
  if (closeEl) {
    closeEl.setAttribute('aria-label', getMessage('close'));
  }
  
  return container;
}

// Show the warning banner
export async function showWarningBanner(channelName: string, reason?: string, channelKey?: string): Promise<void> {
  // If this channel was explicitly dismissed in this page session, do not show.
  if (await isChannelDismissed(channelKey)) {
    console.log('Banner is suppressed for', channelKey, 'not showing');
    return;
  }

  // Remove existing banner DOM-only (do not persist dismissal)
  try { await hideWarningBanner(false); } catch (e) { /* ignore */ }

  // Create and insert banner
  bannerElement = createBannerElement();
  bannerVisibilityState = 'visible';

  // Set message with channel name
  const messageEl = bannerElement.shadowRoot?.querySelector('.banner-message');
  if (messageEl) {
    const reasonText = reason ? ` ${reason}` : '';
    messageEl.textContent = `${getMessage('banner_message', { channel: channelName })}${reasonText}`;
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

}

// Hide the warning banner
export async function hideWarningBanner(persist = false, channelKey?: string): Promise<void> {
  if (bannerElement) {
    const banner = bannerElement;
    const shadowRoot = banner.shadowRoot;
    const innerBanner = shadowRoot?.querySelector('.banner') as HTMLElement;
    bannerVisibilityState = 'exiting';
    
    // Apply exit animation if element exists
    if (innerBanner) {
      innerBanner.classList.add('exiting');
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    try { banner.remove(); } catch { /* ignore */ }
    bannerElement = null;
    bannerVisibilityState = 'hidden';
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
  return bannerElement !== null && bannerVisibilityState === 'visible';
}

// Clear banner state (for testing or reset)
export async function clearBannerState(): Promise<void> {
  await clearChannelDismissed();
  try { await hideWarningBanner(false); } catch (e) { /* ignore */ }
}

// Reset per-session dismissal state, typically on SPA route transitions.
export function clearSessionDismissals(): void {
  sessionDismissedChannels.clear();
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
    bannerVisibilityState = 'hidden';
  }
}

export const __testing = {
  isChannelDismissed,
  setChannelDismissed,
  clearChannelDismissed,
  clearSessionDismissals,
  normalizeChannelKey,
  getSessionDismissedCount: () => sessionDismissedChannels.size,
};
