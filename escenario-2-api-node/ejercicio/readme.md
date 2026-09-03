# Escenario 2 — API REST (Node.js) + PostgreSQL — Ejercicio

API REST containerizada con Node.js + Express, PostgreSQL como base de datos y pgAdmin para administración.

## Requisitos cumplidos

- [x] Estructura completa del ejercicio
- [x] `GET /usuarios`, `POST /usuarios`
- [x] `PUT /usuarios/:id` — actualiza un usuario existente (`404` si no existe)
- [x] `DELETE /usuarios/:id` — elimina un usuario existente (`404` si no existe)
- [x] Migrations: la tabla `usuarios` se crea automáticamente al iniciar PostgreSQL mediante un script SQL montado en `docker-entrypoint-initdb.d` (no se crea desde el código de la API)
- [x] Variables de entorno gestionadas con `.env`
- [x] pgAdmin disponible en el puerto `5050`
- [x] Validación de datos en `POST` y `PUT` (nombre y email obligatorios y con formato válido, respuesta `400` si fallan)
- [x] `start.sh` para levantar todo el stack con un solo comando

## Estructura

```
ejercicio/
├── .env                  # Variables de entorno (no se sube al repo)
├── .env.example          # Plantilla de variables de entorno
├── Dockerfile
├── docker-compose.yml
├── start.sh              # Script de arranque automatizado
├── migrations/
│   └── 001_create_usuarios.sql
└── src/
    ├── package.json
    └── server.js
```

## Cómo levantar el proyecto

### 1. Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

### 2. Levantar todo con un comando

Desde Git Bash (o cualquier terminal con `bash`):

```bash
bash start.sh
```

Esto construye la imagen de la API, levanta PostgreSQL, espera a que esté saludable (`healthcheck`), levanta la API y pgAdmin.

### 3. Servicios disponibles

| Servicio | URL |
|---|---|
| API | http://localhost:3001 |
| pgAdmin | http://localhost:5050 |
| PostgreSQL | `localhost:5432` |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servicio |
| `GET` | `/usuarios` | Lista todos los usuarios |
| `POST` | `/usuarios` | Crea un usuario (`nombre`, `email` requeridos y validados) |
| `PUT` | `/usuarios/:id` | Actualiza un usuario (`404` si no existe, validación igual que `POST`) |
| `DELETE` | `/usuarios/:id` | Elimina un usuario (`404` si no existe) |

### Ejemplo de uso (Windows `cmd`)

```
curl -X POST http://localhost:3001/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Ana\",\"email\":\"ana@test.com\"}"
```

### Validación

`POST` y `PUT` rechazan con `400` si `nombre` está vacío o `email` no tiene formato válido:

```json
{
  "errores": [
    "El campo \"nombre\" es obligatorio y no puede estar vacío",
    "El campo \"email\" es obligatorio y debe tener un formato válido"
  ]
}
```

## Migraciones

El archivo `migrations/001_create_usuarios.sql` se ejecuta automáticamente la primera vez que PostgreSQL inicializa su volumen de datos (montado en `/docker-entrypoint-initdb.d`). Si se necesita forzar una nueva ejecución de las migraciones (por ejemplo tras editarlas), es necesario borrar el volumen de datos:

```bash
docker-compose down -v
bash start.sh
```

## Detener el proyecto

```bash
docker-compose down        # detiene los contenedores
docker-compose down -v     # detiene y elimina también el volumen de datos
```