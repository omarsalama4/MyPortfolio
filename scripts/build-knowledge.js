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

function stripMarkdown(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_`>|]/g, ' ')
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

function projectTechnologies(markup) {
  const block = markup.match(/<div class="project-tags">([\s\S]*?)<\/div>/i)?.[1] || '';
  return Array.from(block.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi))
    .map(match => stripHtml(match[1]))
    .filter(Boolean);
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
        image: attrValue(markup, 'src'),
        technologies: projectTechnologies(markup)
      }
    );
  });
}

async function professionalContextChunks() {
  const fileName = 'docs/professional-context.md';
  const markdown = await fs.readFile(path.join(rootDir, fileName), 'utf8');
  return markdown
    .split(/(?=^##(?:#)?\s+)/m)
    .map((section, index) => {
      const title = section.match(/^#{2,3}\s+(.+)$/m)?.[1]?.trim();
      const content = stripMarkdown(section);
      if (!title || !content) return null;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return chunk(
        `professional-context:${slug || 'section'}-${index}`,
        'professional-context',
        'professional-context',
        `Professional Context: ${title}`,
        content,
        undefined,
        { generatedFrom: fileName }
      );
    })
    .filter(Boolean);
}

async function extractDocumentText(fileName) {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = await fs.readFile(path.join(rootDir, fileName));
    const parsed = await pdfParse(buffer);
    return parsed.text.replace(/\s+/g, ' ').trim();
  } catch (error) {
    throw new Error(`Could not extract verified knowledge from ${fileName}: ${error.message}`);
  }
}

function chunk(id, source, type, title, content, url, metadata = {}) {
  return { id, source, type, title, content, url, metadata };
}

async function main() {
  const html = await fs.readFile(path.join(rootDir, 'index.html'), 'utf8');
  const professionalDocuments = [
    { id: 'cv:full', source: 'cv', type: 'cv', title: 'Omar Salama CV', fileName: 'OMAR SALAMA CV.pdf' }
  ];
  const documentChunks = await Promise.all(professionalDocuments.map(async document => {
    const content = await extractDocumentText(document.fileName);
    return content
      ? chunk(document.id, document.source, document.type, document.title, content, `/${encodeURIComponent(document.fileName)}`, {
        generatedFrom: document.fileName
      })
      : null;
  }));
  const contextChunks = await professionalContextChunks();
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

  chunks.push(...documentChunks.filter(Boolean), ...contextChunks);

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
