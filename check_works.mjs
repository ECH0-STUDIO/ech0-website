import fs from 'fs';
const lines = fs.readFileSync('src/pages/works.astro', 'utf8').split('\n');
console.log('bWrap:', lines.findIndex(l => l.includes('data-barba="wrapper"')));
console.log('bCont:', lines.findIndex(l => l.includes('data-barba="container"')));
console.log('nav:', lines.findIndex(l => l.includes('<nav class="navbar"')));
console.log('foot:', lines.findIndex(l => l.includes('<footer')));
console.log('cookie:', lines.findIndex(l => l.includes('cw-cookie')));
console.log('script:', lines.findIndex(l => l.includes('<script src="https://d3e54v')));
