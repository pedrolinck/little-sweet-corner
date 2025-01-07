(async function(){
  const btnCard = document.querySelectorAll('button');
  const emptyCart = document.querySelector(".emptyCart")
  let products = [];

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

  btnCard.forEach(button => {
    button.addEventListener('click', () => {
    const countText = document.querySelector('.count')
    const buttontId = button.getAttribute('data-id');
    const cardTitle = document.querySelector('.payTitle')
    let counter = {};
    
    
      cardTitle.innerHTML = `Your Cart (${counter})`
      countText.innerHTML = counter++;
    
    const selectedProduct = products.find(product => product.id == buttontId)  
    
    if(selectedProduct){
      let listItem = document.createElement('li')
      let sumOrder = (selectedProduct.price * counter).toFixed(2);
      listItem.innerHTML = `
        <p>${selectedProduct.name}</p>
        <span>${counter}x</span> ${selectedProduct.price.toFixed(2)} ${sumOrder}  
      `
      emptyCart.innerHTML = ''
      emptyCart.appendChild(listItem)
    }else{
      let listItem = document.createElement('li')
      let sumOrder = (selectedProduct.price * counter).toFixed(2);
      listItem.innerHTML += `
        <p>${selectedProduct.name}</p>
        <span>${counter}x</span> ${selectedProduct.price.toFixed(2)} ${sumOrder}  
      `
      emptyCart.innerHTML = ''

      emptyCart.appendChild(listItem)
    }
    })
  })
})()