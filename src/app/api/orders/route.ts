import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { orderSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate order payload against our Zod schema
    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid order data', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }

    const orderData = validationResult.data;
    orderData.createdAt = new Date().toISOString();
    orderData.updatedAt = orderData.createdAt;
    
    // Generate human-friendly order number
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    orderData.orderNumber = `FX-${dateStr}-${randomNum}`;

    if (!adminDb) {
      // Mock mode for UI development when Firebase keys are missing
      console.warn("Firebase not initialized. Returning mock Order ID.");
      return NextResponse.json({ 
        success: true, 
        orderId: `mock_${orderData.orderNumber}`,
        orderNumber: orderData.orderNumber 
      });
    }

    // Save to Firestore
    const docRef = await adminDb.collection('orders').add(orderData);
    
    return NextResponse.json({ 
      success: true, 
      orderId: docRef.id,
      orderNumber: orderData.orderNumber 
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
