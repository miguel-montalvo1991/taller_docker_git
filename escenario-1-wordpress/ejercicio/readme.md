# Ejercicio 1 - WordPress con Docker

## Descripción

Este ejercicio implementa un entorno WordPress usando Docker Compose,
MariaDB y phpMyAdmin.

## Servicios

- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081
- MariaDB: servicio interno de Docker

## Requisitos

- Docker Desktop instalado y ejecutándose.
- Docker Compose disponible.

## Variables de entorno

Las credenciales se almacenan en el archivo `.env`.

Para crear el archivo `.env` a partir del ejemplo:

```bash
copy .env.example .env