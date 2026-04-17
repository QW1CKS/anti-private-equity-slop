/**
 * Warning Banner - Injects a warning banner into YouTube pages using Shadow-DOM
 */

import { getMessage } from './i18n.js';

// Banner state
interface BannerState {
  isVisible: boolean;
  dismissed: boolean;
  dismissTime?: number;
}

// Storage keys for banner state
const BANNER_STORAGE_KEY = 'banner-state';

// Default suppress duration: 4 hours
const SUPPRESS_DURATION_MS = 4 * 60 * 60 * 1000;

// Current banner element reference
let bannerElement: HTMLElement | null = null;

// Initialize banner state from storage
async function getBannerState(): Promise<BannerState> {
  const result = await chrome.storage.local.get(BANNER_STORAGE_KEY);
  const stored = result[BANNER_STORAGE_KEY] as BannerState | undefined;
  
  if (!stored) {
    return { isVisible: false, dismissed: false };
  }
  
  // Check if suppress period has expired
  if (stored.dismissed && stored.dismissTime) {
    if (Date.now() - stored.dismissTime > SUPPRESS_DURATION_MS) {
      // Suppress period expired, reset state
      await chrome.storage.local.remove(BANNER_STORAGE_KEY);
      return { isVisible: false, dismissed: false };
    }
  }
  
  return stored;
}

// Save banner state to storage
async function saveBannerState(state: BannerState): Promise<void> {
  await chrome.storage.local.set({ [BANNER_STORAGE_KEY]: state });
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
export async function showWarningBanner(channelName: string, reason?: string): Promise<void> {
  // Check if banner should be suppressed
  const state = await getBannerState();
  
  if (state.dismissed && state.isVisible) {
    console.log('Banner is suppressed, not showing');
    return;
  }
  
  // Remove existing banner if any
  hideWarningBanner();
  
  // Create and insert banner
  bannerElement = createBannerElement();
  
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
    // Open extension details page
    chrome.runtime.sendMessage({ type: 'OPEN_DETAILS_PAGE' });
    hideWarningBanner();
  });
  
  const dismissHandler = () => {
    hideWarningBanner();
  };
  
  dismissBtn?.addEventListener('click', dismissHandler);
  closeBtn?.addEventListener('click', dismissHandler);
  
  // Insert into page
  document.body.appendChild(bannerElement);
  
  // Update state
  await saveBannerState({ isVisible: true, dismissed: false });
}

// Hide the warning banner
export async function hideWarningBanner(): Promise<void> {
  if (bannerElement) {
    bannerElement.remove();
    bannerElement = null;
  }
  
  // Update state to dismissed with timestamp
  await saveBannerState({ 
    isVisible: false, 
    dismissed: true, 
    dismissTime: Date.now() 
  });
}

// Check if banner is currently visible
export function isBannerVisible(): boolean {
  return bannerElement !== null;
}

// Clear banner state (for testing or reset)
export async function clearBannerState(): Promise<void> {
  await chrome.storage.local.remove(BANNER_STORAGE_KEY);
  hideWarningBanner();
}