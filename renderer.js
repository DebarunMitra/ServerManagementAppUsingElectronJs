const { ipcRenderer } = require('electron');

const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const outputContainer = document.getElementById('output');
const UserDataOutputContainer = document.getElementById('userDataOutput');
const getUserValueButton = document.getElementById('check-activity-btn');
let mainIpAddress = "http://127.0.0.1:3005/";

startButton.addEventListener('click', () => {
  ipcRenderer.send('start-server');
});

stopButton.addEventListener('click', () => {
  ipcRenderer.send('stop-server');
});

ipcRenderer.on('server-output', (event, data) => {
  outputContainer.innerText = "";
  outputContainer.innerText += data;
  let idAddress = data.split('-')[1]
  mainIpAddress = idAddress;
  const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: idAddress || "http://127.0.0.1:3005/",
    width: 128,
    height: 128,
  });
});

ipcRenderer.on('server-closed', (event, code) => {
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("output").innerHTML = "";
  UserDataOutputContainer.innerText = "";
  outputContainer.innerText += `Server Closed!\n`;
});

getUserValueButton.addEventListener('click', () => {
  ipcRenderer.send('get-user-data');
});

ipcRenderer.on('user-details', (event, data) => {
  const jsonData = JSON.parse(data);
  UserDataOutputContainer.innerText = "";
  UserDataOutputContainer.innerText = `${jsonData.length} User Data Available`;
  console.log('List API: http://'+mainIpAddress.split('//')[1].split('/')[0]+'/pogo/user/list');
  console.log(jsonData);
})



