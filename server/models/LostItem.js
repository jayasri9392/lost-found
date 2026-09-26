const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the lost item'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the item'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Electronics',
          'Wallets & Bags',
          'Keys & IDs',
          'Jewelry & Watches',
          'Clothing & Accessories',
          'Documents & Cards',
          'Pets & Animals',
          'Sports & Fitness',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please specify the location where the item was lost'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    dateLost: {
      type: Date,
      required: [true, 'Please specify the date when the item was lost'],
    },
    timeLost: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    identifyingDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Identifying details cannot exceed 1000 characters'],
    },
    contactPreference: {
      type: String,
      enum: ['in_app', 'email', 'phone'],
      default: 'in_app',
    },
    contactInfo: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Matched', 'Recovered', 'Closed'],
      default: 'Active',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    matchedFoundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundItem',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
lostItemSchema.index({
  title: 'text',
  description: 'text',
  identifyingDetails: 'text',
  location: 'text',
  subcategory: 'text',
});

module.exports = mongoose.model('LostItem', lostItemSchema);
