const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product:{
        type:String,
        quantity: Number
    },
    

})

module.exports = mongoose.model('cart', cartSchema)