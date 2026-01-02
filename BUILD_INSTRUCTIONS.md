# 儿童成长追踪器 - 完整构建指南

## 📋 项目概述

儿童成长追踪器是一个现代化的移动应用程序，帮助家长通过语音交互的方式记录和管理多个孩子的积分系统。

**技术栈:**
- React 18 + TypeScript
- Vite 构建工具
- Capacitor 移动框架
- Web Speech API 语音识别

## ✅ 代码检查结果

所有代码已通过以下检查：
- ✅ TypeScript 类型检查 - 无错误
- ✅ 语法检查 - 无错误
- ✅ 依赖完整性 - 已验证
- ✅ 配置文件 - 已优化

## 🚀 快速开始

### 1. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应用将在 http://localhost:3000 打开
```

### 2. 构建 Web 版本

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 3. 构建 APK（Android 应用）

#### 方式 A: 自动化脚本（推荐）

**Windows:**
```bash
build-apk.bat
```

**macOS/Linux:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

#### 方式 B: Docker 容器（无需本地 Android 环境）

```bash
# 构建 Docker 镜像
docker-compose build

# 运行构建
docker-compose up

# APK 将输出到 ./output 目录
```

#### 方式 C: 手动构建

详见 `APK_BUILD_GUIDE.md`

## 📁 项目结构

```
.
├── src/                          # 源代码
│   ├── types/                    # TypeScript 类型定义
│   ├── styles/                   # 全局样式
│   ├── services/                 # 业务逻辑服务
│   │   ├── StorageService.ts     # 数据存储
│   │   ├── VoiceService.ts       # 语音识别
│   │   ├── VoiceParser.ts        # 语音解析
│   │   ├── ScoreManager.ts       # 积分管理
│   │   └── TemplateManager.ts    # 模板管理
│   ├── context/                  # React Context
│   ├── components/               # React 组件
│   ├── utils/                    # 工具函数
│   ├── App.tsx                   # 主应用
│   └── main.tsx                  # 入口
├── .kiro/specs/                  # 项目规范
│   └── children-growth-tracker/
│       ├── requirements.md       # 需求文档
│       ├── design.md             # 设计文档
│       └── tasks.md              # 任务列表
├── android/                      # Android 项目（自动生成）
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
├── capacitor.config.ts           # Capacitor 配置
├── APK_BUILD_GUIDE.md            # APK 构建详细指南
└── README.md                     # 项目说明

```

## 🔧 配置说明

### package.json 脚本

```json
{
  "dev": "vite",                    // 开发服务器
  "build": "tsc && vite build",     // 构建生产版本
  "preview": "vite preview",        // 预览构建结果
  "test": "jest",                   // 运行测试
  "test:watch": "jest --watch",     // 监听模式测试
  "test:coverage": "jest --coverage", // 测试覆盖率
  "lint": "eslint src --ext .ts,.tsx", // 代码检查
  "format": "prettier --write src", // 代码格式化
  "cap:add:android": "cap add android", // 添加 Android 平台
  "cap:build:android": "cap build android", // 构建 Android
  "cap:open:android": "cap open android", // 打开 Android Studio
  "cap:sync": "cap sync"            // 同步文件
}
```

## 📱 APK 构建详细步骤

### 前置要求

1. **Node.js** v16+
2. **Java JDK** v11+
3. **Android SDK**
4. **Gradle**

### 构建流程

```
1. npm install          # 安装依赖
   ↓
2. npm run build        # 构建 Web 应用
   ↓
3. npx cap add android  # 初始化 Android 项目
   ↓
4. npx cap sync android # 同步文件
   ↓
5. cd android && ./gradlew assembleRelease  # 构建 APK
   ↓
6. APK 输出: android/app/build/outputs/apk/release/app-release.apk
```

## 🧪 测试

### 运行单元测试

```bash
npm test
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 📦 依赖管理

### 主要依赖

- **react**: UI 框架
- **react-dom**: React DOM 渲染
- **@capacitor/core**: 移动框架核心
- **@capacitor/android**: Android 支持

### 开发依赖

- **typescript**: 类型检查
- **vite**: 构建工具
- **jest**: 测试框架
- **eslint**: 代码检查
- **prettier**: 代码格式化

## 🐛 常见问题

### Q1: 构建时出现 "JAVA_HOME not set"
**A:** 设置 JAVA_HOME 环境变量指向 JDK 安装目录

### Q2: Android SDK 未找到
**A:** 设置 ANDROID_SDK_ROOT 环境变量

### Q3: Gradle 构建失败
**A:** 运行 `cd android && ./gradlew clean && ./gradlew assembleRelease`

### Q4: 如何减小 APK 大小
**A:** 启用 ProGuard/R8 混淆，优化资源文件

## 📊 应用功能

### 核心功能
- ✅ 语音录音和识别
- ✅ 智能语音解析
- ✅ 多儿童管理
- ✅ 积分统计和排名
- ✅ 详细事件记录
- ✅ 预设模板系统
- ✅ 数据持久化
- ✅ 数据备份和恢复

### 用户界面
- ✅ 卡通风格设计
- ✅ 响应式布局
- ✅ 移动设备适配
- ✅ 深色模式支持

## 🔐 安全性

- 数据存储在本地 localStorage
- 支持数据导出和导入
- 自动备份机制
- 错误恢复功能

## 📈 性能优化

- Vite 快速构建
- 代码分割和懒加载
- CSS 模块化
- 生产环境压缩

## 🌐 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 许可证

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request

## 📞 支持

- 项目文档: 见 `.kiro/specs/children-growth-tracker/`
- 构建指南: 见 `APK_BUILD_GUIDE.md`
- 问题反馈: 提交 Issue

---

**最后更新:** 2024年1月
**版本:** 1.0.0
