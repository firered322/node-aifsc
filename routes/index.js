const express = require("express");
const moment = require("moment");

const Blog = require("../models/Blog");
const helpers = require("../helper");

const router = express.Router();

// @route  GET /
// @desc   Homepage
// @access Public
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: "desc" }).lean();
  blogs.forEach((blog) => {
    blog.createdAt = moment(blog.createdAt).format("MMMM Do YYYY");
    blog.body = helpers.truncate(blog.body, 100);
  });
  res.render("index", { blogs });
});

router.get("/login", (req, res) => {
  res.render("login");
});

// @route  GET /blog
// @desc   Open the add blog page
// @access Private
router.get("/blog", (req, res) => {
  res.render("add_blog");
});

// @route  GET /blog/:id
// @desc   Open a blog page
// @access Public
router.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id }).lean();
  blog.createdAt = moment(blog.createdAt).format("MMMM Do YYYY");
  res.render("blog_view", { blog });
});

// @route  POST /blog
// @desc   Create blog post from the blog form
// @access Public
router.post("/blog", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
