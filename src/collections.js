const NAME = 'collections'

export default class Collections {

  constructor(context) {
    this.context = context
    this.db = context.db
    this.bucket = `https://firebasestorage.googleapis.com/v0/b/${context.firebase.config.storageBucket}`
  }

  init() {
  }

  byExportedCollection = handle => {
    const json = encodeURIComponent(`collections/${handle}`) + '.json?alt=media'
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

}