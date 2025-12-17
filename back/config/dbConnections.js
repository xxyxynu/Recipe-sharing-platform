const mongoose = require('mongoose');

const dbConnections = async () => {
    try {
<<<<<<< HEAD:backend/config/dbConnections.js
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI environment variable is not set!');
            process.exit(1);
        }
        const connect = await mongoose.connect(mongoUri);
=======
        const connect = await mongoose.connect(process.env.MONGO_URI)
>>>>>>> f806cdb (updated front and back):back/config/dbConnections.js
        console.log('MongoDB connected:', connect.connection.name);
    } catch (err) {
        console.log('DB connection error:', err);
        process.exit(1);
    }
}

module.exports = dbConnections;