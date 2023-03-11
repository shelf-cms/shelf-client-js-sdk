
// misc

/**
 * @typedef {object} AttributeData
 * @property {string} key
 * @property {string} val
 */


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


// collections

/** 
 * @typedef {object} CollectionData
 * @property {AttributeData[]} attributes
 * @property {string[]} tags
 * @property {number} updatedAt
 * @property {string[]} media
 * @property {string} handle
 * @property {string} title
 * @property {string[]} search
 * @property {string} desc
 * 
 */

/** 
 * @typedef {object} ADD_PRODUCTS
 * @property {ProductData[]} products blah
 * 
 * 
 * @typedef { CollectionData & ADD_PRODUCTS} CollectionExportedData
 */

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
 * @property {number} createdAt
 * @property {string[]} search
 * @property {number} updatedAt
 * @property {string} desc
 * @property {string} video
 * @property {string[]} tags
 */

/** 
 * @typedef {object} StorefrontExportData
 * @property {string} handle
 * @property {CollectionData} collections
 * @property {CollectionExportedData[]} exported_collections
 * @property {DiscountData[]} discounts
 * @property {ProductData[]} products
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


// discounts
/** 
 * @typedef {object} DiscountApplication 
 * @property {number} id unique identifier for filter
 * @property {string} name readable short name
 * 
 */

/**
 * @typedef {object} FilterMeta 
 * @property {number} id unique identifier for filter
 * @property {'product'|'order'} type product/order class
 * @property {string} op operation identifier
 * @property {string} name readable short name
 * 
 */

/** 
 * @typedef {object} DiscountMeta 
 * @property {number} id unique identifier for filter
 * @property {string} type textual identifier
 * @property {string} name readable short name
 * 
 */

/** 
 * @typedef {object} RegularDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 */

/** 
 * @typedef {object} OrderDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 * @property {boolean} free_shipping
 */

/** 
 * @typedef {object} BulkDiscountExtra
 * @property {number} fixed
 * @property {number} percent
 * @property {number} min
 * @property {number} max
 * @property {boolean} recursive
 */

/** 
 * @typedef {object} DiscountDetails
 * @property {DiscountMetaEnum} meta
 * @property {RegularDiscountExtra|OrderDiscountExtra|BulkDiscountExtra} info.discount.extra
 */

/** 
 * @typedef {object} Filter
 * @property {FilterMeta} meta meta data related to identifying the filter
 * @property {string[]|object} value
 * @property {number} value.from
 * @property {number} value.to
 */

/** 
 * @typedef {object} DiscountData
 * @property {object} info
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


// orders

/** 
 * @typedef {object} FulfillOptions
 * @property {number} id
 * @property {string} name
 * @property {string} name2
 * 
 */

/** 
 * @typedef {object} PaymentOptions
 * @property {number} id
 * @property {string} name
 * @property {string} name2
 * 
 */

/** 
 * @typedef {object} LineItem
 * @property {number} price
 * @property {number} qty
 * @property {boolean} stock_reserved
 * @property {ProductData} data 
 **/ 

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
 * @property {number} total_price
 * @property {string} id
 * @property {number} createdAt
 * @property {Address} address
 * @property {number} updatedAt
 * @property {string} notes
 * @property {object} delivery
 * @property {string} delivery.name
 * @property {number} delivery.price
 * @property {string[]} discounts
 */


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


// shipping methods

/** 
 * @typedef {object} ShippingData
 * @property {string} id
 * @property {number} price
 * @property {number} updatedAt
 * @property {string} name
 */


// stats

/** 
 * @typedef {object} MovingStatsProduct
 * @property {string} handle product handle
 * @property {string} title product title
 * @property {number} val count of product
 */

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

/** 
 * @typedef {object} MovingStatsInfo
 * @property {number} maxOrderTime latest order time, that was recorded (used for optimization)
 * @property {Object.<number, MovingStatsDay>} days map start of days to stats
 */


/** 
 * @typedef {object} MovingStatsData
 * @property {MovingStatsInfo} info
 * @property {number} fromDay from start of day (millis)
 * @property {number} toDay to an end of day (millis)
 * @property {number} updatedAt when updated (millis)
 */
