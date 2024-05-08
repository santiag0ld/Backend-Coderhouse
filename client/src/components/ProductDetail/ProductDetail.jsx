import { useCartContext } from "../../context/CartContext"
import { useUserContext } from "../../context/UserContext"

const ProductDetail = ({product}) => {
    const { cart, setCart } = useCartContext()
    const { user, token } = useUserContext()
  
    const addToCart = async () => {
      try {

        const requestBody = {
          user: user
        }

        const response = await fetch(`http://localhost:4000/api/carts/${product._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
          credentials: 'include',
        })
        console.log(response)
  
        if (!response.ok) {
          console.error(`Error adding product to cart: ${response.statusText}`)
          return
        }
  
        const data = await response.json()
        console.log(data.cart)
        setCart(data.cart)
  
        alert('Product added to cart successfully')
        
      } catch (error) {
        console.error('Error adding product to cart:', error)
      }
    }


  console.log(product.title)
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
        <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover rounded-md mt-2" />
      </div>
      <h2 className="text-lg text-gray-700 mb-2">{product.description}</h2>
      <div className="mb-4">
        <h3 className="text-sm text-gray-500">Stock: {product.stock}</h3>
        <h3 className="text-lg font-semibold text-green-600">Price: ${product.price}</h3>
      </div>

      <div className="flex justify-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>

   
  )
};

export default ProductDetail;