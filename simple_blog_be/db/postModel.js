const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  slug: {
    type: String,
    require: [true, "Please provide slug"],
    unique: [true, "Slug Exist"],
  },
  title: {
    type: String,
    require: [true, "Please provide title"],
  },
  description: {
    type: String,
    require: [true, "Please provide description"],
  },
});

module.exports = mongoose.model.Posts || mongoose.model("Posts", PostSchema);
