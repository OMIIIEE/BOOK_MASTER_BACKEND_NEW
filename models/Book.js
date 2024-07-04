// const mongoose = require('mongoose');

// const bookSchema =  new mongoose.Schema({
//     name:{type:String,required:true},
//     author:{type:String,required:true},
//     publisher:{type:String,required:true},
//     publishDate:{type:Date,required:true},
//     copies:{type:Number,required:true},
//     price:{type:Number,required:true},
//     imageLink:{type:String,required:true},
// });

// const Book = mongoose.model('Book',bookSchema);
// module.exports=Book;

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    authorName: { type: String, required: true },
    publisherName: { type: String, required: true },
    publishDate: { type: Date, required: true },
    copies: { type: Number, required: true },
    price: { type: Number, required: true },
    imageLink: { type: String, required: true },
    summary:{ type: String, required: true },
    category:{ type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

