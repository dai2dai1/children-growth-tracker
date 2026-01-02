import { Child, ParseResult } from '@/types'

/**
 * 语音文字解析器
 * 需求: 1.3, 2.1, 2.2, 2.3, 2.4
 */
class VoiceParser {
  /**
   * 音近字映射表 - 处理语音识别常见错误
   */
  private soundSimilarMap: { [key: string]: string[] } = {
    // 萱相关音近字
    '轩': ['萱', '宣', '旋', '璇'],
    '萱': ['轩', '宣', '旋', '璇'],
    '宣': ['萱', '轩', '旋', '璇'],
    '旋': ['萱', '轩', '宣', '璇'],
    '璇': ['萱', '轩', '宣', '旋'],
    
    // 明相关音近字
    '明': ['名', '鸣', '铭'],
    '名': ['明', '鸣', '铭'],
    '鸣': ['明', '名', '铭'],
    '铭': ['明', '名', '鸣'],
    
    // 红相关音近字
    '红': ['虹', '宏', '弘'],
    '虹': ['红', '宏', '弘'],
    '宏': ['红', '虹', '弘'],
    '弘': ['红', '虹', '宏'],
    
    // 华相关音近字
    '华': ['花', '化'],
    '花': ['华', '化'],
    '化': ['华', '花'],
    
    // 强相关音近字
    '强': ['墙', '枪'],
    '墙': ['强', '枪'],
    '枪': ['强', '墙'],
    
    // 军相关音近字
    '军': ['君', '均'],
    '君': ['军', '均'],
    '均': ['军', '君'],
    
    // 东相关音近字
    '东': ['冬', '董'],
    '冬': ['东', '董'],
    '董': ['东', '冬'],
    
    // 伟相关音近字
    '伟': ['为', '维', '威'],
    '为': ['伟', '维', '威'],
    '维': ['伟', '为', '威'],
    '威': ['伟', '为', '维'],
    
    // 刚相关音近字
    '刚': ['钢', '岗'],
    '钢': ['刚', '岗'],
    '岗': ['刚', '钢'],
    
    // 龙相关音近字
    '龙': ['隆', '笼'],
    '隆': ['龙', '笼'],
    '笼': ['龙', '隆'],
    
    // 虎相关音近字
    '虎': ['户', '护'],
    '户': ['虎', '护'],
    '护': ['虎', '户'],
    
    // 鹏相关音近字
    '鹏': ['朋', '彭'],
    '朋': ['鹏', '彭'],
    '彭': ['鹏', '朋'],
    
    // 美相关音近字
    '美': ['梅', '每'],
    '梅': ['美', '每'],
    '每': ['美', '梅'],
    
    // 丽相关音近字
    '丽': ['利', '力', '立'],
    '利': ['丽', '力', '立'],
    '力': ['丽', '利', '立'],
    '立': ['丽', '利', '力'],
    
    // 雪相关音近字
    '雪': ['学', '血'],
    '学': ['雪', '血'],
    '血': ['雪', '学'],
    
    // 月相关音近字
    '月': ['乐', '越'],
    '乐': ['月', '越'],
    '越': ['月', '乐'],
    
    // 云相关音近字
    '云': ['运', '韵'],
    '运': ['云', '韵'],
    '韵': ['云', '运'],
    
    // 燕相关音近字
    '燕': ['艳', '雁'],
    '艳': ['燕', '雁'],
    '雁': ['燕', '艳'],
    
    // 玉相关音近字
    '玉': ['雨', '语', '育'],
    '雨': ['玉', '语', '育'],
    '语': ['玉', '雨', '育'],
    '育': ['玉', '雨', '语'],
    
    // 珍相关音近字
    '珍': ['真', '贞'],
    '真': ['珍', '贞'],
    '贞': ['珍', '真']
  }

