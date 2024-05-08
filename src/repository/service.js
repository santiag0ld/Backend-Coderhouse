import ProductRepository from './products.repository.js'
import UserRepository from './user.repository.js'
import CartRepository from './cart.repository.js'
import MessageRepository from './message.repository.js'

const productsService = new ProductRepository();
const userService = new UserRepository();
const cartService = new CartRepository();
const messageService = new MessageRepository();

export {
    productsService,
    userService,
    cartService,
    messageService,
}
