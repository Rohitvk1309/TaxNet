import express from 'express';
import connectDB from '../database/db.js';
import CurrentMonth from '../models/CurrentMonth.js';
import SalesMonths from '../models/SalesMonths.js';
import PurchaseMonths from '../models/PurchaseMonths.js';
import AllMonthlySalesDetails from '../models/AllMonthlySalesDetails.js';
import AllMonthlyPurchaseDetails from '../models/AllMonthlyPurchaseDetails.js';
import MonthlySalesSummary from '../models/MonthlySalesSummary.js';
import MonthlyPurchaseSummary from '../models/MonthlyPurchaseSummary.js';

const getRouter = express.Router();

connectDB();

getRouter.get('/home', async (req, res) => {

    let currentMonthAndYear;
    let salesTax;
    let purchaseTax;

    const formatMonthAndYear = (monthAndYear) => {
        return monthAndYear.toLowerCase().replace(' ', '-');
    }

    await CurrentMonth.find()
        .then(data => currentMonthAndYear = data.length === 0 ? '' : data[0].month + ' ' + data[0].year)
        .catch(err => console.log(err));

    await MonthlySalesSummary.find({ monthAndYear: formatMonthAndYear(currentMonthAndYear) })
        .then(data => salesTax = data.length === 0 ? 0 : data[0].summary.total)
        .catch(err => console.log(err));

    await MonthlyPurchaseSummary.find({ monthAndYear: formatMonthAndYear(currentMonthAndYear) })
        .then(data => purchaseTax = data.length === 0 ? 0 : data[0].summary.total)
        .catch(err => console.log(err));

    const response = {
        currentMonthAndYear,
        salesTax,
        purchaseTax,
    };

    res.json(response);
});

getRouter.get('/sales', async (req, res) => {
    await SalesMonths.find()
        .then(data => res.json(data.reverse()))
        .catch(err => console.log(err));
});

getRouter.get('/purchase', async (req, res) => {
    await PurchaseMonths.find()
        .then(data => res.json(data.reverse()))
        .catch(err => console.log(err));
});

// getRouter.get('/viewSales', async (req, res) => {
//     try {
//         const allSales = await AllMonthlySalesDetails.find({ monthAndYear: req.query.monthYear });
//         const salesSummary = await MonthlySalesSummary.find({ monthAndYear: req.query.monthYear });

//         const response = {
//             salesSummary: salesSummary[0]?.summary || [], // use optional chaining
//             allSales: allSales[0]?.allSales?.slice().reverse() || [], // safe check and reverse
//         };

//         res.send(response);
//     } catch (error) {
//         console.error("Error fetching sales data:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

getRouter.get('/viewSales', async (req, res) => {
    try {
        const monthYear = req.query.monthYear;

        const allSalesData = await AllMonthlySalesDetails.findOne({ monthAndYear: monthYear });
        const salesSummaryData = await MonthlySalesSummary.findOne({ monthAndYear: monthYear });

        const allSales = allSalesData?.allSales || [];
        const reversedSales = allSales.slice().reverse();

        // Calculate total invoice amount from all sales if not in summary
        const totalInvoiceAmount = allSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

        const salesSummary = {
            ...salesSummaryData?.summary,
            totalInvoiceAmount 
        };

        res.send({
            salesSummary,
            allSales: reversedSales,
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



getRouter.get('/viewPurchase', async (req, res) => {

    const allPurchase = await AllMonthlyPurchaseDetails.find({ monthAndYear: req.query.monthYear });

    const purchaseSummary = await MonthlyPurchaseSummary.find({ monthAndYear: req.query.monthYear });

    const response = {
        purchaseSummary: purchaseSummary[0].summary,
        allPurchase: allPurchase[0].allPurchase.reverse(),
    }

    res.send(response);
});

export default getRouter;