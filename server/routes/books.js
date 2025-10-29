const express = require('express');
const Book = require('../models/Book');
const { getBookRecommendations } = require('../utils/gemini');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } }
    ]
  }).select('title author status');
  res.json(books);
});

router.get('/recommend', async (req, res) => {
  const recs = await getBookRecommendations(req.query.interests);
  res.json(recs);
});
// GET /api/books/recommend?interests=...
router.get('/recommend', async (req, res) => {
  const { interests } = req.query;
  if (!interests || typeof interests !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "interests" query parameter' });
  }

  try {
    const recommendations = await getBookRecommendations(interests);
    res.json(recommendations);
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});
module.exports = router;
