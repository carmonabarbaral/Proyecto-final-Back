const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product:{type:Array, },
    

})

module.exports = mongoose.model('cart', cartSchema)