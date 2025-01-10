(async function(){
  "use strict"

  const btnCard = document.querySelectorAll('.buttonCard');
  const emptyCart = document.querySelector(".emptyCart")
  const cardTitle = document.querySelector('.payTitle')
  const emptySvg = document.querySelector('.emptyCart svg')
  const emptyTitle = document.querySelector('.emptyTitle')
  const cancelItem = document.querySelector('.cancelItem')
  let products = [];
  // object to store product counters
  let counter = {};
  // object to store all purchased items 
  const carItems = {}

  // div to show total and confirm button dinamically
  const totalDiv = document.createElement('div')
  totalDiv.className = 'orderContainer'
  totalDiv.style.display = "none";
  totalDiv.innerHTML = `
    <p class='orderText'>Total order<span class='amount'>$46.00</span></p>
    <button type="submit" class='submit'>Confirm order</button>
  `
  // add after list items
  emptyCart.parentElement.appendChild(totalDiv)

  // select elements inside dynamic div
  const orderText = document.querySelector('.orderText .amount')
  const submit = totalDiv.querySelector('.submit')

  // load products from json
  async function loadProduct(){
    const URL = 'http://127.0.0.1:5500/data/data.json'

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }
      products = await response.json();
    } catch (error) {
      emptyCart.textContent = `Error loading data: ${error.message}`;
    }
  }

  await loadProduct();
  let listItem;
  // add event click on each button
  btnCard.forEach(button => {
    button.addEventListener('click', () => {
      const buttontId = button.getAttribute('data-id');
      const cancelItem = document.querySelector('.cancelItem');

      if(!counter[buttontId]){
        // initialize product's counter
        counter[buttontId] = 0
      }
      counter[buttontId]++;


      // updates the shopping cart
      const totalItems = Object.values(counter).reduce((sum, count) => sum + count, 0)
      cardTitle.innerHTML = `Your Cart (${totalItems})`

      // searches especific product
      const selectedProduct = products.find(product => product.id == buttontId)  

      if(totalItems === 1){
        if(emptySvg) emptySvg.remove()
        if(emptyTitle) emptyTitle.remove()
      }
      
      if(selectedProduct){
        let listItem;
        if(!carItems[buttontId]){
          // if item still isn't in shopping cart, then create a new element
          listItem = document.createElement('li')
          listItem.className = 'list-item'
          listItem.setAttribute('data-id', buttontId)
          carItems[buttontId] = listItem;
          emptyCart.appendChild(listItem)
        }else{
          // if already is or exist updates the existent element
          listItem = carItems[buttontId]
        }
        
        let sumItem = (selectedProduct.price * counter[buttontId]).toFixed(2)

        // updates content of shopping cart item
        listItem.innerHTML = `
          <p>${selectedProduct.name}</p>
          <span class='itemData'>
            <span class='itemContainer'>
              <span class='itemQtd'>${counter[buttontId]}x</span>
              ${selectedProduct.price.toFixed(2)} 
              <span class='totalItem'>$${sumItem}</span>
            </span>
            <span class='cancelItem'>x</span>
          </span>
          
        `
          // update total
          totalOrder = Object.entries(counter).reduce((total, [id, count]) =>{
          const product = products.find((p) => p.id == id)
          // orderText.textContent = `$${totalOrder.toFixed()}`;
          return total + (product.price * count)
        })
          
          totalDiv.style.display = "block";
      }

      let totalPrice = 0
      // confirm purchase
      submit.addEventListener("click", () => {
        counter = {};
        totalPrice = 0;
        totalDiv.style.display = "none";
        cardTitle.innerHTML = "Your Cart (0)";

    
        if(submit){
          emptyCart.innerHTML = `
            <img src="./assets/images/illustration-empty-cart.svg">
            <p>Your added items will appear here</p>
          `;
        }
        
      });
    })

    
  })
})()