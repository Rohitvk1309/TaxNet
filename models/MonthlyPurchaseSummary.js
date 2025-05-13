import mongoose from "mongoose";

const MonthlyPurchaseSummarySchema = new mongoose.Schema({
    monthAndYear: String,
    summary: {
        total: Number,
        total18Percent: Number,
        total28Percent: Number,
        total5Percent: Number,
    },
});

const MonthlyPurchaseSummary = new mongoose.model("MonthlyPurchaseSummary", MonthlyPurchaseSummarySchema);

export default MonthlyPurchaseSummary;