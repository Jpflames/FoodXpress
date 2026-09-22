import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Order } from '@/lib/validation/schemas';
import crypto from 'crypto';

// Paystack webhook verifier
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const data = event.data;
      const orderId = data.metadata?.orderId;
      const transactionRef = data.reference;
      
      if (!orderId) {
        return NextResponse.json({ error: 'No order ID in metadata' }, { status: 400 });
      }

      // Check if adminDb is initialized (will be null in build if no keys)
      if (!adminDb) {
        console.warn('Firebase Admin not initialized. Webhook received but cannot save to DB:', orderId);
        return NextResponse.json({ success: true, warning: 'DB not initialized' });
      }

      // Idempotency check: Get the order from Firestore
      const orderRef = adminDb.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const orderData = orderDoc.data() as Order;

      // Ensure we don't process it twice
      if (orderData.paymentStatus === 'successful') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Verify amounts (Paystack amount is in kobo, so divide by 100)
      const amountPaid = data.amount / 100;
      if (amountPaid < orderData.total) {
        // Partial payment or mismatched amount
        await orderRef.update({
          paymentStatus: 'failed',
          status: 'failed',
          updatedAt: new Date().toISOString(),
        });
        return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
      }

      // 1. Update Order Status
      await orderRef.update({
        paymentStatus: 'successful',
        status: 'confirmed',
        paymentReference: transactionRef,
        updatedAt: new Date().toISOString(),
      });

      // 2. Update Vendor Accounting & Inventory
      // (This should ideally be inside a Firestore transaction to prevent race conditions)
      await adminDb.runTransaction(async (transaction: any) => {
        for (const item of orderData.items) {
          // Inventory deduction
          const productRef = adminDb.collection('products').doc(item.productId);
          const productDoc = await transaction.get(productRef);
          
          if (productDoc.exists) {
            const currentStock = productDoc.data()?.stockQuantity || 0;
            transaction.update(productRef, {
              stockQuantity: Math.max(0, currentStock - item.quantity)
            });
          }

          // Vendor accounting record (simplified)
          const vendorRecordRef = adminDb.collection('vendorSettlements').doc();
          transaction.set(vendorRecordRef, {
            vendorId: item.vendorId,
            orderId: orderId,
            productId: item.productId,
            amount: item.price * item.quantity,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      });

      return NextResponse.json({ success: true });
    }

    // Return 200 for unhandled events to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
