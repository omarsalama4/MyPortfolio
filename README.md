# Omar Salama | Applied AI Engineer

The source for my professional portfolio: [omarsalama.online](https://www.omarsalama.online/).

I build reliable AI products and automation systems that connect language models, retrieval, APIs, and human workflows. My work spans retrieval-augmented generation (RAG), agentic system design, AI automation, speech intelligence, and performance-aware computer vision.

## Focus

- **LLM products and RAG:** grounded assistants, knowledge retrieval, prompt design, context control, and evaluation.
- **AI automation:** dependable workflows using n8n, REST/GraphQL APIs, webhooks, CRM integrations, OCR, and structured outputs.
- **Applied ML:** real-time inference, healthcare AI, computer vision, NLP, and speech-processing systems.
- **Engineering practice:** Python, TypeScript, Docker, testing, secure API boundaries, and production-minded debugging.

## Portfolio Experience

The site is a responsive, accessible static portfolio with an optional serverless AI assistant. It is designed for recruiters and technical reviewers to quickly understand my professional focus, experience, selected work, leadership, certifications, and contact details.

The assistant is deliberately grounded in verified portfolio, CV, resume, and GitHub context. It answers professional questions through same-origin `POST /api/chat`, does not expose API keys to the browser, and returns a clear limitation when the requested information is not verified.

## Run Locally

```bash
npm install
npm run build-knowledge
```

Open `index.html` in a browser for the static portfolio. The AI assistant requires a serverless-compatible host for the `/api/chat` endpoint.

## Environment Configuration

Configure these only in the server environment, such as Vercel. Never place API keys in client-side JavaScript or commit them to the repository.

```text
LLM_PROVIDER=openai
LLM_API_KEY=your_openai_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-5-nano
```

The equivalent `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` aliases are also supported. See [.env.example](.env.example) for the complete configuration list.

## Validate the Assistant

```bash
npm run build-knowledge
npm run test:chatbot
npm run test:chatbot:routes
```

`test:chatbot` validates verified knowledge retrieval. `test:chatbot:routes` mocks the provider and validates routing, conversation handling, grounded context, and failure fallback. Manual production checks are documented in [docs/chatbot-test-scenarios.md](docs/chatbot-test-scenarios.md).

For deployment diagnostics, call `/api/health`. During a short investigation only, set `CHATBOT_DEBUG=true`; logs omit API keys and full conversation content.

## Contact

- Portfolio: [omarsalama.online](https://www.omarsalama.online/)
- LinkedIn: [omar-mohamed-salama](https://www.linkedin.com/in/omar-mohamed-salama/)
- Email: [omarsalama117@gmail.com](mailto:omarsalama117@gmail.com)
