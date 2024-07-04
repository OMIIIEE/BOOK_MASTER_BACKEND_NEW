const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Publisher = require('../models/Publisher');
const Author = require('../models/Author');
const Purchase = require('../models/Purchase');


// POST route to add a new book
// router.post('/', async (req, res) => {
//   try {
//     const { name, authorName, publisherName, publishDate, copies, price, imageLink } = req.body;

//     // Find or create publisher
//     let publisher = await Publisher.findOne({ name: publisherName });

//     if (!publisher) {
//       // If publisher doesn't exist, create a new one
//       publisher = new Publisher({ name: publisherName });
//       await publisher.save();
//     }

//     // Find or create author
//     let author = await Author.findOne({ name: authorName, publisher: publisher._id });

//     if (!author) {
//       // If author doesn't exist, create a new one
//       author = new Author({ name: authorName, publisher: publisher._id });
//       await author.save();
//     }

//     // Create new book under the found/created author
//     const newBook = new Book({
//       name,
//       authorName: author._id,
//       publisherName: publisher._id,
//       publishDate,
//       copies,
//       price,
//       imageLink
//     });

//     await newBook.save();

//     // Update author's books list
//     if (!author.books.includes(newBook._id)) {
//       author.books.push(newBook._id);
//       await author.save();
//     }

//     // Update publisher's authors list
//     if (!publisher.authors.includes(author._id)) {
//       publisher.authors.push(author._id);
//       await publisher.save();
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Book Added Successfully',
//       book: newBook,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Failed to add book',
//       success: false,
//     });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { name, authorName, publisherName, publishDate, copies, price, imageLink,summary,category } = req.body;

    // Check if the book with the same name, author, and publisher already exists
    let existingBook = await Book.findOne({ name, authorName, publisherName });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with the same name, author, and publisher already exists'
      });
    }

    // Create a new book entry
    const newBook = new Book({
      name,
      authorName,
      publisherName,
      publishDate,
      copies,
      price,
      imageLink,
      summary,
      category
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book Added Successfully',
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to add book',
      success: false,
    });
  }
});



  

//   try {
//     // Fetch all publishers with authors and books populated
//     const publishers = await Publisher.find({})
//       .populate({
//         path: 'authors',
//         populate: {
//           path: 'books'
//         }
//       });

//  // Aggregate total books bought for each book
//  const totals = await Purchase.aggregate([
//   {
//     $group: {
//       _id: "$bookId",
//       totalBooksBought: { $sum: "$quantity" }
//     }
//   }
// ]);

// // Create a map of bookId to totalBooksBought
// const totalBooksBoughtMap = {};
// totals.forEach(total => {
//   totalBooksBoughtMap[total._id] = total.totalBooksBought;
// });

// // Add totalBought property to each book
// publishers.forEach(publisher => {
//   publisher.authors.forEach(author => {
//     author.books.forEach(book => {
//       book.totalBought = totalBooksBoughtMap[book._id] || 0; // Default to 0 if no purchases
//     });
//   });
// });

//     res.status(200).json({
//       success: true,
//       message: 'Publishers retrieved successfully',
//       publishers: publishers
//     });
//   } catch (error) {
//     console.error('Error fetching publishers:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve publishers'
//     });
//   }
// });



router.get('/publishers', async (req, res) => {
  try {
    const publishers = await Book.aggregate([
      {
        $group: {
          _id: {
            publisherName: "$publisherName",
            authorName: "$authorName"
          },
          books: {
            $push: {
              _id: "$_id",
              name: "$name",
              publishDate: "$publishDate",
              copies: "$copies",
              price: "$price",
              imageLink: "$imageLink",category:"$category"
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.publisherName",
          authors: {
            $push: {
              _id: "$_id.authorName",
              books: "$books"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          publisherName: "$_id",
          authors: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Publishers retrieved successfully',
      publishers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to retrieve publishers',
      success: false,
    });
  }
});


  // GET route to fetch all books
// router.get('/book', async (req, res) => {
//   try {
//     const books = await Book.find({})
//         .populate('authorName', 'name') // Populate author field with only 'name'
//         .populate('publisherName', 'name'); // Populate publisher field with only 'name'

//     res.status(200).json({
//         success: true,
//         message: 'Books retrieved successfully',
//         books: books
//     });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({
//         success: false,
//         message: 'Failed to retrieve books'
//     });
// }
// });

router.get('/book', async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('authorName', 'name') // Populate author field with only 'name'
      .populate('publisherName', 'name'); // Populate publisher field with only 'name'

    // Aggregate purchase data to get the total quantity bought for each book
    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: '$bookId',
          totalBought: { $sum: '$quantity' }
        }
      }
    ]);

    // Convert purchases array to a map for easy lookup
    const purchasesMap = {};
    purchases.forEach(purchase => {
      purchasesMap[purchase._id] = purchase.totalBought;
    });

    // Add the purchase data to each book
    const booksWithPurchaseInfo = books.map(book => {
      const totalBought = purchasesMap[book._id] || 0;
      const totalAvailable = book.copies;
      const totalBooks = totalBought + totalAvailable;

      return {
        ...book._doc,
        totalBooks,
        totalAvailable,
        totalBought
      };
    });

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      books: booksWithPurchaseInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve books'
    });
  }
});


