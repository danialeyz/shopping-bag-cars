let openShopping = document.querySelector(".shopping");
let closeShopping = document.querySelector(".closeShopping");
let list = document.querySelector(".list");
let listCard = document.querySelector(".listCard");
let body = document.querySelector("body");
let total = document.querySelector(".total");
let quantity = document.querySelector(".quantity");

openShopping.addEventListener("click", () => {
  body.classList.add("active");
});
closeShopping.addEventListener("click", () => {
  body.classList.remove("active");
});

let products = [
  {
    id: 1,
    name: "PRODUCT NAME 1",
    image: "1.png",
    price: 1200,
  },
  {
    id: 2,
    name: "PRODUCT NAME 2",
    image: "2.png",
    price: 1400,
  },
  {
    id: 3,
    name: "PRODUCT NAME 3",
    image: "3.png",
    price: 2200,
  },
  {
    id: 4,
    name: "PRODUCT NAME 4",
    image: "4.png",
    price: 1230,
  },
  {
    id: 5,
    name: "PRODUCT NAME 5",
    image: "5.png",
    price: 3200,
  },
  {
    id: 6,
    name: "PRODUCT NAME 6",
    image: "6.png",
    price: 1200,
  },

  {
    id: 7,
    name: "PRODUCT NAME 6",
    image: "7.png",
    price: 1780,
  },
  {
    id: 8,
    name: "PRODUCT NAME 6",
    image: "8.png",
    price: 1289,
  },
  {
    id: 9,
    name: "PRODUCT NAME 6",
    image: "9.png",
    price: 1369,
  },
];

let listCards = [];
function initApp() {
  products.forEach((value, key) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("item");
    newDiv.innerHTML = `
            <div class="image-area"><img src="image/${value.image}"></div>
            <div class="item-content"> <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString() + "$"}</div>
            <button onclick="addToCard(${key})">Add To Card</button></div>
  `;
    list.appendChild(newDiv);
  });
}
initApp();

function addToCard(key) {
  if (listCards[key] == null) {
    // copy product form list to list card
    listCards[key] = JSON.parse(JSON.stringify(products[key]));
    listCards[key].quantity = 1;
  }
  reloadCard();
}

function reloadCard() {
  listCard.innerHTML = "";
  let count = 0;
  let totalPrice = 0;
  listCards.forEach((value, key) => {
    totalPrice = totalPrice + value.price;
    count = count + value.quantity;
    if (value != null) {
      let newDiv = document.createElement("li");
      newDiv.innerHTML = `
                <div><img src="image/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString() + "$"}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${
        value.quantity - 1
      })">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${
        value.quantity + 1
      })">+</button>
                </div>`;
      listCard.appendChild(newDiv);
    }
  });
  total.innerText = totalPrice.toLocaleString();
  quantity.innerText = count;
}
function changeQuantity(key, quantity) {
  if (quantity == 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = quantity;
    listCards[key].price = quantity * products[key].price;
  }
  reloadCard();
}
