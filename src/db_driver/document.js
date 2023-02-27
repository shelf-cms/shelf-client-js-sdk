/**
 * @param {import("../firebase").Firebase} ctx
 * @param {string} colId
 * @param {string|undefined} docId
 */
export default (ctx, colId, docId=undefined) => {
  const that = this

  return {

    /**
     * 
     * @param {boolean} try_cache_first 
     * @returns 
     */
    get : async (try_cache_first=true) => {
      const doc = await ctx.db.ref(`${colId}/${docId}`).get()
      return [true, docId, doc]
    },

    /**
     * @param {*} data 
     * @returns {string} id
     */
    update : async (data) => {
      const newRef = await ctx.db.ref(`${colId}/${docId}`).update(data)
      return newRef.id
    },
    
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    set : async (data) => {
      await ctx.db.ref(`${colId}/${docId}`).set(data)
      return docId
    },

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    create : async (data) => {
      const newRef = await ctx.db.ref(`${colId}`).add(data)
      return newRef.id
    },

  }
}