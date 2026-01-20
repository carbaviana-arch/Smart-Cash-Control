const app = {
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    closings: JSON.parse(localStorage.getItem('closings')) || [],

    init() {
        this.renderDenominations();
        this.updateDate();
        this.suggestFondoAyer();
        this.calculateTotal();
    },

    updateDate() {
        const now = new Date();
        const options = { day: 'numeric', month: 'short' };
        document.getElementById('header-date').innerText = now.toLocaleDateString('es-ES', options).toUpperCase();
    },

    suggestFondoAyer() {
        if (this.closings.length > 0) {
            const lastClosing = this.closings[0];
            const fondoField = document.getElementById('fondo-ayer');
            fondoField.value = lastClosing.totalA.toFixed(2);
            fondoField.classList.add('suggested');
        }
    },

    renderDenominations() {
        const container = document.getElementById('denominations-container');
        container.innerHTML = this.denominations.map(d => `
            <div class="denom-row">
                <span class="denom-label">${d >= 1 ? d + '€' : (d * 100).toFixed(0) + 'c'}</span>
                <input type="number" class="denom-input" data-value="${d}" 
                       placeholder="0" oninput="app.calculateTotal()" inputmode="decimal">
            </div>
        `).join('');
    },

    calculateTotal() {
        let totalDenominations = 0;
        document.querySelectorAll('.denom-input').forEach(input => {
            totalDenominations += (parseFloat(input.value) || 0) * parseFloat(input.dataset.value);
        });

        const initial = parseFloat(document.getElementById('initial-balance').value) || 0;
        const subtotalBreakdown = totalDenominations + initial;
        const safeAmount = parseFloat(document.getElementById('safe-amount').value) || 0;
        const totalCashA = subtotalBreakdown + safeAmount;

        document.getElementById('total-counted').innerText = `€${subtotalBreakdown.toFixed(2)}`;
        document.getElementById('total-cash-combined').value = totalCashA.toFixed(2);

        const fondoAyer = parseFloat(document.getElementById('fondo-ayer').value) || 0;
        const ventas = parseFloat(document.getElementById('ventas-efectivo').value) || 0;
        const totalCajaB = fondoAyer + ventas;
        document.getElementById('total-caja-b').value = totalCajaB.toFixed(2);

        const diffCaja = totalCashA - totalCajaB;
        const diffCajaEl = document.getElementById('diff-caja-total');
        diffCajaEl.innerText = `€${diffCaja.toFixed(2)}`;
        diffCajaEl.className = (Math.abs(diffCaja) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';

        const datafono = parseFloat(document.getElementById('cierre-datafono').value) || 0;
        const reporteZ = parseFloat(document.getElementById('reporte-z').value) || 0;
        const diffData = datafono - reporteZ;
        const diffDataEl = document.getElementById('diff-datafono');
        diffDataEl.innerText = `€${diffData.toFixed(2)}`;
        diffDataEl.className = (Math.abs(diffData) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';
    },

    // EXPORTAR ARCHIVO JSON PARA AUDITORÍA
    exportToJSON() {
        const data = {
            denominations: {},
            initial: document.getElementById('initial-balance').value,
            safe: document.getElementById('safe-amount').value,
            fondoAyer: document.getElementById('fondo-ayer').value,
            ventas: document.getElementById('ventas-efectivo').value,
            datafono: document.getElementById('cierre-datafono').value,
            reporteZ: document.getElementById('reporte-z').value,
            obs: document.getElementById('observations').value,
            timestamp: new Date().toISOString()
        };

        document.querySelectorAll('.denom-input').forEach(input => {
            data.denominations[input.dataset.value] = input.value;
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Detalle_Cierre_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        a.click();
    },

    // IMPORTAR ARCHIVO JSON
    importFromJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                document.getElementById('initial-balance').value = data.initial;
                document.getElementById('safe-amount').value = data.safe;
                document.getElementById('fondo-ayer').value = data.fondoAyer;
                document.getElementById('ventas-efectivo').value = data.ventas;
                document.getElementById('cierre-datafono').value = data.datafono;
                document.getElementById('reporte-z').value = data.reporteZ;
                document.getElementById('observations').value = data.obs;

                document.querySelectorAll('.denom-input').forEach(input => {
                    input.value = data.denominations[input.dataset.value] || "";
                });

                this.calculateTotal();
                alert("Detalle de auditoría cargado.");
            } catch (err) {
                alert("Error al leer el archivo.");
            }
        };
        reader.readAsText(file);
    },

    shareWhatsApp() {
        const totalA = document.getElementById('total-cash-combined').value;
        const totalB = document.getElementById('total-caja-b').value;
        const diffC = (totalA - totalB).toFixed(2);
        const datafono = document.getElementById('cierre-datafono').value || "0.00";
        const reporteZ = document.getElementById('reporte-z').value || "0.00";
        const diffD = (datafono - reporteZ).toFixed(2);
        const obs = document.getElementById('observations').value || "Sin notas.";

        const text = `*RESUMEN DE CIERRE* 📊%0A` +
                     `📅 *Fecha:* ${new Date().toLocaleDateString()}%0A%0A` +
                     `*1. EFECTIVO*%0A` +
                     `• Total Real (A): €${totalA}%0A` +
                     `• Total Teórico (B): €${totalB}%0A` +
                     `• Diferencia: *€${diffC}* ${Math.abs(diffC) < 0.01 ? '✅' : '❌'}%0A%0A` +
                     `*2. TARJETAS*%0A` +
                     `• Datafono: €${datafono}%0A` +
                     `• Reporte Z: €${reporteZ}%0A` +
                     `• Diferencia: *€${diffD}* ${Math.abs(diffD) < 0.01 ? '✅' : '❌'}%0A%0A` +
                     `*3. NOTAS:* ${obs}`;

        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    saveClosing() {
        const closing = {
            id: Date.now(),
            date: new Date().toISOString(),
            totalA: parseFloat(document.getElementById('total-cash-combined').value),
            totalB: parseFloat(document.getElementById('total-caja-b').value),
            diffCaja: parseFloat(document.getElementById('total-cash-combined').value) - parseFloat(document.getElementById('total-caja-b').value),
            datafono: parseFloat(document.getElementById('cierre-datafono').value) || 0,
            reporteZ: parseFloat(document.getElementById('reporte-z').value) || 0,
            obs: document.getElementById('observations').value
        };

        this.closings.unshift(closing);
        localStorage.setItem('closings', JSON.stringify(this.closings));
        alert("Cierre guardado en historial.");
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
                <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                    <strong>${new Date(c.date).toLocaleDateString()}</strong>
                    <span class="${Math.abs(c.diffCaja) < 0.01 ? 'val-success' : 'val-error'}" style="font-weight:800; font-size:14px">
                        €${c.diffCaja.toFixed(2)}
                    </span>
                </div>
                <div style="font-size:12px; color:#48484A">
                    Efectivo: A €${c.totalA.toFixed(2)} | B €${c.totalB.toFixed(2)}<br>
                    Datafono: €${c.datafono.toFixed(2)} (Z: €${c.reporteZ.toFixed(2)})
                </div>
            </div>
        `).join('');
    }
};

app.init();
