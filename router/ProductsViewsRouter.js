const {Router} = require('express')
const ProductManagerMongo = require('../dao/manager/productManagerMongo')
const ProductManagerFile = require('../dao/manager/productManagerfs');
const productsViewsRouter = Router()
const productModel = require('../dao/models/productModels');


//const USE_MONGO_DB = require('../config/config');
//const productManager = USE_MONGO_DB ? new ProductManagerMongo() : new ProductManagerFile();




productsViewsRouter.get('/', async(req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sort = req.query.sort || '';
  // console.log('Page:', page); 
  // console.log('Limit:', limit);

  const category = req.query.category || '';
  const stock = req.query.stock || '';

  // console.log('Category:', category);

  const query = {};

  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  if(stock != '') {
    query.stock = parseInt(stock);
  }
  
  const options = {
    page: page,
    limit: limit,
  };

  let sortQuery = {}

  if(sort === 'asc'){
    sortQuery = {price:1}
  }
  else if(sort === 'desc'){
    sortQuery = {price:-1}
  }
  const products = await productModel.paginate(query, {...options,sort: sortQuery});
  console.log('products:', products);
  products.docs = products.docs.map(product => product.toObject());

  return res.render ('products',products );
});
//   const products = await productModel.paginate({ }, options);
//   console.log(products)

//   products.docs = products.docs.map(product => product.toObject())

// return res.render('products', products)

module.exports = productsViewsRouter
