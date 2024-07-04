// routes/purchases.js

const express = require('express');
const Purchase = require('../models/Purchase');
const router = express.Router();
const Book = require('../models/Book');
const Admin = require('../models/Admin');




// Create a new purchase
// router.post('/', async (req, res) => {
//   const { userId, bookId, quantity } = req.body;

//   try {
//     const book = await Book.findById(bookId).populate('authorName');
//     const admin = await Admin.findById(userId);

//     if (!admin || !book) {
//       return res.status(404).json({ message: 'User or Book not found' });
//     }
//     if (book.copies < quantity) {
//       return res.status(400).json({ message: 'Not enough copies available' });
//     }

//     book.copies -= quantity;
//     await book.save();

//     const totalPrice = book.price * quantity;

//     const purchaseData = {
//       userId,
//       bookId,
//       bookName: book.name,
//       bookPrice: book.price,
//       authorName: book.authorName,
//       imageLink:book.imageLink,
//       quantity,
//       totalPrice,
//       purchaseDate: new Date()
//     };

//     // Save purchase to the Purchase collection
//     const purchase = new Purchase(purchaseData);
//     await purchase.save();

//     // Save purchase to the Admin collection
//     admin.purchases.push(purchaseData);
//     await admin.save();

//     res.status(201).json({ message: 'Purchase recorded successfully' });
//   } catch (error) {
//     console.error('Error recording purchase:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// Create a new purchase
router.post('/', async (req, res) => {
  const { userId, bookId, quantity,address } = req.body;

  try {
    const book = await Book.findById(bookId).populate('authorName');
    const admin = await Admin.findById(userId);

    if (!admin || !book) {
      return res.status(404).json({ message: 'User or Book not found' });
    }
    if (book.copies < quantity) {
      return res.status(400).json({ message: 'Not enough copies available' });
    }

    book.copies -= quantity;
    await book.save();

    const totalPrice = book.price * quantity;

    const purchaseData = {
      userId,
      bookId,
      bookName: book.name,
      bookPrice: book.price,
      authorName: book.authorName,
      imageLink:book.imageLink,
      quantity,
      totalPrice,
      purchaseDate: new Date(),
      address: {
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode
              }
    };

    // Save purchase to the Purchase collection
    const purchase = new Purchase(purchaseData);
    await purchase.save();

    // Save purchase to the Admin collection
    admin.purchases.push(purchaseData);
    await admin.save();

    res.status(201).json({ message: 'Purchase recorded successfully' });
  } catch (error) {
    console.error('Error recording purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Route to get total books bought for each book (remains the same)
router.get('/totals', async (req, res) => {
  try {
    const totals = await Purchase.aggregate([
      {
        $group: {
          _id: "$bookId",
          totalBooksBought: { $sum: "$quantity" }
        }
      }
    ]);

    res.status(200).json(totals);
  } catch (error) {
    console.error('Error fetching totals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all purchases with user and book details
// router.get('/', async (req, res) => {
//   try {
//     const purchases = await Purchase.find()
//       .populate('userId', 'name email')
//       .populate('bookId', 'name authorName price');

//     res.json(purchases);
//   } catch (error) {
//     console.error('Error fetching purchases:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: { $ne: null } }) // Filter out purchases where userId is null
      .populate('userId', 'username email') // Populate user details if needed
      .populate('bookId', 'name authorName price');

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: 'No purchases found' });
    }

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Route to get purchases of a particular user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const purchases = await Purchase.find({ userId })
      .populate('userId', 'name email')
      .populate('bookId', 'name authorName price');

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: 'No purchases found for the user' });
    }

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete purchases associated with the user
    await Purchase.deleteMany({ userId });

    res.json({ message: 'User and associated purchases deleted successfully' });
  } catch (error) {
    console.error('Error deleting user and purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



// // routes/purchases.js

// const express = require('express');
// const Purchase = require('../models/Purchase');
// const Admin = require('../models/Admin');
// const router = express.Router();
// const Book = require('../models/Book')


// router.post('/', async (req, res) => {
//   const { userId, bookId, quantity } = req.body;

//   try {
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (book.copies < quantity) {
//       return res.status(400).json({ message: 'Not enough copies available' });
//     }

//     book.copies -= quantity;
//     await book.save();

//     const totalPrice = book.price * quantity;

//     const purchase = {
//       userId,
//       bookId,
//       quantity,
//       totalPrice,
//       purchaseDate: new Date()
//     };

//     console.log('Purchase Object:', purchase);

//     const admin = await Admin.findById(userId);
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     admin.purchases.push(purchase);
//     await admin.save();

//     res.status(201).json({ message: 'Purchase recorded successfully' });
//   } catch (error) {
//     console.error('Error recording purchase:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // Route to get total books bought for each book (remains the same)
// router.get('/totals', async (req, res) => {
//   try {
//     const totals = await Purchase.aggregate([
//       {
//         $group: {
//           _id: "$bookId",
//           totalBooksBought: { $sum: "$quantity" }
//         }
//       }
//     ]);

//     res.status(200).json(totals);
//   } catch (error) {
//     console.error('Error fetching totals:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// module.exports = router;


// // // routes/purchases.js

// // const express = require('express');
// // const Purchase = require('../models/Purchase');
// // const router = express.Router();
// // const Book = require('../models/Book')


// // // Route to handle book purchases
// // router.post('/', async (req, res) => {
// //   const { userId, bookId, quantity } = req.body;

// //   try {
// //     const book = await Book.findById(bookId);
// //     if (!book) {
// //       return res.status(404).json({ message: 'Book not found' });
// //     }

// //     if (book.copies < quantity) {
// //       return res.status(400).json({ message: 'Not enough copies available' });
// //     }

// //     book.copies -= quantity;
// //     await book.save();
    
// //     // Create a new purchase record
// //     const purchase = new Purchase({
// //       userId,
// //       bookId,
// //       quantity,
// //       purchaseDate: new Date()
// //     });

// //     // Save the purchase record to the database
// //     await purchase.save();

// //     res.status(201).json({ message: 'Purchase recorded successfully' });
// //   } catch (error) {
// //     console.error('Error recording purchase:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // module.exports = router;
