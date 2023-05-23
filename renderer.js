const { ipcRenderer } = require('electron');

const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const outputContainer = document.getElementById('output');

startButton.addEventListener('click', () => {
  ipcRenderer.send('start-server');
});

stopButton.addEventListener('click', () => {
  ipcRenderer.send('stop-server');
});

ipcRenderer.on('server-output', (event, data) => {
  outputContainer.innerText += data;
});

ipcRenderer.on('server-closed', (event, code) => {
  outputContainer.innerText += `Server process exited with code ${code}\n`;
});
