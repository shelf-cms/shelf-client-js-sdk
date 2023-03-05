import { ShelfSDK } from '.'
import { isEmailValid } from './common/utils/validation'


const text2tokens = (text) => {
  return text?.match(/\S+/g)
}

const create_user_search_index = (id, data) => {
  const email = data?.email
  const firstname = text2tokens(data.firstname.toLowerCase());
  const lastname = text2tokens(data.lastname.toLowerCase());
  const terms = [firstname[0], 
           lastname[0], 
           email.split('@')[0], 
           email, id]

  return terms
}

const add_update_timestamp = data => {
  data.updatedAt = Date.now()
  return data
}

const validate = async d => {
  const errors = []
  const warnings = []

  if(!d.firstname)
    errors.push('First Name is mandatory')
  if(!d.lastname)
    errors.push('Last Name is mandatory')

  if(!d.uid)
    errors.push('UID is mandatory')

  if(!isEmailValid(d.email))
    errors.push('Email is not valid format')

  return {
    warnings, errors,
    hasWarnings : warnings.length>0,
    hasErrors : errors.length>0,
  }
}


const NAME = 'users'

export default class Users {

  /**
   * 
   * @param {ShelfSDK} context 
   */
  constructor(context) {
    this.context = context
    this.db = context.db
  }

  get = (id) => {
    return this.db.doc(NAME, id).get()
  }

  byId = (id) => {
    return this.get(id)
  }

  update = (id, data) => {
    return Promise.reject('Update is not supported !! ')
  }

  set = async (id, data) => {
    // side effects:
    // 1. update search index
    // 1. update timestamps
    if(id!==data.uid)
      return Promise.reject('UID cannot change !! ')

    try {
      const report = await validate(data)
      // console.log('report ', report);
      if(report.hasErrors)
        throw [...report.errors, ...report.warnings]

      const search = create_user_search_index(id, data)    
      data = { ...data, search }     
      add_update_timestamp(data)
    } catch (e) {
      return Promise.reject(Array.isArray(e) ? e : [e])
    }

    return this.db.doc(NAME, id).set(data)
  }

  create = (data) => {
    // side effects:
    // 1. update search index
    // 1. update timestamps
    data.createdAt = Date.now()   
    return this.set(data.uid, data)
  }

  delete = (id) => {
    // side effects: 
    // 1. TODO:: delete auth user as well with cloud functions
    //    https://stackoverflow.com/questions/38800414/delete-a-specific-user-from-firebase
    return this.db.col(NAME).remove(id)
  }

  /**
   * Regular List ordered ASC by updatedAt with support for search terms.
   * Query is guranteed to be indexed by me
   * 
   * @param {*} searchTokens 
   * @param {*} limit 
   * @returns a next handler
   */
   list = (searchTokens=[], limit=100, from_cache=false) => {
    let q = { orderBy: [['updatedAt', 'asc']], limit }
    if (Array.isArray(searchTokens) && searchTokens.length)
      q.where = [ ['search', 'array-contains-any', searchTokens] ]

    return this.listWithQuery(q, from_cache)
  }

  /**
   * List with query, make sure you have database indexed for the query
   * 
   * @param {Object} q { orderBy: [['field1', 'asc']], where: [['name', '=', 'tomer'], limit: 10] } 
   * @param {Boolean} from_cache force cache if available
   * @returns a next handler
   */
  listWithQuery = (q, from_cache=false) => {
    return this.db.col(NAME).paginate2(q)(from_cache)
  }
}