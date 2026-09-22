/**
 * Comprehensive Full-Stack Integration Test Suite
 * Tests User Auth, Persistent DB, Dynamic Gemini Synthesis, Squads, and 1v1 Duels.
 */

import { db } from './server/db.js';
import { geminiBackend } from './server/services/geminiBackend.js';
import { youtubeBackend } from './server/services/youtubeBackend.js';

async function runFullStackTests() {
  console.log('=== KAIROS FULL-STACK & ZERO-HARDCODING TEST SUITE ===\n');
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

  // 1. User Registration & Password Hashing
  const testUsername = 'operative_' + Date.now();
  const testEmail = `${testUsername}@cybercorp.io`;
  const user = db.createUser({
    username: testUsername,
    email: testEmail,
    password: 'SecurePassphrase#2026',
    callSign: 'Zero_Ghost',
    squad: 'RedTeam Alpha'
  });

  assert(user.id && user.id.startsWith('usr_'), 'User created with persistent ID');
  assert(user.username === testUsername, 'Username stored correctly');
  assert(!user.passwordHash, 'Sanitized user does not leak password hash');

  // 2. Authentication Verification
  const authUser = db.authenticateUser(testUsername, 'SecurePassphrase#2026');
  assert(authUser.id === user.id, 'User authenticated with correct password');

  let failedAuth = false;
  try {
    db.authenticateUser(testUsername, 'WrongPassword');
  } catch {
    failedAuth = true;
  }
  assert(failedAuth, 'Authentication correctly rejected on invalid password');

  // 3. Profile Updates
  const updatedUser = db.updateUser(user.id, { xp: 850, level: 2, streak: 7 });
  assert(updatedUser.xp === 850 && updatedUser.level === 2 && updatedUser.streak === 7, 'User profile XP, Level, and Streak updated persistently');

  // 4. Zero Hardcoding: Dynamic Scenario Generation for Arbitrary Topics
  console.log('\nTesting 100% Dynamic AI Synthesis for custom topics...');
  const customTopics = [
    'Active Directory Kerberoasting',
    'Kubernetes ServiceAccount Token Theft',
    'Smart Contract Reentrancy'
  ];

  for (const topic of customTopics) {
    const generated = await geminiBackend.generateScenariosForTopic({ topic, tier: 1, language: 'en' });
    assert(generated && generated.scenarios && generated.scenarios.length >= 1, `Synthesized dynamic scenarios for: "${topic}"`);
    assert(generated.scenarios[0].evidence, `Dynamic scenario contains technical evidence artifact`);
    assert(generated.scenarios[0].el10, `Dynamic scenario contains EL10 mental model`);
    assert(generated.scenarios[0].soWhat, `Dynamic scenario contains "So What?" production impact`);
  }

  // 5. Dynamic ELI5 Tutoring
  const tutorEn = await geminiBackend.getELI5Explanation({
    topic: 'Kerberoasting',
    userQuery: 'How does an SPN ticket request work?',
    language: 'en'
  });
  assert(typeof tutorEn === 'string' && tutorEn.length > 20, 'Dynamic ELI5 English tutor response generated');

  const tutorHin = await geminiBackend.getELI5Explanation({
    topic: 'Kerberoasting',
    userQuery: 'SPN ticket kaise churate hain?',
    language: 'hinglish'
  });
  assert(typeof tutorHin === 'string' && tutorHin.length > 20, 'Dynamic ELI5 Hinglish tutor response generated');

  // 6. Dynamic YouTube Video Search
  const ytResult = await youtubeBackend.searchVideo('Kubernetes ServiceAccount Token Theft');
  assert(ytResult.videoId && ytResult.cheatSheet.length === 3, 'Dynamic YouTube search and 3-Takeaway cheat-sheet generated');

  // 7. Persistent Squad Notes & Live Upvoting
  const newNote = db.addSquadNote({
    author: 'Zero_Ghost',
    authorId: user.id,
    squad: 'RedTeam Alpha',
    topic: 'Kerberoasting Triage Tip',
    content: 'Look for Event ID 4769 with encryption type 0x17 (RC4).',
    contentHinglish: 'Event ID 4769 check karo jisme RC4 encryption use hua ho.'
  });
  assert(newNote.id && newNote.upvotes === 1, 'Persistent squad note created');

  const upvoted = db.upvoteSquadNote(newNote.id);
  assert(upvoted.upvotes === 2, 'Squad note upvoted and persisted in database');

  // 8. Dynamic 1v1 Speed Duel Generation
  const duelRound = geminiBackend.generateDuelRound('Cloud IAM');
  assert(duelRound.question && duelRound.options.length >= 3, 'Dynamic 1v1 Speed Duel round generated');

  console.log(`\n=== FULL-STACK TEST SUMMARY: ${passed} / ${total} TESTS PASSED ===\n`);
  if (passed === total) {
    console.log('🎉 ALL FULL-STACK, AUTHENTICATION & DYNAMIC SYNTHESIS TESTS PASSED CLEANLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED!');
    process.exit(1);
  }
}

runFullStackTests();
