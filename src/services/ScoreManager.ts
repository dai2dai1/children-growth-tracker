import { Child, ScoreEvent, TimeRange, MonthlyStats, EventCategory } from '@/types'
import { createScoreEvent } from '@/utils/validation'

/**
 * 积分管理器
 * 需求: 2.5, 3.3, 4.1, 4.2, 5.1
 */
class ScoreManager {
  private children: Child[] = []
  private events: ScoreEvent[] = []

  /**
   * 初始化管理器
   */
  initialize(children: Child[], events: ScoreEvent[]): void {
    this.children = children
    this.events = events
  }

  /**
   * 添加积分
   * 需求: 2.5, 3.3
   */
  addScore(
    childId: string,
    score: number,
    reason: string,
    category: EventCategory,
    voiceText?: string,
  ): ScoreEvent {
    const child = this.children.find((c) => c.id === childId)
    if (!child) {
      throw new Error(`儿童 ${childId} 不存在`)
    }

    // 创建事件
    const event = createScoreEvent(childId, child.name, score, reason, category, voiceText)

    // 更新儿童总积分
    child.totalScore += score

    // 保存事件
    this.events.push(event)

    return event
  }

  /**
   * 获取儿童积分
   * 需求: 3.3
   */
  getChildScore(childId: string): number {
    const child = this.children.find((c) => c.id === childId)
    return child?.totalScore ?? 0
  }

  /**
   * 获取积分历史
   * 需求: 5.1, 5.2
   */
  getScoreHistory(childId?: string, timeRange?: TimeRange): ScoreEvent[] {
    let filtered = this.events

    // 按儿童筛选
    if (childId) {
      filtered = filtered.filter((e) => e.childId === childId)
    }

    // 按时间范围筛选
    if (timeRange) {
      filtered = filtered.filter(
        (e) => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end,
      )
    }

    // 按时间倒序排列
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * 获取月度统计
   * 需求: 4.2, 4.3
   */
  getMonthlyStats(childId?: string, year?: number, month?: number): MonthlyStats {
    const now = new Date()
    const targetYear = year ?? now.getFullYear()
    const targetMonth = month ?? now.getMonth() + 1

    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999)

    const monthlyEvents = this.getScoreHistory(childId, {
      start: startDate,
      end: endDate,
    })

    const stats: MonthlyStats = {
      totalEvents: monthlyEvents.length,
      positiveEvents: 0,
      negativeEvents: 0,
      netScore: 0,
      categoryBreakdown: {},
    }

    for (const event of monthlyEvents) {
      if (event.scoreChange > 0) {
        stats.positiveEvents++
      } else if (event.scoreChange < 0) {
        stats.negativeEvents++
      }

      stats.netScore += event.scoreChange

      const categoryName = event.category.name
      stats.categoryBreakdown[categoryName] = (stats.categoryBreakdown[categoryName] ?? 0) + 1
    }

    return stats
  }

  /**
   * 获取排名
   * 需求: 4.1, 3.4
   */
  getRanking(): Child[] {
    return [...this.children].sort((a, b) => b.totalScore - a.totalScore)
  }

  /**
   * 获取时间范围内的统计
   * 需求: 4.2, 4.3, 4.4
   */
  getTimeRangeStats(childId?: string, timeRange?: TimeRange): MonthlyStats {
    const events = this.getScoreHistory(childId, timeRange)

    const stats: MonthlyStats = {
      totalEvents: events.length,
      positiveEvents: 0,
      negativeEvents: 0,
      netScore: 0,
      categoryBreakdown: {},
    }

    for (const event of events) {
      if (event.scoreChange > 0) {
        stats.positiveEvents++
      } else if (event.scoreChange < 0) {
        stats.negativeEvents++
      }

      stats.netScore += event.scoreChange

      const categoryName = event.category.name
      stats.categoryBreakdown[categoryName] = (stats.categoryBreakdown[categoryName] ?? 0) + 1
    }

    return stats
  }

  /**
   * 按分类筛选事件
   * 需求: 5.3, 5.4
   */
  getEventsByCategory(
    categoryId: string,
    childId?: string,
    timeRange?: TimeRange,
  ): ScoreEvent[] {
    let filtered = this.events.filter((e) => e.category.id === categoryId)

    if (childId) {
      filtered = filtered.filter((e) => e.childId === childId)
    }

    if (timeRange) {
      filtered = filtered.filter(
        (e) => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end,
      )
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * 获取所有事件
   */
  getAllEvents(): ScoreEvent[] {
    return [...this.events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * 删除事件
   */
  deleteEvent(eventId: string): void {
    const eventIndex = this.events.findIndex((e) => e.id === eventId)
    if (eventIndex === -1) {
      throw new Error(`事件 ${eventId} 不存在`)
    }

    const event = this.events[eventIndex]
    const child = this.children.find((c) => c.id === event.childId)

    if (child) {
      child.totalScore -= event.scoreChange
    }

    this.events.splice(eventIndex, 1)
  }

  /**
   * 更新儿童列表
   */
  updateChildren(children: Child[]): void {
    this.children = children
  }

  /**
   * 更新事件列表
   */
  updateEvents(events: ScoreEvent[]): void {
    this.events = events
  }
}

export default new ScoreManager()
