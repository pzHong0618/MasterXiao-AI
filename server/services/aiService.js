/**
 * AI 分析服务
 * 八字和六爻分析逻辑
 */

// ==================== 天干地支数据 ====================

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const TIANGAN_ELEMENT = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const DIZHI_ELEMENT = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

const WUXING_EMOJI = {
    '金': '🔶', '木': '🌳', '水': '💧', '火': '🔥', '土': '🏔️'
};

// ==================== 八字计算 ====================

/**
 * 计算年柱
 */
function getYearPillar(year, month, day) {
    // 立春前算上一年
    if (month < 2 || (month === 2 && day < 4)) {
        year -= 1;
    }

    const tianganIndex = (year - 4) % 10;
    const dizhiIndex = (year - 4) % 12;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: DIZHI[dizhiIndex],
        ganzhi: TIANGAN[tianganIndex] + DIZHI[dizhiIndex]
    };
}

/**
 * 计算月柱
 */
function getMonthPillar(year, month, day) {
    // 简化的月柱计算
    const yearGan = (year - 4) % 10;
    const monthGanStart = [2, 4, 6, 8, 0][yearGan % 5];

    let lunarMonth = month - 1;
    if (day < 6) lunarMonth = (lunarMonth + 11) % 12;

    const tianganIndex = (monthGanStart + lunarMonth) % 10;
    const dizhiIndex = (lunarMonth + 2) % 12;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: DIZHI[dizhiIndex],
        ganzhi: TIANGAN[tianganIndex] + DIZHI[dizhiIndex]
    };
}

/**
 * 计算日柱
 */
function getDayPillar(year, month, day) {
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    const tianganIndex = ((diffDays % 10) + 10) % 10;
    const dizhiIndex = ((diffDays % 12) + 12) % 12;

    return {
        tiangan: TIANGAN[tianganIndex],
        dizhi: DIZHI[dizhiIndex],
        ganzhi: TIANGAN[tianganIndex] + DIZHI[dizhiIndex]
    };
}

/**
 * 计算三柱
 */
function getThreePillars(birthDate) {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
        year: getYearPillar(year, month, day),
        month: getMonthPillar(year, month, day),
        day: getDayPillar(year, month, day)
    };
}

/**
 * 分析五行
 */
function analyzeElements(pillars) {
    const elements = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

    ['year', 'month', 'day'].forEach(key => {
        elements[TIANGAN_ELEMENT[pillars[key].tiangan]] += 1;
        elements[DIZHI_ELEMENT[pillars[key].dizhi]] += 1;
    });

    let strongest = { element: '木', count: 0 };
    let weakest = { element: '木', count: Infinity };

    Object.entries(elements).forEach(([element, count]) => {
        if (count > strongest.count) strongest = { element, count };
        if (count < weakest.count) weakest = { element, count };
    });

    return { distribution: elements, strongest, weakest };
}

// ==================== 相合度分析 ====================

/**
 * 天干五合
 */
const TIANGAN_HE = {
    '甲己': true, '己甲': true,
    '乙庚': true, '庚乙': true,
    '丙辛': true, '辛丙': true,
    '丁壬': true, '壬丁': true,
    '戊癸': true, '癸戊': true
};

/**
 * 地支六合
 */
const DIZHI_LIUHE = {
    '子丑': true, '丑子': true,
    '寅亥': true, '亥寅': true,
    '卯戌': true, '戌卯': true,
    '辰酉': true, '酉辰': true,
    '巳申': true, '申巳': true,
    '午未': true, '未午': true
};

/**
 * 地支相冲
 */
const DIZHI_CHONG = ['子午', '午子', '丑未', '未丑', '寅申', '申寅', '卯酉', '酉卯', '辰戌', '戌辰', '巳亥', '亥巳'];

/**
 * 分析两人八字相合度
 */
