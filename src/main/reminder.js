const schedule = require('node-schedule');
const DatabaseManager = require('./database');

class ReminderManager {
  constructor(voiceService) {
    this.db = new DatabaseManager();
    this.voiceService = voiceService;
    this.jobs = new Map();
    this.loadPendingReminders();
  }

  // 加载待处理的提醒
  loadPendingReminders() {
    try {
      const reminders = this.db.getPendingReminders();
      reminders.forEach(reminder => {
        this.scheduleReminder(reminder.id, reminder.content, new Date(reminder.remind_time));
      });
      console.log(`已加载 ${reminders.length} 个待处理提醒`);
    } catch (error) {
      console.error('加载提醒失败:', error);
    }
  }

  // 添加提醒
  addReminder(content, remindTime) {
    try {
      const result = this.db.addReminder(content, remindTime);
      const reminderId = result.lastInsertRowid;
      
      // 调度提醒
      this.scheduleReminder(reminderId, content, new Date(remindTime));
      
      return {
        success: true,
        message: `已设置提醒：${content}`,
        id: reminderId
      };
    } catch (error) {
      console.error('添加提醒失败:', error);
      return {
        success: false,
        message: '添加提醒失败'
      };
    }
  }

  // 调度提醒任务
  scheduleReminder(id, content, time) {
    // 如果时间已过，立即触发
    if (time <= new Date()) {
      this.triggerReminder(id, content);
      return;
    }

    const job = schedule.scheduleJob(time, () => {
      this.triggerReminder(id, content);
    });

    if (job) {
      this.jobs.set(id, job);
    }
  }

  // 触发提醒
  async triggerReminder(id, content) {
    try {
      // 语音播报提醒
      await this.voiceService.speak(`提醒：${content}`);
      
      // 标记为已完成
      this.db.completeReminder(id);
      
      // 移除任务
      this.jobs.delete(id);
      
      console.log(`提醒已触发: ${content}`);
    } catch (error) {
      console.error('触发提醒失败:', error);
    }
  }

  // 取消提醒
  cancelReminder(id) {
    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
    }
    
    this.db.completeReminder(id);
    
    return {
      success: true,
      message: '提醒已取消'
    };
  }

  // 清理已完成的任务
  cleanup() {
    this.jobs.forEach((job, id) => {
      if (!job.nextInvocation()) {
        this.jobs.delete(id);
      }
    });
  }

  // 关闭数据库连接
  close() {
    this.jobs.forEach(job => job.cancel());
    this.jobs.clear();
    this.db.close();
  }
}

module.exports = ReminderManager;
