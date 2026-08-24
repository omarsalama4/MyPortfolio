export default function handler(req, res) {
  const requestedProvider = (process.env.LLM_PROVIDER || process.env.OPENAI_PROVIDER || 'openai').trim().toLowerCase();
  const baseUrl = (
    process.env.OPENAI_BASE_URL ||
    process.env.LLM_BASE_URL ||
    'https://api.openai.com/v1'
  ).replace(/\/$/, '');
  const configuredModel = process.env.OPENAI_MODEL || process.env.LLM_MODEL || 'gpt-5-nano';
  const model = configuredModel.trim().toLowerCase() === 'gpt-5 nano'
    ? 'gpt-5-nano'
    : configuredModel;
  const provider = requestedProvider === 'openai' || baseUrl.includes('api.openai.com')
    ? 'OpenAI'
    : 'OpenAI-compatible endpoint';
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || '';

  res.status(200).json({
    ok: true,
    service: 'omar-ai-assistant',
    provider,
    requestedProvider,
    baseUrl,
    model,
    configured: Boolean(apiKey),
    keyLooksLikeOpenAI: Boolean(apiKey && !/^gsk_/i.test(apiKey))
  });
}
