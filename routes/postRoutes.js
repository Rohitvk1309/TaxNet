import express from 'express';
import connectDB from '../database/db.js';
import CurrentMonth from '../models/CurrentMonth.js';
import SalesMonths from '../models/SalesMonths.js';
import PurchaseMonths from '../models/PurchaseMonths.js';
import AllMonthlySalesDetails from '../models/AllMonthlySalesDetails.js';
import AllMonthlyPurchaseDetails from '../models/AllMonthlyPurchaseDetails.js';
import MonthlySalesSummary from '../models/MonthlySalesSummary.js';
import MonthlyPurchaseSummary from '../models/MonthlyPurchaseSummary.js';

const postRouter = express.Router();

connectDB();

postRouter.post('/sales/addMonth', async (req, res) => {

    //check if the month and year already exists in the database in SalesMonths collection

    const month = req.body.month;
    const year = req.body.year;

    const aMonth = await SalesMonths.findOne({ month: month, year: year });

    if (aMonth) {
        res.status(400).send({ message: "Month already exists" });
        return;
    }

    //change value of month and year in CurrentMonth collection in database if it already exists

    const currentMonth = await CurrentMonth.findOne({});

    if (currentMonth) {
        currentMonth.month = req.body.month;
        currentMonth.year = req.body.year;
        await currentMonth.save();
    }

    else {
        const addCurrentMonth = new CurrentMonth({
            month: req.body.month,
            year: req.body.year,
        });

        await addCurrentMonth.save();
    }

    const addSalesMonth = new SalesMonths({
        month: req.body.month,
        year: req.body.year,
    });

    await addSalesMonth.save();

    const addAllMonthlySalesDetails = new AllMonthlySalesDetails({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        allSales: [],
    });
    await addAllMonthlySalesDetails.save();

    const addMonthlySalesSummary = new MonthlySalesSummary({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        summary: {
            total: 0,
            total18Percent: 0,
            total28Percent: 0,
            total5Percent: 0,
            total12Percent: 0,
        },
    });
    await addMonthlySalesSummary.save();

    const addPurchaseMonth = new PurchaseMonths({
        month: req.body.month,
        year: req.body.year,
    });

    await addPurchaseMonth.save();

    const addAllMonthlyPurchaseDetails = new AllMonthlyPurchaseDetails({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        allPurchase: [],
    });
    await addAllMonthlyPurchaseDetails.save();

    const addMonthlyPurchaseSummary = new MonthlyPurchaseSummary({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        summary: {
            total: 0,
            total18Percent: 0,
            total28Percent: 0,
            // total5Percent: 0,
        },
    });
    await addMonthlyPurchaseSummary.save();

    res.status(200).send();
});

postRouter.post('/purchase/addMonth', async (req, res) => {

    //check if the month and year already exists in the database in SalesMonths collection

    const month = req.body.month;
    const year = req.body.year;

    const aMonth = await PurchaseMonths.findOne({ month: month, year: year });

    if (aMonth) {
        res.status(400).send({ message: "Month already exists" });
        return;
    }

    //change value of month and year in CurrentMonth collection in database if it already exists

    const currentMonth = await CurrentMonth.findOne({});

    if (currentMonth) {
        currentMonth.month = req.body.month;
        currentMonth.year = req.body.year;
        await currentMonth.save();
    }

    else {
        const addCurrentMonth = new CurrentMonth({
            month: req.body.month,
            year: req.body.year,
        });

        await addCurrentMonth.save();
    }

    const addPurchaseMonth = new PurchaseMonths({
        month: req.body.month,
        year: req.body.year,
    });

    await addPurchaseMonth.save();

    const addAllMonthlyPurchaseDetails = new AllMonthlyPurchaseDetails({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        allPurchase: [],
    });
    await addAllMonthlyPurchaseDetails.save();

    const addMonthlyPurchaseSummary = new MonthlyPurchaseSummary({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        summary: {
            total: 0,
            total18Percent: 0,
            total28Percent: 0,
            // total5Percent: 0,
        },
    });
    await addMonthlyPurchaseSummary.save();

    const addSalesMonth = new SalesMonths({
        month: req.body.month,
        year: req.body.year,
    });

    await addSalesMonth.save();

    const addAllMonthlySalesDetails = new AllMonthlySalesDetails({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        allSales: [],
    });
    await addAllMonthlySalesDetails.save();

    const addMonthlySalesSummary = new MonthlySalesSummary({
        monthAndYear: req.body.month.toLowerCase() + '-' + req.body.year,
        summary: {
            total: 0,
            total18Percent: 0,
            total28Percent: 0,
            total5Percent: 0,
            total12Percent: 0,
        },
    });
    await addMonthlySalesSummary.save();

    res.status(200).send();
});

