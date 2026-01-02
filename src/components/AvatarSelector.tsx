import React, { useState, useRef } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import styles from './AvatarSelector.module.css'

interface AvatarSelectorProps {
  selectedAvatar: string
  onAvatarChange: (avatar: string) => void
  onClose: () => void
}

// 超萌卡通头像库
const AVATAR_CATEGORIES = {
  boys: {
    name: '男孩头像',
    avatars: [
      '👦', '🧒', '👨‍🦱', '👨‍🦰', '👨‍🦳', '👨‍🦲',
      '🤴', '👨‍💼', '👨‍🎓', '👨‍🚀', '🦸‍♂️', '🧙‍♂️',
      '👨‍🎨', '👨‍🔬', '👨‍⚕️', '👨‍🏫', '👨‍💻', '👨‍🎤'
    ]
  },
  girls: {
    name: '女孩头像',
    avatars: [
      '👧', '🧒', '👩‍🦱', '👩‍🦰', '👩‍🦳', '👩‍🦲',
      '👸', '👩‍💼', '👩‍🎓', '👩‍🚀', '🦸‍♀️', '🧙‍♀️',
      '👩‍🎨', '👩‍🔬', '👩‍⚕️', '👩‍🏫', '👩‍💻', '👩‍🎤'
    ]
  },
  animals: {
    name: '可爱动物',
    avatars: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
      '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
      '🐷', '🐸', '🐵', '🐔', '🐧', '🦄'
    ]
  },
  fantasy: {
    name: '奇幻角色',
    avatars: [
      '🧚‍♀️', '🧚‍♂️', '🧜‍♀️', '🧜‍♂️', '🧞‍♀️', '🧞‍♂️',
      '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '👼', '🎅',
      '🤶', '🧙‍♀️', '🧙‍♂️', '🧝‍♀️', '🧝‍♂️', '🧛‍♀️'
    ]
  }
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatar,
  onAvatarChange,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof AVATAR_CATEGORIES>('boys')
  const [customAvatar, setCustomAvatar] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onAvatarChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCustomAvatarSubmit = () => {
    if (customAvatar.trim()) {
      onAvatarChange(customAvatar.trim())
      setCustomAvatar('')
    }
  }

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>
        <div className={styles.header}>
          <h3>🎨 选择头像</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* 当前选择的头像 */}
          <div className={styles.currentAvatar}>
            <div className={styles.avatarPreview}>
              {selectedAvatar.startsWith('data:') ? (
                <img src={selectedAvatar} alt="头像" className={styles.uploadedImage} />
              ) : (
                <span className={styles.emojiAvatar}>{selectedAvatar}</span>
              )}
            </div>
            <p>当前头像</p>
          </div>

          {/* 分类标签 */}
          <div className={styles.categories}>
            {Object.entries(AVATAR_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                className={`${styles.categoryTab} ${activeCategory === key ? styles.active : ''}`}
                onClick={() => setActiveCategory(key as keyof typeof AVATAR_CATEGORIES)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 头像网格 */}
          <div className={styles.avatarGrid}>
            {AVATAR_CATEGORIES[activeCategory].avatars.map((avatar, index) => (
              <button
                key={index}
                className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ''}`}
                onClick={() => onAvatarChange(avatar)}
              >
                {avatar}
              </button>
            ))}
          </div>

          {/* 自定义选项 */}
          <div className={styles.customOptions}>
            <div className={styles.customSection}>
              <h4>📷 上传照片</h4>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
              >
                选择照片
              </Button>
            </div>

            <div className={styles.customSection}>
              <h4>✏️ 自定义表情</h4>
              <div className={styles.customInput}>
                <input
                  type="text"
                  placeholder="输入表情符号或文字"
                  value={customAvatar}
                  onChange={(e) => setCustomAvatar(e.target.value)}
                  className={styles.textInput}
                />
                <Button
                  variant="primary"
                  onClick={handleCustomAvatarSubmit}
                  disabled={!customAvatar.trim()}
                >
                  使用
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="primary" onClick={onClose}>
            完成
          </Button>
        </div>
      </Card>
    </div>
  )
}