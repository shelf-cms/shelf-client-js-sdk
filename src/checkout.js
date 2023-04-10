import { ShelfSDK } from './index.js'
import { Address, CartData, 
  ShippingData, UserData } from './js-docs-types.js'

/**
 * 
 * @typedef {object} EvoEntry
 * @property {DiscountData} discount discount data
 * @property {string} discount_code
 * @property {number} total_discount total discount at this stage
 * @property {number} quantity_undiscounted how many items are left to discount
 * @property {number} quantity_discounted how many items were discounted now
 * @property {number} subtotal running subtotal without shipping
 * @property {number} total running total
 * @property {LineItem[]} line_items available line items after discount
 * 
 * @typedef {object} CheckoutRequest
 * @property {LineItem[]} line_items
 * @property {string} id
 * @property {string} gateway_id
 * @property {ShippingData} shipping_method
 * @property {UserData} user 
 * @property {Address} address 
 * 
 * @typedef {object} ReserveResult
 * @property {number?} reserved_until
 * @property {AvailabilityReport?} report
 * @property {string} checkoutId
 * @property {LineItem[]} line_items
 * 
 * @typedef {object} DiscountContext
 * @property {EvoEntry[]} evo evolution of discounts applications
 * @property {string} uid user id
 * @property {ShippingData} shipping_method selected shipping method
 * @property {number} subtotal_undiscounted total of items price before discounts
 * @property {number} subtotal_discount total of items price after discounts
 * @property {number} subtotal subtotal_undiscounted - subtotal_discount
 * @property {number} total subtotal + shipping
 * @property {number} total_quantity total quantity of items in order
 * @property {DiscountError[]} errors
 * 
 * @typedef {object} CheckoutData
 * @property {ReserveResult} reserve items temporal reservation results
 * @property {DiscountContext} pricing pricing result
 * @property {object} payment_gateway everything about payment gateway
 * @property {number} createdAt
 * @property {boolean} status
 * @property {string} id
 * 
 * @typedef {object} FinalizeCheckoutResult
 * @property {string} orderId
 * 
 */
export const CheckoutData = {}
export const FinalizeCheckoutResult = {}
export const DiscountContext = {}
export const ReserveResult = {}
export const CheckoutRequest = {}

const isEmailValid = (value) => {
  let re = /\S+@\S+\.\S+/;
  return re.test(value)
}

/**
 * @typedef {object} CheckoutError
 * @typedef {'address-invalid' | 'email-invalid'} message
 */

/**
 * @typedef {object} CheckoutStatus
 * @property {string} CheckoutStatus.name
 * 
 * @enum {CheckoutStatus}
 */
export const Status = {
  not_initialized : { name: 'not_initialized' },
  initialized : { name: 'initialized' },
  // ready : { name: 'ready' },
  created : { name: 'created' },
  final : { name: 'final' },
}

export class Session {
  /**@type {string | undefined} */
  _gateway_id = undefined
  _status = Status.not_initialized.name
  _loading = false
  /**@type {string[]} */
  _errors = []
  /**@type {CartData} */
  _cart = undefined
  /**@type {string | undefined} */
  _orderId = undefined
  /**@type {CheckoutData} */
  _checkout = undefined
  /**@type {ShippingData[]} */
  _shipping_methods = []
  _subscribers = new Set()

  /**
   * 
   * @param {ShelfSDK} ctx 
   */
  constructor(ctx) {
    this._ctx = ctx
  }

  get loading() {
    return this._loading
  }
  get status() {
    return this._status
  }
  get cart() {
    return this._cart
  }
  get checkout() {
    return this._checkout
  }
  get errors() {
    return this._errors
  }
  get shipping_methods() {
    return this._shipping_methods
  }
  get orderId() {
    return this._orderId
  }
  get isInitialized() { 
    return this.status!==Status.not_initialized.name
  }
  get isInitializing() { 
    return this.isNotInitialized && this.loading
  }
  get isNotInitialized() { 
    return this.status===Status.not_initialized.name
  }
  get isCreated() { 
    return this.status===Status.created.name
  }
  get isCreating() { 
    return this.isInitialized && this.loading
  }
  get isFinalizing() { 
    return this.isCreated && this.loading
  }
  get isFinalized() { 
    return this.status===Status.final.name
  }

  notify_subscribers = () => {
    this._subscribers.forEach(cb => cb(this))
  }
  
  add_sub = cb => {
    this._subscribers.add(cb)
    return () => {
      this._subscribers.delete(cb)
    }
  }

  /**
   * @param {string} v 
   */
  _get_url = (v) => {
    let backend_entry = this._ctx.config().backend_endpoint
    if(backend_entry.endsWith('/'))
      backend_entry = backend_entry.slice(0, -1)
    if(v.startsWith('/'))
      v = v.slice(1)
    return `${backend_entry}/${v}`
    // const HOST = process.env.NEXT_PUBLIC_BACKEND_HOST
    // return `${HOST}/${this._ctx.firebase.config.projectId}/us-central1/${v}`
  }

