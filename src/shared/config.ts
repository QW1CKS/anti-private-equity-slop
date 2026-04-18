/**
 * Runtime configuration for blacklist source.
 *
 * Update `BLACKLIST_RAW_URL` to point to your repository's raw blacklist JSON file.
 * Example raw URL format:
 * https://raw.githubusercontent.com/<owner>/<repo>/main/blacklist.json
 */
export const BLACKLIST_RAW_URL =
  'https://raw.githubusercontent.com/QW1CKS/anti-private-equity-slop/main/blacklist.json';

// Optionally add a public key URL for signature verification in future
export const SIGNATURE_PUBLIC_KEY_URL = '';
