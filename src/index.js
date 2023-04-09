import Auth from './auth.js'
import FirebaseDB from './db_driver/index.js'
import Cart from './cart.js'
import Users from './users.js'
import Products from './products.js'
import Collections from './collections.js'
import Tags from './tags.js'
import Orders from './orders.js'
import StoreFronts from './store-fronts.js'
import Checkout from './checkout.js'
import { materializeConfig } from './firebase'
import { LS } from './common/utils/browser.js'
import './js-docs-types.js'

export class ShelfSDK {
  
  _has_init = false

  constructor() {
  }

  /**
   * 
   * @param {import('./firebase').FirebaseConfig} firebaseConfig 
   */
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
    this.checkout = new Checkout(this)
    this.store_fronts = new StoreFronts(this)

    this.auth.init()
    this.cart.init()
    this._has_init = true
  }

  get hasInit() {
    return this._has_init
  }
}


// export const shelf = new ShelfSDK()

/**@type {ShelfSDK} */
let shelf = new ShelfSDK()

const CONFIG_KEY = `shelf_client_latest_config`

export const hasInit = () => { 
  return shelf && shelf.hasInited
}

/**
 * 
 * @param {import('./firebase').FirebaseConfig} config 
 * @returns 
 */
export const initShelf = (config) => {
  // console.trace()
  console.log('Initing Client Shelf SDK with config')
  shelf.init(config)
  // save config
  LS.set(CONFIG_KEY, config)
  return shelf
}

/**
 * 
 * @returns {import('./firebase').FirebaseConfig}
 */
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
