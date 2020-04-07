const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Load Employee Model
require('../models/Detail');
const Detail = mongoose.model('details');
const Employee = mongoose.model('employees');

// view the employee list to add or edit details
router.get('/add', (req, res) => {
    Employee.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(employees => {
            res.render('details/add', {
                employees: employees
            });
        });
});

//View Employee details
router.get('/view/:id', (req, res) => {
    Employee.findOne({_id: req.params.id})
    .then(employee => {
        Detail.findOne({user: employee.id})
        .then(detail => {
            //count to be paid
            let tobepaid = (Number(detail.kiloGrams) * Number(req.user.amountPerKG)) - Number(detail.loanAmount);
            if(Number(detail.lastPayment < 0)){
                tobepaid = tobepaid + Number(detail.lastPayment);
            }
            res.render('details/view', {
                employee: employee,
                detail: detail, 
                tobepaid: tobepaid,
             });
        });
    });
});

//Update Details from Add Details form
router.put('/edit/:id', (req, res) => {
    let kilograms = Number(req.body.amount) || 0;
    let loanamount = Number(req.body.loan) || 0;
    let lastpayment = Number(req.body.lastPayment) || 0;
    let tobepaid = Number(req.body.toBePaid) || 0;
    Detail.findOne({
        user: req.params.id
    })
        .then(detail => {
            // new values & checking the update source
            if (req.body.update == 'update'){
                detail.kiloGrams = Number(req.body.amount);
                detail.loanAmount = Number(req.body.loan);
                detail.lastPayment = Number(req.body.lastPayment);
            }else if(req.body.update == 'payment'){
                detail.kiloGrams = 0;
                detail.loanAmount = 0;
                detail.lastPayment = Number(req.body.toBePaid);
            }else{
                detail.kiloGrams = Number(detail.kiloGrams) + kilograms;
                detail.loanAmount = Number(detail.loanAmount) + loanamount;
            }
            detail.save()
                .then(detail => {
                    req.flash('success_msg', 'Data Updated');
                    res.redirect('/details/add');
                })
        });
});

module.exports = router;