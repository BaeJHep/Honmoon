// api/firebaseAdmin.js
import admin from "firebase-admin";

// only initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // ensure literal newlines
      privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    // not strictly needed for Firestore, but harmless
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db   = admin.firestore();
export const auth = admin.auth();
export const FieldValue = admin.firestore.FieldValue;
