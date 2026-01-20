# Smart Cash Control v1.2 🚀

**Smart Cash Control** es una Progressive Web App (PWA) de alto rendimiento diseñada para la gestión crítica de arqueos de caja en hostelería y comercio. Esta versión **v1.2 Pro** introduce capacidades de auditoría mediante intercambio de archivos y una interfaz de usuario refinada bajo los estándares de diseño de iOS.

!

## ✨ Novedades de la Versión 1.2
* **Auditoría JSON:** Sistema de exportación e importación de datos para verificar desgloses de monedas pieza a pieza entre diferentes dispositivos.
* **Interfaz Premium Dark:** Cabecera con estética modo oscuro y navegación mediante un Dock con efecto *Glassmorphism*.
* **Sugerencia de Fondo:** Lógica inteligente que carga el arqueo real de la jornada anterior como fondo inicial del día actual.

## 🛠️ Funcionalidades Core

### 1. Conciliación Inteligente
* **Efectivo (Real vs Teórico):** Algoritmo que cruza el conteo físico (monedas, billetes, fondo y reserva) con los datos del TPV.
* **Tarjetas (Datafono vs Z):** Validación de descuadres en pagos electrónicos.

### 2. Exportación Dual
* **Vía WhatsApp:** Envío de un resumen ejecutivo formateado con emojis para lectura rápida por parte de gerencia.
* **Archivo de Datos:** Generación de archivos `.json` para auditoría técnica profunda, permitiendo reconstruir el conteo exacto en otro terminal.

### 3. Experiencia de Usuario (UX)
* **Mobile First:** Optimizado para uso con una sola mano en entornos de ritmo rápido.
* **Persistencia Local:** Todos los cierres se guardan en el historial del dispositivo sin necesidad de bases de datos externas.

---

## 📂 Estructura del Repositorio
├── index.html      # Estructura SPA y Capa de Datos
├── style.css       # Diseño Premium, Dock y Animaciones
└── app.js          # Motores de cálculo, Export/Import y Lógica de Negocio

🚀 Instalación en 30 segundos
Sube estos archivos a un repositorio de GitHub.

Activa GitHub Pages en la configuración del repositorio.

Abre el enlace generado en tu iPhone o Android y selecciona "Añadir a pantalla de inicio" para usarla como una App nativa.

📖 Guía de Uso para Auditoría
Empleado: Realiza el conteo, guarda el cierre y pulsa 📤 Exportar JSON. Envía ese archivo por WhatsApp al gerente.

Gerente: Abre la App en su móvil, pulsa 📥 Cargar JSON y selecciona el archivo recibido. La App mostrará automáticamente cuántas monedas y billetes contó el empleado exactamente.

👤 Créditos y Soporte
Desarrollado por Francisco Carballo / Director Creativo y Supervisor de desarrollo. Gemini (AI Thought Partner). Este software está diseñado para operar 100% de forma local, garantizando la privacidad de los datos financieros del negocio.

Smart Cash Control - La precisión es la clave del éxito.
```text
├── index.html      # Estructura SPA y Capa de Datos
├── style.css       # Diseño Premium, Dock y Animacione.js          # Motores de cálculo, Export/Import y Lógica de Negocio
