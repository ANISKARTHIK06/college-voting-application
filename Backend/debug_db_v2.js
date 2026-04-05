const mongoose = require('mongoose');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/college-voting'); 
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, userType: String, department: String, position: String }));
        const Vote = mongoose.model('Vote', new mongoose.Schema({ title: String, eligibleGroup: String, eligibleValues: [String], status: String }));

        const users = await User.find({ name: /kavi/i });
        console.log('Users matching name "kavi":', JSON.stringify(users, null, 2));

        const votes = await Vote.find({ title: /staff/i });
        console.log('Votes matching title "staff":', JSON.stringify(votes, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
