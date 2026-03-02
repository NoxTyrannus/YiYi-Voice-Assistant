const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const VoiceService = require('./voice');
const AIService = require('./ai');
const ScheduleManager = require('./schedule');
const ReminderManager = require('./reminder');
const IntentParser = require('./intent');

let mainWindow = null;
let tray = null;
let voiceService = null;
let aiService = null;
let scheduleManager = null;
let reminderManager = null;
let intentParser = null;
let isAwake = false;

// 创建托盘图标
function createTray() {
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(icon.resize({ width: 22, height: 22 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'YiYi状态：运行中', enabled: false },
    { type: 'separator' },
    { 
      label: '唤醒YiYi', 
      click: () => {
        isAwake = true;
        voiceService.speak('我在');
      }
    },
    { type: 'separator' },
    { 
      label: '退出', 
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('YiYi智能助手');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    isAwake = true;
    voiceService.speak('我在');
  });
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    },
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

// 处理用户输入
async function handleUserInput(text) {
  console.log('用户输入:', text);
  
  const intent = intentParser.parse(text);
  console.log('识别意图:', intent);

  let response = '';

  try {
    switch (intent.intent) {
      case 'greeting':
        response = '你好，我是YiYi，有什么可以帮你的吗？';
        break;

      case 'thanks':
        response = '不客气，很高兴能帮到你';
        break;

      case 'goodbye':
        response = '再见，随时叫我';
        break;

      case 'addSchedule':
        const scheduleResult = scheduleManager.addSchedule(
          intent.entities.title || '未命名日程',
          '',
          intent.entities.time,
          null
        );
        response = scheduleResult.message;
        break;

      case 'querySchedule':
        const queryResult = scheduleManager.getRecentSchedules(5);
        response = queryResult.message;
        break;

      case 'modifySchedule':
        response = '请告诉我具体要修改哪个日程的什么内容';
        break;

      case 'completeSchedule':
        response = '请告诉我具体要标记哪个日程为已完成';
        break;

      case 'addReminder':
        const reminderResult = reminderManager.addReminder(
          intent.entities.content || '提醒',
          intent.entities.time
        );
        response = reminderResult.message;
        break;

      case 'chat':
      default:
        // 使用AI对话
        response = await aiService.chat(text);
        break;
    }
  } catch (error) {
    console.error('处理失败:', error);
    response = '抱歉，处理出现错误，请稍后再试';
  }

  // 语音回复
  await voiceService.speak(response);
  
  return response;
}

// 启动语音监听
async function startVoiceListening() {
  console.log('启动语音监听...');
  
  // 持续监听唤醒词
  const checkWakeWord = async () => {
    if (!isAwake) {
      try {
        // 使用AppleScript监听唤醒词
        const { exec } = require('child_process');
        exec('osascript -e "tell application \\"SpeechRecognitionServer\\" to listen for {\\"YiYi\\"} with prompt \\"\\""', 
          (error, stdout) => {
            if (!error && stdout.trim()) {
              console.log('检测到唤醒词');
              isAwake = true;
              voiceService.speak('我在');
              
              // 监听用户指令
              setTimeout(async () => {
                try {
                  const userInput = await voiceService.recordAndTranscribe(10000);
                  if (userInput) {
                    await handleUserInput(userInput);
                  }
                  isAwake = false;
                } catch (err) {
                  console.error('识别失败:', err);
                  isAwake = false;
                }
              }, 500);
            }
          }
        );
      } catch (error) {
        console.error('监听错误:', error);
      }
    }
    
    // 继续监听
    setTimeout(checkWakeWord, 1000);
  };
  
  checkWakeWord();
}

// 应用就绪
app.whenReady().then(async () => {
  // 初始化服务
  voiceService = new VoiceService();
  aiService = new AIService();
  scheduleManager = new ScheduleManager();
  intentParser = new IntentParser();
  reminderManager = new ReminderManager(voiceService);

  // 创建窗口和托盘
  createWindow();
  createTray();

  // 启动语音监听
  startVoiceListening();

  // 安装完成提示
  setTimeout(() => {
    voiceService.speak('安装已完成，YiYi已就位');
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// IPC通信
ipcMain.handle('send-message', async (event, text) => {
  return await handleUserInput(text);
});

ipcMain.handle('get-schedules', async () => {
  return scheduleManager.getRecentSchedules(10);
});

// 应用退出
app.on('before-quit', () => {
  if (scheduleManager) scheduleManager.close();
  if (reminderManager) reminderManager.close();
});

// 防止应用关闭
app.on('window-all-closed', (e) => {
  e.preventDefault();
  app.dock.hide();
});
