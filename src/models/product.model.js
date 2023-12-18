const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productsSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  stock: Number,
  title: String,
  price: Number,
  category: String,
  thumbnails: { type: [String] },
  description: String,
  status: Boolean,
});

productsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("products", productsSchema);