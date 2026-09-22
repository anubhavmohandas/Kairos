/**
 * Kairos YouTube Backend Service
 * Real YouTube Data API v3 integration for dynamic video search and discovery.
 * Falls back to curated high-authority content when API is unavailable.
 */

export class YouTubeBackendService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || '';
    this.searchEndpoint = 'https://www.googleapis.com/youtube/v3/search';
    this.videosEndpoint = 'https://www.googleapis.com/youtube/v3/videos';
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  /**
   * Search YouTube for the best educational cybersecurity video for a given query.
   * Uses YouTube Data API v3 if key is present, falls back to curated map otherwise.
   */
  async searchVideo(query) {
    const cleanQuery = (query || 'cybersecurity defense fundamentals').trim();

    if (this.hasApiKey()) {
      try {
        // Step 1: Search for videos
        const searchUrl = new URL(this.searchEndpoint);
        searchUrl.searchParams.set('key', this.apiKey);
        searchUrl.searchParams.set('q', cleanQuery + ' cybersecurity tutorial');
        searchUrl.searchParams.set('part', 'snippet');
        searchUrl.searchParams.set('type', 'video');
        searchUrl.searchParams.set('maxResults', '5');
        searchUrl.searchParams.set('order', 'relevance');
        searchUrl.searchParams.set('videoDuration', 'medium'); // 4-20 min
        searchUrl.searchParams.set('relevanceLanguage', 'en');
        searchUrl.searchParams.set('safeSearch', 'strict');

        const searchRes = await fetch(searchUrl.toString());
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const items = searchData.items || [];

          if (items.length > 0) {
            const topItem = items[0];
            const videoId = topItem.id?.videoId;
            const snippet = topItem.snippet || {};

            // Step 2: Get video duration from contentDetails
            let duration = '10:00';
            try {
              const videoUrl = new URL(this.videosEndpoint);
              videoUrl.searchParams.set('key', this.apiKey);
              videoUrl.searchParams.set('id', videoId);
              videoUrl.searchParams.set('part', 'contentDetails,statistics');

              const videoRes = await fetch(videoUrl.toString());
              if (videoRes.ok) {
                const videoData = await videoRes.json();
                const rawDuration = videoData.items?.[0]?.contentDetails?.duration || 'PT10M0S';
                duration = this.parseDuration(rawDuration);
              }
            } catch (e) {
              console.warn('Could not fetch video details:', e);
            }

            return {
              query: cleanQuery,
              videoId,
              title: snippet.title || `${cleanQuery}: Masterclass`,
              channel: snippet.channelTitle || 'Security Tutorial',
              duration,
              thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
              publishedAt: snippet.publishedAt || '',
              cheatSheet: [
                `Understand the fundamental attack mechanics behind ${cleanQuery}.`,
                'Verify origin domain, cryptographic signatures, and access tokens.',
                'Apply defense-in-depth policies and least-privilege configurations.'
              ],
              cheatSheetHinglish: [
                `${cleanQuery} ke core attack mechanics ko pehle samjho.`,
                'Origin domain aur cryptographic signatures ko hamesha verify karo.',
                'Defense-in-depth aur least-privilege rules follow karo.'
              ],
              microNotes: [
                { time: '01:15', note: `Anatomy of ${cleanQuery} in real-world infrastructure.`, noteHinglish: `Production mein attack kaise execute hota hai.` },
                { time: '06:30', note: 'Mitigation strategies and forensic detection rules.', noteHinglish: `Detection aur hardening ke practical steps.` }
              ],
              source: 'youtube_api'
            };
          }
        }
      } catch (e) {
        console.warn('YouTube API search failed, falling back to curated content:', e.message);
      }
    }

    // Fallback: curated high-authority cybersecurity content
    return this.getCuratedFallback(cleanQuery);
  }

  /**
   * Parse ISO 8601 duration (PT12M30S) to human-readable (12:30)
   */
  parseDuration(iso) {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '10:00';
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  getCuratedFallback(query) {
    const qLower = query.toLowerCase();
    let videoId = 'Vf6L2x5zHbg';
    let channel = 'NetworkChuck';
    let duration = '12:30';
    let title = `${query}: Masterclass`;

    if (qLower.includes('email') || qLower.includes('dmarc') || qLower.includes('spf') || qLower.includes('phish')) {
      videoId = 'sO4x9_GkXjA'; channel = 'PowerDMARC'; duration = '09:15';
      title = 'Email Authentication & DMARC Explained';
    } else if (qLower.includes('mfa') || qLower.includes('fatigue') || qLower.includes('reverse proxy')) {
      videoId = '7a0v24w_ZqI'; channel = 'John Hammond'; duration = '14:08';
      title = 'MFA Bypass Techniques & Defense';
    } else if (qLower.includes('jwt') || qLower.includes('token') || qLower.includes('auth')) {
      videoId = '7Q17ubqLfaM'; channel = 'Computerphile'; duration = '11:20';
      title = 'JWT Authentication Security';
    } else if (qLower.includes('cloud') || qLower.includes('ssrf') || qLower.includes('iam')) {
      videoId = '4h72_GkXjTA'; channel = 'David Bombal'; duration = '15:45';
      title = 'Cloud Security & SSRF Attack Explained';
    } else if (qLower.includes('malware') || qLower.includes('powershell')) {
      videoId = 'lzaW5y_pW8M'; channel = 'John Hammond'; duration = '13:10';
      title = 'Malware Analysis & PowerShell Attacks';
    } else if (qLower.includes('sql') || qLower.includes('injection')) {
      videoId = 'ZcKjXZJAFwg'; channel = 'NetworkChuck'; duration = '18:22';
      title = 'SQL Injection Attack & Defense Explained';
    } else if (qLower.includes('xss') || qLower.includes('cross-site')) {
      videoId = 'EoaDgUgS6QA'; channel = 'John Hammond'; duration = '16:05';
      title = 'Cross-Site Scripting (XSS) Deep Dive';
    }

    return {
      query,
      videoId,
      title,
      channel,
      duration,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      cheatSheet: [
        `Understand the fundamental attack mechanics behind ${query}.`,
        'Verify origin domain, cryptographic signatures, and access tokens.',
        'Apply defense-in-depth policies and least-privilege configurations.'
      ],
      cheatSheetHinglish: [
        `${query} ke core attack mechanics ko pehle samjho.`,
        'Origin domain aur cryptographic signatures ko hamesha verify karo.',
        'Defense-in-depth aur least-privilege rules follow karo.'
      ],
      microNotes: [
        { time: '01:15', note: `Anatomy of ${query} in real-world infrastructure.`, noteHinglish: `Production mein attack kaise execute hota hai.` },
        { time: '06:30', note: 'Mitigation strategies and forensic detection rules.', noteHinglish: `Detection aur hardening ke practical steps.` }
      ],
      source: 'curated_fallback'
    };
  }
}

export const youtubeBackend = new YouTubeBackendService();
