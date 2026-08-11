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
  'when', 'where', 'which', 'who', 'why', 'with', 'would'
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
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
  if (tokens.includes('agentic')) tokens.push('agent', 'multi', 'multi-agent');
  if (tokens.includes('study') || tokens.includes('studied')) tokens.push('education', 'degree', 'university');
  if (tokens.includes('technologies') || tokens.includes('technology')) tokens.push('skill', 'skills');
  return tokens;
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

  if (queryTokens.length === 0 || normalizedQuestion.includes('tell me about omar')) {
    return chunks
      .filter(chunk => ['about', 'resume', 'experience', 'skill'].includes(chunk.type))
      .slice(0, limit);
  }

  return chunks
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
      let intentBoost = 0;

      if (normalizedQuestion.includes('shifaa') && normalizedText.includes('shifaa')) intentBoost += 6;
      if (normalizedQuestion.includes('computer vision') && normalizedText.includes('computer vision')) intentBoost += 4;
      if (normalizedQuestion.includes('certification') && chunk.type === 'certification') intentBoost += 5;
      if ((normalizedQuestion.includes('study') || normalizedQuestion.includes('education')) && normalizedText.includes('university')) intentBoost += 4;
      if ((normalizedQuestion.includes('technolog') || normalizedQuestion.includes('skills')) && chunk.type === 'skill') intentBoost += 5;
      if (normalizedQuestion.includes('project') && chunk.type === 'project') intentBoost += 4;
      if (normalizedQuestion.includes('github') && chunk.source === 'github') intentBoost += 6;
      if (chunk.type === 'contact' && !normalizedQuestion.includes('contact') && !normalizedQuestion.includes('email') && !normalizedQuestion.includes('phone')) {
        intentBoost -= 4;
      }

      return { chunk, score: overlap + phraseBoost + titleBoost + typeBoost + sourceBoost + intentBoost };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}

export function formatContext(chunks) {
  return chunks.map((chunk, index) => {
    const url = chunk.url ? `\nURL: ${chunk.url}` : '';
    return `[${index + 1}] Source: ${chunk.source}; Type: ${chunk.type}; Title: ${chunk.title}${url}\n${chunk.content}`;
  }).join('\n\n');
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
