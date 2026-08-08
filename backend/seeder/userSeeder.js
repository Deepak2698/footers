import connectDB from '../config/db.js';
import User from '../models/User.js';
import env from '../config/env.js';

// Default credentials are for local development only. In production, real
// credentials must be supplied via env vars — the script refuses to seed
// well-known/default passwords into a production database.
const DEFAULT_OWNER = { email: 'adminboss@footers.in', password: 'Boss@dcc' };
const DEFAULT_STAFF = { email: 'admin@footers.in', password: 'admin@123' };

async function seedUsers() {
  try {
    const ownerEmail = process.env.SEED_OWNER_EMAIL || DEFAULT_OWNER.email;
    const ownerPassword = process.env.SEED_OWNER_PASSWORD || DEFAULT_OWNER.password;
    const staffEmail = process.env.SEED_STAFF_EMAIL || DEFAULT_STAFF.email;
    const staffPassword = process.env.SEED_STAFF_PASSWORD || DEFAULT_STAFF.password;

    const usingDefaults = !process.env.SEED_OWNER_PASSWORD || !process.env.SEED_STAFF_PASSWORD;
    if (env.isProduction && usingDefaults) {
      console.error('[FATAL] Refusing to seed default/well-known credentials in production. Set SEED_OWNER_PASSWORD and SEED_STAFF_PASSWORD env vars first.');
      process.exit(1);
    }
    if (usingDefaults) {
      console.warn('[WARN] Using default seed credentials — for local development only. Set SEED_OWNER_PASSWORD / SEED_STAFF_PASSWORD to override.');
    }

    await connectDB();

    const users = [
      { name: 'Owner Admin', email: ownerEmail, password: ownerPassword, role: 'owner' },
      { name: 'Staff Admin', email: staffEmail, password: staffPassword, role: 'staff' }
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
