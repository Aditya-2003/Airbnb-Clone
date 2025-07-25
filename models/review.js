const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    comment: String,
    rating:{
        type:Number,
        min:0,
        max:5,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
   }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;