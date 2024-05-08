class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    async getProducts({ limit = 10, pageNumber = 1, sort = null, query = '' } = {}) {
        console.log('Calling getProducts method');
        try {
            const products = await this.dao.get({ limit, pageNumber, sort, query });
            console.log('Products:', products); // Log retrieved products
            return products;
        } catch (error) {
            console.error('Error in getProducts:', error);
            throw error; // Rethrow the error
        }
    }
    getProductById = async(pid) => await this.dao.getById(pid)
    addProduct = async(title, description, price, thumbnail, code, stock, status, category, owner) => await this.dao.add(title, description, price, thumbnail, code, stock, status, category, owner)
    updateProduct = async(pid, title, description, price, thumbnail, code, stock, status, category) => await this.dao.update(pid, title, description, price, thumbnail, code, stock, status, category)
    deleteProduct = async(pid) => await this.dao.delete(pid)

}

export default ProductRepository;