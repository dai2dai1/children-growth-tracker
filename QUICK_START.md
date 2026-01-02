# 快速开始指南

## 🎯 5 分钟快速开始

### 1️⃣ 开发模式（本地测试）

```bash
npm install
npm run dev
```
✅ 应用将在 http://localhost:3000 打开

### 2️⃣ 构建 Web 版本

```bash
npm run build
npm run preview
```
✅ 生产版本已构建到 `dist/` 目录

### 3️⃣ 构建 APK（Android 应用）

#### 最简单的方式 - 使用脚本

**Windows:**
```bash
build-apk.bat
```

**macOS/Linux:**
```bash
./build-apk.sh
```

✅ APK 将输出到 `children-growth-tracker.apk`

#### 使用 Docker（无需本地 Android 环境）

```bash
docker-compose up
```

✅ APK 将输出到 `./output/` 目录

---

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm test` | 运行测试 |
| `npm run lint` | 代码检查 |
| `npm run format` | 代码格式化 |
| `npm run cap:sync` | 同步 Capacitor 文件 |

---

## 🔧 环境要求

### 开发环境
- Node.js v16+
- npm 或 yarn

### APK 构建环境
- Java JDK v11+
- Android SDK
- Gradle

### Docker 方式
- Docker
- Docker Compose

---

## 📱 安装 APK 到手机

### 方式 1: 使用 ADB
```bash
adb install -r children-growth-tracker.apk
```

### 方式 2: 直接传输
将 APK 文件传输到手机，点击安装

### 方式 3: 使用 Android Studio
1. 打开 Android Studio
2. 选择 Build > Build Bundle(s) / APK(s) > Build APK(s)
3. 连接设备并安装

---

## 🐛 遇到问题？

### 问题 1: npm install 失败
```bash
# 清除缓存
npm cache clean --force
npm install
```

### 问题 2: 构建失败
```bash
# 清除构建文件
rm -rf dist node_modules
npm install
npm run build
```

### 问题 3: APK 构建失败
详见 `APK_BUILD_GUIDE.md`

---

## 📚 更多信息

- 完整指南: `BUILD_INSTRUCTIONS.md`
- APK 构建详解: `APK_BUILD_GUIDE.md`
- 项目规范: `.kiro/specs/children-growth-tracker/`
- 项目说明: `README.md`

---

## ✨ 功能特性

- 🎤 语音录音和识别
- 👨‍👩‍👧‍👦 多儿童管理
- 📊 积分统计和排名
- 📝 详细事件记录
- 🎨 卡通风格设计
- 📱 响应式布局
- 💾 数据持久化

---

**祝您使用愉快！** 🎉
