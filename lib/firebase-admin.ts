/// <reference types="firebase-admin" />
import admin from 'firebase-admin';

let app;

if (!admin.apps.length) {
  try {
    console.log('Environment variables check:');
    console.log('FIREBASE_SERVICE_ACCOUNT_JSON exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
    }
    
    console.log('Service account string length:', serviceAccountString.length);
    const serviceAccount = JSON.parse(serviceAccountString);
    console.log('Parsed service account project_id:', serviceAccount.project_id);
    
    // Fix the private key formatting - replace literal \n with actual newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      console.log('Private key formatted, length:', serviceAccount.private_key.length);
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error; // Re-throw the error to fail the build explicitly
  }
} else {
  app = admin.app();
}

export const authAdmin = admin.auth(app);
export const dbAdmin = admin.firestore(app);
