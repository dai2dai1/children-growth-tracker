import { Child, ScoreEvent, Template } from '@/types'

/**
 * 本地存储服务
 * 需求: 8.1, 8.2, 8.5
 */
class StorageService {
  private readonly CHILDREN_KEY = 'children_growth_tracker_children'
  private readonly EVENTS_KEY = 'children_growth_tracker_events'
  private readonly TEMPLATES_KEY = 'children_growth_tracker_templates'
  private readonly BACKUP_KEY = 'children_growth_tracker_backup'

  /**
   * 保存儿童数据
   * 需求: 8.1, 8.2
   */
  async saveChildren(children: Child[]): Promise<void> {
    try {
      const serialized = JSON.stringify(
        children.map((child) => ({
          ...child,
          createdAt: child.createdAt.toISOString(),
        })),
      )
      localStorage.setItem(this.CHILDREN_KEY, serialized)
    } catch (error) {
      console.error('保存儿童数据失败:', error)
      throw new Error('无法保存儿童数据到本地存储')
    }
  }

  /**
   * 加载儿童数据
   * 需求: 8.1, 8.2
   */
  async loadChildren(): Promise<Child[]> {
    try {
      const data = localStorage.getItem(this.CHILDREN_KEY)
      if (!data) {
        return []
      }
      const parsed = JSON.parse(data)
      return parsed.map((child: any) => ({
        ...child,
        createdAt: new Date(child.createdAt),
      }))
    } catch (error) {
      console.error('加载儿童数据失败:', error)
      return []
    }
  }

  /**
   * 保存积分事件
   * 需求: 8.1, 8.2
   */
  async saveEvents(events: ScoreEvent[]): Promise<void> {
    try {
      const serialized = JSON.stringify(
        events.map((event) => ({
          ...event,
          timestamp: event.timestamp.toISOString(),
        })),
      )
      localStorage.setItem(this.EVENTS_KEY, serialized)
    } catch (error) {
      console.error('保存事件数据失败:', error)
      throw new Error('无法保存事件数据到本地存储')
    }
  }

  /**
   * 加载积分事件
   * 需求: 8.1, 8.2
   */
  async loadEvents(): Promise<ScoreEvent[]> {
    try {
      const data = localStorage.getItem(this.EVENTS_KEY)
      if (!data) {
        return []
      }
      const parsed = JSON.parse(data)
      return parsed.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }))
    } catch (error) {
      console.error('加载事件数据失败:', error)
      return []
    }
  }

  /**
   * 保存模板
   * 需求: 8.1, 8.2
   */
  async saveTemplates(templates: Template[]): Promise<void> {
    try {
      const serialized = JSON.stringify(templates)
      localStorage.setItem(this.TEMPLATES_KEY, serialized)
    } catch (error) {
      console.error('保存模板数据失败:', error)
      throw new Error('无法保存模板数据到本地存储')
    }
  }

  /**
   * 加载模板
   * 需求: 8.1, 8.2
   */
  async loadTemplates(): Promise<Template[]> {
    try {
      const data = localStorage.getItem(this.TEMPLATES_KEY)
      if (!data) {
        return []
      }
      return JSON.parse(data)
    } catch (error) {
      console.error('加载模板数据失败:', error)
      return []
    }
  }

  /**
   * 导出所有数据
   * 需求: 8.5
   */
  async exportData(): Promise<string> {
    try {
      const children = await this.loadChildren()
      const events = await this.loadEvents()
      const templates = await this.loadTemplates()

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        children,
        events,
        templates,
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('导出数据失败:', error)
      throw new Error('无法导出数据')
    }
  }

  /**
   * 导入数据
   * 需求: 8.5
   */
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)

      if (!data.version || !data.children || !data.events || !data.templates) {
        throw new Error('导入数据格式不正确')
      }

      // 创建备份
      await this.createBackup()

      // 导入数据
      await this.saveChildren(
        data.children.map((child: any) => ({
          ...child,
          createdAt: new Date(child.createdAt),
        })),
      )

      await this.saveEvents(
        data.events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        })),
      )

      await this.saveTemplates(data.templates)
    } catch (error) {
      console.error('导入数据失败:', error)
      throw new Error('无法导入数据，请检查文件格式')
    }
  }

  /**
   * 创建备份
   * 需求: 8.3, 8.4
   */
  async createBackup(): Promise<void> {
    try {
      const backupData = await this.exportData()
      const backups = this.getBackups()
      backups.push({
        timestamp: new Date().toISOString(),
        data: backupData,
      })

      // 只保留最近10个备份
      if (backups.length > 10) {
        backups.shift()
      }

      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups))
    } catch (error) {
      console.error('创建备份失败:', error)
    }
  }

  /**
   * 获取所有备份
   * 需求: 8.3, 8.4
   */
  getBackups(): Array<{ timestamp: string; data: string }> {
    try {
      const data = localStorage.getItem(this.BACKUP_KEY)
      if (!data) {
        return []
      }
      return JSON.parse(data)
    } catch (error) {
      console.error('获取备份失败:', error)
      return []
    }
  }

  /**
   * 恢复备份
   * 需求: 8.3, 8.4
   */
  async restoreBackup(timestamp: string): Promise<void> {
    try {
      const backups = this.getBackups()
      const backup = backups.find((b) => b.timestamp === timestamp)

      if (!backup) {
        throw new Error('备份不存在')
      }

      await this.importData(backup.data)
    } catch (error) {
      console.error('恢复备份失败:', error)
      throw new Error('无法恢复备份')
    }
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(this.CHILDREN_KEY)
      localStorage.removeItem(this.EVENTS_KEY)
      localStorage.removeItem(this.TEMPLATES_KEY)
      localStorage.removeItem(this.BACKUP_KEY)
    } catch (error) {
      console.error('清空数据失败:', error)
      throw new Error('无法清空数据')
    }
  }
}

export default new StorageService()
