// 测试改进的姓名识别算法（包含音近字和拼音匹配）
// 这个文件演示了新的姓名识别功能如何处理小名、昵称、音近字和拼音

const testChildren = [
  { id: '1', name: '刘瑾萱', avatar: '👧' },
  { id: '2', name: '王小明', avatar: '👦' },
  { id: '3', name: '李小红', avatar: '👧' }
]

const testCases = [
  // 完全匹配测试
  { input: '刘瑾萱加5分', expected: '刘瑾萱', confidence: 1.0, type: 'full' },
  
  // 小名重复模式测试 (萱萱)
  { input: '萱萱表现很好加10分', expected: '刘瑾萱', confidence: 0.9, type: 'nickname_repeat' },
  
  // 音近字重复模式测试 (轩轩 → 萱萱)
  { input: '轩轩今天很乖加3分', expected: '刘瑾萱', confidence: 0.85, type: 'sound_similar_repeat' },
  { input: '宣宣帮忙做家务加8分', expected: '刘瑾萱', confidence: 0.85, type: 'sound_similar_repeat' },
  
  // 🆕 拼音重复模式测试 (xuanxuan → 萱萱)
  { input: 'xuanxuan今天很棒加6分', expected: '刘瑾萱', confidence: 0.88, type: 'pinyin_nickname_repeat' },
  { input: 'mingming写作业认真加4分', expected: '王小明', confidence: 0.88, type: 'pinyin_nickname_repeat' },
  
  // 小名"小"字模式测试 (小萱)
  { input: '小萱帮忙做家务加8分', expected: '刘瑾萱', confidence: 0.8, type: 'nickname_xiao' },
  { input: '小明写作业很认真加6分', expected: '王小明', confidence: 0.8, type: 'nickname_xiao' },
  
  // 音近字"小"字模式测试 (小轩 → 小萱)
  { input: '小轩今天表现不错加4分', expected: '刘瑾萱', confidence: 0.75, type: 'sound_similar_xiao' },
  { input: '小名今天很棒加2分', expected: '王小明', confidence: 0.75, type: 'sound_similar_xiao' },
  
  // 🆕 拼音"小"字模式测试 (xiaoxuan → 小萱)
  { input: 'xiaoxuan表现很好加5分', expected: '刘瑾萱', confidence: 0.82, type: 'pinyin_nickname_xiao' },
  { input: 'xiaoming今天很乖加3分', expected: '王小明', confidence: 0.82, type: 'pinyin_nickname_xiao' },
  
  // 🆕 完整姓名拼音匹配 (liujinxuan → 刘瑾萱)
  { input: 'liujinxuan加10分', expected: '刘瑾萱', confidence: 0.95, type: 'pinyin_full_name' },
  { input: 'wangxiaoming加8分', expected: '王小明', confidence: 0.95, type: 'pinyin_full_name' },
  
  // 🆕 单字拼音匹配 (xuan → 萱)
  { input: 'xuan今天很棒加7分', expected: '刘瑾萱', confidence: 0.7, type: 'pinyin_single_char' },
  
  // 部分匹配测试
  { input: '刘瑾今天表现不错加4分', expected: '刘瑾萱', confidence: 0.6, type: 'partial' },
  
  // 单字匹配测试（需要谨慎处理冲突）
  { input: '萱今天很棒加2分', expected: '刘瑾萱', confidence: 0.3, type: 'single_char' },
  
  // 冲突情况测试
  { input: '小加5分', expected: null, confidence: 0, type: 'conflict' }, // "小"字在多个名字中出现
]

console.log('=== 儿童姓名识别算法测试（含音近字和拼音匹配）===\n')

console.log('测试儿童列表:')
testChildren.forEach(child => {
  console.log(`- ${child.name} (ID: ${child.id})`)
})

console.log('\n=== 测试用例 ===\n')

testCases.forEach((testCase, index) => {
  console.log(`测试 ${index + 1}: "${testCase.input}"`)
  console.log(`  期望匹配: ${testCase.expected || '无匹配'}`)
  console.log(`  期望置信度: ${testCase.confidence}`)
  console.log(`  匹配类型: ${testCase.type}`)
  console.log('')
})

console.log('=== 算法特性说明 ===\n')

console.log('1. 完全匹配 (置信度: 1.0)')
console.log('   - 直接匹配完整姓名')
console.log('   - 例: "刘瑾萱" 匹配 "刘瑾萱加5分"')

console.log('\n🆕 2. 完整姓名拼音匹配 (置信度: 0.95)')
console.log('   - 完整拼音匹配: liujinxuan→刘瑾萱')
console.log('   - 例: "liujinxuan" 匹配 "刘瑾萱"')

console.log('\n3. 小名重复模式 (置信度: 0.9)')
console.log('   - 最后一个字重复: 萱萱、明明、红红')
console.log('   - 例: "萱萱" 匹配 "刘瑾萱"')