  /**
   * 拼音映射表 - 处理拼音输入
   */
  private pinyinMap: { [key: string]: string[] } = {
    // 常用姓氏拼音
    'liu': ['刘', '柳', '留'],
    'wang': ['王', '汪'],
    'li': ['李', '黎', '利', '力', '立', '丽'],
    'zhang': ['张', '章'],
    'chen': ['陈', '晨'],
    'yang': ['杨', '阳'],
    'zhao': ['赵', '朝'],
    'huang': ['黄', '皇'],
    'zhou': ['周', '洲'],
    'wu': ['吴', '武', '五'],
    'xu': ['徐', '许'],
    'sun': ['孙'],
    'hu': ['胡', '湖', '虎', '户', '护'],
    'zhu': ['朱', '珠'],
    'gao': ['高', '搞'],
    'lin': ['林', '临'],
    'he': ['何', '和', '河'],
    'guo': ['郭', '国'],
    'ma': ['马', '妈'],
    'luo': ['罗', '洛'],
    
    // 常用名字拼音
    'xuan': ['萱', '轩', '宣', '旋', '璇'],
    'ming': ['明', '名', '鸣', '铭'],
    'hong': ['红', '虹', '宏', '弘'],
    'hua': ['华', '花', '化'],
    'qiang': ['强', '墙', '枪'],
    'jun': ['军', '君', '均'],
    'dong': ['东', '冬', '董'],
    'wei': ['伟', '为', '维', '威'],
    'gang': ['刚', '钢', '岗'],
    'long': ['龙', '隆', '笼'],
    'peng': ['鹏', '朋', '彭'],
    'mei': ['美', '梅', '每'],
    'xue': ['雪', '学', '血'],
    'yue': ['月', '乐', '越'],
    'yun': ['云', '运', '韵'],
    'yan': ['燕', '艳', '雁'],
    'yu': ['玉', '雨', '语', '育', '宇'],
    'zhen': ['珍', '真', '贞'],
    
    // 小名拼音
    'xiao': ['小'],
    'jin': ['瑾', '金', '今'],
    'xin': ['心', '新', '欣'],
    'jia': ['佳', '家', '嘉'],
    'yi': ['一', '艺', '易', '怡'],
    'hao': ['好', '豪', '浩', '昊'],
    'le': ['乐', '了'],
    'an': ['安', '按'],
    'ning': ['宁', '柠'],
    'rui': ['瑞', '锐'],
    'tian': ['天', '田', '甜'],
    'zi': ['子', '紫', '字'],
    'han': ['涵', '汉', '韩'],
    'ran': ['然', '燃'],
    'kai': ['凯', '开'],
    'bo': ['博', '波'],
  }

  /**
   * 获取音近字
   */
  private getSoundSimilar(char: string): string[] {
    return this.soundSimilarMap[char] || []
  }

  /**
   * 获取拼音对应的汉字
   */
  private getPinyinChars(pinyin: string): string[] {
    return this.pinyinMap[pinyin.toLowerCase()] || []
  }

  /**
   * 检查两个字符是否音近
   */
  private isSoundSimilar(char1: string, char2: string): boolean {
    if (char1 === char2) return true
    const similar = this.getSoundSimilar(char1)
    return similar.includes(char2)
  }

  /**
   * 检查拼音是否匹配汉字
   */
  private isPinyinMatch(pinyin: string, char: string): boolean {
    const chars = this.getPinyinChars(pinyin)
    return chars.includes(char)
  }
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

    // 1. 识别儿童姓名（使用改进的算法）
    const childMatch = this.findChildName(normalizedText, children)
    const childId = childMatch?.id
    const childName = childMatch?.name

    // 2. 识别积分操作
    const scoreMatch = this.findScoreOperation(normalizedText)

    // 3. 识别事件原因
    const reason = this.extractReason(normalizedText, childName)

