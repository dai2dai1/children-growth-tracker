import { Template, EventCategory } from '@/types'

/**
 * 模板管理器
 * 需求: 6.1, 6.2, 6.3, 6.4, 6.5
 */
class TemplateManager {
  private templates: Template[] = []
  private defaultTemplates: Template[] = this.createDefaultTemplates()

  constructor() {
    this.templates = this.defaultTemplates
  }

  /**
   * 创建默认模板
   * 需求: 6.1, 6.2
   */
  private createDefaultTemplates(): Template[] {
    return [
      {
        id: 'family-rules',
        name: '家规',
        category: 'family',
        events: [
          { description: '主动做家务', scoreValue: 10, isPositive: true },
          { description: '帮助家人', scoreValue: 5, isPositive: true },
          { description: '整理房间', scoreValue: 8, isPositive: true },
          { description: '不听话', scoreValue: -5, isPositive: false },
          { description: '乱扔东西', scoreValue: -3, isPositive: false },
          { description: '说谎', scoreValue: -10, isPositive: false },
        ],
      },
      {
        id: 'school-rules',
        name: '学校',
        category: 'school',
        events: [
          { description: '考试成绩优秀', scoreValue: 20, isPositive: true },
          { description: '作业完成', scoreValue: 5, isPositive: true },
          { description: '课堂表现好', scoreValue: 8, isPositive: true },
          { description: '迟到', scoreValue: -5, isPositive: false },
          { description: '作业不完成', scoreValue: -10, isPositive: false },
          { description: '课堂捣乱', scoreValue: -8, isPositive: false },
        ],
      },
      {
        id: 'life-rules',
        name: '生活',
        category: 'life',
        events: [
          { description: '早起早睡', scoreValue: 5, isPositive: true },
          { description: '坚持运动', scoreValue: 10, isPositive: true },
          { description: '健康饮食', scoreValue: 5, isPositive: true },
          { description: '熬夜', scoreValue: -5, isPositive: false },
          { description: '挑食', scoreValue: -3, isPositive: false },
          { description: '不运动', scoreValue: -5, isPositive: false },
        ],
      },
      {
        id: 'study-rules',
        name: '学习',
        category: 'study',
        events: [
          { description: '主动学习', scoreValue: 10, isPositive: true },
          { description: '阅读书籍', scoreValue: 8, isPositive: true },
          { description: '完成练习', scoreValue: 5, isPositive: true },
          { description: '学习态度不好', scoreValue: -5, isPositive: false },
          { description: '不做练习', scoreValue: -8, isPositive: false },
          { description: '放弃学习', scoreValue: -15, isPositive: false },
        ],
      },
    ]
  }

  /**
   * 初始化模板
   */
  initialize(templates: Template[]): void {
    this.templates = templates.length > 0 ? templates : this.defaultTemplates
  }

  /**
   * 获取所有模板
   * 需求: 6.1
   */
  getAllTemplates(): Template[] {
    return [...this.templates]
  }

  /**
   * 按分类获取模板
   * 需求: 6.1, 6.2
   */
  getTemplatesByCategory(category: 'family' | 'school' | 'life' | 'study'): Template[] {
    return this.templates.filter((t) => t.category === category)
  }

  /**
   * 获取单个模板
   */
  getTemplate(templateId: string): Template | null {
    return this.templates.find((t) => t.id === templateId) || null
  }

  /**
   * 添加自定义模板
   * 需求: 6.4
   */
  addTemplate(template: Template): void {
    if (this.templates.find((t) => t.id === template.id)) {
      throw new Error(`模板 ${template.id} 已存在`)
    }
    this.templates.push(template)
  }

  /**
   * 更新模板
   * 需求: 6.4
   */
  updateTemplate(templateId: string, updates: Partial<Template>): void {
    const template = this.templates.find((t) => t.id === templateId)
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`)
    }

    Object.assign(template, updates)
  }

  /**
   * 删除模板
   * 需求: 6.4
   */
  deleteTemplate(templateId: string): void {
    const index = this.templates.findIndex((t) => t.id === templateId)
    if (index === -1) {
      throw new Error(`模板 ${templateId} 不存在`)
    }

    this.templates.splice(index, 1)
  }

  /**
   * 应用模板
   * 需求: 6.3
   */
  applyTemplate(templateId: string): Template | null {
    return this.getTemplate(templateId)
  }

  /**
   * 获取模板事件分类
   * 需求: 6.5
   */
  getTemplateEventCategories(templateId: string): EventCategory[] {
    const template = this.getTemplate(templateId)
    if (!template) {
      return []
    }

    return template.events.map((event, index) => ({
      id: `${templateId}-event-${index}`,
      name: event.description,
      color: event.isPositive ? '#95E1D3' : '#FF6B6B',
      icon: event.isPositive ? '✓' : '✗',
    }))
  }

  /**
   * 重置为默认模板
   */
  resetToDefaults(): void {
    this.templates = this.createDefaultTemplates()
  }

  /**
   * 获取默认模板
   */
  getDefaultTemplates(): Template[] {
    return this.defaultTemplates
  }
}

export default new TemplateManager()
