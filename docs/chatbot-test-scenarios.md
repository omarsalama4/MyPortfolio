# Chatbot Test Scenarios

Run these in the deployed portfolio chat after a deployment. The wording may vary because OpenAI writes the response, but the response should stay grounded in the listed verified context.

Source policy: every grounded portfolio answer displays up to three links from the retrieved evidence. Greetings, acknowledgements, and unsupported questions display no sources.

| Scenario | Prompt | Expected behavior |
| --- | --- | --- |
| Greeting | `hello` | A brief greeting. No portfolio sources and no OpenAI request needed. |
| Acknowledgement | `ok` | A short acknowledgement, never the unknown-information fallback. |
| Portfolio overview | `check portfolio` | An OpenAI-generated overview of Omar's AI focus, experience, education, and flagship work. |
| Location | `where is Omar` | Reports the portfolio-listed location: Cairo, Egypt. It must not claim a private residence. |
| AI projects | `What AI projects has Omar built?` | An OpenAI-generated answer grounded in the project records, including Shifaa. |
| Project detail | `Tell me about Shifaa` | A project-focused answer using Shifaa's problem, solution, metrics, and technologies. |
| Latest project | `What is Omar's latest project?` | Uses project/CV evidence. It must not treat visual display order as chronology. |
| Education | `Where did Omar study?` | Uses Ain Shams University and the University of East London. |
| Follow-up | Ask about Shifaa, then ask `What technologies does it use?` | Resolves `it` from the active chat session. |
| Unsupported topic | `How is the weather?` | Returns the verified-information fallback and does not call OpenAI. |
| Provider diagnostic | `PORTFOLIO_API_TEST_2026_08_24` | Opens connection diagnostics showing OpenAI, model, token usage, and whether fallback was used. |

For automated verification without using an API key, run `npm run test:chatbot` and `npm run test:chatbot:routes`. The route test mocks OpenAI and verifies routing, grounded context, local conversational handling, and provider-failure fallback.