postRouter.post('/addSale', async (req, res) => {

    const monthYear = req.query.monthYear;
    const newData = {
        invoiceNumber: req.body.invoiceNumber,
        date: req.body.date,
        gstRate: req.body.gstRate,
        category:req.body.category,
        gstAmount: (req.body.gstRate * req.body.totalAmount / 100).toFixed(2),
        totalAmount: (typeof req.body.totalAmount === 'number') ? req.body.totalAmount.toFixed(2) : req.body.totalAmount,
    }

    //push the new sale to the monthYear in AllMonthlySalesDetails collection

    const monthlySales = await AllMonthlySalesDetails.findOne({ monthAndYear: monthYear });

    if (!monthlySales) {
        return res.status(404).json({ message: `Sales data not found for monthYear: ${monthYear}` });
    }


    monthlySales.allSales = monthlySales.allSales.concat(newData);

    await monthlySales.save();

    const summary = await MonthlySalesSummary.findOne({ monthAndYear: monthYear });

    if (!summary) {
        return res.status(404).json({ message: `Sales summary not found for monthYear: ${monthYear}` });
    }

    summary.summary.total = Number(summary.summary.total) + Number(newData.gstAmount);
    if (newData.gstRate === 18) {
        summary.summary.total18Percent = Number(summary.summary.total18Percent) + Number(newData.gstAmount);
    } else if (newData.gstRate === 28) {
        summary.summary.total28Percent = Number(summary.summary.total28Percent) + Number(newData.gstAmount);
    } else if (newData.gstRate === 5) {
        summary.summary.total5Percent = Number(summary.summary.total5Percent) + Number(newData.gstAmount);
    } else if (newData.gstRate === 12) {
        summary.summary.total12Percent = Number(summary.summary.total12Percent) + Number(newData.gstAmount);
    }

    await summary.save();
});





postRouter.post('/addPurchase', async (req, res) => {
    const monthYear = req.query.monthYear;
    const newData = {
        invoiceNumber: req.body.invoiceNumber,
        date: req.body.date,
        gstRate: req.body.gstRate,
        gstAmount: (req.body.gstRate * req.body.totalAmount / 100).toFixed(2),
        totalAmount: (typeof req.body.totalAmount === 'number') ? req.body.totalAmount.toFixed(2) : req.body.totalAmount,
    }

    //push the new sale to the monthYear in AllMonthlySalesDetails collection

    const monthlyPurchase = await AllMonthlyPurchaseDetails.findOne({ monthAndYear: monthYear });

    monthlyPurchase.allPurchase = monthlyPurchase.allPurchase.concat(newData);

    await monthlyPurchase.save();

    const summary = await MonthlyPurchaseSummary.findOne({ monthAndYear: monthYear });
    summary.summary.total = Number(summary.summary.total) + Number(newData.gstAmount);
    if (newData.gstRate === 18) {
        summary.summary.total18Percent = Number(summary.summary.total18Percent) + Number(newData.gstAmount);
    } else if (newData.gstRate === 28) {
        summary.summary.total28Percent = Number(summary.summary.total28Percent) + Number(newData.gstAmount);
    } 
    await summary.save();
})

export default postRouter;