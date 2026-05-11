import fs from 'fs';

try {
  fs.cpSync('dist/server/chunks', 'dist/client/chunks', { recursive: true });
  fs.writeFileSync('dist/client/_worker.js', "import worker from '../server/entry.mjs';\nexport default worker;");
  console.log("Successfully prepared dist/client for Cloudflare Pages deployment!");
} catch (err) {
  console.error("Failed to prepare Cloudflare build:", err);
}
