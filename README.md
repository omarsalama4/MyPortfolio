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

The portfolio stays static on GitHub Pages. The chatbot calls a separate serverless backend through `POST /api/chat`.

1. Install dependencies: `npm install`
2. Rebuild verified knowledge after portfolio/CV edits: `npm run build-knowledge`
3. Deploy the API folder to a Node serverless host such as Vercel.
4. Configure backend environment variables from `.env.example`.
5. Set `<meta name="omar-ai-api-url" content="https://your-api-domain.example/api/chat">` in `index.html` for GitHub Pages.

No API keys or private tokens belong in browser JavaScript.

If the chatbot says it could not reach the AI assistant, check:

- The serverless API is deployed.
- `https://your-api-domain.example/api/health` returns `{ "ok": true }`.
- The `omar-ai-api-url` meta tag points to the deployed `/api/chat` URL, not the GitHub Pages domain.
- `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` are configured in the API host.
