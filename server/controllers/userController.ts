import { Response } from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to view wishlist.' });
      return;
    }

    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching wishlist' });
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to manage your wishlist.' });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

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

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    let inWishlist = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      inWishlist = false;
    } else {
      user.wishlist.push(product._id as any);
      inWishlist = true;
    }

    await user.save();

    res.json({
      success: true,
      inWishlist,
      count: user.wishlist.length,
      message: inWishlist
        ? `${product.title} added to your wishlist ❤️`
        : `${product.title} removed from wishlist`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating wishlist' });
  }
}
