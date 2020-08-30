const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
// Is app on a mac?
const isMac = process.platform === 'darwin' ? true : false

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()

        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    })

    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
    createWindow();
    // add the menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// create a custom menu
const menu = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
        role: 'fileMenu'
    },
    {
        role: 'editMenu'
    },
    {
        label: 'Logs',
        submenu: [
            {
                label: 'Clear all',
                click: () => clearLogs()
            }
        ]
    },
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                { role: 'toggledevtools' }
            ]
        }
    ] : [])
]

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});