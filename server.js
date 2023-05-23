const express = require('express');
const path = require('path');
const http = require('http');
const ip = require('ip');

const app = express();
const hostname = '127.0.0.1'; //localhost
// const networkHostname = ip.address();
const port = 3005; // Change the port number if needed
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    console.log('Send the build!');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.listen(port, 'localhost', () => {
//   console.log(`Server is listening on port ${port}`);
// });

server = http.createServer(app);

server.listen(port, hostname);
server.on('listening', function() {
    console.log(`Localhost: Express server started on port %s at %s http://${server.address().address}:${server.address().port}` );
});

// server.listen(port, networkHostname);
// server.on('listening', function() {
//     console.log(`Network Host: Express server started on port %s at %s http://${server.address().address}:${server.address().port}` );
// });
