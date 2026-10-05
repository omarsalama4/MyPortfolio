# Omar Salama: Agentic AI Career Profile Audit

**Assessment date:** 2026-09-14  
**Evidence reviewed:** August 2026 CV, portfolio source and public crawl, GitHub profile and pinned repositories. LinkedIn could not be fetched publicly, so its current headline, About, experience, skills, activity, and Featured section are **not verified** in this audit.

## Executive Assessment

**Most credible positioning:** **Applied AI Engineer building computer-vision systems and AI-powered business automations.**

This is a coherent story: Shifaa supplies technical depth in real-time healthcare AI; Liver Tumor AI and Fruit & Food reinforce computer vision; MAHE provides LLM application and research evidence; Cultiv Bureau supplies the strongest RAG, workflow orchestration, API, CRM, and reliability evidence. The portfolio assistant is also a useful public artifact: it has server-side OpenAI integration, grounded retrieval, route tests, provider diagnostics, and a fallback path.

The current credibility risk is over-indexing on the label **Agentic AI Engineer** before there is a public, inspectable implementation demonstrating tool contracts, state/memory, approval controls, evaluation, and observability. “Building multi-agent systems” is valid only as internship scope unless a demonstrable architecture and sanitized example can be shown.

**First-screen outcome for an AI Engineer / Agentic AI Engineer role today:** **Maybe.** You should pass many entry-level Applied AI / AI Automation screens because of measurable projects and the Cultiv role. For an Agentic AI-specific screen, the missing public evidence for agents in production is likely to make the profile less competitive than candidates with a documented tool-using agent system.

## Professional Inventory and Skill Strength

| Area | Evidence | Strength | Positioning use |
|---|---|---:|---|
| Computer vision / deep learning | Shifaa, Liver Tumor AI, Fruit & Food, ExoNet; measurable AUROC, F1, FPS, Dice, IoU, accuracy | A | Core identity |
| Real-time inference | Shifaa uses ONNX Runtime and C++ with 37+ FPS | A | Core identity |
| Applied NLP / LLM apps | Gemini summarizer, prompt engineering, portfolio assistant | B | Supporting identity |
| RAG / retrieval | Cultiv CV bullets document chunking, embeddings, similarity search, and context injection | B | Core emerging specialty |
| Automation / integrations | n8n, REST/GraphQL APIs, webhooks, Bitrix24, WhatsApp Cloud API, retry/JSON/fallback handling | B | Core emerging specialty |
| Multi-agent systems | Cultiv scope and portfolio claim | B- | Use only with architecture/demo evidence |
| Agent tooling, MCP, memory, HITL, tracing, evaluation | No inspectable implementation supplied | C / absent | Do not headline as expertise yet |
| AWS | AWS ML Specialty; SageMaker/Lambda listed | B | Supporting |
| Flutter / Next.js / SQL / Dart | Prior full-stack work and skills | B | Supporting; do not lead with it |
| Leadership / training | ApplAi curriculum for 50+, Resala 50+ volunteers, partnerships | A | Differentiator, not primary technical claim |

### Skills to lead with

**Core:** Python, PyTorch, computer vision, real-time inference, RAG, n8n, REST APIs, webhooks, LLM integration.  
**Supporting:** ONNX Runtime, C++, OpenCV, Hugging Face Transformers, Docker, Bitrix24, WhatsApp Cloud API, AWS.  
**Secondary:** Flutter, Next.js, Dart, generic OOP/DSA, broad soft-skill labels. Keep them available but out of the hero/headline.

## Target Role Ranking

| Role | Fit / 100 | Evidence | Principal gap |
|---|---:|---|---|
| Applied AI Engineer | 84 | Measurable CV projects, deployment, real-time inference | Broader production evidence |
| AI Engineer | 82 | CV, NLP, healthcare AI, Cultiv automation | Stronger software/system design documentation |
| AI Automation Engineer | 78 | n8n, RAG, CRM, API/webhook workflows | Public sanitized automation case study |
| AI/ML Engineer | 77 | Model development and validation across projects | MLOps, testing, data/model lifecycle evidence |
| AI Solutions Engineer | 72 | CRM/WhatsApp integration and automation | Requirements/client-outcome evidence |
| Agentic AI Engineer | 60 | RAG, LLM routing, multi-agent internship scope | Tool use, state, guardrails, evals, tracing |
| LLM Engineer | 58 | Gemini app, RAG, prompts | LLM evaluation, retrieval evaluation, production reliability |
| Generative AI Engineer | 48 | LLM application work | No material generative-media or model-adaptation evidence |

