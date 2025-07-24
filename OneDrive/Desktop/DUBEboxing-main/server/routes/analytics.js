const express = require('express');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');
const router = express.Router();

// Track page visit
router.post('/track', async (req, res) => {
  try {
    const { page } = req.body;
    
    if (!page) {
      return res.status(400).json({ message: 'Page parameter is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await Analytics.findOne({
      page,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (analytics) {
      analytics.visitCount += 1;
      analytics.lastVisited = new Date();
    } else {
      analytics = new Analytics({
        page,
        visitCount: 1,
        lastVisited: new Date()
      });
    }

    await analytics.save();
    res.json({ message: 'Visit tracked successfully' });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$page',
          totalVisits: { $sum: '$visitCount' },
          lastVisited: { $max: '$lastVisited' }
        }
      },
      {
        $sort: { totalVisits: -1 }
      }
    ]);

    // Get total visits across all pages
    const totalVisits = analytics.reduce((sum, item) => sum + item.totalVisits, 0);

    res.json({
      analytics,
      totalVisits,
      period: days
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily analytics (admin)
router.get('/daily', auth, async (req, res) => {
  try {
    const { days = '7' } = req.query;
    const numDays = parseInt(days);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    const dailyAnalytics = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            page: '$page',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          visits: { $sum: '$visitCount' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json(dailyAnalytics);
  } catch (error) {
    console.error('Get daily analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 