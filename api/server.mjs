import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// Serves as an API

const PORT = 9500;
const currentDirectory = dirname(fileURLToPath(import.meta.url));

const alloweOrigins = new Set([
  'https://localhost:7000'
]);

const assetServer = createSecureServer({
  key: readFileSync(resolve(currentDirectory, './private/localhost-privkey.pem')),
  cert: readFileSync(resolve(currentDirectory, './private/localhost-cert.pem'))
});

assetServer.on('request', (request, response) => {
  const { origin } = request.headers;

  switch (request.method) {
    case 'OPTIONS': {
      if (origin && alloweOrigins.has(origin)){
        response.writeHead(200, {
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Cache-Control',
        });

        response.end();
      } else {
        response.statusCode = 403;
        response.end();
      }
      break;
    }

    case 'GET': {
      if (origin && alloweOrigins.has(origin)){
        setTimeout(() => {
          console.log('Requested a JSON!');
          response.writeHead(200, {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=16'
          });
      
          response.write(`{ "foo": ["bar", "biz", "boz"], "cyka": "blyat" }`);
          
          response.end();
        }, 1000);

      } else {
        response.statusCode = 403;
        response.end();
      }

      break;
    }

    default: 
      response.statusCode = 403;
      response.end();
  }
 

});

assetServer.listen(PORT, () => {
  console.log(`Done! API server is up and running on port ${PORT}...`);
});

