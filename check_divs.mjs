import fs from 'fs';

const file = 'src/pages/works.astro';
const content = fs.readFileSync(file, 'utf8');

const barbaContainerIdx = content.indexOf('data-barba="container"');
const navIdx = content.indexOf('<nav class="navbar"');
console.log('Nav inside Barba container?', navIdx > barbaContainerIdx);

const snippet = content.substring(barbaContainerIdx, navIdx);
const opens = (snippet.match(/<div/g) || []).length;
const closes = (snippet.match(/<\/div>/g) || []).length;
console.log('Opens:', opens, 'Closes:', closes);
