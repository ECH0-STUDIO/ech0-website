import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/index.astro',
  'src/pages/works.astro',
  'src/pages/services/webflow.astro',
  'src/pages/services/web-design.astro',
  'src/pages/services/product.astro',
  'src/pages/services/graphic-design.astro',
  'src/pages/design-subscription.astro'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes("const nextSection = data.next.container.querySelector('section[data-theme]');")) {
     content = content.replace(/const nextSection = data\.next\.container\.querySelector\('section\[data-theme\]'\);[\s\S]*?triggerLine2\.style\.backgroundColor = 'var\(--background--dark\)';\s*\}\s*\}\s*\}/g, '');
     fs.writeFileSync(f, content);
     console.log('Removed injection from', f);
  }
});
