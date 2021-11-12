/*
 * @Author: MrAlenZhong
 * @Date: 2021-11-04 11:50:23
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-11-09 16:54:57
 * @Description: 
 */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require("electron");
const {
  BrowserWindow,
  dialog,
  globalShortcut,
  Menu,
  MenuItem,
  net
} = require("@electron/remote");

 
function openDialog() {
  console.log("BrowserWindow", BrowserWindow);
  console.log("dialog ", dialog);
   dialog.showOpenDialog({
     title:'选择你喜欢的文件',
     buttonLabel:'走你',
     filters:[
       {name:"自定义文件",extension:['js','html','json']}
     ]
   },result=>{
     console.log(result);
   })
}

function saveDialog() {
  dialog.showSaveDialog({
    title:"请选择要保存的文件名",
    buttonLabel:"保存",
    filters:[
      {name:'选择类型',extensions:['js','html']}
    ]
  },result => {
    console.log("result");
    fs.writeFileSync(result,"保存文件")
  })
}

function showMessageDialog() {
  dialog.showMessageBox({
    type: "warning",
    title: "确定吗",
    message: "真的要删除吗",
    buttons: ["OK", "cancel"],
  });
}

globalShortcut.register("CommandOrControl+G", () => {
  console.log("您按下了ctrl + G");
});

// console.log(); 
ipcRenderer.sendSync("synchronous-message", "渲染的信息1");

ipcRenderer.on("asynchronous-reply", (event, arg) => {
  console.log("asynchronous-reply"); // prints "pong"
});
ipcRenderer.send("asynchronous-message", "渲染的信息2");

ipcRenderer.on("send-msg-to-renderer",(event,arg)=>{
  console.log("send-msg-to-renderer ", arg);
});

function openMenu(){
  const isMac = process.platform === "darwin";
  const template = [
    {
      label: "File111",
      submenu: [isMac ? { role: "about" } : { role: "about" }],
    },
    {
      label: "File222",
      submenu: [isMac ? { role: "about" } : { role: "about" }],
    }
    // {
    //   label: "File222",
    //   submenu: [isMac ? { role: "close" } : { role: "quit" }],
    // },
    // ...(isMac
    //   ? [
    //       {
    //         label: "xxxx",
    //         submenu: [
    //           { role: "about" },
    //           { type: "separator" },
    //           { role: "services" },
    //           { type: "separator" },
    //           { role: "hide" },
    //           { role: "hideOthers" },
    //           { role: "unhide" },
    //           { type: "separator" },
    //           { role: "quit" },
    //         ],
    //       },
    //     ]
    //   : []),
    // {
    //   label: "Filexxx",
    //   submenu: [isMac ? { role: "close" } : { role: "quit" }],
    // },
    // {
    //   label: "Edit",
    //   submenu: [
    //     { role: "undo" },
    //     { role: "redo" },
    //     { type: "separator" },
    //     { role: "cut" },
    //     { role: "copy" },
    //     { role: "paste" },
    //     ...(isMac
    //       ? [
    //           { label: "xxxxsss" },
    //           { role: "pasteAndMatchStyle" },
    //           { role: "delete" },
    //           { role: "selectAll" },
    //           { type: "separator" },
    //           {
    //             label: "Speech",
    //             submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
    //           },
    //         ]
    //       : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    //   ],
    // },
    // // { role: 'viewMenu' }
    // {
    //   label: "View",
    //   submenu: [
    //     { role: "reload" },
    //     { role: "forceReload" },
    //     { role: "toggleDevTools" },
    //     { type: "separator" },
    //     { role: "resetZoom" },
    //     { role: "zoomIn" },
    //     { role: "zoomOut" },
    //     { type: "separator" },
    //     { role: "togglefullscreen" },
    //   ],
    // },
    // // { role: 'windowMenu' }
    // {
    //   label: "Window",
    //   submenu: [
    //     { role: "minimize" },
    //     { role: "zoom" },
    //     ...(isMac
    //       ? [
    //           { type: "separator" },
    //           { role: "front" },
    //           { type: "separator" },
    //           { role: "window" },
    //         ]
    //       : [{ role: "close" }]),
    //   ],
    // },
    // {
    //   role: "help",
    //   submenu: [
    //     {
    //       label: "Learn More",
    //       click: async () => {
    //         const { shell } = require("electron");
    //         await shell.openExternal("https://electronjs.org");
    //       },
    //     },
    //   ],
    // },
  ];


  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  menu.popup();
}

function accessBaidu() {
  // const {net} = require('electron')
  const request = net.request("https://www.baidu.com");
  request.on("response", (res) => {
    console.log(`status code ${res.statusCode}`);
    console.log(`status code ${JSON.stringify(res.header)}`);
    res.on("data", (chunk) => {
      console.log("接收到数据", chunk.toString());
    });
    res.on("end", () => {
      console.log("数据接受完");
    });
  });
  request.end();
}