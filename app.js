const express = require("express");
      app = express();
      bodyParser = require("body-parser");
      path = require("path");
      port = process.env.PORT || 3000;
      mongoose = require("mongoose");
      dotenv = require("dotenv").config();     
      URI = `mongodb+srv://dbUser:${process.env.dbPassword}@latishablogsite-3vxtw.mongodb.net/test?retryWrites=true`
      mongoose.connect(URI, { useNewUrlParser: true } );

    //Blog
        //title
        //image
        //body
        //created

    const blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {
            type: Date,
            default: Date.now
        }
    })

    const Blog = mongoose.model("Blog", blogSchema);

    // Blog.create({
    //     title: "Test Blog",
    //     image: "https://images.unsplash.com/photo-1553530978-140ea4b72092?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=60",
    //     body: "Hey, this is my first blog post"
    // }, (err, blog) => {
    //     if(err) console.log(err);
    //     else console.log(" A new document has been created", blog);
    // })

      app.set("view engine", "ejs");
      app.use(bodyParser.urlencoded({extended: true}));
      app.use(express.static(__dirname + "/assets"));

      app.get("/", (req, res, next) => {
          res.redirect("/blogs");
      })

      //index route
      app.get("/blogs", (reg, res, next) => {
          Blog.find({}, (err, allBlogs) => {
              if(err) console.log(err);
              else res.render("index", {blogs: allBlogs})
          })
      });

      //new blog route
      app.get("/blogs/new", (req, res, next) => {
        res.render("new");
      });

      //create blog post
      app.post("/blogs", (req, res, next) => {
          Blog.create(req.body.blog, (err, newBlog) => {
              if(err) console.log(err);
              else res.redirect("/blogs");
              console.log("new log post created: ", newBlog);
          })
      })

    

      app.listen(port, (err) => {
        if(err) console.log(err);
        else console.log(`...listening on port ${port}...`);
      })