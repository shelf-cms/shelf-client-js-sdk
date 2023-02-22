import docHandler from './document'
import colHandler from './collection'

// export {docHandler, colHandler}

// export const doc = (ctx, colId, docId=undefined) => docHandler(ctx.firebase, colId, docId)
// export const col = (ctx, colId) => colHandler(ctx.firebase, colId)

export default class FirebaseDB {
  constructor(ctx) {
    this.ctx = ctx
  }

  doc = (colId, docId=undefined) => {
    return docHandler(this.ctx.firebase, colId, docId)
  }

  col = (colId) => {
    return colHandler(this.ctx.firebase, colId)
  }

}