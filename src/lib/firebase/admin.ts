import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (getApps().length === 0 && privateKey && privateKey.includes('PRIVATE KEY')) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error('Firebase Admin Error:', error.stack);
  }
}

// Ensure the build doesn't crash if env vars are missing (e.g. during static analysis)
const isInitialized = getApps().length > 0;

export const adminDb = isInitialized ? getFirestore() : null as any;
export const adminAuth = isInitialized ? getAuth() : null as any;
export const adminStorage = isInitialized ? getStorage() : null as any;
