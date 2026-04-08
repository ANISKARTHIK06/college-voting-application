require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-voting');
  const User = require('./models/User.js');
  const user = await User.findOne({name: 'kavitha'});
  
  // Create token
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  const response = await fetch('http://localhost:5000/api/votes', {
      headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('HTTP RESPONSE LENGTH:', data.length);
  console.log('STATUSES:', data.map(v => v.status));
  process.exit();
}
test().catch(console.log);
