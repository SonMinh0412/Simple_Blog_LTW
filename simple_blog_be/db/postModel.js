const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, "Please provide slug"],
    unique: [true, "Slug Exist"],
  },
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
});

module.exports = mongoose.models.Posts || mongoose.model("Posts", PostSchema);
