document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.summary h3');
    const deliveryButtons = document.querySelectorAll('.delivery-option');
    const tax = 12.00;
    let deliveryCost = 0.00;

    products.forEach(product => {
        const addButton = product.querySelector('button');
        addButton.addEventListener('click', () => addToCart(product));
    });

    deliveryButtons.forEach(button => {
        button.addEventListener('click', () => {
            deliveryCost = button.innerText.includes('Express') ? 4.99 : 0.00;
            updateTotal();
        });
    });

    function addToCart(product) {
        const productId = product.dataset.id;
        const productName = product.dataset.name;
        const productPrice = parseFloat(product.dataset.price);
        let productStock = parseInt(product.dataset.stock);
        const existingCartItem = cartItemsContainer.querySelector(`.cart-item[data-id="${productId}"]`);

        if (existingCartItem) {
            const quantityInput = existingCartItem.querySelector('input');
            const currentQuantity = parseInt(quantityInput.value);

            if (0 < productStock) {
                quantityInput.value = currentQuantity + 1;
                updateStock(product, -1);
            } else {
                alert('No more stock available');
            }
        } else {
            if (productStock > 0) {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.dataset.id = productId;
                cartItem.innerHTML = `
                    <img src="${product.querySelector('img').src}" alt="${productName}">
                    <div>
                        <h3>${productName}</h3>
                        <p>$${productPrice.toFixed(2)}</p>
                        <button class="decrement">-</button>
                        <input type="number" value="1" min="1" max="${productStock}">
                        <button class="increment">+</button>
                        <button class="remove">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);

                const removeButton = cartItem.querySelector('.remove');
                removeButton.addEventListener('click', () => removeFromCart(cartItem));

                const decrementButton = cartItem.querySelector('.decrement');
                decrementButton.addEventListener('click', () => changeQuantity(cartItem, product, -1));

                const incrementButton = cartItem.querySelector('.increment');
                incrementButton.addEventListener('click', () => changeQuantity(cartItem, product, 1));

                updateStock(product, -1);
            } else {
                alert('No stock available');
            }
        }

        updateTotal();
    }

    function changeQuantity(cartItem, product, change) {
        const quantityInput = cartItem.querySelector('input');
        let currentQuantity = parseInt(quantityInput.value);
        let productStock = parseInt(product.dataset.stock);
        const newQuantity = currentQuantity + change;

        if (newQuantity > 0 && newQuantity <= productStock + currentQuantity) {
            quantityInput.value = newQuantity;
            updateStock(product, -change);
            updateTotal();
        } else if (newQuantity <= 0) {
            removeFromCart(cartItem);
        }
    }

    function removeFromCart(cartItem) {
        const productId = cartItem.dataset.id;
        const product = document.querySelector(`.product[data-id="${productId}"]`);
        const quantity = parseInt(cartItem.querySelector('input').value);

        updateStock(product, quantity);
        cartItem.remove();
        updateTotal();
    }

    function updateStock(product, change) {
        const stockElement = product.querySelector('.stock');
        let stock = parseInt(stockElement.innerText);
        stock += change;
        stockElement.innerText = stock;
        product.dataset.stock = stock;

        if (stock <= 0) {
            product.querySelector('button').disabled = true;
        } else {
            product.querySelector('button').disabled = false;
        }
    }

    function updateTotal() {
        let total = tax + deliveryCost;
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item');

        cartItems.forEach(cartItem => {
            const price = parseFloat(cartItem.querySelector('p').innerText.replace('$', ''));
            const quantity = parseInt(cartItem.querySelector('input').value);
            total += price * quantity;
        });

        totalElement.innerText = `Total: $${total.toFixed(2)}`;
    }

    updateTotal();
});