function analyzeCompatibilityInternal(pillarsA, pillarsB, matchType) {
    let score = 50; // 基础分
    const details = [];

    // 日柱天干合
    const dayGanKey = pillarsA.day.tiangan + pillarsB.day.tiangan;
    if (TIANGAN_HE[dayGanKey]) {
        score += 15;
        details.push({
            type: 'positive',
            title: '日干相合',
            description: `${dayGanKey}天干相合，两人有天作之合的缘分`
        });
    }

    // 年支六合
    const yearZhiKey = pillarsA.year.dizhi + pillarsB.year.dizhi;
    if (DIZHI_LIUHE[yearZhiKey]) {
        score += 10;
        details.push({
            type: 'positive',
            title: '年支六合',
            description: `${yearZhiKey}六合，家庭背景融洽`
        });
    }

    // 月支六合
    const monthZhiKey = pillarsA.month.dizhi + pillarsB.month.dizhi;
    if (DIZHI_LIUHE[monthZhiKey]) {
        score += 8;
        details.push({
            type: 'positive',
            title: '月支六合',
            description: `${monthZhiKey}六合，情感默契`
        });
    }

    // 日支冲
    const dayZhiKey = pillarsA.day.dizhi + pillarsB.day.dizhi;
    if (DIZHI_CHONG.includes(dayZhiKey)) {
        score -= 10;
        details.push({
            type: 'negative',
            title: '日支相冲',
            description: `${dayZhiKey}相冲，日常相处可能有摩擦`
        });
    }

    // 年支冲
    const yearZhiChong = pillarsA.year.dizhi + pillarsB.year.dizhi;
    if (DIZHI_CHONG.includes(yearZhiChong)) {
        score -= 8;
        details.push({
            type: 'negative',
            title: '年支相冲',
            description: `${yearZhiChong}相冲，原生家庭可能有差异`
        });
    }

    // 五行互补分析
    const elementsA = analyzeElements(pillarsA);
    const elementsB = analyzeElements(pillarsB);

    if (elementsA.weakest.element === elementsB.strongest.element) {
        score += 10;
        details.push({
            type: 'positive',
            title: '五行互补',
            description: `对方的${WUXING_EMOJI[elementsB.strongest.element]}${elementsB.strongest.element}可以补足你的${WUXING_EMOJI[elementsA.weakest.element]}${elementsA.weakest.element}`
        });
    }

    if (elementsB.weakest.element === elementsA.strongest.element) {
        score += 10;
        details.push({
            type: 'positive',
            title: '五行互补',
            description: `你的${WUXING_EMOJI[elementsA.strongest.element]}${elementsA.strongest.element}可以补足对方的${WUXING_EMOJI[elementsB.weakest.element]}${elementsB.weakest.element}`
        });
    }

    // 限制分数范围
    score = Math.max(20, Math.min(95, score));

    return {
        score,
        details,
        elementsA,
        elementsB
    };
}

// ==================== 导出 API ====================

/**
 * 生日匹配分析
 */
export async function analyzeBirthday(personA, personB, matchType) {
    // 计算三柱
    const pillarsA = getThreePillars(personA.birthDate);
    const pillarsB = getThreePillars(personB.birthDate);

    // 分析相合度
    const analysis = analyzeCompatibilityInternal(pillarsA, pillarsB, matchType);

    // 生成结论
    const conclusion = generateConclusion(analysis.score, analysis.details);

    // 生成建议
    const suggestion = generateSuggestion(analysis.score, analysis.details, matchType);

    return {
        personA: {
            name: personA.name,
            gender: personA.gender,
            pillars: pillarsA,
            elements: analysis.elementsA
        },
        personB: {
            name: personB.name,
            gender: personB.gender,
            pillars: pillarsB,
            elements: analysis.elementsB
        },
        score: analysis.score,
        conclusion,
        details: analysis.details,
        suggestion,
        matchType
    };
}

/**
 * 六爻卦象分析
 */
export async function analyzeHexagram(hexagram, matchType, question) {
    // 计算分数
    const score = calculateHexagramScore(hexagram);

    // 生成详情
    const details = generateHexagramDetails(hexagram);

    // 生成结论
    const conclusion = generateHexagramConclusion(hexagram, score);

    // 生成建议
    const suggestion = generateHexagramSuggestion(hexagram, matchType);

    return {
        hexagram,
        score,
        conclusion,
        details,
        suggestion,
        question,
        matchType
    };
}

/**
 * 计算卦象分数
 */
