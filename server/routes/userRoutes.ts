import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;
