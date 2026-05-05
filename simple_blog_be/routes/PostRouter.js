const express = require("express");
const Post = require("../db/postModel");
const router = express.Router();
const Comment = require("../db/commentModel.js");
//POST adding data
router.post("/post", async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});
// GET all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error });
  }
});
// GET post by slug
router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    res.send(post);
  } catch (error) {
    res.status(500).send({ error });
  }
});

//PATCH updating a post by slug
router.patch("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true },
    );
    res.send(post);
  } catch (error) {
    res.status(500).send({ error });
  }
});

//DELETE delete a post
router.delete("/posts/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      return res.status(404).send("Post wasn't found");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error });
  }
});

//GET comments
router.get("/posts/:slug/comments", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    const comments = await Comment.find({ postSlug: req.params.slug })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: "Failed to get comments" });
  }
});

//POST comments
router.post("/posts/:slug/comments", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).send({ message: "Comment is required" });
    }
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    const comment = await Comment.create({
      postSlug: req.params.slug,
      username: req.session.user.username,
      content: content.trim(),
    });
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ message: "Failed to create comment" });
  }
});

module.exports = router;
