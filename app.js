//start fetching data
let content = document.querySelector(".content")
function stylingData(arr){
    arr.forEach((box) => {
        content.innerHTML += `
            <div class="box">
                <img src="${box.image.desktop}" alt="baklava">
                <div class="button">
                    <img class="click" src="assets/images/icon-add-to-cart.svg" alt="add-to-cart">
                    <button class="click">Add to cart</button>
                </div>
                <div class = "increase">
                    <span class = "minus">-</span>
                    <span class = "number">1</span>
                    <span class = "plus">+</span>
                </div>
                <div class="text">
                    <p>${box.category}</p>
                    <h3>${box.name}</h3>
                    <span>$${box.price}</span>
                </div>
            </div>
        `
    })
}
async function fetchData(){
    let response = await fetch("data.json");
    let data = await response.json();
    return data;
}
fetchData().then((data) => {
    stylingData(data);
})
//end Fetching
// start clicking add to cart
let cart = document.querySelector(".cart-content")
let total = document.querySelector(".total span")
let cardLength = document.querySelector(".cartlength");
let cartArray = [];
let i = 0;
function addToCart(items){
    let identify = 0;
    items.forEach((item) => {
        cart.innerHTML += `
            <div class="sell" id = "${identify}">
                <div class="left">
                    <h3>${item.name}</h3>
                    <div class="info">
                        <div class="count"><span class="number">${item.count}</span>x</div>
                        <div class="pric">@<span class="price">${item.price}</span></div>
                        <div class="price-total">${item.total}</div>
                    </div>
                </div>
                <div class="right">X</div>
            </div>
        `
        identify++;
    })
}
function totalOrder(items){
    return items.length > 0 ? items.map((e) => e.total).reduce((a , c) => +a + +c): 0;
}
function turnCopy(e){
    e.target.parentElement.classList.add("hide");
    e.target.parentElement.parentElement.children[2].classList.add("show");
    let Count = e.target.parentElement.parentElement.children[2].children[1].innerHTML = 1;
    let itemName = e.target.parentElement.parentElement.children[3].children[1].innerHTML;
    cartArray.filter((ele) => {
        if(ele.name == itemName){
            ele.count = Count;
        }
    })
}
content.addEventListener("click" , function(e){
    if(e.target.classList.contains("click")){
        cart.innerHTML = "";
        let father = Array.from(e.target.parentElement.parentElement.children)[3];
        let Price = (father.children[2].innerHTML).slice(1);
        let Count = father.parentElement.children[2].children[1];
        let srcImage = father.parentElement.children[0].getAttribute("src");
        let obj = {
            name:father.children[1].innerHTML,
            price:father.children[2].innerHTML,
            count:Count.innerHTML,
            total:Price,
            index:i,
            src:srcImage,
        }
        cartArray.push(obj)
        addToCart(cartArray);
        total.innerHTML = `$${totalOrder(cartArray)}`;
        cardLength.innerHTML = cartArray.length
        turnCopy(e);
        i++;
    }
})

function increaseCounter(element){
    let number = element;
    number.innerHTML++;
}
function decreaseCounter(element){
    let number = element
    number.innerHTML--;
    if(number.innerHTML < 2){
        number.innerHTML = 1
    }
}
content.addEventListener("click" , function(e){
    let number = e.target.parentElement.children[1];
    if(e.target.classList.contains("plus")){
        increaseCounter(number);
        let itemName = e.target.parentElement.parentElement.children[3].children[1].innerHTML;
        cartArray.filter((e) =>{
            if(e.name == itemName){
                e.total = number.innerHTML * e.price.slice(1)
                e.count = number.innerHTML;
            }
        });
        cart.innerHTML = "";
        addToCart(cartArray);
        total.innerHTML = `$${totalOrder(cartArray)}`;
    }
    else if(e.target.classList.contains("minus")){
        decreaseCounter(number);
        let itemName = e.target.parentElement.parentElement.children[3].children[1].innerHTML;
        cartArray.filter((e) =>{
            if(e.name == itemName){
                e.total = number.innerHTML * e.price.slice(1)
                e.count = number.innerHTML;
            }
        });
        cart.innerHTML = "";
        addToCart(cartArray);
        total.innerHTML = `$${totalOrder(cartArray)}`;
    }
    else{
        e.preventDefault();
    }
})
// end clicking add to cart
// start delete Item
function returnOriginal(array , element){
    array.forEach((box) => {
        if(box.children[3].children[1].innerHTML == element.innerHTML){
            box.children[2].classList.remove("show");
            box.children[1].classList.remove("hide");
        }
    })
}
cart.addEventListener("click" , function(e){
    if(e.target.classList.contains("right")){
        let itemName = e.target.parentElement.children[0].children[0];
        e.target.parentElement.remove();
        cartArray.splice( e.target.parentElement.getAttribute("id"), 1);
        cart.innerHTML = "";
        addToCart(cartArray);
        total.innerHTML = `$${totalOrder(cartArray)}`;
        cardLength.innerHTML = cartArray.length;
        returnOriginal(Array.from(content.children) , itemName);
    }
})
// end delete Item
// start reset
let confirmBtn = document.querySelector("button.confirm")
let reset = document.querySelector(".reset");
let all = document.querySelector(".all");
let items = document.querySelector(".items")
let startOrder = document.querySelector(".start");
let resetTotal = document.querySelector(".reset-total")

function confirmOrder(e){
    if(cartArray.length > 0){
        reset.classList.add("show");
        all.classList.add("show");
        resetTotal.innerHTML = total.innerHTML
        cartArray.forEach((item) => {
            items.innerHTML += `
                <div class="item">
                    <div class="left">
                    <img src="${item.src}" alt="">
                        <div class="text">
                            <h3 class="head">${item.name}</h3>
                            <div class="info">
                            <p class="count">x<span>${item.count}</span></p>
                            <div class="price">$ <span>${item.price}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="right">$ <span>${item.total}</span></div>
                </div>
            `
        })
    }
    else{
        e.preventDefault();
    }
}
function StartOrder(e){
    cartArray = [];
    items.innerHTML = "";
    cart.innerHTML = "";
    Array.from(content.children).forEach((box) => {
        if(box.children[2].classList.contains("show")){
            box.children[2].classList.remove("show");
            box.children[1].classList.remove("hide");
        }
    })
    total.innerHTML = `0.0`;
    reset.classList.remove("show");
    all.classList.remove("show");
}
startOrder.addEventListener("click" , StartOrder);
confirmBtn.addEventListener("click" , confirmOrder)
// end reset