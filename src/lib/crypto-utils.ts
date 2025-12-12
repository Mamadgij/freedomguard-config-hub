import { Base64 } from 'js-base64';
/**
 * Safely decodes a Base64 string, handling URL-safe variants and potential padding issues.
 * @param encoded The Base64 encoded string.
 * @returns The decoded string, or an empty string if decoding fails.
 */
export function safeBase64Decode(encoded: string): string {
  try {
    // js-base64's decode method is robust enough to handle most common cases,
    // including standard, URL-safe, and unpadded strings.
    return Base64.decode(encoded);
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return "";
  }
}
/**
 * Parses raw subscription content to extract valid configuration links.
 * @param content The raw string content from a subscription URL.
 * @returns An array of valid configuration strings (vless://, vmess://, trojan://).
 */
export function parseConfig(content: string): string[] {
  const lines = content.split(/[\r\n]+/);
  const configs: string[] = [];
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