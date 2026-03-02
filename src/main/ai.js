const axios = require('axios');

const SILICONFLOW_API_KEY = 'sk-uuhaaccwsskiqwnptmtzcmoqffmxadwwonrkxgilhlrdeesc';
const SILICONFLOW_BASE_URL = 'https://api.siliconflow.cn/v1';

class AIService {
  constructor() {
    this.apiKey = SILICONFLOW_API_KEY;
    this.baseURL = SILICONFLOW_BASE_URL;
    this.model = 'Pro/zai-org/GLM-4.7';
    this.conversationHistory = [];
  }

  async chat(userMessage, stream = false) {
    try {
      // 添加用户消息到历史
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // 保持历史记录在合理范围内
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是YiYi，一个智能语音助手。你友好、简洁、高效。回答时请保持简短自然，适合语音播报。'
            },
            ...this.conversationHistory
          ],
          stream: stream,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: stream ? 'stream' : 'json'
        }
      );

      if (stream) {
        return response.data;
      } else {
        const assistantMessage = response.data.choices[0].message.content;
        
        // 添加助手回复到历史
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage
        });

        return assistantMessage;
      }
    } catch (error) {
      console.error('AI服务错误:', error.message);
      throw new Error('AI服务暂时不可用，请稍后再试');
    }
  }

  async textToSpeech(text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/audio/speech`,
        {
          model: 'fnlp/MOSS-TTSD-v0.5',
          input: `[S1]${text}`,
          voice: 'fnlp/MOSS-TTSD-v0.5:alex',
          response_format: 'mp3',
          speed: 1.0,
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'stream'
        }
      );

      return response.data;
    } catch (error) {
      console.error('语音合成错误:', error.message);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = AIService;
