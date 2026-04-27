import fs from 'fs';

const fixScript = `
    // FORCE NAVBAR THEME FOR NEW PAGE
    const nextSection = data.next.container.querySelector('[data-theme]');
    if (nextSection) {
      const theme = nextSection.getAttribute('data-theme');
      const navbar = document.querySelector('.navbar');
      const triggerLine1 = document.querySelector('.nav_mobile-trigger_line1');
      const triggerLine2 = document.querySelector('.nav_mobile-trigger_line2');
      if (navbar) {
        navbar.style.transition = 'background-color 0.3s, color 0.3s';
        if (theme === 'light') {
          navbar.style.backgroundColor = 'var(--background--light)';
          navbar.style.color = 'var(--text-color--primary-dark)';
          if(triggerLine1) triggerLine1.style.backgroundColor = 'var(--background--dark)';
          if(triggerLine2) triggerLine2.style.backgroundColor = 'var(--background--dark)';
        } else if (theme === 'dark') {
          navbar.style.backgroundColor = 'var(--background--dark)';
          navbar.style.color = 'var(--text-color--primary-light)';
          if(triggerLine1) triggerLine1.style.backgroundColor = 'var(--background--light)';
          if(triggerLine2) triggerLine2.style.backgroundColor = 'var(--background--light)';
        } else if (theme === 'transparent') {
          navbar.style.backgroundColor = 'transparent';
          navbar.style.color = 'var(--text-color--primary-light)';
          if(triggerLine1) triggerLine1.style.backgroundColor = 'var(--background--light)';
          if(triggerLine2) triggerLine2.style.backgroundColor = 'var(--background--light)';
        }
      }
    }
`;

const files = [
  'src/pages/works.astro',
  'src/pages/services/webflow.astro',
  'src/pages/services/web-design.astro',
  'src/pages/services/product.astro',
  'src/pages/services/graphic-design.astro',
  'src/pages/index.astro',
  'src/pages/design-subscription.astro'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('barba.hooks.afterEnter((data) => {')) {
    if (!content.includes('// FORCE NAVBAR THEME FOR NEW PAGE')) {
       content = content.replace('barba.hooks.afterEnter((data) => {', 'barba.hooks.afterEnter((data) => {\\n' + fixScript);
       fs.writeFileSync(f, content);
       console.log('Fixed', f);
    } else {
       console.log('Already fixed', f);
    }
  } else if (content.includes('barba.hooks.afterEnter(() => {')) {
    if (!content.includes('// FORCE NAVBAR THEME FOR NEW PAGE')) {
       content = content.replace('barba.hooks.afterEnter(() => {', 'barba.hooks.afterEnter((data) => {\\n' + fixScript);
       fs.writeFileSync(f, content);
       console.log('Fixed', f);
    } else {
       console.log('Already fixed', f);
    }
  }
});
