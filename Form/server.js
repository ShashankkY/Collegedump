const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile('messages.txt', 'utf-8', (err, data) => {
      const messages = data ? data.split('\n').reverse().join('<br>') : '';
      res.setHeader('Content-Type', 'text/html');
      res.write(`<html><body>
        <h2>Messages:</h2>
        <p>${messages}</p>
        <form action="/message" method="POST">
          <input type="text" name="message" required />
          <button type="submit">Send</button>
        </form>
      </body></html>`);
      res.end();
    });
  } else if (req.url === '/message' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); // Buffer to string
    });

    req.on('end', () => {
      const message = decodeURIComponent(body.split('=')[1]);
      fs.appendFile('messages.txt', `${message}\n`, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      });
    });

  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
