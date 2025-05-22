const cart = [];

const billingItemsDiv = document.getElementById("billing-items");

//Others

let pendingItem = null;

function openModal(item) {
  pendingItem = item;
  document.getElementById("quantityModal").style.display = "block";
}

function closeModal() {
  document.getElementById("quantityModal").style.display = "none";
  pendingItem = null;
}

function confirmQuantity() {
  const qty = parseInt(document.getElementById("quantityInput").value, 10);
  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  if (pendingItem) {
    addToCart(pendingItem, qty, 0);
  }
  closeModal();
}

async function initializeHTML() {
  const loadElements = document.querySelectorAll("load");
  for (const loadElement of loadElements) {
    const src = loadElement.getAttribute("src");
    if (src) {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to load ${src}`);
        const htmlContent = await response.text();
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = htmlContent;
        loadElement.replaceWith(...tempContainer.childNodes);
      } catch (error) {
        console.error(error);
        loadElement.innerHTML = "<p>Error loading content.</p>";
      }
    }
  }

}


function formEventListener(){
          // ✅ Testimonial form logic here AFTER HTML loads
    const form = document.querySelector('.testimonial-form form');
    if (!form) {
      console.error("Testimonial form not found in the DOM.");
      return;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!fullName || !message) {
        alert("Please fill in both name and message.");
        return;
      }

      const testimonialGrid = document.querySelector('.testimonials-grid');

      const newCard = document.createElement('div');
      newCard.classList.add('testimonial-card');

      newCard.innerHTML = `
        <img src="./static/user.webp" alt="Customer Image">
        <div class="testimonial-name">${fullName}</div>
        <div class="testimonial-text">“${message}”</div>
      `;

      const firstCard = testimonialGrid.querySelector('.testimonial-card');
      testimonialGrid.insertBefore(newCard, firstCard);

      form.reset();
    });
  }

    
initializeHTML();

// Toggle cart
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartToggleBtn2 = document.getElementById('cartToggleBtn2');
const billingContainer = document.getElementById('billingContainer');


cartToggleBtn2.addEventListener('click', () => {
  billingContainer.classList.remove('active');
});

cartToggleBtn.addEventListener('click', () => {
  billingContainer.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const paymentButtons = document.querySelectorAll('#paymentMethods button');
  const billingCard = document.querySelector('.billing-card');

  billingCard.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const selectedMethod = btn.getAttribute('data-method');
      console.log("Selected method:", selectedMethod);
    });
  });
});

// Close modal when clicking outside billing
document.addEventListener('click', (event) => {
  const billingCard = document.querySelector('.billing-card');
  const isClickInside = billingCard.contains(event.target);
  const isCartButton = cartToggleBtn.contains(event.target);

  if (billingContainer.classList.contains('active') && !isClickInside && !isCartButton) {
    billingContainer.classList.remove('active');
  }
});


// UI Functions
async function loadHTML(el,src) {

  if (src) {
    try {

          const response = await fetch(src);
          if (!response.ok) throw new Error(`Failed to load ${src}`);

          const htmlContent = await response.text();

          // Create a temporary container
          const tempContainer = document.createElement("div");
          tempContainer.innerHTML = htmlContent;

          // Replace <load> with the new content
          document.getElementById("main").replaceWith(...tempContainer.childNodes);

      } catch (error) {
          console.error(error);
          // el.innerHTML = "<p>Error loading content.</p>";
      }
        
  }
}

async function toggleMenu(el,src) {
  const links = document.querySelectorAll('.nav-links');
  links.forEach(link => link.classList.remove('active'));

  // Add 'active' to the clicked one
  el.classList.add('active');
  
  await loadHTML(el,src)
  if(src==="testimonials.html")
  {
    formEventListener()
  }
}
function toggleMobile(){
  const nav = document.getElementById('mobileMenu');
  nav.classList.toggle('show');
}




// Cart Functions

renderCart();

function renderCart() {
  billingItemsDiv.innerHTML = "";
  let subtotal = 0;
  let discount = 0;
  let totalCount = 0;

  cart.forEach((item, index) => {
    subtotal += item.cartItem.price * item.count;
    discount += item.discount;
    totalCount += item.count;

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${item.cartItem.image}" alt="Product"/>
      <div class="item-info">
        <div>${item.cartItem.name}</div>
        <small class="text-muted">${item.cartItem.category}</small>
      </div>
      <div>
        <div class="item-price">₱${item.cartItem.price}</div>
        <div class="qty-buttons">
          <div class="minus" onclick="updateQty(${index}, -1)"><i class="fas fa-minus"></i></div>
          <span>${item.count}</span>
          <div class="plus" onclick="updateQty(${index}, 1)"><i class="fas fa-plus"></i></div>
        </div>
      </div>
    `;
    billingItemsDiv.appendChild(div);
  });

  document.getElementById("subtotal").textContent = `₱${subtotal.toFixed(2)}`;
  document.getElementById("discount").textContent = `-₱${discount.toFixed(2)}`;
  document.getElementById("total").textContent = `₱${(subtotal + 1.99).toFixed(2)}`;

  // 👇 Update cart count badge
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    const distinctItemCount = cart.length;
  cartCountEl.textContent = distinctItemCount;
    cartCountEl.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}


function updateQty(index, delta) {
  cart[index].count += delta;
  if (cart[index].count <= 0) cart.splice(index, 1);
  renderCart();
}


// addToCart(
//   {
//        name: "Sample Tea",
//       category: "Beverage",
//       price: 10,
//       image: "https://via.placeholder.com/40"
//         }
//         ,
//         1,
//         2
//     )


//  Cart Item Object

//   name: "Milk Tea",
//   category: "Beverage",
//   price: 4.99,
//   image: "https://via.placeholder.com/40"


//Getter
function addToCart(cartItem, count, discount){

    cart.push({
        cartItem:cartItem, 
        count:count, 
        discount:discount
    })    

    renderCart();
}














