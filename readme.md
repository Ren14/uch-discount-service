### Pre requisites
How to create postgres database with docker https://dev.to/andre347/how-to-easily-create-a-postgres-database-in-docker-4moj

Here's a basic Node.js API using Express to manage discounts, with PostgreSQL as the database engine.

### Step-by-step guide:

1. **Install the necessary packages**:

   Run the following command in your terminal to install the necessary dependencies:
   ```bash
   npm init -y
   npm install express pg sequelize body-parser
   ```

2. **Set up the project structure**:

   Create a basic folder structure for your project:

   ```
   .
   ├── config
   │   └── database.js
   ├── controllers
   │   └── discountController.js
   ├── models
   │   └── discount.js
   ├── routes
   │   └── discountRoutes.js
   ├── app.js
   └── package.json
   ```

3. **Set up PostgreSQL connection** (`config/database.js`):

   Here you configure the connection to your PostgreSQL database using Sequelize:

   ```js
   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
     host: 'localhost',
     dialect: 'postgres',
   });

   sequelize
     .authenticate()
     .then(() => {
       console.log('Connection has been established successfully.');
     })
     .catch((err) => {
       console.error('Unable to connect to the database:', err);
     });

   module.exports = sequelize;
   ```

   Replace `'your_database'`, `'your_username'`, and `'your_password'` with your actual PostgreSQL database details.

4. **Create the Discount model** (`models/discount.js`):

   Define the `Discount` model with the required attributes.

   ```js
   const { DataTypes } = require('sequelize');
   const sequelize = require('../config/database');

   const Discount = sequelize.define('Discount', {
     id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true,
     },
     code: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     discount_percent: {
       type: DataTypes.FLOAT,
       allowNull: false,
     },
     is_active: {
       type: DataTypes.BOOLEAN,
       defaultValue: true,
     },
     created_at: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
     },
     modified_at: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
     },
   }, {
     timestamps: false,
     tableName: 'discounts',
   });

   module.exports = Discount;
   ```

5. **Create a controller for the Discount model** (`controllers/discountController.js`):

   Add basic CRUD operations (Create, Read, Update, Delete) for discounts.

   ```js
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
   ```

6. **Set up routes** (`routes/discountRoutes.js`):

   Define the routes for the discount API.

   ```js
   const express = require('express');
   const router = express.Router();
   const discountController = require('../controllers/discountController');

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
   ```

7. **Set up the Express app** (`app.js`):

   Create the Express application and set it up to use the defined routes and middleware.

   ```js
   const express = require('express');
   const bodyParser = require('body-parser');
   const discountRoutes = require('./routes/discountRoutes');
   const sequelize = require('./config/database');

   const app = express();
   const port = process.env.PORT || 3000;

   // Middleware
   app.use(bodyParser.json());

   // Routes
   app.use('/api', discountRoutes);

   // Sync models with database
   sequelize.sync()
     .then(() => {
       console.log('Database synchronized');
     })
     .catch((err) => {
       console.error('Failed to sync database:', err);
     });

   // Start server
   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
   ```

8. **Test the API**:

   Now, you can test your API using tools like Postman or curl to perform operations such as creating, retrieving, updating, and deleting discounts.

### Example test cases with `curl`:

- **Create a discount**:
  ```bash
  curl -X POST http://localhost:3000/api/discounts -H "Content-Type: application/json" -d '{"code": "SUMMER2024", "discount_percent": 20}'
  ```

- **Get all discounts**:
  ```bash
  curl http://localhost:3000/api/discounts
  ```

- **Get a discount by ID**:
  ```bash
  curl http://localhost:3000/api/discounts/1
  ```

- **Update a discount**:
  ```bash
  curl -X PUT http://localhost:3000/api/discounts/1 -H "Content-Type: application/json" -d '{"code": "WINTER2024", "discount_percent": 25}'
  ```

- **Delete a discount**:
  ```bash
  curl -X DELETE http://localhost:3000/api/discounts/1
  ```

This code sets up a basic Node.js API with PostgreSQL for managing discounts. You can further extend it with error handling, authentication, and validation if needed.