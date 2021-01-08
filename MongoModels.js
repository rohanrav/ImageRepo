const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
    ownerUserID: mongoose.ObjectId,
    caption: String,
    sellImg: { type: Boolean, default: false },
    price: Number,
    characteristics: [String],
    img: { data: Buffer, contentType: String },
    date: { type: Date, default: Date.now }
});

const Image = mongoose.model("Image", imagesSchema)

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    credits: Number,
    ownImages: [imagesSchema]
});

const User = new mongoose.model("User", userSchema)

exports.Image = Image;
exports.User = User;