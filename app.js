const app = {
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    closings: JSON.parse(localStorage.getItem('closings')) || [],

    init() {
        this.renderDenominations();
        this.updateDate();
        this.suggestFondoAyer();
        this.calculateTotal();
        this.calculateResumen();
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
    },

    calculateTotal() {
        let totalDenom = 0;
        document.querySelectorAll('.denom-input').forEach(i => {
            totalDenom += (parseFloat(i.value) || 0) * parseFloat(i.dataset.value);
        });

        // Sumar Caja Fuerte al subtotal físico
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
        const fondoHoy = document.getElementById('resumen-fondo-hoy').innerText;
        const totalReal = document.getElementById('total-cash-combined').value;
        const gastos = document.getElementById('resumen-gastos').value;
        const detalle = document.getElementById('resumen-detalle-gastos').value;
        const sobre = document.getElementById('resumen-sobre').value;

        const text = `*CIERRE DE CAJA v2.1* 📊%0A%0A` +
                     `*RESUMEN CONTABLE*%0A` +
                     `• Fondo Ayer: €${document.getElementById('resumen-fondo-ayer').value}%0A` +
                     `• Efectivo: €${document.getElementById('resumen-efectivo').value}%0A` +
                     `• Gastos: €${gastos}%0A` +
                     `• Sobre: €${sobre}%0A` +
                     `• *FONDO HOY (Teórico): ${fondoHoy}*%0A` +
                     `• *TOTAL REAL CAJA: €${totalReal}*%0A%0A` +
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
            safe: document.getElementById('safe-amount').value,
            denominations: {}
        };
        document.querySelectorAll('.denom-input').forEach(i => { data.denominations[i.dataset.value] = i.value; });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Cierre_Auditoria_${new Date().toLocaleDateString()}.json`;
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
            if(data.safe) document.getElementById('safe-amount').value = data.safe;
            
            document.querySelectorAll('.denom-input').forEach(i => {
                i.value = data.denominations[i.dataset.value] || "";
            });

            this.calculateResumen();
            this.calculateTotal();
            alert("Archivo de auditoría cargado.");
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
