// Fetch cart items from the backend
async function getCartItems() {
    const response = await fetch('/cart');
    const data = await response.json();
    return data.cart;
}

// Add item to cart
async function addToCart(productName, price) {
    await fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, price }),
    });
    updateCart();
}

// Remove item from cart
async function removeFromCart(index) {
    await fetch('/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    });
    updateCart();
}

// Update cart view
async function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    const cart = await getCartItems();
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.productName} - $${item.price}`;
        listItem.innerHTML += ` <button onclick="removeFromCart(${index})">Remove</button>`;
        cartItems.appendChild(listItem);
    });

    calculateTotal();
}

// Calculate total price
async function calculateTotal() {
    const cart = await getCartItems();
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    document.getElementById('total-price').textContent = `Total: $${totalPrice}`;
}

// Checkout process
async function checkout() {
    const cart = await getCartItems();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const response = await fetch('/checkout', { method: 'POST' });
    const data = await response.json();
    alert(data.message);

    document.getElementById('products').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
    document.getElementById('payment').style.display = 'block';
}

// Initial cart update when the page loads
updateCart();
