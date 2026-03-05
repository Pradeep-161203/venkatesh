const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Rivet = require('../models/Rivet');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, startDate, endDate } = req.query;
        const query = {};
        
        if (search) {
            query.$or = [
                { billNumber: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (startDate && endDate) {
            query.billDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const bills = await Bill.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ billDate: -1 });
            
        const total = await Bill.countDocuments(query);
        
        res.json({
            bills,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get bill by ID
router.get('/:id', async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new bill
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, items, notes } = req.body;
        
        // Check stock availability and get rivet details
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const rivet = await Rivet.findById(item.rivetId);
            if (!rivet) {
                return res.status(404).json({ message: `Rivet not found` });
            }
            if (rivet.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${rivet.size}. Available: ${rivet.stock}, Required: ${item.quantity}` 
                });
            }
            
            // Update item with current rate and size
            items[i].rate = rivet.rate;
            items[i].size = rivet.size;
            items[i].amount = item.quantity * rivet.rate;
        }
        
        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        
        // Create bill
        const bill = new Bill({
            customerName,
            customerPhone,
            customerAddress,
            items,
            totalAmount,
            notes
        });
        
        // Update stock
        for (const item of items) {
            await Rivet.findByIdAndUpdate(
                item.rivetId,
                { $inc: { stock: -item.quantity } }
            );
        }
        
        const savedBill = await bill.save();
        res.status(201).json(savedBill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update bill
router.put('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete bill
router.delete('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        
        // Restore stock
        for (const item of bill.items) {
            await Rivet.findByIdAndUpdate(
                item.rivetId,
                { $inc: { stock: item.quantity } }
            );
        }
        
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
