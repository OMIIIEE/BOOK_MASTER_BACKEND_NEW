const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Get wishlist for a user
router.get('/:userId', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.userId).populate('wishlist');
    if (!admin) {
      console.log(`Admin not found for userId: ${req.params.userId}`);
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ wishlist: admin.wishlist });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update wishlist for a user
router.post('/', async (req, res) => {
  const { userId, books } = req.body;
  console.log(`Received userId: ${userId} and books: ${books}`);
  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      console.log(`Admin not found for userId: ${userId}`);
      return res.status(404).json({ error: 'Admin not found' });
    }
    admin.wishlist = books;
    await admin.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// // routes/wishlist.js
// const express = require('express');
// const router = express.Router();
// const Wishlist = require('../models/Wishlist');

// // Get wishlist for a user
// router.get('/:userId', async (req, res) => {
//   try {
//     const wishlist = await Wishlist.findOne({ userId: req.params.userId });
//     res.json({ wishlist: wishlist ? wishlist.books : [] });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update wishlist for a user
// router.post('/', async (req, res) => {
//   const { userId, books } = req.body;
//   try {
//     let wishlist = await Wishlist.findOne({ userId });
//     if (wishlist) {
//       wishlist.books = books;
//     } else {
//       wishlist = new Wishlist({ userId, books });
//     }
//     await wishlist.save();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
