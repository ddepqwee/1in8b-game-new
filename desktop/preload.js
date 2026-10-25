const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("desktop", {
  unlock: ids => ipcRenderer.invoke("steam:unlock", ids),
  quit: () => ipcRenderer.invoke("app:quit"),
});
