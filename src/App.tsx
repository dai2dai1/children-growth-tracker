import React, { useEffect, useState } from 'react'
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
  const [showAddChild, setShowAddChild] = useState(false)
  const [newChildName, setNewChildName] = useState('')

  useEffect(() => {
    loadState()
  }, [loadState])

  const handleAddChild = async () => {
    if (newChildName.trim()) {
      const avatars = ['👧', '👦', '🧒', '👶', '🧑', '👩', '👨']
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
      await addChild(newChildName.trim(), randomAvatar)
      setNewChildName('')
      setShowAddChild(false)
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
        
        // 显示成功提示
        const message = `✅ 已为 ${parseResult.childName} 记录 ${parseResult.scoreChange > 0 ? '+' : ''}${parseResult.scoreChange} 分`
        showNotification(message, 'success')
      } catch (error) {
        console.error('添加积分事件失败:', error)
        showNotification('❌ 记录失败，请重试', 'error')
      }
    } else if (parseResult.suggestions && parseResult.suggestions.length > 0) {
      showNotification(`⚠️ 识别不确定，请检查：\n${parseResult.suggestions.join('\n')}`, 'warning')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    // 简单的通知实现
    alert(message)
  }

  const formatScore = (score: number) => {
    return score >= 0 ? `+${score}` : `${score}`
  }

  const getScoreColor = (score: number) => {
    return score >= 0 ? 'positive' : 'negative'
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🌟 儿童成长追踪器</h1>
        <p>通过语音快速记录孩子的成长点滴</p>
      </header>

      <main className={styles.main}>
        {/* 语音录音区域 */}
        <div className={styles.section}>
          <VoiceRecorder children={state.children} onParsed={handleVoiceParsed} />
        </div>

        {/* 儿童列表区域 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>👨‍👩‍👧‍👦 我的孩子们</h2>
            <button 
              className={styles.addChildButton}
              onClick={() => setShowAddChild(!showAddChild)}
            >
              + 添加儿童
            </button>
          </div>

          {showAddChild && (
            <Card className={styles.addChildForm}>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>添加新儿童</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="输入儿童姓名"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <Button variant="primary" onClick={handleAddChild}>
                    添加
                  </Button>
                  <Button variant="secondary" onClick={() => setShowAddChild(false)}>
                    取消
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {state.children.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.icon}>👶</div>
              <h3>还没有添加儿童</h3>
              <p>点击上方按钮添加第一个孩子吧！</p>
            </div>
          ) : (
            <div className={styles.childrenGrid}>
              {state.children
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((child, index) => (
                <Card key={child.id} className={styles.childCard}>
                  <div className={styles.childAvatar}>{child.avatar}</div>
                  <h3>{child.name}</h3>
                  <div className={styles.score}>
                    {index === 0 && state.children.length > 1 && '🏆 '}
                    {child.totalScore} 分
                  </div>
                  {index === 0 && state.children.length > 1 && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                      第一名
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 最近事件区域 */}
        <div className={styles.section}>
          <h2>📝 最近记录</h2>
          {state.events.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.icon}>📝</div>
              <h3>还没有记录任何事件</h3>
              <p>使用语音功能开始记录孩子的表现吧！</p>
            </div>
          ) : (
            <div className={styles.eventsList}>
              {state.events
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((event) => (
                <Card key={event.id} className={styles.eventItem}>
                  <div className={styles.eventHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {state.children.find(c => c.id === event.childId)?.avatar || '👶'}
                      </span>
                      <strong>{event.childName}</strong>
                    </div>
                    <span className={`${styles.eventScore} ${styles[getScoreColor(event.scoreChange)]}`}>
                      {formatScore(event.scoreChange)}
                    </span>
                  </div>
                  <p className={styles.eventReason}>{event.reason}</p>
                  <p className={styles.eventTime}>
                    {new Date(event.timestamp).toLocaleString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>💝 儿童成长追踪器 - 记录每一个成长瞬间</p>
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
