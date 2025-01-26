(async function () {
  "use strict";

  class ShoppingCart {
    constructor() {
      this.products = [];
      this.counter = {}; // Tracks item counts
      this.cartItems = {}; // Tracks cart items in the DOM
      this.totalDiv = this.createTotalDiv();
      this.init();
    }

    async init() {
      await this.loadProducts();
      this.setupEventListeners();
    }

    getJsonUrl() {
      const hostname = window.location.hostname;

      if (hostname === "127.0.0.1:5500") {
        return "http://127.0.0.1:5500/data/data.json";
      } else {
        return "https://little-sweet-corner.netlify.app/data/data.json";
      }
    }

    async loadProducts() {
      const jsonUrl = this.getJsonUrl();
      try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        this.products = await res.json();
      } catch (error) {
        document.querySelector(".emptyCart").textContent = `Error loading data: ${error.message}`;
      }
    }

    setupEventListeners() {
      const buttons = document.querySelectorAll(".buttonCard");
      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          this.handleAddToCart(event);
        });
      });
    }

    handleAddToCart(event) {
      const button = event.target;
      const productId = button.getAttribute("data-id");
    
      if (!this.counter[productId]) {
        this.counter[productId] = 0;
      }
      this.counter[productId]++;

      const totalItems = Object.values(this.counter).reduce((sum, count) => sum + count,0);
      document.querySelector(".payTitle").innerHTML = `Your Cart (${totalItems})`;

      const selectedProduct = this.products.find((product) => product.id == productId);

      if (totalItems === 1) {
        this.clearEmptyCartMessage();
      }
      if (selectedProduct) {
        this.updateCartItem(selectedProduct, productId);
        this.updateTotal();
      }     
    }
    
    clearEmptyCartMessage() {
      const emptySvg = document.querySelector(".emptyCart svg");
      const emptyTitle = document.querySelector(".emptyTitle");

      if (emptySvg) emptySvg.remove();
      if (emptyTitle) emptyTitle.remove();
    }

    createTotalDiv() {
      const totalDiv = document.createElement("div");
      totalDiv.className = "orderContainer";
      totalDiv.style.display = "none";
      document.querySelector(".emptyCart").parentElement.appendChild(totalDiv);
      return totalDiv;
    }

    updateCartItem(product, productId) {
      let listItem = this.cartItems[productId];

      if (!listItem) {
        listItem = document.createElement("li");
        listItem.className = "list-item";
        listItem.setAttribute("data-id", productId);  
        this.cartItems[productId] = listItem;
        document.querySelector(".emptyCart").appendChild(listItem);
      } 

      const quantity = this.counter[productId];
      const totalPrice = (product.price * quantity).toFixed(2);

      listItem.innerHTML = `
        <p>${product.name}</p>
        <span class='itemData'>
          <span class='itemContainer'>
              <span class='itemQtd'>${quantity}x</span>
              ${product.price.toFixed(2)} 
              <span class='totalItem'>$${totalPrice}</span>
          </span>
          <button class='cancelItem' data-id='${productId}'>x</button>
        </span>
      `;
      listItem.querySelector(".cancelItem").addEventListener("click", () => {
        this.removeCartItem(productId)
      });
    }

    updateTotal() {
      const totalOrder = Object.entries(this.counter).reduce((total, [id, count]) => {
        const product = this.products.find((p) => p.id == id);
        return total + product.price * count;
      }, 0).toFixed(2);

      this.totalDiv.innerHTML = `
        <p class='orderText'>Total order<span class='amount'>$${totalOrder}</span></p>
        <button type="submit" class='submit'>Confirm order</button>
      `;
      this.totalDiv.style.display = "block";
      const submitButton = this.totalDiv.querySelector(".submit");
      submitButton.addEventListener("click", () => this.confirmOrder());
    }

    removeCartItem(productId) {
      delete this.counter[productId];
      this.cartItems[productId].remove();
      delete this.cartItems[productId];

      const totalItems = Object.values(this.counter).reduce((sum, count) => sum + count, 0);
      document.querySelector(".payTitle").innerHTML = `Your Cart (${totalItems})`;

      if (totalItems === 0) {
        this.showEmptyCartMessage();
        this.totalDiv.style.display = "none";
      } else {
        this.updateTotal();
      }
    }

    confirmOrder() {
      this.createPopUp();
      this.counter = {};
      Object.values(this.cartItems).forEach((item) => item.remove());
      this.cartItems = {};
      this.totalDiv.style.display = "none";
      document.querySelector(".payTitle").innerHTML = "Your Cart (0)";
      this.showEmptyCartMessage();

      // setTimeout(() => {window.location.reload()}, 500);
    }
    
    createPopUp() {
      const popupContainer = document.querySelector(".orderBanner");
     
      const orderDetails = Object.entries(this.counter).map(([productId, quantity]) => {
        const product = this.products.find((p) => p.id == productId);
        return {
          image: product.image.thumbnail,
          name: product.name,
          quantity: quantity,
          price: product.price,
          totalPrice: (quantity * product.price).toFixed(2)
        };
      });

      const totalPrice = orderDetails.reduce((total, item) => total + parseFloat(item.totalPrice), 0).toFixed(2);


      const popupHTML = `
        <div class="popup-overlay" id="popupOverlay">
          <div class="popup">
            <div class="popup-header">
              <span class="popup-icon">
                <img src='./assets/images/icon-order-confirmed.svg' />
              </span>
              <h1>Order Confirmed</h1>
              <span class='textContent'>We hope you enjoy your food!</span>
            </div>
            <div class="popup-body">
              ${orderDetails.map((item) =>
                `
                  <li class="order-item">
                    <span class='itemImg'>
                      <img src='${item.image}' />
                    </span>
                      <span class='itemData'>
                        <strong>${item.name}</strong>
                        <span class='qtdPrice'>
                          <strong class='itemQtd'>${item.quantity}x</strong>
                          <span><span id='at'>@</span>$${item.price.toFixed(2)}</span>
                        </span>
                      </span>
                      <strong>$${totalPrice}</strong>
                  </li>
                `
              ).join("")}
              <li class='orderPrice'>
                <span>Order Total</span><strong>$${totalPrice}</strong>
              </li>
            </div>
            <div class="order-total">
              <button class='submit newOrder'>Start New Order</button>
            </div>
          </div>
        </div>
      `;

      popupContainer.innerHTML = popupHTML;

      document.querySelector(".newOrder").addEventListener('click', function (e) {
        if (e.target === this) popupContainer.innerHTML = "";
        
      })
    }

    showEmptyCartMessage() {
      document.querySelector(".emptyCart").innerHTML = `
      <img style="display:flex; margin: auto" src="./assets/images/illustration-empty-cart.svg">
      <p>Your added items will appear here</p>
      `;
    }
  }
  new ShoppingCart();  
})();