import React, { useEffect } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { VoiceRecorder } from '@/components/VoiceRecorder'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import styles from './App.module.css'

/**
 * 主应用组件
 */
function AppContent(): React.ReactElement {
  const { state, loadState, addChild, addScoreEvent } = useApp()

  useEffect(() => {
    loadState()
  }, [loadState])

  const handleAddChild = async () => {
    const name = prompt('请输入儿童姓名:')
    if (name) {
      await addChild(name, '👧')
    }
  }

  const handleVoiceParsed = async (parseResult: any) => {
    if (parseResult.confidence >= 0.6 && parseResult.childId && parseResult.scoreChange) {
      try {
        await addScoreEvent(
          parseResult.childId,
          parseResult.scoreChange,
          parseResult.reason || '语音记录',
          `voice-${Date.now()}`,
        )
        alert(`✅ 已为 ${parseResult.childName} 记录 ${parseResult.scoreChange > 0 ? '+' : ''}${parseResult.scoreChange} 分`)
      } catch (error) {
        console.error('添加积分事件失败:', error)
      }
    } else if (parseResult.suggestions && parseResult.suggestions.length > 0) {
      alert(`⚠️ 识别不确定，请检查：\n${parseResult.suggestions.join('\n')}`)
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🎉 儿童成长追踪器</h1>
        <p>通过语音快速记录孩子的成长</p>
      </header>

      <main className={styles.main}>
        <div className={styles.section}>
          <h2>语音录音</h2>
          <VoiceRecorder children={state.children} onParsed={handleVoiceParsed} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>儿童列表</h2>
            <Button variant="primary" onClick={handleAddChild}>
              + 添加儿童
            </Button>
          </div>

          {state.children.length === 0 ? (
            <Card>
              <p className={styles.emptyState}>还没有添加儿童，点击上方按钮添加吧！</p>
            </Card>
          ) : (
            <div className={styles.childrenGrid}>
              {state.children.map((child) => (
                <Card key={child.id} elevated>
                  <div className={styles.childCard}>
                    <div className={styles.childAvatar}>{child.avatar}</div>
                    <h3>{child.name}</h3>
                    <p className={styles.score}>总积分: {child.totalScore}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>最近事件</h2>
          {state.events.length === 0 ? (
            <Card>
              <p className={styles.emptyState}>还没有记录任何事件</p>
            </Card>
          ) : (
            <div className={styles.eventsList}>
              {state.events.slice(0, 5).map((event) => (
                <Card key={event.id}>
                  <div className={styles.eventItem}>
                    <div className={styles.eventHeader}>
                      <strong>{event.childName}</strong>
                      <span className={styles.eventScore}>
                        {event.scoreChange > 0 ? '+' : ''}{event.scoreChange}
                      </span>
                    </div>
                    <p className={styles.eventReason}>{event.reason}</p>
                    <p className={styles.eventTime}>
                      {event.timestamp.toLocaleString('zh-CN')}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 儿童成长追踪器 - 帮助孩子健康成长</p>
      </footer>
    </div>
  )
}

/**
 * App 根组件
 */
function App(): React.ReactElement {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
