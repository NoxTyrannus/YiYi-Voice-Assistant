# YiYi 智能语音助手

一个基于Electron的智能语音助手，支持语音唤醒、日程管理、定时提醒和AI对话功能。

## 功能特性

✨ **语音唤醒** - 说"YiYi"即可唤醒助手  
🗓️ **日程管理** - 添加、查询、修改日程  
⏰ **定时提醒** - 智能提醒不遗漏重要事项  
🤖 **AI对话** - 基于SiliconFlow GLM-4.7模型  
⚡ **快速响应** - 本地语音合成，毫秒级响应  

## 系统要求

- macOS 10.14 或更高版本
- 麦克风权限
- 语音识别权限

## 安装方法

### 方式一：直接安装DMG（推荐）

1. 双击打开 `YiYi-1.0.0.dmg`
2. 将 YiYi 拖到 Applications 文件夹
3. 打开 YiYi 应用
4. 首次运行需要授权麦克风和语音识别权限
5. 听到"安装已完成，YiYi已就位"即安装成功

### 方式二：从源码构建

```bash
# 克隆项目
git clone <repository-url>
cd YiYi

# 安装依赖
npm install

# 构建
npm run build

# 安装包位于 dist 目录
```

## 使用方法

1. **唤醒助手**
   - 说"YiYi"唤醒助手
   - 助手会回复"我在"

2. **添加日程**
   - "YiYi，添加明天下午3点的会议"
   - "YiYi，帮我记后天上午10点有面试"

3. **查询日程**
   - "YiYi，查询最近的日程"
   - "YiYi，我有什么日程安排"

4. **设置提醒**
   - "YiYi，提醒我下午5点下班"
   - "YiYi，设置提醒明天早上8点起床"

5. **日常对话**
   - "YiYi，今天天气怎么样"
   - "YiYi，给我讲个笑话"

## 技术架构

- **前端**: Electron + HTML/CSS
- **后端**: Node.js
- **AI服务**: SiliconFlow API (GLM-4.7)
- **语音识别**: macOS Speech Recognition
- **语音合成**: macOS say命令 + SiliconFlow TTS
- **数据库**: SQLite (better-sqlite3)
- **定时任务**: node-schedule

## 配置

应用配置文件位于 `~/Library/Application Support/yiyi-assistant/`

- `yiyi.db` - 数据库文件（日程、提醒、对话历史）

## 隐私说明

YiYi 重视您的隐私：
- 所有日程和提醒数据存储在本地
- 对话历史仅保存在本地数据库
- 需要网络连接使用AI对话功能

## 故障排除

### 应用无法启动
1. 检查系统版本是否符合要求
2. 确认已授权麦克风和语音识别权限
3. 查看控制台日志：`/Applications/Utilities/Console.app`

### 语音唤醒不工作
1. 打开系统偏好设置 > 安全性与隐私 > 隐私
2. 检查麦克风和语音识别权限
3. 重启应用

### AI对话无响应
1. 检查网络连接
2. 确认API密钥有效

## 开发者信息

- **版本**: 1.0.0
- **许可**: MIT
- **技术支持**: YiYi Team

## 致谢

感谢以下开源项目和服务：
- Electron
- SiliconFlow
- better-sqlite3
- node-schedule

---

享受与YiYi的智能交互体验！🎉
