const { ipcRenderer } = require('electron');

const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const outputContainer = document.getElementById('output');

// const qrcode = new QRCode(document.getElementById("qrcode"), {
//   text: "http://127.0.0.1:3005",
//   width: 128,
//   height: 128,
// });


startButton.addEventListener('click', () => {
  ipcRenderer.send('start-server');
});

stopButton.addEventListener('click', () => {
  ipcRenderer.send('stop-server');
});

ipcRenderer.on('server-output', (event, data) => {
  outputContainer.innerText += data;
  let idAddress = data.split('-')[1]
  console.log(idAddress);
  const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: idAddress || "http://127.0.0.1:3005",
    width: 128,
    height: 128,
  });
});

ipcRenderer.on('server-closed', (event, code) => {
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("output").innerHTML = "";
  outputContainer.innerText += `Server Closed!\n`;
});
