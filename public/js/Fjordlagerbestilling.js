const BOX_PRICE = 250;

let boxCountInput = document.getElementById("box-count-input");
let calculateButton = document.getElementById("calculate-button");
let orderTotal = document.getElementById("order-total");

calculateButton.addEventListener("click", function () {
  let boxCount = Number(boxCountInput.value);
  let totalPrice = boxCount * BOX_PRICE;

  if (boxCount > 0) {
  orderTotal.textContent = boxCount + " esker: " + totalPrice + " kr";
    orderTotal.style.color = "var(--primary-color)";
  } else {
    orderTotal.textContent = "Vennligst skriv inn et gyldig antall esker.";
    orderTotal.style.color = "var(--error)";
  }
});