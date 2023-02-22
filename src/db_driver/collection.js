
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

export default (ctx, colId) => {
  const that = this
  return {

    list : (from_cache=false) => that.list_with_filters({}, from_cache),

    list_with_filters : (q = { limit:25 }, from_cache=false) => {
      const process_res = docs => docs.map(it => [it.__meta__.id, it])
      console.log('sfsdfsdf', q)
      // const q = toQuery(ref, wheres, orders, start_at, end_at, limit)
      q = toQuery(q)

      return new Promise((resolve, reject) => {
        ctx.db.ref(colId).query(q).run()
          .then(process_res)
          .then(resolve)
          .catch(reject)
      })
    },
    
  
    paginate2 : (base_query) => {
      const process_res = docs => docs.map(it => [it.__meta__.id, it])
      // console.log('query ', base_query);
      let last_doc = undefined
      let exhausted_next = false
      let q = toQuery(base_query)

      const next = (from_cache=false) => {
        return new Promise((resolve, reject) => {
          console.log('exhausted_next ', exhausted_next);
          if(exhausted_next)
            reject()

          console.log('deb 2', from_cache);
          console.log('last_doc', last_doc);

          let cq = q
          if(last_doc) {
            console.log('111', cq);
            cq = { ...cq, startAt: last_doc, offset: 1}
            console.log('111', last_doc);

          }

          console.log(cq)
          console.log(base_query);

          ctx.db.ref(colId).query(cq).run()
            .then(docs => {
              console.log('LLLL ', docs);
              if(docs.length==0) {
                exhausted_next=true
              }
              last_doc = docs.length ? docs[docs.length-1] : undefined
              return docs
            })
            .then(process_res)
            .then(resolve)
            .catch(reject)
        })
      }

      return next
    },

    remove : (docId) => new Promise((resolve, reject) => {
      ctx.db.ref(`${colId}/${docId}`).delete()
        .then(() => resolve(docId))
        .catch(reject)
    }),

    add : (data) => new Promise((resolve, reject) => {
      ctx.db.ref(`${colId}`).add(data)
        .then(newRef => {
          console.log(newRef)
          return newRef
        })
        .then(newRef => newRef.id)
        .then(resolve)
        .catch(reject)
    }),
  }
}