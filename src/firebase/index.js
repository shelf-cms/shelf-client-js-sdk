import { Database } from '../firestore-lite/mod'
import Auth from '../auth-lite'

export const materializeConfig = (config) => {
  const auth = new Auth({ apiKey: config.apiKey })
  const db = new Database({ projectId: config.projectId, auth });

  return { 
    auth, db, config
  }
  
}