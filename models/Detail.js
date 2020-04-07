const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DetailSchema = new Schema({
    kiloGrams: {
        type: Number,
        required: false,
        default: 0,
    },
    loanAmount:{
        type: Number,
        required: false,
        default: 0,
    },
    lastPayment: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('details', DetailSchema);