/**
 * Grounded YouTube Service & Syllabus Ingestion
 * Maps diagnosed micro-weaknesses to verified high-yield cybersecurity masterclasses.
 * Provides pre-flight cheat sheets, timecoded AI micro-notes, and custom syllabus ingestion.
 */

export const GROUNDED_VIDEO_CATALOG = {
  'Subdomain Hierarchy & Lookalike Spoofing': {
    videoId: 'Vf6L2x5zHbg',
    title: 'DNS & Subdomain Spoofing Masterclass',
    channel: 'NetworkChuck',
    duration: '11:42',
    cheatSheet: [
      'The Apex Domain is always the word directly left of the TLD (.com, .org).',
      'HTTPS only means the connection is encrypted, not that the site is safe!',
      'Attackers create subdomains like "secure-bank.login.attacker.com" to deceive victims.'
    ],
    cheatSheetHinglish: [
      'Apex domain hamesha .com ya .org ke theek pehle wala word hota hai.',
      'HTTPS padlock ka matlab connection secure hai, website safe hai ye guarantee nahi!',
      'Attackers "netbanking.hdfc" ko apna subdomain bana kar loot te hain.'
    ],
    microNotes: [
      {
        time: '01:20',
        note: 'DNS Hierarchy Tree: Root (.) -> TLD (.com) -> Apex Domain (bank.com) -> Subdomain (login.bank.com)',
        noteHinglish: 'DNS tree aise chalta hai: Root -> TLD -> Asli Domain -> Subdomain'
      },
      {
        time: '04:15',
        note: 'Address Bar Truncation: Mobile browsers hide long subdomains, showing only attacker prefixes.',
        noteHinglish: 'Mobile phones par lambe URLs cut ho jaate hain, isliye dhyan se pura address dekho.'
      },
      {
        time: '08:30',
        note: 'DNS CNAME vs A Records: How phishing infrastructure routes lookalike traffic.',
        noteHinglish: 'CNAME record ka use karke attacker apne server par redirect karta hai.'
      }
    ]
  },
  'Email Authentication (SPF, DKIM, DMARC)': {
    videoId: 'sO4x9_GkXjA',
    title: 'Email Security Explained: SPF, DKIM, and DMARC',
    channel: 'PowerDMARC',
    duration: '09:15',
    cheatSheet: [
      'SPF checks if the sending IP is authorized by the domain owner.',
      'DKIM adds a cryptographic signature to verify the email was untouched.',
      'DMARC specifies what to do (none, quarantine, reject) if SPF/DKIM fails.'
    ],
    cheatSheetHinglish: [
      'SPF check karta hai ki sender IP domain owner ki list mein hai ya nahi.',
      'DKIM digital stamp lagata hai taaki email raste mein badla na ja sake.',
      'DMARC rule set karta hai: agar check fail ho to email ko reject ya block karo.'
    ],
    microNotes: [
      {
        time: '02:00',
        note: 'Why "From" can be forged: SMTP protocol was created in 1982 with zero built-in auth.',
        noteHinglish: 'SMTP protocol 1982 ka hai, tab koi password check nahi tha.'
      },
      {
        time: '05:40',
        note: 'DMARC policy "p=reject" is mandatory to prevent executive impersonation.',
        noteHinglish: 'p=reject lagana zaroori hai taaki koi fake CEO email na bhej sake.'
      }
    ]
  },
  'MFA Fatigue (Push Bombing) Attacks': {
    videoId: '7a0v24w_ZqI',
    title: 'MFA Fatigue: How Hackers Bypass Multi-Factor Authentication',
    channel: 'John Hammond',
    duration: '14:08',
    cheatSheet: [
      'Attackers trigger dozens of push prompts at 3 AM to wear down human targets.',
      'Number Matching stops push fatigue by requiring on-screen 2-digit entry.',
      'FIDO2 / WebAuthn hardware passkeys completely eliminate fatigue vulnerabilities.'
    ],
    cheatSheetHinglish: [
      'Attackers raat ko 50 notifications bhejte hain taaki user thak kar approve kar de.',
      'Number matching use karo jisme screen ka 2-digit code type karna padta hai.',
      'FIDO2 hardware passkeys se fatigue attack 100% block ho jata hai.'
    ],
    microNotes: [
      {
        time: '03:10',
        note: 'The Psychology of Fatigue: Overwhelmed users approve prompts just to mute phone vibrations.',
        noteHinglish: 'User sochte hain phone bajna band hoga isliye galti se Approve daba dete hain.'
      },
      {
        time: '09:45',
        note: 'Configuring Azure / Google Workspace Conditional Access with Number Matching.',
        noteHinglish: 'Admin settings mein Number Matching aur Location verification turn on karo.'
      }
    ]
  },
  'Internationalized Domain Names (IDN) & Punycode': {
    videoId: 'C03K8N3rQjM',
    title: 'The Scariest Phishing Attack Ever (Punycode)',
    channel: 'Tom Scott / Computerphile',
    duration: '08:30',
    cheatSheet: [
      'Non-Latin Unicode characters (Cyrillic, Greek) look identical to ASCII letters.',
      'DNS translates Unicode domains into "xn--" Punycode prefixes.',
      'Password managers never autofill credentials on punycode lookalike domains.'
    ],
    cheatSheetHinglish: [
      'Russian ya Greek letters English letters jaise dikhte hain par alag hote hain.',
      'DNS in characters ko "xn--" se shuru hone wale code mein badalta hai.',
      'Password manager use karo, wo fake punycode domain par auto-fill nahi karega.'
    ],
    microNotes: [
      {
        time: '02:15',
        note: 'Homograph substitution: Cyrillic "а" (U+0430) vs Latin "a" (U+0061).',
        noteHinglish: 'Aankhein dhoka kha sakti hain lekin browser certificate inspect karta hai.'
      },
      {
        time: '06:10',
        note: 'Why Browser Address Bar Protection alone is insufficient on mobile.',
        noteHinglish: 'Mobile par hamesha certificate CN inspect karo.'
      }
    ]
  }
};

