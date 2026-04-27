import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/pages/index.astro',
  'src/pages/works.astro',
  'src/pages/design-subscription.astro',
  'src/pages/services/webflow.astro',
  'src/pages/services/web-design.astro',
  'src/pages/services/product.astro',
  'src/pages/services/graphic-design.astro'
];

const cssToInject = `
  <style>
    .barba-container-transitioning {
      position: absolute !important;
      top: 0;
      left: 0;
      width: 100%;
    }
  </style>
</head>`;

filesToFix.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('.barba-container-transitioning {') && content.includes('</head>')) {
    content = content.replace('</head>', cssToInject);
    fs.writeFileSync(f, content);
    console.log('Injected CSS into', f);
  }
});
