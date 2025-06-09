const mongoose = require('mongoose');
const UserType = require('../models/usertype');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../app.env') });

const setupAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.databaseurl);
        console.log('Connected to database');

        // Create admin user type if it doesn't exist
        let adminType = await UserType.findOne({ name: 'admin' });
        if (!adminType) {
            adminType = await UserType.create({ name: 'admin' });
            console.log('Admin user type created');
        }

        // Create admin user if it doesn't exist
        const adminEmail = 'admin@example.com';
        let adminUser = await User.findOne({ email: adminEmail });
        
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('Admin123456', 10);
            adminUser = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                userType: adminType._id
            });
            console.log('Admin user created');
        }

        console.log('Setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
};

setupAdmin(); 