const productModels = require('../models/productModels')

class ProductManagerMongo {
    constructor() {
        this.model = productModels
    }

    async getAllProducts() {
        const products = await this.model.find()

        return products.map(p => p.toObject())
    }

    async getProductById(id) {
        return this.model.findById(id)
    }

    async addProduct(body) {
        return this.model.create({
            code: body.code,
            stock: body.stock,
            title: body.title,
            price: body.price,
            category: body.category,
            thumbnails: body.thumbnails,
            description: body.description,
            status: body.status
        })
    }

    async updateProduct(id, body) {
        const product = await this.getProductById(id)

        if (!product) {
            throw new Error('Producto no existe')
        }

        const productUpdated = {
            _id: product._id,
            code: body.code || product.code,
            stock: body.stock || product.stock,
            title: body.title || product.title,
            price: body.price || product.price,
            category: body.category || product.category,
            thumbnails: body.thumbnails || product.thumbnails,
            description: body.description || product.description,
            status: body.status || product.status
        }

        await this.model.updateOne({ _id: id }, productUpdated)

        return productUpdated
    }

    async deleteProduct(id) {
        const product = await this.model.findById(id)

        if (!product) {
            throw new Error('Producto no existe')
        }

        await this.model.deleteOne({ _id: id })

        return true
    }

}

module.exports = ProductManagerMongo