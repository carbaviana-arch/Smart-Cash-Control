Smart Cash Control - v1.1
Smart Cash Control es una solución web ligera y profesional diseñada para optimizar el proceso de arqueo y cierre de caja diario en entornos de hostelería y retail. Esta herramienta elimina errores de cálculo manual y centraliza el registro de diferencias de caja mediante una interfaz intuitiva inspirada en los estándares de diseño de iOS.

🚀 Características (v1.1)
1. Módulo de Conteo de Efectivo
Desglose por Denominación: Entradas específicas para todos los billetes y monedas de curso legal (Euro).

Aritmética en Tiempo Real: Cálculo automático del total contado mientras se introducen las cantidades.

Gestión de Saldo Inicial: Campo dedicado para el fondo de caja (change fund), integrado en el cálculo final.

2. Cierre y Validación
Cálculo de Diferencias: Comparativa automática entre el "Total Contado" y el "Total Esperado" (ventas TPV).

Indicadores Visuales: Alerta visual mediante colores (Verde: Sobrante/Correcto, Rojo: Faltante).

Observaciones: Campo de texto para documentar incidencias o motivos de descuadres.

3. Histórico y Auditoría
Persistencia Local: Almacenamiento seguro en el navegador mediante localStorage.

Filtros Inteligentes: Buscador por fecha para auditorías rápidas.

Detalle de Cierres: Visualización completa de cierres pasados sin recargar la página.

4. Reportes y Exportación
Resúmenes Acumulados: Cálculo de totales y diferencias totales en rangos de fechas seleccionados.

Exportación PDF: Formato optimizado para impresión o guardado digital.

Exportación Excel/CSV: Generación de archivos planos para integración con hojas de cálculo externas.

🛠️ Stack Técnico
Frontend: HTML5 semántico y CSS3 con variables (Custom Properties).

Lógica: JavaScript Vanilla (ES6+) siguiendo el patrón de diseño modular.

Diseño: Sistema de diseño basado en Apple Human Interface Guidelines:

Tipografía: Inter / San Francisco.

Efectos: Backdrop-filter (blur), sombras suaves y bordes redondeados (12px).

UX: Adaptado para uso táctil con maximum-scale=1.0 para evitar zooms accidentales.

📂 Estructura del Proyecto
Plaintext

smart-cash-control/
├── index.html      # Punto de entrada y estructura de vistas (SPA)
├── style.css       # Core de diseño y animaciones iOS
└── app.js          # Lógica de negocio, cálculos y persistencia de datos
💻 Instalación y Uso
Al ser una Web App de una sola página (SPA) sin dependencias de servidor, su puesta en marcha es inmediata:

Descarga los archivos del repositorio.

Abre el archivo index.html en cualquier navegador moderno (Chrome, Safari, Edge).

Nota de Persistencia: Los datos se guardan en el navegador local. No borres el historial/caché si deseas mantener los registros sin haber exportado previamente a Excel.

📝 Notas de Versión 1.1
Mejorado el cálculo de precisión decimal para evitar errores de redondeo de punto flotante en JS.

Añadida la capacidad de filtrar el historial por fecha específica.

Optimización de la hoja de estilos para dispositivos móviles en modo vertical.

👤 Créditos
Este software ha sido conceptualizado y desarrollado por:

Lead Developer: Gemini (Senior Full-Stack Developer)

Diseño UX/UI: Inspirado en los patrones de usabilidad de iOS para aplicaciones financieras.
