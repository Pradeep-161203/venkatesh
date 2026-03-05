const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const moment = require('moment');

// Sales report by period
router.get('/sales', async (req, res) => {
    try {
        const { period = 'daily', startDate, endDate } = req.query;
        
        let matchStage = {};
        if (startDate && endDate) {
            matchStage.billDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        let groupFormat;
        switch (period) {
            case 'daily':
                groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$billDate" } };
                break;
            case 'weekly':
                groupFormat = { $dateToString: { format: "%Y-W%U", date: "$billDate" } };
                break;
            case 'monthly':
                groupFormat = { $dateToString: { format: "%Y-%m", date: "$billDate" } };
                break;
            case 'yearly':
                groupFormat = { $dateToString: { format: "%Y", date: "$billDate" } };
                break;
            default:
                groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$billDate" } };
        }
        
        const salesData = await Bill.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupFormat,
                    totalSales: { $sum: "$totalAmount" },
                    totalQuantity: { $sum: { $sum: "$items.quantity" } },
                    billCount: { $sum: 1 },
                    averageSale: { $avg: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dashboard summary
router.get('/dashboard', async (req, res) => {
    try {
        const today = moment().startOf('day');
        const thisWeek = moment().startOf('week');
        const thisMonth = moment().startOf('month');
        const thisYear = moment().startOf('year');
        
        const [
            todaySales,
            weekSales,
            monthSales,
            yearSales,
            totalSales,
            recentBills,
            topRivets
        ] = await Promise.all([
            // Today's sales
            Bill.aggregate([
                { $match: { billDate: { $gte: today.toDate() } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
            ]),
            
            // This week's sales
            Bill.aggregate([
                { $match: { billDate: { $gte: thisWeek.toDate() } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
            ]),
            
            // This month's sales
            Bill.aggregate([
                { $match: { billDate: { $gte: thisMonth.toDate() } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
            ]),
            
            // This year's sales
            Bill.aggregate([
                { $match: { billDate: { $gte: thisYear.toDate() } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
            ]),
            
            // Total all-time sales
            Bill.aggregate([
                { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
            ]),
            
            // Recent bills (last 10)
            Bill.find().sort({ billDate: -1 }).limit(10),
            
            // Top selling rivets
            Bill.aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.size",
                        size: { $first: "$items.size" },
                        totalQuantity: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$items.amount" }
                    }
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 5 }
            ])
        ]);
        
        res.json({
            today: todaySales[0] || { total: 0, count: 0 },
            week: weekSales[0] || { total: 0, count: 0 },
            month: monthSales[0] || { total: 0, count: 0 },
            year: yearSales[0] || { total: 0, count: 0 },
            total: totalSales[0] || { total: 0, count: 0 },
            recentBills,
            topRivets
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Stock report
router.get('/stock', async (req, res) => {
    try {
        const Rivet = require('../models/Rivet');
        const rivets = await Rivet.find().sort({ stock: 1 });
        
        const totalStock = rivets.reduce((sum, rivet) => sum + rivet.stock, 0);
        const totalValue = rivets.reduce((sum, rivet) => sum + (rivet.stock * rivet.rate), 0);
        const lowStock = rivets.filter(rivet => rivet.stock < 10);
        
        res.json({
            rivets,
            summary: {
                totalStock,
                totalValue,
                lowStockCount: lowStock.length,
                lowStockItems: lowStock
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
