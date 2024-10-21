const Discount = require('../models/discount');

// Create a new discount
exports.createDiscount = async (req, res) => {
  try {
    const { code, discount_percent, is_active } = req.body;
    const discount = await Discount.create({
      code,
      discount_percent,
      is_active,
      created_at: new Date(),
      modified_at: new Date(),
    });
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create discount' });
  }
};

// Get all discounts
exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll();
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve discounts' });
  }
};

// Get a discount by ID
exports.getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByPk(id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve discount' });
  }
};

// Update a discount
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_percent, is_active } = req.body;

    const discount = await Discount.findByPk(id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    discount.code = code || discount.code;
    discount.discount_percent = discount_percent || discount.discount_percent;
    discount.is_active = is_active !== undefined ? is_active : discount.is_active;
    discount.modified_at = new Date();

    await discount.save();

    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update discount' });
  }
};

// Delete a discount
exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByPk(id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    await discount.destroy();
    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discount' });
  }
};