**Primary targets:** Applied AI Engineer, AI Engineer, AI Automation Engineer.  
**Secondary targets:** AI/ML Engineer, AI Solutions Engineer.  
**Future target:** Agentic AI Engineer, after public implementation evidence exists.

## Project Prioritization

| Project | Score / 100 | Tier | Why |
|---|---:|---|---|
| Shifaa | 94 | 1 | Deepest architecture, healthcare relevance, real-time metrics, repo/demo/paper |
| Cultiv-style RAG automation case study | 89 once built | P0 missing | Direct bridge to AI Automation / Agentic AI roles |
| Liver Tumor AI | 82 | 1 | Strong evaluation story and live demo; wording needs risk correction |
| Fruit & Food Analysis | 78 | 2 | Competition win and strong IoU, but needs a cleaner repo/README/demo story |
| Article Summarizer Chatbot | 75 | 2 | README has demo and ROUGE results; solid LLM app but not agentic |
| ExoNet | 72 | 2 | Explainability plus NASA context; needs a clear ownership and architecture story |
| Portfolio AI Assistant | 71 | 2 | Demonstrates grounded LLM integration and tests; should be documented as a project |

### Missing GitHub work

| Priority | Repository | What must be built | Signal |
|---|---|---|---|
| P0 | `rag-crm-support-workflow` | Sanitized n8n/Python reference workflow: ingestion, chunking, embeddings, retrieval, tool calls to mock CRM, retry/fallback, approval step, test fixtures | Turns internship claims into inspectable AI Automation evidence |
| P1 | `agent-workflow-evals` | Small agent with explicit tools, state schema, stop conditions, fixture-based evals, tracing/logging, and failure cases | Proves engineering discipline beyond “agent” terminology |
| P2 | `shifaa-deployment-notes` or docs expansion | Architecture diagram, reproducible Windows/on-prem setup, benchmark methodology, limitations | Makes the flagship project easier to assess quickly |

Do not create an MCP, multi-agent, or autonomous-agent repository unless you can actually demonstrate the relevant interfaces, controls, and tests.

## GitHub Audit

