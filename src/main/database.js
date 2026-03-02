const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'yiyi.db');
    
    this.db = new Database(dbPath);
    this.initTables();
  }

  initTables() {
    // 日程表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 提醒表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        remind_time DATETIME NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 对话历史表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // 日程相关操作
  addSchedule(title, description, startTime, endTime) {
    const stmt = this.db.prepare(`
      INSERT INTO schedules (title, description, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(title, description, startTime, endTime);
  }

  getSchedules(limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM schedules 
      WHERE status = 'pending' AND start_time >= datetime('now', 'localtime')
      ORDER BY start_time ASC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  getAllSchedules() {
    const stmt = this.db.prepare(`
      SELECT * FROM schedules 
      ORDER BY start_time DESC
    `);
    return stmt.all();
  }

  updateSchedule(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.title) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.startTime) {
      fields.push('start_time = ?');
      values.push(updates.startTime);
    }
    if (updates.endTime) {
      fields.push('end_time = ?');
      values.push(updates.endTime);
    }
    if (updates.status) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE schedules SET ${fields.join(', ')} WHERE id = ?
    `);
    return stmt.run(...values);
  }

  completeSchedule(id) {
    const stmt = this.db.prepare(`
      UPDATE schedules SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    return stmt.run(id);
  }

  // 提醒相关操作
  addReminder(content, remindTime) {
    const stmt = this.db.prepare(`
      INSERT INTO reminders (content, remind_time)
      VALUES (?, ?)
    `);
    return stmt.run(content, remindTime);
  }

  getPendingReminders() {
    const stmt = this.db.prepare(`
      SELECT * FROM reminders 
      WHERE status = 'pending' AND remind_time <= datetime('now', 'localtime')
    `);
    return stmt.all();
  }

  completeReminder(id) {
    const stmt = this.db.prepare(`
      UPDATE reminders SET status = 'completed' WHERE id = ?
    `);
    return stmt.run(id);
  }

  // 对话历史
  addConversation(role, content) {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (role, content)
      VALUES (?, ?)
    `);
    return stmt.run(role, content);
  }

  getRecentConversations(limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
