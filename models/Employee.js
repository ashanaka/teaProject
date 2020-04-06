const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
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

mongoose.model('employees', EmployeeSchema);