const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const SILICONFLOW_API_KEY = 'sk-uuhaaccwsskiqwnptmtzcmoqffmxadwwonrkxgilhlrdeesc';
const SILICONFLOW_BASE_URL = 'https://api.siliconflow.cn/v1';

class VoiceService {
  constructor() {
    this.isListening = false;
    this.isAwake = false;
  }

  // 使用macOS本地语音合成（最快速度）
  speak(text) {
    return new Promise((resolve, reject) => {
      const safeText = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
      exec(`say "${safeText}"`, (error) => {
        if (error) {
          console.error('语音合成错误:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // 使用macOS本地语音合成（异步，不等待完成）
  speakAsync(text) {
    const safeText = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
    exec(`say "${safeText}"`, (error) => {
      if (error) {
        console.error('语音合成错误:', error);
      }
    });
  }

  // 使用macOS语音识别（需要用户授权）
  async startListening(callback) {
    if (this.isListening) return;
    
    this.isListening = true;
    
    // 使用macOS的speech recognition
    const script = `
      tell application "SpeechRecognitionServer"
        try
          set theResponse to listen for {"YiYi", "一一", "依依"} with prompt ""
          return theResponse
        on error
          return ""
        end try
      end tell
    `;

    const listenInterval = setInterval(async () => {
      if (!this.isListening) {
        clearInterval(listenInterval);
        return;
      }

      try {
        const result = await this.runAppleScript(script);
        if (result && result.trim()) {
          callback(result.trim());
        }
      } catch (error) {
        console.error('监听错误:', error);
      }
    }, 1000);
  }

  stopListening() {
    this.isListening = false;
  }

  // 运行AppleScript
  runAppleScript(script) {
    return new Promise((resolve, reject) => {
      const safeScript = script.replace(/"/g, '\\"');
      exec(`osascript -e "${safeScript}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  // 录音并转文字（简化版：使用系统语音识别）
  async recordAndTranscribe(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const script = `
        tell application "SpeechRecognitionServer"
          try
            set theResponse to listen for {"帮我", "添加", "查询", "修改", "删除", "提醒", "日程", "完成"} with prompt "" timeout ${timeout / 1000}
            return theResponse
          on error
            return ""
          end try
        end tell
      `;

      this.runAppleScript(script)
        .then(result => resolve(result))
        .catch(error => reject(error));
    });
  }

  // 使用SiliconFlow的语音合成（备用方案）
  async synthesizeWithSiliconFlow(text) {
    try {
      const response = await axios.post(
        `${SILICONFLOW_BASE_URL}/audio/speech`,
        {
          model: 'fnlp/MOSS-TTSD-v0.5',
          input: `[S1]${text}`,
          voice: 'fnlp/MOSS-TTSD-v0.5:alex',
          response_format: 'mp3',
          speed: 1.0
        },
        {
          headers: {
            'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      // 保存音频文件
      const audioPath = path.join('/tmp', `yiyi_${Date.now()}.mp3`);
      fs.writeFileSync(audioPath, response.data);

      // 播放音频
      return new Promise((resolve, reject) => {
        exec(`afplay "${audioPath}"`, (error) => {
          if (error) {
            reject(error);
          } else {
            fs.unlinkSync(audioPath);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('SiliconFlow语音合成错误:', error);
      throw error;
    }
  }
}

module.exports = VoiceService;
