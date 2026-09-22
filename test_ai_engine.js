/**
 * Automated Test Suite for Kairos AI Engine
 */

import { GeminiService } from './src/services/geminiService.js';
import { CYBER_DOMAINS } from './src/data/cyberCurriculum.js';
import { YouTubeService } from './src/services/youtubeService.js';

async function runTests() {
  console.log('=== KAIROS AUTOMATED TEST SUITE ===\n');
  const gemini = new GeminiService();
  const yt = new YouTubeService();
  let passed = 0;
  let total = 0;

  function assert(condition, name) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${name}`);
    }
  }

  // Test 1: Verify Curriculum Integrity
  assert(CYBER_DOMAINS.length === 5, 'Curriculum has all 5 Cybersecurity Domains');
  CYBER_DOMAINS.forEach(d => {
    assert(d.diagnostics.length >= 1, `Domain "${d.title}" has diagnostic scenarios`);
    d.diagnostics.forEach(q => {
      assert(q.el10 && q.el10Hinglish, `Scenario "${q.title}" has English & Hinglish EL10 explanations`);
      assert(q.soWhat, `Scenario "${q.title}" has "So What?" factor`);
    });
  });

  // Test 2: Verify ELI5 Tutor English Responses
  const testQueries = [
    { topic: 'Subdomain Spoofing', query: 'What is a subdomain?' },
    { topic: 'MFA Fatigue', query: 'How does push bombing work?' },
    { topic: 'JWT Security', query: 'What is alg:none in JSON Web Tokens?' },
    { topic: 'Obfuscated PowerShell', query: 'Why does malware use base64 in PowerShell?' },
    { topic: 'ARP Cache Poisoning', query: 'Explain ARP spoofing MITM' },
    { topic: 'SSRF Cloud IMDS', query: 'What happens at 169.254.169.254?' }
  ];

  for (const t of testQueries) {
    const resEn = await gemini.getELI5Explanation({ topic: t.topic, userQuery: t.query, language: 'en' });
    assert(typeof resEn === 'string' && resEn.length > 20, `ELI5 English output for "${t.topic}": ${resEn.substring(0, 60)}...`);

    const resHin = await gemini.getELI5Explanation({ topic: t.topic, userQuery: t.query, language: 'hinglish' });
    assert(typeof resHin === 'string' && resHin.length > 20, `ELI5 Hinglish output for "${t.topic}": ${resHin.substring(0, 60)}...`);
  }

  // Test 3: Verify Structured JSON Skill-Gap Generator
  const sampleMissed = CYBER_DOMAINS[0].diagnostics.slice(0, 2);
  const skillGapJSON = await gemini.generateSkillGapJSON({
    domain: CYBER_DOMAINS[0],
    missedQuestions: sampleMissed
  });

  assert(skillGapJSON.status === 'NEEDS_PRACTICE', 'Skill gap status is NEEDS_PRACTICE when questions are missed');
  assert(skillGapJSON.weaknesses.length === 2, 'Skill gap contains all 2 missed micro-weaknesses');
  assert(skillGapJSON.weaknesses[0].so_what.length > 10, 'First weakness includes "So What?" factor');
  assert(Array.isArray(skillGapJSON.recommendedPath), 'Recommended path is structured array');

  // Test 4: Verify Grounded Video Catalog
  const videoData = yt.getVideoForTopic('Subdomain Hierarchy & Lookalike Spoofing');
  assert(videoData.videoId === 'Vf6L2x5zHbg', 'YouTube video mapped correctly for Subdomain Spoofing');
  assert(videoData.cheatSheet.length === 3, 'Pre-flight cheat-sheet contains 3 key takeaways');
  assert(videoData.microNotes.length >= 2, 'AI micro-notes contain timecodes and bilingual notes');

  console.log(`\n=== TEST SUMMARY: ${passed} / ${total} TESTS PASSED ===\n`);
  if (passed === total) {
    console.log('🎉 ALL KAIROS AI AND CORE SYSTEM TESTS PASSED CLEANLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED!');
    process.exit(1);
  }
}

runTests();
