import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix css, js, images
  content = content.replace(/(href|src)="css\//g, '$1="/css/');
  content = content.replace(/(href|src)="js\//g, '$1="/js/');
  content = content.replace(/(href|src)="images\//g, '$1="/images/');
  
  // Fix links: works.html -> /works, index.html -> /
  content = content.replace(/href="([^"]+)\.html"/g, (match, p1) => {
    // Ignore external or protocol links if they end with .html
    if (p1.startsWith('http') || p1.startsWith('//')) return match;
    let urlPath = p1;
    if (urlPath === 'index') urlPath = '';
    if (urlPath.startsWith('/')) return `href="${urlPath === '/index' ? '/' : urlPath}"`;
    return `href="/${urlPath}"`;
  });
  
  // Webflow form action to use relative root
  content = content.replace(/action="([^"]+)"/g, (match, p1) => {
     // skip contact endpoint or external
     if (p1.includes('/api/contact') || p1.startsWith('http')) return match;
     // Just a generic replacement if they submit to self, but Webflow forms don't really do that usually
     return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated paths in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.astro')) {
      fixFile(fullPath);
    }
  }
}

const pagesDir = path.join(__dirname, 'src', 'pages');
console.log('Starting path replacement...');
walkDir(pagesDir);
console.log('Path replacement complete!');
