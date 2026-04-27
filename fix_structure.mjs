import fs from 'fs';

const files = [
  'src/pages/index.astro',
  'src/pages/blog.astro',
  'src/pages/blog/[slug].astro',
  'src/pages/services/webflow.astro',
  'src/pages/services/web-design.astro',
  'src/pages/services/product.astro',
  'src/pages/services/graphic-design.astro',
  'src/pages/works.astro',
  'src/pages/works/[slug].astro'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // We want to make SURE the layout components (navbar, footer, cw-cookies)
  // are completely outside of the data-barba="container".
  // Let's just find the closing tag of data-barba="container".
  const startIdx = content.indexOf('data-barba="container"');
  if (startIdx === -1) continue;
  
  let depth = 0;
  let containerEndIdx = -1;
  let i = startIdx;
  
  // Find the exact '<div' for container
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
  
  if (containerEndIdx !== -1) {
    // Extract nav, footer, cookie
    let extract = (startTag, endTag) => {
      const start = content.indexOf(startTag);
      if (start === -1) return '';
      let end = content.indexOf(endTag, start);
      if (end === -1) return '';
      // We might need to find the matching close tag if it's a div, but for nav/footer we know the tag.
      if (endTag === '</div>') {
        // Special case for cw-cookies: find the matching </div>
        let d = 0;
        let curr = start;
        while (curr < content.length) {
          const o = content.indexOf('<div', curr);
          const c = content.indexOf('</div', curr);
          if (o !== -1 && o < c) {
            d++;
            curr = o + 4;
          } else if (c !== -1) {
            d--;
            curr = c + 6;
            if (d === 0) {
              const res = content.substring(start, curr);
              content = content.substring(0, start) + content.substring(curr);
              return res;
            }
          } else {
            break;
          }
        }
      } else {
        end += endTag.length;
        const res = content.substring(start, end);
        content = content.substring(0, start) + content.substring(end);
        return res;
      }
      return '';
    };

    const nav = extract('<nav class="navbar"', '</nav>');
    const footer = extract('<footer', '</footer>');
    
    // For cookie, it's either <div class="cw-cookie_wrap"> or <div class="cw-cookies">
    // However, there is a script inside cw-cookies! <div class="cw-cookie_script ...
    // If we just extract by matching </div>, we will get the whole thing.
    let cookieStart = content.indexOf('<div class="cw-cookies">');
    if (cookieStart === -1) cookieStart = content.indexOf('<div class="cw-cookie_wrap">');
    let cookie = '';
    if (cookieStart !== -1) {
       let d = 0;
        let curr = cookieStart;
        while (curr < content.length) {
          const o = content.indexOf('<div', curr);
          const c = content.indexOf('</div', curr);
          if (o !== -1 && o < c) {
            d++;
            curr = o + 4;
          } else if (c !== -1) {
            d--;
            curr = c + 6;
            if (d === 0) {
              cookie = content.substring(cookieStart, curr);
              content = content.substring(0, cookieStart) + content.substring(curr);
              break;
            }
          } else {
            break;
          }
        }
    }

    // Now insert them AFTER the containerEndIdx.
    // We must recalculate containerEndIdx because we removed strings before it?
    // Wait! If we removed nav, footer, cookie from WITHIN the container, containerEndIdx SHIFTED!
    // Let's re-run the depth finder!
    const newStartIdx = content.indexOf('data-barba="container"');
    let newContainerEndIdx = -1;
    if (newStartIdx !== -1) {
      let d = 0;
      let curr = content.lastIndexOf('<div', newStartIdx);
      while (curr < content.length) {
        const o = content.indexOf('<div', curr);
        const c = content.indexOf('</div', curr);
        if (o !== -1 && o < c) {
          d++;
          curr = o + 4;
        } else if (c !== -1) {
          d--;
          curr = c + 6;
          if (d === 0) {
            newContainerEndIdx = curr;
            break;
          }
        } else {
          break;
        }
      }
    }

    if (newContainerEndIdx !== -1) {
      content = content.substring(0, newContainerEndIdx) + '\n' + nav + '\n' + footer + '\n' + cookie + '\n' + content.substring(newContainerEndIdx);
      fs.writeFileSync(file, content);
      console.log(`Fixed structure for ${file}`);
    }
  }
}
