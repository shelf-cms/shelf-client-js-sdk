
const toWhere = (items) => {
  return items.map(item => {
    if(item[1]==='array-contains-any')
      item[1]='contains-any'
    else if(item[1]==='array-contains')
      item[1]='contains'
    return item
  })
}

const toOrder = (items) => {
  return items.map(item => ({ field: item[0], direction : item[1]}) )
}

const q_sample = {
  where: [['field_name', 'op', 'value']],
  orderBy: [['field_1', 'asc/desc'], ['field_2', 'asc/desc']],
  limit: 25,
  startAt: ['field_1_some_value', 'field_2_some_value', 'or a document snapshot'],
  endAt: ['field_1_some_value', 'field_2_some_value']
}

const toQuery = (q) => {
  const q2 = {...q}
  if(q2.orderBy)
    q2.orderBy = q2.orderBy.map(item => ({ field: item[0], direction : item[1]}) )
  if(q2.where)
    q2.where = toWhere(q2.where)
  else 
    delete q2.where
  return q2
}

/**
 * 
 * @param {import("../firebase").Firebase} ctx 
 * @param {string | undefined} colId 
 * @returns 
 */
export default (ctx, colId) => {
  const that = this

  return {

    list : (from_cache=false) => that.list_with_filters({}, from_cache),


    list_with_filters : async (q = { limit:25 }, from_cache=false) => {
      // const q = toQuery(ref, wheres, orders, start_at, end_at, limit)
      q = toQuery(q)

      const docs = await ctx.db.ref(colId).query(q).run()
      return docs.map(it => [it.__meta__.id, it])
    },
    
      
    /**
     * @template T {}
     * @param {object} base_query 
     * @returns a next handler, that resolves to array of tuples [id, data][]
     * 
     */
    paginate2 : (base_query, from_cache=false) => {
      let last_doc = undefined
      let exhausted_next = false
      let q = toQuery(base_query)
      // console.log('q', q)
      /**
       * @typedef {[string, T]} Item
       * @returns {Promise<[string, T][]>}
       * @throws 'end' when next handler reaches end of pagination
       */
      const next = async () => {
        if(exhausted_next)
          throw new Error('end')

        const cq = last_doc ? { ...q, startAt: last_doc, offset: 1} : q
        // console.log(cq)
        // console.log(base_query)

        /**@type {any[]} */
        const docs = await ctx.db.ref(colId).query(cq).run()
        if(docs.length==0)
          exhausted_next=true

        last_doc = docs.length ? docs[docs.length-1] : undefined
        return docs.map(it => [it.__meta__.id, it])
      }

      return next
    },

    /**
     * 
     * @param {string} docId 
     * @returns 
     */
    remove : async (docId) => {
      await ctx.db.ref(`${colId}/${docId}`).delete()
      return docId
    },

    /**
     * 
     * @param {*} data 
     * @returns {string} id
     */
    add : async (data) => {
      const newRef = await ctx.db.ref(`${colId}`).add(data)
      return newRef.id
    },

  }

}