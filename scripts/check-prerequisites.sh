#!/bin/bash

# YiYi 一键构建脚本

echo "====================================="
echo "   YiYi智能助手 - 一键构建"
echo "====================================="
echo ""

# 检查图标文件
if [ ! -f "assets/icon.icns" ]; then
    echo "⚠️  警告：未找到图标文件 assets/icon.icns"
    echo "   将使用默认图标"
    echo ""
fi

# 赋予脚本执行权限
chmod +x scripts/*.sh

# 执行安装依赖
echo "步骤 1/2: 安装依赖..."
./scripts/install-deps.sh

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "步骤 2/2: 构建DMG..."
./scripts/build-dmg.sh

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "====================================="
echo "   ✅ 全部完成！"
echo "====================================="
