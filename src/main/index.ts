import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import logger from "electron-log";
import { autoUpdater } from "electron-updater";
import os from "os";
import { join } from "path";
import { ReadlineParser, SerialPort } from "serialport";
import icon from "../../resources/icon.png?asset";
import Store from "electron-store";

const store = new Store({
  defaults: {
    defaultPrinter: "TSC TE210",
  },
});

let serialPort: SerialPort | null;
let parser: any;

logger.initialize();

const delay = (timeout: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), timeout));

const goTheLock = app.requestSingleInstanceLock();

if (!goTheLock) {
  app.quit();
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    fullscreen: !is.dev,
    autoHideMenuBar: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
    title: `Peksan Üretim - v${app.getVersion()}`,
  });

  const printWindow = new BrowserWindow({
    show: false,
    parent: mainWindow,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  const openSerialPort = async (path: string) => {
    serialPort = new SerialPort({
      path,
      baudRate: 9600,
      autoOpen: true,
    });
    parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n\n\n" }));

    serialPort.on("open", () => {
      dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "COM Port Bağlantısı",
        message: `${path} bağlantısı başarılı`,
      });
    });

    serialPort.on("close", () => {
      if (serialPort) {
        dialog.showMessageBox(mainWindow, {
          type: "error",
          title: "Hata",
          message: "Com port bağlantısı koptu, lütfen kabloyu kontrol ediniz",
        });
      }
    });

    serialPort.on("error", (error) => {
      dialog.showMessageBox(mainWindow, {
        type: "error",
        title: "Hata",
        message: `${error.name}: ${error.message}`,
      });
    });

    parser?.on("data", (received: any) => {
      const regex = /[-+]?\d*\.\d+|\d+/g;
      const matches = received.toString().match(regex);

      if (matches && matches.length === 4) {
        const data = {
          net: parseFloat(matches[0]),
          dara: parseFloat(matches[3]),
        };

        if (data.dara <= 0.1) {
          dialog.showMessageBox(mainWindow, {
            type: "error",
            title: "Hata",
            message: `Dara verisini kontrol ediniz`,
          });
          return;
        }

        mainWindow.webContents.send("scale-data", data);
      } else {
        dialog.showMessageBox(mainWindow, {
          type: "error",
          title: "Hata",
          message: `Terazi verisi hatalı, darayı veya kabloyu kontrol ediniz`,
        });
        return;
      }
    });
  };

  ipcMain.on("connect-com-port", async (_, data: string) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close();
      serialPort = null;

      await delay(300);
    }

    openSerialPort(data);
  });

  ipcMain.handle("get-serial-ports", async () => {
    const portLists = await SerialPort.list();

    console.log(portLists);

    return portLists;
  });

  ipcMain.handle("get-active-port", () => serialPort);

  ipcMain.handle("get-host-name", () => os.userInfo().username);

  ipcMain.handle("get-app-version", () => app.getVersion());

  ipcMain.handle("get-printers", async () => {
    const printers = await mainWindow.webContents.getPrintersAsync();
    return printers
      .map((printer) => printer.name)
      .filter((name) => name.toLowerCase().includes("tsc"));
  });

  ipcMain.handle("set-default-printer", (_, printerName: string) => {
    store.set("defaultPrinter", printerName);
    return true;
  });

  ipcMain.handle("get-default-printer", () => {
    return store.get("defaultPrinter");
  });

  ipcMain.on("close", () => {
    mainWindow.close();
    printWindow.close();
    app.quit();
  });

  ipcMain.on("print-label", async (_, data) => {
    printWindow.webContents.send("print-label", data);

    await new Promise((resolve) => setTimeout(() => resolve(true), 1000));

    printWindow.webContents.print(
      {
        silent: true,
        printBackground: true,
        deviceName: store.get("defaultPrinter"),
      },
      (success, failure) => {
        let res: ISlipStatus = {
          ok: success,
          error: failure === "" ? null : failure,
          seriNo: data?.serialNo ?? "",
        };

        mainWindow.webContents.send("print-label", res);
      }
    );
  });

  ipcMain.on("scale-data-deneme", (_, { net, dara }) => {
    console.log(net, dara);

    mainWindow.webContents.send("scale-data", {
      net,
      dara,
    });
  });

  mainWindow.on("ready-to-show", async () => {
    mainWindow.show();
    mainWindow.maximize();

    autoUpdater.forceDevUpdateConfig = false;
    autoUpdater.disableWebInstaller = true;
    autoUpdater.autoDownload = false;
    autoUpdater.autoRunAppAfterInstall = true;

    autoUpdater.setFeedURL({
      provider: "generic",
      url: "http://192.168.2.251:9001/api/App/Download",
      updaterCacheDirName: "peksan-uretim-updater-cache",
    });

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.addListener("update-available", (event) => {
      autoUpdater.downloadUpdate();
      mainWindow.webContents.send("update-available", event.version);
    });
    autoUpdater.addListener("download-progress", (event) => {
      mainWindow.webContents.send(
        "download-progress",
        parseInt(event.percent.toString())
      );
    });
    autoUpdater.addListener("update-not-available", () => {
      mainWindow.webContents.send("update-not-available");
    });
    autoUpdater.addListener("update-downloaded", () => {
      autoUpdater.quitAndInstall();
    });
    autoUpdater.addListener("error", (error) => {
      mainWindow.webContents.send("error", error.message);
    });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    printWindow.loadURL(process.env["ELECTRON_RENDERER_URL"] + "#/print");
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    printWindow.loadFile(join(__dirname, "../renderer/index.html"), {
      hash: "#/print",
    });
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
