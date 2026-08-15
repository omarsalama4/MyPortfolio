import { loadKnowledge, retrieveKnowledge, selectRelevantResources } from '../lib/knowledge.js';

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

const localKnowledge = loadKnowledge();
const resourceCases = [
  ['Tell me about Omar.', 0],
  ['Can I see Omar\'s CV?', 1],
  ['What AI projects has Omar built?', 4]
];

for (const [question, expectedMaximum] of resourceCases) {
  const resources = selectRelevantResources(question, retrieveKnowledge(question, { limit: 8 }));
  console.log(`\nResources Q: ${question}`);
  console.log(resources.map(resource => `- ${resource.title}: ${resource.url}`).join('\n') || '- none');
  if (resources.length > expectedMaximum) failures += 1;
  if (question.includes('CV') && resources[0]?.url !== '/Omar_Salama_CV.pdf') failures += 1;
}

if (!localKnowledge.length) {
  console.error('Knowledge base is empty.');
  failures += 1;
}

if (failures) {
  console.error(`\n${failures} expected questions did not retrieve local context.`);
  process.exitCode = 1;
}
