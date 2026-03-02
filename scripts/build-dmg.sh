#!/bin/bash

# YiYi DMG构建脚本

set -e

echo "====================================="
echo "   YiYi智能助手 - DMG构建脚本"
echo "====================================="
echo ""

# 进入项目目录
cd "$(dirname "$0")/.."

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "❌ 请先运行 ./scripts/install-deps.sh 安装依赖"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 清理旧构建文件..."
rm -rf dist

# 构建应用
echo ""
echo "📦 开始构建应用..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 检查构建结果
if [ -d "dist" ]; then
    DMG_FILE=$(find dist -name "*.dmg" | head -n 1)
    
    if [ -n "$DMG_FILE" ]; then
        echo ""
        echo "====================================="
        echo "   ✓ 构建成功！"
        echo "====================================="
        echo ""
        echo "安装包位置："
        echo "$DMG_FILE"
        echo ""
        echo "文件大小：$(du -h "$DMG_FILE" | cut -f1)"
        echo ""
        echo "安装方法："
        echo "1. 双击打开DMG文件"
        echo "2. 将YiYi拖到Applications文件夹"
        echo "3. 打开YiYi应用即可使用"
        echo ""
    else
        echo "❌ 未找到DMG文件"
        exit 1
    fi
else
    echo "❌ 构建目录不存在"
    exit 1
fi
