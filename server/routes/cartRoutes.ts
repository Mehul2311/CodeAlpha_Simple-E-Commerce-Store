import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateQuantity);
router.delete('/:productId', protect, removeFromCart);
router.post('/coupon', protect, applyCoupon);

export default router;
