const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-voting').then(async () => {
   const Vote = require('./models/Vote.js');
   const User = require('./models/User.js');
   const user = await User.findOne({name: 'kavitha'});
   let query = {};
   query.status = { $in: ['draft', 'active', 'ended', 'published'] };
   const conditions = [ { eligibleGroup: 'All Users' } ];
   if (user.userType === 'staff') {
       conditions.push({ eligibleGroup: 'Staff Only' });
   }
   conditions.push({ createdBy: user._id });
   query.$or = conditions;
   const votes = await Vote.find(query);
   console.log('LENGTH:', votes.length);
   process.exit();
}).catch(console.log);
