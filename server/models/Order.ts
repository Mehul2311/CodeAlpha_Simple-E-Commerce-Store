import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from './User.js';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
}

export interface IOrderStatusHistory {
  status: 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  timestamp: Date;
  comment: string;
}

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: 'Cash on Delivery' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Completed';
  paymentDetails?: {
    transactionId?: string;
    upiId?: string;
    cardLast4?: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  couponApplied?: string;
  totalPrice: number;
  orderStatus: 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  statusHistory: IOrderStatusHistory[];
  estimatedDelivery: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const StatusHistorySchema = new Schema<IOrderStatusHistory>({
  status: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  comment: { type: String, default: '' }
});

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [OrderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    addressType: { type: String, default: 'Home' }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'UPI', 'Card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    upiId: String,
    cardLast4: String
  },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  couponApplied: { type: String, default: '' },
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
    index: true
  },
  statusHistory: [StatusHistorySchema],
  estimatedDelivery: { type: String, required: true }
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
