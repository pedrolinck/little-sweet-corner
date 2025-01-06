import { createServer } from 'http';
import { readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// create server
const server = createServer((req, res) => {
  if (req.url === '/dados' && req.method === 'GET') {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = path.join(__dirname, 'dados', 'data.json');

      // read json file
      readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Erro ao ler o arquivo json: ${err.message}` }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          // return json content
          res.end(data);
        }
      });
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Erro interno do servidor: ${err.message}` }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Rota não encontrada');
  }
});

const PORT = 5500;
server.listen(PORT, () => {
  console.log(`Server running in http://127.0.0.1:${PORT}/dados`);
  // console.log(`Server running in http://localhost:${PORT}/dados`);
});
