const mongoose = require('mongoose');
const Vote = require('./models/Vote');
const User = require('./models/User');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/college-voting'); // Assuming local mongo
        console.log('Connected to DB');

        const kavi = await User.findOne({ name: /kavi/i });
        console.log('User Kavi:', JSON.stringify(kavi, null, 2));

        const staffElection = await Vote.findOne({ title: /staff/i });
        console.log('Staff Election:', JSON.stringify(staffElection, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
