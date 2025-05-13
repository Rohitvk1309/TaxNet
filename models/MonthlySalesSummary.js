// import mongoose from "mongoose";

// // const MonthlySalesSummarySchema = new mongoose.Schema({
// //     monthAndYear: String,
// //     summary: {
// //         total: Number,
// //         total18Percent: Number,
// //         total28Percent: Number,
// //         total5Percent: Number,
// //     },
// // });

// const totalInvoiceAmount = allSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
// const MonthlySalesSummarySchema = new mongoose.Schema({
//     monthAndYear: String,
//     summary: {
//         total: { type: Number, default: 0 },
//         total18Percent: { type: Number, default: 0 },
//         total28Percent: { type: Number, default: 0 },
//         total5Percent: { type: Number, default: 0 }, 
//         total12Percent: { type: Number, default: 0 }, 
//         totalInvoiceAmount
//     },
// });

// const MonthlySalesSummary = new mongoose.model("MonthlySalesSummary", MonthlySalesSummarySchema);

// export default MonthlySalesSummary;


import mongoose from "mongoose";

const MonthlySalesSummarySchema = new mongoose.Schema({
    monthAndYear: String,
    summary: {
        total: { type: Number, default: 0 },
        total18Percent: { type: Number, default: 0 },
        total28Percent: { type: Number, default: 0 },
        total5Percent: { type: Number, default: 0 },
        total12Percent: { type: Number, default: 0 },
        totalInvoiceAmount: { type: Number, default: 0 } // ✅ define it properly here
    },
});

const MonthlySalesSummary = mongoose.model("MonthlySalesSummary", MonthlySalesSummarySchema);

export default MonthlySalesSummary;