  _start_loading = () => {
    this._errors = []
    this._loading = true
    this.notify_subscribers()
  }

  _end_loading = () => {
    this._loading = false
    this.notify_subscribers()
  }

  _throw_if_loading = () => {
    if(this.loading)
      throw new Error('checkout-loading-state')
  }

  reset = () => {
    this._status = Status.not_initialized.name
    this._checkout = undefined
    this.notify_subscribers()
  }

  /**
   * Init or reset the checkout session
   */
  init = async (gateway_id) => {
    try {
      this._throw_if_loading()
      if(!gateway_id)
        throw new Error('no-gateway')

      if(this.isInitialized)
        return

      // 
      this._gateway_id = gateway_id
      this._status = Status.not_initialized.name
      this._start_loading()
      //

      const ctx = this._ctx
      const sf = await ctx.store_fronts.byExported('main')
      const sorted_shipping_methods = sf?.shipping_methods?.sort(
        (a, b) => a.price-b.price
      )

      this._cart = ctx.cart.get()
      this._shipping_methods = sorted_shipping_methods
      this._status = Status.initialized.name
      this._checkout = undefined
    } catch (e) {
      console.error(e)
      this._errors = [e]
      throw this.errors
    } finally {
      this._end_loading()
    }

  }

  /**
   * 
   * @param {UserData} user 
   * @param {Address} address 
   * @param {ShippingData} shipping_method 
   * @param {string[]} coupons
   * @returns {CheckoutData}
   */
  createCheckout = 
    async (user, address, shipping_method, coupons) => {
    
    try {
      this._throw_if_loading()
      this._start_loading()

      if(!this.isInitialized)
        throw Error('checkout-not-initialized')

      // validate input
      // test at least user email
      if(!isEmailValid(user?.email))
        throw Error('email-invalid')
      
      // test address
      const validAddress = address?.city && address?.firstname && 
                            address?.lastname && address?.street1 &&
                            address?.postal_code
      if(!validAddress)
        throw Error('address-invalid')

      /**@type {CheckoutRequest} */
      const checkout_body = {
        line_items: this.cart.line_items?.map(
          li => ({ 
            id: li.id, 
            qty: li.qty, 
            price: li.price ?? li?.data?.price 
          })
        ),
        gateway_id: this._gateway_id,
        coupons,
        shipping_method,
        user,
        address,
        id: this.cart.id
      }

      console.log('checkout_body ', checkout_body)

      const response = await fetch(
        this._get_url('app/create-checkout'),
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkout_body)
        }
      )
      
      /**@type {CheckoutData} */
      const cd = await response.json()

      console.log('checkout ', cd)
      if(response.ok) {
        this._checkout = cd

        // error from the server
        if(!cd.status) {
          if(cd?.reserve?.report?.length)
            throw cd?.reserve?.report
          throw Error('error')
        }

      } else {
        throw cd?.error
      }

      this._status = Status.created.name
      return cd
    } catch (e) {
      const arr = Array.isArray(e) ? e : [{ message: e?.message}]
      console.error(arr)
      this._errors = [...arr, ...this._errors]
      throw this.errors
    } finally {
      this._end_loading()
    }

  }

  /**
   * 
   * @returns {FinalizeCheckoutResult}
   */
  finalizeCheckout = 
    async () => {
    try {
      console.log('finalizeCheckout')
      this._throw_if_loading()
      if(!this.isCreated)
        throw new Error('cannot-finalize')
      
      this._start_loading()

      const body = {
        checkoutId: this.checkout.id,
      }
      const response = await fetch(
        this._get_url('app/pay'), 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      /**@type {FinalizeCheckoutResult} */
      const json = await response.json()

      if(!response.ok) {
        throw json?.error
      }

      console.log('capture ', json)
      this._status = Status.final.name
      this._orderId = json.orderId
      this._ctx.cart.reset()
      return json
    } catch (e) {
      const arr = Array.isArray(e) ? e : [{ message: e?.message}]
      console.error(arr)
      this._errors = [...arr, this.errors]
      throw this.errors
    } finally {
      this._end_loading()
    }
      
  }

}

export default class Checkout {

  /**@type {Session | undefined} */
  _session = undefined
  /**
   * 
   * @param {ShelfSDK} context 
   */
  constructor(context) {
    this.context = context
    this.db = context.db
  }

  init() {
  }

  get session() {
    const s = this._session
    const invalid = true //s===undefined || s?.isFinalized
    if(invalid) {
      this._session = new Session(this.context)
    }
    return this._session
  }

}