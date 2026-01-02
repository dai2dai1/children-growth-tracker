@echo off
echo ==========================================
echo 修复 Gradle 构建问题
echo ==========================================

echo 🔧 清理 Gradle 缓存...
if exist "%USERPROFILE%\.gradle\caches" rmdir /s /q "%USERPROFILE%\.gradle\caches"

echo 🔧 清理 Android 构建缓存...
if exist "android" (
    cd android
    if exist "build" rmdir /s /q build
    if exist "app\build" rmdir /s /q app\build
    cd ..
)

echo 📦 重新同步 Capacitor...
call npx cap sync android

echo 🏗️ 使用兼容的 Gradle 版本构建...
cd android
echo 使用 Gradle Wrapper 构建...
call gradlew.bat clean
call gradlew.bat assembleRelease --no-daemon --stacktrace

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ✅ APK 构建成功！
    echo 📍 APK 位置: android\app\build\outputs\apk\release\app-release.apk
    copy "app\build\outputs\apk\release\app-release.apk" "..\children-growth-tracker.apk"
    echo 📱 APK 已复制到根目录: children-growth-tracker.apk
) else (
    echo ❌ APK 构建失败
    echo 请检查错误信息
)

cd ..
echo ==========================================
echo 修复完成
echo ==========================================
pause