import { retrieveKnowledge } from '../lib/knowledge.js';

const questions = [
  'Tell me about Omar.',
  'What AI projects has Omar built?',
  'Tell me about Shifaa.',
  'What technologies does Omar use?',
  'What is Omar\'s Computer Vision experience?',
  'What is Omar\'s Agentic AI experience?',
  'What certifications does Omar have?',
  'Where did Omar study?',
  'Show me Omar\'s GitHub projects.',
  'Why should I hire Omar as an AI Engineer?',
  'What is Omar\'s experience with technology XYZ?'
];

let failures = 0;
for (const question of questions) {
  const matches = retrieveKnowledge(question, { limit: 3 });
  console.log(`\nQ: ${question}`);
  console.log(matches.map(match => `- ${match.source}: ${match.title}`).join('\n') || '- no local match');
  if (!matches.length && !question.includes('XYZ') && !question.includes('GitHub')) failures += 1;
}

if (failures) {
  console.error(`\n${failures} expected questions did not retrieve local context.`);
  process.exitCode = 1;
}
