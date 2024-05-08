import { configObject } from "../config/config.js";

let UserDao;
let ProductDao;
let CartDao;
let MessageDao;
let ProductFile;
let CartFile;

switch (configObject.persistance) {
    case 'MONGO':
        const UserDaoMongo = require('./mongo/userDaoMongo');
        UserDao = UserDaoMongo;

        const ProductDaoMongo = require('./mongo/productDaoMongo');
        ProductDao = ProductDaoMongo;

        const CartDaoMongo = require('./mongo/cartDaoMongo');
        CartDao = CartDaoMongo;

        const MessageDaoMongo = require('./mongo/messageDaoMongo');
        MessageDao = MessageDaoMongo;
        break;

    case 'FILE':
        const ProductFileManager = require('./fileSystem/productManager');
        ProductFile = ProductFileManager;

        const CartFileManager = require('./fileSystem/cartManager');
        CartFile = CartFileManager;
        break;

    default:
        break;
}

export { UserDao, ProductDao, CartDao, MessageDao, ProductFile, CartFile };
