if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

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

        let nb = sq > 0 ? 32 + ((sq - 2) * 8) : 0;
        
        let basePrice = totalWt * r;
        let gstAmount = basePrice * 0.18;
        let grandTotal = basePrice + gstAmount;

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

// --- History Logic ---

function saveHistory() {
    const total = document.getElementById('price_grand').innerText;
    const h = document.getElementById('aH').value;
    const sSize = document.getElementById('sSize').options[document.getElementById('sSize').selectedIndex].text;
    
    if(!h || total === "₹0") return;

    const entry = {
        title: `${h}' Angle | ${sSize}`,
        price: total,
        date: new Date().toLocaleDateString()
    };

    let history = JSON.parse(localStorage.getItem('angleRackHistory')) || [];
    history.unshift(entry);
    localStorage.setItem('angleRackHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('angleRackHistory')) || [];
    const list = document.getElementById('historyList');
    const header = document.getElementById('histHeader');
    const clearBtn = document.getElementById('clearHistBtn');

    if(history.length > 0) {
        header.style.display = "block";
        clearBtn.style.display = "block";
    } else {
        header.style.display = "none";
        clearBtn.style.display = "none";
    }

    list.innerHTML = history.slice(0, 5).map(item => `
        <div style="background:white; padding:12px 18px; border-radius:18px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #edf2f7;">
            <div>
                <div style="font-weight:700; color:#1e293b; font-size:0.9rem;">${item.title}</div>
                <div style="font-size:0.7rem; color:#94a3b8;">${item.date}</div>
            </div>
            <div style="font-weight:800; color:#10b981;">${item.price}</div>
        </div>
    `).join('');
}

function clearHistory() {
    if(confirm("Delete all saved quotes?")) {
        localStorage.removeItem('angleRackHistory');
        renderHistory();
    }
}

window.onload = renderHistory;
