# 在线构建 APK 指南

由于本地Java版本过新（Java 25），与Gradle 8.0.2不兼容，推荐使用在线构建服务。

## 方法1：使用 GitHub Actions（推荐）

1. **将代码推送到 GitHub**：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/children-growth-tracker.git
   git push -u origin main
   ```

2. **触发构建**：
   - 访问你的 GitHub 仓库
   - 点击 "Actions" 标签
   - 点击 "Build Android APK" 工作流
   - 点击 "Run workflow" 按钮

3. **下载 APK**：
   - 构建完成后，在 Actions 页面下载 APK 文件
   - 或者在 Releases 页面找到自动发布的版本

## 方法2：使用 Capacitor Live Reload（开发测试）

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **在手机上安装 Capacitor Live Reload**：
   - 下载 Capacitor Live Reload 应用
   - 输入你的电脑IP地址和端口3000
   - 实时预览应用

## 方法3：使用在线构建平台

### 使用 Ionic Appflow
1. 注册 Ionic Appflow 账户
2. 连接 GitHub 仓库
3. 配置构建设置
4. 触发构建并下载 APK

### 使用 EAS Build (Expo)
1. 安装 EAS CLI: `npm install -g @expo/eas-cli`
2. 登录: `eas login`
3. 配置: `eas build:configure`
4. 构建: `eas build --platform android`

## 本地构建修复（如果需要）

如果你想在本地构建，需要降级Java版本：

1. **安装 Java 17**：
   - 下载 OpenJDK 17
   - 设置 JAVA_HOME 环境变量

2. **验证Java版本**：
   ```bash
   java -version
   ```

3. **重新构建**：
   ```bash
   ./build-apk.bat
   ```

## 当前状态

✅ Web应用构建成功  
✅ Capacitor配置完成  
❌ 本地APK构建失败（Java版本不兼容）  
✅ 在线构建配置就绪  

推荐使用 GitHub Actions 进行在线构建，这是最简单可靠的方法。