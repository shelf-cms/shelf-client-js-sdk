

export default (ctx, colId, docId=undefined) => {
  const that = this
  console.log('pitaaaa')

  return {
    get : (try_cache_first=true) => new Promise((resolve, reject) => {
      ctx.db.ref(`${colId}/${docId}`).get()
        .then(document => [true, docId, document])
        .then(resolve)
        .catch(reject)
      })
      // const ref = doc(ctx.db, colId, docId)
      // return try_cache_first ? getDocV2(ref) : getDocFromServerV2(ref)
    ,
    update : (data) => new Promise((resolve, reject) => {
      ctx.db.ref(`${colId}/${docId}`).update(data)
        .then(newRef => newRef.id)
        .then(resolve)
        .catch(reject)
    }),
    set : (data) => new Promise((resolve, reject) => {
      ctx.db.ref(`${colId}/${docId}`).set(data)
        .then(() => docId)
        .then(resolve)
        .catch(reject)
    }),
    create : (data) => new Promise((resolve, reject) => {
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