import { getMessage, getMessages, setLocale, getCurrentLocale } from '../../src/content/i18n';

describe('content i18n helpers', () => {
  it('returns fallback english message when key exists', () => {
    expect(getMessage('banner_title')).toBe('Private Equity Channel Warning');
  });

  it('returns key when a message does not exist', () => {
    expect(getMessage('missing_key_example')).toBe('missing_key_example');
  });

  it('replaces template parameters in localized messages', () => {
    expect(getMessage('banner_message', { channel: 'Example Channel' })).toBe(
      "This channel 'Example Channel' is owned by private equity."
    );
  });

  it('keeps locale unchanged when setting an unavailable locale', () => {
    const before = getCurrentLocale();
    setLocale('xx');
    expect(getCurrentLocale()).toBe(before);
  });

  it('returns current locale catalog from getMessages', () => {
    const messages = getMessages();
    expect(messages.banner_title).toBe('Private Equity Channel Warning');
  });
});