// PUT route to update a book

// Update a book
router.put('/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const updates = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updates },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Assuming you need to update the book under the author and publisher as well
    // Update the book under author
    // Example assuming Book model has author field with authorId
    // Update the book under publisher
    // Example assuming Book model has publisher field with publisherId

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



// DELETE route to delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the book to be deleted
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    const authorId = book.authorName;
    const publisherId = book.publisherName;

    // Delete the book
    await Book.findByIdAndDelete(id);

    // Check if the author has any other books
    const authorBooksCount = await Book.countDocuments({ authorName: authorId });
    if (authorBooksCount === 0) {
      // If no other books by this author, delete the author
      await Author.findByIdAndDelete(authorId);

      // Check if the publisher has any other authors
      const publisherAuthorsCount = await Author.countDocuments({ publisher: publisherId });
      if (publisherAuthorsCount === 0) {
        // If no other authors by this publisher, delete the publisher
        await Publisher.findByIdAndDelete(publisherId);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
    });
  }
});

// DELETE route to delete a publisher and all related authors and books
router.delete('/publisher/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the publisher
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found',
      });
    }

    // Find all authors related to the publisher
    const authors = await Author.find({ publisher: id });

    // Loop through each author to delete their books
    for (const author of authors) {
      await Book.deleteMany({ authorName: author._id });
    }

    // Delete all authors related to the publisher
    await Author.deleteMany({ publisher: id });

    // Delete the publisher
    await Publisher.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Publisher and related authors and books deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete publisher',
    });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Book = require('../models/Book');
// const Publisher = require('../models/Publisher');
// const Author = require('../models/Author');
// const Purchase = require('../models/Purchase');

// // // POST route to add a new book
// // router.post('/', async (req, res) => {
 

// //   try {
// //     const { name, authorName, publisherName, publishDate, copies, price, imageLink } = req.body;

// //     // Find or create publisher
// //     let publisher = await Publisher.findOne({ name: publisherName });

// //     if (!publisher) {
// //       // If publisher doesn't exist, create a new one
// //       publisher = new Publisher({ name: publisherName });
// //       await publisher.save();
// //     }

// //     // Find or create author under the found/created publisher
// //     let author = await Author.findOne({ name: authorName, publisher: publisher._id });

// //     if (!author) {
// //       // If author doesn't exist under this publisher, create a new one
// //       author = new Author({ name: authorName, publisher: publisher._id });
// //       await author.save();
// //     }

// //     // Create new book under the found/created author
// //     const newBook = new Book({
// //         name,
// //         authorName:author._id,
// //         publisherName:publisher._id,
// //         publishDate,
// //         copies,
// //         price,
// //         imageLink
// //     });

// //     await newBook.save();

// //      // Update author's and publisher's references
// //      author.books.push(newBook._id);
// //      await author.save();

// //      publisher.authors.push(author._id);
// //      await publisher.save();


// //     res.status(201).json({
// //       success: true,
// //       message: 'Book Added Successfully',
// //       book: newBook,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: 'Failed to add book',
// //       success: false,
// //     });
// //   }
// // });

// // POST route to add a new book
// router.post('/', async (req, res) => {
//   try {
//     const { name, authorName, publisherName, publishDate, copies, price, imageLink ,summary} = req.body;

//     // Find or create publisher
//     let publisher = await Publisher.findOne({ name: publisherName });

//     if (!publisher) {
//       // If publisher doesn't exist, create a new one
//       publisher = new Publisher({ name: publisherName });
//       await publisher.save();
//     }

//     // Find or create author
//     let author = await Author.findOne({ name: authorName, publisher: publisher._id });

//     if (!author) {
//       // If author doesn't exist, create a new one
//       author = new Author({ name: authorName, publisher: publisher._id });
//       await author.save();
//     }

//     // Create new book under the found/created author
//     const newBook = new Book({
//       name,
//       authorName: author._id,
//       publisherName: publisher._id,
//       publishDate,
//       copies,
//       price,
//       imageLink,
//       summary
//     });

//     await newBook.save();

//     // Update author's books list
//     if (!author.books.includes(newBook._id)) {
//       author.books.push(newBook._id);
//       await author.save();
//     }

//     // Update publisher's authors list
//     if (!publisher.authors.includes(author._id)) {
//       publisher.authors.push(author._id);
//       await publisher.save();
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Book Added Successfully',
//       book: newBook,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Failed to add book',
//       success: false,
//     });
//   }
// });

// // GET route to fetch all books with authors and publishers populated
// // router.get('/', async (req, res) => {
// //     try {
// //       const publishers = await Publisher.find({})
// //         .populate({
// //           path: 'authors',
// //           populate: {
// //             path: 'books'
// //           }
// //         });
  
