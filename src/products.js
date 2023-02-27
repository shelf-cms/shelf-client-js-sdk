
// https://firebasestorage.googleapis.com/v0/b/wushwushgames-14ee2.appspot.com/o/collections%2Fps2-games.json?alt=media

import { ShelfSDK } from "."

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
   * @returns 
   */
  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  /**
   * 
   * @param {string} handle 
   * @returns 
   */
  byHandle = handle => {
    return this.db.doc(NAME, handle).get()
  }

  /**
   * 
   * @param {string} limit 
   * @param  {...any} search terms 
   * @returns 
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
   * @param  {...any} tags 
   * @returns 
   */
  byTags = (limit=25, ...tags) => {
    const search = tags.map(t => `tag:${t}`)
    return this.bySearch(limit, ...search) 
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...any} collections 
   * @returns 
   */
  byCollections = (limit=25, ...collections) => {
    const search = collections.map(t => `col:${t}`)
    return this.bySearch(limit, ...search) 
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...any} kvs 
   * @returns 
   */
  byCategory = (limit=25, ...kvs) => {
    const tags = kvs.map(kv => `${kv[0]}_${kv[1]}`)
    return this.byTags(limit, ...tags) 
  }


}