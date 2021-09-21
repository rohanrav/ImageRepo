const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseHistorySchema = new Schema({
  userId: Schema.ObjectId,
  purchaseHistory: [
    { purchaseType: String, price: Number, caption: String, date: Date, imageKey: String },
  ],
});

mongoose.model("purchaseHistory", purchaseHistorySchema);
