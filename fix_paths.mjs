import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.astro')) {
            results.push(file);
        }
    });
    return results;
}

const astroFiles = walkDir('./src/pages');

astroFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all relative paths to the public folder assets with absolute paths
    let newContent = content
        .replace(/\"\.\.\/css\//g, "\"/css/")
        .replace(/\"\.\.\/\.\.\/css\//g, "\"/css/")
        .replace(/\"\.\.\/images\//g, "\"/images/")
        .replace(/\"\.\.\/\.\.\/images\//g, "\"/images/")
        .replace(/\"\.\.\/js\//g, "\"/js/")
        .replace(/\"\.\.\/\.\.\/js\//g, "\"/js/")
        // Let's also catch single quotes just in case
        .replace(/\'\.\.\/css\//g, "'/css/")
        .replace(/\'\.\.\/\.\.\/css\//g, "'/css/")
        .replace(/\'\.\.\/images\//g, "'/images/")
        .replace(/\'\.\.\/\.\.\/images\//g, "'/images/")
        .replace(/\'\.\.\/js\//g, "'/js/")
        .replace(/\'\.\.\/\.\.\/js\//g, "'/js/");

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log("Fixed paths in:", file);
    }
});
