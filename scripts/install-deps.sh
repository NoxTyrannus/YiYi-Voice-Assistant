#!/bin/bash

# YiYi依赖安装脚本

echo "====================================="
echo "   YiYi智能助手 - 依赖安装脚本"
echo "====================================="
echo ""

# 检测操作系统
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 此脚本仅支持macOS系统"
    exit 1
fi

echo "✓ 检测到macOS系统"

# 检查并安装Homebrew
if ! command -v brew &> /dev/null; then
    echo ""
    echo "📦 正在安装Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # 配置环境变量（Apple Silicon Mac）
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi
echo "✓ Homebrew已就绪"

# 检查并安装Node.js
if ! command -v node &> /dev/null; then
    echo ""
    echo "📦 正在安装Node.js..."
    brew install node@18
    
    # 链接Node.js（如果需要）
    brew link node@18 --force --overwrite 2>/dev/null || true
fi

NODE_VERSION=$(node -v 2>/dev/null)
echo "✓ Node.js已安装: $NODE_VERSION"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm未找到，请重新安装Node.js"
    exit 1
fi
echo "✓ npm已就绪: $(npm -v)"

# 安装项目依赖
echo ""
echo "📦 正在安装项目依赖..."
cd "$(dirname "$0")/.."
npm install --production

if [ $? -eq 0 ]; then
    echo "✓ 项目依赖安装完成"
else
    echo "❌ 项目依赖安装失败"
    exit 1
fi

# 检查Python（用于better-sqlite3编译）
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "📦 正在安装Python3..."
    brew install python3
fi
echo "✓ Python3已就绪"

# 授权麦克风和语音识别（通过GUI提示）
echo ""
echo "🎤 配置系统权限..."
osascript -e "tell application \"System Events\" to display dialog \"YiYi需要麦克风和语音识别权限才能工作\n\n请在下一步中允许权限\" buttons {\"确定\"} default button 1 with title \"YiYi权限配置\"" 2>/dev/null || true

echo ""
echo "====================================="
echo "   ✓ 依赖安装完成！"
echo "====================================="
echo ""
echo "下一步操作："
echo "1. 运行 'npm start' 启动应用"
echo "2. 或运行 'npm run build' 构建DMG安装包"
echo ""
