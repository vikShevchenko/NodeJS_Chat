//у main.js зберігаються роути до сторінок
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
/**
 * GET
 * Home
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Simple Blog created width NodeJS, Express, MongoDB",
    };

    // Пагінація - кількість виданих сторінок із бази
    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    //------------------------------------------------
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});
/**
 * GET
 * Post: ID
 */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created width NodeJS, Express, MongoDB",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});
/**
 * POST
 * Post: search
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created width NodeJS, Express, MongoDB",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});
/**
 * GET /
 * About
 */
router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});
/**
 * GET /
 * Contact
 */
router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

module.exports = router;
