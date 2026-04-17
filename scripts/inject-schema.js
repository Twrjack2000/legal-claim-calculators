const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'about.html', 'privacy.html', 'disclaimer.html',
  'tools/alimony-calculator.html',
  'tools/child-support-calculator.html',
  'tools/dog-bite-calculator.html',
  'tools/dui-cost-calculator.html',
  'tools/medical-malpractice-calculator.html',
  'tools/non-compete-checker.html',
  'tools/personal-injury-calculator.html',
  'tools/ssdi-calculator.html',
  'tools/workers-comp-calculator.html',
  'tools/wrongful-termination-calculator.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already infused
  if (content.includes('application/ld+json')) {
    console.log(`Skipping ${file} - Schema already exists`);
    return;
  }

  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
  
  const title = titleMatch ? titleMatch[1].trim() : 'Legal Claim Calculator';
  const description = descMatch ? descMatch[1].trim() : '';

  // App Schema
  let appSchema = null;
  // If it's a calculator tool (in /tools/ or is index.html), apply SoftwareApplication
  if (file.includes('tools/') || file === 'index.html') {
    appSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": title,
      "description": description,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  };

  // Match items
  const qRegex = /<button class="faq-q"[^>]*>([\s\S]*?)<i/g;
  const aRegex = /<div class="faq-a">([\s\S]*?)<\/div>/g;

  let qMatches = [...content.matchAll(qRegex)];
  let aMatches = [...content.matchAll(aRegex)];

  if (qMatches.length > 0 && qMatches.length === aMatches.length) {
    for (let i = 0; i < qMatches.length; i++) {
        // Only push clean values
        let q = qMatches[i][1].trim(); // Remove leading/trailing
        let a = aMatches[i][1].trim();
        // Remove HTML tags from answer if any
        a = a.replace(/<[^>]+>/g, '');
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      });
    }
  }

  // Build the script blocks
  let scriptBlocks = [];
  if (appSchema) {
    scriptBlocks.push(`<script type="application/ld+json">\n${JSON.stringify(appSchema, null, 2)}\n</script>`);
  }
  if (faqSchema.mainEntity.length > 0) {
    scriptBlocks.push(`<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`);
  }

  if (scriptBlocks.length > 0) {
    const combinedScript = scriptBlocks.join('\n') + '\n</head>';
    content = content.replace('</head>', combinedScript);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Injected schemas to ${file}`);
  }
});