The public profile presents 12 repositories and four pins. The bio is directionally correct but generic: “Computer Vision • Automation | Building practical AI systems with real-world impact.” The profile README is rich, but currently leads with CV and deployment claims while the public pins do not yet make RAG/automation easy to inspect. [GitHub profile](https://github.com/omarsalama4)

1. **Pin:** Shifaa, Liver Tumor AI, Article Summarizer, and the future `rag-crm-support-workflow`. Keep ExoNet unpinned unless it has a strong demo/README.
2. **Shifaa:** add a role/ownership note, architecture diagram, benchmark protocol, privacy/deployment boundary, setup verification, and a `limitations` section. The public repo already has a substantial structure and tests; surface those signals in the README. [Repository](https://github.com/omarelnokrashy/Shifaa-AI-Based-Patient-Monitoring-System)
3. **Liver Tumor AI:** keep pinned after changing “clinically trustworthy and ready for research/hospital use.” Patient-independent validation is strong, but hospital readiness requires clinical validation and should not be claimed. Add data provenance/licensing, split protocol, failure cases, and test/run instructions. [Repository](https://github.com/omarsalama4/liver-tumor-ai)
4. **Article Summarizer:** this is already the strongest non-CV README: it has a live demo, methodology, CNN/DailyMail reference, and ROUGE values. Add an architecture diagram, reproducible evaluation command, and limitations. [Repository](https://github.com/omarsalama4/News-Summary-chatbot)
5. **Fruit & Food:** use the full project name in the README, include the 97.69% validation-IoU definition, dataset/split, screenshots, demo instructions, and competition context.
6. Remove or correct GitHub profile README “Top 5 Finalist — ArabCAB 2026” unless you can provide proof; CV and portfolio support only “Finalist.”

## LinkedIn Recommendations

Because the public page was unavailable, apply these as a checklist rather than a claim about the current profile.

**Headline**  
`Applied AI Engineer | Computer Vision, RAG & AI Automation | Building real-time inference and API-driven workflows`

**About**  
`Applied AI Engineer with a dual degree in Computer Science and Artificial Intelligence from Ain Shams University and the University of East London. I build computer-vision, NLP, and AI-automation systems that move from model development into usable workflows. My graduation project, Shifaa, is a privacy-first patient-monitoring platform whose seizure pipeline achieved 96.69% AUROC, 90.18% F1-score, and 37+ FPS using ViViT, GNNs, OpenPose, ONNX Runtime, C++, and Python. At Cultiv Bureau, I build LLM-enabled n8n workflows with RAG, APIs, webhooks, CRM operations, and reliability controls. I am targeting Applied AI, AI Engineering, and AI Automation roles.`

**Featured:** portfolio, Shifaa demo/paper, Liver demo, Article Summarizer demo, then the future sanitized RAG automation repository.  
**Experience:** preserve official job titles; use bullets from the CV. Do not change a title to “Agentic AI Engineer.”  
**Keywords:** Applied AI, AI Engineer, Computer Vision, RAG, AI Automation, n8n, LLM Integration, Python, REST APIs, Webhooks, ONNX Runtime.

## Portfolio Recommendations

Keep Shifaa above the fold. Directly beneath it, add a separate **AI Automation & RAG** proof section only when it can show a sanitized workflow diagram, tools/integrations, reliability controls, and a measured outcome. Do not elevate “multi-agent” above your demonstrated computer-vision work until that evidence exists.

The current source contains a real portfolio assistant with server-side OpenAI configuration, retrieval, tests, provider diagnostics, and fallback behavior. Turn it into a small project entry called **Grounded Portfolio Assistant** with: architecture, scope boundary, tests, and a statement that it retrieves only from verified portfolio/CV/GitHub data. Avoid calling it a general-purpose RAG system unless embeddings/vector retrieval are actually used.

Public-crawl wording appears older than the current local source; after publishing, validate the live domain/canonical deployment and re-run metadata checks. The crawler still reports the older Fruit wording and a standalone GP Expo entry, so public cache/deployment freshness needs attention. [Portfolio](https://www.omarsalama.online/)

## Resume Filter and Strategy

**Keep:** Cultiv Bureau, Shifaa, Liver Tumor AI, Fruit & Food, Article Summarizer, dual degree, AWS ML Specialty, ApplAi teaching result (50+).  
**Rewrite:** Cultiv bullets to lead with workflow, integration, RAG, and reliability; MAHE to include the paper title/link; Shifaa to state personal contribution and metric methodology.  
**Shorten:** DEPI to one line; Notopia, Dispute, ASU Racing to one line each; general certificates to a single line.  
**Move:** Resala, IAESTE, AIESEC, long certificates, and detailed project case-study text to LinkedIn/portfolio.  
**Remove from target resume:** generic soft-skill list; training certificates that displace experience; “passionate” phrasing.  
**Add when evidenced:** public RAG workflow link, agent evaluation/trace artifact, measured automation outcome, paper citation/DOI, and test/observability evidence.

Recommended one-page order: **Name/links → headline → 3-line summary → selected experience → selected projects → technical skills → education/certifications.** Place Cultiv first, then Shifaa immediately after experience; leadership should be one line at the end if space permits.

## Agentic AI and Automation Gap Analysis

| Capability | Current evidence | Gap | Highest-ROI action |
|---|---|---|---|
| RAG / retrieval | CV documents chunking, embeddings, similarity search, context injection | No public artifact/evaluation | Build sanitized workflow + retrieval test set |
| Tool/API use | n8n, REST/GraphQL, webhooks, CRM, WhatsApp | No public tool contract | Document mock tools and error paths |
| Multi-agent workflows | Internship scope only | No architecture, roles, coordination, tests | Publish a small, real multi-step system only if permitted |
| State / memory | Conversation-history limits mentioned | No state model or persistence proof | Add explicit state schema and test cases |
| Guardrails / HITL | JSON validation, retry/fallback documented | No approval/permission evidence | Implement approval gate and audit log in reference workflow |
| Observability / evals | Portfolio assistant has route tests/diagnostics | No quality or retrieval evaluation | Add fixtures, pass/fail metrics, trace samples |
| Deployment / reliability | Docker local development, retries/fallbacks | No public runbook/CI proof | Add Docker Compose, `.env.example`, CI and failure tests |

Automation is strong enough to be a **secondary specialization** now. Do not call it production transformation impact without measured before/after evidence. Measure workflow runs, success/failure rate, manual steps removed, response time, and token cost only where your employer permits.

## Consistency Risks

| Item | Correct version / action |
|---|---|
| ArabCAB result | Use “FCIS Team Finalist” everywhere unless Top 5 proof exists; update GitHub README. |
| Cultiv tooling | CV includes GraphQL, retries, JSON validation, and Cloudflare Tunnel; portfolio emphasizes multi-agent systems and omits Cloudflare. Retain only verified current scope; standardize wording. |
| Fruit card | CV supports the full name and 97.69% validation IoU; concise portfolio title is fine if README preserves full name. |
| Shifaa readiness | Say privacy-first/on-premises project with reported metrics; do not imply clinical validation or hospital readiness. |
| LinkedIn | Unverified: compare title, dates, links, and all metrics against the CV before editing. |

## 30 / 60 / 90-Day Plan

**P0 — immediately:**
- GitHub: correct ArabCAB and clinical-readiness language; pin the four strongest projects. Low effort, high credibility.
- LinkedIn/CV/portfolio: use the one positioning sentence and synchronize Cultiv, Shifaa metrics, dates, and links. Low effort, high recruiter impact.
- Resume: create the one-page targeted version; move nontechnical leadership/certificates out of the main flow. Medium effort, high impact.

**P1 — next 60 days:**
- Build and document a sanitized RAG + CRM automation reference implementation. High effort, highest agentic/automation signal.
- Add architecture, setup, tests, screenshots, and limitations to Shifaa, Liver, Fruit, and the portfolio assistant. Medium effort, high signal.

**P2 — next 90 days:**
- Add evaluation fixtures, trace logs, approval state, and recovery scenarios to the RAG workflow. Medium/high effort, differentiating signal.
- Publish a technical post that explains one measured design choice, such as Shifaa’s latency trade-off or retrieval/fallback behavior. Medium effort.

**P3 — optional:**
- Add a targeted cloud deployment/CI example only when it supports the reference workflow; do not collect generic certificates instead of building evidence.

## Final Identity

**One-line positioning:** `Applied AI Engineer building real-time computer-vision systems and reliable LLM-powered automation workflows.`

**CV headline:** `Applied AI Engineer | Computer Vision, RAG & AI Automation`  
**GitHub bio:** `Applied AI Engineer | Computer Vision, RAG & Automation | Building reliable systems from model to workflow`  
**30-second introduction:** `I am an Applied AI Engineer with hands-on work in computer vision, real-time inference, RAG, and AI workflow automation. My strongest technical project is Shifaa, where I worked on a seizure-detection pipeline reporting 96.69% AUROC, 90.18% F1, and 37+ FPS. More recently at Cultiv Bureau, I have been building LLM-enabled n8n workflows that connect retrieval, APIs, webhooks, CRM operations, and reliability controls. I am looking for roles where I can turn AI models and LLM capabilities into dependable products and workflows.`

## Five Highest-Impact Changes Before Applying

1. Build one public, sanitized RAG/CRM automation reference project with tests and an architecture diagram.
2. Correct GitHub’s unsupported “Top 5” claim and Liver’s hospital-readiness wording.
3. Create one targeted, one-page AI Engineer / AI Automation resume with Cultiv and Shifaa as the center of gravity.
4. Pin and upgrade four repositories so each has a demo, architecture, setup, evidence, and limitations.
5. Synchronize the CV, LinkedIn, GitHub, and portfolio around “Applied AI Engineer: computer vision + RAG + automation,” without presenting multi-agent work as a proven specialization until it is publicly demonstrated.