console.log('\n🆕 4. 拼音重复小名匹配 (置信度: 0.88)')
console.log('   - 拼音重复模式: xuanxuan→萱萱、mingming→明明')
console.log('   - 例: "xuanxuan" 匹配 "刘瑾萱"')

console.log('\n5. 音近字重复模式 (置信度: 0.85)')
console.log('   - 处理语音识别错误: 轩轩→萱萱、名名→明明')
console.log('   - 例: "轩轩" 匹配 "刘瑾萱"（因为轩≈萱）')

console.log('\n🆕 6. 拼音"小"字模式 (置信度: 0.82)')
console.log('   - 拼音小字模式: xiaoxuan→小萱、xiaoming→小明')
console.log('   - 例: "xiaoxuan" 匹配 "刘瑾萱"')

console.log('\n7. 小名"小"字模式 (置信度: 0.8)')
console.log('   - "小" + 最后一个字: 小萱、小明、小红')
console.log('   - 例: "小萱" 匹配 "刘瑾萱"')

console.log('\n8. 音近字"小"字模式 (置信度: 0.75)')
console.log('   - 处理语音识别错误: 小轩→小萱、小名→小明')
console.log('   - 例: "小轩" 匹配 "刘瑾萱"（因为轩≈萱）')

console.log('\n🆕 9. 单字拼音匹配 (置信度: 0.7)')
console.log('   - 单个拼音匹配: xuan→萱、ming→明')
console.log('   - 例: "xuan" 匹配 "刘瑾萱"')

console.log('\n10. 部分匹配 (置信度: 0.6)')
console.log('   - 匹配姓名的前面部分')
console.log('   - 例: "刘瑾" 匹配 "刘瑾萱"')

console.log('\n11. 单字匹配 (置信度: 0.3)')
console.log('   - 匹配单个字符，但需要避免冲突')
console.log('   - 例: "萱" 匹配 "刘瑾萱"，但"小"不匹配因为多个孩子都有')

console.log('\n12. 冲突处理')
console.log('   - 当多个孩子有相同置信度时，降低置信度触发人工确认')
console.log('   - 避免单字匹配时的歧义')

console.log('\n=== 🆕 拼音映射表示例 ===\n')

const pinyinExamples = [
  'xuan → 萱、轩、宣、旋、璇',
  'ming → 明、名、鸣、铭', 
  'hong → 红、虹、宏、弘',
  'liu → 刘、柳、留',
  'wang → 王、汪',
  'li → 李、黎、利、力、立、丽',
  'xiao → 小'
]

pinyinExamples.forEach(example => {
  console.log(`- ${example}`)
})

console.log('\n=== 实际应用示例 ===\n')

const examples = [
  '萱萱今天帮妈妈洗碗加10分',          // 直接小名匹配
  '轩轩今天很乖加8分',                 // 音近字匹配 (轩轩→萱萱)
  'xuanxuan表现很好加6分',             // 🆕 拼音重复匹配
  '小萱写作业很认真加5分',             // 小字模式匹配
  '小轩表现很好加3分',                 // 音近字小字模式 (小轩→小萱)
  'xiaoxuan今天很棒加4分',             // 🆕 拼音小字模式
  'liujinxuan加10分',                  // 🆕 完整姓名拼音匹配
  'xuan今天很乖加2分',                 // 🆕 单字拼音匹配
  '刘瑾萱表现很好加5分',               // 完全匹配
]

examples.forEach((example, index) => {
  console.log(`${index + 1}. 语音输入: "${example}"`)
  if ([1, 2, 4, 5, 6, 7].includes(index)) {
    console.log('   🆕 → 使用新增匹配算法')
  } else {
    console.log('   → 使用传统匹配算法')
  }
  console.log('   → 自动识别姓名、积分变化和原因')
  console.log('')
})

console.log('=== 🎯 解决的核心问题 ===\n')
console.log('✅ 问题1: 孩子叫"刘瑾萱"，小名"萱萱"，但语音识别成"轩轩"')
console.log('✅ 解决: 音近字算法自动识别 轩轩 → 萱萱 → 刘瑾萱')

console.log('\n✅ 问题2: 用户习惯用拼音输入，如"xuanxuan"、"xiaoxuan"')
console.log('✅ 解决: 拼音算法自动识别 xuanxuan → 萱萱 → 刘瑾萱')

console.log('\n✅ 问题3: 完整姓名拼音输入，如"liujinxuan"')
console.log('✅ 解决: 完整拼音算法自动识别 liujinxuan → 刘瑾萱')

console.log('\n✅ 置信度排序: 完整匹配 > 拼音完整 > 小名 > 拼音小名 > 音近字 > 部分 > 单字')
console.log('✅ 用户体验: 支持中文、拼音、音近字多种输入方式，智能理解用户意图')