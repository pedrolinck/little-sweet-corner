const btnCard = document.querySelectorAll('button');
const imgCard = document.getElementsByClassName('imgCard');
const payTitle = document.querySelector("h3.payTitle")
const emptyCart = document.querySelector(".emptyCart")

// access data.json
let data = document.getElementById("data")
fetch("data.json").then((response) => { response.json().then((data) =>{
  for(let i = 0; i < data.length; i++){
    // console.log(data[i].name);
    
  }
  
})
})

// function to add order to list 
function addOrder(){
  let countText = document.getElementById('count')
  let count = 0;

  for (let i = 0; i < btnCard.length; i++) {

    const li = document.createElement('li');

    btnCard[i].addEventListener('click', function (){
      count++;
      countText.innerHTML = count;
      emptyCart.innerHTML = ''
      
    })
  }
}addOrder()


// set up event on all buttons
function setupButton(){
  btnCard.forEach((button) => {
    button.addEventListener('click', function(){
      console.log('button clicked', this);
      console.log('index', Array.from(btnCard).indexOf(this));
      
      
    })
  })
}setupButton()