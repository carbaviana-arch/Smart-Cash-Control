# Smart Cash Control - v1.1

**Smart Cash Control** es una solución web profesional diseñada para optimizar el proceso de arqueo y conciliación de caja diaria en entornos de hostelería y retail. Esta herramienta implementa un sistema de **doble validación contable** y comunicación automatizada, eliminando errores de cálculo manual y centralizando el registro de diferencias.

## 🚀 Características Principales (v1.1)

### 1. Conciliación de Doble Entrada
El sistema no solo cuenta dinero, sino que valida la integridad financiera mediante dos comparativas:
* **Efectivo (Físico vs Teórico):** Compara el efectivo contado (monedas, billetes, fondo de caja y caja fuerte) contra el esperado (fondo inicial del día anterior + ventas del TPV).
* **Datafono (Físico vs Teórico):** Compara el cierre del terminal de tarjetas contra el reporte Z (ventas en tarjeta) del sistema.

### 2. Automatización Operativa
* **Fondo Ayer Inteligente:** Al iniciar un nuevo arqueo, la app sugiere automáticamente como "Fondo Ayer" el total real del cierre anterior almacenado en el sistema.
* **Validación Visual iOS:** Indicadores tipo semáforo que cambian a **verde** si la diferencia es exactamente 0.00 y a **rojo** si existe descuadre.
* **Teclado Optimizado:** Configuración específica para dispositivos móviles que despliega el teclado numérico decimal automáticamente.

### 3. Conectividad y Reportes
* **Compartir en WhatsApp:** Botón dedicado que genera un resumen estructurado con emojis y formato profesional, enviándolo directamente a un grupo de WhatsApp de gerencia.
* **Historial Local:** Almacenamiento persistente en el navegador para auditorías rápidas sin necesidad de servidor.
* **Privacidad:** Los datos permanecen localmente en el dispositivo del usuario.

---

## 🛠️ Stack Técnico

* **Lenguajes:** HTML5, CSS3 (Variables y Flexbox), JavaScript Vanilla (ES6+).
* **Interfaz:** Diseño basado en las **Human Interface Guidelines de Apple** (Estilo iOS).
* **Persistencia:** Web Storage API (`localStorage`).
* **Integración:** API Pública de WhatsApp (`wa.me`).

---

## 📂 Estructura del Proyecto

smart-cash-control/
├── index.html      # Estructura SPA y módulos de validación
├── style.css       # Diseño visual, animaciones y estados de color
└── app.js          # Lógica financiera, sugerencia de fondo y WhatsApp

💻 Instalación y Uso
Copia los tres archivos en una carpeta de tu ordenador o dispositivo.

Abre index.html en cualquier navegador moderno.

Flujo Diario:

Ingresa el desglose de monedas y billetes.

Verifica el Fondo Ayer (sugerido automáticamente).

Ingresa las Ventas y los datos del Datafono.

Presiona Confirmar Cierre para guardar en el historial.

Presiona Enviar Resumen a WhatsApp para notificar el cierre.

📝 Notas de Versión 1.1
Añadida la lógica de sugerencia automática de fondo anterior.

Implementado el sistema de envío de reportes vía WhatsApp.

Mejorada la precisión decimal para evitar errores de redondeo en transacciones financieras.

Ajustada la UI para cumplimiento total con estándares iOS.

👤 Créditos
Este software ha sido conceptualizado y desarrollado por:

Lead Developer: Gemini (Senior AI Partner).

Diseño UX/UI: Inspirado en los patrones de usabilidad de sistemas financieros móviles.

Este proyecto es de uso local y no requiere conexión a bases de datos externas para funcionar.
