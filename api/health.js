export default function handler(req, res) {
  const baseUrl = (
    process.env.OPENAI_BASE_URL ||
    process.env.LLM_BASE_URL ||
    'https://api.openai.com/v1'
  ).replace(/\/$/, '');
  const configuredModel = process.env.OPENAI_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini';
  const model = configuredModel.trim().toLowerCase() === 'gpt-5 nano'
    ? 'gpt-5-nano'
    : configuredModel;
  const provider = baseUrl.includes('api.openai.com') ? 'OpenAI' : 'OpenAI-compatible endpoint';

  res.status(200).json({
    ok: true,
    service: 'omar-ai-assistant',
    provider,
    baseUrl,
    model,
    configured: Boolean(process.env.OPENAI_API_KEY || process.env.LLM_API_KEY)
  });
}
