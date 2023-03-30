import { ShelfSDK } from './index.js'
import { TagData } from './js-docs-types.js'

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

  /**
   * 
   * @param {string} id 
   * @returns {Promise<[boolean, string, TagData]>}
   */
  byId = id => {
    return this.db.doc(NAME, id).get()
  }

  /**
   * 
   * @param {string} limit 
   * @param  {...string} search terms 
   * @returns {()=>Promise<[string, TagData][]>} a one promise or next handler iterator
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