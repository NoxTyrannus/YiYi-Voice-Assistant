#!/bin/bash

# YiYi 项目验证脚本

echo "====================================="
echo "   YiYi 项目文件验证"
echo "====================================="
echo ""

ERRORS=0

# 检查必需文件
echo "检查必需文件..."
REQUIRED_FILES=(
    "package.json"
    "electron-builder.yml"
    "src/main/index.js"
    "src/main/database.js"
    "src/main/ai.js"
    "src/main/voice.js"
    "src/main/schedule.js"
    "src/main/reminder.js"
    "src/main/intent.js"
    "src/preload/index.js"
    "src/renderer/index.html"
    "build/entitlements.mac.plist"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (缺失)"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "检查可选文件..."
OPTIONAL_FILES=(
    "assets/icon.icns"
    "assets/tray-icon.png"
)

for file in "${OPTIONAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ⚠ $file (可选，未找到)"
    fi
done

echo ""
echo "检查脚本文件..."
SCRIPTS=(
    "scripts/install-deps.sh"
    "scripts/build-dmg.sh"
    "scripts/post-build.js"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "  ✓ $script"
    else
        echo "  ✗ $script (缺失)"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "验证package.json配置..."

# 检查package.json关键字段
if command -v jq &> /dev/null; then
    if [ "$(jq -r '.name' package.json)" == "yiyi-assistant" ]; then
        echo "  ✓ name字段正确"
    else
        echo "  ✗ name字段错误"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ "$(jq -r '.main' package.json)" == "src/main/index.js" ]; then
        echo "  ✓ main字段正确"
    else
        echo "  ✗ main字段错误"
        ERRORS=$((ERRORS + 1))
    fi
    
    DEPS=$(jq -r '.dependencies | keys | length' package.json)
    if [ "$DEPS" -ge 4 ]; then
        echo "  ✓ 依赖数量: $DEPS"
    else
        echo "  ⚠ 依赖数量较少: $DEPS"
    fi
else
    echo "  ⚠ jq未安装，跳过JSON验证"
fi

echo ""
echo "检查依赖安装状态..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules存在"
    
    # 检查关键依赖
    CRITICAL_DEPS=(
        "electron"
        "better-sqlite3"
        "axios"
        "node-schedule"
    )
    
    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo "    ✓ $dep 已安装"
        else
            echo "    ✗ $dep 未安装"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    echo "  ✗ node_modules不存在，请运行 ./scripts/install-deps.sh"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "====================================="
if [ $ERRORS -eq 0 ]; then
    echo "   ✅ 验证通过！可以构建"
    echo "====================================="
    echo ""
    echo "下一步："
    echo "  ./scripts/build-dmg.sh"
    exit 0
else
    echo "   ❌ 发现 $ERRORS 个错误"
    echo "====================================="
    echo ""
    echo "请修复上述错误后重新验证"
    exit 1
fi
