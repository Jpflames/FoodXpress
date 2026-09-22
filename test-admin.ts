import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert } from 'firebase-admin/app';

try {
  const pk = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: pk
    })
  });
  console.log('Firebase Admin initialized successfully!');
} catch (error) {
  console.error('Firebase Admin Error:', error);
}
