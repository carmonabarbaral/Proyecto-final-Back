const mongoose = require('mongoose')

const producSchema = mongoose.Schema({
    code:{
        type:String,
        unique:true
    },
    stock:Number,
    title:String,
    price:Number,
    thumbnail:String,
    status:Boolean,
    fecha:String,
    description: String

})

module.exports = mongoose.model('products', producSchema)