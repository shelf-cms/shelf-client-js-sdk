
// https://firebasestorage.googleapis.com/v0/b/wushwushgames-14ee2.appspot.com/o/collections%2Fps2-games.json?alt=media

const NAME = 'products'

export default class Products {

  constructor(context) {
    this.context = context
    this.db = context.db
    this.bucket = `https://firebasestorage.googleapis.com/v0/b/${context.firebase.config.storageBucket}`
  }

  init() {
  }

  byCollectionHandle = collection_handle => {
    const json = encodeURIComponent(`collections/${collection_handle}`) + '.json?alt=media'
    const url = `${this.bucket}/o/${json}`
    // console.log('url ', url)
    return fetch(url)
        .then(res => res.json())
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

  byCollections = (limit, ...collections) => {
    const search = collections.map(t => `col:${t}`)
    return this.bySearch(limit, ...search) 
  }

  byCategory = (limit, ...kvs) => {
    const tags = kvs.map(kv => `${kv[0]}_${kv[1]}`)
    return this.byTags(limit, ...tags) 
  }


}