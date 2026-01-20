// ... dentro del objeto app ...

calculateTotal() {
    // --- 1. CÁLCULO DE LO FÍSICO (Lado A) ---
    let totalDenominations = 0;
    document.querySelectorAll('.denom-input').forEach(input => {
        totalDenominations += (parseFloat(input.value) || 0) * parseFloat(input.dataset.value);
    });

    const initial = parseFloat(document.getElementById('initial-balance').value) || 0;
    const subtotalBreakdown = totalDenominations + initial;
    const safeAmount = parseFloat(document.getElementById('safe-amount').value) || 0;
    const totalCashA = subtotalBreakdown + safeAmount;

    // Actualizar campos de solo lectura lado A
    document.getElementById('total-counted').innerText = `€${subtotalBreakdown.toFixed(2)}`;
    document.getElementById('total-cash-combined').value = totalCashA.toFixed(2);

    // --- 2. CÁLCULO DE LO TEÓRICO (Lado B) ---
    const fondoAyer = parseFloat(document.getElementById('fondo-ayer').value) || 0;
    const ventas = parseFloat(document.getElementById('ventas-efectivo').value) || 0;
    const totalCajaB = fondoAyer + ventas;
    
    document.getElementById('total-caja-b').value = totalCajaB.toFixed(2);

    // --- 3. VALIDACIÓN 1: CAJA ---
    const diffCaja = totalCashA - totalCajaB;
    const diffCajaEl = document.getElementById('diff-caja-total');
    diffCajaEl.innerText = `€${diffCaja.toFixed(2)}`;
    
    // Lógica de color: 0 es verde, cualquier otra cosa es rojo
    if (Math.abs(diffCaja) < 0.01) { // Usamos 0.01 por precisión de coma flotante
        diffCajaEl.className = 'status-badge val-success';
    } else {
        diffCajaEl.className = 'status-badge val-error';
    }

    // --- 4. VALIDACIÓN 2: DATAFONO ---
    const cierreDatafono = parseFloat(document.getElementById('cierre-datafono').value) || 0;
    const reporteZ = parseFloat(document.getElementById('reporte-z').value) || 0;
    const diffData = cierreDatafono - reporteZ;
    
    const diffDataEl = document.getElementById('diff-datafono');
    diffDataEl.innerText = `€${diffData.toFixed(2)}`;

    if (Math.abs(diffData) < 0.01) {
        diffDataEl.className = 'status-badge val-success';
    } else {
        diffDataEl.className = 'status-badge val-error';
    }
},

saveClosing() {
    // Recopilación de todos los nuevos campos para el historial
    const closing = {
        id: Date.now(),
        date: new Date().toISOString(),
        totalA: parseFloat(document.getElementById('total-cash-combined').value),
        totalB: parseFloat(document.getElementById('total-caja-b').value),
        diffCaja: parseFloat(document.getElementById('total-cash-combined').value) - parseFloat(document.getElementById('total-caja-b').value),
        cierreDatafono: parseFloat(document.getElementById('cierre-datafono').value) || 0,
        reporteZ: parseFloat(document.getElementById('reporte-z').value) || 0,
        diffDatafono: (parseFloat(document.getElementById('cierre-datafono').value) || 0) - (parseFloat(document.getElementById('reporte-z').value) || 0),
        obs: document.getElementById('observations').value
    };

    this.closings.unshift(closing);
    localStorage.setItem('closings', JSON.stringify(this.closings));
    
    alert("Cierre v1.3 guardado correctamente.");
    location.reload();
}
