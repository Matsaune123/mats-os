let firstDeliveryInput = document.getElementById("first-delivery-input");
let secondDeliveryInput = document.getElementById("second-delivery-input");
let deliveryTotal = document.getElementById("delivery-total");
let checkButton = document.querySelector("#check-button");

checkButton.addEventListener("click", function () {
  let val1 = firstDeliveryInput.value;
  let val2 = secondDeliveryInput.value;

  // Sjekk om det inneholder bokstaver (f.eks. 'e') eller andre tegn
  // /[^0-9]/ sjekker om det finnes noe som IKKE er tall
  if (/[^0-9]/.test(val1) || /[^0-9]/.test(val2)) {
    deliveryTotal.textContent = "Feil: Vennligst bruk kun tall (0-9).";
    deliveryTotal.style.color = "var(--error)"; // Bruker stilen fra CSS-en din
    return; // Stopper funksjonen her
  }

  let firstBoxes = Number(val1) || 0;
  let secondBoxes = Number(val2) || 0;
  let totalBoxes = firstBoxes + secondBoxes;

  deliveryTotal.style.color = "var(--primary-color)"; // Tilbakestill farge

  if (totalBoxes === 0) {
    deliveryTotal.textContent = "Ingen esker er tatt imot ennå.";
  } else {
    deliveryTotal.textContent = totalBoxes + " esker er tatt imot til sammen.";
  }
});