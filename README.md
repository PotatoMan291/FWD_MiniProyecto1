# GameVault — Sistema de Gestión de Inventario

GameVault es una aplicación web para la gestión de inventario de videojuegos. Permite administrar productos, categorías, proveedores, empleados y movimientos de inventario mediante una interfaz web conectada a una API REST.

El sistema utiliza autenticación mediante JSON Web Tokens (JWT) para proteger las operaciones de gestión.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JSON Web Token (JWT)
- bcryptjs

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Panel principal con información del inventario.
- Gestión de categorías.
- Gestión de proveedores.
- Gestión de empleados.
- Gestión de productos.
- Asociación de productos con categorías y proveedores.
- Gestión de movimientos de inventario.
- Asociación de movimientos con productos y empleados.
- Control del stock mediante entradas, salidas y ajustes.
- Protección de las rutas de gestión mediante autenticación.
- Validación de datos y relaciones entre entidades.

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- [Node.js](https://nodejs.org/)
- npm, incluido con Node.js
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## Estructura del proyecto

```text
FWD_MiniProyecto1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── migrations/
│   ├── seeders/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/
└── README.md
```

## Configuración de la base de datos

### 1. Crear la base de datos

Desde PostgreSQL o pgAdmin, ejecuta:

```sql
CREATE DATABASE sistema_inventario;
```

El nombre debe coincidir con la variable `DB_NAME` del archivo de configuración del backend.

### 2. Configurar las variables de entorno

En la carpeta `backend`, crea un archivo llamado `.env`.

Puedes utilizar `.env.example` como referencia:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_inventario
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_POSTGRESQL
DB_DIALECT=postgres

JWT_SECRET=CAMBIA_ESTE_VALOR_POR_UN_SECRETO_SEGURO
JWT_EXPIRES_IN=1h
```

Reemplaza `TU_PASSWORD_POSTGRESQL` con la contraseña configurada para tu usuario de PostgreSQL.

También debes establecer un valor privado y seguro para `JWT_SECRET`.

**No se debe subir el archivo `.env` a GitHub**, ya que contiene credenciales y secretos de configuración.

## Instalación y ejecución

### Backend

Abre una terminal y ejecuta:

```bash
cd backend
npm install
```

Configura el archivo `.env` antes de iniciar el servidor.

Ejecuta las migraciones:

```bash
npm run db:migrate
```

Para cargar los datos iniciales, si corresponde:

```bash
npm run db:seed
```

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

### Verificar la conexión

Puedes comprobar que la API y PostgreSQL están funcionando mediante:

```text
GET http://localhost:3000/api/health
```

Una respuesta exitosa indica que la API está funcionando y que la base de datos está conectada.

### Frontend

Abre otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará la dirección local donde se ejecuta la aplicación. Normalmente es:

```text
http://localhost:5173
```

El frontend utiliza la API del backend en:

```text
http://localhost:3000/api
```

## Autenticación

GameVault utiliza JWT para autenticar a los usuarios.

Los endpoints principales de autenticación son:

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar un usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener el perfil del usuario autenticado |

Las solicitudes a los endpoints protegidos deben incluir el token en el encabezado:

```http
Authorization: Bearer TOKEN
```

## Endpoints principales

Las rutas de gestión requieren autenticación.

| Recurso | Endpoint |
|---|---|
| Categorías | `/api/categorias` |
| Proveedores | `/api/proveedores` |
| Empleados | `/api/empleados` |
| Productos | `/api/productos` |
| Movimientos | `/api/movimientos` |
| Dashboard | `/api/dashboard` |

Para los recursos CRUD se utilizan los siguientes métodos:

| Método | Operación |
|---|---|
| GET | Listar registros o consultar uno por ID |
| POST | Crear un registro |
| PUT | Actualizar un registro |
| DELETE | Eliminar un registro |

Los movimientos de inventario permiten registrar entradas, salidas y ajustes de stock. Las operaciones que modifican el inventario se realizan mediante transacciones para mantener la consistencia de los datos.

## Pruebas

Durante el desarrollo se realizaron pruebas de:

- Registro e inicio de sesión.
- Acceso a rutas protegidas.
- Operaciones CRUD de las entidades.
- Asociación de productos con categorías y proveedores.
- Asociación de movimientos con productos y empleados.
- Actualización de movimientos de inventario.
- Validación de cantidades y relaciones.
- Respuestas de error para registros inexistentes o datos inválidos.
- Verificación de la conexión con PostgreSQL.

Las pruebas de endpoints pueden realizarse mediante Postman.

## Documentación

La carpeta `docs/` contiene documentos y diagramas relacionados con el proyecto, incluyendo la investigación y el diseño de la base de datos.
