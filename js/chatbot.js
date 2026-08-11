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

  function messageNode(text, role, sources) {
    const item = document.createElement('div');
    item.className = `chat-message ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    item.appendChild(bubble);

    if (sources && sources.length) {
      const list = document.createElement('div');
      list.className = 'chat-sources';
      list.textContent = 'Source: ';
      sources.slice(0, 4).forEach((source, index) => {
        if (index) list.appendChild(document.createTextNode(', '));
        if (source.url) {
          const link = document.createElement('a');
          link.href = source.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
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
