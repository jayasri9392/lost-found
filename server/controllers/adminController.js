const User = require('../models/User');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const Report = require('../models/Report');

/**
 * @desc    Get system-wide platform statistics for admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalLostItems,
      totalFoundItems,
      activeLostItems,
      recoveredLostItems,
      availableFoundItems,
      returnedFoundItems,
      totalClaims,
      pendingClaims,
      approvedClaims,
      totalReports,
      pendingReports,
      recentUsers,
      recentLost,
      recentFound,
    ] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      LostItem.countDocuments({ status: 'Active' }),
      LostItem.countDocuments({ status: 'Recovered' }),
      FoundItem.countDocuments({ status: 'Available' }),
      FoundItem.countDocuments({ status: 'Returned' }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'Pending' }),
      Claim.countDocuments({ status: 'Approved' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'Pending' }),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
      LostItem.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
      FoundItem.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          recent: recentUsers,
        },
        items: {
          totalLost: totalLostItems,
          activeLost: activeLostItems,
          recoveredLost: recoveredLostItems,
          totalFound: totalFoundItems,
          availableFound: availableFoundItems,
          returnedFound: returnedFoundItems,
          recoveryRate:
            totalLostItems + totalFoundItems > 0
              ? Math.round(((recoveredLostItems + returnedFoundItems) / (totalLostItems + totalFoundItems)) * 100)
              : 0,
        },
        claims: {
          total: totalClaims,
          pending: pendingClaims,
          approved: approvedClaims,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
        },
        recentActivity: {
          lostItems: recentLost,
          foundItems: recentFound,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user or admin',
      });
    }

    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote your own admin account',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account from admin dashboard',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Cascade delete related items optionally
    await Promise.all([
      LostItem.deleteMany({ userId: req.params.id }),
      FoundItem.deleteMany({ userId: req.params.id }),
      Claim.deleteMany({ claimantUserId: req.params.id }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'User and their related items deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lost items (admin view)
 * @route   GET /api/admin/lost-items
 * @access  Private (Admin only)
 */
const getAllLostItems = async (req, res, next) => {
  try {
    const items = await LostItem.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all found items (admin view)
 * @route   GET /api/admin/found-items
 * @access  Private (Admin only)
 */
const getAllFoundItems = async (req, res, next) => {
  try {
    const items = await FoundItem.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all claims (admin view)
 * @route   GET /api/admin/claims
 * @access  Private (Admin only)
 */
const getAllClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate('claimantUserId', 'name email')
      .populate('reporterUserId', 'name email')
      .populate('foundItemId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllLostItems,
  getAllFoundItems,
  getAllClaims,
};
