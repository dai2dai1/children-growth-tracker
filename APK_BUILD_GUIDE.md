# 儿童成长追踪器 APK 构建指南

## 前置要求

### 必需软件
1. **Node.js** (v16 或更高版本)
   - 下载: https://nodejs.org/
   - 验证: `node --version`

2. **Java Development Kit (JDK)** (v11 或更高版本)
   - 下载: https://www.oracle.com/java/technologies/downloads/
   - 设置 JAVA_HOME 环境变量

3. **Android SDK**
   - 通过 Android Studio 安装
   - 下载: https://developer.android.com/studio
   - 设置 ANDROID_SDK_ROOT 环境变量

4. **Gradle** (通常随 Android SDK 一起安装)

### 环境变量设置

#### Windows
```
JAVA_HOME=C:\Program Files\Java\jdk-11
ANDROID_SDK_ROOT=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

#### macOS/Linux
```
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

## 快速构建步骤

### 方法 1: 使用自动化脚本（推荐）

#### Windows
```bash
build-apk.bat
```

#### macOS/Linux
```bash
chmod +x build-apk.sh
./build-apk.sh
```

### 方法 2: 手动构建

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

#### 步骤 6: 获取 APK
APK 文件位置: `android/app/build/outputs/apk/release/app-release.apk`

## 构建输出

### 调试 APK
```bash
cd android
./gradlew assembleDebug
```
位置: `android/app/build/outputs/apk/debug/app-debug.apk`

### 发布 APK
```bash
cd android
./gradlew assembleRelease
```
位置: `android/app/build/outputs/apk/release/app-release.apk`

## 签名 APK（发布到应用商店）

### 生成签名密钥
```bash
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 配置签名
编辑 `android/app/build.gradle`：

```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword 'your-store-password'
        keyAlias 'my-key-alias'
        keyPassword 'your-key-password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

## 常见问题

### 问题 1: JAVA_HOME 未设置
**解决方案**: 设置 JAVA_HOME 环境变量指向 JDK 安装目录

### 问题 2: Android SDK 未找到
**解决方案**: 设置 ANDROID_SDK_ROOT 环境变量

### 问题 3: Gradle 构建失败
**解决方案**: 
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### 问题 4: 内存不足
**解决方案**: 增加 Gradle 内存
```bash
export GRADLE_OPTS="-Xmx2048m"
```

## 安装 APK 到设备

### 使用 ADB
```bash
adb install -r children-growth-tracker.apk
```

### 使用 Android Studio
1. 打开 Android Studio
2. 选择 Build > Build Bundle(s) / APK(s) > Build APK(s)
3. 连接设备并安装

## 测试应用

### 在模拟器上运行
```bash
npx cap open android
```
然后在 Android Studio 中运行

### 在真实设备上运行
1. 启用开发者模式
2. 连接 USB 调试
3. 运行: `adb install -r children-growth-tracker.apk`

## 发布到应用商店

### Google Play Store
1. 创建 Google Play 开发者账户
2. 签名 APK
3. 上传到 Google Play Console
4. 填写应用信息和截图
5. 提交审核

### 其他应用商店
- 华为应用市场
- 小米应用商店
- OPPO 应用商店
- vivo 应用商店

## 优化建议

### 减小 APK 大小
```bash
# 启用 ProGuard/R8 混淆
# 在 android/app/build.gradle 中配置
```

### 提高性能
- 启用 Hermes 引擎（可选）
- 优化图片资源
- 使用 WebP 格式

## 支持

如有问题，请查看：
- Capacitor 文档: https://capacitorjs.com/docs
- Android 开发文档: https://developer.android.com/docs
- React 文档: https://react.dev/

## 许可证

MIT
