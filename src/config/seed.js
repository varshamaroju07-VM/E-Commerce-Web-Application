const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: 'Aero Wireless Headphones',
    description: 'Premium over-ear headphones with deep bass and 30-hour battery.',
    price: 149.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    featured: true,
    rating: 4.8
  },
  {
    name: 'Luna Smartwatch',
    description: 'Fitness tracking smartwatch with AMOLED display and heart-rate monitoring.',
    price: 199.0,
    category: 'Accessories',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    featured: true,
    rating: 4.7
  },
  {
    name: 'Urban Leather Backpack',
    description: 'Minimal daily carry backpack designed for work, travel, and campus life.',
    price: 89.5,
    category: 'Fashion',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    featured: false,
    rating: 4.5
  },
  {
    name: 'Nova Ceramic Bottle',
    description: 'Insulated stainless steel bottle that keeps drinks hot or cold all day.',
    price: 39.99,
    category: 'Lifestyle',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    featured: false,
    rating: 4.4
  },
  {
    name: 'Pulse Gaming Mouse',
    description: 'Precision mouse with customizable lighting and ultra-fast wireless response.',
    price: 74.99,
    category: 'Gaming',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    featured: true,
    rating: 4.6
  },
  {
    name: 'Terra Office Chair',
    description: 'Ergonomic chair with lumbar support and durable mesh design.',
    price: 249.99,
    category: 'Home',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    featured: false,
    rating: 4.8
  }
];

async function seedData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products');
  }

  const adminExists = await User.findOne({ email: 'admin@store.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Seeded admin account');
  }
}

module.exports = { seedData };
