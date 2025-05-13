import mongoose from "mongoose";

const SalesMonthSchema = new mongoose.Schema({
    month: String,
    year: Number,
});

const SalesMonths = new mongoose.model('SalesMonth', SalesMonthSchema);

export default SalesMonths;