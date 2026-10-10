import { Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { computeCartTotals } from './cartController.js';

function generateOrderId(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DK-2026-${rand}`;
}

function calculateEstimatedDeliveryIST(): string {
  const now = new Date();
  const start = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  const format = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  return `${format(start)} – ${format(end)}`;
}

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to place an order.' });
      return;
    }

    const {
      shippingAddress,
      paymentMethod = 'Cash on Delivery',
      couponCode,
      items: directItems,
      paymentDetails
    } = req.body;

    if (!shippingAddress) {
      res.status(400).json({ success: false, message: 'Shipping address is required.' });
      return;
    }

    const { fullName, phone, street, city, state, pincode } = shippingAddress;
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      res.status(400).json({ success: false, message: 'All address fields (Full Name, Phone, Street, City, State, PIN) are required.' });
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode.toString().trim())) {
      res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian Postal PIN code (e.g., 400001, 110001).' });
      return;
    }

    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Determine order items either from direct checkout or user's cart
    let orderItemsToProcess: any[] = [];
    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      for (const item of directItems) {
        const prod = await Product.findById(item.productId);
        if (prod) {
          orderItemsToProcess.push({ product: prod, quantity: item.quantity || 1 });
        }
      }
    } else {
      orderItemsToProcess = user.cart;
    }

    if (orderItemsToProcess.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty. Please add items to place an order.' });
      return;
    }

    const totals = computeCartTotals(orderItemsToProcess, couponCode);

    const formattedOrderItems = totals.items.map(item => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.images[0] || '',
      price: item.product.price,
      mrp: item.product.mrp || item.product.price,
      quantity: item.quantity
    }));

    const orderId = generateOrderId();
    const isPaid = paymentMethod !== 'Cash on Delivery';

    const order = new Order({
      orderId,
      user: user._id,
      items: formattedOrderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        landmark: shippingAddress.landmark?.trim() || '',
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.toString().trim(),
        addressType: shippingAddress.addressType || 'Home'
      },
      paymentMethod,
      paymentStatus: isPaid ? 'Completed' : 'Pending',
      paymentDetails: {
        transactionId: paymentDetails?.transactionId || (isPaid ? `TXN_${Date.now()}` : undefined),
        upiId: paymentDetails?.upiId,
        cardLast4: paymentDetails?.cardLast4
      },
      itemsPrice: totals.itemsPrice,
      taxPrice: totals.taxPrice,
      shippingPrice: totals.shippingPrice,
      discountPrice: totals.discountPrice,
      couponApplied: totals.couponApplied,
      totalPrice: totals.totalPrice,
      orderStatus: 'Placed',
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date(),
          comment: 'Order placed successfully. Thank you for shopping with DesiKart!'
        }
      ],
      estimatedDelivery: calculateEstimatedDeliveryIST()
    });

    await order.save();

    // If order was from cart, clear cart
    if (!directItems || directItems.length === 0) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: `Badhaai ho! Your order ${order.orderId} has been placed successfully 🎉`,
      order
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating order' });
  }
}

export async function getMyOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to view orders.' });
      return;
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching orders' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in.' });
      return;
    }

    const { id } = req.params;
    let order = await Order.findOne({ orderId: id, user: req.user.id });

    if (!order && id.length === 24) {
      order = await Order.findOne({ _id: id, user: req.user.id });
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({
      success: true,
      order
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching order' });
  }
}

export async function cancelOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in.' });
      return;
    }

    const { id } = req.params;
    let order = await Order.findOne({ orderId: id, user: req.user.id });
    if (!order && id.length === 24) {
      order = await Order.findOne({ _id: id, user: req.user.id });
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.orderStatus === 'Cancelled') {
      res.status(400).json({ success: false, message: 'This order is already cancelled.' });
      return;
    }

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped' || order.orderStatus === 'Out for delivery') {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled once ${order.orderStatus.toLowerCase()}. You can initiate an easy 7-day return upon delivery.`
      });
      return;
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      comment: 'Order cancelled by customer. Refund (if prepaid) initiated to original payment source.'
    });

    await order.save();

    res.json({
      success: true,
      message: `Order ${order.orderId} has been successfully cancelled.`,
      order
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error cancelling order' });
  }
}
