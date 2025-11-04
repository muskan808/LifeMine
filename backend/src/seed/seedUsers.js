require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function seed() {
  await connectDB();
  await User.deleteMany({});

  const users = [
    {
      name: 'John Doe',
      username: 'johnd',
      email: 'john@example.com',
      phone: '+911234567890',
      website: 'https://example.com',
      isActive: true,
      skills: ['React', 'Node'],
      availableSlots: [new Date('2025-12-01T10:00:00Z')],
      address: { street: '123 Main St', city: 'Delhi', zipcode: '110001' },
      company: { name: 'TechCorp' },
      role: 'Admin',
    },
    {
      name: 'Jane Smith',
      username: 'janes',
      email: 'jane@example.com',
      phone: '+919876543210',
      website: 'https://jane.dev',
      isActive: false,
      skills: ['Angular', 'Express'],
      availableSlots: [new Date('2025-12-10T12:00:00Z')],
      address: { street: '45 Park Ave', city: 'Mumbai', zipcode: '400001' },
      company: { name: 'WebWorks' },
      role: 'Editor',
    }
  ];

  await User.insertMany(users);
  console.log('Seeded users');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
