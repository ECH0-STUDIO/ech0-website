import fs from 'fs';

const file = 'src/pages/works.astro';
const content = fs.readFileSync(file, 'utf8');

const barbaContainerIdx = content.indexOf('data-barba="container"');
const scriptIdx = content.indexOf('<script src="https://d3e54v');
const navIdx = content.indexOf('<nav class="navbar"');

console.log('Barba container starts at:', barbaContainerIdx);
console.log('Nav starts at:', navIdx);
console.log('Script starts at:', scriptIdx);

// Look for the last '</div>' before the script.
const beforeScript = content.substring(scriptIdx - 100, scriptIdx);
console.log('Content right before script:');
console.log(beforeScript);

// In works/[slug].astro
const slugFile = 'src/pages/works/[slug].astro';
const slugContent = fs.readFileSync(slugFile, 'utf8');
console.log('\n--- SLUG ASTRO ---');
console.log('Barba container starts at:', slugContent.indexOf('data-barba="container"'));
console.log('Nav starts at:', slugContent.indexOf('<nav class="navbar"'));
console.log('Script starts at:', slugContent.indexOf('<script src="https://d3e54v'));
const slugBeforeNav = slugContent.substring(slugContent.indexOf('<nav class="navbar"') - 100, slugContent.indexOf('<nav class="navbar"'));
console.log('Content right before nav in slug:');
console.log(slugBeforeNav);