    // 计算置信度（结合名字匹配的置信度）
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
   * 查找儿童姓名（改进版 - 支持音近字和拼音匹配）
   * 需求: 2.1
   */
  private findChildName(
    text: string,
    children: Child[],
  ): { id: string; name: string; confidence: number } | null {
    const matches: Array<{ child: Child; confidence: number; matchType: string }> = []

    for (const child of children) {
      const childNameLower = child.name.toLowerCase()
      const textLower = text.toLowerCase()
      
      // 1. 完全匹配（最高优先级）
      if (textLower.includes(childNameLower)) {
        matches.push({ 
          child, 
          confidence: 1.0, 
          matchType: 'full' 
        })
        continue
      }

      // 2. 小名匹配（提取最后一个字的重复）
      const lastName = child.name.slice(-1) // 最后一个字
      const nickName1 = lastName + lastName // 萱萱
      const nickName2 = '小' + lastName     // 小萱
      
      if (textLower.includes(nickName1.toLowerCase())) {
        matches.push({ 
          child, 
          confidence: 0.9, 
          matchType: 'nickname_repeat' 
        })
        continue
      }
      
      if (textLower.includes(nickName2.toLowerCase())) {
        matches.push({ 
          child, 
          confidence: 0.8, 
          matchType: 'nickname_xiao' 
        })
        continue
      }

      // 3. 音近字小名匹配
      const soundSimilarMatches = this.findSoundSimilarNickname(textLower, child)
      if (soundSimilarMatches.length > 0) {
        const bestSoundMatch = soundSimilarMatches[0]
        matches.push({
          child,
          confidence: bestSoundMatch.confidence,
          matchType: bestSoundMatch.matchType
        })
        continue
      }

      // 4. 🆕 拼音匹配
      const pinyinMatches = this.findPinyinMatches(textLower, child)
      if (pinyinMatches.length > 0) {
        const bestPinyinMatch = pinyinMatches[0]
        matches.push({
          child,
          confidence: bestPinyinMatch.confidence,
          matchType: bestPinyinMatch.matchType
        })
        continue
      }

      // 5. 部分匹配（较低优先级）
      if (child.name.length >= 2) {
        const firstName = child.name.slice(0, -1) // 前面的字
        if (textLower.includes(firstName.toLowerCase()) && firstName.length >= 2) {
          matches.push({ 
            child, 
            confidence: 0.6, 
            matchType: 'partial' 
          })
        }
      }

      // 6. 单字匹配（最低优先级，需要谨慎）
      if (child.name.length >= 2) {
        for (let i = 0; i < child.name.length; i++) {
          const singleChar = child.name[i]
          if (textLower.includes(singleChar.toLowerCase()) && 
              !this.hasOtherChildWithSameChar(singleChar, children, child)) {
            matches.push({ 
              child, 
              confidence: 0.3, 
              matchType: 'single_char' 
            })
            break
          }
        }
      }
    }

    if (matches.length === 0) {
      return null
    }

    // 按置信度排序，返回最高的
    matches.sort((a, b) => b.confidence - a.confidence)
    const bestMatch = matches[0]

    // 如果有多个相同置信度的匹配，需要人工确认
    const sameConfidenceMatches = matches.filter(m => m.confidence === bestMatch.confidence)
    if (sameConfidenceMatches.length > 1) {
      return {
        id: bestMatch.child.id,
        name: bestMatch.child.name,
        confidence: bestMatch.confidence * 0.5 // 降低置信度，触发确认
      }
    }

    return {
      id: bestMatch.child.id,
      name: bestMatch.child.name,
      confidence: bestMatch.confidence
    }
  }

  /**
   * 查找音近字小名匹配
   */
  private findSoundSimilarNickname(
    text: string, 
    child: Child
  ): Array<{ confidence: number; matchType: string }> {
    const matches: Array<{ confidence: number; matchType: string }> = []
    const lastName = child.name.slice(-1) // 最后一个字

    // 检查音近字重复模式 (轩轩 → 萱萱)
    for (let i = 0; i < text.length - 1; i++) {
      const char1 = text[i]
      const char2 = text[i + 1]
      
      // 如果是重复字符，检查是否与最后一个字音近
      if (char1 === char2 && this.isSoundSimilar(char1, lastName)) {
        matches.push({
          confidence: 0.85, // 略低于直接匹配
          matchType: 'sound_similar_repeat'
        })
      }
    }

    // 检查音近字"小"字模式 (小轩 → 小萱)
    const xiaoPattern = text.match(/小(.)/g)
    if (xiaoPattern) {
      for (const match of xiaoPattern) {
        const char = match[1] // "小"后面的字
        if (this.isSoundSimilar(char, lastName)) {
          matches.push({
            confidence: 0.75, // 略低于直接匹配
            matchType: 'sound_similar_xiao'
          })
        }
      }
    }

    // 按置信度排序
    matches.sort((a, b) => b.confidence - a.confidence)
    return matches
  }

  /**
   * 查找拼音匹配
   */
  private findPinyinMatches(
    text: string, 
    child: Child
  ): Array<{ confidence: number; matchType: string }> {
    const matches: Array<{ confidence: number; matchType: string }> = []
    
    // 提取文本中的拼音（英文字母组合）
    const pinyinPattern = /[a-zA-Z]+/g
    const pinyinMatches = text.match(pinyinPattern)
    
    if (!pinyinMatches) return matches

    // 检查完整姓名拼音匹配
    const fullNamePinyin = this.getFullNamePinyin(child.name)
    for (const pinyin of pinyinMatches) {
      if (fullNamePinyin.includes(pinyin.toLowerCase())) {
        matches.push({
          confidence: 0.95,
          matchType: 'pinyin_full_name'
        })
      }
    }

    // 检查小名拼音匹配
    const lastName = child.name.slice(-1)
    for (const pinyin of pinyinMatches) {
      // 检查重复小名拼音 (xuanxuan → 萱萱)
      if (this.isPinyinRepeatedNickname(pinyin, lastName)) {
        matches.push({
          confidence: 0.88,
          matchType: 'pinyin_nickname_repeat'
        })
      }
      
      // 检查"小"字拼音模式 (xiaoxuan → 小萱)
      if (this.isPinyinXiaoNickname(pinyin, lastName)) {
        matches.push({
          confidence: 0.82,
          matchType: 'pinyin_nickname_xiao'
        })
      }
      
      // 检查单字拼音匹配
      if (this.isPinyinMatch(pinyin, lastName)) {
        matches.push({
          confidence: 0.7,
          matchType: 'pinyin_single_char'
        })
      }
    }

    // 按置信度排序
    matches.sort((a, b) => b.confidence - a.confidence)
    return matches
  }

