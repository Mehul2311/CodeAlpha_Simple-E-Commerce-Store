import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      addresses: [],
      wishlist: [],
      cart: []
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.status(201).json({
      success: true,
      message: `Welcome to DesiKart, ${user.name}! 🙏`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        cartCount: 0,
        wishlistCount: 0
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      message: `Namaste ${user.name}! Welcome back 🙏`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        cartCount: user.cart.reduce((acc, item) => acc + item.quantity, 0),
        wishlistCount: user.wishlist.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully. Alvida, visit again soon!' });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.json({ success: true, authenticated: false, user: null });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.json({ success: true, authenticated: false, user: null });
      return;
    }

    res.json({
      success: true,
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        cartCount: user.cart.reduce((acc, item) => acc + item.quantity, 0),
        wishlist: user.wishlist,
        wishlistCount: user.wishlist.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching user' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update profile' });
  }
}

export async function addAddress(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { fullName, phone, street, landmark, city, state, pincode, addressType, isDefault } = req.body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      res.status(400).json({ success: false, message: 'Please provide all required address fields.' });
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode.toString().trim())) {
      res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push({
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      landmark: landmark?.trim() || '',
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.toString().trim(),
      addressType: addressType || 'Home',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address saved successfully!',
      addresses: user.addresses
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to add address' });
  }
}

export async function deleteAddress(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const initialLen = user.addresses.length;
    user.addresses = user.addresses.filter(a => a._id?.toString() !== addressId);

    if (user.addresses.length === initialLen) {
      res.status(404).json({ success: false, message: 'Address not found' });
      return;
    }

    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address removed successfully!',
      addresses: user.addresses
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete address' });
  }
}
