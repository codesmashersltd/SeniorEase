import { useEffect } from 'react';

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // Helper to update or create meta tags
    const setMeta = (selector: string, attribute: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const match = selector.match(/name="([^"]+)"/);
          if (match) el.setAttribute('name', match[1]);
        } else if (selector.startsWith('meta[property=')) {
          const match = selector.match(/property="([^"]+)"/);
          if (match) el.setAttribute('property', match[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    // 2. Update Standard & Open Graph Descriptions
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:description"]', 'content', description);

    // 3. Update Open Graph Title & URL
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:url"]', 'content', window.location.href);
  }, [title, description]);
}
