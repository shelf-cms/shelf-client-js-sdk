import { ShelfSDK } from '.'
import { CollectionData, CollectionExportedData } from './js-docs-types'

const NAME = 'collections'

export default class Collections {

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
   * @param {string} handle 
   * @returns {Promise<CollectionExportedData>}
   */
  byExportedCollection = handle => {
    const json = encodeURIComponent(`collections/${handle}`) + '.json?alt=media'
    const url = `${this.bucket}/o/${json}`
    // console.log('url ', url)
    return fetch(url)
        .then(res => res.json())
  }

  /**
   * 
   * @param {string} id 
   * @returns {Promise<[boolean, string, CollectionData]>}
   */
  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  /**
   * 
   * @param {string} handle 
   * @returns {Promise<[boolean, string, CollectionData]>}
   */
  byHandle = handle => {
    return this.db.doc(NAME, handle).get()
  }

  /**
   * 
   * @param {number} limit 
   * @param  {...string} terms 
   * @returns {()=>Promise<[string, CollectionData][]>} a one promise or next handler iterator
   */
  bySearch = (limit=25, ...terms) => {
    const q = {
      where: [ ['search', 'array-contains-any', terms] ],
      orderBy: [ ['updateAt', 'desc'] ],
      limit
    }
    return this.db.col(NAME).paginate2(q)
  }

}