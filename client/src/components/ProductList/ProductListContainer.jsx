import ProductList from "./ProductList"
import Home from '../Home'

const ProductListContainer = ({products}) => {
    return (
        <div style={{ margin: '0px', padding: '0px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', justifyItems: 'center', rowGap: '80px'}}>
            {products.map(product => (
                <div key={product._id}>
                    <ProductList product={product} />
                    {<Home product={product} />}
                </div>
            ))}
        </div>
    )
}

export default ProductListContainer