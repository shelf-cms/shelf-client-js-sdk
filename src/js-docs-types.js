
// misc

/**
 * @typedef {object} AttributeData
 * @property {string} key
 * @property {string} val
 */
export const AttributeData = {}


// products

/** 
 * @typedef {object} ProductData
 * @property {AttributeData[]} attributes
 * @property {string[]} collections
 * @property {string} video
 * @property {number} price
 * @property {string} handle a unique readable identifier
 * @property {string[]} search
 * @property {string[]} tags
 * @property {string} desc
 * @property {string[]} media
 * @property {number} updatedAt
 * @property {number} qty
 * @property {string} title
 * @property {number} createdAt
 * @property {number} compareAtPrice
 */
export const ProductData = {}


// collections

/** 
 * @typedef {object} CollectionData
 * @property {AttributeData[]} attributes
 * @property {string[]} tags
 * @property {number} updatedAt
 * @property {number} createdAt
 * @property {string[]} media
 * @property {string} handle
 * @property {string} title
 * @property {string[]} search
 * @property {string} desc
 * 
 */
export const CollectionData = {}

/** 
 * @typedef {object} ADD_PRODUCTS
 * @property {ProductData[]} products blah
 * 
 * 
 * @typedef { CollectionData & ADD_PRODUCTS} CollectionExportedData
 */
export const CollectionExportedData = {}

// store-front

/** 
 * @typedef {object} StorefrontData
 * @property {string} handle
 * @property {AttributeData[]} attributes
 * @property {string[]} collections
 * @property {object} exported_collections
 * @property {string[]} exported_collections.items
 * @property {object} exported_collections.info
 * @property {number} exported_collections.info.exportProductsCount
 * @property {string[]} discounts
 * @property {string} title
 * @property {string} _published
 * @property {string[]} media
 * @property {string[]} products
 * @property {string[]} shipping_methods
 * @property {number} createdAt
 * @property {string[]} search
 * @property {number} updatedAt
 * @property {string} desc
 * @property {string} video
 * @property {string[]} tags
 */
export const StorefrontData = {}

/** 
 * @typedef {object} StorefrontExportData
 * @property {string} handle
 * @property {CollectionData} collections
 * @property {CollectionExportedData[]} exported_collections
 * @property {DiscountData[]} discounts
 * @property {ProductData[]} products
 * @property {ShippingData[]} shipping_methods
 * @property {string} title
 * @property {string} _published
 * @property {string[]} media
 * @property {number} createdAt
 * @property {string[]} search
 * @property {number} updatedAt
 * @property {string} desc
 * @property {string} video
 * @property {string[]} tags
 */
export const StorefrontExportData = {}


// discounts
/** 
 * @typedef {object} DiscountApplication 
 * @property {number} id unique identifier for filter
 * @property {string} name readable short name
 * 
 */
export const DiscountApplication = {}

/**
 * @typedef {object} FilterMeta 
 * @property {number} id unique identifier for filter
 * @property {'product'|'order'} type product/order class
 * @property {string} op operation identifier
 * @property {string} name readable short name
 * 
 */
export const FilterMeta = {}

/** 
 * @typedef {object} DiscountMeta 
 * @property {number} id unique identifier for filter
 * @property {string} type textual identifier
 * @property {string} name readable short name
 * 
 */
export const DiscountMeta = {}

/** 
 * @typedef {object} RegularDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 */
export const RegularDiscountExtra = {}

/** 
 * @typedef {object} OrderDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 * @property {boolean} free_shipping
 */
export const OrderDiscountExtra = {}

/** 
 * @typedef {object} BulkDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 * @property {number} qty
 * @property {boolean} recursive
 */
export const BulkDiscountExtra = {}

/** 
 * @typedef {object} DiscountDetails
 * @property {DiscountMetaEnum} meta
 * @property {RegularDiscountExtra|OrderDiscountExtra|BulkDiscountExtra} info.discount.extra
 */
export const DiscountDetails = {}

/** 
 * @typedef {object} Filter
 * @property {FilterMeta} meta meta data related to identifying the filter
 * @property {string[]|object} value
 * @property {number} value.from
 * @property {number} value.to
 */
export const Filter = {}

/** 
 * @typedef {object} DiscountData
 * @property {object} info
 * @property {AttributeData[]} attributes
 * @property {DiscountDetails} info.details
 * @property {Filter[]} info.filters
 * @property {DiscountApplicationEnum} application
 * @property {number} createdAt
 * @property {string[]} search
 * @property {number} updatedAt
 * @property {string[]} media
 * @property {string} code a unique readable code
 * @property {boolean} enabled
 * @property {number} order
 * @property {string} title
 * @property {string} _published
 * @property {string[]} tags
 * @property {string} desc
 */
