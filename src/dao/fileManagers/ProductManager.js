const fs = require('fs/promises')
const { existsSync } = require('fs');
const path = require('path');

class ProductManager {
    constructor(filename){
        this.filePath = path.resolve(__dirname,`../../files/${filename}`)
    }

    async getProducts() {
        try{
            if (existsSync(this.filePath)){
                const products = await fs.readFile(this.filePath, 'utf-8')
                if(products.length > 0){
                    const parsedProducts = JSON.parse(products)
                    return parsedProducts
                }
                else return []
            }
            else return []
        }
        catch(error){
            throw new Error('erorrrrrr')
        }
    }

    async getProductById(id) {
        const idNumber = Number(id)
        try{
            const savedProducts = await this.getProducts();
            const selectedProduct = savedProducts.find(prod => prod.id === idNumber)
            if(!selectedProduct){
                throw new Error('ERROR: no product matches the specified ID')
            }
            return selectedProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProduct(product) {
        try{
            const savedProducts = await this.getProducts()
            const DuplicatedProduct = savedProducts.find(item => item.code == product.code)
            if (DuplicatedProduct){
                throw new Error(`ERROR: Unable to add. The next code has been already added: ${product.code}`)
            }
            if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
                throw new Error(`ERROR: Unable to add. Missing fields`)
            }
            const newId = savedProducts.length > 0 ? savedProducts[savedProducts.length -1 ].id + 1 : 1
            const newProduct = {
                id: newId,
                status: product.status || true,
                thumbnails: product.thumbnails || [],
                ...product
            }
            savedProducts.push(newProduct)
            const productListString = JSON.stringify(savedProducts, null, '\t')
            await fs.writeFile(this.filePath, productListString)
            console.log(`${product.title} added`)
            return newProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product) {
        const idNumber = Number(id)
        try{
            const savedProducts = await this.getProducts()
            const targetProduct = await this.getProductById(idNumber)
            const updatedProduct = {...targetProduct, ...product}
            const updatedList = savedProducts.map(prod =>{
                if(prod.id === idNumber){
                    return updatedProduct
                }else{
                    return prod
                }
            })
            const productListString = JSON.stringify(updatedList, null, '\t')
            await fs.writeFile(this.filePath, productListString)
            console.log('product modified')
            return updatedProduct
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        const idNumber = Number(id)
        try{
            const savedProducts = await this.getProducts();
            const targetProduct = await this.getProductById(idNumber)
            const filteredList = savedProducts.filter(prod => prod.id !== idNumber)
            const productListString = JSON.stringify(filteredList, null, '\t')
            await fs.writeFile(this.filePath, productListString)
            console.log(`${targetProduct.title} deleted`)
            return targetProduct   
        }
        catch(error){
            throw new Error(error.message)
        }
    }
}

module.exports = ProductManager




