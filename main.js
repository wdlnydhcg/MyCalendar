/*
 * @Author: MrAlenZhong
 * @Date: 2021-11-04 11:50:23
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-11-12 15:09:25
 * @Description: 
 */
// Modules to control application life and create native browser window

const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
} = require("electron");
  
    // require("@electron/remote/main").enable(mainWindow.webContents);
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 开启node
      nodeIntegration: true,
      contextIsolation: false,
      // 开启remote
      enableRemoteModule: true,

      preload: path.join(__dirname, "preload.js"),
    },
  });

  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);

  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()
  mainWindow.webContents.send(
    "send-msg-to-renderer",
    "我是主，我主动和你接触"
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray;
app.whenReady().then(() => {
  createWindow()
  //不知道为啥不能用这个icns
  // const tray = new Tray(path.join("./icon/app.icns")); 
  tray = new Tray(path.join("./icon/icon@3x.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);

  const ret = globalShortcut.register("CommandOrControl+I", () => {
    console.log("CommanOrControl+I  is pressed");
  });
  if(!ret){
    console.log("register failed");
  }
  console.log(globalShortcut.isRegistered("CommanOrControl+I"));

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createWindow()
    
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg);
  event.reply("asynchronous-reply", "主的信息1");
});

ipcMain.on("synchronous-message", (event, arg) => {
  console.log(arg);
  event.returnValue = "主的信息2";
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
