# Taller de reparaciones — React + PocketBase

Aplicación de gestión para un taller electrónico. Incluye clientes, órdenes, estados, presupuestos calculados e historial de transiciones.

## Requisitos

- Node.js 20 o superior.
- npm.
- PocketBase (descargar la versión compatible desde https://pocketbase.io/docs/).

## 1. Preparar PocketBase

Descarga PocketBase y descomprime el ejecutable en una carpeta. Copia las carpetas `pb_migrations` y `pb_hooks` de este repositorio junto al ejecutable de PocketBase (o inicia PocketBase indicando su directorio de datos y manteniendo esas carpetas en su directorio de trabajo).

Desde esa carpeta ejecuta:

```bash
./pocketbase serve
```

En Windows:

```powershell
.\pocketbase.exe serve
```

PocketBase escucha normalmente en `http://127.0.0.1:8090`. En el primer inicio, crea el usuario administrador desde la interfaz de PocketBase en `/ _/` (sin el espacio: `http://127.0.0.1:8090/_/`). Las colecciones se crean automáticamente mediante la migración al arrancar.

## 2. Iniciar React

En otra terminal, desde la raíz del proyecto:

```bash
npm install
```

Crea `.env` a partir de `.env.example` y ajusta `VITE_POCKETBASE_URL` si PocketBase está en otra dirección.

```bash
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`.

Para compilar:

```bash
npm run build
```

## 3. Datos de prueba

Crea dos clientes desde la sección Clientes:

- Ana Pérez — 555-0101
- Luis Gómez — 555-0102

Crea al menos tres órdenes desde Nueva orden. Después usa las acciones de cada detalle para dejarlas en etapas distintas. Por ejemplo:
- Orden 1: `solicitada`.
- Orden 2: `en_diagnostico` (inicia diagnóstico).
- Orden 3: `presupuestada` (registra diagnóstico y piezas).

Las órdenes se guardan en PocketBase; no hay datos simulados.

## 4. Flujo de trabajo

`solicitada → en_diagnostico → presupuestada → aprobada → en_reparacion → lista → entregada`

Salidas permitidas:
- `presupuestada → rechazada`
- `solicitada → cancelada`

El total del presupuesto se calcula en el frontend: mano de obra + cantidad × precio de cada pieza. No se almacena.

## 5. Seguridad y limitaciones del modo sin autenticación

El enunciado exige que el sistema no tenga autenticación. Por eso, las reglas de lectura y creación de clientes/órdenes son abiertas para permitir el uso del personal sin iniciar sesión. Las reglas de PocketBase no pueden identificar al personal ni distinguirlo de un tercero anónimo.

Las migraciones bloquean la eliminación de órdenes y la creación/edición/eliminación directa de eventos. El hook impide cambios directos de estado y protege el presupuesto después de presupuestar. Las transiciones se realizan por la ruta propia `/api/taller/ordenes/{id}/transicion`, que valida la secuencia y registra el evento dentro de una transacción.

**Importante para la defensa:** una API completamente pública y sin autenticación no puede garantizar que solo el personal autorizado la utilice. Para un despliegue real se debería proteger el acceso a la red o añadir autenticación; eso sería un cambio respecto al requisito académico de no tener login.

## 6. Pruebas recomendadas

- Crear clientes y órdenes.
- Intentar actualizar `estado` directamente con PATCH a `/api/collections/ordenes/records/{id}`: debe fallar si intenta cambiar la etapa.
- Intentar crear un evento directamente: debe fallar.
- Intentar modificar o borrar un evento: debe fallar.
- Intentar borrar una orden: debe fallar.
- Intentar saltar de `solicitada` a `lista` usando la ruta de transición: debe fallar.
- Presupuestar y luego intentar cambiar `diagnostico`, `manoObra` o `piezas`: debe fallar.
- Recargar la página y comprobar que los datos permanecen.

## 7. Estructura

- `src/pages`: páginas de la aplicación.
- `src/components`: componentes reutilizables.
- `src/services/api.js`: comunicación mediante Fetch API.
- `src/utils`: estados, transiciones y cálculos.
- `pb_migrations`: esquema de las colecciones.
- `pb_hooks`: validaciones y ruta de transición.

## 8. Defensa oral

Prepárate para explicar:
- React Router, rutas con parámetros y `Outlet`.
- Formularios controlados y props.
- Fetch API y estados de carga/error.
- Relaciones entre las colecciones.
- Migraciones y hooks de PocketBase.
- Validación de transiciones en el servidor.
- Cálculo del presupuesto sin persistir el total.
- Por qué una API pública sin autenticación tiene límites de seguridad.