export const DiscountData = {}


/** 
 * @enum {DiscountApplication} 
 */
export const DiscountApplicationEnum = {
  Auto:   { id: 0, name: 'Automatic'},
  Manual: { id: 1, name: 'Manual'},
}

/**
 * @enum {FilterMeta} 
 */
export const FilterMetaEnum = { 
  p_in_collections: { 
    id: 0, type:'product', 
    op: 'p-in-collections', 
    name: 'Product In Collection'
  },
  p_not_in_collections: { 
    id: 1, type:'product', 
    op: 'p-not-in-collections', 
    name: 'Product not in Collection'
  },
  p_in_handles: {
    id: 2, type:'product', 
    op: 'p-in-handles', 
    name: 'Product has ID'
  },
  p_not_in_handles: { 
    id: 3, type:'product', 
    op: 'p-not-in-handles', 
    name: 'Product excludes ID'
  },
  p_in_tags: { 
    id: 4, type:'product', 
    op: 'p-in-tags', 
    name: 'Product has Tag'
  },
  p_not_in_tags: {
    id: 5, type:'product', 
    op: 'p-not-in-tags', 
    name: 'Product excludes Tag'
  },    
  p_all: {
    id: 6, type:'product', 
    op: 'p-all', name: 'All Products'
  },    
  p_in_price_range: {
    id: 7, type:'product', 
    op: 'p_in_price_range', 
    name: 'Product in Price range'
  },    
  o_subtotal_in_range: {
    id: 100, type:'order', 
    op: 'o-subtotal-in-range', 
    name: 'Order subtotal in range'
  },    
  o_items_count_in_range: {
    id: 101, type:'order', 
    op: 'o-items-count-in-range', 
    name: 'Order items count in range'
  },    
  o_date_in_range: {
    id: 102, type:'order', 
    op: 'o-date-in-range', 
    name: 'Order in dates'
  },    
  o_has_customer: {
    id: 103, type:'order', 
    op: 'o-has-customer', 
    name: 'Order has Customers'
  },    
}

/** 
 * @enum {DiscountMeta} 
 */
export const DiscountMetaEnum = {
  regular: { 
    id: 0, 
    type: 'regular',          
    name : 'Regular Discount', 
  },
  bulk: { 
    id: 1, type: 'bulk',          
    name : 'Bulk Discount', 
  },
  buy_x_get_y: { 
    id: 2, type: 'buy_x_get_y' ,  
    name : 'Buy X Get Y (NA)',
  },
  order: { 
    id: 3, type: 'order', 
    name : 'Order Discount',
  },
}


// images

/** 
 * @typedef {object} ImageData
 * @property {string} handle
 * @property {string} name
 * @property {string} url
 * @property {string[]} search
 * @property {string[]} usage
 * @property {number} updatedAt
 */
export const ImageData = {}

// tags

/** 
 * @typedef {object} TagData
 * @property {string[]} values
 * @property {string[]} search
 * @property {number} updatedAt
 * @property {string} name
 * @property {number} createdAt
 * @property {string} desc
 */
export const TagData = {}

// users

/** 
 * @typedef {object} Address
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} company
 * @property {string} street1
 * @property {string} street2
 * @property {string} city
 * @property {string} country
 * @property {string} state
 * @property {string} zip_code
 * @property {string} postal_code
 */
export const Address = {}

/** 
 * @typedef {object} UserData
 * @property {string} lastname
 * @property {string} firstname
 * @property {number} updatedAt
 * @property {string} email
 * @property {string[]} search
 * @property {number} createdAt
 * @property {Address} address
 * @property {string} uid authentication user id
 * @property {string} phone_number
 * @property {string[]} tags
 */
export const UserData = {}


// orders

/** 
 * @typedef {object} FulfillOptions
 * @property {number} id
 * @property {string} name
 * @property {string} name2
 * 
 */
export const FulfillOptions = {}

/** 
 * @typedef {object} PaymentOptions
 * @property {number} id
 * @property {string} name
 * @property {string} name2
 * 
 */
export const PaymentOptions = {}

/** 
 * @enum {FulfillOptions} 
 */
export const FulfillOptionsEnum = {
  draft: { 
    id: 0, name2: 'drafts', name: 'Draft'
  },
  processing: { 
    id: 1, name2: 'processing' ,name: 'Processing (Stock Reserved)'
  },
  fulfilled: { 
    id: 2, name2: 'fulfilled', name: 'Fulfilled' 
  },
  cancelled: { 
    id: 3, name2: 'cancelled', name: 'Cancelled (Stock returned)' 
  }
}

