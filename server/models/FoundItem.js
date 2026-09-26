const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the found item'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the found item'],
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
      required: [true, 'Please specify where you found this item'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    dateFound: {
      type: Date,
      required: [true, 'Please specify the date when the item was found'],
    },
    timeFound: {
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
    currentStorageLocation: {
      type: String,
      trim: true,
      default: 'With Finder',
      maxlength: [250, 'Storage location description is too long'],
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Returned', 'Closed'],
      default: 'Available',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    claimedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
foundItemSchema.index({
  title: 'text',
  description: 'text',
  identifyingDetails: 'text',
  location: 'text',
  subcategory: 'text',
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
