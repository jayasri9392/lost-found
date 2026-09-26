const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'match',
        'claim_submitted',
        'claim_approved',
        'claim_rejected',
        'item_returned',
        'item_recovered',
        'report_update',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedItemType: {
      type: String,
      enum: ['LostItem', 'FoundItem', 'Claim', 'Report', 'none'],
      default: 'none',
    },
    relatedClaimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
