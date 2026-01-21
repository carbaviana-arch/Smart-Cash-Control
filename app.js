const app = {
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    closings: JSON.parse(localStorage.getItem('closings')) || [],

    init() {
        this.renderDenominations();
        this.updateDate();
        this.suggestFondoAyer();
        this.calculateTotal();
        this.calculateResumen();
        this.calculateVisa();
    },

    updateDate() {
        const now = new Date();
        const options = { day: 'numeric', month: 'short' };
        document.getElementById('header-date').innerText = now.toLocaleDateString('es-ES', options).toUpperCase();
    },

    suggestFondoAyer() {
        if (this.closings.length > 0) {
            const last = this.closings[0];
            document.getElementById('fondo-ayer').value = last.totalA || 0;
            document.getElementById('resumen-fondo-ayer').value = last.totalA || 0;
        }
    },

    renderDenominations() {
        const container = document.getElementById('denominations-container');
        container.innerHTML = this.denominations.map(d => `
            <div class="denom-row">
                <span class="denom-label">${d >= 1 ? d + '€' : (d * 100).toFixed(0) + 'c'}</span>
                <input type="number" class="denom-input" data-value="${d}" placeholder="0" oninput="app.calculateTotal()" inputmode="decimal">
            </div>
        `).join('');
    },

    calculateResumen() {
        const fondoAyer = parseFloat(document.getElementById('resumen-fondo-ayer').value) || 0;
        const efectivo = parseFloat(document.getElementById('resumen-efectivo').value) || 0;
        const gastos = parseFloat(document.getElementById('resumen-gastos').value) || 0;
        const sobre = parseFloat(document.getElementById('resumen-sobre').value) || 0;

        const fondoHoy = fondoAyer + efectivo - gastos - sobre;
        document.getElementById('resumen-fondo-hoy').innerText = `€${fondoHoy.toFixed(2)}`;
        
        document.getElementById('visa-tpv-ref').value = document.getElementById('resumen-visa').value;
        this.calculateVisa();
    },

    calculateVisa() {
        const visaTPV = parseFloat(document.getElementById('resumen-visa').value) || 0;
        const cierreDatafono = parseFloat(document.getElementById('cierre-datafono').value) || 0;
        
        const diff = cierreDatafono - visaTPV;
        const diffEl = document.getElementById('diff-visa');
        diffEl.innerText = `€${diff.toFixed(2)}`;
        diffEl.className = (Math.abs(diff) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';
    },

    calculateTotal() {
        let totalDenom = 0;
        document.querySelectorAll('.denom-input').forEach(i => {
            totalDenom += (parseFloat(i.value) || 0) * parseFloat(i.dataset.value);
        });

        const safeAmount = parseFloat(document.getElementById('safe-amount').value) || 0;
        const totalRealCaja = totalDenom + safeAmount;

        document.getElementById('total-counted').innerText = `€${totalRealCaja.toFixed(2)}`;
        document.getElementById('total-cash-combined').value = totalRealCaja.toFixed(2);

        const fondoAyer = parseFloat(document.getElementById('fondo-ayer').value) || 0;
        const ventas = parseFloat(document.getElementById('ventas-efectivo').value) || 0;
        const totalCajaB = fondoAyer + ventas;
        
        const diff = totalRealCaja - totalCajaB;
        const diffEl = document.getElementById('diff-caja-total');
        diffEl.innerText = `€${diff.toFixed(2)}`;
        diffEl.className = (Math.abs(diff) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';
    },

    shareWhatsApp() {
        const fecha = document.getElementById('header-date').innerText;
        const fondoAyer = document.getElementById('resumen-fondo-ayer').value || "0.00";
        const fondoHoy = document.getElementById('resumen-fondo-hoy').innerText;
        const visa = document.getElementById('resumen-visa').value || "0.00";
        const efectivo = document.getElementById('resumen-efectivo').value || "0.00";
        const gastos = document.getElementById('resumen-gastos').value || "0.00";
        const sobre = document.getElementById('resumen-sobre').value || "0.00";
        const diffVisa = document.getElementById('diff-visa').innerText;
        const detalle = document.getElementById('resumen-detalle-gastos').value;

        const visaStatus = (Math.abs(parseFloat(diffVisa.replace('€', ''))) < 0.01) ? "✅" : "❌";

        const text = `*CIERRE DE CAJA (${fecha}) v2.1* 📊%0A%0A` +
                     `*RESUMEN*%0A` +
                     `• Fondo Ayer: €${fondoAyer}%0A` +
                     `• *FONDO HOY: ${fondoHoy}*%0A` +
                     `• Visa: €${visa}%0A` +
                     `• Efectivo: €${efectivo}%0A` +
                     `• Gastos: €${gastos}%0A` +
                     `• Sobre: €${sobre}%0A%0A` +
                     `*CONCILIACIÓN VISA*%0A` +
                     `• Diferencia Datafono: ${diffVisa} ${visaStatus}%0A%0A` +
                     `*DETALLE GASTOS:*%0A${detalle || 'Sin gastos registrados.'}`;

        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    exportToJSON() {
        const data = {
            resumen: {
                ayer: document.getElementById('resumen-fondo-ayer').value,
                visa: document.getElementById('resumen-visa').value,
                efectivo: document.getElementById('resumen-efectivo').value,
                sobre: document.getElementById('resumen-sobre').value,
                gastos: document.getElementById('resumen-gastos').value,
                detalle: document.getElementById('resumen-detalle-gastos').value
            },
            datafono: document.getElementById('cierre-datafono').value,
            safe: document.getElementById('safe-amount').value,
            denominations: {}
        };
        document.querySelectorAll('.denom-input').forEach(i => { data.denominations[i.dataset.value] = i.value; });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Cierre_${new Date().toLocaleDateString()}.json`;
        a.click();
    },

    importFromJSON(event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if(data.resumen) {
                document.getElementById('resumen-fondo-ayer').value = data.resumen.ayer;
                document.getElementById('resumen-visa').value = data.resumen.visa;
                document.getElementById('resumen-efectivo').value = data.resumen.efectivo;
                document.getElementById('resumen-sobre').value = data.resumen.sobre;
                document.getElementById('resumen-gastos').value = data.resumen.gastos;
                document.getElementById('resumen-detalle-gastos').value = data.resumen.detalle;
            }
            if(data.datafono) document.getElementById('cierre-datafono').value = data.datafono;
            if(data.safe) document.getElementById('safe-amount').value = data.safe;
            
            document.querySelectorAll('.denom-input').forEach(i => {
                i.value = data.denominations[i.dataset.value] || "";
            });

            this.calculateResumen();
            this.calculateTotal();
            this.calculateVisa();
        };
        reader.readAsText(event.target.files[0]);
    },

    saveClosing() {
        const closing = {
            date: new Date().toISOString(),
            totalA: parseFloat(document.getElementById('total-cash-combined').value)
        };
        this.closings.unshift(closing);
        localStorage.setItem('closings', JSON.stringify(this.closings));
        alert("Cierre guardado localmente.");
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${viewId}`).classList.remove('hidden');
        document.querySelectorAll('.dock-item').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${viewId}`).classList.add('active');
        if(viewId === 'history') this.renderHistory();
    },

    renderHistory() {
        const list = document.getElementById('history-list');
        list.innerHTML = this.closings.map(c => `
            <div class="card">
                <strong>${new Date(c.date).toLocaleDateString()}</strong> - Total Real: €${c.totalA.toFixed(2)}
            </div>
        `).join('');
    }
};

app.init();
