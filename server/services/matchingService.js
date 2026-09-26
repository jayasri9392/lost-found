const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'just',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into meaningful keywords
 * @param {string} text 
 * @returns {Set<string>}
 */
const tokenize = (text) => {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
};

/**
 * Calculate Jaccard similarity between two token sets
 * @param {Set<string>} setA 
 * @param {Set<string>} setB 
 * @returns {number} 0 to 1
 */
const jaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

/**
 * Find intersecting words between two sets
 * @param {Set<string>} setA 
 * @param {Set<string>} setB 
 * @returns {string[]}
 */
const getIntersectingWords = (setA, setB) => {
  const result = [];
  for (const item of setA) {
    if (setB.has(item)) {
      result.push(item);
    }
  }
  return result;
};

/**
 * Calculates a match score between a LostItem and a FoundItem
 * @param {Object} lostItem 
 * @param {Object} foundItem 
 * @returns {Object} score breakdown, matchReasons, confidence
 */
const calculateItemMatch = (lostItem, foundItem) => {
  const matchReasons = [];
  const breakdown = {
    categoryScore: 0,
    locationScore: 0,
    textScore: 0,
    dateScore: 0,
    detailsScore: 0,
  };

  // 1. Category Similarity (Weight: 30)
  if (lostItem.category && foundItem.category) {
    if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
      breakdown.categoryScore = 30;
      matchReasons.push(`Identical Category: ${lostItem.category}`);

      // Subcategory bonus if both exist and overlap
      if (lostItem.subcategory && foundItem.subcategory) {
        const lostSub = lostItem.subcategory.toLowerCase();
        const foundSub = foundItem.subcategory.toLowerCase();
        if (lostSub.includes(foundSub) || foundSub.includes(lostSub)) {
          matchReasons.push(`Matching Subcategory: ${lostItem.subcategory}`);
        }
      }
    }
  }

  // 2. Location Similarity (Weight: 25)
  const lostLocTokens = tokenize(`${lostItem.location || ''} ${lostItem.city || ''}`);
  const foundLocTokens = tokenize(`${foundItem.location || ''} ${foundItem.city || ''}`);
  const locIntersect = getIntersectingWords(lostLocTokens, foundLocTokens);

  if (locIntersect.length > 0) {
    const locSim = jaccardSimilarity(lostLocTokens, foundLocTokens);
    // Base overlap score plus proportional boost
    const locScore = Math.min(25, Math.round(10 + locSim * 15 + (locIntersect.length - 1) * 3));
    breakdown.locationScore = locScore;
    matchReasons.push(`Common Location keywords: ${locIntersect.slice(0, 4).join(', ')}`);
  }

  // 3. Title & Description Keyword Similarity (Weight: 25)
  const lostTitleTokens = tokenize(lostItem.title || '');
  const foundTitleTokens = tokenize(foundItem.title || '');
  const titleIntersect = getIntersectingWords(lostTitleTokens, foundTitleTokens);

  const lostDescTokens = tokenize(lostItem.description || '');
  const foundDescTokens = tokenize(foundItem.description || '');
  const descIntersect = getIntersectingWords(lostDescTokens, foundDescTokens);

  let textScore = 0;
  if (titleIntersect.length > 0) {
    textScore += Math.min(15, 8 + titleIntersect.length * 4);
    matchReasons.push(`Key Title terms matched: ${titleIntersect.join(', ')}`);
  }
  if (descIntersect.length > 0) {
    textScore += Math.min(10, 4 + descIntersect.length * 2);
  }
  breakdown.textScore = Math.min(25, textScore);

  // 4. Date Proximity (Weight: 10)
  if (lostItem.dateLost && foundItem.dateFound) {
    const lostDate = new Date(lostItem.dateLost);
    const foundDate = new Date(foundItem.dateFound);
    const diffMs = foundDate - lostDate;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Lost items are usually found on or shortly after they are lost (or +/- 2 days due to human memory)
    if (diffDays >= -2 && diffDays <= 2) {
      breakdown.dateScore = 10;
      matchReasons.push('Found within 48 hours of being lost');
    } else if (diffDays > 2 && diffDays <= 7) {
      breakdown.dateScore = 8;
      matchReasons.push('Found within 1 week of reported loss');
    } else if (diffDays > 7 && diffDays <= 14) {
      breakdown.dateScore = 5;
      matchReasons.push('Found within 2 weeks of reported loss');
    } else if (diffDays > 14 && diffDays <= 30) {
      breakdown.dateScore = 2;
    }
  }

  // 5. Identifying Details Match (Weight: 10)
  const lostDetailsTokens = tokenize(lostItem.identifyingDetails || '');
  const foundDetailsTokens = tokenize(foundItem.identifyingDetails || '');
  const detailsIntersect = getIntersectingWords(lostDetailsTokens, foundDetailsTokens);

  if (detailsIntersect.length > 0) {
    breakdown.detailsScore = Math.min(10, 5 + detailsIntersect.length * 2.5);
    matchReasons.push(`Matching distinguishing features: ${detailsIntersect.join(', ')}`);
  }

  const totalScore = Math.min(
    100,
    breakdown.categoryScore +
      breakdown.locationScore +
      breakdown.textScore +
      breakdown.dateScore +
      breakdown.detailsScore
  );

  let confidence = 'Low';
  if (totalScore >= 70) {
    confidence = 'High';
  } else if (totalScore >= 45) {
    confidence = 'Medium';
  }

  return {
    score: totalScore,
    confidence,
    breakdown,
    matchReasons: matchReasons.length > 0 ? matchReasons : ['General category relevance'],
  };
};

module.exports = {
  tokenize,
  jaccardSimilarity,
  calculateItemMatch,
};
