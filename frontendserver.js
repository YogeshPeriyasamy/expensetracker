const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Change this to the port you want

const server = http.createServer((req, res) => {
    // Serve the index.html file
    if (req.url === '/user/loginpage') {
        fs.readFile(path.join(__dirname, './view/loginpage.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        // Handle other routes or static files here if needed
        res.writeHead(404);
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});
