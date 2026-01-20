const app = {
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    closings: JSON.parse(localStorage.getItem('closings')) || [],

    init() {
        this.renderDenominations();
        this.updateDate();
        this.calculateTotal();
    },

    updateDate() {
        const now = new Date();
        document.getElementById('current-date').innerText = now.toLocaleDateString('es-ES', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
    },

    renderDenominations() {
        const container = document.getElementById('denominations-container');
        container.innerHTML = this.denominations.map(d => `
            <div class="denom-row">
                <span class="denom-label">${d >= 1 ? d + '€' : (d * 100).toFixed(0) + 'c'}</span>
                <input type="number" class="denom-input" data-value="${d}" 
                       placeholder="0" min="0" oninput="app.calculateTotal()" inputmode="numeric">
            </div>
        `).join('');
    },

    calculateTotal() {
        // 1. CÁLCULO DE LO FÍSICO (Lado A)
        let totalDenominations = 0;
        document.querySelectorAll('.denom-input').forEach(input => {
            totalDenominations += (parseFloat(input.value) || 0) * parseFloat(input.dataset.value);
        });

        const initial = parseFloat(document.getElementById('initial-balance').value) || 0;
        const subtotalBreakdown = totalDenominations + initial;
        const safeAmount = parseFloat(document.getElementById('safe-amount').value) || 0;
        const totalCashA = subtotalBreakdown + safeAmount;

        // UI Lado A
        document.getElementById('total-counted').innerText = `€${subtotalBreakdown.toFixed(2)}`;
        document.getElementById('total-cash-combined').value = totalCashA.toFixed(2);

        // 2. CÁLCULO DE LO TEÓRICO (Lado B)
        const fondoAyer = parseFloat(document.getElementById('fondo-ayer').value) || 0;
        const ventas = parseFloat(document.getElementById('ventas-efectivo').value) || 0;
        const totalCajaB = fondoAyer + ventas;
        document.getElementById('total-caja-b').value = totalCajaB.toFixed(2);

        // 3. VALIDACIÓN 1: CAJA
        const diffCaja = totalCashA - totalCajaB;
        const diffCajaEl = document.getElementById('diff-caja-total');
        diffCajaEl.innerText = `€${diffCaja.toFixed(2)}`;
        
        // Estilo semáforo: 0 = verde, != 0 = rojo
        diffCajaEl.className = (Math.abs(diffCaja) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';

        // 4. VALIDACIÓN 2: DATAFONO
        const cierreDatafono = parseFloat(document.getElementById('cierre-datafono').value) || 0;
        const reporteZ = parseFloat(document.getElementById('reporte-z').value) || 0;
        const diffData = cierreDatafono - reporteZ;
        
        const diffDataEl = document.getElementById('diff-datafono');
        diffDataEl.innerText = `€${diffData.toFixed(2)}`;
        diffDataEl.className = (Math.abs(diffData) < 0.01) ? 'status-badge val-success' : 'status-badge val-error';
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${viewId}`).classList.remove('hidden');
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${viewId}`).classList.add('active');
        if(viewId === 'history') this.renderHistory();
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
        alert("Cierre v1.1 confirmado.");
        location.reload();
    },

    renderHistory() {
        const list = document.getElementById('history-list');
        list.innerHTML = this.closings.map(c => `
            <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                    <strong>${new Date(c.date).toLocaleDateString()}</strong>
                    <span class="${Math.abs(c.diffCaja) < 0.01 ? 'val-success' : 'val-error'}" style="font-weight:700">
                        Dif: €${c.diffCaja.toFixed(2)}
                    </span>
                </div>
                <div style="font-size:13px; color:var(--ios-gray)">
                    Caja: A €${c.totalA.toFixed(2)} | B €${c.totalB.toFixed(2)}<br>
                    Tarjetas: €${c.datafono.toFixed(2)} (Z: €${c.reporteZ.toFixed(2)})
                </div>
            </div>
        `).join('');
    }
};

app.init();