  /**
   * 获取完整姓名的拼音组合
   */
  private getFullNamePinyin(name: string): string[] {
    const pinyinCombinations: string[] = []
    
    // 为每个字符查找可能的拼音
    const charPinyins: string[][] = []
    for (const char of name) {
      const possiblePinyins: string[] = []
      for (const [pinyin, chars] of Object.entries(this.pinyinMap)) {
        if (chars.includes(char)) {
          possiblePinyins.push(pinyin)
        }
      }
      if (possiblePinyins.length > 0) {
        charPinyins.push(possiblePinyins)
      }
    }
    
    // 生成拼音组合
    if (charPinyins.length > 0) {
      this.generatePinyinCombinations(charPinyins, 0, '', pinyinCombinations)
    }
    
    return pinyinCombinations
  }

  /**
   * 递归生成拼音组合
   */
  private generatePinyinCombinations(
    charPinyins: string[][], 
    index: number, 
    current: string, 
    results: string[]
  ): void {
    if (index >= charPinyins.length) {
      results.push(current)
      return
    }
    
    for (const pinyin of charPinyins[index]) {
      this.generatePinyinCombinations(charPinyins, index + 1, current + pinyin, results)
    }
  }

  /**
   * 检查是否是重复小名拼音 (xuanxuan)
   */
  private isPinyinRepeatedNickname(pinyin: string, char: string): boolean {
    // 查找字符对应的拼音
    for (const [py, chars] of Object.entries(this.pinyinMap)) {
      if (chars.includes(char)) {
        // 检查是否是重复拼音 (xuanxuan)
        const repeatedPinyin = py + py
        if (pinyin.toLowerCase() === repeatedPinyin) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 检查是否是"小"字拼音模式 (xiaoxuan)
   */
  private isPinyinXiaoNickname(pinyin: string, char: string): boolean {
    if (!pinyin.toLowerCase().startsWith('xiao')) {
      return false
    }
    
    const remainingPinyin = pinyin.toLowerCase().substring(4) // 去掉 'xiao'
    
    // 查找字符对应的拼音
    for (const [py, chars] of Object.entries(this.pinyinMap)) {
      if (chars.includes(char) && py === remainingPinyin) {
        return true
      }
    }
    return false
  }

  /**
   * 检查是否有其他孩子包含相同的字
   */
  private hasOtherChildWithSameChar(char: string, children: Child[], currentChild: Child): boolean {
    return children.some(child => 
      child.id !== currentChild.id && 
      child.name.includes(char)
    )
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
   * 计算置信度（改进版，结合名字匹配置信度）
   */
  private calculateConfidence(
    childMatch: { id: string; name: string; confidence: number } | null,
    scoreMatch: { score: number; operation: 'add' | 'subtract' } | null,
    reason: string,
  ): number {
    let confidence = 0

    // 名字匹配置信度权重 40%
    if (childMatch) {
      confidence += childMatch.confidence * 0.4
    }
    
    // 积分操作识别权重 40%
    if (scoreMatch) {
      confidence += 0.4
    }
    
    // 事件原因识别权重 20%
    if (reason && reason !== '其他') {
      confidence += 0.2
    }

    return Math.min(confidence, 1)
  }

  /**
   * 生成建议（改进版）
   */
  private generateSuggestions(
    childMatch: { id: string; name: string; confidence: number } | null,
    scoreMatch: { score: number; operation: 'add' | 'subtract' } | null,
    reason: string,
  ): string[] {
    const suggestions: string[] = []

    if (!childMatch) {
      suggestions.push('未能识别儿童姓名，请确认')
    } else if (childMatch.confidence < 0.7) {
      suggestions.push(`名字识别不确定，是否为 ${childMatch.name}？`)
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
