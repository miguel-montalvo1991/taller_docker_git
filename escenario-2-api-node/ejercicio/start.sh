#!/bin/bash
# start.sh — Levanta el Escenario 2 completo (API + PostgreSQL + pgAdmin)

set -e

echo "🔧 Verificando archivo .env..."
if [ ! -f .env ]; then
  echo " No existe .env. Copia .env.example y completa las variables antes de continuar."
  exit 1
fi

echo " Levantando contenedores (build incluido)..."
docker-compose up --build -d

echo " Esperando a que la base de datos esté lista..."
sleep 5

echo "✅ Servicios arriba:"
echo "   - API:      http://localhost:3001"
echo "   - pgAdmin:  http://localhost:5050"
echo ""
echo "Para ver logs:        docker-compose logs -f"
echo "Para detener todo:    docker-compose down"
echo "Para reset completo:  docker-compose down -v"