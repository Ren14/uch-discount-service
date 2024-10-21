const express = require('express');
const router = express.Router();
const discountController = require('../controller/discountController');

// Create a discount
router.post('/discounts', discountController.createDiscount);

// Get all discounts
router.get('/discounts', discountController.getDiscounts);

// Get a discount by ID
router.get('/discounts/:id', discountController.getDiscountById);

// Update a discount
router.put('/discounts/:id', discountController.updateDiscount);

// Delete a discount
router.delete('/discounts/:id', discountController.deleteDiscount);

module.exports = router;

