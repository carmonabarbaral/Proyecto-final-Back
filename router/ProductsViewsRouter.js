const {Router} = require('express')
const ProductManagerMongo = require('../dao/manager/productManagerMongo')
const ProductManagerFile = require('../dao/manager/productManagerfs');
const productsViewsRouter = Router()
const productModels = require('../dao/models/productModels');;
const Handlebars = require('handlebars');

Handlebars.registerHelper('buildPaginationLink', (page, currentUrl) => {
  const queryParams = new URLSearchParams(currentUrl.split('?')[1]);
  queryParams.set('page', page);
  return `${currentUrl.split('?')[0]}?${queryParams.toString()}`;
});


//const USE_MONGO_DB = require('../config/config');
//const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();
productsViewsRouter.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sort = req.query.sort || '';
  const category = req.query.category || '';
  const stock = req.query.stock || '';

  const query = {};

  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  if (stock !== '') {
    query.stock = parseInt(stock);
  }

  let sortQuery = {};

  if (sort === 'asc') {
    sortQuery = { price: 1 };
  } else if (sort === 'desc') {
    sortQuery = { price: -1 };
  }

  const options = {
    page: page,
    limit: limit,
    sort: sortQuery,
  };

  try {
    const products = await productModels.paginate(query, options);
    const allCategories = await productModels.distinct("category");
    const selectedCategory = category;
    const categoriesWithSelection = allCategories.map((cat) => ({
      category: cat,
      isSelected: cat === selectedCategory,
    }));
    
    console.log("products:", products);
    console.log(products.totalPages)
    products.docs = products.docs.map((product) => product.toObject());

    const user = req.session.user;

    const pages = [];
    for (let i = 1; i <= products.totalPages; i++) {
      pages.push(i);
    }

    return res.render("products", { products, user, showHeader: true, pages, categoriesWithSelection});
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
});

module.exports = productsViewsRouter;





//   const products = await productModel.paginate({ }, options);
//   console.log(products)

//   products.docs = products.docs.map(product => product.toObject())

// return res.render('products', products)

module.exports = productsViewsRouter
