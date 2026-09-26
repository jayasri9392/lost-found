const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Notification = require('../models/Notification');
const { calculateItemMatch } = require('../services/matchingService');

/**
 * @desc    Create a new lost item report
 * @route   POST /api/lost-items
 * @access  Private
 */
const createLostItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      location,
      city,
      dateLost,
      timeLost,
      image,
      identifyingDetails,
      contactPreference,
      contactInfo,
    } = req.body;

    if (!title || !description || !category || !location || !dateLost) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, location, and dateLost',
      });
    }

    const lostItem = await LostItem.create({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory ? subcategory.trim() : '',
      location: location.trim(),
      city: city ? city.trim() : '',
      dateLost,
      timeLost: timeLost || '',
      image: image || '',
      identifyingDetails: identifyingDetails ? identifyingDetails.trim() : '',
      contactPreference: contactPreference || 'in_app',
      contactInfo: contactInfo ? contactInfo.trim() : '',
      userId: req.user._id,
      status: 'Active',
    });

    // Check for potential existing found item matches in background and create notification if high match found
    try {
      const activeFoundItems = await FoundItem.find({
        status: { $in: ['Available', 'Claimed'] },
        category: lostItem.category,
      }).limit(20);

      let highestMatch = 0;
      let matchingItem = null;

      for (const foundItem of activeFoundItems) {
        const matchResult = calculateItemMatch(lostItem, foundItem);
        if (matchResult.score > highestMatch) {
          highestMatch = matchResult.score;
          matchingItem = foundItem;
        }
      }

      if (highestMatch >= 60 && matchingItem) {
        await Notification.create({
          userId: req.user._id,
          type: 'match',
          title: 'Potential Match Found!',
          message: `We found a potential match (${highestMatch}% confidence) for your lost item: "${lostItem.title}"`,
          relatedItemId: lostItem._id,
          relatedItemType: 'LostItem',
        });
      }
    } catch (bgError) {
      console.warn('[Matching Notification Error]:', bgError.message);
    }

    const populatedItem = await LostItem.findById(lostItem._id).populate(
      'userId',
      'name email phone avatar'
    );

    return res.status(201).json({
      success: true,
      message: 'Lost item reported successfully',
      data: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lost items (with search, category, location, status filters, and sorting)
 * @route   GET /api/lost-items
 * @access  Public
 */
const getLostItems = async (req, res, next) => {
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

    // Search filter across text index or regex fallback
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

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'date_lost_newest') {
      sortOptions = { dateLost: -1 };
    } else if (sort === 'date_lost_oldest') {
      sortOptions = { dateLost: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      LostItem.find(query)
        .populate('userId', 'name email phone avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      LostItem.countDocuments(query),
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
 * @desc    Get single lost item by ID
 * @route   GET /api/lost-items/:id
 * @access  Public
 */
const getLostItemById = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('userId', 'name email phone avatar createdAt')
      .populate('matchedFoundItemId');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found',
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
 * @desc    Get lost items reported by currently logged-in user
 * @route   GET /api/lost-items/my
 * @access  Private
 */
const getMyLostItems = async (req, res, next) => {
  try {
    const items = await LostItem.find({ userId: req.user._id })
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
 * @desc    Update a lost item
 * @route   PUT /api/lost-items/:id
 * @access  Private (Owner or Admin)
 */
const updateLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found',
      });
    }

    // Verify ownership or admin privileges
    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item report',
      });
    }

    const {
      title,
      description,
      category,
      subcategory,
      location,
      city,
      dateLost,
      timeLost,
      image,
      identifyingDetails,
      contactPreference,
      contactInfo,
      status,
    } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (subcategory !== undefined) item.subcategory = subcategory.trim();
    if (location) item.location = location.trim();
    if (city !== undefined) item.city = city.trim();
    if (dateLost) item.dateLost = dateLost;
    if (timeLost !== undefined) item.timeLost = timeLost;
    if (image !== undefined) item.image = image;
    if (identifyingDetails !== undefined) item.identifyingDetails = identifyingDetails.trim();
    if (contactPreference) item.contactPreference = contactPreference;
    if (contactInfo !== undefined) item.contactInfo = contactInfo.trim();
    if (status) item.status = status;

    const updatedItem = await item.save();
    const populated = await LostItem.findById(updatedItem._id).populate('userId', 'name email phone avatar');

    return res.status(200).json({
      success: true,
      message: 'Lost item updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lost item
 * @route   DELETE /api/lost-items/:id
 * @access  Private (Owner or Admin)
 */
const deleteLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found',
      });
    }

    // Verify ownership or admin privileges
    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item report',
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lost item report deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a lost item as recovered
 * @route   PATCH /api/lost-items/:id/recovered
 * @access  Private (Owner or Admin)
 */
const markRecovered = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found',
      });
    }

    if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    item.status = 'Recovered';
    await item.save();

    await Notification.create({
      userId: item.userId,
      type: 'item_recovered',
      title: 'Item Recovered!',
      message: `Your lost item "${item.title}" has been marked as Recovered.`,
      relatedItemId: item._id,
      relatedItemType: 'LostItem',
    });

    return res.status(200).json({
      success: true,
      message: 'Item marked as recovered successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLostItem,
  getLostItems,
  getLostItemById,
  getMyLostItems,
  updateLostItem,
  deleteLostItem,
  markRecovered,
};
