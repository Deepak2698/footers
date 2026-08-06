import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

async function seed() {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products removed');

    const sampleCategories = ['Sandals', 'Chappals', 'Juttis', 'Slippers', 'Boots'];
    const brands = ['Footers', 'KolhaCraft', 'LeatherWorks', 'TraditionCo'];
    const sizeOptions = ['S', 'M', 'L', 'XL'];

    const products = Array.from({ length: 20 }).map((_, i) => {
      const id = i + 1;
      const title = `Footwear Model ${id}`;
      const category = sampleCategories[i % sampleCategories.length];
      const brand = brands[i % brands.length];
      const price = Math.round((500 + Math.random() * 3000) / 10) * 10; // 500-3500 rounded
      const discountPercent = [0, 10, 15, 20, 25][i % 5];
      const discountPrice = discountPercent ? Math.round(price * (1 - discountPercent / 100)) : price;

      const images = [
        `https://via.placeholder.com/800x800.png?text=${encodeURIComponent(title)}`
      ];

      const sizes = sizeOptions.map((s, idx) => ({ size: s, stock: Math.floor(Math.random() * 20) + 1 }));

      return {
        title,
        description: `High quality ${category} made by ${brand}. Comfortable, durable and stylish. Model ${id} is a customer favorite.`,
        shortDescription: `Premium ${category} from ${brand}`,
        brand,
        category,
        price,
        discountPrice,
        images,
        sizes,
        colors: ['Brown', 'Black'],
        material: 'Leather',
        rating: +(3 + Math.random() * 2).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 2000),
        isFeatured: id <= 6, // first 6 featured
        isActive: true
      };
    });

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
}

seed();
