#!/bin/bash

# 儿童成长追踪器 APK 构建脚本

echo "=========================================="
echo "儿童成长追踪器 APK 构建开始"
echo "=========================================="

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 构建 Web 应用
echo "🔨 构建 Web 应用..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ 构建失败：dist 目录不存在"
  exit 1
fi

# 3. 初始化 Capacitor
echo "⚙️  初始化 Capacitor..."
if [ ! -d "android" ]; then
  npx cap add android
fi

# 4. 同步文件
echo "🔄 同步文件到 Android..."
npx cap sync android

# 5. 构建 APK
echo "📱 构建 APK..."
cd android
./gradlew assembleRelease

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
  echo "✅ APK 构建成功！"
  echo "📍 APK 位置: android/app/build/outputs/apk/release/app-release.apk"
  
  # 复制到项目根目录
  cp app/build/outputs/apk/release/app-release.apk ../children-growth-tracker.apk
  echo "✅ APK 已复制到: children-growth-tracker.apk"
else
  echo "❌ APK 构建失败"
  exit 1
fi

echo "=========================================="
echo "✅ 构建完成！"
echo "=========================================="
