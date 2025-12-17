const mongoose = require('mongoose');

const dbConnections = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI environment variable is not set!');
            process.exit(1);
        }
        const connect = await mongoose.connect(mongoUri);
        console.log('MongoDB connected:', connect.connection.name);
    } catch (err) {
        console.log('DB connection error:', err);
        process.exit(1);
    }
}

module.exports = dbConnections;