const mongoose = require("mongoose");
const { Schema } = mongoose;

const imagesSchema = new Schema({
  ownerUserID: mongoose.ObjectId,
  caption: String,
  sellImg: { type: Boolean, default: false },
  price: Number,
  characteristics: [String],
  date: { type: Date, default: Date.now },
});

mongoose.model("image", imagesSchema);
