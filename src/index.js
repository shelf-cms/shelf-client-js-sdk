import Auth from './auth'
import FirebaseDB from './db_driver'
import Cart from './cart'
import Users from './users'
import Products from './products'
import Collections from './collections'
import Tags from './tags'
import Orders from './orders'
import { materializeConfig } from './firebase'
import { LS } from './common/utils/browser'

class ShelfSDK {
  constructor() {
  }

  init(firebaseConfig) {
    this.firebase = materializeConfig(firebaseConfig)
    this.db = new FirebaseDB(this)
    this.auth = new Auth(this)
    this.cart = new Cart(this)
    this.users = new Users(this) 
    this.products = new Products(this)
    this.collections = new Collections(this)
    this.tags = new Tags(this)
    this.orders = new Orders(this)

    this.auth.init()
    this.cart.init()
  }
}
 
export const shelf = new ShelfSDK()

const CONFIG_KEY = `shelf_client_latest_config`

export const hasInit = () => { 
  return shelf.hasInited
}

export const initShelf = (config) => {
  // console.trace()
  console.log('Initing Client Shelf SDK with config')
  shelf.init(config)
  // save config
  LS.set(CONFIG_KEY, config)
  return shelf
}

export const getLatestConfig = () => {
  return LS.get(CONFIG_KEY)
}

export const getShelf = () => { 
  // if(!wush.hasInited) {
  //   // test if we have a config stored
  //   const config = getLatestConfig()
  //   if(config)
  //     return initShelf(config)
  //   console.log('wush SDK has not inited and does not have a stored config')
  // }
  return shelf
}
