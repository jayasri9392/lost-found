const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const Notification = require('../models/Notification');
const { calculateItemMatch } = require('../services/matchingService');

/**
 * @desc    Create a new found item report
 * @route   POST /api/found-items
 * @access  Private
 */
const createFoundItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      location,
      city,
      dateFound,
      timeFound,
      image,
      identifyingDetails,
      currentStorageLocation,
    } = req.body;

    if (!title || !description || !category || !location || !dateFound) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, location, and dateFound',
      });
    }

    const foundItem = await FoundItem.create({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory ? subcategory.trim() : '',
      location: location.trim(),
      city: city ? city.trim() : '',
      dateFound,
      timeFound: timeFound || '',
      image: image || '',
      identifyingDetails: identifyingDetails ? identifyingDetails.trim() : '',
      currentStorageLocation: currentStorageLocation ? currentStorageLocation.trim() : 'With Finder',
      userId: req.user._id,
      status: 'Available',
    });

    // Check for potential existing lost item matches and notify users who lost matching items
    try {
      const activeLostItems = await LostItem.find({
        status: 'Active',
        category: foundItem.category,
      }).limit(20);

      for (const lostItem of activeLostItems) {
        const matchResult = calculateItemMatch(lostItem, foundItem);
        if (matchResult.score >= 60) {
          await Notification.create({
            userId: lostItem.userId,
            type: 'match',
            title: 'New Matching Found Item Reported!',
            message: `A found item "${foundItem.title}" has a ${matchResult.score}% match with your reported lost item "${lostItem.title}".`,
            relatedItemId: foundItem._id,
            relatedItemType: 'FoundItem',
          });
        }
      }
    } catch (bgError) {
      console.warn('[Matching Notification Error]:', bgError.message);
    }

    const populated = await FoundItem.findById(foundItem._id).populate(
      'userId',
      'name email phone avatar'
    );

    return res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all found items (with search, category, location, status filters, and sorting)
 * @route   GET /api/found-items
 * @access  Public
 */
const getFoundItems = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      status,
      city,
      location,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (keyword && keyword.trim()) {
      query.$text = { $search: keyword.trim() };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (city && city.trim()) {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'date_found_newest') {
      sortOptions = { dateFound: -1 };
    } else if (sort === 'date_found_oldest') {
      sortOptions = { dateFound: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      FoundItem.find(query)
        .populate('userId', 'name email phone avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      FoundItem.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single found item by ID
 * @route   GET /api/found-items/:id
 * @access  Public
 */
const getFoundItemById = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id)
      .populate('userId', 'name email phone avatar createdAt')
      .populate('claimedByUserId', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get found items reported by currently logged-in user
 * @route   GET /api/found-items/my
 * @access  Private
 */
const getMyFoundItems = async (req, res, next) => {
  try {
    const items = await FoundItem.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

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
 * @desc    Update a found item
 * @route   PUT /api/found-items/:id
 * @access  Private (Owner or Admin)
 */
const updateFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found',
      });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this found item report',
      });
    }

    const {
      title,
      description,
      category,
      subcategory,
      location,
      city,
      dateFound,
      timeFound,
      image,
      identifyingDetails,
      currentStorageLocation,
      status,
    } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (subcategory !== undefined) item.subcategory = subcategory.trim();
    if (location) item.location = location.trim();
    if (city !== undefined) item.city = city.trim();
    if (dateFound) item.dateFound = dateFound;
    if (timeFound !== undefined) item.timeFound = timeFound;
    if (image !== undefined) item.image = image;
    if (identifyingDetails !== undefined) item.identifyingDetails = identifyingDetails.trim();
    if (currentStorageLocation !== undefined) item.currentStorageLocation = currentStorageLocation.trim();
    if (status) item.status = status;

    const updatedItem = await item.save();
    const populated = await FoundItem.findById(updatedItem._id).populate('userId', 'name email phone avatar');

    return res.status(200).json({
      success: true,
      message: 'Found item updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a found item
 * @route   DELETE /api/found-items/:id
 * @access  Private (Owner or Admin)
 */
const deleteFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found',
      });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this found item report',
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Found item report deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a found item as returned to owner
 * @route   PATCH /api/found-items/:id/returned
 * @access  Private (Owner or Admin)
 */
const markReturned = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found',
      });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    item.status = 'Returned';
    await item.save();

    await Notification.create({
      userId: item.userId,
      type: 'item_returned',
      title: 'Item Returned!',
      message: `Your found item "${item.title}" has been marked as Returned. Thank you for your honesty!`,
      relatedItemId: item._id,
      relatedItemType: 'FoundItem',
    });

    return res.status(200).json({
      success: true,
      message: 'Found item marked as returned to owner',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
  markReturned,
};
