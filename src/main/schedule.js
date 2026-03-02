const DatabaseManager = require('./database');

class ScheduleManager {
  constructor() {
    this.db = new DatabaseManager();
  }

  // 添加日程
  addSchedule(title, description, startTime, endTime) {
    try {
      const result = this.db.addSchedule(title, description, startTime, endTime);
      return {
        success: true,
        message: `已添加日程：${title}`,
        id: result.lastInsertRowid
      };
    } catch (error) {
      console.error('添加日程失败:', error);
      return {
        success: false,
        message: '添加日程失败，请稍后再试'
      };
    }
  }

  // 查询最近日程
  getRecentSchedules(limit = 5) {
    try {
      const schedules = this.db.getSchedules(limit);
      
      if (schedules.length === 0) {
        return {
          success: true,
          message: '暂无即将到来的日程',
          schedules: []
        };
      }

      const message = schedules.map((s, i) => {
        const time = new Date(s.start_time).toLocaleString('zh-CN', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${i + 1}. ${s.title}，时间：${time}`;
      }).join('；');

      return {
        success: true,
        message: `最近的${schedules.length}个日程：${message}`,
        schedules
      };
    } catch (error) {
      console.error('查询日程失败:', error);
      return {
        success: false,
        message: '查询日程失败'
      };
    }
  }

  // 修改日程
  updateSchedule(id, updates) {
    try {
      this.db.updateSchedule(id, updates);
      return {
        success: true,
        message: '日程已更新'
      };
    } catch (error) {
      console.error('更新日程失败:', error);
      return {
        success: false,
        message: '更新日程失败'
      };
    }
  }

  // 标记日程为已完成
  completeSchedule(id) {
    try {
      this.db.completeSchedule(id);
      return {
        success: true,
        message: '日程已标记为完成'
      };
    } catch (error) {
      console.error('完成日程失败:', error);
      return {
        success: false,
        message: '操作失败'
      };
    }
  }

  // 解析自然语言日期时间
  parseDateTime(text) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 简单的日期解析规则
    const patterns = {
      '今天': now,
      '明天': tomorrow,
      '后天': new Date(now.setDate(now.getDate() + 2)),
      '下周': new Date(now.setDate(now.getDate() + 7))
    };

    for (const [keyword, date] of Object.entries(patterns)) {
      if (text.includes(keyword)) {
        // 提取时间
        const timeMatch = text.match(/(\d{1,2})[点时](\d{1,2})?分?/);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
          date.setHours(hour, minute, 0, 0);
        }
        return date.toISOString();
      }
    }

    // 如果没有匹配到关键词，返回明天的默认时间
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString();
  }

  // 关闭数据库连接
  close() {
    this.db.close();
  }
}

module.exports = ScheduleManager;
