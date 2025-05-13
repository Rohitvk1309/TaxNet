import mongoose from "mongoose";

const CurrentMonthSchema = new mongoose.Schema({
    month: String,
    year: String,
});

const CurrentMonth = mongoose.model('CurrentMonth', CurrentMonthSchema);

export default CurrentMonth;