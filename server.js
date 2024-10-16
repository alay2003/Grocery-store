const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let cart = [];

// Serve the main index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve cart.html
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Add item to cart
app.post('/cart/add', (req, res) => {
    const { productName, price } = req.body;
    cart.push({ productName, price });
    res.status(200).send();
});

// Get cart items
app.get('/cart', (req, res) => {
    res.json({ cart });
});

// Remove item from cart
app.post('/cart/remove', (req, res) => {
    const { index } = req.body;
    cart.splice(index, 1);
    res.status(200).send();
});

// Checkout
app.post('/checkout', (req, res) => {
    cart = []; // Clear cart after checkout
    res.json({ message: 'Thank you for your purchase!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
