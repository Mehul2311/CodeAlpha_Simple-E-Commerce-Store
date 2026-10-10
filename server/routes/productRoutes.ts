import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  addReview
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/:id/reviews', optionalAuth, addReview);

export default router;
