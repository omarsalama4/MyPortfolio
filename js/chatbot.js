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

  function messageNode(text, role, sources) {
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

    return item;
  }

  function appendMessage(text, role, sources) {
    const node = messageNode(text, role, sources);
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
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

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      thinking.replaceWith(messageNode(
        data.answer || "I don't have verified information about that in Omar's available sources.",
        'assistant',
        data.sources || []
      ));
      messages.scrollTop = messages.scrollHeight;
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
      ask(button.textContent);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.classList.contains('chatbot-open')) setOpen(false);
  });
}());
