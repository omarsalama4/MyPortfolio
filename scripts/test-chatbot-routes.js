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
      choices: [{ message: { content: 'Grounded model response.' } }],
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
    !options.contextIncludes || options.contextIncludes.every(value => context.includes(value))
  ].every(Boolean);

  console.log(`${passes ? 'PASS' : 'FAIL'} ${name}`);
  if (!passes) {
    console.log({ response, providerCalled, requiredContext: options.contextIncludes, context });
    failures += 1;
  }
}

await assertCase('greeting stays local', 'hello', {
  expectProvider: false,
  answerIncludes: "Omar Salama's AI Portfolio Assistant"
});
await assertCase('acknowledgement stays conversational', 'ok', {
  expectProvider: false,
  answerIncludes: 'Got it.'
});
await assertCase('vague portfolio request uses OpenAI RAG', 'check portfolio', {
  expectProvider: true,
  contextIncludes: ['About Me', 'Featured Projects']
});
await assertCase('location request uses contact context', 'where is Omar', {
  expectProvider: true,
  contextIncludes: ['Contact', 'Cairo, Egypt']
});
await assertCase('project request uses project context', 'What AI projects has Omar built?', {
  expectProvider: true,
  contextIncludes: ['Shifaa - AI-Based Patient Monitoring Platform']
});
await assertCase('latest-project request uses chronology context', "What is Omar's latest project?", {
  expectProvider: true,
  contextIncludes: ['Shifaa - AI-Based Patient Monitoring Platform', 'Fruit & Food Segmentation and Calorie Estimation']
});
await assertCase('unsupported topic avoids the provider', 'how is the weather?', {
  expectProvider: false,
  answerIncludes: UNKNOWN_ANSWER
});
await assertCase('provider failure uses verified fallback', 'Tell me about Shifaa.', {
  expectProvider: true,
  providerMode: 'failure',
  answerIncludes: 'Shifaa'
});

if (failures) process.exitCode = 1;
