import fs from 'fs';

const file = 'src/pages/works/[slug].astro';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const navStart = 414;
const navEnd = 654;
const footerStart = 690;
const footerEnd = 796;
const cookieStart = 799;
const cookieEnd = 1023;

const nav = lines.slice(navStart, navEnd + 1);
const footer = lines.slice(footerStart, footerEnd + 1);
const cookie = lines.slice(cookieStart, cookieEnd + 1);

let newLines = [...lines];
newLines.splice(cookieStart, cookieEnd - cookieStart + 1);
newLines.splice(footerStart, footerEnd - footerStart + 1);
newLines.splice(navStart, navEnd - navStart + 1);

let scriptIndex = newLines.findIndex(line => line.includes('<script src="https://d3e54v'));
// The closing div of page-wrap is exactly at scriptIndex - 1.
// We want to insert AFTER the closing div of page-wrap, which means AT scriptIndex.
newLines.splice(scriptIndex, 0, ...nav, ...footer, ...cookie);

fs.writeFileSync(file, newLines.join('\n'));
console.log('Fixed', file);
