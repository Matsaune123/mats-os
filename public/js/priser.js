const DISCOUNT_LIMIT = 1500;

let price = 300;
let quantity = 3;
let totalPrice = price * quantity;

console.log(totalPrice);

let haircutPrice = 650;
let washPrice = 150;
let priceWithWash = haircutPrice + washPrice;

document.querySelector("#price-with-wash").textContent = priceWithWash;

let childPrice = 300;
let childDiscount = 50;
let saturdayChildPrice = childPrice - childDiscount;

console.log(saturdayChildPrice);

let groupSize = 2;
let groupTotal = priceWithWash * groupSize;

document.querySelector("#group-total").textContent = groupTotal;

if (groupTotal >= DISCOUNT_LIMIT) {
  document.querySelector("#group-discount").textContent = "Gruppen får 10 % rabatt.";
} else {
  document.querySelector("#group-discount").textContent = "Grupper får rabatt fra 1500 kr.";
}
