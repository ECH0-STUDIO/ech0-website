import fs from 'fs';

const filesToFix = [
  'src/pages/index.astro',
  'src/pages/blog.astro',
  'src/pages/blog/[slug].astro',
  'src/pages/services/webflow.astro',
  'src/pages/services/web-design.astro',
  'src/pages/services/product.astro',
  'src/pages/services/graphic-design.astro',
  'src/pages/works.astro'
];

for (const file of filesToFix) {
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}: file not found`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Extract Navbar
  const navStartIdx = content.indexOf('<nav class="navbar">');
  if (navStartIdx === -1) {
    console.log(`Skipping ${file}: navbar not found`);
    continue;
  }
  let navEndIdx = content.indexOf('</nav>', navStartIdx);
  if (navEndIdx === -1) {
    console.log(`Skipping ${file}: </nav> not found`);
    continue;
  }
  navEndIdx += '</nav>'.length;
  
  const navContent = content.substring(navStartIdx, navEndIdx);
  content = content.substring(0, navStartIdx) + content.substring(navEndIdx);

  // 2. Extract Footer
  const footerStartIdx = content.indexOf('<footer');
  if (footerStartIdx === -1) {
    console.log(`Skipping ${file}: footer not found`);
    continue;
  }
  let footerEndIdx = content.indexOf('</footer>', footerStartIdx);
  if (footerEndIdx === -1) {
    console.log(`Skipping ${file}: </footer> not found`);
    continue;
  }
  footerEndIdx += '</footer>'.length;
  
  const footerContent = content.substring(footerStartIdx, footerEndIdx);
  content = content.substring(0, footerStartIdx) + content.substring(footerEndIdx);

  // 3. Extract Cookie Wrap
  let cookieStartIdx = content.indexOf('<div class="cw-cookie_wrap">');
  if (cookieStartIdx === -1) {
    cookieStartIdx = content.indexOf('<div class="cw-cookies">');
  }
  if (cookieStartIdx === -1) {
    console.log(`Skipping ${file}: cw-cookie wrapper not found`);
    continue;
  }
  
  let cookieScriptIdx = content.indexOf('<script src="https://d3e54v', cookieStartIdx);
  if (cookieScriptIdx === -1) {
    console.log(`Skipping ${file}: next script not found after cookie wrap`);
    continue;
  }
  
  // Sometimes the cookie wrap is closed just before the script. We'll extract everything up to scriptIdx.
  const cookieContent = content.substring(cookieStartIdx, cookieScriptIdx);
  content = content.substring(0, cookieStartIdx) + content.substring(cookieScriptIdx);

  // Now, find where to insert them. Right before the first <script src="https://d3e54v...
  // Usually this is after `page-wrap` closes.
  const scriptIdx = content.indexOf('<script src="https://d3e54v');
  if (scriptIdx === -1) {
    console.log(`Skipping ${file}: script not found`);
    continue;
  }
  
  const insertContent = `\n${navContent}\n${footerContent}\n${cookieContent}\n`;
  content = content.substring(0, scriptIdx) + insertContent + content.substring(scriptIdx);
  
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}
