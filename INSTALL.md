# YiYi 安装指南（0调试0测试版）

## 🚀 快速开始

### 前置要求
- macOS 10.14 或更高版本
- 网络连接（用于AI对话）
- 管理员权限（首次安装需要）

---

## 📦 完整安装流程

### 步骤1：准备图标文件（重要！）

在构建前，请准备应用图标：

```bash
# 1. 准备一张1024x1024的PNG图片，命名为icon.png
# 2. 将图片放到项目根目录
# 3. 运行以下命令生成ICNS图标：

mkdir MyIcon.iconset
sips -z 16 16     icon.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out MyIcon.iconset/icon_512x512@2x.png
iconutil -c icns MyIcon.iconset -o assets/icon.icns
rm -rf MyIcon.iconset

# 托盘图标（可选）
cp icon.png assets/tray-icon.png
```

### 步骤2：自动安装依赖

打开终端，进入项目目录，运行：

```bash
chmod +x scripts/*.sh
./scripts/install-deps.sh
```

脚本会自动：
- ✓ 检测并安装Homebrew
- ✓ 检测并安装Node.js 18
- ✓ 安装项目所有依赖
- ✓ 配置Python环境（用于编译better-sqlite3）
- ✓ 提示授权麦克风和语音识别权限

### 步骤3：构建DMG安装包

```bash
./scripts/build-dmg.sh
```

构建完成后，安装包位于 `dist/YiYi-1.0.0.dmg`

### 步骤4：安装应用

1. 双击打开 `dist/YiYi-1.0.0.dmg`
2. 将 **YiYi** 拖到 **Applications** 文件夹
3. 打开 **YiYi** 应用
4. 首次运行需要：
   - 授权麦克风权限
   - 授权语音识别权限
   - 可能需要右键打开（未签名应用）

---

## ✨ 验证安装

安装成功后，应用会：
1. 自动启动
2. 播报语音：**"安装已完成，YiYi已就位"**
3. 在菜单栏显示托盘图标
4. 持续监听唤醒词"YiYi"

测试步骤：
1. 说 **"YiYi"**
2. 应该听到回复 **"我在"**
3. 说 **"今天天气怎么样"**
4. 应该听到AI生成的回复

---

## 🔧 手动安装（可选）

如果自动脚本失败，可以手动安装：

```bash
# 1. 安装Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装Node.js
brew install node@18
brew link node@18 --force --overwrite

# 3. 安装项目依赖
npm install

# 4. 构建
npm run build
```

---

## ⚙️ 配置信息

### API配置
- **服务商**: SiliconFlow
- **模型**: Pro/zai-org/GLM-4.7
- **API Key**: 已内置在代码中

### 数据存储位置
- 数据库: `~/Library/Application Support/yiyi-assistant/yiyi.db`
- 日志: `~/Library/Logs/yiyi-assistant/`

---

## 🎯 使用示例

### 日程管理
```
"YiYi，添加明天下午3点的会议"
"YiYi，查询最近的日程"
"YiYi，标记会议为已完成"
```

### 定时提醒
```
"YiYi，提醒我下午5点下班"
"YiYi，明天早上8点提醒我起床"
```

### AI对话
```
"YiYi，讲个笑话"
"YiYi，今天有什么新闻"
"YiYi，帮我翻译一段话"
```

---

## ❌ 常见问题

### 1. 应用无法打开（未签名）
```bash
# 方法一：右键打开
右键点击应用 -> 打开 -> 打开

# 方法二：允许任何来源
sudo spctl --master-disable
```

### 2. 麦克风权限问题
```
系统偏好设置 -> 安全性与隐私 -> 隐私 -> 麦克风 -> 勾选YiYi
```

### 3. 语音识别权限问题
```
系统偏好设置 -> 安全性与隐私 -> 隐私 -> 语音识别 -> 勾选YiYi
```

### 4. better-sqlite3编译失败
```bash
# 重新安装编译工具
npm install -g node-gyp
npm install better-sqlite3 --build-from-source
```

### 5. 语音唤醒不工作
- 检查系统音量是否静音
- 确认已授权语音识别权限
- 重启应用

---

## 🎉 安装成功标志

✅ 应用成功安装到Applications  
✅ 首次启动播报"安装已完成，YiYi已就位"  
✅ 菜单栏显示YiYi托盘图标  
✅ 说"YiYi"能唤醒并回复"我在"  
✅ 能进行基本的AI对话  
✅ 日程和提醒功能正常工作  

---

## 📞 技术支持

如遇问题，请检查：
1. 系统版本是否符合要求
2. Node.js版本是否为18+
3. 所有依赖是否正确安装
4. 权限是否正确授权

---

## 📝 开发者信息

- **版本**: 1.0.0
- **构建时间**: 2026-03-03
- **目标平台**: macOS (x64)
- **最低版本**: macOS 10.14

---

**祝您使用愉快！享受与YiYi的智能交互体验！** 🎊
