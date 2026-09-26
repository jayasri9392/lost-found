const Report = require('../models/Report');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

/**
 * @desc    Submit a report for an inappropriate or fraudulent listing
 * @route   POST /api/reports
 * @access  Private
 */
const createReport = async (req, res, next) => {
  try {
    const { reportedItemType, reportedItemId, reason, description } = req.body;

    if (!reportedItemType || !reportedItemId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: reportedItemType, reportedItemId, reason, and description',
      });
    }

    if (!['LostItem', 'FoundItem'].includes(reportedItemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type. Must be LostItem or FoundItem',
      });
    }

    // Verify item exists
    let itemExists = null;
    if (reportedItemType === 'LostItem') {
      itemExists = await LostItem.findById(reportedItemId);
    } else {
      itemExists = await FoundItem.findById(reportedItemId);
    }

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'The item being reported does not exist',
      });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reportedItemType,
      reportedItemId,
      reason,
      description: description.trim(),
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our moderation team will review it.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Private (Admin only)
 */
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status and admin notes
 * @route   PATCH /api/reports/:id
 * @access  Private (Admin only)
 */
const updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes.trim();

    await report.save();

    return res.status(200).json({
      success: true,
      message: 'Report updated',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  updateReport,
};
