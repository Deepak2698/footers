import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

async function seedUsers() {
  try {
    await connectDB();

    const users = [
      { name: 'Owner Admin', email: 'adminboss@footers.in', password: 'Boss@dcc', role: 'owner' },
      { name: 'Staff Admin', email: 'admin@footers.in', password: 'admin@123', role: 'staff' }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email.toLowerCase() });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping`);
        continue;
      }

      const user = new User({ name: u.name, email: u.email.toLowerCase(), password: u.password, role: u.role });
      await user.save();
      console.log(`Created user: ${u.email} (${u.role})`);
    }

    console.log('User seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('User seeder error:', err);
    process.exit(1);
  }
}

seedUsers();
