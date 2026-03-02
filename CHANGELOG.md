# YiYi 快速启动指南

## 一键安装命令

打开终端，复制以下命令并执行：

```bash
# 下载项目后进入目录
cd YiYi

# 赋予脚本执行权限
chmod +x scripts/*.sh

# 安装所有依赖（自动检测并安装Node.js等）
./scripts/install-deps.sh

# 构建DMG安装包
./scripts/build-dmg.sh
```

## 然后呢？

1. 打开 `dist` 文件夹
2. 双击 `YiYi-1.0.0.dmg`
3. 将YiYi拖到Applications
4. 打开应用，等待播报"安装已完成，YiYi已就位"
5. 说"YiYi"开始使用！

就这么简单！✨
