import mongoose from "mongoose";

const AllMonthlyPurchaseDetailsSchema = new mongoose.Schema({
    monthAndYear: String,
    allPurchase: [{
        invoiceNumber: Number,
        date: String,
        gstRate: Number,
        gstAmount: Number,
        totalAmount: Number,
    }]
});

const AllMonthlyPurchaseDetails = new mongoose.model("AllMonthlyPurchaseDetails", AllMonthlyPurchaseDetailsSchema);

export default AllMonthlyPurchaseDetails;