import React, { useState, useEffect } from 'react'
import VoiceService from '@/services/VoiceService'
import VoiceParser from '@/services/VoiceParser'
import { Child, ParseResult } from '@/types'
import { Button } from './Button'
import { Card } from './Card'
import styles from './VoiceRecorder.module.css'

interface VoiceRecorderProps {
  children: Child[]
  onTranscription?: (text: string) => void
  onParsed?: (result: ParseResult) => void
}

/**
 * 语音录音组件
 * 需求: 1.1, 1.2, 1.3, 1.4
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  children,
  onTranscription,
  onParsed,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [error, setError] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    setIsSupported(VoiceService.isSupported())
    checkMicrophonePermission()

    VoiceService.onResult((text) => {
      setTranscription(text)
      onTranscription?.(text)
    })

    VoiceService.onError((errorMsg) => {
      setError(errorMsg)
      setIsRecording(false)
    })

    VoiceService.onStart(() => {
      setIsRecording(true)
      setError('')
      setTranscription('')
    })

    VoiceService.onEnd(() => {
      setIsRecording(false)
    })
  }, [onTranscription])

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionGranted(true)
      stream.getTracks().forEach(track => track.stop()) // 停止流
    } catch (err) {
      setPermissionGranted(false)
      setError('需要麦克风权限才能使用语音功能')
    }
  }

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionGranted(true)
      setError('')
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      setError('无法获取麦克风权限，请在浏览器设置中允许麦克风访问')
    }
  }

  const handleStartRecording = async () => {
    if (!permissionGranted) {
      await requestPermission()
      return
    }

    try {
      await VoiceService.startRecording()
    } catch (err) {
      setError(err instanceof Error ? err.message : '启动录音失败')
    }
  }

  const handleStopRecording = async () => {
    try {
      const text = await VoiceService.stopRecording()
      setTranscription(text)
      onTranscription?.(text)

      // 解析语音文字
      if (children && children.length > 0) {
        const parseResult = VoiceParser.parseVoiceText(text, children)
        onParsed?.(parseResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '停止录音失败')
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <div className={styles.unsupported}>
          <div className={styles.icon}>🚫</div>
          <h3>不支持语音识别</h3>
          <p>您的浏览器不支持语音识别功能</p>
          <p>请使用 Chrome、Edge 或其他支持 Web Speech API 的浏览器</p>
        </div>
      </Card>
    )
  }

  return (
    <Card elevated className={styles.voiceCard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>🎤 语音记录</h3>
          <p className={styles.subtitle}>说出孩子姓名和积分变化</p>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant={isRecording ? 'danger' : 'primary'}
            size="lg"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
            disabled={!isSupported}
          >
            <span className={styles.micIcon}>
              {isRecording ? '🔴' : '🎤'}
            </span>
            {isRecording ? '停止录音' : (permissionGranted ? '语音记录' : '允许麦克风')}
          </Button>
        </div>

        {isRecording && (
          <div className={styles.recordingIndicator}>
            <div className={styles.pulse}></div>
            <span>正在聆听...</span>
          </div>
        )}

        {transcription && (
          <div className={styles.transcription}>
            <div className={styles.transcriptionHeader}>
              <span className={styles.transcriptionIcon}>💬</span>
              <span className={styles.label}>识别结果</span>
            </div>
            <div className={styles.transcriptionText}>{transcription}</div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {!permissionGranted && !error && (
          <div className={styles.permissionHint}>
            <span className={styles.hintIcon}>💡</span>
            点击按钮允许麦克风权限
          </div>
        )}
      </div>
    </Card>
  )
}
