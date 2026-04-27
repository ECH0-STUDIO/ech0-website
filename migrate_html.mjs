import fs from 'fs';
import path from 'path';

const exportDir = 'f:\\\\Projects\\\\ECH0 STUDIO Website Export';
const pagesDir = path.join(exportDir, 'astro-app', 'src', 'pages');

const htmlFiles = [
  "app\\\\pinit.html", "blog.html", "contact.html", "design-subscription.html",
  "detail_blog.html", "detail_work-category.html", "detail_works.html", "index.html",
  "pricing.html", "privacy-policy.html", "services\\\\graphic-design.html",
  "services\\\\product.html", "services\\\\web-design.html", "services\\\\webflow.html",
  "style-guide.html", "terms-and-conditions.html", "thai-tran\\\\home.html", "works.html"
];

htmlFiles.forEach(file => {
  const sourceFile = path.join(exportDir, file);
  if (!fs.existsSync(sourceFile)) {
    console.warn(`File not found: ${sourceFile}`);
    return;
  }
  
  let content = fs.readFileSync(sourceFile, 'utf-8');
  
  // Remove cartgenie - note: exact matches or broad regex are used so minor changes don't fail it
  content = content.replace(/<div id="cartgenie-cart-button"><\/div>\s*/g, '');
  content = content.replace(/<div id="cartgenie-mini-cart"><\/div>\s*/g, '');
  content = content.replace(/<script[^>]*src="https:\/\/js\.cartgenie\.com[^>]*><\/script>\s*/g, '');
  
  // Fix doctype for Astro
  if (content.startsWith('<!DOCTYPE html>')) {
      content = content.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n');
  }

  // Astro parses style blocks using CSS. Since webflow puts global logic in head, it is usually fine.
  
  // Write to src/pages
  const targetFile = file === 'index.html' ? 
      path.join(pagesDir, 'index.astro') : 
      path.join(pagesDir, file.replace('.html', '.astro'));
  
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(targetFile, content, 'utf-8');
});

console.log('Migration complete. Cartgenie removed.');
