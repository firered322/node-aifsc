const express = require('express')
const moment = require('moment')

const Blog = require('../models/Blog')
const helpers = require('../helper')

const router = express.Router();

router.get('/', async (req, res) => {
    const blogs = await Blog.find().lean()
    blogs.forEach(blog=>{
        blog.createdAt = moment(blog.createdAt).format("MMMM Do YYYY")
        blog.body = helpers.truncate(blog.body, 100)
    })
    console.log(blogs)
    res.render('index', { blogs })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/blog', (req, res) => {
    res.render('add_blog')
})

router.get('/blog/:id', async (req, res) => {
    const blog = await Blog.findOne({_id: req.params.id} ).lean()
    blog.createdAt = moment(blog.createdAt).format("MMMM Do YYYY")
    res.render('blog_view', {blog})
})


router.post('/blog', async (req, res) => {
    try {
        // req.body.user = 'dummyuserid999666111';
        console.log(req.body)
        const blog = await Blog.create(req.body);
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
})
module.exports = router