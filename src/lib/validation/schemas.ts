import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  vendorId: z.string(), // Hidden from customer
  images: z.array(z.string()).default([]),
  price: z.number().min(0),
  compareAtPrice: z.number().optional(),
  unit: z.string(), // e.g., 'kg', 'bunch'
  stockQuantity: z.number().min(0),
  lowStockThreshold: z.number().default(5),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type Category = z.infer<typeof categorySchema>;

export const vendorSchema = z.object({
  id: z.string().optional(),
  businessName: z.string(),
  contactPerson: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  state: z.string(),
  lga: z.string(),
  businessCategory: z.string(),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
  notes: z.string().optional(),
  status: z.enum(['active', 'suspended', 'archived', 'pending']).default('active'),
  createdAt: z.any().optional(),
});

export type Vendor = z.infer<typeof vendorSchema>;

// Order system
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  unit: z.string(),
  vendorId: z.string(), // For internal accounting
  image: z.string().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string().optional(),
  orderNumber: z.string(),
  customerId: z.string().optional(), // Optional for guest checkout
  customerInfo: z.object({
    fullName: z.string(),
    phone: z.string(),
    email: z.string().optional(),
  }),
  deliveryAddress: z.object({
    state: z.string(),
    lga: z.string(),
    area: z.string(),
    street: z.string(),
    landmark: z.string().optional(),
    instructions: z.string().optional(),
  }),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  deliveryFee: z.number(),
  discount: z.number().default(0),
  total: z.number(),
  status: z.enum([
    'pending_payment',
    'paid',
    'confirmed',
    'processing',
    'ready_for_delivery',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'failed',
    'refunded',
  ]).default('pending_payment'),
  paymentStatus: z.enum([
    'pending',
    'successful',
    'failed',
    'refunded',
    'partially_refunded',
  ]).default('pending'),
  paymentMethod: z.string(),
  paymentReference: z.string().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Order = z.infer<typeof orderSchema>;
