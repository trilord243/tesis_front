#!/bin/bash

# Script para configurar las variables de entorno en Heroku
# Ejecutar con: bash heroku-config.sh

echo "Configurando variables de entorno en Heroku..."

# Configurar la URL del backend
heroku config:set NEXT_PUBLIC_API_URL=https://centromundox-backend-947baa9d183e.herokuapp.com

# Configurar el JWT secret (deberías usar el mismo que en el backend)
heroku config:set JWT_SECRET=changeme_secret_key

echo "Variables de entorno configuradas. Verificando..."
heroku config

echo "Configuración completada!"