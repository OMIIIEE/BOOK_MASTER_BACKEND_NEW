const mongoose = require('mongoose');


const connectDB = async () => {
  
const mongoURI = process.env.MONGO_URI 
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports= connectDB;
