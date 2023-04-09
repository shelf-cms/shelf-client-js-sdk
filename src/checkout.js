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
 * @property {EvoEntry[]} evo
 * @property {string} uid
 * @property {ShippingData} shipping_method
 * @property {number} subtotal_undiscounted total of items price before discounts
 * @property {number} subtotal_discount total of items price after discounts
 * @property {number} subtotal subtotal_undiscounted - subtotal_discount
 * @property {number} total subtotal + shipping
 * @property {number} total_quantity
 * @property {DiscountError[]} errors
 * 
 * @typedef {object} CheckoutData
 * @property {ReserveResult} reserve
 * @property {DiscountContext} pricing
 * @property {object} payment_gateway
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
  init : { name: 'init' },
  ready : { name: 'ready' },
  created : { name: 'created' },
  final : { name: 'final' },
}

export class Session {
  /**@type {string | undefined} */
  _gateway_id = undefined
  _status = Status.init.name
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
  get isIniting() { 
    return this.status===Status.init.name
  }
  get isReady() { 
    return this.status===Status.ready.name
  }
  get isCreated() { 
    return this.status===Status.created.name
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
   * Init the checkout session
   */
  init = async (gateway_id) => {
    try {
      if(!gateway_id)
        throw new Error('no-gateway')

      this._gateway_id = gateway_id
      this._status = Status.init.name
      const ctx = this._ctx
      const sf = await ctx.store_fronts.byExported('main')
      const sorted_shipping_methods = sf?.shipping_methods?.sort(
        (a, b) => a.price-b.price
      )
      this._cart = ctx.cart.get()
      this._shipping_methods = sorted_shipping_methods
      this._status = Status.ready.name
      this._checkout = undefined
    } catch (e) {
      console.error(e)
      this._errors = [e]
      throw this.errors
    } finally {
      this.notify_subscribers()
    }

  }

  _get_url = (v) => {
    const HOST = process.env.NEXT_PUBLIC_BACKEND_HOST
    return `${HOST}/${this._ctx.firebase.config.projectId}/us-central1/${v}`
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
      this._errors = []
      if(!this.isReady)
        throw Error('checkout-not-ready')

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

      // console.log('checkout_body ', checkout_body)

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
      this.notify_subscribers()
    }

  }

  /**
   * 
   * @returns {FinalizeCheckoutResult}
   */
  finalizeCheckout = 
    async () => {
    try {
      if(!this.isCreated)
        throw new Error('cannot-finalize')

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
      this.notify_subscribers()
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
    const invalid = s===undefined || s?.isFinalized
    if(invalid) {
      this._session = new Session(this.context)
    }
    return this._session
  }

}