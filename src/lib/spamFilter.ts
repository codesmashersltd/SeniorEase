/**
 * Utility to detect promotional, SEO, marketing, and automated spam in support ticket enquiries.
 * This ensures that admin panels do not receive promotional pitches or spam messages.
 */

const SPAM_KEYWORDS = [
  'seo',
  'aeo',
  'geo',
  'search engine optimization',
  'answer engine optimization',
  'generative engine optimization',
  'rank on google',
  'ranking on google',
  'discoverable on ai',
  'chatgpt',
  'perplexity',
  'claude',
  'link building',
  'backlinks',
  'domain authority',
  'website traffic',
  'organic traffic',
  'web platform expertise',
  'squarespace',
  'shopify',
  'wix',
  'wordpress',
  'godaddy',
  'digital agency',
  'marketing agency',
  'boost your traffic',
  'guaranteed ranking',
  'lead generation service',
  'we help businesses rank',
  'potential in your website',
  'denis berger',
  'rank not only on google',
  'ai platforms like chatgpt',
  'website & business'
];

/**
 * Checks if the provided text or object data matches known SEO/marketing promotional spam patterns.
 * @param input Text string or data object representing ticket fields
 * @returns true if spam/promotional content is detected
 */
export function isSpamContent(input: any): boolean {
  if (!input) return false;
  
  let textToCheck = '';
  if (typeof input === 'string') {
    textToCheck = input.toLowerCase();
  } else if (typeof input === 'object') {
    textToCheck = Object.entries(input)
      .map(([key, val]) => {
        // Exclude internal metadata IDs if needed, but check text content
        if (typeof val === 'string') return val.toLowerCase();
        return '';
      })
      .join(' ');
  }

  if (!textToCheck.trim()) return false;

  for (const keyword of SPAM_KEYWORDS) {
    // We check substring matching for spam terms
    if (textToCheck.includes(keyword.toLowerCase())) {
      console.warn(`[Spam Filter] Flagged content containing keyword: "${keyword}"`);
      return true;
    }
  }

  return false;
}
