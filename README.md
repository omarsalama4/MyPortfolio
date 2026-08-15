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
4. Configure `OPENAI_API_KEY`, `OPENAI_BASE_URL=https://api.openai.com/v1`, and `OPENAI_MODEL=gpt-4o-mini` in Vercel. The older `LLM_*` variables remain supported for another OpenAI-compatible provider.
5. Use `/api/health` to confirm the deployed provider, model, and whether a server-side key is configured.

No API keys or private tokens belong in browser JavaScript.

If the chatbot says it could not reach the AI assistant, check:

- The serverless API is deployed.
- `https://your-api-domain.example/api/health` returns `{ "ok": true }`.
- `OPENAI_API_KEY` is configured only in the Vercel server environment; it is never sent to the browser.
- Set `CHATBOT_DEBUG=true` temporarily when investigating provider routing. Logs include provider, base URL, model, request ID, message counts, and character counts, never keys or full conversation text.
- Send a unique `PORTFOLIO_API_TEST_YYYY_MM_DD` message to exercise the provider even when no portfolio context matches; confirm its request ID and model in Vercel logs and the corresponding OpenAI project usage.
