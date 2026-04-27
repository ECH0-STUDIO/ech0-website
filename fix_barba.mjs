import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Fix fromImage selector in leave hook
  content = content.replace(
    /const fromImage = document\.querySelector\(`img\[data-image-id="\$\{imageId\}"\]`\);/g,
    'const fromImage = data.current.container.querySelector(`img[data-image-id="${imageId}"]`);'
  );

  // 2. Fix toImage selector in enter hook
  content = content.replace(
    /toImage = document\.querySelector\(`img\.is-work\[data-image-id="\$\{imageId\}"\]`\);/g,
    'toImage = data.next.container.querySelector(`img.is-work[data-image-id="${imageId}"]`);'
  );

  // 3. Add explicit Navbar theme update in afterEnter hook
  if (content.includes('initNavbarTheme?.();') && !content.includes('const nextSection = data.next.container.querySelector')) {
    const afterEnterMatch = /barba\.hooks\.afterEnter\(\(data\) => \{([\s\S]*?initNavbarTheme\?\.\(\);)/.exec(content);
    if (afterEnterMatch) {
      const injection = `
  const nextSection = data.next.container.querySelector('section[data-theme]');
  if (nextSection) {
    const theme = nextSection.getAttribute('data-theme');
    const navbar = document.querySelector('.navbar');
    const triggerLine1 = document.querySelector('.nav_mobile-trigger_line1');
    const triggerLine2 = document.querySelector('.nav_mobile-trigger_line2');
    if (navbar && triggerLine1 && triggerLine2) {
      if (theme === 'light') {
        navbar.style.backgroundColor = 'var(--background--light)';
        navbar.style.color = 'var(--text-color--primary-dark)';
        triggerLine1.style.backgroundColor = 'var(--background--light)';
        triggerLine2.style.backgroundColor = 'var(--background--light)';
      } else {
        navbar.style.backgroundColor = 'var(--background--dark)';
        navbar.style.color = 'var(--text-color--primary-light)';
        triggerLine1.style.backgroundColor = 'var(--background--dark)';
        triggerLine2.style.backgroundColor = 'var(--background--dark)';
      }
    }
  }
`;
      content = content.replace(afterEnterMatch[0], afterEnterMatch[0] + injection);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
}

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
  if (fs.existsSync(f)) {
    processFile(f);
  }
});
