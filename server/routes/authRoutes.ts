import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', optionalAuth, getMe);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

export default router;
