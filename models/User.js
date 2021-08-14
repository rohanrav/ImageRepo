const mongoose = require("mongoose");
const { Schema } = mongoose;
const { imagesSchema } = require("./Image");
const { purchaseHistorySchema } = require("./PurchaseHistory");

const userSchema = new Schema({
  facebookId: String,
  givenName: String,
  familyName: String,
  email: String,
  credits: Number,
  ownImages: [imagesSchema],
  purchaseHistory: [purchaseHistorySchema],
});

mongoose.model("users", userSchema);
