import fs from 'fs';
const lines = fs.readFileSync('src/pages/works/[slug].astro', 'utf8').split('\n');

const bWrap = lines.findIndex(l => l.includes('data-barba="wrapper"'));
const bCont = lines.findIndex(l => l.includes('data-barba="container"'));
const nav = lines.findIndex(l => l.includes('<nav class="navbar"'));
const foot = lines.findIndex(l => l.includes('<footer'));
const cookie = lines.findIndex(l => l.includes('cw-cookie'));
const bContEnd = lines.findIndex(l => l.includes('</main>')) + 1; // div after main?
console.log({bWrap, bCont, nav, foot, cookie, bContEnd});
