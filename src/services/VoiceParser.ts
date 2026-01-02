import { Child, ParseResult } from '@/types'

/**
 * 语音文字解析器
 * 需求: 1.3, 2.1, 2.2, 2.3, 2.4
 */
class VoiceParser {
  /**
   * 解析语音文字
   * 需求: 2.1, 2.2, 2.3
   */
  parseVoiceText(text: string, children: Child[]): ParseResult {
    if (!text || text.trim().length === 0) {
      return {
        confidence: 0,
        suggestions: ['请提供有效的语音文字'],
      }
    }

    const normalizedText = text.toLowerCase().trim()

    // 1. 识别儿童姓名
    const childMatch = this.findChildName(normalizedText, children)
    const childId = childMatch?.id
    const childName = childMatch?.name

    // 2. 识别积分操作
    const scoreMatch = this.findScoreOperation(normalizedText)

    // 3. 识别事件原因
    const reason = this.extractReason(normalizedText, childName)

    // 计算置信度
    const confidence = this.calculateConfidence(childMatch, scoreMatch, reason)

    return {
      childId,
      childName,
      scoreChange: scoreMatch?.score,
      reason,
      confidence,
      suggestions: this.generateSuggestions(childMatch, scoreMatch, reason),
    }
  }

  /**
   * 查找儿童姓名
   * 需求: 2.1
   */
  private findChildName(
    text: string,
    children: Child[],
  ): { id: string; name: string } | null {
    for (const child of children) {
      const childNameLower = child.name.toLowerCase()
      if (text.includes(childNameLower)) {
        return { id: child.id, name: child.name }
      }
    }
    return null
  }

  /**
   * 查找积分操作
   * 需求: 2.2
   */
  private findScoreOperation(text: string): { score: number; operation: 'add' | 'subtract' } | null {
    // 匹配加分操作
    const addPatterns = [
      /加(\d+)分/,
      /\+(\d+)/,
      /增加(\d+)分/,
      /奖励(\d+)分/,
      /给(\d+)分/,
      /(\d+)分/,
    ]

    for (const pattern of addPatterns) {
      const match = text.match(pattern)
      if (match) {
        const score = parseInt(match[1], 10)
        // 检查是否有减分关键词
        if (this.hasSubtractKeyword(text)) {
          return { score: -score, operation: 'subtract' }
        }
        return { score, operation: 'add' }
      }
    }

    // 匹配减分操作
    const subtractPatterns = [
      /扣(\d+)分/,
      /-(\d+)/,
      /减少(\d+)分/,
      /惩罚(\d+)分/,
      /扣除(\d+)分/,
    ]

    for (const pattern of subtractPatterns) {
      const match = text.match(pattern)
      if (match) {
        const score = parseInt(match[1], 10)
        return { score: -score, operation: 'subtract' }
      }
    }

    return null
  }

  /**
   * 检查是否有减分关键词
   */
  private hasSubtractKeyword(text: string): boolean {
    const subtractKeywords = ['扣', '减', '惩罚', '错误', '不好', '坏', '违反', '不听话']
    return subtractKeywords.some((keyword) => text.includes(keyword))
  }

  /**
   * 提取事件原因
   * 需求: 2.3
   */
  private extractReason(text: string, childName?: string): string {
    // 移除儿童姓名
    let cleanText = text
    if (childName) {
      cleanText = cleanText.replace(childName.toLowerCase(), '').trim()
    }

    // 移除积分相关的词汇
    cleanText = cleanText
      .replace(/加\d+分/, '')
      .replace(/扣\d+分/, '')
      .replace(/\+\d+/, '')
      .replace(/-\d+/, '')
      .replace(/增加\d+分/, '')
      .replace(/减少\d+分/, '')
      .replace(/奖励\d+分/, '')
      .replace(/惩罚\d+分/, '')
      .replace(/给\d+分/, '')
      .replace(/\d+分/, '')
      .trim()

    return cleanText || '其他'
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    childMatch: { id: string; name: string } | null,
    scoreMatch: { score: number; operation: 'add' | 'subtract' } | null,
    reason: string,
  ): number {
    let confidence = 0

    if (childMatch) confidence += 0.4
    if (scoreMatch) confidence += 0.4
    if (reason && reason !== '其他') confidence += 0.2

    return Math.min(confidence, 1)
  }

  /**
   * 生成建议
   */
  private generateSuggestions(
    childMatch: { id: string; name: string } | null,
    scoreMatch: { score: number; operation: 'add' | 'subtract' } | null,
    reason: string,
  ): string[] {
    const suggestions: string[] = []

    if (!childMatch) {
      suggestions.push('未能识别儿童姓名，请确认')
    }

    if (!scoreMatch) {
      suggestions.push('未能识别积分操作，请确认')
    }

    if (reason === '其他') {
      suggestions.push('未能识别事件原因，请手动输入')
    }

    return suggestions
  }

  /**
   * 验证解析结果
   */
  isValidParseResult(result: ParseResult): boolean {
    return (
      result.confidence >= 0.6 &&
      !!result.childId &&
      !!result.scoreChange &&
      !!result.reason
    )
  }
}

export default new VoiceParser()
