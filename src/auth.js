import { LS } from './common/utils/browser'
const USER_KEY = 'shelf_client_user'

export default class Auth {

  subscribers = new Set()
  currentUser = undefined
  isAuthenticated = false

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

  _update_and_notify_subscribers = (user, isAuthenticated) => {
    this.currentUser = user
    this.isAuthenticated = isAuthenticated
    this.notify_subscribers()
  }

  _broadcast = () => {
    this.broadcast_channel.postMessage([this.currentUser, 
      this.isAuthenticated])
  }

  signup = (email, password, firstname, lastname, ...extra) => {
    const isEmpty = (str) => (!str?.trim().length)
    
    return new Promise((resolve, reject) => {
      if(isEmpty(firstname)) { reject('auth/missing-name'); return }
      else if (isEmpty(password)) { reject('auth/missing-password'); return  }
    
      this.auth.signUp(email, password)
        .then(async (userCredential) => {
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
          resolve(user_info)  
        })
        .catch(error => {
          reject(error.message)
        })
    })
  }

  signin_with_email_pass = async (email, password) => {
    const credentials = await this.auth.signIn(email, password)
    const [exists, id, data] = await 
    this.context.users.get(credentials.localId)
    this._update_and_notify_subscribers(data, true)
    this._broadcast()
    return data

    // console.log('signin_with_email_pass ', email, password)
    // return new Promise((resolve, reject) => {
    //   this.auth.signIn(email, password)
    //     .then(async (credentials) => {
    //       console.log('credentials', credentials)
    //       const [exists, id, data] = await 
    //               this.context.users.get(credentials.localId)
    //       this._update_and_notify_subscribers(data, true)
    //       this._broadcast()
    //       return data
    //     })
    //     .then(resolve)
    //     .catch(error => {
    //       console.log(error)
    //       reject(error.message)
    //     })
    //   })
  }

  signout = async () => {
    await this.auth.signOut()
    console.log('signout');
    LS.set(USER_KEY, null)
    this._update_and_notify_subscribers(undefined, false)
    this._broadcast()
  }

  updateCurrentUser = async (data) => {
    data = {...this.currentUser, ...data}
    await this.context.users.set(data.uid, data)
    this._update_and_notify_subscribers(data, 
                        this.isAuthenticated)
    this._broadcast()
  }

}