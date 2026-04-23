let data;

fetch('data.json')
.then(res => res.json())
.then(d => {
  data = d;
  loadData();
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

  let angleWeight = weightPerFt * height * angleQty;

  let size = document.getElementById("shelfSize").value;
  let gauge = document.getElementById("shelfGauge").value;
  let shelfQty = +document.getElementById("shelfQty").value;

  let shelfWeight = data.shelves[size][gauge] * shelfQty;

  let totalWeight = angleWeight + shelfWeight;

  let nutBolts = 32 + ((shelfQty - 2) * 8);

  let priceKg = +document.getElementById("priceKg").value;

  let totalAmount = totalWeight * priceKg;
  let gst = totalAmount * 0.18;
  let grandTotal = totalAmount + gst;

  document.getElementById("weight").innerText = `Total Weight: ${totalWeight.toFixed(2)} kg`;
  document.getElementById("nuts").innerText = `Total Nut & Bolts: ${nutBolts} pcs`;
  document.getElementById("amount").innerText = `Total Amount: ₹${totalAmount.toFixed(2)}`;
  document.getElementById("gst").innerText = `GST 18%: ₹${gst.toFixed(2)}`;
  document.getElementById("grand").innerText = `Grand Total: ₹${grandTotal.toFixed(2)}`;
}
