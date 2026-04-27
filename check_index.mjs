import fs from 'fs';

const file = 'src/pages/index.astro';
const content = fs.readFileSync(file, 'utf8');
const barbaIdx = content.indexOf('data-barba="container"');
const navIdx = content.indexOf('<nav class="navbar"');
console.log('Barba:', barbaIdx);
console.log('Nav:', navIdx);
console.log('Nav > Barba:', navIdx > barbaIdx);

let snippet = content.substring(barbaIdx, navIdx);
let opens = (snippet.match(/<div/g) || []).length;
let closes = (snippet.match(/<\/div>/g) || []).length;
console.log('Opens:', opens, 'Closes:', closes);
