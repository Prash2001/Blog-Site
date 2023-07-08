//Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const lodash = require("lodash");
require("dotenv").config();
const uri = process.env.URL;
//connecting to cloud mongodb
mongoose.connect(uri);
//Static content of website
const aboutContent =
  "I am an enthusiastic individual with a passion for programming, traveling, and hiking. His diverse interests allow him to find inspiration from various domains, making him a well-rounded individual. Prash has recently embarked on an exciting new journey by creating his own blog posting site. With his technical expertise and love for writing, he aims to share his experiences, insights, and knowledge with a wider audience, captivating readers with his unique perspective. Through his blog posting site, Prash strives to create a platform that not only entertains and educates but also fosters a sense of community. With engaging content and interactive features, he invites readers to join him on this exciting venture, encouraging discussions and exchanging ideas.";

const contactContent =
  "Hey Prashant here!😄 Love travelling as much as I do? Let's talk about our travelling experience! We can code while planning our next trip.☕";

const app = express();
//Setting ejs as default view engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
  console.log("App is live!");
});

//Creating schema for blog post
const blogSchema = mongoose.Schema({
  title: String,
  body: String,
});

//Model created using blogSchema
const Blog = mongoose.model("blog", blogSchema);

//rendering all the blogs
app.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.render("home", { content: blogs });
});

//About Section
app.get("/about", (req, res) => {
  res.render("about", { content: aboutContent });
});

//Contact Section
app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});

//Creating new Post
app.get("/compose", (req, res) => {
  res.render("compose");
});

//Inserting blog as per user request
app.post("/compose", async (req, res) => {
  const blog = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  await blog.save();
  res.redirect("/");
});

//Rendering indivisual post
app.get("/post/:postName", async (req, res) => {
  console.log(req.params.postName);
  const title = req.params.postName;
  const blog = await Blog.findOne({ title: title });
  console.log(blog);
  if (blog != null) {
    res.render("post", { post: blog });
  } else {
    console.log("Not Found");
    res.render("404");
  }
});
