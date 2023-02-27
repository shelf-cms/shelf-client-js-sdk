import { ShelfSDK } from "."

const NAME = 'tags'

export default class Tags {

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

  byId = id => {
    return this.db.doc(NAME, id).get()
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