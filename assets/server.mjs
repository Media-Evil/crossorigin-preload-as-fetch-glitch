import { createSecureServer } from 'node:http2';
import { readFileSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// Serves modules that are responsible for building router for the application

const PORT = 8000;
const currentDirectory = dirname(fileURLToPath(import.meta.url));

const alloweOrigins = new Set([
  'https://localhost:7000',
]);

const routingServer = createSecureServer({
  key: readFileSync(resolve(currentDirectory, './private/localhost-privkey.pem')),
  cert: readFileSync(resolve(currentDirectory, './private/localhost-cert.pem'))
});

routingServer.on('stream', (responseStream, headers) => {
  const { origin } = headers;
  const readFileStream = createReadStream(resolve(currentDirectory, `./public${headers[':path']}`));

  readFileStream.on('open', () => {
    if (alloweOrigins.has(origin)) {
      responseStream.respond({
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': true,
        'Vary': 'Origin',
        'content-type': `text/javascript; charset=utf-8`,
        ':status': 200
      });

      readFileStream.pipe(responseStream);
    } else {
      responseStream.respond({
        ':status': 403
      });

      readFileStream.close(403);
    }
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

routingServer.listen(PORT, () => {
  console.log(`Done! Asset server is up and running on port ${PORT}...`);
});

