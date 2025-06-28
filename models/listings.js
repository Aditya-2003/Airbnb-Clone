const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   image: {
      filename: { type: String, default: "noimage" },
      url: {
         type: String,
         default: "https://www.waytonikah.com/assets/mainassets/desktop/images/noimage-blog.jpg",
         set : (v) => (v === "") ? "https://www.waytonikah.com/assets/mainassets/desktop/images/noimage-blog.jpg" : v,
      },
   },
   description: String,
   price: Number,
   location: String,
   country: String,
   reviews:[{
      type: Schema.Types.ObjectId,
      ref: "Review"
   },
],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
 