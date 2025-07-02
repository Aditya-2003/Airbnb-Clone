const mongoose = require('mongoose');
const Listing = require("../models/listings.js");
const initData = require("../init/data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnB";

main()
    .then(() => {
        console.log("connected to DB");
    }) 
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Inserted");
}

initDB();