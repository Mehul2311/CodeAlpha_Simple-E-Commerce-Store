# DesiKart

DesiKart is an online store I built for my internship (Task 1). You can browse products, open a product page, add things to a cart, and place an order once you're logged in. I wanted it to feel like an Indian shopping site, so prices are in rupees, the catalogue is full of kurtas, spices and Ayurvedic stuff, and the demo users have Indian names.

The brief only asked for a basic store, but I spent a good chunk of the time on the design and the animations, because that's the part I enjoyed most.

## What it does

- Sign up, log in and log out (passwords are hashed, login uses a JWT cookie)
- Product listing with search, category filter, price filter and sorting
- Product page with an image gallery, MRP vs. selling price, discount, rating and related items
- Cart with quantity changes, GST, delivery charge and a coupon box. The cart is saved in the database, so it's still there when you log back in
- Checkout with an Indian address form (6-digit PIN code check, state dropdown)
- Payment options: Cash on Delivery, UPI or card. These are only simulated, no real payment happens
- My Orders page with a status timeline (Placed, Packed, Shipped, Out for delivery, Delivered) and an option to cancel
- Wishlist, and a profile page where you can edit your details and saved addresses
- A custom 404 page, plus loading and empty states

## The Indian touch

- Prices use Indian number formatting, e.g. ₹1,24,999
- Products include kurtas, sarees, juttis, spices, dry fruits, handicrafts, mobiles and home decor
- Demo users and reviews use Indian names and cities
- Festive banners (Diwali, Holi) with saffron and tricolour accents
- Footer has the things you'd expect on an Indian store: free delivery over ₹499, COD, 7-day returns, UPI/RuPay icons and a +91 support number

## Animations

I took ideas from apple.com, krea.ai and cult.fit. Here's what's in it:

- A preloader and a staggered text reveal on the hero section
- Smooth scrolling with Lenis, and scroll animations with GSAP ScrollTrigger
- Animated counters and a horizontal-scroll section for featured products
- A navbar that shrinks and blurs as you scroll, plus a slide-in mobile menu
- Product cards that lift on hover, with a heart animation for the wishlist
- The product flies into the cart when you add it, and the cart badge bounces
- Skeleton loaders, toast messages, page transitions and confetti on a successful order

If your device is set to reduce motion, the animations tone down automatically.

## Tech stack

| Part | What I used |
|------|-------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (httpOnly cookie), bcrypt |
| Animation | GSAP, ScrollTrigger, Lenis, Swiper |
| Security | helmet, cors, express-rate-limit, express-validator |

## Running it locally

You'll need Node.js 22.12 or newer and a MongoDB database. A free MongoDB Atlas cluster is enough.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
```

Create a `.env` file (there's a `.env.example` to copy from) and add your MongoDB connection string and a JWT secret. Then:

```bash
npm run seed   # adds sample products and demo users
npm run dev    # starts the app
```

Open `http://localhost:3000` in your browser.

**If `npm install` complains about peer dependencies,** use `npm install --legacy-peer-deps`.

**On Windows,** if you get a "Cannot find native binding" error, run:

```bash
npm install @rolldown/binding-win32-x64-msvc --no-save --legacy-peer-deps
```

## Project structure

```
client/    pages, styles, scripts and images
server/    models, routes, controllers, middleware, config and the seed script
```

## What I learned

- How JWT login works and why passwords are never stored as plain text
- Designing a database for users, products, carts and orders
- Keeping a cart in sync between the browser and the database
- Making a page look good on phones and laptops
- Using animations without making the site slow
- Fixing annoying Node and npm version problems on Windows

## Things I'd like to add

- A real payment gateway like Razorpay
- An admin panel for adding products and managing orders
- Email updates when an order status changes
- Reviews with photos

## Author

Mehul Sharma, Computing Technologies student at SRM Institute of Science and Technology.

GitHub: https://github.com/Mehul2311
