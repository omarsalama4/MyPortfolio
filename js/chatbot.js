(function () {
  const configuredApiUrl = document.querySelector('meta[name="omar-ai-api-url"]')?.content?.trim();
  const apiUrl = window.OMAR_AI_API_URL || configuredApiUrl || localStorage.getItem('omarAiApiUrl') || '/api/chat';
  const conversationKey = 'omarAiConversationId';
  const conversationId = localStorage.getItem(conversationKey) || crypto.randomUUID();
  localStorage.setItem(conversationKey, conversationId);

  const widget = document.querySelector('[data-chatbot]');
  if (!widget) return;

  const toggle = widget.querySelector('.chatbot-toggle');
  const close = widget.querySelector('.chatbot-close');
  const panel = widget.querySelector('[data-chat-panel]');
  const form = widget.querySelector('[data-chat-form]');
  const input = widget.querySelector('[data-chat-input]');
  const messages = widget.querySelector('[data-chat-messages]');
  const suggestions = widget.querySelectorAll('[data-chat-suggestion]');
  const exportButton = widget.querySelector('[data-chat-export]');

  function setOpen(open) {
    widget.classList.toggle('chatbot-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) input.focus();
  }

  function plainMarkdown(text) {
    return String(text || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  }

  function isMarkdownTable(lines) {
    return lines.length > 1 && lines[0].includes('|') && /^\s*\|?\s*:?-{3,}:?\s*\|/.test(lines[1]);
  }

  function appendParagraph(parent, text) {
    const value = plainMarkdown(text);
    if (!value) return;
    const paragraph = document.createElement('p');
    paragraph.textContent = value;
    parent.appendChild(paragraph);
  }

  function appendTableAsList(parent, tableLines) {
    const rows = tableLines
      .filter(line => line.includes('|') && !/^\s*\|?\s*:?-{3,}:?\s*\|/.test(line))
      .map(line => line.split('|').map(cell => plainMarkdown(cell)).filter(Boolean));

    const [, ...items] = rows;
    if (!items.length) return;

    const list = document.createElement('ul');
    list.className = 'chat-list';
    items.forEach(row => {
      const item = document.createElement('li');
      item.textContent = row.join(' - ');
      list.appendChild(item);
    });
    parent.appendChild(list);
  }

  function renderAnswer(parent, text) {
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    let tableBuffer = [];
    let list = null;

    function flushTable() {
      if (tableBuffer.length) {
        if (isMarkdownTable(tableBuffer)) appendTableAsList(parent, tableBuffer);
        tableBuffer = [];
      }
    }

    lines.forEach(line => {
      if (line.includes('|')) {
        tableBuffer.push(line);
        return;
      }

      flushTable();
      const bullet = line.match(/^[-*]\s+(.*)$/);
      if (bullet) {
        if (!list) {
          list = document.createElement('ul');
          list.className = 'chat-list';
          parent.appendChild(list);
        }
        const item = document.createElement('li');
        item.textContent = plainMarkdown(bullet[1]);
        list.appendChild(item);
        return;
      }

      list = null;
      appendParagraph(parent, line.replace(/^#{1,4}\s*/, ''));
    });

    flushTable();
    if (!parent.childNodes.length) appendParagraph(parent, text);
  }

  function sourceHref(source) {
    if (!source.url) return '';

    try {
      const url = new URL(source.url, window.location.href);
      if (
        url.hash &&
        (url.hostname === window.location.hostname ||
          url.hostname === 'omarsalama4.github.io' ||
          url.hostname === 'www.omarsalama.online' ||
          url.hostname === 'omarsalama.online')
      ) {
        return url.hash;
      }
      return source.url;
    } catch {
      return source.url;
    }
  }

  function appendDiagnostics(parent, diagnostics) {
    if (!diagnostics || typeof diagnostics !== 'object') return;

    const details = document.createElement('details');
    details.className = 'chat-diagnostics';
    const summary = document.createElement('summary');
    summary.textContent = 'Connection diagnostics';
    details.appendChild(summary);

    const list = document.createElement('dl');
    const fields = [
      ['Provider', diagnostics.provider],
      ['Model', diagnostics.model],
      ['Model response received', diagnostics.providerResponseReceived],
      ['Fallback used', diagnostics.fallbackUsed],
      ['Error status', diagnostics.errorStatus],
      ['Prompt tokens', diagnostics.usage?.promptTokens],
      ['Completion tokens', diagnostics.usage?.completionTokens],
      ['Total tokens', diagnostics.usage?.totalTokens],
      ['Backend request ID', diagnostics.backendRequestId],
      ['Provider request ID', diagnostics.providerRequestId]
    ];

    fields.forEach(([label, value]) => {
      if (value === null || value === undefined || value === '') return;
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = String(value);
      list.append(term, description);
    });

    if (list.childNodes.length) {
      details.appendChild(list);
      parent.appendChild(details);
    }
  }

  function messageNode(text, role, sources, diagnostics) {
    const item = document.createElement('div');
    item.className = `chat-message ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (role === 'assistant') {
      renderAnswer(bubble, text);
    } else {
      bubble.textContent = text;
    }
    item.appendChild(bubble);

    if (sources && sources.length) {
      const list = document.createElement('div');
      list.className = 'chat-sources';
      list.textContent = 'Sources: ';
      sources.slice(0, 4).forEach((source, index) => {
        if (index) list.appendChild(document.createTextNode(', '));
        const href = sourceHref(source);
        if (href) {
          const link = document.createElement('a');
          link.href = href;
          if (!href.startsWith('#')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          link.textContent = source.title || source.type;
          list.appendChild(link);
        } else {
          const span = document.createElement('span');
          span.textContent = source.title || source.type;
          list.appendChild(span);
        }
      });
      item.appendChild(list);
    }

    if (role === 'assistant') appendDiagnostics(item, diagnostics);

    return item;
  }

  function appendMessage(text, role, sources) {
    const node = messageNode(text, role, sources);
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
  }

  function transcriptEntries() {
    return [...messages.querySelectorAll('.chat-message')]
      .map(message => ({
        role: message.classList.contains('user') ? 'You' : "Omar's AI",
        text: message.querySelector('.chat-bubble')?.innerText.trim() || ''
      }))
      .filter(entry => entry.text && entry.text !== 'Thinking...');
  }

  function updateExportAvailability() {
    if (!exportButton) return;
    exportButton.disabled = transcriptEntries().length < 2;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function exportConversation() {
    const entries = transcriptEntries();
    if (entries.length < 2) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      appendMessage('Please allow pop-ups to export this conversation as a PDF.', 'assistant');
      return;
    }

    const exportedAt = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date());
    const conversation = entries.map(entry => `
      <section class="message ${entry.role === 'You' ? 'user' : 'assistant'}">
        <p class="speaker">${entry.role}</p>
        <div class="bubble">${escapeHtml(entry.text).replace(/\n/g, '<br>')}</div>
      </section>
    `).join('');

    printWindow.opener = null;
    printWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Omar Salama - Portfolio Conversation</title>
          <style>
            @page { margin: 16mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #102033; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.55; }
            .page { max-width: 760px; margin: 0 auto; }
            header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 18px; border-bottom: 2px solid #0ea5e9; }
            .eyebrow { margin: 0 0 4px; color: #0369a1; font-size: 9pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            h1 { margin: 0; color: #0f172a; font-size: 23pt; line-height: 1.1; }
            .subtitle { margin: 7px 0 0; color: #475569; }
            .meta { color: #64748b; font-size: 9pt; text-align: right; white-space: nowrap; }
            main { padding: 24px 0; }
            .message { margin: 0 0 18px; break-inside: avoid; }
            .speaker { margin: 0 0 5px; color: #475569; font-size: 9pt; font-weight: 700; }
            .bubble { padding: 12px 14px; border: 1px solid #dbeafe; border-radius: 8px; background: #f8fafc; }
            .user { margin-left: 13%; }
            .user .speaker { text-align: right; }
            .user .bubble { border-color: #bae6fd; background: #e0f2fe; }
            footer { padding-top: 14px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 8.5pt; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="page">
            <header>
              <div>
                <p class="eyebrow">Verified Portfolio Conversation</p>
                <h1>Omar Salama</h1>
                <p class="subtitle">AI Engineer | Computer Vision | NLP | Healthcare AI</p>
              </div>
              <p class="meta">Exported ${escapeHtml(exportedAt)}<br>omarsalama.online</p>
            </header>
            <main>${conversation}</main>
            <footer>Conversation generated by Omar Salama's AI Portfolio Assistant. Responses are grounded in the public portfolio, CV, and GitHub knowledge base.</footer>
          </div>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
  }

  async function ask(question) {
    const text = question.trim();
    if (!text) {
      appendMessage('Please type a question first.', 'assistant');
      return;
    }
    if (text.length > 900) {
      appendMessage('Please keep your question shorter so I can answer it reliably.', 'assistant');
      return;
    }

    appendMessage(text, 'user');
    updateExportAvailability();
    input.value = '';
    const thinking = appendMessage('Thinking...', 'assistant');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId })
      });

      if (response.status === 429) {
        thinking.replaceWith(messageNode("You're sending requests too quickly. Please try again in a moment.", 'assistant'));
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error === 'message_too_long'
          ? 'Please keep your question shorter so I can answer it reliably.'
          : 'The AI assistant is temporarily unavailable. Please try again in a moment.';
        thinking.replaceWith(messageNode(message, 'assistant'));
        return;
      }

      const data = await response.json();
      thinking.replaceWith(messageNode(
        data.answer || "I don't have verified information about that in Omar's available sources.",
        'assistant',
        data.sources || [],
        data.diagnostics
      ));
      messages.scrollTop = messages.scrollHeight;
      updateExportAvailability();
    } catch {
      thinking.replaceWith(messageNode("Sorry, I couldn't reach the AI assistant. Please try again.", 'assistant'));
    }
  }

  toggle.addEventListener('click', () => setOpen(!widget.classList.contains('chatbot-open')));
  close.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });
  suggestions.forEach(button => {
    button.addEventListener('click', () => {
      setOpen(true);
      ask(button.dataset.question || button.textContent);
    });
  });
  exportButton?.addEventListener('click', exportConversation);
  updateExportAvailability();
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.classList.contains('chatbot-open')) setOpen(false);
  });
}());
