const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const LogSchema = new mongoose.Schema({
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  logoutTime: {
    type: Date
  }
});



const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookName: { type: String, required: true },
  bookPrice: { type: Number, required: true },
  authorName: { type: String, required: true },
  // username:{type: String, required: true },
  // email:{type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number }, 
  purchaseDate: { type: Date, required: true, default: Date.now },
  address : { 
    street: { type: String},
    city: { type: String },
    state: { type: String },
    postalCode: { type: String}
   },
});

const FeedbackSchema = new mongoose.Schema({
  willComeBack: { type: Number, required: true },
  bookRating: { type: Number, required: true },
  recommend: { type: Boolean, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  logs: [LogSchema], 
  purchases: [PurchaseSchema], 
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] ,
  otp:{type:String},
  otpExpires:{type:Date},
  avatar: { type: String },
  feedbacks: [FeedbackSchema]
});

module.exports = mongoose.model('Admin', adminSchema);
