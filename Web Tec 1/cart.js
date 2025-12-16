const cartContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const applyOfferBtn = document.getElementById('apply-offer');
const offerInput = document.getElementById('offer-code');
const offerMessage = document.getElementById('offer-message');
const ClearCartBtn = document.getElementById('clear-cart');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');

// humburger Menu
    hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');

    if (nav.classList.contains('active')) {
    hamburger.innerHTML= '&#10006;'; // icon for X
    }
    else
    hamburger.innerHTML= '&#9776;'; // icon for hamburger menu
});

//load cart from the local storage
let cartItems
if(localStorage.getItem('cart')){
    cartItems= JSON.parse(localStorage.getItem('cart'));
}
else{
    cartItems= [];
}

let discount = 0; // global discount variable

//Function to render cart
function renderCart() {
    if(!cartContainer) return; //clear current content
    cartContainer.innerHTML='';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalEl.innerHTML = '';
        return;
    }
    cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;

        const cartDiv = document.createElement('div');
        cartDiv.className = 'cart-item';
        cartDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="100">
            <h2>${item.name}</h2>
            <p>Price: £${item.price.toFixed(2)}</p>
            <p>Quantity: <input type="number" class="item-quantity" value="${item.quantity}" min="1"></p>
            <p>Subtotal: £<span class="item-subtotal">${subtotal.toFixed(2)}</span></p>
            <button class="remove-item">Remove</button>
            <hr>
        `;

        cartContainer.appendChild(cartDiv);

        // Handle quantity change
        const quantityInput = cartDiv.querySelector('.item-quantity');
        const subtotalEl = cartDiv.querySelector('.item-subtotal');

        quantityInput.addEventListener('change', () => {
            let newQty = parseInt(quantityInput.value);
            if (newQty < 1) newQty = 1;
            quantityInput.value = newQty;
            item.quantity = newQty;
            subtotalEl.textContent = (item.price * item.quantity).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateTotal(); // recalculate total
        });

        // Handle remove button
        cartDiv.querySelector('.remove-item').addEventListener('click', () => {
            cartItems.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart(); // re-render
        });

        if(ClearCartBtn) {
            ClearCartBtn.addEventListener('click', () => {
                cartItems=[];
                localStorage.setItem('cart', JSON.stringify(cartItems));
                renderCart();
            });
        }

    });

    updateTotal();
}

// Function to update total including the discount
function updateTotal() {
    let total = 0;
    cartItems.forEach(item => total += item.price * item.quantity);
    if (discount > 0) total = total * (1 - discount);

    cartTotalEl.innerHTML = `<strong>Total: £${total.toFixed(2)}</strong>`;
}

// Offer code handling
if (applyOfferBtn && offerInput) {
    applyOfferBtn.addEventListener('click', () => {
        const code = offerInput.value;

        if (code === "save10") { // 10% discount
            discount = 0.10;
            offerMessage.textContent = "Offer applied: 10% off!";
        } else if (code === "") {
            discount = 0;
            offerMessage.textContent = "Please enter a code.";
        } else {
            discount = 0;
            offerMessage.textContent = "Invalid code.";
        }
        updateTotal();
    });
}

// Initial render
renderCart();
