import React, { useEffect, useState } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { VoiceRecorder } from '@/components/VoiceRecorder'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { AvatarSelector } from '@/components/AvatarSelector'
import styles from './App.module.css'

/**
 * 主应用组件
 */
function AppContent(): React.ReactElement {
  const { state, loadState, addChild, addScoreEvent, updateChild } = useApp()
  const [showAddChild, setShowAddChild] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildGender, setNewChildGender] = useState<'boy' | 'girl' | 'auto'>('auto')
  const [selectedAvatar, setSelectedAvatar] = useState('👧')
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)

  useEffect(() => {
    loadState()
  }, [loadState])

  const getDefaultAvatar = (name: string, gender: 'boy' | 'girl' | 'auto') => {
    if (gender === 'boy') {
      const boyAvatars = ['👦', '🧒', '👨‍🦱', '🤴', '👨‍🎓', '🦸‍♂️']
      return boyAvatars[Math.floor(Math.random() * boyAvatars.length)]
    } else if (gender === 'girl') {
      const girlAvatars = ['👧', '🧒', '👩‍🦱', '👸', '👩‍🎓', '🦸‍♀️']
      return girlAvatars[Math.floor(Math.random() * girlAvatars.length)]
    } else {
      // 自动判断性别（简单的名字判断）
      const commonGirlNames = ['小红', '小美', '小丽', '小花', '小雪', '小月', '小云', '小燕', '小玉', '小珍']
      const commonBoyNames = ['小明', '小强', '小军', '小华', '小东', '小伟', '小刚', '小龙', '小虎', '小鹏']
      
      const isGirl = commonGirlNames.some(girlName => name.includes(girlName.slice(1)))
      const isBoy = commonBoyNames.some(boyName => name.includes(boyName.slice(1)))
      
      if (isGirl) {
        const girlAvatars = ['👧', '👩‍🦱', '👸', '👩‍🎓', '🦸‍♀️']
        return girlAvatars[Math.floor(Math.random() * girlAvatars.length)]
      } else if (isBoy) {
        const boyAvatars = ['👦', '👨‍🦱', '🤴', '👨‍🎓', '🦸‍♂️']
        return boyAvatars[Math.floor(Math.random() * boyAvatars.length)]
      } else {
        // 默认随机选择
        const neutralAvatars = ['🧒', '👶', '🐶', '🐱', '🐰', '🐻', '🦄']
        return neutralAvatars[Math.floor(Math.random() * neutralAvatars.length)]
      }
    }
  }

  const handleAddChild = async () => {
    if (newChildName.trim()) {
      const avatar = selectedAvatar || getDefaultAvatar(newChildName.trim(), newChildGender)
      await addChild(newChildName.trim(), avatar)
      setNewChildName('')
      setNewChildGender('auto')
      setSelectedAvatar('👧')
      setShowAddChild(false)
    }
  }

  const handleEditAvatar = (childId: string) => {
    const child = state.children.find(c => c.id === childId)
    if (child) {
      setSelectedAvatar(child.avatar)
      setEditingChildId(childId)
      setShowAvatarSelector(true)
    }
  }

  const handleAvatarChange = async (newAvatar: string) => {
    if (editingChildId) {
      const child = state.children.find(c => c.id === editingChildId)
      if (child) {
        await updateChild({ ...child, avatar: newAvatar })
      }
      setEditingChildId(null)
    } else {
      setSelectedAvatar(newAvatar)
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
                
                {/* 头像选择 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                    头像
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setShowAvatarSelector(true)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '30px'
                      }}
                    >
                      {selectedAvatar.startsWith('data:') ? (
                        <img src={selectedAvatar} alt="头像" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        selectedAvatar
                      )}
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      点击选择头像
                    </span>
                  </div>
                </div>

                {/* 性别选择 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                    性别
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { value: 'auto', label: '自动判断', icon: '🤖' },
                      { value: 'boy', label: '男孩', icon: '👦' },
                      { value: 'girl', label: '女孩', icon: '👧' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewChildGender(option.value as any)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '12px',
                          border: `2px solid ${newChildGender === option.value ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
                          background: newChildGender === option.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 姓名输入 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                    姓名
                  </label>
                  <input
                    type="text"
                    placeholder="输入儿童姓名"
                    value={newChildName}
                    onChange={(e) => {
                      setNewChildName(e.target.value)
                      // 如果是自动模式，根据名字更新头像
                      if (newChildGender === 'auto' && e.target.value) {
                        setSelectedAvatar(getDefaultAvatar(e.target.value, 'auto'))
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={() => setShowAddChild(false)}>
                    取消
                  </Button>
                  <Button variant="primary" onClick={handleAddChild} disabled={!newChildName.trim()}>
                    添加
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
                  <button
                    className={styles.avatarButton}
                    onClick={() => handleEditAvatar(child.id)}
                    title="点击更换头像"
                  >
                    {child.avatar.startsWith('data:') ? (
                      <img src={child.avatar} alt={child.name} className={styles.uploadedAvatar} />
                    ) : (
                      <span className={styles.childAvatar}>{child.avatar}</span>
                    )}
                  </button>
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
                .map((event) => {
                  const child = state.children.find(c => c.id === event.childId)
                  return (
                    <Card key={event.id} className={styles.eventItem}>
                      <div className={styles.eventHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {child?.avatar.startsWith('data:') ? (
                            <img 
                              src={child.avatar} 
                              alt={child.name}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '20px' }}>
                              {child?.avatar || '👶'}
                            </span>
                          )}
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
                  )
                })}
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>💝 儿童成长追踪器 - 记录每一个成长瞬间</p>
      </footer>

      {/* 头像选择器 */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onAvatarChange={handleAvatarChange}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
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
