class IntentParser {
  constructor() {
    this.intentPatterns = {
      addSchedule: [
        /添加.*日程/,
        /增加.*日程/,
        /新建.*日程/,
        /创建.*日程/,
        /添加.*提醒/,
        /帮我记/,
        /记住/
      ],
      querySchedule: [
        /查询.*日程/,
        /查看.*日程/,
        /最近.*日程/,
        /有什么.*日程/,
        /日程.*安排/
      ],
      modifySchedule: [
        /修改.*日程/,
        /更改.*日程/,
        /更新.*日程/
      ],
      completeSchedule: [
        /完成.*日程/,
        /标记.*完成/,
        /日程.*完成/,
        /已完成/
      ],
      addReminder: [
        /提醒我/,
        /设置提醒/,
        /定时提醒/
      ],
      greeting: [
        /你好/,
        /早上好/,
        /晚上好/
      ],
      thanks: [
        /谢谢/,
        /感谢/
      ],
      goodbye: [
        /再见/,
        /拜拜/
      ]
    };
  }

  parse(text) {
    const lowerText = text.toLowerCase();

    // 检查各个意图
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerText)) {
          return {
            intent,
            originalText: text,
            entities: this.extractEntities(text, intent)
          };
        }
      }
    }

    // 默认为对话
    return {
      intent: 'chat',
      originalText: text,
      entities: {}
    };
  }

  extractEntities(text, intent) {
    const entities = {};

    switch (intent) {
      case 'addSchedule':
        // 提取日程标题
        const titleMatch = text.match(/(?:添加|新建|创建).*日程[：:\s]*(.+?)(?:时间|$)/);
        if (titleMatch) {
          entities.title = titleMatch[1].trim();
        }

        // 提取时间
        entities.time = this.extractTime(text);
        break;

      case 'addReminder':
        // 提取提醒内容
        const contentMatch = text.match(/(?:提醒我|设置提醒)[：:\s]*(.+?)(?:时间|$)/);
        if (contentMatch) {
          entities.content = contentMatch[1].trim();
        }

        // 提取时间
        entities.time = this.extractTime(text);
        break;

      case 'modifySchedule':
        // 提取日程ID或标题
        entities.target = text.replace(/修改|更改|更新|日程/g, '').trim();
        break;

      case 'completeSchedule':
        // 提取日程ID或标题
        entities.target = text.replace(/完成|标记|日程|已|的/g, '').trim();
        break;
    }

    return entities;
  }

  extractTime(text) {
    const now = new Date();
    
    // 相对时间
    if (text.includes('今天')) {
      const hourMatch = text.match(/(\d{1,2})[点时](\d{1,2})?分?/);
      if (hourMatch) {
        now.setHours(parseInt(hourMatch[1]), hourMatch[2] ? parseInt(hourMatch[2]) : 0, 0, 0);
        return now.toISOString();
      }
      return now.toISOString();
    }
    
    if (text.includes('明天')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const hourMatch = text.match(/(\d{1,2})[点时](\d{1,2})?分?/);
      if (hourMatch) {
        tomorrow.setHours(parseInt(hourMatch[1]), hourMatch[2] ? parseInt(hourMatch[2]) : 0, 0, 0);
      } else {
        tomorrow.setHours(9, 0, 0, 0);
      }
      return tomorrow.toISOString();
    }

    // 绝对时间（如：3月5日下午3点）
    const dateMatch = text.match(/(\d{1,2})月(\d{1,2})[日号]/);
    const timeMatch = text.match(/(上午|下午|晚上)?(\d{1,2})[点时](\d{1,2})?分?/);
    
    if (dateMatch || timeMatch) {
      const date = new Date();
      
      if (dateMatch) {
        date.setMonth(parseInt(dateMatch[1]) - 1);
        date.setDate(parseInt(dateMatch[2]));
      }
      
      if (timeMatch) {
        let hour = parseInt(timeMatch[2]);
        if (timeMatch[1] === '下午' || timeMatch[1] === '晚上') {
          hour += 12;
        }
        date.setHours(hour, timeMatch[3] ? parseInt(timeMatch[3]) : 0, 0, 0);
      }
      
      return date.toISOString();
    }

    // 默认：明天上午9点
    const defaultTime = new Date(now);
    defaultTime.setDate(defaultTime.getDate() + 1);
    defaultTime.setHours(9, 0, 0, 0);
    return defaultTime.toISOString();
  }
}

module.exports = IntentParser;
