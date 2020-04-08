const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Employee Model
require('../models/Employee');
require('../models/Detail')
const Employee = mongoose.model('employees');
const Detail = mongoose.model('details');

// Employee Register Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('employees/add');
});
// Add Employee POST
router.post('/add', ensureAuthenticated, (req, res) => {
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
                const newDetail = new Detail({
                    user: employee.id
                });
                newDetail.save()
                .then( detail => {
                    req.flash('success_msg', 'New employee added');
                    res.redirect('/employees');
                });
            });
    }
});

// View Employee List
router.get('/', ensureAuthenticated, (req, res) => {
    Employee.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(employees => {
            res.render('employees/employees', {
                employees: employees
            });
        });
});


// Edit Employee PUT process
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    Employee.findOne({
        _id: req.params.id
    })
        .then(employee => {
            // new values
            employee.name = req.body.name;

            employee.save()
                .then(employee => {
                    req.flash('success_msg', 'Employee updated');
                    res.redirect('/employees');
                })
        });
});
// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Employee.findOne({
        _id: req.params.id
    })
        .then(employee => {
            if (employee.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/employees');
            } else {
                res.render('employees/edit', {
                    employee: employee
                });
            }

        });
});


// Delete Employee
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Employee.remove({ _id: req.params.id })
        .then(() => {
            Detail.remove({user: req.params.id
            })
            .then(() => {
                req.flash('success_msg', 'Employee removed');
                res.redirect('/employees');
            });
        });
});


module.exports = router;