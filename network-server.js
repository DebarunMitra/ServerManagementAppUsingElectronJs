const express = require('express');
const path = require('path');
const http = require('http');
const ip = require('ip');
const os = require('os');

const app = express();
let hostname = '127.0.0.1'; //localhost
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

function getWiFiIPAddress() {
  const interfaces = os.networkInterfaces();
  const wifiInterface = interfaces['en0'] || interfaces['wlan0']; // Adjust the interface name based on your system (e.g., 'Wi-Fi', 'wlan0', 'eth0')
 
  // console.log(interfaces);
  if (wifiInterface) {
    const wifiAddressInfo = wifiInterface.find(address => address.family === 'IPv4');
    if (wifiAddressInfo) {
      // console.log(wifiAddressInfo.address);
      return {
        address: wifiAddressInfo.address,
        netmask: wifiAddressInfo.netmask
      }
    }
  }

  return null; // Return null if the Wi-Fi interface or IP address is not found
}

server = http.createServer(app);

const wifiIP = getWiFiIPAddress();
hostname = wifiIP.address;

server.listen(port, hostname);
server.on('listening', function() {
    // console.log('Wi-Fi IP address:', wifiIPAddress);
    console.log(`Network host - http://${wifiIP.address}:${port}/` );
});

// server.listen(port, networkHostname);
// server.on('listening', function() {
//     console.log(`Network Host: Express server started on port %s at %s http://${server.address().address}:${server.address().port}` );
// });
