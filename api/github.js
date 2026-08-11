let cachedAt = 0;
let cachedChunks = [];
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const RELEVANT_TERMS = [
  'ai', 'machine', 'learning', 'vision', 'opencv', 'nlp', 'chatbot', 'rag', 'agent',
  'automation', 'pytorch', 'tensorflow', 'segmentation', 'medical', 'healthcare'
];

function relevant(repo) {
  const haystack = [
    repo.name,
    repo.description,
    repo.language,
    ...(repo.topics || [])
  ].join(' ').toLowerCase();
  return RELEVANT_TERMS.some(term => haystack.includes(term));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'omar-portfolio-ai-assistant'
    }
  });
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
  return response.json();
}

async function fetchReadme(owner, repoName) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
    headers: {
      Accept: 'application/vnd.github.raw',
      'User-Agent': 'omar-portfolio-ai-assistant'
    }
  });
  if (!response.ok) return '';
  return (await response.text()).slice(0, 1800);
}

export async function refreshGithubKnowledge(force = false) {
  const now = Date.now();
  if (!force && cachedChunks.length && now - cachedAt < CACHE_TTL_MS) return cachedChunks;

  const username = process.env.GITHUB_USERNAME || 'omarsalama4';
  const repos = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=60&sort=updated`);
  const selected = repos.filter(repo => !repo.fork && relevant(repo)).slice(0, 12);

  cachedChunks = await Promise.all(selected.map(async repo => {
    const readme = await fetchReadme(username, repo.name).catch(() => '');
    return {
      id: `github:${repo.name}`,
      source: 'github',
      type: 'repository',
      title: repo.name,
      content: [
        repo.description ? `Description: ${repo.description}` : '',
        repo.language ? `Primary language: ${repo.language}` : '',
        repo.topics?.length ? `Topics: ${repo.topics.join(', ')}` : '',
        readme ? `README excerpt: ${readme}` : ''
      ].filter(Boolean).join('\n'),
      url: repo.html_url,
      metadata: {
        language: repo.language,
        topics: repo.topics || [],
        updatedAt: repo.updated_at
      }
    };
  }));
  cachedAt = now;
  return cachedChunks;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const chunks = await refreshGithubKnowledge(req.method === 'POST');
    return res.status(200).json({ updatedAt: new Date(cachedAt).toISOString(), chunks });
  } catch {
    return res.status(502).json({ error: 'github_unavailable' });
  }
}
