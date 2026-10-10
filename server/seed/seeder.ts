import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { connectDB, closeDB } from '../config/db.js';
import { sampleUsers, sampleProducts } from './seedData.js';

export async function seedDatabase(isStandalone = false): Promise<void> {
  try {
    if (isStandalone) {
      console.log('Connecting to MongoDB for seeding...');
      await connectDB();
    }

    console.log('Clearing existing database collections...');
    await Promise.all([
      Product.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('Inserting authentic products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} Indian products across 6 categories.`);

    console.log('Creating demo users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Successfully seeded ${createdUsers.length} demo users:`);
    createdUsers.forEach(u => console.log(` - ${u.email} (${u.role})`));

    // Create a realistic sample order for Aarav Mehta
    const aarav = createdUsers[0];
    const saree = createdProducts[0];
    const saffron = createdProducts[4];

    if (aarav && saree && saffron) {
      const sampleOrder = new Order({
        orderId: 'DK-2026-DIWALI01',
        user: aarav._id,
        items: [
          {
            product: saree._id,
            title: saree.title,
            image: saree.images[0],
            price: saree.price,
            mrp: saree.mrp,
            quantity: 1
          },
          {
            product: saffron._id,
            title: saffron.title,
            image: saffron.images[0],
            price: saffron.price,
            mrp: saffron.mrp,
            quantity: 2
          }
        ],
        shippingAddress: aarav.addresses[0],
        paymentMethod: 'UPI',
        paymentStatus: 'Completed',
        paymentDetails: {
          transactionId: 'UPI-REF-984920491823',
          upiId: 'aarav@okaxis'
        },
        itemsPrice: saree.price + saffron.price * 2,
        taxPrice: Math.round((saree.price + saffron.price * 2) * 0.18),
        shippingPrice: 0,
        discountPrice: 50,
        couponApplied: 'DIWALI50',
        totalPrice: Math.round((saree.price + saffron.price * 2) * 1.18) - 50,
        orderStatus: 'Shipped',
        statusHistory: [
          {
            status: 'Placed',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            comment: 'Order placed successfully.'
          },
          {
            status: 'Packed',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            comment: 'Packed with love and protective bubble wrap at DesiKart Mumbai Hub.'
          },
          {
            status: 'Shipped',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            comment: 'Handed over to BlueDart Express. AWB: BLD9820491823.'
          }
        ],
        estimatedDelivery: '10/10/2026 – 12/10/2026'
      });

      await sampleOrder.save();
      console.log('Seeded demo past order for Aarav Mehta (DK-2026-DIWALI01).');
    }

    console.log('🎉 DesiKart Database Seeding Completed Successfully!');

    if (isStandalone) {
      await closeDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('Error during database seeding:', err);
    if (isStandalone) {
      process.exit(1);
    }
    throw err;
  }
}

// Auto-run if executed directly via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase(true);
}
