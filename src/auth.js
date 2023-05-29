import { ShelfSDK } from './index.js'
import { LS } from './common/utils/browser.js'
import { UserData } from './js-docs-types.js'

const USER_KEY = 'shelf_client_user'

export default class Auth {

  subscribers = new Set()
  /**@type {UserData} */
  currentUser = undefined
  isAuthenticated = false

  /**
   * 
   * @param {ShelfSDK} context 
   */
  constructor(context) {
    this.context = context
    this.auth = context.firebase.auth
    this.db = context.db
    this.broadcast_channel = new BroadcastChannel(USER_KEY)
  }

  init() {
    //
    this.broadcast_channel.onmessage = (e) => {
      this._update_and_notify_subscribers(...e.data)
    }

    // load saved user
    this.currentUser = LS.get(USER_KEY)

    const save_user = () => {
      LS.set(USER_KEY, this.currentUser)
    }

    // console.log('this.currentUser', this.currentUser);

    if (typeof window !== "undefined") {
      window.addEventListener('blur', save_user)
      window.addEventListener('beforeunload', save_user)
    }

    // should only be used for refresh-signin ?
    const unsub = this.auth.listen(auth_user => {
      // console.log('User state changed ', auth_user ? 'Authenticated' : 'None')
      // console.log('User state changed : auth user ', auth_user )
      // console.log('User state changed : local user ', this.currentUser )
      // if(!this.currentUser) return
      this._update_and_notify_subscribers(this.currentUser, auth_user ? true : false)
    })
  }

  notify_subscribers = () => {
    for(let s of this.subscribers)
      s([this.currentUser, this.isAuthenticated])
  }
  
  add_sub = cb => {
    this.subscribers.add(cb)
    return () => {
      this.subscribers.delete(cb)
    }
  }

  /**
   * 
   * @param {UserData} user 
   * @param {boolean} isAuthenticated 
   */
  _update_and_notify_subscribers = (user, isAuthenticated) => {
    this.currentUser = user
    this.isAuthenticated = isAuthenticated
    this.notify_subscribers()
  }

  _broadcast = () => {
    this.broadcast_channel.postMessage([this.currentUser, 
      this.isAuthenticated])
  }

  /**
   * send reset password email
   * @param {string} email 
   */
  sendResetPassword = async (email, continueUrl) => {
    return this.auth.sendOobCode('PASSWORD_RESET', email, continueUrl)
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {string} firstname 
   * @param {string} lastname 
   * @param  {...any} extra 
   * @returns 
   */
  signup = async (email, password, firstname, lastname, ...extra) => {
    const isEmpty = (str) => (!str?.trim().length)
    
    // return new Promise((resolve, reject) => {
    if(isEmpty(firstname)) 
      throw 'auth/missing-name'
    else if (isEmpty(password)) 
      throw 'auth/missing-password'
    
    try {
      const userCredential = await this.auth.signUp(email, password)
      // Signed up 
      const { localId : uid } = userCredential
      console.log('- signed up ', email);
      // const doc_ref = doc(this.db, 'users', uid)
      // const snap = await getDoc(doc_ref)
      const user_info = {
        firstname, lastname, email, uid
      }
      
      // await this.db.doc('users', uid).set(user_info)
      await this.context.users.set(uid, user_info)

      console.log('- created user record ');

      this._update_and_notify_subscribers(user_info, true)
      return user_info
    } catch (e) {
      throw e?.message ?? e
    }
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns 
   */
  signin_with_email_pass = async (email, password) => {
    const credentials = await this.auth.signIn(email, password)
    const [exists, id, data] = await this.context.users
                                         .get(credentials.localId)
    this._update_and_notify_subscribers(data, true)
    this._broadcast()
    return data
  }

  signout = async () => {
    await this.auth.signOut()
    console.log('signout');
    LS.set(USER_KEY, null)
    this._update_and_notify_subscribers(undefined, false)
    this._broadcast()
  }

  /**
   * 
   * @param {UserData} data 
   */
  updateCurrentUser = async (data) => {
    data = {...this.currentUser, ...data}
    await this.context.users.set(data.uid, data)
    this._update_and_notify_subscribers(data, 
                        this.isAuthenticated)
    this._broadcast()
  }

}