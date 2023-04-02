
import { ShelfSDK } from './index.js'
import { ProductData } from './js-docs-types.js'

const NAME = 'products'

export default class Products {

  /**
   * 
   * @param {ShelfSDK} context 
   */
  constructor(context) {
    this.context = context
    this.db = context.db
    this.bucket = `https://firebasestorage.googleapis.com/v0/b/${context.firebase.config.storageBucket}`
  }

  init() {
  }

  /**
   * 
   * @param {string} collection_handle 
   * @returns 
   */
  byCollectionHandle = collection_handle => {
    const json = encodeURIComponent(`collections/${collection_handle}`) + '.json?alt=media'
    const url = `${this.bucket}/o/${json}`
    // console.log('url ', url)
    return fetch(url)
        .then(res => res.json())
  }

  /**
   * 
   * @param {string} id 
   * @returns {Promise<[boolean, string, ProductData]>}
   */
  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  /**
   * 
   * @param {string} handle 
   * @returns {Promise<[boolean, string, ProductData]>}
   */
  byHandle = handle => {
    return this.db.doc(NAME, handle).get()
  }

  /**
   * 
   * @param {string} limit 
   * @param  {...string} search terms 
   * @returns {()=>Promise<[string, ProductData][]>} a one promise or next handler iterator
   */
  bySearch = (limit=25, ...terms) => {
    const q = {
      where: [ ['search', 'array-contains-any', terms] ],
      orderBy: [ ['updateAt', 'desc'] ],
      limit
    }
    return this.db.col(NAME).paginate2(q)
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...string} tags 
   * @returns {()=>Promise<[string, ProductData][]>} a one promise or next handler iterator
   */
  byTags = (limit=25, ...tags) => {
    const search = tags.map(t => `tag:${t}`)
    return this.bySearch(limit, ...search) 
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...string} collections 
   * @returns {()=>Promise<[string, ProductData][]>} a one promise or next handler iterator
   */
  byCollections = (limit=25, ...collections) => {
    const search = collections.map(t => `col:${t}`)
    return this.bySearch(limit, ...search) 
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...string} kvs 
   * @returns {()=>Promise<[string, ProductData][]>} a one promise or next handler iterator
   */
  byCategory = (limit=25, ...kvs) => {
    const tags = kvs.map(kv => `${kv[0]}_${kv[1]}`)
    return this.byTags(limit, ...tags) 
  }


}