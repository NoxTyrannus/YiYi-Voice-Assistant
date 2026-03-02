const fs = require('fs');
const path = require('path');

module.exports = async function(context) {
  console.log('构建完成，准备安装脚本...');
  
  // 创建安装后脚本
  const installScript = `#!/bin/bash

# YiYi安装后脚本

echo "正在配置YiYi..."

# 请求麦克风权限
osascript -e "tell application \\"System Events\\" to display dialog \\"YiYi需要麦克风权限才能工作\\" buttons {\\"确定\\"} default button 1"

# 请求语音识别权限
osascript -e "tell application \\"SpeechRecognitionServer\\" to listen for {\\"test\\"} with prompt \\"\\"" 2>/dev/null || true

# 添加到登录项
osascript -e "tell application \\"System Events\\" to make login item at end with properties {path:\\"/Applications/YiYi.app\\", hidden:true}"

# 启动应用
open -a YiYi

echo "YiYi配置完成！"
`;

  const scriptPath = path.join(context.outDir, 'install.sh');
  fs.writeFileSync(scriptPath, installScript);
  fs.chmodSync(scriptPath, '755');
  
  console.log('安装脚本已生成');
};
