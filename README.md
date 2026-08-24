#  Personal Portfolio Website

This is my **personal portfolio website**, 
It showcases my skills, projects, and experience as a **AI Engineer**.

---

##  Features
- Responsive and modern UI
- Dynamic projects section
- (skills, projects, blog posts)
- Clean code, scalable, and easy to maintain

---

##  Check it out
- try it: [My Portfolio](https://omarsalama4.github.io/MyPortfolio/)

---

## Ask Omar's AI

The portfolio and chatbot API are deployed together on Vercel. The chatbot calls the same-origin serverless endpoint through `POST /api/chat`.

1. Install dependencies: `npm install`
2. Rebuild verified knowledge after portfolio/CV edits: `npm run build-knowledge`
3. Deploy the repository to Vercel with the root directory set to the repository root.
4. Configure the OpenAI server-side variables in Vercel. The generic `LLM_*` names match the Vercel-style environment variable screen:

   ```text
   LLM_PROVIDER=openai
   LLM_API_KEY=your_openai_api_key
   LLM_BASE_URL=https://api.openai.com/v1
   LLM_MODEL=gpt-5-nano
   ```

   The OpenAI-native aliases are also supported:

   ```text
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-5-nano
   ```

   Do not use a Groq key here. An OpenAI provider call requires an OpenAI API key.
5. Use `/api/health` to confirm the deployed provider, model, and whether a server-side key is configured.

No API keys or private tokens belong in browser JavaScript.

If the chatbot says it could not reach the AI assistant, check:

- The serverless API is deployed.
- `https://your-api-domain.example/api/health` returns `{ "ok": true }`.
- `OPENAI_API_KEY` is configured only in the Vercel server environment; it is never sent to the browser.
- Run `npm run test:chatbot` for knowledge retrieval coverage and `npm run test:chatbot:routes` for mocked end-to-end routing coverage. Manual production prompts and expected behavior are in `docs/chatbot-test-scenarios.md`.
- Set `CHATBOT_DEBUG=true` temporarily when investigating provider routing. Logs include provider, base URL, model, request ID, message counts, and character counts, never keys or full conversation text.
- Send a unique `PORTFOLIO_API_TEST_YYYY_MM_DD` message to exercise the provider even when no portfolio context matches. Its response includes safe diagnostics such as the backend request ID, OpenAI request ID, model, token usage, and whether fallback was used.
