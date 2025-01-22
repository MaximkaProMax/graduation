const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

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