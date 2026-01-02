import { Child, ScoreEvent, Template, EventCategory } from '@/types'

/**
 * 验证儿童数据完整性
 * 需求: 3.1, 3.2
 */
export function validateChild(child: Partial<Child>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!child.id || typeof child.id !== 'string') {
    errors.push('儿童ID必须是非空字符串')
  }

  if (!child.name || typeof child.name !== 'string' || child.name.trim().length === 0) {
    errors.push('儿童姓名必须是非空字符串')
  }

  if (!child.avatar || typeof child.avatar !== 'string') {
    errors.push('儿童头像必须是非空字符串')
  }

  if (typeof child.totalScore !== 'number' || child.totalScore < 0) {
    errors.push('儿童总积分必须是非负数字')
  }

  if (!(child.createdAt instanceof Date)) {
    errors.push('创建时间必须是有效的日期对象')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 验证积分事件数据
 * 需求: 5.1
 */
export function validateScoreEvent(
  event: Partial<ScoreEvent>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!event.id || typeof event.id !== 'string') {
    errors.push('事件ID必须是非空字符串')
  }

  if (!event.childId || typeof event.childId !== 'string') {
    errors.push('儿童ID必须是非空字符串')
  }

  if (!event.childName || typeof event.childName !== 'string') {
    errors.push('儿童姓名必须是非空字符串')
  }

  if (typeof event.scoreChange !== 'number') {
    errors.push('积分变化必须是数字')
  }

  if (!event.reason || typeof event.reason !== 'string' || event.reason.trim().length === 0) {
    errors.push('事件原因必须是非空字符串')
  }

  if (!event.category || typeof event.category !== 'object') {
    errors.push('事件分类必须是有效的对象')
  }

  if (!(event.timestamp instanceof Date)) {
    errors.push('时间戳必须是有效的日期对象')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 验证模板数据
 * 需求: 6.1, 6.2
 */
export function validateTemplate(template: Partial<Template>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!template.id || typeof template.id !== 'string') {
    errors.push('模板ID必须是非空字符串')
  }

  if (!template.name || typeof template.name !== 'string' || template.name.trim().length === 0) {
    errors.push('模板名称必须是非空字符串')
  }

  const validCategories = ['family', 'school', 'life', 'study']
  if (!template.category || !validCategories.includes(template.category)) {
    errors.push(`模板分类必须是以下之一: ${validCategories.join(', ')}`)
  }

  if (!Array.isArray(template.events)) {
    errors.push('模板事件必须是数组')
  } else {
    template.events.forEach((event, index) => {
      if (!event.description || typeof event.description !== 'string') {
        errors.push(`事件 ${index} 的描述必须是非空字符串`)
      }
      if (typeof event.scoreValue !== 'number') {
        errors.push(`事件 ${index} 的积分值必须是数字`)
      }
      if (typeof event.isPositive !== 'boolean') {
        errors.push(`事件 ${index} 的isPositive必须是布尔值`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 验证事件分类
 * 需求: 6.1
 */
export function validateEventCategory(
  category: Partial<EventCategory>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!category.id || typeof category.id !== 'string') {
    errors.push('分类ID必须是非空字符串')
  }

  if (!category.name || typeof category.name !== 'string' || category.name.trim().length === 0) {
    errors.push('分类名称必须是非空字符串')
  }

  if (!category.color || typeof category.color !== 'string') {
    errors.push('分类颜色必须是非空字符串')
  }

  if (!category.icon || typeof category.icon !== 'string') {
    errors.push('分类图标必须是非空字符串')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建新儿童对象
 * 需求: 3.1, 3.2
 */
export function createChild(name: string, avatar: string): Child {
  return {
    id: generateId(),
    name,
    avatar,
    totalScore: 0,
    createdAt: new Date(),
  }
}

/**
 * 创建新积分事件
 * 需求: 5.1
 */
export function createScoreEvent(
  childId: string,
  childName: string,
  scoreChange: number,
  reason: string,
  category: EventCategory,
  voiceText?: string,
): ScoreEvent {
  return {
    id: generateId(),
    childId,
    childName,
    scoreChange,
    reason,
    category,
    timestamp: new Date(),
    voiceText,
  }
}
