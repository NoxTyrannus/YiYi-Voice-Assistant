# YiYi 开发者指南

## 项目结构

```
YiYi/
├── package.json                 # 项目配置文件
├── electron-builder.yml         # Electron构建配置
├── README.md                    # 项目说明
├── INSTALL.md                   # 安装指南
├── CHANGELOG.md                 # 更新日志
├── .gitignore                   # Git忽略文件
│
├── build/                       # 构建资源
│   └── entitlements.mac.plist   # macOS权限配置
│
├── assets/                      # 应用资源
│   ├── README.md                # 图标文件说明
│   ├── icon.icns                # 应用图标（需准备）
│   └── tray-icon.png            # 托盘图标（需准备）
│
├── scripts/                     # 构建脚本
│   ├── install-deps.sh          # 依赖安装脚本
│   ├── build-dmg.sh             # DMG构建脚本
│   ├── post-build.js            # 构建后处理
│   └── check-prerequisites.sh   # 一键构建脚本
│
└── src/                         # 源代码
    ├── main/                    # 主进程代码
    │   ├── index.js             # 主进程入口
    │   ├── database.js          # 数据库管理
    │   ├── ai.js                # AI服务
    │   ├── voice.js             # 语音服务
    │   ├── schedule.js          # 日程管理
    │   ├── reminder.js          # 提醒管理
    │   └── intent.js            # 意图解析
    │
    ├── renderer/                # 渲染进程
    │   └── index.html           # 主界面
    │
    └── preload/                 # 预加载脚本
        └── index.js             # IPC通信桥接
```

## 核心模块说明

### 1. 主进程 (src/main/)

#### index.js - 主进程入口
- 初始化所有服务
- 创建托盘图标
- 处理IPC通信
- 管理应用生命周期

#### database.js - 数据库管理
- SQLite数据库初始化
- 日程CRUD操作
- 提醒管理
- 对话历史存储

#### ai.js - AI服务
- SiliconFlow API集成
- 对话历史管理
- 流式响应支持
- 语音合成API

#### voice.js - 语音服务
- macOS本地语音识别
- macOS本地语音合成（say命令）
- 语音唤醒检测
- 录音和转写

#### schedule.js - 日程管理
- 日程添加、查询、修改
- 自然语言时间解析
- 日程状态管理

#### reminder.js - 提醒管理
- 定时任务调度（node-schedule）
- 提醒触发和播报
- 任务持久化

#### intent.js - 意图解析
- 自然语言意图识别
- 实体提取（时间、标题等）
- 正则模式匹配

### 2. 渲染进程 (src/renderer/)

#### index.html - 用户界面
- 简洁的状态显示
- 运行状态提示
- 使用说明

### 3. 预加载脚本 (src/preload/)

#### index.js - IPC桥接
- 暴露安全API给渲染进程
- 主进程与渲染进程通信

## 技术栈详解

### 语音交互流程

```
用户说话 → macOS Speech Recognition → 文本
    ↓
意图解析 (intent.js)
    ↓
执行操作 (schedule/reminder/ai)
    ↓
生成回复
    ↓
macOS say命令 → 语音播报
```

### 数据存储

使用SQLite存储：
- 日程数据：schedules表
- 提醒数据：reminders表
- 对话历史：conversations表

数据库位置：`~/Library/Application Support/yiyi-assistant/yiyi.db`

### AI对话集成

使用SiliconFlow API：
- 模型：Pro/zai-org/GLM-4.7
- 支持上下文对话（最近20条）
- 流式响应支持
- 错误重试机制

## 开发调试

### 启动开发模式

```bash
npm start
```

### 查看日志

```bash
# macOS控制台
open /Applications/Utilities/Console.app

# 或查看Electron日志
~/Library/Logs/yiyi-assistant/
```

### 调试主进程

在`package.json`中添加：
```json
"scripts": {
  "debug": "electron --inspect=5858 ."
}
```

然后使用Chrome DevTools连接 `localhost:5858`

## 性能优化

### 语音响应速度

为确保3秒内开始回复：
1. 使用macOS本地`say`命令（<100ms）
2. 流式AI响应（边生成边播报）
3. 预加载常用回复

### 内存优化

- 限制对话历史长度（20条）
- 定期清理已完成的提醒
- 数据库索引优化

## 扩展开发

### 添加新意图

在`src/main/intent.js`中：
```javascript
this.intentPatterns = {
  newIntent: [
    /模式1/,
    /模式2/
  ]
};
```

在`src/main/index.js`的`handleUserInput`中添加处理逻辑。

### 添加新功能模块

1. 在`src/main/`创建新模块文件
2. 在`src/main/index.js`中引入并初始化
3. 在`intent.js`中添加意图识别
4. 实现具体业务逻辑

## 测试

### 手动测试清单

- [ ] 语音唤醒检测
- [ ] 语音识别准确率
- [ ] 语音合成速度
- [ ] 日程添加/查询/修改
- [ ] 定时提醒触发
- [ ] AI对话响应
- [ ] 数据库持久化
- [ ] 应用启动/退出
- [ ] 托盘图标功能

## 构建发布

### 构建DMG

```bash
./scripts/build-dmg.sh
```

### 代码签名（可选）

```bash
# 需要Apple Developer账号
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
npm run build
```

### 公证（可选）

```bash
# 提交到Apple公证
xcrun notarytool submit dist/YiYi-1.0.0.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password"
```

## 常见问题

### better-sqlite3编译问题
```bash
npm rebuild better-sqlite3
```

### Electron下载慢
```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm install
```

### 权限问题
确保已授予：
- 麦克风权限
- 语音识别权限
- 辅助功能权限（可选）

## API密钥安全

当前API密钥硬编码在代码中，生产环境建议：
1. 使用环境变量
2. 使用Electron的safeStorage加密
3. 在首次运行时提示用户输入

## 未来改进

- [ ] 支持更多AI模型切换
- [ ] 添加GUI配置界面
- [ ] 支持多语言
- [ ] 云端同步
- [ ] 移动端配套应用
- [ ] 语音个性化设置
- [ ] 离线模式支持

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交代码
4. 创建Pull Request

## 许可证

MIT License

---

**开发愉快！** 🎉
