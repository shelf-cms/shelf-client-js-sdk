import { ShelfSDK } from '.'
import { OrderData } from './js-docs-types'

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

  /**
   * 
   * @param {string} id 
   * @returns {Promise<[boolean, string, OrderData]>}
   */
  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  /**
   * 
   * @param {number} limit 
   * @param {string} uid 
   * @returns {()=>Promise<[string, OrderData][]>} a one promise or next handler iterator
   */
  byUserId = (limit=25, uid) => {
    const q = {
      where: [ ['search', 'array-contains-any', [`uid:${uid}`]] ],
      orderBy: [ ['updateAt', 'desc'] ],
      limit
    }
    return this.db.col(NAME).paginate2(q)
  }

}