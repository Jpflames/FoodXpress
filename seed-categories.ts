import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  const pk = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.replace(/"/g, ''),
      privateKey: pk
    })
  });
  
  const db = getFirestore();

  const seedCategories = async () => {
    const defaultCategories = [
      { name: "Vegetables", slug: "vegetables", status: "Active" },
      { name: "Fruits", slug: "fruits", status: "Active" },
      { name: "Meat & Fish", slug: "meat-fish", status: "Active" },
      { name: "Dairy & Eggs", slug: "dairy-eggs", status: "Active" },
      { name: "Bakery", slug: "bakery", status: "Active" },
      { name: "Beverages", slug: "beverages", status: "Active" }
    ];

    console.log("Seeding categories...");
    for (const cat of defaultCategories) {
      // Use set to provide consistent IDs or just addDoc. We'll use custom IDs for cleaner URLs later if needed, but add() is fine.
      const docRef = await db.collection("categories").add({
        ...cat,
        createdAt: new Date()
      });
      console.log(`Added category: ${cat.name} (${docRef.id})`);
    }
    console.log("Seeding complete!");
  };

  seedCategories();
} catch (error) {
  console.error('Firebase Admin Error:', error);
}
