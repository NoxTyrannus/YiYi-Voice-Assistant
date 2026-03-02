const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('yiyi', {
  sendMessage: (text) => ipcRenderer.invoke('send-message', text),
  getSchedules: () => ipcRenderer.invoke('get-schedules')
});
