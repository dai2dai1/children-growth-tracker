@echo off
REM 儿童成长追踪器 APK 构建脚本

echo ==========================================
echo 儿童成长追踪器 APK 构建开始
echo ==========================================

REM 1. 安装依赖
echo 📦 安装依赖...
call npm install

REM 2. 构建 Web 应用
echo 🔨 构建 Web 应用...
call npm run build

if not exist "dist" (
  echo ❌ 构建失败：dist 目录不存在
  exit /b 1
)

REM 3. 初始化 Capacitor
echo ⚙️  初始化 Capacitor...
if not exist "android" (
  call npx cap add android
)

REM 4. 同步文件
echo 🔄 同步文件到 Android...
call npx cap sync android

REM 5. 构建 APK
echo 📱 构建 APK...
cd android
call gradlew.bat assembleRelease

if exist "app\build\outputs\apk\release\app-release.apk" (
  echo ✅ APK 构建成功！
  echo 📍 APK 位置: android\app\build\outputs\apk\release\app-release.apk
  
  REM 复制到项目根目录
  copy app\build\outputs\apk\release\app-release.apk ..\children-growth-tracker.apk
  echo ✅ APK 已复制到: children-growth-tracker.apk
) else (
  echo ❌ APK 构建失败
  exit /b 1
)

cd ..

echo ==========================================
echo ✅ 构建完成！
echo ==========================================
pause
