

export const select_fields = (...fields) => o => fields.reduce((p, c) =>  ({ ...p, [c] : o[c] }), {})
export const filter_fields = (...fields) => items => items.map(item => select_fields(...fields)(item))


export const select_unused_fields = o => Object.keys(o).reduce((p, c) =>  { 
  if(Array.isArray(o[c])) {
    if(o[c].length) p[c]=o[c]
  }
  else if(typeof o[c]!=='undefined')
    p[c]=o[c]      
  return p 
}, {})
export const filter_unused = items => items.map(item => select_unused_fields(item))

export const text2tokens = (text) => {
  return (text?.toString().toLowerCase().match(/\S+/g)) ?? []
}
