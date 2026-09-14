process.env.MAX_REQUESTS_PER_MINUTE = '100';

let providerMode = 'success';
let providerCalls = [];

globalThis.fetch = async (url, options = {}) => {
  if (String(url).includes('api.github.com')) {
    return { ok: false, status: 503 };
  }

  providerCalls.push(JSON.parse(options.body || '{}'));
  if (providerMode === 'failure') {
    return {
      ok: false,
      status: 503,
      headers: { get: () => null }
    };
  }

  return {
    ok: true,
    headers: { get: () => 'test-openai-request-id' },
    json: async () => ({
      choices: [{ message: { content: '### Grounded response\nA concise answer from verified context.\n- First verified detail.\n- Second verified detail.\nIf you want, I can add more detail.\nSources: model-invented-link' } }],
      usage: { prompt_tokens: 120, completion_tokens: 12, total_tokens: 132 }
    })
  };
};

const { default: handler } = await import('../api/chat.js');
const UNKNOWN_ANSWER = "I don't have verified information about that in Omar's portfolio, CV, or GitHub.";
let failures = 0;

async function ask(message, conversationId = `test-${Math.random().toString(36).slice(2)}`) {
  let body;
  const response = {
    setHeader() {},
    status() { return this; },
    json(value) { body = value; return this; },
    end() { return this; }
  };

  await handler({
    method: 'POST',
    body: { message, conversationId },
    headers: {},
    socket: { remoteAddress: conversationId }
  }, response);
  return body;
}

async function assertCase(name, message, options = {}) {
  providerMode = options.providerMode || 'success';
  const before = providerCalls.length;
  const response = await ask(message, options.conversationId);
  const providerCalled = providerCalls.length > before;
  const request = providerCalls.at(-1);
  const context = request?.messages?.[1]?.content || '';
  const passes = [
    providerCalled === Boolean(options.expectProvider),
    !options.answerIncludes || response.answer.includes(options.answerIncludes),
    !response.answer.includes('Sources:'),
    !response.answer.includes('If you want'),
    response.answer.split(/\s+/).filter(Boolean).length <= 120,
    !options.expectStructured || (/^### /m.test(response.answer) && /\n- /.test(response.answer)),
    !options.contextIncludes || options.contextIncludes.every(value => context.includes(value)),
    options.expectedSourceCount === undefined || response.sources.length === options.expectedSourceCount,
    !options.expectedSourceUrl || response.sources.some(source => source.url === options.expectedSourceUrl)
  ].every(Boolean);

  console.log(`${passes ? 'PASS' : 'FAIL'} ${name}`);
  if (!passes) {
    console.log({ response, providerCalled, requiredContext: options.contextIncludes, context });
    failures += 1;
  }
}

await assertCase('greeting stays local', 'hello', {
  expectProvider: false,
  answerIncludes: "Omar Salama's AI Portfolio Assistant",
  expectedSourceCount: 0
});
await assertCase('acknowledgement stays conversational', 'ok', {
  expectProvider: false,
  answerIncludes: 'Got it.',
  expectedSourceCount: 0
});
await assertCase('CV download stays local and returns its document', 'download Omar\'s CV', {
  expectProvider: false,
  answerIncludes: 'CV below.',
  expectedSourceCount: 1,
  expectedSourceUrl: '/Omar_Salama_CV.pdf'
});
await assertCase('resume download stays local and returns its document', 'download Omar\'s resume', {
  expectProvider: false,
  answerIncludes: 'resume below.',
  expectedSourceCount: 1,
  expectedSourceUrl: '/Omar_Salama_Resume.pdf'
});
await assertCase('resume availability returns its document', 'do you have the resume?', {
  expectProvider: false,
  answerIncludes: 'resume below.',
  expectedSourceCount: 1,
  expectedSourceUrl: '/Omar_Salama_Resume.pdf'
});
await assertCase('CV and resume request returns both documents', 'download CV and resume', {
  expectProvider: false,
  answerIncludes: 'CV and resume below.',
  expectedSourceCount: 2
});
await assertCase('resume-content question uses grounded retrieval', 'what does the resume contain?', {
  expectProvider: true,
  contextIncludes: ['Omar Salama Resume'],
  expectedSourceCount: 0,
  expectStructured: true
});
await assertCase('vague portfolio request uses OpenAI RAG', 'check portfolio', {
  expectProvider: true,
  contextIncludes: ['About Me', 'Featured Projects'],
  expectedSourceCount: 0
});
await assertCase('location request uses contact context', 'where is Omar', {
  expectProvider: true,
  contextIncludes: ['Contact', 'Cairo, Egypt'],
  expectedSourceCount: 0
});
await assertCase('project request uses project context', 'What AI projects has Omar built?', {
  expectProvider: true,
  contextIncludes: ['Shifaa - AI-Based Patient Monitoring Platform'],
  expectedSourceCount: 0
});
await assertCase('latest-project request uses chronology context', "What is Omar's latest project?", {
  expectProvider: true,
  contextIncludes: ['Shifaa - AI-Based Patient Monitoring Platform', 'Fruit & Food Segmentation and Calorie Estimation'],
  expectedSourceCount: 0
});
await assertCase('unsupported topic avoids the provider', 'how is the weather?', {
  expectProvider: false,
  answerIncludes: UNKNOWN_ANSWER,
  expectedSourceCount: 0
});
await assertCase('provider failure uses verified fallback', 'Tell me about Shifaa.', {
  expectProvider: true,
  providerMode: 'failure',
  answerIncludes: 'Shifaa',
  expectedSourceCount: 0
});

providerMode = 'success';
const followUpConversationId = 'follow-up-context';
await ask('Tell me about Shifaa.', followUpConversationId);
const beforeFollowUp = providerCalls.length;
const followUpResponse = await ask('What technologies does it use?', followUpConversationId);
const followUpContext = providerCalls.at(-1)?.messages?.[1]?.content || '';
const followUpPasses = providerCalls.length > beforeFollowUp &&
  followUpContext.includes('Shifaa - AI-Based Patient Monitoring Platform') &&
  followUpResponse.sources.length === 0;
console.log(`${followUpPasses ? 'PASS' : 'FAIL'} follow-up keeps prior portfolio context`);
if (!followUpPasses) failures += 1;

if (failures) process.exitCode = 1;
