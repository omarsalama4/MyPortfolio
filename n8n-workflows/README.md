# n8n AI Workflow Templates

Reusable n8n templates for AI automation, sentiment analysis, retrieval-augmented generation (RAG), and tool-using chat agents.

These workflows are intentionally published as **inactive templates**. Credential bindings, tenant IDs, email targets, webhook paths, vector collection names, document sources, and domain-specific prompts have been removed or replaced with `REPLACE_WITH_*` placeholders.

## Included Templates

| Template | Demonstrates | Primary services |
|---|---|---|
| `multi-channel-automation-starter.json` | Chat, form, webhook, schedule, Gmail, Sheets, Airtable, and LLM starter nodes | OpenAI, Google Sheets, Gmail, Airtable |
| `sentiment-analysis-openai.json` | Form input, OpenAI sentiment analysis, and Sheets logging | OpenAI, Google Sheets |
| `sentiment-analysis-ollama.json` | Local-model sentiment analysis with Sheets logging | Ollama, Google Sheets |
| `chat-agent-ollama.json` | Basic chat-triggered agent using a local model | Ollama |
| `email-sheets-agent.json` | Chat agent with email, Sheets, and memory tools | OpenAI, Gmail, Google Sheets |
| `google-drive-qdrant-ingestion.json` | Drive-triggered document ingestion into Qdrant | Google Drive, OpenAI, Qdrant |
| `google-drive-qdrant-rag-agent.json` | Drive ingestion plus a chat agent that queries Qdrant | Google Drive, OpenAI, Qdrant |
| `pinecone-rag-agent-sync.json` | Scheduled Drive sync, document splitting, Pinecone ingestion, and RAG chat | Google Drive, OpenAI, Pinecone, Google Sheets |

## Import and Configure

1. In n8n, select **Import from File** and choose a JSON file from [`templates`](./templates).
2. Create the required native credentials in n8n. Credentials are never stored in these files.
3. Open each node with a `REPLACE_WITH_*` value and set the appropriate ID, collection/index, field, recipient, or prompt.
4. Review every trigger and outbound node before activating the workflow.
5. Test with non-production data first. Do not activate an email, webhook, Airtable, Drive, or Sheets action until its destination is confirmed.

## Required Credential Types

Use n8n's credential system rather than placing keys in node parameters.

- **OpenAI**: OpenAI API credential for chat models and embeddings.
- **Ollama**: local Ollama connection for local model templates.
- **Google Drive / Sheets / Gmail**: Google OAuth2 credentials with the minimum scopes needed.
- **Qdrant**: Qdrant API credential and a configured collection.
- **Pinecone**: Pinecone API credential and a configured index.
- **Airtable**: Airtable Personal Access Token credential.

## Security and Scope

- No OCR workflow is included.
- No API keys, OAuth tokens, emails, personal files, execution data, or binary assets are included.
- These are learning and reference templates, not claims of a specific production deployment or business outcome.
- Importing a template does not make it safe to activate. Validate its data access, downstream actions, rate limits, and error handling for your environment.

## Notes for Recruiters

The templates demonstrate practical workflow architecture across RAG ingestion, vector retrieval, LLM calls, agent tools, memory, forms, webhooks, schedules, and SaaS integrations. They are deliberately configuration-neutral so they can be reviewed without exposing client or employer data.
