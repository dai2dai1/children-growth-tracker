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

  useEffect(() => {
    setIsSupported(VoiceService.isSupported())

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

  const handleStartRecording = async () => {
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
          <p>您的浏览器不支持语音识别功能</p>
          <p>请使用 Chrome、Edge 或其他支持 Web Speech API 的浏览器</p>
        </div>
      </Card>
    )
  }

  return (
    <Card elevated>
      <div className={styles.container}>
        <div className={styles.buttonGroup}>
          <Button
            variant={isRecording ? 'danger' : 'primary'}
            size="lg"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={styles.micButton}
          >
            <span className={styles.micIcon}>🎤</span>
            {isRecording ? '停止录音' : '开始录音'}
          </Button>
        </div>

        {isRecording && <div className={styles.recordingIndicator}>正在录音...</div>}

        {transcription && (
          <div className={styles.transcription}>
            <p className={styles.label}>识别文字：</p>
            <p className={styles.text}>{transcription}</p>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Card>
  )
}