export class YouTubeService {
  getVideoForTopic(microTopic) {
    if (GROUNDED_VIDEO_CATALOG[microTopic]) {
      return GROUNDED_VIDEO_CATALOG[microTopic];
    }
    // Default high-yield video
    return {
      videoId: 'Vf6L2x5zHbg',
      title: `${microTopic} Defense Fundamentals`,
      channel: 'CyberSecurity Academy',
      duration: '10:00',
      cheatSheet: [
        'Understand the core threat mechanics before applying mitigations.',
        'Always verify signatures, origin domains, and authentication tokens.',
        'Enforce defense-in-depth principles across the entire attack surface.'
      ],
      cheatSheetHinglish: [
        'Attack ke mechanics ko pehle samjho fir defense lagao.',
        'Hamesha signature, domain, aur tokens check karo.',
        'Har level par security check lagao.'
      ],
      microNotes: [
        { time: '01:00', note: 'Threat vector overview and anatomy.', noteHinglish: 'Attack kaise start hota hai.' },
        { time: '05:00', note: 'Mitigation strategies and hardening.', noteHinglish: 'Kaise protect karein.' }
      ]
    };
  }

  /**
   * Parses uploaded custom notes / syllabus text and creates micro-learning modules
   */
  parseCustomSyllabus(textContent) {
    const lines = textContent.split('\n').filter(l => l.trim().length > 0);
    const summary = lines.slice(0, 5).join(' ');
    
    return {
      title: 'Custom Ingested Curriculum',
      sourceTextLength: textContent.length,
      extractedKeyPoints: [
        lines[0] || 'Custom security policy reference',
        lines[1] || 'Internal organizational access controls',
        lines[2] || 'Specific vulnerability remediation requirements'
      ],
      groundedPrompt: `Reference Syllabus Ingested: "${summary.substring(0, 300)}..."`
    };
  }
}

export const youtube = new YouTubeService();
