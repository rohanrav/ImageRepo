const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseHistorySchema = new Schema({
  purchaseType: String,
  price: Number,
  caption: String,
  date: Date,
  imgUrl: String,
});

mongoose.model("purchaseHistory", purchaseHistorySchema);

module.exports = {
  purchaseHistorySchema,
};
