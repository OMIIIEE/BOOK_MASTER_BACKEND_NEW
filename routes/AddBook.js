// const express = require("express");
// const Book = require("../models/Book")
// const Purchase = require("../models/Purchase")
// const { auth, admin } = require("../middleware/auth");
// const router = express.Router();

// // Add book route
// router.post("/", auth, async (req, res) => {
//   try {
//     const { name, author, publisher, publishDate, copies,price, imageLink } = req.body;
//     const newBook = new Book({
//       name,
//       author,
//       publisher,
//       publishDate,
//       copies,
//       price,
//       imageLink,
//     });
//     await newBook.save();

//     res.status(201).json({
//       success: true,
//       message: "Book Added Successfully",
//       book: newBook,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// });

// // Get all books
// router.get("/", auth, async (req, res) => {
//   try {
//     const books = await Book.find({}).lean();
//     const purchases = await Purchase.find().populate('userId').lean();

//     // Map through books and add purchase details
//     const booksWithPurchaseDetails = books.map(book => {
//       const bookPurchases = purchases.filter(purchase => purchase.bookId.toString() === book._id.toString());
//       const totalBought = bookPurchases.reduce((acc, purchase) => acc + purchase.quantity, 0);
//         // Calculate total available copies after purchases
//         const totalAvailable = book.copies;

//         // Fetch original copies from the database
//         const originalCopies = book.copies+totalBought;
//       const userPurchases = bookPurchases.map(purchase => ({
//         user: purchase.userId.name,
//         quantity: purchase.quantity,
//       }));

//       return {
//         ...book,
//         // copies:totalAvailable+totalBought,
//         originalCopies,
//         totalAvailable,
//         totalBought,
//         userPurchases,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: "Successfully Found",
//       books: booksWithPurchaseDetails,
//     });
//   } catch (err) {
//     res.status(404).json({ success: false, message: "Failed to find. Try again" });
//   }
// });

// // Get book by id
// router.get("/:id", auth, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const book = await Book.findById(id).lean();
//     if (!book) {
//       return res.status(404).json({ success: false, message: "Book not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Successfully Found",
//       book: book,
//     });
//   } catch (err) {
//     res.status(404).json({ success: false, message: "Failed to find. Try again" });
//   }
// });

// // // Update book
// // router.put("/:id", auth,  async (req, res) => {
// //   const { id } = req.params;

// //   try {
// //     const updatedBook = await Book.findByIdAndUpdate(
// //       id,
// //       { $set: req.body },
// //       { new: true }
// //     );
// //     if (!updatedBook) {
// //       return res.status(404).json({ success: false, message: "Book not found" });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: "Successfully Updated",
// //       data: updatedBook,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Failed to update. Try again" });
// //   }
// // });

// // Update book
// router.put('/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const updatedBook = await Book.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { copies: req.body.copies },
//       { new: true }
//     );

//     if (!updatedBook) {
//       return res.status(404).json({ success: false, message: 'Book not found' });
//     }

//     // Calculate total available based on updated copies and total bought
//     const totalBought = updatedBook.totalBought || 0;
//     const totalAvailable = updatedBook.copies - totalBought;

     

//     res.status(200).json({
//       success: true,
//       message: 'Book updated successfully',
//       book: {
//         ...updatedBook.toObject(),
//         totalAvailable,
//       },
//     });
//   } catch (error) {
//     console.error('Error updating book:', error);
//     res.status(500).json({ success: false, message: 'Failed to update book' });
//   }
// });

// // // Update book
// // router.put('/:id', auth, async (req, res) => {
// //   const { id } = req.params;
// //   const { copies } = req.body;

// //   try {
// //     // Find the book by ID
// //     const book = await Book.findById(id);

// //     if (!book) {
// //       return res.status(404).json({ success: false, message: 'Book not found' });
// //     }

// //     // Calculate total available based on updated copies and total bought
// //     const totalBought = book.totalBought || 0;
// //     const totalAvailable = copies - totalBought;

// //     // Update the book with the new copies and total available
// //     book.copies = copies;
// //     book.totalAvailable = totalAvailable;

// //     // Save the updated book
// //     const updatedBook = await book.save();

// //     res.status(200).json({
// //       success: true,
// //       message: 'Book updated successfully',
// //       book: updatedBook,
// //     });
// //   } catch (error) {
// //     console.error('Error updating book:', error);
// //     res.status(500).json({ success: false, message: 'Failed to update book' });
// //   }
// // });



// // Delete book
// // DELETE a book by ID
// router.delete("/:id", auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedBook = await Book.findByIdAndDelete(id);

//     if (!deletedBook) {
//       return res.status(404).json({ success: false, message: "Book not found" });
//     }

//     res.status(200).json({ success: true, message: "Book deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting book:", error);
//     res.status(500).json({ success: false, message: "Failed to delete book" });
//   }
// });


// // Get detailed book information
// router.get("/details", auth, async (req, res) => {
//   try {
//     const books = await Book.find().lean();
//     const purchases = await Purchase.find().populate('userId').lean();

//     const bookDetails = books.map(book => {
//       const bookPurchases = purchases.filter(purchase => purchase.bookId.toString() === book._id.toString());
//       const totalBought = bookPurchases.reduce((acc, purchase) => acc + purchase.quantity, 0);
//       const userPurchases = bookPurchases.map(purchase => ({
//         user: purchase.userId.name,
//         quantity: purchase.quantity,
//       }));

//       return {
//         ...book,
//         totalAvailable: book.copies - totalBought,
//         totalBought,
//         userPurchases,
//       };
//     });

//     res.json({ books: bookDetails });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//     console.log(err);
//   }
// });

// module.exports = router;
