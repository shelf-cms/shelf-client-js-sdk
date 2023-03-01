import { Database } from '../firestore-lite/mod'
import Auth from '../auth-lite'

/**
 * @typedef {object} FirebaseConfig
 * @property {string} FirebaseConfig.apiKey 
 * @property {string} FirebaseConfig.projectId 
 * @property {string} FirebaseConfig.authDomain 
 * @property {string} FirebaseConfig.storageBucket 
 * @property {string} FirebaseConfig.appId 
 */

/**
 * @typedef {object} Firebase
 * @property {Auth} Firebase.auth 
 * @property {Database} Firebase.db 
 * @property {FirebaseConfig} Firebase.config 
 */


/**
 * @param {FirebaseConfig} config
 * @returns {Firebase}
 */
export const materializeConfig = (config) => {
  const auth = new Auth({ apiKey: config.apiKey })
  const db = new Database({ projectId: config.projectId, auth });

  return { 
    auth, db, config
  }
  
}