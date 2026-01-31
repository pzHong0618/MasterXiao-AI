/**
 * MasterXiao-AI 匹配类型数据
 * 10种匹配分析类型定义
 */

export const matchTypes = [
    {
        id: 'love',
        icon: '💑',
        title: '感情匹配',
        description: '预知你的正缘何时降临',
        longDescription: '通过生辰八字或塔罗牌分析，深入了解你与TA之间的感情缘分，探索两人性格的互补与摩擦点。',
        price: 29.9,
        category: 'relationship',
        popular: true,
        features: ['五行相生相克分析', '性格互补性评估', '相处建议']
    },
    {
        id: 'career',
        icon: '💼',
        title: '职场关系',
        description: '解析职场人际关系',
        longDescription: '分析你与同事、领导之间的相处之道，了解职场中的潜在助力与阻力。',
        price: 29.9,
        category: 'career',
        popular: true,
        features: ['领导关系分析', '同事相处建议', '职场风险提示']
    },
    {
        id: 'cooperation',
        icon: '🤝',
        title: '合作关系',
        description: '看清合作对象，早做决定',
        longDescription: '评估你与潜在合作伙伴的契合度，分析合作中可能遇到的挑战与机遇。',
        price: 29.9,
        category: 'career',
        popular: false,
        features: ['合作契合度评分', '风险预警', '合作策略建议']
    },
    {
        id: 'thoughts',
        icon: '💭',
        title: 'TA的想法和态度',
        description: '揭开TA的真实想法',
        longDescription: '通过塔罗占卜，探索对方内心的真实想法和对你的态度。',
        price: 29.9,
        category: 'relationship',
        popular: true,
        features: ['对方心理分析', '真实态度解读', '沟通建议']
    },
    {
        id: 'job',
        icon: '📈',
        title: '职业发展',
        description: '找到最适合你的职业方向',
        longDescription: '基于你的性格特征和命理分析，为你推荐最适合的职业发展方向。',
        price: 29.9,
        category: 'career',
        popular: false,
        features: ['性格职业匹配', '行业推荐', '发展路径规划']
    },
    {
        id: 'city',
        icon: '🗺️',
        title: '城市方向',
        description: '哪座城市是你的命运之地',
        longDescription: '根据你的出生地和命理特征，分析最适合你发展的城市方向。',
        price: 29.9,
        category: 'direction',
        popular: false,
        features: ['方位吉凶分析', '城市推荐', '发展时机建议']
    },
    {
        id: 'peach',
        icon: '🌸',
        title: '桃花运势',
        description: '桃花何时盛开',
        longDescription: '分析你近期的桃花运势，预测感情机遇出现的时间和方式。',
        price: 29.9,
        category: 'relationship',
        popular: true,
        features: ['桃花运势预测', '机遇时间点', '提升桃花运建议']
    },
    {
        id: 'benefactor',
        icon: '⭐',
        title: '贵人匹配',
        description: '谁是你生命中的贵人',
        longDescription: '分析你命中的贵人特征，帮助你识别和把握生命中的贵人。',
        price: 29.9,
        category: 'direction',
        popular: false,
        features: ['贵人特征分析', '识别方法', '结缘建议']
    },
    {
        id: 'yesno',
        icon: '❓',
        title: 'Yes or No',
        description: '犹豫时，快速帮你判断',
        longDescription: '面对选择犹豫不决？让塔罗牌给你一个明确的答案。',
        price: 19.9,
        category: 'decision',
        popular: true,
        features: ['快速占卜', '明确答案', '行动建议']
    },
    {
        id: 'choice',
        icon: '⚖️',
        title: '二选一',
        description: '左右为难？帮你稳妥选对',
        longDescription: '两个选择左右为难？塔罗牌帮你分析每个选择的利弊。',
        price: 19.9,
        category: 'decision',
        popular: false,
        features: ['双选对比分析', '利弊权衡', '最优建议']
    }
];

/**
 * 按分类获取匹配类型
 */
export function getMatchTypesByCategory(category) {
    return matchTypes.filter(type => type.category === category);
}

/**
 * 获取热门匹配类型
 */
export function getPopularMatchTypes() {
    return matchTypes.filter(type => type.popular);
}

/**
 * 根据 ID 获取匹配类型
 */
export function getMatchTypeById(id) {
    return matchTypes.find(type => type.id === id);
}

/**
 * 匹配类型分类
 */
export const categories = [
    { id: 'relationship', name: '感情关系', icon: '💕' },
    { id: 'career', name: '职场事业', icon: '💼' },
    { id: 'direction', name: '方向指引', icon: '🧭' },
    { id: 'decision', name: '决策判断', icon: '⚖️' }
];

export default matchTypes;
