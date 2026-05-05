const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postSlug: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide comment"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Comments || mongoose.model("Comments", CommentSchema);
