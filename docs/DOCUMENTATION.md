# Documentación Exhaustiva - GymLabs 🏋️‍♂️

Esta guía técnica proporciona una visión profunda y detallada de la arquitectura, diseño, seguridad y flujos de trabajo del sistema GymLabs, abarcando tanto su **Frontend (Next.js)** como su **Backend (Spring Boot)**.

---

## 1. Arquitectura del Sistema 🏛️

GymLabs está diseñado bajo un modelo Cliente-Servidor fuertemente acoplado mediante APIs RESTful.

*   **Frontend (Cliente):** 
    *   Construido sobre **Next.js 14+ (App Router)** y **React 18**.
    *   Implementa renderizado híbrido (SSR/CSR) para asegurar un Dashboard reactivo y validaciones de sesión inmediatas.
    *   **Estilos:** TailwindCSS y Shadcn UI.
    *   **Despliegue:** Optimizado para Vercel.
*   **Backend (Servidor):**
    *   Construido sobre **Spring Boot 3** y **Java 21**.
    *   **Base de Datos:** MySQL conectada mediante Spring Data JPA / Hibernate.
    *   **Despliegue:** Optimizado para Railway.

---

## 2. Modelo de Base de Datos y Dominio 🗄️

El sistema utiliza una arquitectura **Multi-Tenant (Multi-Inquilino)** mediante separación a nivel de filas. Cada registro importante está enlazado a una `Empresa`.

*   **`Empresa`**: Representa la franquicia o marca del gimnasio (ej. "GymLabs Surco").
*   **`Sede`**: Ubicación física. Una `Empresa` posee una o más `Sedes`.
*   **`Personal`**: Empleados del sistema (Administradores, Recepcionistas). Pertenecen a una `Sede`.
*   **`Rol`**: Nivel de privilegios del `Personal` (ej. `ROLE_ADMIN`, `ROLE_RECEPCIONISTA`).
*   **`Cliente`**: Usuarios finales que asisten al gimnasio.
*   **`Plan`**: Catálogo de suscripciones que la empresa ofrece (ej. "Plan VIP Anual").
*   **`Membresia`**: Vínculo activo entre un `Cliente` y un `Plan`. Determina su acceso al recinto (`ACTIVA`, `VENCIDA`).
*   **`Pago`**: Transacción monetaria de una `Membresia`.

---

## 3. Seguridad y Control de Acceso Basado en Roles (RBAC) 🔐

La seguridad es el pilar central de GymLabs, gestionada mediante **JSON Web Tokens (JWT)**.

### Flujo de Autenticación
1. El usuario envía credenciales a `/api/auth/login`.
2. Spring Security las valida y genera un JWT.
3. El JWT es inyectado en una **Cookie segura** (`HttpOnly, Secure, SameSite=None`) y, simultáneamente, se devuelve en el cuerpo JSON como fallback (`Bearer Token`).
4. El Frontend captura el payload y lo almacena en `AuthContext` (y `localStorage`), el cual hidrata la sesión.

### Matriz de Permisos (RBAC)
Existen roles estrictos, los cuales se validan tanto a nivel visual (Frontend) como a nivel lógico (Backend).

| Función / Pantalla | `ROLE_SUPERADMIN` | `ROLE_ADMIN` | `ROLE_RECEPCIONISTA` |
| :--- | :---: | :---: | :---: |
| **Inicio (Clientes)** | - | ✅ Acceso Total | ✅ Acceso Total |
| **Dashboard (Métricas)** | - | ✅ Acceso Total | ❌ Bloqueado (Redirige) |
| **Planes** | - | ✅ Crear/Editar/Borrar | 👁️ Solo Lectura |
| **Alertas** | - | ✅ Acceso Total | ✅ Acceso Total |
| **Ajustes: Mi Perfil** | - | ✅ Editar | ✅ Editar (Excepto Correo) |
| **Ajustes: Gimnasio** | - | ✅ Editar | ❌ Oculto |
| **Ajustes: Staff** | - | ✅ Crear/Editar/Borrar | ❌ Oculto |
| **Panel SuperAdmin** | ✅ Acceso Total | ❌ Bloqueado | ❌ Bloqueado |

---

## 4. Flujos de Trabajo Principales 🔄

### Borrado Lógico (Soft Delete)
Para mantener la integridad referencial (ej. si un cajero renuncia, no se deben borrar las ventas que procesó), el sistema no usa la instrucción `DELETE` en la BD para datos críticos.
En su lugar, los registros de `Personal` y `Cliente` tienen un campo `activo = true/false`. Las llamadas API GET incluyen automáticamente filtros `WHERE activo = true`.

### Notificaciones y Toast
Todas las interacciones de mutación de datos en el Frontend utilizan notificaciones flotantes (Pop-ups) centrados proveídos por la librería `sonner`, mejorando la respuesta (Feedback) al usuario y evitando *Layout Shifts* indeseados.

---

## 5. Referencia de API (Endpoints Principales) 📡

El backend expone endpoints RESTful. Aquí los principales flujos documentados:

### Autenticación (`/api/auth`)
*   `POST /login`: Valida credenciales (`correo`, `password`) y retorna `AuthResponse` (incluye `token`, `idPersonal`, `rol`, `nombre`, `apellido`, `correo`, `dni`).

### Personal (`/api/personal`)
*   `GET /?empresaId={id}`: Obtiene el staff de una empresa.
*   `POST /`: Crea un nuevo miembro del staff. Requiere `ROLE_ADMIN`.
*   `PUT /{id}`: Actualiza perfil. Validación estricta de DNI y Correo únicos por empresa.
*   `DELETE /{id}`: Aplica borrado lógico (`activo = false`).

### Clientes (`/api/clientes`)
*   `GET /?page=0&size=10&empresaId={id}&searchTerm={text}`: Búsqueda dinámica y paginada de clientes.
*   `POST /`: Registra un cliente.
*   `PATCH /{id}/toggle-estado`: Alterna el estado activo/inactivo del usuario de manera rápida.

### Planes (`/api/planes`)
*   `GET /?empresaId={id}`: Lista los planes activos de la empresa.
*   `POST /` & `PUT /{id}`: Gestión de catálogo de planes. Bloqueado para recepcionistas en frontend.

---

## 6. Monitoreo y Observabilidad 📈

El sistema Backend cuenta con una capa de monitorización robusta para entornos de producción.
*   **Spring Boot Actuator**: Habilitado en `/actuator/prometheus`. Expone métricas clave de la JVM, uso de memoria, hilos de Spring y latencia de endpoints.
*   **Prometheus**: Consume el endpoint de Actuator para guardar métricas a lo largo del tiempo.
*   **Grafana**: Herramienta visual conectada a Prometheus para observar dashboards en vivo del rendimiento del servidor.

---
*Fin de la Documentación.*
