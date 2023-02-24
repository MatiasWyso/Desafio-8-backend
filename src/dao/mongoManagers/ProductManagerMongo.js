const productModel = require('../models/product.model')

class ProductManagerMongo {
    
    async getProducts({limit, page, query, sort}) {
        try {
            let filter
            
            if(!query){
                filter =  {}
            }else if(query == 'true'){
                filter = {status: true}
            }else if(query== 'false'){
                filter = {status: false}
            }else{
                filter = {category: query}
            }

            const options = {
                sort: (sort ? {price: sort} : {}),
                limit: limit || 10,
                page: page || 1,
                lean: true
            }

            const products = await productModel.paginate(filter,options)
            
            // const products = await productModel.aggregate([
            //     {
            //         $match: (query != undefined? {category: query}: {})
            //     },
            //     {
            //         $sort:{ price: sort }
            //     },
            //     {
            //         $limit: limit
            //     }
            // ])

            return products
        } catch (error) {
            throw new Error(error.message)
        }
    }

     async getProductById(id) {
        try{
            const product = await productModel.findById(id)
            if(!product){
                throw new Error('ERROR: no product matches the specified ID')
            }
            return product
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProduct(product) {
        try{
            await productModel.create(product)
            console.log(`${product.title} added`)
            const newProduct = {
                status: product.status || true,
                thumbnails: product.thumbnails || [],
                ...product
            }
            return newProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const updatedProduct = await productModel.updateOne({_id: id}, product)
            console.log(`${product.title ? product.title : 'product'} modified`)
            return updatedProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const deletedProduct = await productModel.deleteOne({_id: id})
            console.log(`product deleted`)
            return deletedProduct   
        }
        catch(error){
            throw new Error(error.message)
        }
    }

}

module.exports = ProductManagerMongo