const mongoose = require('mongoose');

const rivetSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        default: 'pcs'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

rivetSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Rivet', rivetSchema);
