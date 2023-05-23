const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');

let mainWindow;
let serverProcess; // Declare serverProcess variable outside of functions

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  console.log('startServer called');
  serverProcess = spawn('node', ['server.js']);

  serverProcess.stdout.on('data', (data) => {
    console.log('data', data);
    // Display the server output in the GUI
    mainWindow.webContents.send('server-output', data.toString());
  });

  serverProcess.on('close', (code) => {
    // Server process has exited
    console.log('close', code);
    mainWindow.webContents.send('server-closed', code);
  });

  serverProcess.on('error', (err) => {
    // Handle server process error
    console.error('Server process error:', err);
    mainWindow.webContents.send('server-error', err.message);
  });
}

function stopServer() {
  console.log('stopServer called');
  if (serverProcess) {
    serverProcess.kill();

    serverProcess.on('exit', (code, signal) => {
      // Server process has exited
      console.log('Server process exited with code:', code);
      mainWindow.webContents.send('server-stopped', code);
    });

    serverProcess = null; // Clear the reference to the server process
  }
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC listeners for communication with renderer process
const { ipcMain } = require('electron');

ipcMain.on('start-server', () => {
  startServer();
});

ipcMain.on('stop-server', () => {
  stopServer();
});
