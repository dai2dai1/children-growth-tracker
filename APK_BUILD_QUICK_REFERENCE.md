# APK 构建快速参考

## 🚀 三种构建方式

### 方式 1️⃣: 自动化脚本（最简单）

#### Windows
```bash
build-apk.bat
```

#### macOS/Linux
```bash
chmod +x build-apk.sh
./build-apk.sh
```

✅ 输出: `children-growth-tracker.apk`

---

### 方式 2️⃣: Docker 容器（无需本地环境）

```bash
# 构建 Docker 镜像
docker-compose build

# 运行构建
docker-compose up

# APK 输出到 ./output 目录
```

✅ 输出: `./output/children-growth-tracker.apk`

---

### 方式 3️⃣: 手动构建

#### 步骤 1: 安装依赖
```bash
npm install
```

#### 步骤 2: 构建 Web 应用
```bash
npm run build
```

#### 步骤 3: 初始化 Capacitor（仅第一次）
```bash
npx cap add android
```

#### 步骤 4: 同步文件
```bash
npx cap sync android
```

#### 步骤 5: 构建 APK
```bash
cd android
./gradlew assembleRelease  # macOS/Linux
gradlew.bat assembleRelease  # Windows
```

✅ 输出: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📋 前置要求

### 最低要求
- Node.js v16+
- npm 或 yarn

### APK 构建要求
- Java JDK v11+
- Android SDK
- Gradle

### Docker 方式
- Docker
- Docker Compose

---

## 🔧 环境变量设置

### Windows
```
JAVA_HOME=C:\Program Files\Java\jdk-11
ANDROID_SDK_ROOT=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

### macOS/Linux
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

---

## 📱 安装到手机

### 方式 1: ADB
```bash
adb install -r children-growth-tracker.apk
```

### 方式 2: 直接传输
将 APK 文件传输到手机，点击安装

### 方式 3: Android Studio
1. 打开 Android Studio
2. 选择 Build > Build Bundle(s) / APK(s) > Build APK(s)
3. 连接设备并安装

---

## 🐛 常见问题速查

| 问题 | 解决方案 |
|------|--------|
| JAVA_HOME 未设置 | 设置环境变量指向 JDK |
| Android SDK 未找到 | 设置 ANDROID_SDK_ROOT 环境变量 |
| Gradle 构建失败 | 运行 `cd android && ./gradlew clean` |
| 内存不足 | 设置 `GRADLE_OPTS="-Xmx2048m"` |
| npm install 失败 | 运行 `npm cache clean --force` |

---

## 📊 构建输出

### 调试版本
```bash
cd android
./gradlew assembleDebug
```
位置: `android/app/build/outputs/apk/debug/app-debug.apk`

### 发布版本
```bash
cd android
./gradlew assembleRelease
```
位置: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔐 签名 APK（发布用）

### 生成密钥
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### 配置签名
编辑 `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword 'password'
        keyAlias 'my-key-alias'
        keyPassword 'password'
    }
}
```

---

## 📈 优化建议

### 减小 APK 大小
- 启用 ProGuard/R8 混淆
- 优化图片资源
- 使用 WebP 格式

### 提高性能
- 启用 Hermes 引擎
- 优化 JavaScript 代码
- 减少依赖包

---

## 📚 更多信息

- 完整指南: `BUILD_INSTRUCTIONS.md`
- 详细指南: `APK_BUILD_GUIDE.md`
- 快速开始: `QUICK_START.md`
- 项目总结: `PROJECT_SUMMARY.md`

---

## ✅ 验证清单

构建前检查:
- [ ] Node.js 已安装
- [ ] Java JDK 已安装
- [ ] Android SDK 已安装
- [ ] 环境变量已设置
- [ ] 依赖已安装 (`npm install`)

构建后检查:
- [ ] APK 文件已生成
- [ ] APK 文件大小合理 (5-10MB)
- [ ] APK 可以安装到手机
- [ ] 应用可以正常运行

---

**祝构建顺利！** 🎉
