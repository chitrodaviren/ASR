let data;

fetch('data.json')
.then(res => res.json())
.then(d => {
  data = d;
  loadData();
  loadHistory();
});

function loadData() {
  let angleSelect = document.getElementById("angleType");

  data.angles.forEach(a => {
    let opt = document.createElement("option");
    opt.value = a.weight;
    opt.text = a.type;
    angleSelect.add(opt);
  });

  let shelfSize = document.getElementById("shelfSize");

  Object.keys(data.shelves).forEach(size => {
    let opt = document.createElement("option");
    opt.value = size;
    opt.text = size;
    shelfSize.add(opt);
  });

  shelfSize.addEventListener("change", loadGauge);
  loadGauge();
}

function loadGauge() {
  let size = document.getElementById("shelfSize").value;
  let gaugeSelect = document.getElementById("shelfGauge");

  gaugeSelect.innerHTML = "";

  let gauges = data.shelves[size];

  Object.keys(gauges).forEach(g => {
    let opt = document.createElement("option");
    opt.value = g;
    opt.text = g + " gauge";
    gaugeSelect.add(opt);
  });
}

function calculate() {

  let weightPerFt = +document.getElementById("angleType").value;
  let height = +document.getElementById("height").value;
  let angleQty = +document.getElementById("angleQty").value;

  let size = document.getElementById("shelfSize").value;
  let gauge = document.getElementById("shelfGauge").value;
  let shelfQty = +document.getElementById("shelfQty").value;

  let priceKg = +document.getElementById("priceKg").value;

  if (!height || !angleQty || !shelfQty || !priceKg) {
    alert("Please fill all fields");
    return;
  }

  let angleWeight = weightPerFt * height * angleQty;
  let shelfWeight = data.shelves[size][gauge] * shelfQty;

  let totalWeight = angleWeight + shelfWeight;
  let nutBolts = 32 + ((shelfQty - 2) * 8);

  let totalAmount = totalWeight * priceKg;
  let gst = totalAmount * 0.18;
  let grandTotal = totalAmount + gst;

  document.getElementById("weight").innerText = `Total Weight: ${totalWeight.toFixed(2)} kg`;
  document.getElementById("nuts").innerText = `Nut & Bolts: ${nutBolts} pcs`;
  document.getElementById("amount").innerText = `Amount: ₹${totalAmount.toFixed(2)}`;
  document.getElementById("gst").innerText = `GST: ₹${gst.toFixed(2)}`;
  document.getElementById("grand").innerText = `Grand Total: ₹${grandTotal.toFixed(2)}`;

  saveHistory(size, totalWeight, grandTotal);
}

// CLEAR INPUTS
function clearFields() {
  document.getElementById("height").value = "";
  document.getElementById("angleQty").value = "";
  document.getElementById("shelfQty").value = "";
  document.getElementById("priceKg").value = "";

  document.getElementById("weight").innerText = "";
  document.getElementById("nuts").innerText = "";
  document.getElementById("amount").innerText = "";
  document.getElementById("gst").innerText = "";
  document.getElementById("grand").innerText = "";
}

// HISTORY
function saveHistory(size, weight, total) {
  let history = JSON.parse(localStorage.getItem("rackHistory")) || [];

  history.push({
    size: size,
    weight: weight.toFixed(2),
    total: total.toFixed(2)
  });

  localStorage.setItem("rackHistory", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("rackHistory")) || [];
  let div = document.getElementById("history");

  div.innerHTML = "";

  history.slice().reverse().forEach(item => {
    div.innerHTML += `<div>Size: ${item.size} | ${item.weight}kg | ₹${item.total}</div>`;
  });
}

function clearHistory() {
  localStorage.removeItem("rackHistory");
  loadHistory();
}
