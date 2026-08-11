import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const portfolioUrl = 'https://omarsalama4.github.io/MyPortfolio/';

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;|&mdash;/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function section(html, id) {
  const start = html.indexOf(`<section id="${id}"`);
  if (start === -1) return '';
  const end = html.indexOf('</section>', start);
  return html.slice(start, end === -1 ? html.length : end + '</section>'.length);
}

function attrValue(markup, attr) {
  const match = markup.match(new RegExp(`${attr}="([^"]+)"`));
  return match ? match[1] : undefined;
}

function firstText(markup, selector) {
  const match = markup.match(new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i'));
  return match ? stripHtml(match[1]) : '';
}

function projectChunks(html) {
  return Array.from(html.matchAll(/<article class="project-case[\s\S]*?<\/article>/g)).map((match, index) => {
    const markup = match[0];
    const title = firstText(markup, 'h3') || `Project ${index + 1}`;
    const githubLink = Array.from(markup.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/g))
      .map(link => link[1])
      .find(href => href.includes('github.com'));
    return chunk(
      `portfolio:project:${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      'portfolio',
      'project',
      title,
      stripHtml(markup),
      githubLink || `${portfolioUrl}#projects`,
      {
        badge: firstText(markup, 'span'),
        image: attrValue(markup, 'src')
      }
    );
  });
}

async function extractCvText() {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = await fs.readFile(path.join(rootDir, 'Omar_Salama_CV.pdf'));
    const parsed = await pdfParse(buffer);
    return parsed.text.replace(/\s+/g, ' ').trim();
  } catch {
    return '';
  }
}

function chunk(id, source, type, title, content, url, metadata = {}) {
  return { id, source, type, title, content, url, metadata };
}

async function main() {
  const html = await fs.readFile(path.join(rootDir, 'index.html'), 'utf8');
  const cvText = await extractCvText();
  const projectSection = section(html, 'projects');
  const chunks = [
    chunk('portfolio:about', 'portfolio', 'about', 'About Me', stripHtml(section(html, 'about')), `${portfolioUrl}#about`),
    chunk('portfolio:experience', 'portfolio', 'experience', 'Experience & Education', stripHtml(section(html, 'experience')), `${portfolioUrl}#experience`),
    chunk('portfolio:projects', 'portfolio', 'project', 'Featured Projects', stripHtml(projectSection), `${portfolioUrl}#projects`),
    ...projectChunks(projectSection),
    chunk('portfolio:skills', 'portfolio', 'skill', 'Technical Skills', stripHtml(section(html, 'skills')), `${portfolioUrl}#skills`),
    chunk('portfolio:achievements', 'portfolio', 'certification', 'Achievements & Certifications', stripHtml(section(html, 'achievements')), `${portfolioUrl}#achievements`),
    chunk('portfolio:leadership', 'portfolio', 'experience', 'Leadership & Community', stripHtml(section(html, 'leadership')), `${portfolioUrl}#leadership`),
    chunk('portfolio:contact', 'portfolio', 'contact', 'Contact', stripHtml(section(html, 'contact')), `${portfolioUrl}#contact`)
  ];

  if (cvText) {
    chunks.push(chunk('cv:full', 'cv', 'resume', 'Omar Salama CV', cvText, undefined, {
      generatedFrom: 'Omar_Salama_CV.pdf'
    }));
  }

  await fs.mkdir(path.join(rootDir, 'data'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'data', 'knowledge.json'), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    chunks
  }, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
