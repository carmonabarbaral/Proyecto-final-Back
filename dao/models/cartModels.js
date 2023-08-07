const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, quantity: Number }]
})

module.exports = mongoose.model('cart', cartSchema)