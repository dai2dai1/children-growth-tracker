@echo off
echo ==========================================
echo 修复构建问题
echo ==========================================

echo 📦 清理 node_modules...
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json

echo 📦 重新安装依赖...
call npm install

echo 🔧 清理缓存...
call npm cache clean --force

echo 🔧 清理构建缓存...
if exist "dist" rmdir /s /q dist
if exist ".vite" rmdir /s /q .vite

echo 🏗️ 重新构建...
call npm run build

if exist "dist" (
  echo ✅ 构建成功！
  echo 📍 构建输出: dist/
  echo.
  echo 🚀 现在可以运行 build-apk.bat 来构建 APK
) else (
  echo ❌ 构建仍然失败
  echo 请检查错误信息
)

echo ==========================================
echo 修复完成
echo ==========================================
pause