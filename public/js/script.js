console.log("Velkommen til Solstua Frisør!");

let day = new Date().getDay();
let openingStatus = document.querySelector("#opening-status");

if (day === 0 || day === 1) {
  openingStatus.textContent = "Vi har stengt i dag.";
  openingStatus.className = "status-closed";
} else if (day === 6) {
  openingStatus.textContent = "Vi har åpent i dag, 10–15.";
  openingStatus.className = "status-open";
} else {
  openingStatus.textContent = "Vi har åpent i dag, 10–19.";
  openingStatus.className = "status-open";
}
