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

    async loadProducts() {
      const URL = "http://little-sweet-corner.netlify.app/data/data.json";

      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.products = await response.json();
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
      this.counter = {};
      Object.values(this.cartItems).forEach((item) => item.remove());
      this.cartItems = {};
      this.totalDiv.style.display = "none";
      document.querySelector(".payTitle").innerHTML = "Your Cart (0)";
      this.showEmptyCartMessage();

      setTimeout(() => {window.location.reload()}, 500);
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