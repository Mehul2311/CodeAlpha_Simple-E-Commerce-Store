import { Response } from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

interface CalculatedTotals {
  items: any[];
  itemsPrice: number;
  mrpTotal: number;
  savings: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  couponApplied: string;
  totalPrice: number;
  count: number;
}

export function computeCartTotals(
  cartItemsWithProducts: any[],
  couponCode: string = ''
): CalculatedTotals {
  let itemsPrice = 0;
  let mrpTotal = 0;
  let count = 0;

  const validItems = cartItemsWithProducts.filter(item => item.product);

  for (const item of validItems) {
    const p = item.product;
    const qty = item.quantity;
    itemsPrice += p.price * qty;
    mrpTotal += (p.mrp || p.price) * qty;
    count += qty;
  }

  let discountPrice = 0;
  let verifiedCoupon = '';
  const code = (couponCode || '').toUpperCase().trim();

  if (code === 'DIWALI50') {
    if (itemsPrice >= 299) {
      discountPrice = 50;
      verifiedCoupon = 'DIWALI50';
    }
  } else if (code === 'DESI10') {
    if (itemsPrice > 0) {
      discountPrice = Math.min(500, Math.round(itemsPrice * 0.10));
      verifiedCoupon = 'DESI10';
    }
  } else if (code === 'FESTIVE20') {
    if (itemsPrice >= 1999) {
      discountPrice = Math.min(1000, Math.round(itemsPrice * 0.20));
      verifiedCoupon = 'FESTIVE20';
    }
  }

  const savings = (mrpTotal - itemsPrice) + discountPrice;
  // Free delivery above ₹499 in India
  const shippingPrice = itemsPrice >= 499 || itemsPrice === 0 ? 0 : 49;
  // 18% GST standard Indian rate (calculated on discounted items price)
  const taxableBase = Math.max(0, itemsPrice - discountPrice);
  const taxPrice = Math.round(taxableBase * 0.18);
  const totalPrice = Math.max(0, taxableBase + taxPrice + shippingPrice);

  return {
    items: validItems,
    itemsPrice,
    mrpTotal,
    savings,
    taxPrice,
    shippingPrice,
    discountPrice,
    couponApplied: verifiedCoupon,
    totalPrice,
    count
  };
}

export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to view cart.' });
      return;
    }

    const coupon = (req.query.coupon as string) || '';
    const user = await User.findById(req.user.id).populate('cart.product');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const totals = computeCartTotals(user.cart, coupon);

    res.json({
      success: true,
      ...totals
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching cart' });
  }
}

export async function addToCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to add items to cart.' });
      return;
    }

    const { productId, quantity = 1 } = req.body;
    const qty = Math.max(1, Number(quantity));

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += qty;
    } else {
      user.cart.push({
        product: product._id as any,
        quantity: qty
      });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    const totals = computeCartTotals(updatedUser!.cart);

    res.json({
      success: true,
      message: `${product.title} added to your cart! 🛍️`,
      ...totals
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error adding to cart' });
  }
}

export async function updateQuantity(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in.' });
      return;
    }

    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (qty <= 0) {
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
    } else {
      const item = user.cart.find(i => i.product.toString() === productId);
      if (item) {
        item.quantity = qty;
      }
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    const totals = computeCartTotals(updatedUser!.cart);

    res.json({
      success: true,
      message: 'Cart updated',
      ...totals
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating cart' });
  }
}

export async function removeFromCart(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in.' });
      return;
    }

    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    const totals = computeCartTotals(updatedUser!.cart);

    res.json({
      success: true,
      message: 'Item removed from cart',
      ...totals
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error removing item' });
  }
}

export async function applyCoupon(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
      return;
    }

    const upperCode = code.toUpperCase().trim();
    const validCodes = ['DIWALI50', 'DESI10', 'FESTIVE20'];

    if (!validCodes.includes(upperCode)) {
      res.status(400).json({
        success: false,
        message: 'Invalid coupon code. Try DIWALI50, DESI10, or FESTIVE20!'
      });
      return;
    }

    let cartItems: any[] = [];
    if (req.user) {
      const user = await User.findById(req.user.id).populate('cart.product');
      cartItems = user?.cart || [];
    }

    const totals = computeCartTotals(cartItems, upperCode);

    if (!totals.couponApplied) {
      res.status(400).json({
        success: false,
        message: upperCode === 'FESTIVE20'
          ? 'FESTIVE20 requires a minimum order value of ₹1,999'
          : 'Coupon minimum order criteria not met'
      });
      return;
    }

    res.json({
      success: true,
      message: `Coupon ${upperCode} applied! Savings of ₹${totals.discountPrice.toLocaleString('en-IN')}`,
      ...totals
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error applying coupon' });
  }
}
