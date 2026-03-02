# 快速构建DMG - 使用GitHub Actions

## 🚀 3步获取DMG安装包

### 第1步：推送到GitHub

```bash
# 初始化git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Add YiYi voice assistant project"

# 如果还没有远程仓库，先创建一个GitHub仓库，然后：
git remote add origin <你的GitHub仓库地址>

# 推送到GitHub
git push -u origin main
# 或者 master 分支
git push -u origin master
```

### 第2步：触发构建

**方式A：手动触发（推荐，立即构建）**

1. 打开你的GitHub仓库页面
2. 点击顶部 **Actions** 标签
3. 在左侧选择 **Build YiYi DMG for macOS**
4. 点击右侧 **Run workflow** 按钮
5. 选择分支（main 或 master）
6. 点击绿色的 **Run workflow** 按钮
7. 等待3-5分钟构建完成

**方式B：自动触发（推送后自动构建）**

推送到 `main` 或 `master` 分支后会自动触发构建。

### 第3步：下载DMG

1. 构建完成后，点击进入该次构建记录
2. 滚动到页面底部 **Artifacts** 区域
3. 点击 **YiYi-macOS-DMG** 下载
4. 解压得到的压缩包
5. 找到 `YiYi-1.0.0.dmg` 文件

---

## ✅ 安装使用

1. **双击** `YiYi-1.0.0.dmg` 打开磁盘映像
2. **拖拽** YiYi图标到 **Applications** 文件夹
3. 在 **启动台** 或 **Applications** 中打开 YiYi
4. **授权** 麦克风和语音识别权限
5. 听到"**安装已完成，YiYi已就位**"即成功
6. 说"**YiYi**"测试唤醒

---

## 🔍 验证构建

```bash
# 下载后验证校验和（可选）
shasum -a 256 YiYi-1.0.0.dmg
```

---

## 📦 构建产物

构建成功后会在Actions Artifacts中提供：

- **YiYi-1.0.0.dmg** - 完整的DMG安装包
- **YiYi-1.0.0.dmg.sha256** - 校验和文件

---

## 💡 提示

- **构建时间**: 约3-5分钟
- **文件大小**: 约80-120MB
- **保留时间**: Artifact保留30天
- **重新构建**: 随时可以再次触发构建

---

## 🆘 遇到问题？

1. **构建失败**: 查看 Actions 日志排查错误
2. **下载失败**: 确认有仓库访问权限
3. **安装问题**: 查看 `INSTALL.md` 文档

详细说明请查看 [GitHub Actions 指南](.github/workflows/README.md)
