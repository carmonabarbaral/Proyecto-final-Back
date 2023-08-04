const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    code:{
        type:String,
        unique:true
    },
    stock:Number,
    title:String,
    price:Number,
    thumbnail:{type: [String]},
    status:Boolean,
    fecha:String,
    description: String

})

module.exports = mongoose.model('products', productsSchema)