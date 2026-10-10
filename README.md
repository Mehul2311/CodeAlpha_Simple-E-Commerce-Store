# DesiKart (देशीकार्ट) 🇮🇳

An authentic, production-grade Indian e-commerce web application celebrating the rich heritage, crafts, and wellness of Bharat. Built end-to-end with vanilla JavaScript (ES6+), HTML5, CSS3, Node.js, Express.js, and MongoDB with Mongoose.

---

## 🌟 Key Highlights & Indian Identity

- **100% Authentic Indian Catalogue**: 24 hand-curated products spanning 6 categories:
  - *Ethnic Wear & Apparel* (Pure Kanjeevaram Silk Sarees, Lucknowi Chikankari Kurta sets, Jodhpur Mojaris)
  - *Ayurvedic & Wellness* (Pampore Grade-A1 Kashmiri Mongra Saffron, Himalayan Shilajit, Chyawanprash, Kerala Wild Honey)
  - *Spices & Dry Fruits* (Kashmiri Mamra Badam, Tellicherry Black Pepper & Cardamom, Jodhpur Roasted Cashews)
  - *Handicrafts & Home Decor* (Moradabad Brass Peacock Urlis, Jaipur Blue Pottery, Bastar Dhokra Tribal Art, Kashmiri Carpets)
  - *Mobiles & Gadgets* (Make in India 5G smartphones with ISRO NavIC navigation, boAt ANC earbuds, Ambrane fast power banks)
  - *Fitness & Daily Essentials* (Varanasi Khadi yoga mats, Pure hammered copper bottles, Vedic Bilona A2 Gir Cow Ghee)
- **Indian Pricing & Formatting**: Real `toLocaleString('en-IN')` currency formatting (`₹1,24,999`), MRP struck through, realistic discount percentages, GST (18%) calculations, and free Pan-India delivery on orders above ₹499.
- **Authentic Reviews**: Customer reviews with Indian names (Aarav Mehta, Priya Nair, Sneha Kulkarni, Imran Qureshi, Gurpreet Singh), verified cities (Mumbai, Bengaluru, Pune, Lucknow, Jaipur, Kolkata, Hyderabad), and natural Hinglish feedback.
- **Smooth Apple / Cult.fit Inspired Animations**:
  - Preloader & festive emblem reveal
  - Lenis smooth scroll
  - GSAP ScrollTrigger section reveals and animated metric counters
  - Product card hover lift, image zoom, heart-pop wishlist animation
  - Add-to-cart micro-interaction (flying bag animation to bouncing cart badge)
  - Simulated payment processing (Cash on Delivery, UPI Instant Pay, Demo Card)
  - Confetti celebration upon order confirmation
  - Animated order timeline (Placed → Packed → Shipped → Out for delivery → Delivered)

---

## 🛠️ Tech Stack

- **Frontend**: Plain HTML5, CSS3, vanilla JavaScript (ES6+ modular). No React, Vue, Angular, or Tailwind.
- **Animation & UX**: Lenis, GSAP, ScrollTrigger, Canvas Confetti (loaded via CDN).
- **Backend**: Node.js with Express.js.
- **Database**: MongoDB with Mongoose (with embedded `mongodb-memory-server` fallback for zero-config local runs, plus `npm run seed` script).
- **Auth & Security**: JWT stored in an `httpOnly` secure cookie, passwords hashed with `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `cookie-parser`.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment
A `.env.example` file is provided:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/desikart
JWT_SECRET=desikart_super_secret_jwt_key_2026_india
```
*(Note: If no external MongoDB server is running, the app automatically initializes an embedded in-memory MongoDB instance and auto-seeds the full Indian catalogue on first launch!)*

### 3. Seed Demo Data (Optional)
To manually re-seed products and demo accounts:
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| Customer (Mumbai) | `aarav@desikart.in` | `Password@123` | 2 Saved Addresses (Worli, Nariman Point) & Past Orders |
| Customer (Bengaluru) | `priya@desikart.in` | `Password@123` | Saved Address (Whitefield) |
| Administrator | `admin@desikart.in` | `Admin@123` | Admin role, Hyderabad address |

---

## 🎟️ Active Festive Coupons

- `DIWALI50`: ₹50 instant discount on orders above ₹299
- `DESI10`: 10% discount on any order (up to ₹500)
- `FESTIVE20`: 20% festive discount on orders above ₹1,999 (up to ₹1,000)

---

## 📡 API Endpoints

### Authentication & User
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and set httpOnly JWT cookie
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get profile of authenticated user
- `PUT /api/auth/profile` - Update name and phone
- `POST /api/auth/addresses` - Add new delivery address (with 6-digit PIN validation)
- `DELETE /api/auth/addresses/:id` - Delete saved address

### Products & Catalogue
- `GET /api/products` - Filtered & paginated products (`category`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`)
- `GET /api/products/featured` - Curated featured and top-discounted products
- `GET /api/products/categories` - Category list with item count
- `GET /api/products/:id` - Single product with related category recommendations
- `POST /api/products/:id/reviews` - Post a customer rating and review

### Cart & Checkout
- `GET /api/cart` - View cart with itemized subtotal, GST (18%), delivery, and discounts
- `POST /api/cart/add` - Add item to cart with quantity
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `POST /api/cart/coupon` - Validate and apply festive coupon code

### Orders
- `POST /api/orders` - Place order with address, payment method (COD/UPI/Card), and clear cart
- `GET /api/orders/my` - Fetch user's order history
- `GET /api/orders/:id` - Fetch order status and tracking timeline
- `PUT /api/orders/:id/cancel` - Cancel pending order

### Wishlist
- `GET /api/users/wishlist` - View saved items
- `POST /api/users/wishlist/toggle` - Toggle item in wishlist

---

## 🇮🇳 Pan-India Shipping & Trust Details
- **Free delivery**: Applicable on orders above ₹499 Pan-India.
- **Estimated delivery**: 3 to 5 business days across all states.
- **Customer Care**: `+91 1800 200 4567` (Mon - Sat, 9:00 AM - 8:00 PM IST).
- **Made with ❤️ in India**.
