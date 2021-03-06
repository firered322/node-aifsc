const express = require("express");
const moment = require("moment");
const multer = require("multer");

const Blog = require("../models/Blog");
const Member = require("../models/Member");
const helpers = require("../helper");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// multer validation middleware
// const upload = multer({
//   dest: "files",
//   limits: {
//     fileSize: 2000000, // 2MB limit
//   },
//   //   to check if the uploaded document is a pdf
//   fileFilter(req, file, cb) {
//     // check file extension
//     //TODO: Save the file.originalname string to the database.
//     if (!file.originalname.endsWith(".pdf")) {
//       return cb(new Error("Please upload a PDF"));
//     }
//     cb(undefined, true);
//   },
// });

// @route  GET /
// @desc   Homepage
// @access Public
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: "desc" }).lean();
  blogs.forEach((blog) => {
    blog.createdAt = moment(blog.createdAt).format("MMMM Do YYYY");
    blog.body = blog.body.toString();
    blog.body = blog.body.replace(/<[^>]*>/g, "").replace(/\&nbsp;/g, "");
    blog.body = helpers.truncate(blog.body, 100);
  });
  res.render("index", { blogs });
});

// @route  GET /login
// @desc   Open the admin login page
// @access Public
router.get("/login", (req, res) => {
  res.render("login");
});

// // @route  POST /login
// // @desc   Process login
// // @access Public
// router.get("/login", (req, res) => {
//   res.render("login");
// });

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
// @access Private
router.post("/blog", async (req, res) => {
  try {
    const { title, body } = req.body;
    console.log(title, body);
    // const file = req.file;
    const blogObject = {
      title: title,
      body: body,
    };
    // console.log(blogObject);
    await Blog.create(blogObject);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// @route  POST /listblogs
// @desc   List all the blogs
// @access Private
router.get("/listblogs", async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ id: -1 });
    res.render("list-blogs", { blogs });
  } catch (err) {
    console.error(err);
  }
});

// @route  GET /edit-blog/:id
// @desc   Open edit blog page
// @access Private
router.get("/edit-blog/:id", async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id }).lean();
  res.render("edit-blog", { blog });
});

// @route  POST /edit-blog/:id
// @desc   Edit a blog
// @access Private
router.post("/edit-blog/:id", async (req, res) => {
  const { title, body } = req.body;
  try {
    await Blog.findByIdAndUpdate({ _id: req.params.id }, { title, body });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// @route  GET /members
// @desc   Open the members page
// @access Public
router.get("/members", async(req, res) => {
  try {
    const members = await Member.find({});
    res.render("members", { members });
  } catch (err) {
    console.error(err);
  }
});

// @route  GET /add-member
// @desc   Add a new member form
// @access Private
router.get("/add-member", (req, res) => {
  res.render("add-member");
});

// @route  POST /add-member
// @desc   Handle member creation
// @access Private
router.post("/add-member", async (req, res) => {
  try {
    const {
      inputName,
      inputEmail,
      inputDesignation,
      inputPhone,
      inputDOJ,
    } = req.body;
    const memberObj = {
      name: inputName,
      designation: inputDesignation,
      email: inputEmail,
      phone: inputPhone,
      dateOfJoining: inputDOJ,
    };
    await Member.create(memberObj);
    res.redirect("/members");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
