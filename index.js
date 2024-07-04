// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/Books')
const wishlistRoutes = require('./routes/Wishlist')
const purchasesRoutes = require('./routes/purchases')
const otpRoutes = require('./routes/otpRoutes')
const enquiryRoute = require("./routes/enquiry")
const feedbackRoutes = require("./routes/Feedback")
const cors = require('cors');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/purchases', purchasesRoutes); 
app.use("/api/otp",otpRoutes);
app.use('/api/auth/books', bookRoutes);
app.use('/api/enquiry', enquiryRoute);

connectDB().then(() => {
  const PORT = process.env.PORT || 9004;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
