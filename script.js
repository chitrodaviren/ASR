// Register Service Worker for Icon/Installability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// Load Weight Data and Calculate
async function calc() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const h = parseFloat(document.getElementById('aH').value) || 0;
        const aq = parseFloat(document.getElementById('aQ').value) || 0;
        const ag = document.getElementById('aGauge').value;
        const sq = parseFloat(document.getElementById('sQ').value) || 0;
        const ss = document.getElementById('sSize').value;
        const sg = document.getElementById('sGauge').value;
        const r = parseFloat(document.getElementById('rate').value) || 0;

        const agFactor = data.angleFactors[ag];
        const shelfUnitWt = data.shelfWeights[ss][sg] || 0;

        let angleWt = (h * agFactor) * aq;
        let totalShelfWt = shelfUnitWt * sq;
        let totalWt = angleWt + totalShelfWt;

        // Nut & Bolt Standard Logic
        let nb = sq > 0 ? 32 + ((sq - 2) * 8) : 0;
        
        let basePrice = totalWt * r;
        let gstAmount = basePrice * 0.18;
        let grandTotal = basePrice + gstAmount;

        // Update UI
        document.getElementById('w_total').innerText = totalWt.toFixed(2) + " kg";
        document.getElementById('nb_total').innerText = nb + " pcs";
        document.getElementById('price_base').innerText = "₹" + Math.round(basePrice).toLocaleString('en-IN');
        document.getElementById('gst_amt').innerText = "₹" + Math.round(gstAmount).toLocaleString('en-IN');
        document.getElementById('price_grand').innerText = "₹" + Math.round(grandTotal).toLocaleString('en-IN');

    } catch (error) {
        console.error("Data Load Error:", error);
    }
}

function clearAll() {
    document.querySelectorAll('input').forEach(i => i.value = '');
    calc();
}
