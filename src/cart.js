import { ShelfSDK } from '.'
import { LS } from './common/utils/browser'
const STORAGE_KEY = 'shelf_client_cart'

const initialState = () => {
  return {
    time: new Date().getTime(),
    items: [] // [{count, id, data}]
  }
}

export default class Cart {

  subscribers = new Set()
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

    // load saved user
    this.cart = LS.get(STORAGE_KEY) ?? initialState()

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
    for(let s of this.subscribers)
      s({...this.cart})
  }
  
  add_sub = cb => {
    this.subscribers.add(cb)
    return () => {
      this.subscribers.delete(cb)
    }
  }

  _broadcast = () => {
    this.broadcast_channel.postMessage({...this.cart})
  }

  _notify_and_broadcast = () => {
    this.notify_subscribers()
    this._broadcast()
  }

  get = () => this.cart
  reset = () => {
    LS.remove(STORAGE_KEY)
    this.cart = initialState()
    this._notify_and_broadcast()
  }

  getLineitem = (id) => {
    for (const item of this.cart.items)
      if(item.id===id) 
        return item
    return undefined
  }
  
  removeLineItem = (id) => {
    let item = undefined
    for (let ix = 0; ix < this.cart.items.length; ix++) {
      item = this.cart.items[ix]
      if(item.id===id)
        this.cart.items.splice(ix, 1)
    }
    this._notify_and_broadcast()
    return item
  }
  
  updateLineItem = (id, qty, max_qty=Number.MAX_SAFE_INTEGER) => {
    if(qty===0)
      return this.removeLineItem(id)
  
    const item = this.getLineitem(id)
    if(item) {
      item.qty =  Math.min(qty, max_qty)
      this._notify_and_broadcast()
      return item
    }
    return undefined
  }
  
  addLineItem = (id, qty, max_qty=Number.MAX_SAFE_INTEGER, data) => {
    let item = this.getLineitem(id)
    if(item) {
      item.qty =  Math.min(item.qty+qty, max_qty)
      item.data = data
    } else { // otherwise
      item = { qty : Math.min(qty, max_qty), id, data }
      this.cart.items.push(item)
    }
    this._notify_and_broadcast()
    return item
  }
  
  total = () => this.cart.items.reduce((prev, cur) => (prev + cur.qty*cur.data.price), 0)
}