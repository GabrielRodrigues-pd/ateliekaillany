import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

async function deepDebug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const lastOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
    
    console.log('--- ÚLTIMOS 5 PEDIDOS ---');
    lastOrders.forEach(o => {
      console.log(`ID: ${o._id}`);
      console.log(`Cliente: ${o.customerName}`);
      console.log(`UserId Raw: ${o.userId}`);
      console.log(`CreatedAt: ${o.createdAt}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

deepDebug();
