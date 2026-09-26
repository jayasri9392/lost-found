const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

/**
 * @desc    Unified search across lost and found items with multi-parameter filtering
 * @route   GET /api/search
 * @access  Public
 */
const searchAllItems = async (req, res, next) => {
  try {
    const {
      keyword = '',
      type = 'all', // 'all', 'lost', 'found'
      category = 'All',
      status = 'All',
      city = '',
      location = '',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const buildQuery = (isLost) => {
      const q = {};

      if (keyword.trim()) {
        const regex = new RegExp(keyword.trim(), 'i');
        q.$or = [
          { title: regex },
          { description: regex },
          { identifyingDetails: regex },
          { location: regex },
          { subcategory: regex },
        ];
      }

      if (category && category !== 'All') {
        q.category = category;
      }

      if (status && status !== 'All') {
        q.status = status;
      }

      if (city.trim()) {
        q.city = { $regex: city.trim(), $options: 'i' };
      }

      if (location.trim()) {
        q.location = { $regex: location.trim(), $options: 'i' };
      }

      return q;
    };

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    let items = [];
    let total = 0;

    if (type === 'lost') {
      const lostQuery = buildQuery(true);
      const [data, count] = await Promise.all([
        LostItem.find(lostQuery)
          .populate('userId', 'name email phone avatar')
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        LostItem.countDocuments(lostQuery),
      ]);
      items = data.map((d) => ({ ...d, itemType: 'lost' }));
      total = count;
    } else if (type === 'found') {
      const foundQuery = buildQuery(false);
      const [data, count] = await Promise.all([
        FoundItem.find(foundQuery)
          .populate('userId', 'name email phone avatar')
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        FoundItem.countDocuments(foundQuery),
      ]);
      items = data.map((d) => ({ ...d, itemType: 'found' }));
      total = count;
    } else {
      // 'all': fetch from both collections
      const lostQuery = buildQuery(true);
      const foundQuery = buildQuery(false);

      const [lostData, lostCount, foundData, foundCount] = await Promise.all([
        LostItem.find(lostQuery)
          .populate('userId', 'name email phone avatar')
          .sort(sortObj)
          .limit(50)
          .lean(),
        LostItem.countDocuments(lostQuery),
        FoundItem.find(foundQuery)
          .populate('userId', 'name email phone avatar')
          .sort(sortObj)
          .limit(50)
          .lean(),
        FoundItem.countDocuments(foundQuery),
      ]);

      const merged = [
        ...lostData.map((d) => ({ ...d, itemType: 'lost' })),
        ...foundData.map((d) => ({ ...d, itemType: 'found' })),
      ];

      merged.sort((a, b) => {
        if (sort === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      total = lostCount + foundCount;
      items = merged.slice(skip, skip + limitNum);
    }

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

module.exports = {
  searchAllItems,
};
