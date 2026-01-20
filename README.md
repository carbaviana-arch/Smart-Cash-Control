Smart Cash Control - v1.1
Smart Cash Control es una herramienta avanzada de gestión financiera diseñada para el cierre de caja operativo en hostelería y retail. Esta versión 1.1 introduce un sistema de conciliación de doble entrada, permitiendo validar no solo el efectivo físico, sino también la correlación entre ventas teóricas y cierres de terminales de tarjeta (Datafono).

🚀 Características Principales (v1.1)
1. Gestión de Efectivo y Caja Fuerte
Conteo por Denominación: Desglose detallado de monedas y billetes con cálculo en tiempo real.

Gestión de Caja Fuerte: Campo específico para declarar el efectivo en reserva, sumándose al total físico.

Integridad de Datos: El campo de subtotal de desglose es de solo lectura, obligando a un conteo físico real para evitar ajustes manuales arbitrarios.

2. Conciliación de Efectivo (A vs B)
El sistema implementa una validación contable entre dos magnitudes:

Total Caja A (Físico): Suma del conteo de monedas/billetes + Fondo Inicial + Caja Fuerte.

Total Caja B (Teórico): Suma del Fondo de Ayer + Ventas declaradas.

Validación Visual: El sistema compara A y B. Si la diferencia es exactamente 0.00, se marca en verde; cualquier otra diferencia se resalta en rojo.

3. Conciliación de Datafono y Reporte Z
Validación de Tarjetas: Módulo independiente para comparar el total del cierre del terminal (Datafono) contra el reporte de ventas del sistema (Reporte Z).

Indicador de Descuadre: Al igual que en efectivo, el sistema alerta visualmente si existe alguna discrepancia entre el cobro físico en tarjeta y lo registrado.

4. Histórico y Reportes
Persistencia Local: Almacenamiento persistente en localStorage.

Auditoría: Registro de observaciones para justificar descuadres detectados.

Exportación: Generación de reportes en PDF (vía impresión optimizada) y Excel (CSV).

🛠️ Stack Técnico
Arquitectura: Single Page Application (SPA).

Lenguajes: HTML5, CSS3 (Variables y Flexbox), JavaScript ES6+.

Interfaz: iOS Design System (Apple Human Interface Guidelines).

Uso de backdrop-filter para efectos de desenfoque.

Tipografía limpia (Inter/San Francisco).

Sistema de estados de color (Semáforo financiero).

📂 Estructura de Archivos
Plaintext

smart-cash-control/
├── index.html      # Estructura y módulos de validación
├── style.css       # Estilos estilo iOS y estados de validación
└── app.js          # Lógica de conciliación A/B y persistencia
💻 Instrucciones de Instalación
Clona o descarga los tres archivos en una carpeta local.

Ejecuta index.html en tu navegador (Chrome, Safari o Edge recomendados).

Uso Operativo:

Primero completa el Desglose de Efectivo.

Ingresa los valores de Caja Fuerte, Fondo Ayer y Ventas.

Valida que los indicadores aparezcan en verde antes de confirmar.

Realiza la misma operación con el módulo de Datafono.

Haz clic en "Confirmar Cierre" para guardar el registro en el historial.

📝 Lógica de Validación (v1.1)
[!IMPORTANT] Cálculo de Diferencia: El sistema utiliza una tolerancia de < 0.01 para la validación de colores. Esto garantiza que las discrepancias por redondeo de céntimos sean tratadas con precisión financiera.

👤 Créditos
Smart Cash Control v1.1 ha sido diseñado y desarrollado por: Francisco Carballo

Lead Full-Stack Developer: Gemini (AI Thought Partner).

Especialización: Ingeniería de software financiero y UX operativa.
