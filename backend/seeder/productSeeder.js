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
    // Footwear is sized numerically (UK sizing), not S/M/L/XL.
    const sizeOptions = ['7', '8', '9', '10', '11'];
    // Real product photography shipped in ecommerce-app/public/assets, served at "/assets/...".
    // via.placeholder.com is unreachable, so use these instead of dead external URLs.
    const sampleImages = [
      'VKS_8484.JPG', 'VKS_8488.JPG', 'VKS_8489.JPG', 'VKS_8494.JPG', 'VKS_8501.JPG',
      'VKS_8509.JPG', 'VKS_8512.JPG', 'VKS_8516.JPG', 'VKS_8521.JPG', 'VKS_8525.JPG',
      'VKS_8527.JPG', 'VKS_8536.JPG', 'VKS_8540.JPG', 'VKS_8541.JPG', 'VKS_8545.JPG',
      'VKS_8551.JPG', 'VKS_8557.JPG', 'VKS_8559.JPG'
    ];

    const products = Array.from({ length: 20 }).map((_, i) => {
      const id = i + 1;
      const title = `Footwear Model ${id}`;
      const category = sampleCategories[i % sampleCategories.length];
      const brand = brands[i % brands.length];
      const price = Math.round((500 + Math.random() * 3000) / 10) * 10; // 500-3500 rounded
      const discountPercent = [0, 10, 15, 20, 25][i % 5];
      const discountPrice = discountPercent ? Math.round(price * (1 - discountPercent / 100)) : price;

      const images = [`/assets/${sampleImages[i % sampleImages.length]}`];

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

    // Product.create (not insertMany) so the pre('save') hooks that generate
    // the unique `slug` field actually run for each document.
    const inserted = await Product.create(products);
    console.log(`Inserted ${inserted.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
}

seed();
