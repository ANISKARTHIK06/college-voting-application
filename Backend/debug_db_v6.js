const mongoose = require('mongoose');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/college-voting-app'); 
        console.log('Connected to DB');

        const Vote = mongoose.model('Vote', new mongoose.Schema({ title: String, eligibleGroup: String, eligibleValues: [String], status: String }), 'votes');

        const votes = await Vote.find({ title: /staff/i });
        console.log('Votes matching "staff":');
        votes.forEach(v => {
            console.log('ID:', v._id);
            console.log('Title:', v.title);
            console.log('Group:', v.eligibleGroup);
            console.log('Values:', v.eligibleValues);
            console.log('Status:', v.status);
            console.log('---');
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
