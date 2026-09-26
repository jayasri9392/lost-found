const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');
const { calculateItemMatch } = require('../services/matchingService');

/**
 * @desc    Get user's personalized dashboard summary
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      myLostItems,
      myFoundItems,
      myClaimsSent,
      myClaimsReceived,
      unreadNotifications,
    ] = await Promise.all([
      LostItem.find({ userId }).sort({ createdAt: -1 }),
      FoundItem.find({ userId }).sort({ createdAt: -1 }),
      Claim.find({ claimantUserId: userId }).populate('foundItemId').sort({ createdAt: -1 }),
      Claim.find({ reporterUserId: userId }).populate('foundItemId').populate('claimantUserId', 'name email').sort({ createdAt: -1 }),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    const activeLost = myLostItems.filter((i) => i.status === 'Active');
    const recoveredLost = myLostItems.filter((i) => i.status === 'Recovered');
    const availableFound = myFoundItems.filter((i) => i.status === 'Available');
    const returnedFound = myFoundItems.filter((i) => i.status === 'Returned');

    // Calculate potential matches for user's active lost items
    let potentialMatchesCount = 0;
    const topMatches = [];

    if (activeLost.length > 0) {
      const candidateFoundItems = await FoundItem.find({
        status: { $in: ['Available', 'Claimed'] },
      }).limit(50);

      for (const lostItem of activeLost) {
        for (const foundItem of candidateFoundItems) {
          const matchResult = calculateItemMatch(lostItem, foundItem);
          if (matchResult.score >= 50) {
            potentialMatchesCount++;
            if (topMatches.length < 5) {
              topMatches.push({
                lostItem: {
                  _id: lostItem._id,
                  title: lostItem.title,
                  category: lostItem.category,
                },
                foundItem: {
                  _id: foundItem._id,
                  title: foundItem.title,
                  category: foundItem.category,
                  location: foundItem.location,
                  dateFound: foundItem.dateFound,
                  image: foundItem.image,
                },
                matchScore: matchResult.score,
                confidence: matchResult.confidence,
                matchReasons: matchResult.matchReasons,
              });
            }
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          totalLost: myLostItems.length,
          activeLost: activeLost.length,
          recoveredLost: recoveredLost.length,
          totalFound: myFoundItems.length,
          availableFound: availableFound.length,
          returnedFound: returnedFound.length,
          claimsSent: myClaimsSent.length,
          claimsReceived: myClaimsReceived.length,
          pendingClaimsSent: myClaimsSent.filter((c) => c.status === 'Pending').length,
          pendingClaimsReceived: myClaimsReceived.filter((c) => c.status === 'Pending').length,
          unreadNotifications,
          potentialMatches: potentialMatchesCount,
        },
        recentLost: myLostItems.slice(0, 4),
        recentFound: myFoundItems.slice(0, 4),
        recentClaimsSent: myClaimsSent.slice(0, 4),
        recentClaimsReceived: myClaimsReceived.slice(0, 4),
        topMatches,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
