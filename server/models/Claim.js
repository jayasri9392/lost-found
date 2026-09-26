const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundItem',
      required: true,
      index: true,
    },
    claimantUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reporterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide the reason why this item belongs to you'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters long'],
      maxlength: [1500, 'Reason cannot exceed 1500 characters'],
    },
    proofDetails: {
      type: String,
      required: [true, 'Please provide specific proof of ownership (e.g. markings, serial number, wallpaper, passcode hint)'],
      trim: true,
      minlength: [10, 'Proof details must be at least 10 characters long'],
      maxlength: [2000, 'Proof details cannot exceed 2000 characters'],
    },
    proofImage: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    reviewerNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Reviewer notes cannot exceed 1000 characters'],
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending claims from same user for same found item
claimSchema.index({ foundItemId: 1, claimantUserId: 1, status: 1 });

module.exports = mongoose.model('Claim', claimSchema);
