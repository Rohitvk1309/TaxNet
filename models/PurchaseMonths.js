import mongoose from "mongoose";

const PurchaseMonthsSchema = new mongoose.Schema({
    month: String,
    year: Number,
});

const PurchaseMonths = new mongoose.model('PurchaseMonths', PurchaseMonthsSchema);

export default PurchaseMonths;