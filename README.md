# Food Store

Sistema de pedidos de comida: los clientes se registran, recorren el catálogo, arman un carrito y confirman el pedido (dirección + forma de pago). El administrador gestiona categorías, productos, stock, pedidos y usuarios desde un panel.

Trabajo Práctico Integrador · Programación 4 · Tecnicatura Universitaria en Programación a Distancia (UTN).

- **Alumno:** Walter Verdun · legajo 1200 · comisión 9
- **Repositorio:** ``
- **Video de demostración:** ``

## Qué hay adentro

| Carpeta | Qué es |
|---|---|
| `backend/` | API REST con FastAPI + SQLModel sobre PostgreSQL. Capas Router → Service → Unit of Work → Repository → Model. |
| `frontend/` | App React 19 + TypeScript (Vite, Tailwind 4) organizada por features. |

La sesión viaja en una cookie `access_token` **HttpOnly**: el frontend nunca ve ni guarda el token.

## Requisitos

- **Python** 3.11 a 3.13 (SQLModel 0.0.22 no funciona con 3.14)
- **PostgreSQL** 15 o superior (para desarrollo rápido alcanza con SQLite, ver más abajo)
- **Node.js** 20.19 o superior
- **pnpm** 9 o superior (`npm install -g pnpm`)

## Backend

Los comandos son para PowerShell en Windows; en macOS/Linux cambia solo la activación del entorno (`source venv/bin/activate`) y `cp` en lugar de `Copy-Item`.

1. Crear la base de datos vacía (una sola vez). Desde `psql` o pgAdmin:

   ```sql
   CREATE DATABASE foodstore_db;
   ```

2. Instalar y arrancar:

   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env       # y editar DATABASE_URL con tu usuario y contraseña de PostgreSQL
   python -m app.db.seed             # crea las tablas y carga admin, categorías y productos (se puede repetir)
   uvicorn app.main:app --reload
   ```

3. La API queda en <http://localhost:8000>. Documentación: <http://localhost:8000/docs> y <http://localhost:8000/redoc>. Todos los endpoints cuelgan de `/api/v1`.


### Variables de entorno (`backend/.env`)

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base | `postgresql://postgres:postgres@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Firma del JWT (mínimo 32 caracteres, cambiala) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Vencimiento de la cookie y del token | `30` |
| `FRONTEND_ORIGIN` | Único origen permitido por CORS (con credenciales) | `http://localhost:5173` |

## Frontend

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env       # VITE_API_URL=http://localhost:8000/api/v1
pnpm build                        # verifica los tipos (strict) y genera dist/
pnpm dev                          # http://localhost:5173
```

El backend tiene que estar corriendo para que la app cargue datos. Si cambiás el puerto del front, actualizá `FRONTEND_ORIGIN` en el `.env` del backend: la cookie no viaja si el origen no coincide.

| Variable | Para qué sirve |
|---|---|
| `VITE_API_URL` | URL base de la API, con el prefijo `/api/v1` |

## Usuario del seed

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

Los clientes se crean desde **Registrarme** (el registro público siempre crea rol `user`).

## Recorrido sugerido para probarlo

1. Sin sesión: abrir el catálogo, buscar por nombre, filtrar por categoría, agregar productos al carrito y recargar (el carrito persiste).
2. Registrarse, ingresar y confirmar un pedido en **Continuar con el pedido** (dirección y forma de pago). Ver el pedido en **Mis pedidos**: el stock bajó.
3. Cancelar ese pedido mientras está `PENDIENTE`: el stock se restituye.
4. Ingresar como `admin`: ver el **Resumen**, crear una categoría y un producto, cambiar un stock, avanzar un pedido (`PENDIENTE → EN_PREPARACION → ENTREGADO`) y desactivar/activar un usuario.

## Estructura

```
backend/
├── requirements.txt            versiones fijadas (incluye passlib 1.7.4 + bcrypt 4.0.1)
├── .env.example
└── app/
    ├── main.py                 FastAPI, CORS con credenciales, prefijo /api/v1
    ├── core/                   config, database, security, deps, unit_of_work, base_repository
    ├── db/seed.py              seed idempotente
    └── modules/
        ├── auth/               registro, login (cookie), logout, /me
        ├── usuarios/           modelo Usuario; listado, activar y desactivar (admin)
        ├── categorias/         models, schemas, repository, unit_of_work, service, router
        ├── productos/          ídem (+ listado paginado con búsqueda y filtros, stock)
        └── pedidos/            ídem (+ máquina de estados, resumen)

frontend/src/
├── shared/{api,ui,components,layout,hooks,utils}
├── features/{auth,categorias,productos,usuarios,pedidos}/{pages,components,hooks,api,types}
├── store/{authStore,cartStore}.ts   Zustand + persist
└── routes/{AppRouter,ProtectedRoute}.tsx
```

## Decisiones que conviene conocer

- **Unit of Work.** El `commit` ocurre únicamente en el `__exit__` del `UnitOfWork`; ningún Service ni Router llama a `session.commit()`. Los Services de categorías, productos y pedidos abren `with self.uow as uow:` y devuelven el schema de salida dentro del bloque. Los Routers solo reciben el Service con `Depends`.
- **Crear pedido (RN-01).** Todo en una transacción: si algún ítem falla (stock, producto no disponible, repetido…) no se guarda el pedido ni se descuenta nada. Las filas de producto se leen con `SELECT … FOR UPDATE`, así dos pedidos simultáneos no pueden vender el mismo stock dos veces.
- **Inmutabilidad (RN-05).** Cada línea guarda una copia del nombre y del precio; no hay endpoints para editar ni borrar pedidos.
- **Cancelar (RN-03).** La restitución de stock y el cambio de estado se confirman juntos.
- **Baja lógica.** Categorías y productos usan `activo`, usuarios usan `disabled`. Un registro dado de baja responde 404; la baja de una categoría no libera su nombre ni oculta sus productos.
- **Sesión.** Si la cuenta se desactiva con la sesión abierta, la próxima petición responde 400 «Cuenta de usuario desactivada» y el interceptor de Axios limpia el `authStore`. En `localStorage` solo se guarda el usuario (nombre, email y rol), nunca el token.
- **Estado del cliente vs. del servidor.** TanStack Query maneja catálogo, pedidos, usuarios y resumen (con invalidación al mutar); Zustand maneja la sesión y el carrito. La única llamada a la API dentro de un `useEffect` es `checkSession` al montar.
