const {Router} = require('express')
const productsViewsRouter = Router()
const productsModel = require('../models/product.model');;
const Handlebars = require('handlebars');


Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '===':
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case '!==':
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case '<':
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case '<=':
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case '>':
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case '>=':
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
Handlebars.registerHelper('buildPaginationLink', (param, value, currentUrl) => {
  if (currentUrl && typeof currentUrl === 'string') {
    const queryParams = new URLSearchParams(currentUrl.split('?')[1]);
    queryParams.set(param, value);
    
    return `${currentUrl.split('?')[0]}?${queryParams.toString()}`;
  } else {
    console.log('Error: currentUrl no está definido o no es una cadena.');
    return currentUrl; 
  }
});

Handlebars.registerHelper('buildFilterUrl', (currentUrl, filters) => {
  if (typeof currentUrl !== 'string') {
    console.log('Error: currentUrl no está definido o no es una cadena.');
    return currentUrl;
  }

  const currentParams = new URLSearchParams(currentUrl.split('?')[1] || '');

  for (const param in filters) {
    const value = filters[param];
    if (value !== undefined && value !== '') {
      currentParams.set(param, value);
    } else {
      currentParams.delete(param);
    }
  }

  return `${currentUrl.split('?')[0]}?${currentParams.toString()}`;
});

// const USE_MONGO_DB = require('../config/config');
// const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();

productsViewsRouter.get("/", async (req, res) => {
  

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sort = req.query.sort || "";
  const category = req.query.category || "";
  const stock = req.query.stock || "";

  const query = {};

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (stock !== "") {
    if (stock === "+6") {
      query.stock = { $gt: 6 };
    } else {
      query.stock = parseInt(stock);
    }
  }

  let sortQuery = {};

  if (sort === "asc") {
    sortQuery = { price: 1 };
  } else if (sort === "desc") {
    sortQuery = { price: -1 };
  }

  const options = {
    page: page,
    limit: limit,
    sort: sortQuery,
  };

  try {
    const products = await productsModel.paginate(query, options);
    const allCategories = await productsModel.distinct("category");
    const selectedCategory = category;

    const categoriesWithSelection = allCategories.map((cat) => ({
      category: cat,
      isSelected: cat === selectedCategory,
    }));

    console.log("Products:", products);
    console.log(products.totalPages)
    products.docs = products.docs.map((product) => product.toObject());

    const user = req.session.user;

    const pages = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pages.push(i);
    }

    const currentUrl = req.originalUrl;

    return res.render("products", {
  products,
  user,
  showHeader: true,
  pages,
  categoriesWithSelection,
  requestUrl: currentUrl,
  // Pasar todos los filtros actuales aquí
  limit: limit,
  category: category,
  stock: stock,
  sort: sort,
});
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
});

module.exports = productsViewsRouter;