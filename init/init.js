const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("../init/data.js");
const { init } = require('../models/user.js');

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
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: "6868f36a158f224904ee6270"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data Inserted");
}

initDB();