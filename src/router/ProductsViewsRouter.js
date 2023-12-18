const express = require('express');
const productViewRouter = express.Router();
const Products = require('../models/product.model');
const env = require("../config/config");
const jwt = require("jsonwebtoken");


productViewRouter.get("/", async (req, res) => {
    try {
      const token = req.cookies.token;
      if (token) {
        const decodedToken = jwt.verify(token,  process.env.JWT_SECRET);
  
        if (decodedToken && decodedToken.user) {
          const currentUser = decodedToken.user;
  
          const { sort, categoryFilter, stock, limit = 10, page = 1 } = req.query;
          const query = {};
          if (categoryFilter) {
            query.category = categoryFilter;
          }
          if (stock) {
            query.stock = parseInt(stock);
          }
  
          let sortQuery = { price: 1 };
          if (sort === "desc") {
            sortQuery = { price: -1 };
          }
          const parsedLimit = parseInt(limit, 10);
          const options = {
            sort: sortQuery,
            limit: isNaN(parsedLimit) ? 10 : parsedLimit,
            page: parseInt(page),
          };
  
          const categories = await Products.distinct("category");
          const products = await Products.paginate(query, options);
  
          const cart = currentUser.cart;
  
          const transformProducts = products.docs.map((product) => {
            return {
              id: product._id,
              title: product.title,
              price: product.price,
              stock: product.stock,
              category: product.category,
              description: product.description,
              cart: cart,
            };
          });
  
          res.render("products", {
            products: transformProducts,
            categories,
            currentPage: products.page,
            totalPages: products.totalPages,
            categoryFilter,
            stock,
            sort,
            currentUser,
          });
        } else {
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
  
  productViewRouter.get("/:id", async (req, res) => {
    try {
      const product = await Products.findById(req.params.id).lean();
      if (!product) {
        return res.status(404).json({ message: "Cannot find product" });
      }
      console.log(product);
      res.render("product", { product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  productViewRouter.get("/clear", (req, res) => {
    res.redirect("/products");
  });
  
  module.exports = productViewRouter;