// //       res.status(200).json({
// //         success: true,
// //         message: 'Publishers retrieved successfully',
// //         publishers: publishers
// //       });
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).json({
// //         success: false,
// //         message: 'Failed to retrieve publishers'
// //       });
// //     }
// //   });
  
// router.get('/', async (req, res) => {
//   try {
//     // Fetch all publishers with authors and books populated
//     const publishers = await Publisher.find({})
//       .populate({
//         path: 'authors',
//         populate: {
//           path: 'books'
//         }
//       });

//  // Aggregate total books bought for each book
//  const totals = await Purchase.aggregate([
//   {
//     $group: {
//       _id: "$bookId",
//       totalBooksBought: { $sum: "$quantity" }
//     }
//   }
// ]);

// // Create a map of bookId to totalBooksBought
// const totalBooksBoughtMap = {};
// totals.forEach(total => {
//   totalBooksBoughtMap[total._id] = total.totalBooksBought;
// });

// // Add totalBought property to each book
// publishers.forEach(publisher => {
//   publisher.authors.forEach(author => {
//     author.books.forEach(book => {
//       book.totalBought = totalBooksBoughtMap[book._id] || 0; // Default to 0 if no purchases
//     });
//   });
// });

//     res.status(200).json({
//       success: true,
//       message: 'Publishers retrieved successfully',
//       publishers: publishers
//     });
//   } catch (error) {
//     console.error('Error fetching publishers:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve publishers'
//     });
//   }
// });






//   // GET route to fetch all books
// // router.get('/book', async (req, res) => {
// //   try {
// //     const books = await Book.find({})
// //         .populate('authorName', 'name') // Populate author field with only 'name'
// //         .populate('publisherName', 'name'); // Populate publisher field with only 'name'

// //     res.status(200).json({
// //         success: true,
// //         message: 'Books retrieved successfully',
// //         books: books
// //     });
// // } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //         success: false,
// //         message: 'Failed to retrieve books'
// //     });
// // }
// // });

// router.get('/book', async (req, res) => {
//   try {
//     const books = await Book.find({})
//       .populate('authorName', 'name') // Populate author field with only 'name'
//       .populate('publisherName', 'name'); // Populate publisher field with only 'name'

//     // Aggregate purchase data to get the total quantity bought for each book
//     const purchases = await Purchase.aggregate([
//       {
//         $group: {
//           _id: '$bookId',
//           totalBought: { $sum: '$quantity' }
//         }
//       }
//     ]);

//     // Convert purchases array to a map for easy lookup
//     const purchasesMap = {};
//     purchases.forEach(purchase => {
//       purchasesMap[purchase._id] = purchase.totalBought;
//     });

//     // Add the purchase data to each book
//     const booksWithPurchaseInfo = books.map(book => {
//       const totalBought = purchasesMap[book._id] || 0;
//       const totalAvailable = book.copies;
//       const totalBooks = totalBought + totalAvailable;

//       return {
//         ...book._doc,
//         totalBooks,
//         totalAvailable,
//         totalBought
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Books retrieved successfully',
//       books: booksWithPurchaseInfo
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve books'
//     });
//   }
// });


// // PUT route to update a book

// // Update a book
// router.put('/:bookId', async (req, res) => {
//   const { bookId } = req.params;
//   const updates = req.body;

//   try {
//     const updatedBook = await Book.findByIdAndUpdate(
//       bookId,
//       { $set: updates },
//       { new: true }
//     );

//     if (!updatedBook) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     // Assuming you need to update the book under the author and publisher as well
//     // Update the book under author
//     // Example assuming Book model has author field with authorId
//     // Update the book under publisher
//     // Example assuming Book model has publisher field with publisherId

//     res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
//   } catch (error) {
//     console.error('Error updating book:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;



// // DELETE route to delete a book
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the book to be deleted
//     const book = await Book.findById(id);
//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found',
//       });
//     }

//     const authorId = book.authorName;
//     const publisherId = book.publisherName;

//     // Delete the book
//     await Book.findByIdAndDelete(id);

//     // Check if the author has any other books
//     const authorBooksCount = await Book.countDocuments({ authorName: authorId });
//     if (authorBooksCount === 0) {
//       // If no other books by this author, delete the author
//       await Author.findByIdAndDelete(authorId);

//       // Check if the publisher has any other authors
//       const publisherAuthorsCount = await Author.countDocuments({ publisher: publisherId });
//       if (publisherAuthorsCount === 0) {
//         // If no other authors by this publisher, delete the publisher
//         await Publisher.findByIdAndDelete(publisherId);
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Book deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting book:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete book',
//     });
//   }
// });

// // DELETE route to delete a publisher and all related authors and books
// router.delete('/publisher/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the publisher
//     const publisher = await Publisher.findById(id);
//     if (!publisher) {
//       return res.status(404).json({
//         success: false,
//         message: 'Publisher not found',
//       });
//     }

//     // Find all authors related to the publisher
//     const authors = await Author.find({ publisher: id });

//     // Loop through each author to delete their books
//     for (const author of authors) {
//       await Book.deleteMany({ authorName: author._id });
//     }

//     // Delete all authors related to the publisher
//     await Author.deleteMany({ publisher: id });

//     // Delete the publisher
//     await Publisher.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: 'Publisher and related authors and books deleted successfully',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete publisher',
//     });
//   }
// });

// module.exports = router;
