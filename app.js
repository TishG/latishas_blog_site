const express = require("express");
      app = express();
      bodyParser = require("body-parser");
      methodOverride = require("method-override");
      expressSanitizer = require("express-sanitizer");
      path = require("path");
      port = process.env.PORT || 3000;
      mongoose = require("mongoose");
      dotenv = require("dotenv").config();     
      URI = `mongodb+srv://dbUser:${process.env.dbPassword}@latishablogsite-3vxtw.mongodb.net/test?retryWrites=true`
      mongoose.connect(URI, { useNewUrlParser: true } );

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

      app.set("view engine", "ejs");
      app.use(bodyParser.urlencoded({extended: true}));
      //must go after bodeParser
      app.use(expressSanitizer());
      app.use(express.static(__dirname + "/assets"));
      //utilized to be able to use "PUT" and "DELETE"
      app.use(methodOverride("_method"));

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
          console.log(req.body);
          req.body.blog.body = req.sanitize(req.body.blog.body);
          console.log("after ", req.body);
          Blog.create(req.body.blog, (err, newBlog) => {
              if(err) console.log(err);
              else res.redirect("/blogs");
              console.log("new log post created: ", newBlog);
          })
      });

      app.get("/blogs/:id", (req, res, next) => {
          Blog.findById(req.params.id, (err, foundBlog) => {
              if(err) { 
                console.log(err);
                res.redirect("/blogs");
              }
              else res.render("show", {blog: foundBlog});
              console.log("Found blog!");
          })
      });

      //edit route
      app.get("/blogs/:id/edit", (req, res, next) => {
        Blog.findById(req.params.id, (err, foundBlog) => {
            if(err) {
                console.log(err);
                res.redirect("/blogs");
            }
            res.render("edit", {blog: foundBlog});
        })
      })

      //update route
      app.put("/blogs/:id", (req, res, next) => {
          req.body.blog.body = req.sanitize(req.body.blog.body);
          Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {
              if(err) {
                  res.redirect("/blogs");
                  console.log(err);
              } 
              else res.redirect(`/blogs/${req.params.id}`);
              console.log("...successfully deleted blog...")
          })
      })

      app.delete("/blogs/:id", (req, res, next) => {
          Blog.findByIdAndDelete(req.params.id, (err) => {
              if(err) {
                  console.log(err);
                  res.redirect("/blogs");
              }
              res.redirect("/blogs");
              console.log("...successfully deleted blog...")
          })
      })

      app.listen(port, (err) => {
        if(err) console.log(err);
        else console.log(`...listening on port ${port}...`);
      })
