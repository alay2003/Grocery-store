const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const app = express();
const port = 3000;

// In-memory cart storage (in a real app, you'd use a database)
let cart = [];

// Middleware to parse incoming request bodies (application/json)
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware

// Serve static files like index.html, cart.html, and CSS/JS
app.use(express.static('public'));

// Get the cart items
app.get('/cart', (req, res) => {
    res.json({ cart });
});

// Add an item to the cart
app.post('/cart/add', (req, res) => {
    const { productName, price } = req.body;
    cart.push({ productName, price });
    res.sendStatus(200);
});

// Remove an item from the cart (by index)
app.post('/cart/remove', (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        res.sendStatus(200);
    } else {
        res.status(400).json({ error: 'Invalid index' });
    }
});

// Checkout process (reset cart)
app.post('/checkout', (req, res) => {
    cart = [];
    res.json({ message: 'Thank you for your purchase!' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
