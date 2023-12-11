const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    code:{
        type:String,
        unique:true
    },
    stock:Number,
    title:String,
    price:Number,
    category:String,
    thumbnails: {type: [String]},
    description: String,
    status: Boolean,
})

module.exports = mongoose.model('products', productsSchema)