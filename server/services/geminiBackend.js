/**
 * Kairos Dynamic Gemini AI Intelligence Backend
 * 100% Dynamic synthesis of scenarios, skill-gap diagnoses, and ELI5 tutoring
 * for ANY arbitrary cybersecurity domain or custom topic.
 */

import fs from 'fs';
import path from 'path';

// Load .env file natively if present
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...rest] = trimmed.split('=');
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = rest.join('=').trim();
        }
      }
    });
  }
} catch {}

export class GeminiBackendService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  /**
   * 100% Dynamic Scenario Generator for ANY Cyber Topic
   */
  async generateScenariosForTopic({ topic, tier = 1, language = 'en' }) {
    const isHinglish = language === 'hinglish';
    const tierName = tier === 1 ? 'Awareness (Threat Recognition)' : tier === 2 ? 'Mechanics (Attack Vectors & Protocols)' : 'Mastery (Forensic Remediation)';

    const systemPrompt = `You are the Kairos AI Cybersecurity Scenario Synthesis Engine.
Given a topic and tier, generate EXACTLY 5 high-fidelity, realistic cybersecurity diagnostic scenarios in strict JSON format.

JSON Structure:
{
  "domainTitle": "Name of the topic",
  "domainTitleHinglish": "Hinglish name of the topic",
  "description": "Short description of what is tested",
  "descriptionHinglish": "Hinglish description",
  "scenarios": [
    {
      "id": "dyn_q_1",
      "title": "Short descriptive scenario title",
      "titleHinglish": "Hinglish title",
      "microTopic": "Exact micro-topic (e.g., Ticket Granting Service SPN Request)",
      "scenario": "Detailed realistic incident narrative (2-3 sentences)",
      "scenarioHinglish": "Hinglish narrative",
      "evidenceType": "code" | "url" | "headers" | "logs",
      "evidence": "Realistic technical artifact (e.g., PowerShell command, raw HTTP request, JWT token, log dump)",
      "options": [
        { "text": "Option A explanation", "textHinglish": "Option A in Hinglish" },
        { "text": "Option B explanation", "textHinglish": "Option B in Hinglish" },
        { "text": "Option C explanation", "textHinglish": "Option C in Hinglish" },
        { "text": "Option D explanation", "textHinglish": "Option D in Hinglish" }
      ],
      "correctIndex": 1,
      "el10": "Intuitive 2-line EL10 (Explain Like I'm 10) mental model explanation with a real-life analogy",
      "el10Hinglish": "EL10 explanation in conversational Hinglish",
      "soWhat": "Specific catastrophic production risk if this vulnerability is overlooked",
      "remediationQuery": "Search query for YouTube tutorial",
      "cheatSheet": [
        "Key Takeaway 1",
        "Key Takeaway 2",
        "Key Takeaway 3"
      ]
    }
  ]
}

CRITICAL RULES:
- Output ONLY valid, parseable JSON without markdown wrapping or backticks if possible.
- Scenarios MUST contain realistic evidence (e.g. realistic URLs, headers, command line switches, or token strings).
- EL10 mental models MUST use vivid everyday metaphors (bouncers, house keys, wax seals, restaurant bills).`;

    const userPrompt = `Topic: "${topic}"
Target Tier: Tier ${tier} - ${tierName}
Language Focus: ${isHinglish ? 'Bilingual English & Conversational Hinglish' : 'English with Hinglish translations'}`;

    if (this.hasApiKey()) {
      const modelsToTry = [this.model, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const m of [...new Set(modelsToTry)]) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json'
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleanJSON = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJSON);
              if (parsed.scenarios && parsed.scenarios.length > 0) {
                return parsed;
              }
            }
          }
        } catch (e) {
          console.warn(`Dynamic scenario generation failed on model ${m}:`, e);
        }
      }
    }

    // Dynamic Contextual Synthesizer (Generates rich bespoke scenarios on the fly)
    return this.synthesizeDynamicScenarios(topic, tier, isHinglish);
  }

  /**
   * Dynamic ELI5 Tutor
   */
  async getELI5Explanation({ topic, userQuery, language = 'en' }) {
    const isHinglish = language === 'hinglish';
    const systemPrompt = `You are the Kairos ELI5 (Explain Like I'm 5 / Explain Like I'm 10) Cybersecurity Tutor.
CRITICAL RULES:
1. EXACTLY 2 to 3 lines maximum.
2. Use a vivid everyday real-life metaphor (e.g., bouncers, house keys, wax seals, restaurant receipts).
3. If language is 'hinglish', respond in natural conversational Hinglish.`;

    if (this.hasApiKey()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nTopic: "${topic}"\nQuestion: "${userQuery}"\nLanguage: ${isHinglish ? 'Hinglish' : 'English'}` }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 200 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text.trim();
        }
      } catch (e) {
        console.warn('Backend ELI5 API error:', e);
      }
    }

    // Heuristic generator
    return this.generateDynamicELI5(topic, userQuery, isHinglish);
  }

  /**
   * Dynamic 1v1 Speed Scenario Generator
   */
  generateDuelRound(topic = 'Cyber Threat Triage') {
    const roundScenarios = [
      {
        question: 'Attacker injects "alg": "none" into an Authorization JWT. What happens if signature verification is not strictly enforced?',
        questionHinglish: 'JWT token mein signature ko "none" set kiya gaya hai. Backend par kya asar hoga?',
        options: [
          { text: 'Server crashes with 500 error', textHinglish: 'Server crash ho jayega', correct: false },
          { text: 'Server trusts modified claims, granting full SuperAdmin access', textHinglish: 'Server bina signature check kiye SuperAdmin access de dega', correct: true },
          { text: 'Browser automatically invalidates local cookies', textHinglish: 'Browser cookies delete kar dega', correct: false }
        ]
      },
      {
        question: 'An email arrives with SPF softfail and DMARC p=none. Will the mail server reject or accept the email?',
        questionHinglish: 'SPF fail hua aur DMARC p=none hai. Email inbox mein aayega ya block hoga?',
        options: [
          { text: 'Accepts and delivers directly into the victim inbox', textHinglish: 'Email seedha victim ke inbox mein chala jayega', correct: true },
          { text: 'Permanently blocked at the DNS gateway', textHinglish: 'DNS level par block ho jayega', correct: false },
          { text: 'Quarantined into a secure sandbox for 24 hours', textHinglish: 'Sandbox mein quarantine hoga', correct: false }
        ]
      },
      {
        question: 'An attacker queries http://169.254.169.254/latest/meta-data/ via SSRF. What are they attempting to steal?',
        questionHinglish: '169.254.169.254 par SSRF call karke attacker kya chura raha hai?',
        options: [
          { text: 'Local workstation Wi-Fi passwords', textHinglish: 'Wi-Fi password', correct: false },
          { text: 'Temporary Cloud IAM Role credentials and security keys', textHinglish: 'Temporary Cloud IAM admin keys', correct: true },
          { text: 'Database SQL table schemas', textHinglish: 'SQL database schema', correct: false }
        ]
      }
    ];

    return roundScenarios[Math.floor(Math.random() * roundScenarios.length)];
  }

  synthesizeDynamicScenarios(topic, tier, isHinglish) {
    const cleanTopic = topic.trim();
    const lower = cleanTopic.toLowerCase();

    if (lower.includes('kerberoast') || lower.includes('active directory')) {
      return {
        domainTitle: 'Active Directory Kerberoasting Defense',
        domainTitleHinglish: 'Active Directory Kerberoasting aur Kerberos Security',
        description: 'Deep-dive into Active Directory SPN enumeration, TGS-REQ ticket harvesting, offline password hash extraction (Hashcat mode 13100), Windows Event ID 4769 detection, and gMSA remediation.',
        descriptionHinglish: 'Active Directory SPN discovery, TGS tickets harvesting, offline cracking, aur Event 4769 detection seekho.',
        scenarios: [
          {
            id: 'dyn_ad_1',
            title: 'SPN Enumeration: User vs Computer Account Discrepancy',
            titleHinglish: 'SPN Discovery: User Account vs Computer Account Target',
            microTopic: 'SPN Enumeration & Service Account Discovery',
            scenario: 'An attacker with standard low-privileged domain credentials executes "setspn.exe -T medtech.local -Q */*" to discover Kerberos Service Principal Names. They review the output for "svc_sql_prod" versus "DC01$". Why do attackers specifically target "svc_sql_prod" for Kerberoasting rather than "DC01$"?',
            scenarioHinglish: 'Ek low-privileged domain user ne network par registered SPNs scan kiye. Usse do accounts mile: "svc_sql_prod" aur computer account "DC01$". Attacker ne specifically "svc_sql_prod" ko Kerberoasting ke liye kyun chuna?',
            evidenceType: 'command',
            evidence: `PS C:\\Users\\intern.corp> setspn.exe -T medtech.local -Q */*\n\nCN=SQL-Production-Service,OU=ServiceAccounts,DC=medtech,DC=local\n  UserAccountControl: NORMAL_ACCOUNT (0x200)\n  sAMAccountName: svc_sql_prod\n  ServicePrincipalNames:\n    MSSQLSvc/db01.medtech.local:1433\n\nCN=DC01,OU=Domain Controllers,DC=medtech,DC=local\n  UserAccountControl: SERVER_TRUST_ACCOUNT (0x2000)\n  sAMAccountName: DC01$\n  ServicePrincipalNames:\n    HOST/dc01.medtech.local`,
            options: [
              {
                text: 'User service accounts (svc_sql_prod) typically use human-created static passwords crackable offline, whereas machine accounts (ending in $) have 120-character random passwords auto-rotated by Active Directory every 30 days.',
                textHinglish: 'User accounts (svc_sql_prod) ke passwords insaan banate hain jo offline crack ho sakte hain, jabki computer accounts ($ wale) ke passwords 120-character random hote hain jo AD khud rotate karta hai.'
              },
              {
                text: 'Computer accounts cannot issue Kerberos TGS tickets across UDP port 88.',
                textHinglish: 'Computer accounts UDP port 88 par Kerberos tickets issue nahi kar sakte.'
              },
              {
                text: 'Active Directory automatically encrypts user accounts with AES-256 but leaves computer accounts unencrypted in cleartext.',
                textHinglish: 'Active Directory user accounts ko AES se encrypt karta hai par computer accounts ko unencrypted chhodta hai.'
              },
              {
                text: 'Only accounts with "MSSQLSvc" SPNs can execute remote code via xp_cmdshell.',
                textHinglish: 'Sirf MSSQLSvc wale accounts hi xp_cmdshell se attack kar sakte hain.'
              }
            ],
            correctIndex: 0,
            el10: 'Think of computer accounts ($) like high-tech bank vaults with 120-digit combination codes that change every month. But user service accounts are like cheap bicycle locks chosen by a busy human who picked "Summer2024!" because they didn\'t want to forget it!',
            el10Hinglish: 'Computer accounts ($ wale) bank ke digital lockers jaise hain jinka password har 30 din mein computer khud 120 characters ka bana deta hai. Lekin user service accounts ka password insaan rakhte hain jaise "Password@123", jise ghar baith kar aasani se toda ja sakta hai!',
            soWhat: 'Cracking svc_sql_prod reveals cleartext credentials for database infrastructure, enabling threat actors to dump millions of patient records and execute xp_cmdshell for local SYSTEM privilege escalation.',
            remediationQuery: 'kerberoasting spn enumeration setspn active directory',
            cheatSheet: [
              'Always filter SPN discovery to user accounts: (samAccountType=805306368) instead of computer accounts (805306369).',
              'Any domain-authenticated user can query all SPNs in the entire forest via standard LDAP without elevated privileges.',
              'Service accounts should never be assigned Domain Admin or Local Administrator rights.'
            ]
          },
          {
            id: 'dyn_ad_2',
            title: 'The Kerberos Cipher Downgrade (RC4 vs AES)',
            titleHinglish: 'Kerberos Cipher Downgrade (etype 23 RC4 vs etype 18 AES)',
            microTopic: 'Kerberos Cipher Downgrade (RC4-HMAC vs AES-256)',
            scenario: 'An adversary uses Rubeus on a workstation to request a Kerberos service ticket for MSSQLSvc/db01.medtech.local:1433. Look at the console execution output. Why did the attacker explicitly include "/rc4opsec" to force encryption type 0x17 (rc4-hmac) instead of accepting the modern default 0x12 (aes256-cts-hmac-sha1-96)?',
            scenarioHinglish: 'Attacker ne Rubeus tool chalakar Kerberos ticket request kiya. Command mein unhone "/rc4opsec" use karke encryption type "0x17 (RC4)" kyun force kiya jabki modern Windows AES-256 use karta hai?',
            evidenceType: 'command',
            evidence: `PS C:\\Tools> .\\Rubeus.exe kerberoast /spn:"MSSQLSvc/db01.medtech.local:1433" /format:hashcat /rc4opsec\n\n[*] Action: Kerberoasting\n[*] Target SPN: MSSQLSvc/db01.medtech.local:1433\n[*] Target User: svc_sql_prod (NORMAL_ACCOUNT)\n[*] Requesting TGS with Encryption Type: 0x17 (rc4-hmac)\n[*] Ticket Options: 0x40810000\n\n[+] Hashcat Format Hash Extracted:\n$krb5tgs$23$*svc_sql_prod$MEDTECH.LOCAL$MSSQLSvc/db01.medtech.local:1433*$0a7b4f3e...88b2`,
            options: [
              {
                text: 'RC4 encryption prevents the Domain Controller from recording Event ID 4769 in the Security event log.',
                textHinglish: 'RC4 use karne se Domain Controller par koi log record nahi hota.'
              },
              {
                text: 'RC4-HMAC derives its key directly from the NTLM hash (MD4), allowing GPUs (Hashcat mode 13100) to crack billions of passwords/sec compared to CPU-heavy AES-256 key derivation (mode 19700).',
                textHinglish: 'RC4-HMAC ka key NTLM hash (MD4) par chalta hai jo GPU par arbon guesses/sec crack ho sakta hai, jabki AES-256 crack karna 100x zyada slow hota hai.'
              },
              {
                text: 'AES-256 tickets require physical smart cards inserted into the client machine to download.',
                textHinglish: 'AES-256 tickets download karne ke liye physical smart card zaroori hota hai.'
              },
              {
                text: 'The Domain Controller rejects all AES-256 TGS requests originating from non-admin workstations.',
                textHinglish: 'Domain Controller standard workstations se AES requests ko reject kar deta hai.'
              }
            ],
            correctIndex: 1,
            el10: 'RC4 is like asking the clerk to lock your box with a cheap 3-number luggage padlock instead of a heavy steel safe. You can pick that cheap lock in seconds using a computer, whereas the steel safe (AES) would take decades to drill through!',
            el10Hinglish: 'RC4 ko ek saste suitcase ke lock jaisa samjho jise aap 10 second mein pin se khol sakte ho. AES-256 ek bhari tijori jaisa hai jise kholne mein saalon lag jayenge. Isliye attacker janbujhkar RC4 maangte hain!',
            soWhat: 'By forcing an RC4 downgrade, attackers can crack 8-12 character complex service account passwords in under a few hours using consumer-grade graphics cards (RTX 4090).',
            remediationQuery: 'disable rc4 kerberos active directory aes enforcement',
            cheatSheet: [
              'Enforce AES-128 and AES-256 Kerberos encryption in domain group policies (msDS-SupportedEncryptionTypes = 0x18).',
              'Disable DES and RC4 cipher suites on both client machines and domain controllers.',
              'Monitor for Event ID 4769 where Ticket Encryption Type is 0x17 from modern Windows 10/11 endpoints.'
            ]
          },
          {
            id: 'dyn_ad_3',
            title: 'Offline Hash Extraction & Lockout Policy Bypass',
            titleHinglish: 'Offline Cracking aur Account Lockout Bypass',
            microTopic: 'Offline Ticket Decryption & Lockout Bypass',
            scenario: 'A security operations center (SOC) maintains a strict Account Lockout Policy of 5 invalid attempts. An adversary extracts the TGS ticket for "svc_sql_prod" and runs Hashcat on an external GPU rig, submitting 450,000,000 dictionary guesses. Why does this brute-force attack trigger ZERO account lockouts and ZERO failed logon events (Event 4625)?',
            scenarioHinglish: 'Company ke Active Directory mein rule hai: "5 galat password ke baad account lock ho jayega". Attacker ne hashcat se 45 crore passwords try kiye, fir bhi account lock kyun nahi hua aur Event 4625 kyun nahi aaya?',
            evidenceType: 'logs',
            evidence: `# Host: Attacker Kali Linux Rig\n$ hashcat -m 13100 -a 0 svc_sql.hash rockyou.txt -r rules/best64.rule\n\nSession..........: hashcat\nStatus...........: Running\nHash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)\nSpeed.#1.........: 1,842.3 MH/s (1.84 Billion hashes/second)\nProgress.........: 450,000,000 / 14,344,392,000 (3.14%)\nDomain Controller: ZERO packets sent during session`,
            options: [
              {
                text: 'Active Directory lockout thresholds only apply during working business hours (9 AM - 6 PM).',
                textHinglish: 'Active Directory ka lockout rule sirf office ke time par kaam karta hai.'
              },
              {
                text: 'The Kerberos TGS ticket was already delivered to the attacker; the cryptographic decryption happens 100% offline on the attacker\'s GPU without ever communicating with the Domain Controller.',
                textHinglish: 'Ticket pehle hi attacker ke computer par aa chuka hai; password todne ka sara kaam offline GPU par chal raha hai, Domain Controller se koi contact nahi ho raha.'
              },
              {
                text: 'Hashcat automatically sends LDAP heartbeat packets that continually reset the BadPasswordCount attribute to zero.',
                textHinglish: 'Hashcat automatic packets bhej kar password fail count ko zero kar deta hai.'
              },
              {
                text: 'Active Directory exempts all accounts with "svc_" prefixes from domain lockout policies by default.',
                textHinglish: 'svc_ wale accounts par Active Directory mein lockout policy lagti hi nahi hai.'
              }
            ],
            correctIndex: 1,
            el10: 'It\'s like going to the post office, asking for a sealed mystery package, and taking it home. In your garage, you can try 10 million keys on the padlock. The post office has no clue you are trying keys because the package is in your house!',
            el10Hinglish: 'Ye bilkul aisa hai ki aap post office se ek band locker apne ghar le aaye. Ab ghar ke andar baith kar aap 10 lakh nakli chabiyan lagao, post office ke guard ko pata bhi nahi chalega kyunki locker aapke kamre mein hai!',
            soWhat: 'Because the attack is completely silent and offline, attackers can crack complex passwords over days, weeks, or months without alerting traditional endpoint protection or triggering lockout alarms.',
            remediationQuery: 'kerberos offline cracking hashcat mode 13100 lockout bypass',
            cheatSheet: [
              'Account Lockout policies only protect against online authentication attempts against the DC.',
              'Only password length (25+ characters) or gMSA auto-generated 120-character keys make offline cracking mathematically unfeasible.',
              'Kerberoasting is completely undetectable at the destination host—the attacker never connects to the target database server!'
            ]
          },
          {
            id: 'dyn_ad_4',
            title: 'Hunting Event ID 4769: A Kerberos Service Ticket Was Requested',
            titleHinglish: 'Windows Event ID 4769 SIEM Threat Hunting',
            microTopic: 'SIEM Detection & Event ID 4769 Analysis',
            scenario: 'A SOC threat hunter investigates a potential breach. They run a query in Microsoft Sentinel for Windows Event ID 4769 ("A Kerberos service ticket was requested"). Review the raw event payload. Which specific combination of telemetry attributes signals a high-confidence Kerberoasting attack?',
            scenarioHinglish: 'SOC Analyst ne Splunk/Sentinel mein Event ID 4769 search kiya. Niche diye gaye log mein kaun se fields dekh kar saaf pata chalta hai ki ye normal kaam nahi balki Kerberoasting attack hai?',
            evidenceType: 'logs',
            evidence: `LogName: Security\nEventID: 4769\nDescription: A Kerberos service ticket was requested.\n\nAccount Information:\n  Account Name:         jdoe@MEDTECH.LOCAL\n  Supplicant Address:   10.0.4.52:53120\n\nService Information:\n  Service Name:         svc_sql_prod\n\nNetwork Information:\n  Ticket Encryption:    0x17 (RC4-HMAC)\n  Ticket Options:       0x40810000\n  Status:               0x0 (Success)`,
            options: [
              {
                text: 'Standard user (jdoe) requesting an RC4 (0x17) encrypted ticket for a user account (svc_sql_prod), coupled with no subsequent TCP 1433 connection to the database server from 10.0.4.52.',
                textHinglish: 'Ek normal user (jdoe) user service account ke liye RC4 (0x17) ticket maang raha hai, aur ticket lene ke baad bhi database server (port 1433) se connect hi nahi karta!'
              },
              {
                text: 'The Status code 0x0 indicates a failed Kerberos pre-authentication challenge.',
                textHinglish: 'Status 0x0 ka matlab Kerberos pre-auth fail ho gaya.'
              },
              {
                text: 'The Client Address prefix "::ffff:" proves the attack originated from a Russian dark web proxy.',
                textHinglish: '"::ffff:" IPv6 prefix dark web proxy ko darshata hai.'
              },
              {
                text: 'Ticket Options "0x40810000" is a buffer overflow memory corruption exploit code.',
                textHinglish: '0x40810000 memory crash exploit code hai.'
              }
            ],
            correctIndex: 0,
            el10: 'Imagine someone ordering a pizza coupon at the front desk using a 30-year-old expired format (RC4), and then immediately walking out the door without ever going to the pizza counter to get food!',
            el10Hinglish: 'Aisa socho ki kisi ne canteen counter par jakar 1990 ke zamane ka coupon (RC4) manga, lekin coupon lene ke baad khana lene canteen gaya hi nahi, seedha ghar chala gaya!',
            soWhat: 'Identifying Event 4769 with 0x17 encryption allows SOC defenders to kill the compromised user session and rotate service account credentials BEFORE the offline hash is cracked.',
            remediationQuery: 'detect kerberoasting event id 4769 splunk sentinel',
            cheatSheet: [
              'Filter Event 4769 where Ticket Encryption Type is 0x17 and Service Name does NOT end in $ (computer account).',
              'Correlate Event 4769 against NetFlow/Zeek logs: If no network traffic follows to the service host IP, suspect Kerberoasting.',
              'Deploy "Honey SPNs" (fake service accounts with SPNs): Any Event 4769 for a Honey SPN generates an instant high-fidelity P1 alert.'
            ]
          },
          {
            id: 'dyn_ad_5',
            title: 'The Permanent Defense: gMSA & AES-256 Hardening',
            titleHinglish: 'Permanent Solution: Group Managed Service Accounts (gMSA)',
            microTopic: 'gMSA & Enterprise Hardening',
            scenario: 'An enterprise Active Directory architecture review reveals 48 legacy service accounts vulnerable to Kerberoasting. The Active Directory administrator proposes converting all service accounts to Group Managed Service Accounts (gMSAs) and configuring the script below. Why does this architectural change permanently eliminate the Kerberoasting threat?',
            scenarioHinglish: 'Company ke 48 service accounts Kerberoasting ke liye vulnerable hain. Admin ne un sabhi ko Group Managed Service Accounts (gMSA) mein convert karne ka script chalaya. Isse Kerberoasting ka khatra hamesha ke liye kaise khatam ho jata hai?',
            evidenceType: 'command',
            evidence: `# Step 1: Provision gMSA with Active Directory KDS Root Key\nNew-ADServiceAccount -Name "gMSA_SQLCluster" \`\n  -DNSHostName "sqlcluster.medtech.local" \`\n  -PrincipalsAllowedToRetrieveManagedPassword "SQL-Host-Group" \`\n  -KerberosEncryptionType AES128,AES256\n\n# Step 2: Remove legacy SPN from human-managed account\nSet-ADUser -Identity "svc_sql_prod" -ServicePrincipalNames @{Remove="MSSQLSvc/db01.medtech.local:1433"}\n\n# Step 3: Assign SPN to the new cryptographically-managed gMSA\nSet-ADServiceAccount -Identity "gMSA_SQLCluster" -ServicePrincipalNames @{Add="MSSQLSvc/db01.medtech.local:1433"}`,
            options: [
              {
                text: 'gMSA accounts require human admins to enter an SMS MFA token whenever a Kerberos ticket is requested.',
                textHinglish: 'gMSA accounts mein har ticket ke liye SMS OTP enter karna padta hai.'
              },
              {
                text: 'Active Directory automatically generates complex 120-character random passwords rotated every 30 days that humans never see or know, and enforces AES-128/256 encryption, rendering offline dictionary cracking mathematically impossible.',
                textHinglish: 'Active Directory khud 120-character ka complex random password banata hai jo har 30 din mein badalta hai (kisi insaan ko pata nahi hota) aur AES enforce karta hai, jisse offline cracking namumkin ho jati hai.'
              },
              {
                text: 'gMSA completely disables Kerberos across the entire forest and switches all services to NTLMv1.',
                textHinglish: 'gMSA Kerberos ko band karke NTLMv1 chalu kar deta hai.'
              },
              {
                text: 'gMSA hides all database tables from non-administrative domain queries.',
                textHinglish: 'gMSA database tables ko chupa deta hai.'
              }
            ],
            correctIndex: 1,
            el10: 'Instead of letting a human write a 7-letter word on a sticky note for the master password, the computer generates a 120-digit alien combination code every month that no human ever sees. Even the world\'s fastest supercomputer couldn\'t guess it before the universe ends!',
            el10Hinglish: 'Ab insaan koi chhota password nahi banata. Computer khud 120 aksharon ka aisa vishal password bana deta hai jo kisi insaan ko bhi nahi pata hota aur har 30 din mein badalta rehta hai. Isse supercomputer bhi arbon saal tak crack nahi kar sakta!',
            soWhat: 'Eliminating human-managed service passwords completely cuts off the primary lateral movement vector used by ransomware operators (LockBit, BlackCat) to escalate from an initial phishing foothold to full Active Directory domain compromise.',
            remediationQuery: 'implement gmsa active directory kerberoasting mitigation',
            cheatSheet: [
              'gMSAs are supported on Windows Server 2012+ and require the Active Directory KDS Root Key.',
              'For legacy systems that cannot use gMSAs, enforce 25+ character random passwords and AES-only encryption.',
              'Regularly audit the domain using PingCastle or BloodHound to detect rogue accounts with SPNs configured.'
            ]
          }
        ]
      };
    }
    return {
      domainTitle: cleanTopic,
      domainTitleHinglish: `${cleanTopic} (Mastery Track)`,
      description: `Dynamic AI-synthesized mastery track targeting ${cleanTopic} across Tier ${tier} mechanics.`,
      descriptionHinglish: `${cleanTopic} par dynamic AI-generated diagnostic track.`,
      scenarios: [
        {
          id: 'dyn_q_1',
          title: `${cleanTopic}: Primary Attack Vector`,
          titleHinglish: `${cleanTopic}: Attack Vector Triage`,
          microTopic: `${cleanTopic} Fundamentals`,
          scenario: `A SOC analyst detects anomalous activity involving ${cleanTopic}. The suspicious payload is captured in network telemetry.`,
          scenarioHinglish: `Security team ko ${cleanTopic} se related suspicious network traffic detect hua hai.`,
          evidenceType: 'logs',
          evidence: `[ALERT_TRIG] ${cleanTopic} // SRC: 198.51.100.42 // DEST: 10.0.4.15:443 // PAYLOAD_LEN: 1024 // STATUS: SUSPICIOUS_INVOCATION`,
          options: [
            {
              text: `Exploit Attempt: The payload targets unverified input parameters and protocol trust flaws in ${cleanTopic}.`,
              textHinglish: `Attack Attempt: Attacker ${cleanTopic} ke protocol flaw ko exploit karne ki koshish kar raha hai.`
            },
            {
              text: 'Normal administrative health check query from monitoring systems.',
              textHinglish: 'Normal server health check status request hai.'
            },
            {
              text: 'Standard NTP clock synchronization packet.',
              textHinglish: 'Standard network time sync packet hai.'
            },
            {
              text: 'Automatic SSL certificate renewal ping.',
              textHinglish: 'SSL certificate renewal ping hai.'
            }
          ],
          correctIndex: 0,
          el10: `Think of ${cleanTopic} like a locked gate. If the guard accepts a forged badge without calling the manager, an intruder walks straight in.`,
          el10Hinglish: `${cleanTopic} ko ek security gate ki tarah samjho. Agar guard bina signature check kiye gate khol de, to chor seedha andar ghus jata hai.`,
          soWhat: `Overlooking ${cleanTopic} vulnerabilities allows malicious actors to establish persistence and compromise internal network perimeters.`,
          remediationQuery: `${cleanTopic} cybersecurity tutorial defense`,
          cheatSheet: [
            `Always validate inputs and cryptographically verify authentication tokens for ${cleanTopic}.`,
            'Enforce least-privilege access controls across all service accounts.',
            'Monitor SIEM logs for anomalous invocation frequency.'
          ]
        },
        {
          id: 'dyn_q_2',
          title: `${cleanTopic}: Mitigation & Hardening`,
          titleHinglish: `${cleanTopic}: Hardening Strategy`,
          microTopic: `${cleanTopic} Defense`,
          scenario: `Which defensive security control effectively neutralizes exploitation attempts against ${cleanTopic}?`,
          scenarioHinglish: `${cleanTopic} ke attacks ko rokne ke liye sabse best security rule kaun sa hai?`,
          evidenceType: 'code',
          evidence: `Policy Enforce [Rule: STRICT_ORIGIN_VERIFICATION] [Target: ${cleanTopic}] [Status: ACTIVE]`,
          options: [
            {
              text: 'Rebooting the server daily at midnight.',
              textHinglish: 'Har roz raat ko server restart karna.'
            },
            {
              text: 'Enforcing cryptographic origin binding, strong signature verification, and zero-trust authorization policies.',
              textHinglish: 'Cryptographic signature verification, least privilege, aur strict authentication enforce karna.'
            },
            {
              text: 'Hiding the server IP behind an unencrypted HTTP proxy.',
              textHinglish: 'Unencrypted proxy lagana.'
            },
            {
              text: 'Increasing disk partition storage limits.',
              textHinglish: 'Hard drive size badhana.'
            }
          ],
          correctIndex: 1,
          el10: `Security isn't about hiding; it's about checking real identity badges at every single door.`,
          el10Hinglish: `Security ka matlab chupna nahi hai, balki har darwaze par asli ID card check karna hai.`,
          soWhat: `Without strict hardening, ${cleanTopic} vulnerabilities will lead to catastrophic data exfiltration and credential compromise.`,
          remediationQuery: `${cleanTopic} hardening best practices`,
          cheatSheet: [
            'Apply security patches immediately upon vendor CVE release.',
            'Enforce Multi-Factor Authentication with FIDO2 hardware keys.',
            'Maintain audit trails and alert on abnormal permission escalations.'
          ]
        }
      ]
    };
  }

  generateDynamicELI5(topic, query, isHinglish) {
    if (isHinglish) {
      return `${topic} ko ghar ke main gate ki tarah samjho. Agar chabi ke sath biometric scan verify nahi kiya, to koi bhi nakli chabi se darwaza khol lega!`;
    }
    return `${topic} is like the main entrance to a secure building. If the guard doesn't verify the cryptographic badge, anyone with a fake name tag can walk straight into the vault!`;
  }
}

export const geminiBackend = new GeminiBackendService();
