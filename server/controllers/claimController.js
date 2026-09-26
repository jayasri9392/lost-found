const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');
const Notification = require('../models/Notification');

/**
 * @desc    Submit a claim for a found item
 * @route   POST /api/claims
 * @access  Private
 */
const createClaim = async (req, res, next) => {
  try {
    const { foundItemId, reason, proofDetails, proofImage, contactPhone } = req.body;

    if (!foundItemId || !reason || !proofDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: foundItemId, reason, and proofDetails',
      });
    }

    const foundItem = await FoundItem.findById(foundItemId);
    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item does not exist',
      });
    }

    // Do not allow users to claim an item they themselves reported finding
    if (foundItem.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a claim on an item that you reported finding.',
      });
    }

    // Check if item is already returned or closed
    if (foundItem.status === 'Returned' || foundItem.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: `This item is already marked as ${foundItem.status} and cannot be claimed.`,
      });
    }

    // Prevent duplicate pending claims by the same claimant
    const existingClaim = await Claim.findOne({
      foundItemId,
      claimantUserId: req.user._id,
      status: 'Pending',
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending claim for this item. Please await review.',
      });
    }

    const claim = await Claim.create({
      foundItemId,
      claimantUserId: req.user._id,
      reporterUserId: foundItem.userId,
      reason: reason.trim(),
      proofDetails: proofDetails.trim(),
      proofImage: proofImage || '',
      contactPhone: contactPhone ? contactPhone.trim() : '',
      status: 'Pending',
    });

    // Notify the finder
    await Notification.create({
      userId: foundItem.userId,
      type: 'claim_submitted',
      title: 'New Claim Received',
      message: `A user has submitted a verification claim for your found item: "${foundItem.title}".`,
      relatedItemId: foundItem._id,
      relatedItemType: 'FoundItem',
      relatedClaimId: claim._id,
    });

    const populatedClaim = await Claim.findById(claim._id)
      .populate('claimantUserId', 'name email phone avatar')
      .populate('foundItemId');

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. The finder has been notified.',
      data: populatedClaim,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get claims submitted by current user
 * @route   GET /api/claims/my
 * @access  Private
 */
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimantUserId: req.user._id })
      .populate('foundItemId')
      .populate('reporterUserId', 'name email phone')
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

/**
 * @desc    Get claims received for found items reported by current user
 * @route   GET /api/claims/received
 * @access  Private
 */
const getReceivedClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ reporterUserId: req.user._id })
      .populate('foundItemId')
      .populate('claimantUserId', 'name email phone avatar')
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

/**
 * @desc    Get claim by ID
 * @route   GET /api/claims/:id
 * @access  Private (Claimant, Reporter, or Admin)
 */
const getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('foundItemId')
      .populate('claimantUserId', 'name email phone avatar')
      .populate('reporterUserId', 'name email phone avatar');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    const isClaimant = claim.claimantUserId._id.toString() === req.user._id.toString();
    const isReporter = claim.reporterUserId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isClaimant && !isReporter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim',
      });
    }

    return res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or Reject a claim
 * @route   PATCH /api/claims/:id/status
 * @access  Private (Finder/Reporter or Admin)
 */
const updateClaimStatus = async (req, res, next) => {
  try {
    const { status, reviewerNotes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be "Approved" or "Rejected"',
      });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Reporter or Admin authorization
    const isReporter = claim.reporterUserId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the finder or an admin can review this claim',
      });
    }

    // Do not allow users to approve their own claim (even if admin)
    if (claim.claimantUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot approve your own claim.',
      });
    }

    claim.status = status;
    claim.reviewerNotes = reviewerNotes ? reviewerNotes.trim() : '';
    claim.reviewedAt = new Date();
    await claim.save();

    const foundItem = await FoundItem.findById(claim.foundItemId);

    if (status === 'Approved') {
      if (foundItem) {
        foundItem.status = 'Claimed';
        foundItem.claimedByUserId = claim.claimantUserId;
        await foundItem.save();

        // Reject other pending claims for this item
        await Claim.updateMany(
          {
            foundItemId: claim.foundItemId,
            _id: { $ne: claim._id },
            status: 'Pending',
          },
          {
            status: 'Rejected',
            reviewerNotes: 'Item was approved for another claimant.',
            reviewedAt: new Date(),
          }
        );
      }

      // Notify claimant of approval
      await Notification.create({
        userId: claim.claimantUserId,
        type: 'claim_approved',
        title: 'Claim Approved! 🎉',
        message: `Your claim for "${foundItem?.title || 'the item'}" has been APPROVED. You can now coordinate handover.`,
        relatedItemId: claim.foundItemId,
        relatedItemType: 'FoundItem',
        relatedClaimId: claim._id,
      });
    } else if (status === 'Rejected') {
      // Notify claimant of rejection
      await Notification.create({
        userId: claim.claimantUserId,
        type: 'claim_rejected',
        title: 'Claim Update: Rejected',
        message: `Your claim for "${foundItem?.title || 'the item'}" was reviewed and declined. ${
          reviewerNotes ? `Reason: ${reviewerNotes}` : ''
        }`,
        relatedItemId: claim.foundItemId,
        relatedItemType: 'FoundItem',
        relatedClaimId: claim._id,
      });
    }

    const updatedClaim = await Claim.findById(claim._id)
      .populate('claimantUserId', 'name email phone avatar')
      .populate('foundItemId');

    return res.status(200).json({
      success: true,
      message: `Claim has been ${status.toLowerCase()} successfully`,
      data: updatedClaim,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a claim submitted by current user
 * @route   PATCH /api/claims/:id/cancel
 * @access  Private (Claimant only)
 */
const cancelClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (claim.claimantUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own claims',
      });
    }

    if (claim.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a claim that is already ${claim.status}`,
      });
    }

    claim.status = 'Cancelled';
    await claim.save();

    return res.status(200).json({
      success: true,
      message: 'Claim cancelled successfully',
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimById,
  updateClaimStatus,
  cancelClaim,
};
