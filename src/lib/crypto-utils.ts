import { Base64 } from 'js-base64';
/**
 * Safely decodes a Base64 string, handling URL-safe variants and potential padding issues.
 * @param encoded The Base64 encoded string.
 * @returns The decoded string, or an empty string if decoding fails.
 */
export function safeBase64Decode(encoded: string): string {
  try {
    return Base64.decode(encoded);
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return "";
  }
}
/**
 * Parses raw subscription content to extract configurations.
 * It supports advanced JSON profiles and standard line-based schemes.
 * @param content The raw string content from a subscription URL.
 * @returns An array of valid configuration strings.
 */
export function parseSubscription(content: string): string[] {
  const configs: string[] = [];
  // 1. Attempt to parse as JSON (for advanced GFW-Slayer profiles)
  try {
    const json_data = JSON.parse(content);
    if (Array.isArray(json_data)) {
      json_data.forEach(profile => {
        if (typeof profile === 'object' && profile !== null) {
          const name = profile.remarks || profile.ps || 'Advanced Profile';
          const configStr = JSON.stringify(profile, null, 2);
          configs.push(`// --- ${name} ---\n${configStr}`);
        }
      });
    }
    if (configs.length > 0) {
      return configs;
    }
  } catch (e) {
    // Not a JSON file, proceed to next methods
  }
  // 2. Attempt to decode as Base64 and parse lines
  let decodedContent = content;
  const decoded = safeBase64Decode(content);
  if (decoded && decoded !== content) {
    decodedContent = decoded;
  }
  // 3. Parse lines for standard schemes (vless://, vmess://, trojan://)
  const lines = decodedContent.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (
      trimmedLine.startsWith("vless://") ||
      trimmedLine.startsWith("vmess://") ||
      trimmedLine.startsWith("trojan://")
    ) {
      configs.push(trimmedLine);
    }
  }
  return configs;
}