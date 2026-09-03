# Taller Docker + Git

Repositorio de práctica: 4 escenarios progresivos con Docker Compose,
trabajados en ramas separadas siguiendo el flujo descrito en
`docs/git-workflow.md`.

## Escenarios

| Escenario | Carpeta | Objetivo | Estado |
|---|---|---|---|
| 1 | `escenario-1-wordpress/` | WordPress + MariaDB + phpMyAdmin, con volúmenes persistentes | ✅ Completo (mergeado a main) |
| 2 | `escenario-2-api-node/` | API REST Node.js + PostgreSQL, con healthcheck | 🔵 Ejemplo listo, ejercicio en progreso |
| 3 | `escenario-3-redis-cache/` | App con caché Redis | ⬜ Sin empezar |
| 4 | `escenario-4-cicd/` | CI/CD con GitHub Actions → DockerHub | ⬜ Sin empezar |

Cada escenario tiene:
- `ejemplo/`: código guiado, ya funcional, para estudiar antes de hacer el ejercicio.
- `ejercicio/`: donde están mis propias soluciones (no se sube resuelta en este repo base).

## Cómo levantar cualquier ejemplo

```bash
cd escenario-X-nombre/ejemplo
docker-compose up -d
docker-compose logs -f
docker-compose down        # apaga
docker-compose down -v     # apaga y borra volúmenes (pierdes los datos)
```