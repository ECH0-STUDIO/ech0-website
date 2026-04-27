import fs from 'fs';

const file = 'src/pages/index.astro';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('data-barba="container"');
console.log('startIdx:', startIdx);
let depth = 0;
let containerEndIdx = -1;
let i = startIdx;
const containerDivStart = content.lastIndexOf('<div', startIdx);
i = containerDivStart;

while (i < content.length) {
  const nextOpen = content.indexOf('<div', i);
  const nextClose = content.indexOf('</div', i);
  
  if (nextOpen !== -1 && nextOpen < nextClose) {
    depth++;
    i = nextOpen + 4;
  } else if (nextClose !== -1) {
    depth--;
    i = nextClose + 6;
    if (depth === 0) {
      containerEndIdx = i; // This is the '</div>' + 6
      break;
    }
  } else {
    break;
  }
}
console.log('containerEndIdx:', containerEndIdx);

let cookieStart = content.indexOf('<div class="cw-cookies">');
if (cookieStart === -1) cookieStart = content.indexOf('<div class="cw-cookie_wrap">');
console.log('cookieStart:', cookieStart);

const navStart = content.indexOf('<nav class="navbar"');
console.log('navStart:', navStart);

const footerStart = content.indexOf('<footer');
console.log('footerStart:', footerStart);
