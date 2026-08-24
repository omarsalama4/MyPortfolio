import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const knowledgePath = path.join(rootDir, 'data', 'knowledge.json');

const STOP_WORDS = new Set([
  'a', 'about', 'after', 'all', 'also', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'built', 'by', 'can', 'did',
  'do', 'does', 'for', 'from', 'had', 'has', 'have', 'he', 'his', 'how', 'i', 'in', 'is', 'it', 'me', 'of', 'omar',
  'on', 'or', 's', 'salama', 'show', 'tell', 'that', 'the', 'this', 'to', 'use', 'used', 'uses', 'was', 'were', 'what',
  'when', 'where', 'which', 'who', 'why', 'with', 'would', 'ai', 'api', 'current', 'portfolio', 'test', 'today'
]);

export function loadKnowledge() {
  const raw = fs.readFileSync(knowledgePath, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.chunks) ? parsed.chunks : [];
}

export function tokenize(text = '') {
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .split(/\s+/)
    .map(token => token.replace(/^\.+|\.+$/g, ''))
    .filter(token => token.length > 1 && !STOP_WORDS.has(token) && !/^\d+$/.test(token));
  const normalizedTokens = tokens.flatMap(token => {
    if (token.endsWith('ies') && token.length > 4) return [token, `${token.slice(0, -3)}y`];
    if (token.endsWith('s') && token.length > 3) return [token, token.slice(0, -1)];
    return [token];
  });
  if (normalizedTokens.includes('agentic')) normalizedTokens.push('agent', 'multi', 'multi-agent');
  if (normalizedTokens.includes('study') || normalizedTokens.includes('studied')) normalizedTokens.push('education', 'degree', 'university');
  if (normalizedTokens.includes('technologies') || normalizedTokens.includes('technology')) normalizedTokens.push('skill', 'skills');
  if (normalizedTokens.includes('agents')) normalizedTokens.push('agent');
  return normalizedTokens;
}

function chunkText(chunk) {
  return [
    chunk.title,
    chunk.type,
    chunk.source,
    chunk.content,
    chunk.metadata?.technologies?.join(' '),
    chunk.metadata?.topics?.join(' ')
  ].filter(Boolean).join(' ');
}

export function retrieveKnowledge(question, options = {}) {
  const chunks = options.chunks || loadKnowledge();
  const limit = options.limit || 7;
  const queryTokens = tokenize(question);
  const querySet = new Set(queryTokens);
  const normalizedQuestion = String(question).toLowerCase();
  const isPortfolioDomainQuestion = /\b(omar|salama|portfolio|cv|resume|github|project|experience|skill|education|certification|career|work)\b/.test(normalizedQuestion);
  const ranked = chunks
    .map(chunk => {
      const text = chunkText(chunk);
      const normalizedText = text.toLowerCase();
      const tokens = tokenize(text);
      const tokenSet = new Set(tokens);
      const overlap = queryTokens.filter(token => tokenSet.has(token)).length;
      const phraseBoost = queryTokens.reduce((score, token) => {
        return score + (normalizedText.includes(token) ? 0.35 : 0);
      }, 0);
      const titleBoost = tokenize(chunk.title).filter(token => querySet.has(token)).length * 2;
      const typeBoost = queryTokens.includes(chunk.type) ? 1.5 : 0;
      const sourceBoost = chunk.source === 'portfolio' ? 0.25 : 0;
      return { chunk, score: overlap + phraseBoost + titleBoost + typeBoost + sourceBoost, overlap, titleBoost };
    })
    .filter(item => item.overlap > 0 || item.titleBoost > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.chunk);

  if (ranked.length || !isPortfolioDomainQuestion) return ranked.slice(0, limit);

  // A portfolio question can be short, misspelled, or context-dependent. In that
  // case, provide a balanced profile snapshot for the model to interpret.
  const profileOrder = ['about', 'resume', 'contact', 'experience', 'project', 'skill'];
  return profileOrder
    .map(type => chunks.find(chunk => chunk.type === type))
    .filter(Boolean)
    .slice(0, limit);
}

export function selectRelevantResources(chunks) {
  const seen = new Set();
  return chunks
    .filter(chunk => chunk.url)
    .map(chunk => ({ type: chunk.source, title: chunk.title, url: chunk.url }))
    .filter(resource => {
    if (seen.has(resource.url)) return false;
    seen.add(resource.url);
    return true;
    })
    .slice(0, 3);
}

export function formatContext(chunks, options = {}) {
  const maxChars = options.maxChars || Infinity;
  const maxChunkChars = options.maxChunkChars || Infinity;
  const includeUrls = options.includeUrls !== false;
  let remaining = maxChars;

  return chunks.reduce((context, chunk, index) => {
    if (remaining <= 0) return context;

    const url = includeUrls && chunk.url ? `\nURL: ${chunk.url}` : '';
    const content = String(chunk.content || '').slice(0, maxChunkChars);
    const entry = `[${index + 1}] Source: ${chunk.source}; Type: ${chunk.type}; Title: ${chunk.title}${url}\n${content}`;
    const trimmed = entry.slice(0, remaining);
    remaining -= trimmed.length + 2;
    return context ? `${context}\n\n${trimmed}` : trimmed;
  }, '');
}

export function uniqueSources(chunks) {
  const seen = new Set();
  return chunks
    .map(chunk => ({
      type: chunk.source,
      title: chunk.title,
      url: chunk.url || undefined
    }))
    .filter(source => {
      const key = `${source.type}:${source.title}:${source.url || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