function calculateHexagramScore(hexagram) {
    const positiveHexagrams = ['乾', '坤', '泰', '同人', '大有', '谦', '咸', '恒', '益', '萃', '既济'];
    const negativeHexagrams = ['否', '讼', '剥', '困', '蹇', '睽', '明夷', '未济'];

    let score = 60;

    if (positiveHexagrams.includes(hexagram.name)) {
        score += 20;
    } else if (negativeHexagrams.includes(hexagram.name)) {
        score -= 15;
    }

    // 变爻影响
    if (hexagram.hasChanging && hexagram.changingPositions) {
        score += hexagram.changingPositions.length <= 2 ? 5 : -5;
    }

    return Math.max(20, Math.min(95, score));
}

/**
 * 生成卦象详情
 */
function generateHexagramDetails(hexagram) {
    const details = [];

    details.push({
        type: 'positive',
        title: `${hexagram.name}卦象`,
        description: hexagram.meaning || '待解析'
    });

    if (hexagram.upper && hexagram.lower) {
        details.push({
            type: 'positive',
            title: '上下卦分析',
            description: `上卦${hexagram.upper.name}（${hexagram.upper.nature || ''}），下卦${hexagram.lower.name}（${hexagram.lower.nature || ''}）`
        });
    }

    if (hexagram.hasChanging && hexagram.changingPositions) {
        details.push({
            type: hexagram.changingPositions.length <= 2 ? 'positive' : 'negative',
            title: '变爻分析',
            description: `第${hexagram.changingPositions.join('、')}爻为变爻，表示事情会有变化`
        });
    }

    return details;
}

/**
 * 生成结论
 */
function generateConclusion(score, details) {
    const positives = details.filter(d => d.type === 'positive').length;
    const negatives = details.filter(d => d.type === 'negative').length;

    if (score >= 80) {
        return 'A和B互利：双方八字高度相合，是天作之合的良缘。';
    } else if (score >= 60) {
        if (positives > negatives) {
            return 'A利B，B不利A：你在这段关系中付出较多，但整体是积极的。';
        } else {
            return 'A不利B，B利A：对方在这段关系中获益更多。';
        }
    } else if (score >= 40) {
        return 'A和B相互不利：双方八字有一定冲突，需要更多包容和理解。';
    } else {
        return 'A和B相互不利：八字显示双方不太适合，建议谨慎考虑。';
    }
}

/**
 * 生成卦象结论
 */
function generateHexagramConclusion(hexagram, score) {
    if (score >= 75) {
        return `${hexagram.name}卦显示双方关系积极向好，有互利共赢的趋势。`;
    } else if (score >= 55) {
        return `${hexagram.name}卦提示需要双方共同努力，关系可以改善。`;
    } else {
        return `${hexagram.name}卦暗示当前时机不太适合，建议谨慎行事。`;
    }
}

/**
 * 生成建议
 */
function generateSuggestion(score, details, matchType) {
    const positives = details.filter(d => d.type === 'positive');
    const negatives = details.filter(d => d.type === 'negative');

    let suggestion = '';

    if (score >= 80) {
        suggestion = '这是一段非常好的缘分！双方在性格和命理上高度契合，建议珍惜这份关系，共同维护。注意保持沟通，互相理解和包容。';
    } else if (score >= 60) {
        suggestion = '整体关系是积极的，但也存在一些需要注意的地方。';
        if (negatives.length > 0) {
            suggestion += `特别是${negatives[0].title}方面，需要双方多一些耐心和理解。`;
        }
        suggestion += '只要用心经营，这段关系会越来越好。';
    } else if (score >= 40) {
        suggestion = '双方存在一定的冲突，但并非不可调和。建议：1) 增加沟通频率；2) 尊重对方的差异；3) 寻找共同兴趣。如果双方都愿意付出努力，关系是可以改善的。';
    } else {
        suggestion = '从命理角度看，双方确实存在较大的冲突。建议在做重要决定前，多观察、多了解对方。如果是合作关系，建议寻找其他机会；如果是感情关系，请谨慎考虑。';
    }

    return suggestion;
}

/**
 * 生成卦象建议
 */
function generateHexagramSuggestion(hexagram, matchType) {
    return `${hexagram.name}卦的核心含义是"${hexagram.meaning || '待解析'}"。根据卦象提示，当前最重要的是保持平和的心态，不要急于求成。遇事多思考，听从内心的指引。如果有变爻，说明事情会有转机，保持耐心等待合适的时机。`;
}

export default { analyzeBirthday, analyzeHexagram };
