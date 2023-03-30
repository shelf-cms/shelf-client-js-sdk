import { v4 as uuidv4 } from 'uuid'
import { CartData, ProductData, 
         LineItem } from './js-docs-types.js'
import { ShelfSDK } from './index.js'
import { LS } from './common/utils/browser.js'
const STORAGE_KEY = 'shelf_client_cart'

/**
 * @returns {CartData}
 */
const initialState = () => {
  return {
    id: uuidv4(),
    createdAt: new Date().getTime(),
    line_items: [] // [{count, id, data}]
  }
}

export default class Cart {

  subscribers = new Set()

  /** @type {CartData} */
  cart = initialState()

  /**
   * 
   * @param {ShelfSDK} context 
   */
  constructor(context) {
    this.context = context
    this.broadcast_channel = new BroadcastChannel(STORAGE_KEY)
  }

  init() {
    //
    this.broadcast_channel.onmessage = (e) => {
      this._update_and_notify_subscribers(e.data)
    }

    // load saved cart
    /** @type {CartData} */
    this.cart = { ...initialState(), ...LS.get(STORAGE_KEY) }
    console.log('cart ', this.cart)

    const save = () => {
      LS.set(STORAGE_KEY, this.cart)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', save)
      window.addEventListener('beforeunload', save)
    }

    this.notify_subscribers()
  }

  notify_subscribers = () => {
    const c = { ...this.cart }
    this.subscribers.forEach(cb => cb(c))
  }
  
  add_sub = cb => {
    this.subscribers.add(cb)
    return () => {
      this.subscribers.delete(cb)
    }
  }

  /**
   * @param {CartData} newCart 
   */
  _update_and_notify_subscribers = newCart => {
    this.cart = newCart
    this.notify_subscribers()
  }

  _broadcast = () => {
    this.broadcast_channel.postMessage({...this.cart})
  }

  _notify_and_broadcast = () => {
    this.notify_subscribers()
    this._broadcast()
  }

  /**
   * 
   * @returns {CartData}
   */
  get = () => this.cart
  reset = () => {
    LS.remove(STORAGE_KEY)
    this.cart = initialState()
    this._notify_and_broadcast()
  }

  /**
   * 
   * @param {string} id 
   * @returns {LineItem | undefined }
   */
  getLineitem = (id) => {
    return this.cart.line_items.find(it => it.id===id)
  }
  
  /**
   * 
   * @param {string} id 
   * @returns {LineItem | undefined }
   */
  removeLineItem = (id) => {
    const idx = this.cart.line_items.findIndex(it => it.id===id)
    if(idx>=0) {
      this.cart.line_items.splice(idx, 1)
      this._notify_and_broadcast()
    }
    return this.cart.line_items?.[idx]
  }
  
  /**
   * 
   * @param {string} id 
   * @param {number} qty 
   * @param {number} max_qty 
   * @param {ProductData | undefined} data 
   * @returns {LineItem | undefined }
   */
  updateLineItem = (id, qty, max_qty=Number.MAX_SAFE_INTEGER, data) => {
    if(qty===0)
      return this.removeLineItem(id)
  
    const item = this.getLineitem(id)
    
    if(item) {
      item.qty = Math.min(qty, max_qty)
      item.data = data ?? item.data
      this._notify_and_broadcast()  
    }
    return item
  }
  
  /**
   * 
   * @param {string} id 
   * @param {number} qty 
   * @param {number} max_qty 
   * @param {ProductData | undefined} data 
   * @returns {LineItem | undefined}
   */
  addLineItem = (id, qty, max_qty=Number.MAX_SAFE_INTEGER, data) => {
    let item = this.getLineitem(id)
    if(item)
      return this.updateLineItem(item.id, item.qty+qty, max_qty, data)

    item = { 
      qty : Math.min(qty, max_qty), 
      id, data 
    }

    this.cart.line_items.push(item)
    this._notify_and_broadcast()

    return item
  }
  
  /**
   * 
   * @returns {number} total charge amount of line items
   */
  total = () => 
    this.cart.line_items.reduce(
      (prev, cur) => (prev + cur.qty * cur.data.price), 0
    )
}