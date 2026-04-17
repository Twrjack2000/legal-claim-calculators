const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const templatesDir = path.join(__dirname, '..', 'templates');
const outDir = path.join(__dirname, '..', 'articles');

if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const templatePath = path.join(templatesDir, 'article.html');
if (!fs.existsSync(templatePath)) {
  console.error('Template article.html not found. Exiting.');
  process.exit(1);
}
const templateStr = fs.readFileSync(templatePath, 'utf-8');

const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
let articleManifest = [];

mdFiles.forEach(file => {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  
  // Parse Frontmatter
  const parts = content.split('---');
  if (parts.length < 3) return; // invalid format
  
  const frontmatterRaw = parts[1];
  const markdownRaw = parts.slice(2).join('---').trim();
  
  // Extract info
  const meta = {};
  frontmatterRaw.trim().split('\n').forEach(line => {
    const split = line.split(':');
    if (split.length >= 2) {
      const key = split[0].trim();
      let val = split.slice(1).join(':').trim();
      val = val.replace(/^["'](.*)["']$/, '$1'); // remove quotes
      meta[key] = val;
    }
  });
  
  // Parse markdown
  let html = markdownRaw;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/gim, '\n'); // stitch adjacent lists
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // CTA Box extraction
  if (meta.cta_link && meta.cta_text) {
    const ctaBox = `
    <div class="article-cta-box">
      <h3>Compare Settlement Averages</h3>
      <p>Want to know how your specific numbers stack up? Use our free tool to estimate your case value instantly.</p>
      <a href="${meta.cta_link}" class="btn-calc-large">${meta.cta_text}</a>
    </div>`;
    html = html.replace(/\[CTA_BOX\]/g, ctaBox);
  }
  
  // Paragraphs
  const blocks = html.split('\n\n');
  const processedBlocks = blocks.map(b => {
    if (b.trim().length === 0) return '';
    if (b.trim().startsWith('<h') || b.trim().startsWith('<ul') || b.trim().startsWith('<div')) {
      return b.trim();
    }
    return `<p>${b.trim()}</p>`;
  });
  
  html = processedBlocks.join('\n\n');
  
  // Inject into template
  let finalHtml = templateStr;
  finalHtml = finalHtml.replace(/\{\{TITLE\}\}/g, meta.title || 'Legal Guide');
  finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, meta.description || '');
  finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, meta.date || '');
  finalHtml = finalHtml.replace(/\{\{CATEGORY\}\}/g, meta.category || '');
  finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, html);
  
  const targetFilename = file.replace('.md', '.html');
  fs.writeFileSync(path.join(outDir, targetFilename), finalHtml);
  
  articleManifest.push({
    title: meta.title,
    description: meta.description,
    date: meta.date,
    category: meta.category,
    link: targetFilename
  });
});

console.log(`Generated ${articleManifest.length} articles.`);

// Now build the articles/index.html directory page
let cardsHTML = articleManifest.map(a => `
  <a class="tool-card" href="./${a.link}">
    <div class="tool-card-tag">${a.category}</div>
    <div class="tool-card-title">${a.title}</div>
    <div class="tool-card-desc">${a.description}</div>
    <div class="tool-card-btn" style="background:transparent; color:var(--accent); padding-left:0;">Read Full Guide →</div>
  </a>
`).join('');

const dirTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Legal Guides & Articles</title>
  <meta name="description" content="Free educational guides covering personal injury, workers comp, and family law." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3175050594873956" crossorigin="anonymous"></script>
</head>
<body>
<div id="nav-placeholder"></div>
<section class="page-hero">
  <div class="container">
    <div class="badge">📚 Legal Guides</div>
    <h1 class="hero-title">Understanding Your <span class="accent">Legal Rights</span></h1>
    <p class="hero-sub">Our library of free guides to help you value your case, negotiate with adjusters, and prepare for litigation.</p>
  </div>
</section>
<div class="container">
  <div class="ad-slot ad-leaderboard">Advertisement</div>
  <section class="section fade-in">
    <div class="tools-grid">
      ${cardsHTML}
    </div>
  </section>
</div>
<div id="footer-placeholder"></div>
<script>var BASE = '../';</script>
<script src="../js/common.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), dirTemplate);
console.log('Generated articles/index.html directory.');
