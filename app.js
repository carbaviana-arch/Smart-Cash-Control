const app = {
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    closings: JSON.parse(localStorage.getItem('closings')) || [],

    init() {
        this.renderDenominations();
        this.updateDate();
        this.setupEventListeners();
        this.calculateTotal();
    },

    updateDate() {
        const now = new Date();
        document.getElementById('current-date').innerText = now.toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    },

    renderDenominations() {
        const container = document.getElementById('denominations-container');
        container.innerHTML = this.denominations.map(d => `
            <div class="denom-row">
                <span class="denom-label">${d >= 1 ? d + '€' : (d * 100) + 'c'}</span>
                <input type="number" class="denom-input" data-value="${d}" 
                       placeholder="0" min="0" oninput="app.calculateTotal()">
            </div>
        `).join('');
    },

    calculateTotal() {
        let total = 0;
        document.querySelectorAll('.denom-input').forEach(input => {
            const qty = parseFloat(input.value) || 0;
            const val = parseFloat(input.dataset.value);
            total += qty * val;
        });

        const initial = parseFloat(document.getElementById('initial-balance').value) || 0;
        const finalCounted = total + initial;
        
        document.getElementById('total-counted').innerText = `€${finalCounted.toFixed(2)}`;
        
        this.updateDifference(finalCounted);
    },

    updateDifference(counted) {
        const expected = parseFloat(document.getElementById('expected-amount').value) || 0;
        const diff = counted - expected;
        const diffEl = document.getElementById('difference-amount');
        
        diffEl.innerText = `€${diff.toFixed(2)}`;
        diffEl.className = diff < 0 ? 'diff-negative' : (diff > 0 ? 'diff-positive' : '');
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${viewId}`).classList.remove('hidden');
        
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${viewId}`).classList.add('active');

        if(viewId === 'history') this.renderHistory();
    },

    saveClosing() {
        const totalCounted = parseFloat(document.getElementById('total-counted').innerText.replace('€', ''));
        const expected = parseFloat(document.getElementById('expected-amount').value) || 0;
        
        if (expected === 0) return alert("Por favor, ingresa el total esperado.");

        const closing = {
            id: Date.now(),
            date: new Date().toISOString(),
            counted: totalCounted,
            expected: expected,
            diff: totalCounted - expected,
            obs: document.getElementById('observations').value
        };

        this.closings.unshift(closing);
        localStorage.setItem('closings', JSON.stringify(this.closings));
        
        alert("Cierre guardado con éxito.");
        location.reload(); // Reset para el siguiente día
    },

    renderHistory() {
        const filterDate = document.getElementById('history-filter').value;
        const list = document.getElementById('history-list');
        
        let filtered = this.closings;
        if(filterDate) {
            filtered = this.closings.filter(c => c.date.startsWith(filterDate));
        }

        list.innerHTML = filtered.map(c => `
            <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                    <strong>${new Date(c.date).toLocaleDateString()}</strong>
                    <span class="${c.diff < 0 ? 'diff-negative' : 'diff-positive'}">€${c.diff.toFixed(2)}</span>
                </div>
                <div style="font-size: 14px; color: #666">
                    Esperado: €${c.expected.toFixed(2)} | Contado: €${c.counted.toFixed(2)}
                </div>
                ${c.obs ? `<p style="font-style:italic; font-size:12px; margin-top:10px">"${c.obs}"</p>` : ''}
            </div>
        `).join('');
    },

    generateReport() {
        const start = document.getElementById('report-start').value;
        const end = document.getElementById('report-end').value;
        
        if(!start || !end) return alert("Selecciona un rango de fechas.");

        const filtered = this.closings.filter(c => {
            const d = c.date.split('T')[0];
            return d >= start && d <= end;
        });

        const totals = filtered.reduce((acc, curr) => {
            acc.counted += curr.counted;
            acc.expected += curr.expected;
            acc.diff += curr.diff;
            return acc;
        }, { counted: 0, expected: 0, diff: 0 });

        const results = document.getElementById('report-results');
        results.classList.remove('hidden');
        results.innerHTML = `
            <div class="card" id="printable-report">
                <h3>Resumen del Periodo</h3>
                <p>Total Esperado: €${totals.expected.toFixed(2)}</p>
                <p>Total Contado: €${totals.counted.toFixed(2)}</p>
                <hr>
                <p><strong>Diferencia Acumulada: <span class="${totals.diff < 0 ? 'diff-negative' : 'diff-positive'}">€${totals.diff.toFixed(2)}</span></strong></p>
                <button class="btn-secondary" onclick="window.print()" style="margin-top:10px">Exportar PDF (Imprimir)</button>
                <button class="btn-secondary" onclick="app.exportExcel()" style="margin-top:10px">Exportar Excel (CSV)</button>
            </div>
        `;
    },

    exportExcel() {
        let csv = "Fecha,Esperado,Contado,Diferencia,Observaciones\n";
        this.closings.forEach(c => {
            csv += `${c.date.split('T')[0]},${c.expected},${c.counted},${c.diff},"${c.obs}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'reporte_caja.csv');
        a.click();
    },

    setupEventListeners() {
        document.getElementById('initial-balance').addEventListener('input', () => this.calculateTotal());
        document.getElementById('expected-amount').addEventListener('input', () => this.calculateTotal());
    }
};

// Inicializar la aplicación
app.init();
