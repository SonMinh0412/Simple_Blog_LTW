const express = require("express");
const Post = require("../db/postModel");
const router = express.Router();

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
module.exports = router;
