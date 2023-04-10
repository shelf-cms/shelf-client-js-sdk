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

/**
 * @typedef {object} ShelfConfig
 * @property {import('./firebase').FirebaseConfig} firebase firebase config
 * @property {string} backend_endpoint backend endpoint entry
 */

export class ShelfSDK {
  
  _has_init = false
  /**@type {ShelfConfig} */
  _config = undefined

  constructor() {
  }

  config = () => {
    return this._config
  }

  /**
   * 
   * @param {ShelfConfig} config 
   */
  init(config) {
    this._config = config
    this.firebase = materializeConfig(config.firebase)
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

/**@type {ShelfSDK} */
let shelf = new ShelfSDK()

const CONFIG_KEY = `shelf_client_latest_config`

export const hasInit = () => { 
  return shelf && shelf.hasInited
}

/**
 * 
 * @param {ShelfConfig} config 
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
 * @returns {ShelfConfig}
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
