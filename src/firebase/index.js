import { Database } from '../firestore-lite/mod'
import Auth from '../auth-lite'

/**
 * @typedef {object} Firebase
 * @property {Auth} Firebase.auth 
 * @property {Database} Firebase.db 
 * @property {object} Firebase.config 
 */

/**
 * @param {object} config
 * @returns {Firebase}
 */
export const materializeConfig = (config) => {
  const auth = new Auth({ apiKey: config.apiKey })
  const db = new Database({ projectId: config.projectId, auth });

  return { 
    auth, db, config
  }
  
}