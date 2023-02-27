import { ShelfSDK } from "."

const NAME = 'orders'

export default class Orders {

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

  byUserId = (limit=25, uid) => {
    const q = {
      where: [ ['contact.uid', '==', uid] ],
      limit
    }
    return this.db.col(NAME).paginate2(q)
  }

}