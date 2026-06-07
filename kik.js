const bycrpt = require('bcryptjs');
const mongoose = require('mongoose');

const User= require('./models/user');


mongoose.connect('mongodb://localhost:27017/iti-blog').then(async () => {
  console.log('Connected to MongoDB');
  const hashedPassword = await bycrpt.hash('123456', 12);
  const user = new User({
    name: 'admin',
    email: 'admin@admin.com',
    password: hashedPassword,
    role: 'admin'
  });
  await user.save();
  console.log('Admin user created');
});