const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://takeandgo:taketake2024@takeandgo.edhgp.mongodb.net/?retryWrites=true&w=majority&appName=takeandgo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Models
const OrderSchema = new mongoose.Schema({
  coffeeType: String,
  clientName: String,
  phoneNumber: String, // Ensure this field is included
  status: { type: String, default: 'Pending' }
});
const Order = mongoose.model('Order', OrderSchema);

// Routes
const coffeeOptions = [
  'Americano',
  'Café Crème',
  'Cappuccino',
  'Lait'
];

// POST: Create a new order
app.post('/api/order', async (req, res) => {
  try {
    const { coffeeType, clientName, phoneNumber } = req.body;

    // Validate coffee type
    if (!coffeeOptions.includes(coffeeType)) {
      return res.status(400).json({ error: 'Invalid coffee type' });
    }

    // Create and save the order
    const order = new Order({ coffeeType, clientName, phoneNumber });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET: Fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT: Update order status
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE: Delete an order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Order.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Start Server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
