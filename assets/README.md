# 图标文件说明

## 需要的图标文件

### macOS应用图标
- **文件名**: `icon.icns`
- **位置**: `assets/icon.icns`
- **尺寸**: 512x512px 或 1024x1024px
- **格式**: ICNS格式

### 托盘图标
- **文件名**: `tray-icon.png`
- **位置**: `assets/tray-icon.png`
- **尺寸**: 22x22px (视网膜屏：44x44px)
- **格式**: PNG格式（透明背景）

## 创建图标方法

### 方式一：使用在线工具
1. 访问 https://iconifier.net/
2. 上传一张1024x1024的PNG图片
3. 下载生成的ICNS文件
4. 将文件重命名为 `icon.icns` 并放到 `assets/` 目录

### 方式二：使用macOS自带工具
1. 准备一张1024x1024的PNG图片
2. 打开macOS的"图标 composer"应用
3. 将图片拖入不同尺寸的框中
4. 导出为ICNS格式

### 方式三：使用命令行工具
```bash
# 安装iconutil（macOS自带）
# 创建iconset目录
mkdir MyIcon.iconset

# 生成不同尺寸的图标
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

# 生成ICNS文件
iconutil -c icns MyIcon.iconset -o assets/icon.icns

# 清理临时文件
rm -rf MyIcon.iconset
```

## 推荐图标设计

YiYi是一个语音助手，建议使用：
- 🎤 麦克风图标
- 🤖 机器人头像
- 💬 对话气泡
- 🌟 简洁的几何图形

## 临时方案

如果没有图标文件，构建时会使用Electron默认图标。
