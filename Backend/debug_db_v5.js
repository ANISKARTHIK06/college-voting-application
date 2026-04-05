const mongoose = require('mongoose');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/college-voting-app'); 
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, userType: String, department: String, position: String }), 'users');

        const kavi = await User.findOne({ name: /kavi/i });
        if (kavi) {
            console.log('Kavi User Info:');
            console.log('ID:', kavi._id);
            console.log('Name:', kavi.name);
            console.log('Role:', kavi.role);
            console.log('UserType:', kavi.userType);
            console.log('Dept:', kavi.department);
            console.log('Pos:', kavi.position);
        } else {
            console.log('Kavi not found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
