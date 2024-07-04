const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookName: { type: String, required: true },
  bookPrice: { type: Number, required: true },
  authorName: { type: String, required: true },
  imageLink: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number },
  purchaseDate: { type: Date, required: true, default: Date.now },
  address: { type: addressSchema, required: true },
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;




