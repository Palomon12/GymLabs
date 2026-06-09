# GymLabs - Sistema de Gestión para Gimnasios 🏋️‍♂️

GymLabs es una plataforma moderna diseñada para la gestión administrativa de gimnasios y centros de entrenamiento. Este repositorio contiene el **Frontend** de la aplicación, construido con un enfoque en rendimiento, diseño atractivo y experiencia de usuario.

## ✨ Características Principales

*   📊 **Dashboard Interactivo:** Métricas en tiempo real de ingresos, clientes activos y membresías usando `recharts`.
*   👥 **Directorio de Usuarios (CRUD):** Registro, edición y eliminación segura de clientes con validaciones robustas.
*   🔍 **Búsqueda Dinámica:** Filtrado en tiempo real por nombre, apellido o DNI sin recargar la página.
*   📄 **Paginación Inteligente:** Visualización fluida de datos grandes (10, 30 o 50 usuarios por vista).
*   📥 **Exportación a Excel:** Descarga instantánea de la base de datos de usuarios en formato `.xlsx`.
*   🎨 **Diseño Moderno:** Interfaz oscura (Dark Mode), con acentos neón, 100% responsiva.
*   🏗️ **Arquitectura Basada en Componentes:** Código estructurado, limpio y fácil de mantener usando Custom Hooks.

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Librería Principal:** [React 18](https://react.dev/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Botones, Tablas, Modales, Inputs)
*   **Gráficos:** [Recharts](https://recharts.org/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Exportación de Datos:** [SheetJS (xlsx)](https://sheetjs.com/)

## 🚀 Instalación y Uso Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Palomon12/GymLabs.git
   cd GymLabs
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Navega a [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.

> **Nota:** Para que el frontend funcione al 100%, es necesario tener el backend (Spring Boot) corriendo en paralelo en el puerto `8081`.

## 📁 Estructura del Proyecto

```text
src/
├── app/                  # Rutas de Next.js (Dashboard, Login, etc.)
├── components/           
│   ├── layout/           # Componentes estructurales (Sidebar, Navbar)
│   ├── ui/               # Componentes genéricos (Botones, Inputs, Tablas)
│   └── users/            # Componentes específicos del directorio de usuarios
├── hooks/                # Custom Hooks (ej. useUsers para lógica de API)
├── lib/                  # Utilidades y funciones de ayuda
└── types/                # Interfaces de TypeScript (ej. Cliente)
```

## 👥 Contribuciones
¡Las contribuciones son bienvenidas! Si deseas proponer mejoras, abre un *Issue* o envía un *Pull Request*.