/** 
 * @enum {PaymentOptions} 
 */
export const PaymentOptionsEnum = {
  paid: { 
    id: 0, name: 'Paid', name2: 'paid'
  },
  unpaid: { 
    id: 1, name: 'Unpaid', name2: 'unpaid'
  },
  partially_paid: { 
    id: 2, name: 'Partially paid', name2: 'partially paid' 
  },
  refunded: { 
    id: 3, name: 'Refunded', name2: 'refunded' 
  },
  partially_refunded: { 
    id: 4, name: 'Partially Refunded', name2: 'partially refunded' 
  },
}


/** 
 * @typedef {object} LineItem
 * @property {string} id
 * @property {number} price
 * @property {number} qty
 * @property {number} stock_reserved
 * @property {ProductData} data 
 **/ 
export const LineItem = {}

/**
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
 * @typedef {object} DiscountError
 * @property {string} discount_code
 * @property {string} message
 * 
 * 
 * @typedef {object} PricingData
 * @property {EvoEntry[]} evo
 * @property {string} uid
 * @property {ShippingData} shipping_method
 * @property {number} subtotal_undiscounted total of items price before discounts
 * @property {number} subtotal_discount total of items price after discounts
 * @property {number} subtotal subtotal_undiscounted - subtotal_discount
 * @property {number} total subtotal + shipping
 * @property {number} total_quantity
 * @property {DiscountError[]} errors
 */
export const PricingData = {}
export const EvoEntry = {}

/** 
 * @typedef {object} OrderData
 * @property {string[]} search
 * @property {object} status
 * @property {PaymentOptions} status.payment
 * @property {FulfillOptions} status.fulfillment
 * @property {object} contact
 * @property {string} contact.phone
 * @property {string} contact.email
 * @property {string} contact.uid
 * @property {LineItem[]} line_items
 * @property {string} id
 * @property {number} createdAt
 * @property {Address} address
 * @property {number} updatedAt
 * @property {string} notes
 * @property {object} delivery
 * @property {string} delivery.name
 * @property {number} delivery.price
 * @property {DiscountData[]} coupons
 * @property {PricingData} pricing
 * @property {object} payment_gateway
 * @property {string} payment_gateway.gateway_id
 */
export const OrderData = {}


// posts

/** 
 * @typedef {object} PostData
 * @property {number} createdAt
 * @property {string} title
 * @property {string[]} search
 * @property {string} handle
 * @property {number} updatedAt
 * @property {string} text
 * @property {string[]} media
 */
export const PostData = {}


// shipping methods

/** 
 * @typedef {object} ShippingData
 * @property {string} id
 * @property {number} price
 * @property {number} updatedAt
 * @property {number} createdAt
 * @property {string} name
 * @property {string} desc
 * @property {string[]} media
 * @property {string[]} tags
 * @property {AttributeData[]} attributes
 */
export const ShippingData = {}


// stats

/** 
 * @typedef {object} MovingStatsProduct
 * @property {string} handle product handle
 * @property {string} title product title
 * @property {number} val count of product
 */
export const MovingStatsProduct = {}

/**
 * @typedef {object} MovingStatsDay
 * @property {number} total total income in day
 * @property {number} orders total orders in day
 * @property {number} orders total orders in day
 * @property {number} day start of day in UTC millis
 * @property {Object.<string, number>} discounts a map between discount code to count
 * @property {Object.<string, number>} collections a map between collection handle to count
 * @property {Object.<string, number>} tags a map between tag name to count
 * @property {Object.<string, MovingStatsProduct>} products a map between product handle to product stat data
 */ 
export const MovingStatsDay = {}

/** 
 * @typedef {object} MovingStatsInfo
 * @property {number} maxOrderTime latest order time, that was recorded (used for optimization)
 * @property {Object.<number, MovingStatsDay>} days map start of days to stats
 */
export const MovingStatsInfo = {}


/** 
 * @typedef {object} MovingStatsData
 * @property {MovingStatsInfo} info
 * @property {number} fromDay from start of day (millis)
 * @property {number} toDay to an end of day (millis)
 * @property {number} updatedAt when updated (millis)
 */
export const MovingStatsData = {}

/** 
 * @typedef {object} CartData
 * @property {string} id
 * @property {number} createdAt
 * @property {LineItem[]} line_items
 */
export const CartData = {}