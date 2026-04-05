const mongoose = require('mongoose');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/college-voting'); 
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String, role: String, userType: String, department: String, position: String }), 'users');
        const Vote = mongoose.model('Vote', new mongoose.Schema({ title: String, eligibleGroup: String, eligibleValues: [String], status: String }), 'votes');

        const allUsers = await User.find({});
        console.log('Total Users:', allUsers.length);
        const kavis = allUsers.filter(u => u.name && u.name.toLowerCase().includes('kavi'));
        console.log('Kavis found:', JSON.stringify(kavis, null, 2));

        const allVotes = await Vote.find({});
        console.log('Total Votes:', allVotes.length);
        const staffElections = allVotes.filter(v => v.eligibleGroup === 'Staff Only');
        console.log('Staff Only Elections:', JSON.stringify(staffElections, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
