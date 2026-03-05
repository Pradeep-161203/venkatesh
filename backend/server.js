const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/billing', require('./routes/billing'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/rivets', require('./routes/rivets'));

app.get('/api/company', (req, res) => {
    res.json({
        name: process.env.COMPANY_NAME,
        address: process.env.COMPANY_ADDRESS,
        phone: process.env.COMPANY_PHONE,
        email: process.env.COMPANY_EMAIL
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Company: ${process.env.COMPANY_NAME}`);
});
