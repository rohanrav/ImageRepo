const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  facebookId: String,
  givenName: String,
  familyName: String,
  email: String,
  credits: Number,
});

mongoose.model("users", userSchema);
