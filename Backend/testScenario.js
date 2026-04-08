const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-voting');
  const User = require('./models/User.js');
  const Vote = require('./models/Vote.js');
  
  const user = await User.findOne({name: 'kavitha'});
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  // Make sure we have axios available via fetch if not installed
  let data;
  try {
     const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            title: 'Test Create Election Script',
            description: 'testing draft visibility',
            votingType: 'Election',
            eligibleGroup: 'Staff Only',
            startTime: new Date(Date.now() + 86400000).toISOString(),
            endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
            candidates: []
        })
     };
     const resPost = await fetch('http://localhost:5000/api/votes', reqOptions);
     console.log('POST STATUS:', resPost.status);
     const getOptions = {
        headers: { 'Authorization': `Bearer ${token}` }
     };
     const resGet = await fetch('http://localhost:5000/api/votes', getOptions);
     data = await resGet.json();
  } catch(e) {
     console.error(e);
  }
  
  console.log('LENGTH AFTER POST:', data?.length);
  const myVote = data?.find(v => v.title === 'Test Create Election Script');
  console.log('FOUND MY VOTE:', !!myVote, myVote?.status);
  
  process.exit();
}
test();
