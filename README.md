# 儿童成长追踪器

一个现代化的移动应用程序，帮助家长通过语音交互的方式记录和管理多个孩子的积分系统。

## 功能特性

- 🎤 **语音交互**: 通过语音快速记录孩子的行为
- 👨‍👩‍👧‍👦 **多儿童管理**: 支持管理多个孩子的积分
- 📊 **积分统计**: 实时显示积分排名和趋势
- 📝 **详细记录**: 完整的积分事件历史记录
- 🎨 **模板系统**: 预设的积分规则模板
- 💾 **数据持久化**: 本地存储和数据备份
- 📱 **响应式设计**: 适配各种屏幕尺寸

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: CSS Modules + CSS 变量
- **状态管理**: React Context + useReducer
- **测试**: Jest + React Testing Library + fast-check
- **代码质量**: ESLint + Prettier

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 打开。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 项目结构

```
src/
├── types/           # TypeScript 类型定义
├── styles/          # 全局样式
├── services/        # 业务逻辑服务
├── components/      # React 组件
├── context/         # React Context
├── hooks/           # 自定义 Hooks
├── utils/           # 工具函数
├── App.tsx          # 主应用组件
└── main.tsx         # 应用入口

```

## 需求文档

详见 `.kiro/specs/children-growth-tracker/requirements.md`

## 设计文档

详见 `.kiro/specs/children-growth-tracker/design.md`

## 实施计划

详见 `.kiro/specs/children-growth-tracker/tasks.md`

## 许可证

MIT
