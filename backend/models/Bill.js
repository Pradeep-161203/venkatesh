const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    billNumber: {
        type: String,
        required: false,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    items: [{
        rivetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rivet',
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        rate: {
            type: Number,
            required: true,
            min: 0
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    billDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'partial'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

billSchema.pre('save', function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.billNumber = `SV${year}${month}${day}${random}`;
    }
    next();
});

module.exports = mongoose.model('Bill', billSchema);
