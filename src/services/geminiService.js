/**
 * Gemini AI Intelligence Service
 * Powers the 5-Question Scenario Generator, JSON Weakness Schema, and ELI5 Tutor.
 * Supports live Google GenAI API integration with automatic model fallback & offline resilience.
 */

export class GeminiService {
  constructor() {
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || '';
    const envModel = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_MODEL) || 'gemini-2.5-flash';

    this.apiKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('kairos_gemini_key') : '') || envKey || '';
    this.model = (typeof localStorage !== 'undefined' ? localStorage.getItem('kairos_gemini_model') : '') || envModel || 'gemini-2.5-flash';
    this.lastError = null;
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kairos_gemini_key', this.apiKey);
    }
  }

  setModel(modelName) {
    this.model = modelName;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kairos_gemini_model', modelName);
    }
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  /**
   * ELI5 Tutor Response Generator
   * Enforces strict brevity rule: 2-3 lines max, everyday real-life metaphors.
   */
  async getELI5Explanation({ topic = 'Cybersecurity', userQuery = '', language = 'en' }) {
    const isHinglish = language === 'hinglish';
    this.lastError = null;
    
    const systemPrompt = `You are the Kairos ELI5 (Explain Like I'm 5 / Explain Like I'm 10) Cybersecurity Tutor.
CRITICAL RULES:
1. EXACTLY 2 to 3 lines maximum. Never write bullet points or long paragraphs.
2. Use a vivid, everyday real-life analogy (e.g., bouncer at a club, house keys, wax seals on envelopes, restaurant receipts, robot butlers).
3. If language is 'hinglish', respond in natural conversational Hinglish (e.g., "Bouncer jaise check karta hai...").
4. Focus on WHY it matters (the intuitive mental model).`;

    const userPrompt = `Topic: "${topic}"
Learner Question: "${userQuery}"
Language: ${isHinglish ? 'Conversational Hinglish (Hindi written in Roman/English alphabet)' : 'English'}`;

    if (this.hasApiKey()) {
      const modelsToTry = [this.model, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      // Filter unique
      const uniqueModels = [...new Set(modelsToTry)];

      for (const modelName of uniqueModels) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
                }
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 250
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 0) {
              return this.sanitizeResponse(text.trim(), isHinglish);
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            this.lastError = errData?.error?.message || `HTTP ${response.status}`;
            console.warn(`Gemini API (${modelName}) error:`, this.lastError);
          }
        } catch (e) {
          this.lastError = e.message || 'Network error';
          console.warn(`Gemini fetch exception for ${modelName}:`, e);
        }
      }
    }

    // High-intelligence contextual EL10 / ELI5 fallback engine
    return this.generateSmartEL10Response(topic, userQuery, isHinglish);
  }

  sanitizeResponse(text, isHinglish) {
    // Ensure it doesn't exceed 3 lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 3) {
      return lines.slice(0, 3).join(' ');
    }
    return text;
  }

  /**
   * Structured JSON Skill-Gap Schema Generation
   */
  async generateSkillGapJSON({ domain, missedQuestions }) {
    if (!missedQuestions || missedQuestions.length === 0) {
      return {
        domain: typeof domain === 'object' ? domain.title : domain,
        tier: 'Level 1: Awareness',
        score: 100,
        status: 'MASTERED',
        weaknesses: [],
        soWhatSummary: 'Flawless identification of threat vectors! Ready for Level 2 Mechanics.',
        recommendedPath: ['Advanced Threat Hunting', 'Protocol Mechanics', 'Live Duel Arena']
      };
    }

    const domainTitle = typeof domain === 'object' ? domain.title : domain;
    const weaknesses = missedQuestions.map(q => ({
      micro_topic: q.microTopic || 'Threat Analysis',
      question_id: q.id,
      so_what: q.soWhat || 'Vulnerable to real-world credential harvesting and session hijacking.',
      cognitive_gap: `Struggling with ${q.microTopic}. Needs intuitive grounding.`,
      remediation_query: q.remediationQuery || 'cybersecurity defense fundamentals',
      remediation_topics: q.cheatSheet || ['Verify root domains', 'Inspect headers', 'Enforce FIDO2']
    }));

    return {
      domain: domainTitle,
      tier: 'Level 1: Awareness',
      score: Math.round(((5 - missedQuestions.length) / 5) * 100),
      status: 'NEEDS_PRACTICE',
      weaknesses,
      soWhatSummary: `Identified ${weaknesses.length} critical micro-gaps. The syllabus has pivoted to patch these specific vectors before progressing.`,
      recommendedPath: weaknesses.map(w => w.micro_topic)
    };
  }

  /**
   * Universal Contextual EL10 / ELI5 Heuristic Engine
   * Generates authentic, metaphor-driven 2-3 line explanations for any cybersecurity concept.
   */
  generateSmartEL10Response(topic = '', userQuery = '', isHinglish = false) {
    const combined = `${topic} ${userQuery}`.toLowerCase();

    // 1. Phishing / URL / DNS / Punycode
    if (combined.includes('subdomain') || combined.includes('url') || combined.includes('domain') || combined.includes('apex')) {
      return isHinglish
        ? 'URL ek ghar ke address jaisa hai! Pehle slash (/) ke theek pehle wala naam hi asli makaan-malik hai, baaki sab bas kamre ke label hain. Hamesha right-to-left padho.'
        : 'A URL is like a street address! The name right before the first slash (/) is the real homeowner; anything before it is just a bedroom label. Always read from right to left.';
    }

    if (combined.includes('punycode') || combined.includes('homograph') || combined.includes('cyrillic') || combined.includes('xn--')) {
      return isHinglish
        ? 'Russian ya Greek alphabets mein aise letters hote hain jo English jaise dikhte hain par alag hote hain. DNS inhein "xn--" se pehchanta hai aur password managers kabhi inpar dhoka nahi khate.'
        : 'Foreign alphabets have letters that look identical to English letters (like Cyrillic "а"). DNS tags them with "xn--", and password managers safely refuse to autofill credentials on them.';
    }

    if (combined.includes('evilginx') || combined.includes('reverse proxy') || combined.includes('proxy')) {
      return isHinglish
        ? 'Socho ek fake waiter tumhara order asli hotel chef tak le gaya, lekin bill aur receipt apne paas rakh li taaki wo tumhara account chura sake. Sirf FIDO2 passkeys ise rok sakti hain.'
        : 'Imagine a fake waiter who places your food order with the real chef, but steals the receipt to claim your food later. Only FIDO2 passkeys with origin binding stop this.';
    }

    // 2. Email Auth (SPF, DKIM, DMARC)
    if (combined.includes('spf') || combined.includes('dkim') || combined.includes('dmarc') || combined.includes('email') || combined.includes('spoof')) {
      return isHinglish
        ? 'From header lifafe par pen se likhe naam jaisa hai—koi bhi fake kar sakta hai! SPF aur DKIM postal wax seal hain jo proof dete hain, aur DMARC "p=reject" fake lifafe ko turant phad deta hai.'
        : 'The "From" field is just a pen signature on an envelope that anyone can fake! SPF and DKIM are the wax seals proving authenticity, and DMARC "p=reject" tells the post office to shred forgeries.';
    }

    // 3. MFA / Auth / Passkeys
    if (combined.includes('mfa') || combined.includes('fatigue') || combined.includes('push bombing') || combined.includes('otp')) {
      return isHinglish
        ? 'MFA fatigue aisa hai jaise chor raat ko 50 baar doorbell bajaye taaki tum tang aakar darwaza khol do. Kabhi gusse mein approve mat karna, Number Matching use karo!'
        : 'MFA push fatigue is like a burglar ringing your doorbell 50 times at 3 AM hoping you get annoyed and open the door. Never hit Approve; enforce Number Matching instead!';
    }

    if (combined.includes('passkey') || combined.includes('fido2') || combined.includes('webauthn')) {
      return isHinglish
        ? 'Passkey ek high-tech biometric fingerprint lock hai jo sirf asli website ke address par hi open hota hai. Fake lookalike websites par ye kabhi trigger nahi hota.'
        : 'A Passkey is a biometric smart lock cryptographically bound to the exact website URL. Even if a fake website tricks your eyes, the passkey refuses to unlock.';
    }

    // 4. Tokens / JWT / Session
    if (combined.includes('jwt') || combined.includes('token') || combined.includes('alg:none') || combined.includes('alg none') || combined.includes('cookie')) {
      return isHinglish
        ? 'JWT token principal ke stamped school pass jaisa hai. Agar teacher principal ka stamp check nahi karta aur student likh de "Stamp: None", to wo khud ko Principal bana sakta hai!'
        : 'A JWT is like a school hall pass stamped by the principal. If the teacher forgets to verify the signature stamp and the student writes "Stamp: None", anyone can claim SuperAdmin powers!';
    }

    // 5. Malware / Ransomware / PowerShell
    if (combined.includes('malware') || combined.includes('ransomware') || combined.includes('powershell') || combined.includes('obfuscation') || combined.includes('base64')) {
      return isHinglish
        ? 'Obfuscated command ek secret code letter jaisa hai jo parde ke peeche chupke se internet se virus download karne ka order deta hai bina kisi permission ke.'
        : 'An obfuscated PowerShell script is like a scrambled secret note ordering the computer to secretly download a malicious payload behind closed curtains.';
    }

    // 6. Network / ARP / MITM / Wireshark
    if (combined.includes('arp') || combined.includes('mitm') || combined.includes('sniffing') || combined.includes('wireshark') || combined.includes('gateway')) {
      return isHinglish
        ? 'ARP spoofing aisa hai jaise koi classroom mein khada hokar bolne lage "Main hi principal hoon, saare letters mujhe do!" taaki sara traffic uske through nikle.'
        : 'ARP spoofing is like someone standing in a room shouting "I am the mailbox!" so everyone gives them their letters first. Dynamic ARP Inspection shuts this down.';
    }

    // 7. Cloud / SSRF / IMDS / Metadata
    if (combined.includes('ssrf') || combined.includes('metadata') || combined.includes('169.254') || combined.includes('cloud') || combined.includes('s3') || combined.includes('iam')) {
      return isHinglish
        ? 'Tumne company ke robot se kaha "mere liye photo laao", lekin robot ko manager ke secret vault ka address de diya jahan se wo cloud admin keys chura laya (169.254.169.254).'
        : 'You asked the cloud web server to fetch a picture, but tricked it into fetching its own secret internal vault (169.254.169.254) and returning master cloud admin keys!';
    }

    // 8. General Cyber Defense / Why it matters
    if (combined.includes('danger') || combined.includes('risk') || combined.includes('production') || combined.includes('why')) {
      return isHinglish
        ? 'Agar ye vulnerability open reh gayi, to attacker bina password ke system ka admin ban sakta hai aur poora data leak ya encrypt kar sakta hai.'
        : 'If left unpatched, an attacker can bypass all authentication barriers, gain administrative control, and compromise organizational data without triggering alarms.';
    }

    // Default universal mental model
    return isHinglish
      ? 'Cybersecurity ka golden rule hai: "Kabhi bhi blindly trust mat karo, hamesha verify karo." Har request ka origin, certificate aur signature check hona chahiye!'
      : 'The golden rule of cybersecurity is "Never trust, always verify." Every single request must have its origin, digital certificate, and cryptographic signature verified!';
  }
}

export const gemini = new GeminiService();
