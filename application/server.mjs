import { createSecureServer } from 'node:http2';
import { readFileSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// Ensures that application is being loaded optimally 

const PORT = 7000;
const currentDirectory = dirname(fileURLToPath(import.meta.url));

const applicationServer = createSecureServer({
  key: readFileSync(resolve(currentDirectory, './private/localhost-privkey.pem')),
  cert: readFileSync(resolve(currentDirectory, './private/localhost-cert.pem'))
});

applicationServer.on('stream', (responseStream, headers) => {
  const readFileStream = createReadStream(resolve(currentDirectory, './index.html'));

  readFileStream.on('open', () => {
    responseStream.respond({
      'Access-Control-Allow-Origin': 'https://localhost:7000',
      'Content-Security-Policy': `script-src https://localhost:8000`,
      'Content-Type': `text/html; charset=utf-8`,
      ':status': 200,
       'Link': '<https://localhost:9500>; rel=preconnect; crossorigin=use-credentials, <https://localhost:8000>; rel=preconnect; crossorigin=use-credentials, <https://localhost:8000/main.mjs>; rel=modulepreload; crossorigin=use-credentials, <https://localhost:9500/>; rel=preload; as=fetch; crossorigin=use-credentials'
    });

    readFileStream.pipe(responseStream);
  });

  readFileStream.on('close', () => {
    responseStream.end();
  });

  readFileStream.on('error', () => {
    responseStream.respond({
      ':status': 404
    });
    responseStream.end();
  });
});

applicationServer.listen(PORT, () => {
  console.log(`Done! Application server is up and running on port ${PORT}...`);
});