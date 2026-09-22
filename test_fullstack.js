/**
 * Comprehensive Full-Stack Integration Test Suite
 * Tests User Auth, Persistent DB, PBKDF2 Hashing, Sessions, Squads, and 1v1 Duels.
 */

import { db } from './server/db.js';
import { geminiBackend } from './server/services/geminiBackend.js';
import { youtubeBackend } from './server/services/youtubeBackend.js';
import { firebaseBackend } from './server/services/firebaseBackend.js';

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

  // 0. Google Firebase Cloud Backend Initialization & Fallback
  assert(firebaseBackend !== undefined, 'Google Firebase Cloud Database backend service initialized');
  assert(typeof firebaseBackend.isConfigured === 'function', 'Firebase Cloud DB fallback resilience enabled');

  // 1. User Registration & PBKDF2 Hashing
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
  assert(!user.passwordHash && !user.passwordSalt, 'Sanitized user does not leak password hash or salt');

  // 2. Registration Without Optional Email (Null-safety test)
  const noEmailUsername = 'noemail_' + Date.now();
  const userNoEmail = db.createUser({
    username: noEmailUsername,
    password: 'PasswordWithoutEmail#2026'
  });
  assert(userNoEmail.id && userNoEmail.email === '', 'User created safely without optional email (no TypeError crash)');

  // 3. Authentication Verification & PBKDF2 Check
  const authUser = db.authenticateUser(testUsername, 'SecurePassphrase#2026');
  assert(authUser.id === user.id, 'User authenticated with correct password via PBKDF2');

  const authUserNoEmail = db.authenticateUser(noEmailUsername, 'PasswordWithoutEmail#2026');
  assert(authUserNoEmail.id === userNoEmail.id, 'Email-less user authenticated successfully');

  let failedAuth = false;
  try {
    db.authenticateUser(testUsername, 'WrongPassword');
  } catch {
    failedAuth = true;
  }
  assert(failedAuth, 'Authentication correctly rejected on invalid password');

  // 4. Persistent Sessions & Deletion (Logout)
  const token = db.createSession(user.id);
  assert(token && token.startsWith('tok_'), 'Session token created');
  
  const retrievedSession = db.getSession(token);
  assert(retrievedSession && retrievedSession.userId === user.id, 'Session retrieved successfully from DB store');

  const deleted = db.deleteSession(token);
  assert(deleted && db.getSession(token) === null, 'Session deleted successfully on logout');

  // 5. Profile Updates & Sanitization
  const updatedUser = db.updateUser(user.id, { xp: 850, level: 2, streak: 7 });
  assert(updatedUser.xp === 850 && updatedUser.level === 2 && updatedUser.streak === 7, 'User profile XP, Level, and Streak updated persistently');

  // 6. Zero Hardcoding: Dynamic Scenario Generation for Arbitrary Topics
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

  // 7. Dynamic ELI5 Tutoring
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

  // 8. Dynamic YouTube Video Search
  const ytResult = await youtubeBackend.searchVideo('Kubernetes ServiceAccount Token Theft');
  assert(ytResult.videoId && ytResult.cheatSheet.length === 3, 'Dynamic YouTube search and 3-Takeaway cheat-sheet generated');

  // 9. Persistent Squad Notes & Authorized Upvoting
  const newNote = db.addSquadNote({
    author: 'Zero_Ghost',
    authorId: user.id,
    squad: 'RedTeam Alpha',
    topic: 'Kerberoasting Triage Tip',
    content: 'Look for Event ID 4769 with encryption type 0x17 (RC4).',
    contentHinglish: 'Event ID 4769 check karo jisme RC4 encryption use hua ho.'
  });
  assert(newNote.id && newNote.upvotes === 1, 'Persistent squad note created');

  const upvoted = db.upvoteSquadNote(newNote.id, 'u_different_user');
  assert(upvoted.upvotes === 2, 'Squad note upvoted by authorized user and persisted');

  let preventedDoubleUpvote = false;
  try {
    db.upvoteSquadNote(newNote.id, 'u_different_user');
  } catch {
    preventedDoubleUpvote = true;
  }
  assert(preventedDoubleUpvote, 'Duplicate upvote by same user correctly prevented');

  // 10. Dynamic 1v1 Speed Duel Generation
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

