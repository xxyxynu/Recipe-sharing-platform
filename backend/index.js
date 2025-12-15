const express = require('express');
const dotenv = require('dotenv').config();
const dbConnections = require('./config/dbConnections');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const recipeRoutes = require('./routes/recipeRoutes');
const chefRoutes = require('./routes/chefRoutes');

dbConnections();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use("/users", userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/recipes', recipeRoutes);
app.use('/chefs', chefRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Recipe Sharing Platform API', 
        version: '1.0.0',
            endpoints: {
            health: '/health',
            users: '/users',
            recipes: '/recipes',
            chefs: '/chefs',
            uploads: '/uploads'
        }
    });
});

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});