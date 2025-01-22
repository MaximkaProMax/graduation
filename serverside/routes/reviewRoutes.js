// routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/Reviews');  // Путь должен указывать на 'Reviews'
const router = express.Router();

// Маршруты для отзывов
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;