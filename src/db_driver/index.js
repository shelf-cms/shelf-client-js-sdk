import docHandler from './document'
import colHandler from './collection'
import { ShelfSDK } from '..'
// import { ShelfSDK } from '..'

// export {docHandler, colHandler}

// export const doc = (ctx, colId, docId=undefined) => docHandler(ctx.firebase, colId, docId)
// export const col = (ctx, colId) => colHandler(ctx.firebase, colId)

export default class FirebaseDB {

  /**
   * 
   * @param {ShelfSDK} ctx 
   */
  constructor(ctx) {
    this.ctx = ctx
  }

  /**
   * 
   * @param {string} colId 
   * @param {string | undefined} docId 
   */
  doc = (colId, docId=undefined) => {
    return docHandler(this.ctx.firebase, colId, docId)
  }

  /**
   * 
   * @param {string} colId 
   */
  col = (colId) => {
    return colHandler(this.ctx.firebase, colId)
  }

}