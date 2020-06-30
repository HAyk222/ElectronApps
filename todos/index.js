const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow
let addWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

})

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 300,
    height: 200,
    title: 'Add New Window'
  })

  addWindow.loadURL(`file://${__dirname}/add.html`)
  addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close()
})

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New Todo',
        click() {
          createAddWindow()
        }
      },
      { 
        label: 'Clear Todos',
        click() {
          mainWindow.webContents.send('todos:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Command + Q'
          } else {
            return 'Control + Q'
          }
        })(),
        click() {
          app.quit()
        }
      }
    ]
  }
]

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command + Alt + I' : 'Control + Shift + I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
