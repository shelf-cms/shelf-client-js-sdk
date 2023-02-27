
// https://firebasestorage.googleapis.com/v0/b/wushwushgames-14ee2.appspot.com/o/collections%2Fps2-games.json?alt=media

import { ShelfSDK } from "."

const NAME = 'storefronts'

export default class StoreFronts {

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

  byExported = async handle => {
    const json = encodeURIComponent(`storefronts/${handle}`) + '.json?alt=media'
    const url = `${this.bucket}/o/${json}`
    // console.log('url ', url)
    const response = await fetch(url)
    return response.json()
  }

  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  byHandle = handle => {
    return this.db.doc(NAME, handle).get()
  }

  bySearch = (limit=25, ...terms) => {
    const q = {
      where: [ ['search', 'array-contains-any', terms] ],
      orderBy: [ ['updateAt', 'desc'] ],
      limit
    }
    return this.db.col(NAME).paginate2(q)
  }

  byTags = (limit, ...tags) => {
    const search = tags.map(t => `tag:${t}`)
    return this.bySearch(limit, ...search) 
  }

}