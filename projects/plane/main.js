const startYear = 2020;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
const monthsInYear = 12;
var money = 1000;
var monthName = "January";
var month = 0;
var year = startYear;
var fans = 0;
var tick = 0;
var maxItems = 10;
var metals = 0;
var plastics = 0;
var electronics = 0;
var carNum = 0;
var metalsubscription = false;
var plasticsubscription = false;
var electronicsubscription = false;


function updMoney() {
    document.getElementById("money").innerHTML = "<h2>$" + money.toLocaleString() + "</h2>";
}


function buyMetal() {
    if (money >= 100 && metals < maxItems) {
        metals ++;
        money -= 100;
        
    }
    
}

function buyPlastic() {
    if (money >= 50 && plastics < maxItems) {
        plastics ++;
        money -= 50;
       
    }
}

function buyElectronics() {
    if (money >= 200 && electronics < maxItems) {
        electronics ++;
        money -= 200;
        

    }
}

function sellMetals() {
    if (metals > 0) {
        metals --;
        money += 100;
        
    }
}

function sellPlastics() {
    if (plastics > 0) {
        plastics --;
        money += 50;
       
    }
}

function sellElectronics() {
    if (electronics > 0) {
        electronics --;
        money += 200;
        
    }
}

function makeCar() {
    if (metals >= 2 && plastics >= 3 && electronics >= 1) {
        metals -= 2;
        plastics -= 3;
        electronics --;
        carNum ++;
        
    }
}

function sellCar() {
    if (carNum >= 1) {
        carNum --;
        money += 1000;
        fans += Math.floor(Math.random() * 50);
        updMoney();
        updInventory();
    }
}

function toggleAutoMetal() {
  const btn = document.getElementById("autoBuyMetal");
  metalsubscription = !metalsubscription;
  btn.style.backgroundColor = metalsubscription ? "#00ff00" : "#f3f4f6";
}

function toggleAutoPlastic() {
  const btn = document.getElementById("autoBuyPlastic");
  plasticsubscription = !plasticsubscription;
  btn.style.backgroundColor = plasticsubscription ? "#00ff00" : "#f3f4f6";
}

function toggleAutoElectronic() {
  const btn = document.getElementById("autoBuyElectronic");
  electronicsubscription = !electronicsubscription;
  btn.style.backgroundColor = electronicsubscription ? "#00ff00" : "#f3f4f6";
}

function processAutoBuys() {
  if (tick % 1000 !== 0) return;
  
  const numM = parseInt(document.getElementById("autoMetalNum").value);
  if (metalsubscription && money >= 100 * numM && metals + numM <= maxItems) {
    metals += numM;
    money -= 100 * numM;
  }
  
  const numP = parseInt(document.getElementById("autoPlasticNum").value);
  if (plasticsubscription && money >= 50 * numP && plastics + numP <= maxItems) {
    plastics += numP;
    money -= 50 * numP;
  }
  
  const numE = parseInt(document.getElementById("autoElectronicNum").value);
  if (electronicsubscription && money >= 200 * numE && electronics + numE <= maxItems) {
    electronics += numE;
    money -= 200 * numE;
  }
}

function updInventory() {
    const metalsEl = document.getElementById("metalNum");
    if (metalsEl) metalsEl.innerHTML = "<h2>" + metals + "</h2>";
    const plasticsEl = document.getElementById("plasticNum");
    if (plasticsEl) plasticsEl.innerHTML = "<h2>" + plastics + "</h2>";
    const electronicsEl = document.getElementById("electronicNum");
    if (electronicsEl) electronicsEl.innerHTML = "<h2>" + electronics + "</h2>";
    const carsEl = document.getElementById("carNum");
    if (carsEl) carsEl.innerHTML = "<h2>" + carNum + "</h2>";

    // Update popup if open
    const popupMetals = document.getElementById("popup-metalNum");
    if (popupMetals) popupMetals.textContent = metals;
    const popupPlastics = document.getElementById("popup-plasticNum");
    if (popupPlastics) popupPlastics.textContent = plastics;
    const popupElectronics = document.getElementById("popup-electronicNum");
    if (popupElectronics) popupElectronics.textContent = electronics;
    const popupCars = document.getElementById("popup-carNum");
    if (popupCars) popupCars.textContent = carNum;
}

function updYear() {
    document.getElementById("year").innerHTML = "<h2>" + year + "</h2>";
}

function runGame(){
    if (document.getElementById("startermoney")) {
        document.getElementById("startermoney").remove();
    }
    if (document.getElementById("starteryear") && year > startYear) {
        document.getElementById("starteryear").remove();
    }
    if (document.getElementById("startermonth")) {
        document.getElementById("startermonth").remove();
    }
    if (document.getElementById("starterfans")) {
        document.getElementById("starterfans").remove();
    }
    tick += 50;
    processAutoBuys();
    updMoney();
    updYear();
    updInventory();
    if (month == monthsInYear && tick % 1000 == 0) {
        month = 0;
        year ++;
    }
    if (tick % 1000 == 0) {
        monthName = months[month ++];
        
    }
    document.getElementById("fans").innerHTML = "<h2>" + fans.toLocaleString() + " fans</h2>";
    document.getElementById("month").innerHTML = "<h2>" + monthName + "</h2>";
    
}

setInterval(runGame, 20);

function showInv() {
  let popup = document.getElementById('inventory-popup');
  if (!popup) {
    // Create popup
    popup = document.createElement('div');
    popup.id = 'inventory-popup';
    popup.innerHTML = `
      <div class="popup-header">
        <h3>Inventory</h3>
        <button onclick="closeInv()">×</button>
      </div>
      <table>
        <tr><th>Metals</th><td id="popup-metalNum">${metals}</td></tr>
        <tr><th>Plastics</th><td id="popup-plasticNum">${plastics}</td></tr>
        <tr><th>Electronics</th><td id="popup-electronicNum">${electronics}</td></tr>
        <tr><th>Cars</th><td id="popup-carNum">${carNum}</td></tr>
      </table>
      <div class="car-buttons">
        <button onclick="makeCar()">Create Car</button>
        <button onclick="sellCar()">Sell Car</button>
      </div>
    `;
    document.body.appendChild(popup);
  }
  popup.classList.toggle('open');
}

function closeInv() {
  const popup = document.getElementById('inventory-popup');
  if (popup) popup.classList.remove('open');
}
