const { Router } = require('express');
const Review = require('../models/Review');
const isAuth = require('../middlewares/auth.middleware');
const router = Router();

router.get('/', isAuth, async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json(reviews);
  } catch(e) {
    res.status(500).json({message: e.message});
  }
})

router.post('/add', isAuth, async (req, res) => {
  try {
    const review = new Review(req.body);
    
    await review.save();

    res.status(201).json({message: 'Book added!'});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
})

module.exports = router;