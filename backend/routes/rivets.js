const express = require('express');
const router = express.Router();
const Rivet = require('../models/Rivet');

// Get all rivets
router.get('/', async (req, res) => {
    try {
        const rivets = await Rivet.find().sort({ size: 1 });
        res.json(rivets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get rivet by ID
router.get('/:id', async (req, res) => {
    try {
        const rivet = await Rivet.findById(req.params.id);
        if (!rivet) {
            return res.status(404).json({ message: 'Rivet not found' });
        }
        res.json(rivet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new rivet
router.post('/', async (req, res) => {
    try {
        const rivet = new Rivet(req.body);
        const savedRivet = await rivet.save();
        res.status(201).json(savedRivet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update rivet
router.put('/:id', async (req, res) => {
    try {
        const rivet = await Rivet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!rivet) {
            return res.status(404).json({ message: 'Rivet not found' });
        }
        
        res.json(rivet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update stock
router.put('/:id/stock', async (req, res) => {
    try {
        const { stock } = req.body;
        
        const rivet = await Rivet.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true, runValidators: true }
        );
        
        if (!rivet) {
            return res.status(404).json({ message: 'Rivet not found' });
        }
        
        res.json(rivet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete rivet
router.delete('/:id', async (req, res) => {
    try {
        const rivet = await Rivet.findByIdAndDelete(req.params.id);
        if (!rivet) {
            return res.status(404).json({ message: 'Rivet not found' });
        }
        res.json({ message: 'Rivet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
