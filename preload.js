/**
 * EMPIRE OS - Production-Grade Preload Context Bridge
 * Path: ./preload.js
 * 
 * Safely bridges specific Electron APIs to the frontend window space
 * without exposing critical node shell modules directly.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('empireShell', {
  getShellStatus: () => ipcRenderer.invoke('get-shell-status'),
  toggleAutoStart: (enable) => ipcRenderer.send('toggle-auto-start', enable),
  triggerNotification: (title, body) => ipcRenderer.send('trigger-notification', { title, body }),
  triggerUpdateCheck: () => ipcRenderer.send('trigger-update-check')
});
