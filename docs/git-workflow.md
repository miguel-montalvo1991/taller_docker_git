# Flujo de trabajo con Git en este taller

Una rama por escenario. `main` solo tiene documentación y guías generales,
nunca el código de trabajo en progreso.

```bash
# 1. Crear la rama del escenario a partir de main
git checkout main
git pull origin main
git checkout -b escenario-1-wordpress

# 2. Trabajar solo dentro de escenario-1-wordpress/ejercicio/
cd escenario-1-wordpress/ejercicio/

# 3. Commits pequeños y descriptivos (no un solo commit gigante al final)
git add .
git commit -m "feat: agrega docker-compose para WordPress + MySQL"

# 4. Subir la rama al remoto
git push origin escenario-1-wordpress

# 5. Al terminar y probar que todo funciona, integrar a main
git checkout main
git merge escenario-1-wordpress
git push origin main
```

## Por qué importa esto (no solo "porque lo pide la guía")

- Si algo se rompe en el escenario 2, `main` sigue estable: nunca perdiste
  el trabajo del escenario 1 que ya funcionaba.
- El historial de commits (`git log --oneline --graph`) queda como evidencia
  real de tu proceso, no solo del resultado final — muy útil si te toca
  sustentar o explicar cómo llegaste a la solución.
- Es el mismo patrón (rama por unidad de trabajo, commits chicos, merge al
  final) que se usa en equipos reales, solo que aquí la "unidad de trabajo"
  es un escenario completo en vez de una sola funcionalidad.
