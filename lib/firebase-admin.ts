/// <reference types="firebase-admin" />
import admin from 'firebase-admin';

let app;

if (!admin.apps.length) {
  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
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
