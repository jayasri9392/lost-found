const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { calculateItemMatch } = require('../services/matchingService');

/**
 * @desc    Get intelligent matching found items for a given lost item
 * @route   GET /api/matches/lost/:lostItemId
 * @access  Public (or Private)
 */
const getMatchesForLostItem = async (req, res, next) => {
  try {
    const { lostItemId } = req.params;
    const lostItem = await LostItem.findById(lostItemId);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found',
      });
    }

    // Query candidate found items that are available or claimed
    const candidateFoundItems = await FoundItem.find({
      status: { $in: ['Available', 'Claimed'] },
    }).populate('userId', 'name email phone avatar');

    const matches = [];

    for (const foundItem of candidateFoundItems) {
      const matchResult = calculateItemMatch(lostItem, foundItem);

      // Only include if score is at least 15%
      if (matchResult.score >= 15) {
        matches.push({
          foundItem,
          matchScore: matchResult.score,
          confidence: matchResult.confidence,
          breakdown: matchResult.breakdown,
          matchReasons: matchResult.matchReasons,
        });
      }
    }

    // Sort by highest match score first
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: matches.length,
      lostItem: {
        _id: lostItem._id,
        title: lostItem.title,
        category: lostItem.category,
        location: lostItem.location,
        dateLost: lostItem.dateLost,
        image: lostItem.image,
      },
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get intelligent matching lost items for a given found item
 * @route   GET /api/matches/found/:foundItemId
 * @access  Public (or Private)
 */
const getMatchesForFoundItem = async (req, res, next) => {
  try {
    const { foundItemId } = req.params;
    const foundItem = await FoundItem.findById(foundItemId);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found',
      });
    }

    // Query candidate lost items that are Active or Matched
    const candidateLostItems = await LostItem.find({
      status: { $in: ['Active', 'Matched'] },
    }).populate('userId', 'name email phone avatar');

    const matches = [];

    for (const lostItem of candidateLostItems) {
      const matchResult = calculateItemMatch(lostItem, foundItem);

      if (matchResult.score >= 15) {
        matches.push({
          lostItem,
          matchScore: matchResult.score,
          confidence: matchResult.confidence,
          breakdown: matchResult.breakdown,
          matchReasons: matchResult.matchReasons,
        });
      }
    }

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: matches.length,
      foundItem: {
        _id: foundItem._id,
        title: foundItem.title,
        category: foundItem.category,
        location: foundItem.location,
        dateFound: foundItem.dateFound,
        image: foundItem.image,
      },
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatchesForLostItem,
  getMatchesForFoundItem,
};
