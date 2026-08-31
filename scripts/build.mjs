import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const html = await readFile(join(root, 'index.html'), 'utf8');

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'server'), { recursive: true });
await mkdir(join(dist, '.openai'), { recursive: true });

await writeFile(join(dist, '.openai', 'hosting.json'), JSON.stringify({
  project_id: 'appgprj_6a8e08e1bf108191b1f265dc79002bc9'
}, null, 2));

await writeFile(join(dist, 'index.html'), html);

await writeFile(join(dist, 'server', 'index.js'), `const html = ${JSON.stringify(html)};

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    });
  }
};
`);
