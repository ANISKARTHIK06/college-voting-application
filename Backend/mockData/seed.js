const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Announcement = require('../models/Announcement');
const ActivityLog = require('../models/ActivityLog');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        console.log('Clearing old data...');
        await User.deleteMany();
        await Vote.deleteMany();
        await Candidate.deleteMany();
        await Announcement.deleteMany();
        await ActivityLog.deleteMany();

        // 1. Create Users
        console.log('Creating Mock Users...');
        
        const adminPassword = 'admin123';
        const studentPassword = 'student123';
        const facultyPassword = 'faculty123';

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@college.com',
                password: adminPassword, // pre-save hook won't double hash if we use insertMany, wait we use create which triggers save hooks! So we shouldn't pre-hash manually if pre-save hook exists.
                role: 'admin',
                userType: 'staff'
            },
            {
                name: 'Kavi Student',
                email: 'kavi@student.com',
                password: studentPassword,
                role: 'student',
                userType: 'student',
                department: 'Computer Science',
                position: '3rd Year'
            },
            {
                name: 'Rahul Sharma',
                email: 'rahul@student.com',
                password: studentPassword,
                role: 'student',
                userType: 'student',
                department: 'Mechanical',
                position: '2nd Year'
            },
            {
                name: 'Dr Meena',
                email: 'meena@college.com',
                password: facultyPassword,
                role: 'faculty',
                userType: 'staff',
                department: 'Computer Science'
            }
        ]);

        const adminId = users[0]._id;
        
        // 2. Announcements
        console.log('Creating Announcements...');
        await Announcement.create([
            {
                title: 'Welcome to the New Governance Platform',
                description: 'The Phase 4 CollegeVote system is now live for all students and faculty. Please report any issues to the admin.',
                department: 'All Departments',
                publishDate: new Date(),
                priority: 'Important',
                createdBy: adminId
            },
            {
                title: 'Library Hours Extended',
                description: 'During the examination period, the central library will remain open until midnight.',
                department: 'All Departments',
                publishDate: new Date(Date.now() - 86400000), // 1 day ago
                priority: 'Normal',
                createdBy: adminId
            }
        ]);

        // 3. Elections (Votes)
        console.log('Creating Elections...');
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const votes = await Vote.create([
            {
                title: 'Cultural Head Election 2026',
                description: 'Vote for the student who will lead all cultural activities and fests for the 2026 academic year.',
                votingType: 'Election',
                department: 'All Departments',
                eligibleGroup: 'All Students',
                createdBy: adminId,
                status: 'active',
                startTime: new Date(),
                endTime: threeDaysFromNow
            },
            {
                title: 'Sports Secretary Election',
                description: 'Select the primary representative for university athletics and intramural sports coordination.',
                votingType: 'Election',
                department: 'All Departments',
                eligibleGroup: 'All Students',
                createdBy: adminId,
                status: 'active',
                startTime: new Date(),
                endTime: threeDaysFromNow
            }
        ]);

        const culturalVote = votes[0];
        const sportsVote = votes[1];

        // 4. Candidates
        console.log('Creating Candidates...');
        const culturalCandidates = await Candidate.create([
            {
                voteId: culturalVote._id,
                name: 'Priya Patel',
                department: 'Arts',
                manifesto: 'I believe in bringing more inclusive and diverse cultural events to our campus. My plan includes a 3-day arts festival.',
                achievements: 'Lead Singer of the University Band, Organizer of Spring Fest 2025',
                promises: 'Monthly open mic nights, increased budget for student clubs',
            },
            {
                voteId: culturalVote._id,
                name: 'Arjun Kumar',
                department: 'Computer Science',
                manifesto: 'Bridging technology and art. We will digitize our events and create a college-wide cultural app.',
                achievements: 'Winner of inter-college drama competition',
                promises: 'Digital ticketing for events, Tech-Art fusion workshops',
            }
        ]);

        const sportsCandidates = await Candidate.create([
            {
                voteId: sportsVote._id,
                name: 'Sara Khan',
                department: 'Medical',
                manifesto: 'Better equipment, longer gym hours, and structured intramural leagues for everyone.',
                achievements: 'Captain of the University Basketball Team',
                promises: 'New gym equipment, expanded intramural sports',
            },
            {
                voteId: sportsVote._id,
                name: 'Vikram Singh',
                department: 'Mechanical',
                manifesto: 'I will advocate for regular inter-department tournaments and better funding for our athletes.',
                achievements: 'State-level sprinter',
                promises: 'Inter-department leagues, athletic scholarships',
            }
        ]);

        // Attach candidates to votes
        culturalVote.candidates = culturalCandidates.map(c => c._id);
        await culturalVote.save();

        sportsVote.candidates = sportsCandidates.map(c => c._id);
        await sportsVote.save();

        console.log('Mock Data Seeding Completed Successfully! 🌱');
        process.exit(0);

    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

connectDB().then(seedData);
