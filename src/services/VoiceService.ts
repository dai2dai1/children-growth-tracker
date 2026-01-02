/**
 * 语音识别服务
 * 需求: 1.1, 1.2, 1.4
 */

type SpeechRecognitionEvent = Event & {
  results?: SpeechRecognitionResultList
  error?: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  language: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((event: Event) => void) | null
  onend: ((event: Event) => void) | null
  onerror: ((event: SpeechRecognitionEvent) => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

class VoiceService {
  private recognition: SpeechRecognition | null = null
  private isRecording = false
  private transcript = ''
  private onResultCallback: ((text: string) => void) | null = null
  private onErrorCallback: ((error: string) => void) | null = null
  private onStartCallback: (() => void) | null = null
  private onEndCallback: (() => void) | null = null

  constructor() {
    if (this.isSupported()) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognitionClass!()
      this.setupRecognition()
    }
  }

  /**
   * 检查浏览器是否支持语音识别
   * 需求: 1.1, 1.4
   */
  isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }

  /**
   * 设置语音识别事件处理
   */
  private setupRecognition(): void {
    if (!this.recognition) return

    this.recognition.continuous = true  // 改为连续识别
    this.recognition.interimResults = true
    this.recognition.language = 'zh-CN'

    this.recognition.onstart = () => {
      this.isRecording = true
      this.transcript = ''
      this.onStartCallback?.()
    }

    this.recognition.onend = () => {
      this.isRecording = false
      this.onEndCallback?.()
    }

    this.recognition.onerror = (event: SpeechRecognitionEvent) => {
      const errorMessage = this.getErrorMessage(event.error || 'unknown')
      this.onErrorCallback?.(errorMessage)
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!event.results) return

      let interimTranscript = ''
      for (let i = event.results.length - 1; i >= 0; i--) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      const finalTranscript = this.transcript + interimTranscript
      this.onResultCallback?.(finalTranscript)
    }
  }

  /**
   * 开始录音
   * 需求: 1.1, 1.2
   */
  async startRecording(): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('浏览器不支持语音识别功能')
    }

    if (this.isRecording) {
      throw new Error('已经在录音中')
    }

    try {
      this.recognition?.start()
    } catch (error) {
      console.error('启动录音失败:', error)
      throw new Error('无法启动录音')
    }
  }

  /**
   * 停止录音
   * 需求: 1.1, 1.2
   */
  async stopRecording(): Promise<string> {
    if (!this.isRecording) {
      throw new Error('没有正在进行的录音')
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('停止录音超时'))
      }, 10000) // 10秒超时

      const originalOnEnd = this.recognition?.onend
      const originalOnError = this.recognition?.onerror

      if (this.recognition) {
        this.recognition.onend = (event: Event) => {
          clearTimeout(timeout)
          // 恢复原始回调
          this.recognition!.onend = originalOnEnd
          this.recognition!.onerror = originalOnError
          // 调用原始回调
          originalOnEnd?.call(this.recognition, event)
          resolve(this.transcript.trim())
        }

        this.recognition.onerror = (event: SpeechRecognitionEvent) => {
          clearTimeout(timeout)
          // 恢复原始回调
          this.recognition!.onend = originalOnEnd
          this.recognition!.onerror = originalOnError
          const errorMessage = this.getErrorMessage(event.error || 'unknown')
          reject(new Error(errorMessage))
        }

        try {
          this.recognition.stop()
        } catch (error) {
          clearTimeout(timeout)
          // 恢复原始回调
          this.recognition.onend = originalOnEnd
          this.recognition.onerror = originalOnError
          reject(new Error('停止录音失败'))
        }
      } else {
        clearTimeout(timeout)
        reject(new Error('语音识别服务不可用'))
      }
    })
  }

  /**
   * 检查是否正在录音
   */
  isRecordingNow(): boolean {
    return this.isRecording
  }

  /**
   * 设置结果回调
   */
  onResult(callback: (text: string) => void): void {
    this.onResultCallback = callback
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback
  }

  /**
   * 设置开始回调
   */
  onStart(callback: () => void): void {
    this.onStartCallback = callback
  }

  /**
   * 设置结束回调
   */
  onEnd(callback: () => void): void {
    this.onEndCallback = callback
  }

  /**
   * 获取错误信息
   */
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': '没有检测到语音，请重试',
      'audio-capture': '没有找到麦克风，请检查设备',
      'network': '网络连接失败，请检查网络',
      'aborted': '语音识别已中止',
      'service-not-allowed': '语音识别服务不可用',
      'bad-grammar': '语法错误',
      'unknown': '发生未知错误',
    }
    return errorMessages[error] || errorMessages['unknown']
  }

  /**
   * 中止录音
   */
  abort(): void {
    try {
      this.recognition?.abort()
    } catch (error) {
      console.error('中止录音失败:', error)
    } finally {
      this.isRecording = false
      this.transcript = ''
    }
  }

  /**
   * 强制停止录音（紧急情况使用）
   */
  forceStop(): void {
    try {
      this.recognition?.stop()
      this.recognition?.abort()
    } catch (error) {
      console.error('强制停止录音失败:', error)
    } finally {
      this.isRecording = false
      this.transcript = ''
    }
  }
}

export default new VoiceService()
