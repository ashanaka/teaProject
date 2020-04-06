const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Load Employee Model
require('../models/Employee');
const Employee = mongoose.model('employees');

// Employee Register Route
router.get('/add', (req, res) => {
    res.render('employees/add');
});
// Add Employee POST
router.post('/add', (req, res) => {
    let errors = [];

    if (!req.body.name) {
        errors.push({ text: 'Please add a name' });
    }

    if (errors.length > 0) {
        res.render('/add');
    } else {
        const newEmployee = new Employee({
            name: req.body.name,
            user: req.user.id
        });

        newEmployee.save()
            .then(employee => {
                req.flash('success_msg', 'New employee added');
                res.redirect('/employees');
            })
    }
});

// View Employee List
router.get('/', (req, res) => {
    Employee.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(employees => {
            res.render('employees/employees', {
                employees: employees
            });
        });
});


module.exports = router;