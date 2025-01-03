let data = document.getElementById("data")

fetch("data.json").then((response) => {
  response.json().then((data) =>{
    console.log(data);
  })
})


const btnCard = document.getElementsByClassName('button');
const imgCard = document.getElementsByClassName('imgCard');
