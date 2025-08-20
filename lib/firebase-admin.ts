/// <reference types="firebase-admin" />
import admin from 'firebase-admin';

let app;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error; // Re-throw the error to fail the build explicitly
  }
} else {
  app = admin.app();
}

export const authAdmin = admin.auth(app);
export const dbAdmin = admin.firestore(app);
