# 儿童成长追踪器 APK 构建 Docker 镜像

FROM ubuntu:22.04

# 设置环境变量
ENV DEBIAN_FRONTEND=noninteractive
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/tools/bin

# 安装基础工具
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    openjdk-11-jdk \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# 创建工作目录
WORKDIR /app

# 下载 Android SDK
RUN mkdir -p $ANDROID_SDK_ROOT && \
    cd $ANDROID_SDK_ROOT && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip && \
    rm commandlinetools-linux-9477386_latest.zip && \
    mkdir -p cmdline-tools/latest && \
    mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# 接受 Android SDK 许可证
RUN yes | sdkmanager --licenses

# 安装 Android SDK 组件
RUN sdkmanager \
    "platforms;android-33" \
    "build-tools;33.0.0" \
    "platform-tools"

# 复制项目文件
COPY . .

# 安装 Node 依赖
RUN npm install

# 构建 Web 应用
RUN npm run build

# 初始化 Capacitor
RUN npx cap add android

# 同步文件
RUN npx cap sync android

# 构建 APK
RUN cd android && ./gradlew assembleRelease

# 输出 APK
RUN cp android/app/build/outputs/apk/release/app-release.apk /app/children-growth-tracker.apk

# 设置输出卷
VOLUME ["/output"]

# 复制 APK 到输出目录
CMD cp /app/children-growth-tracker.apk /output/
