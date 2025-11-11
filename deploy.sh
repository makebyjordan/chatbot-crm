#!/bin/bash

# 🚀 Script de Deploy Automático - Chatbot CRM
# Uso: ./deploy.sh "mensaje del commit"

echo "🚀 Iniciando deploy automático..."

# Verificar si hay un mensaje de commit
if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar un mensaje de commit"
    echo "📋 Uso: ./deploy.sh \"tu mensaje aquí\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "📝 Mensaje del commit: $COMMIT_MESSAGE"

# Verificar estado del repositorio
echo "🔍 Verificando estado del repositorio..."
git status

# Agregar todos los cambios
echo "📦 Agregando archivos..."
git add .

# Verificar si hay cambios para commit
if git diff-index --quiet HEAD --; then
    echo "ℹ️  No hay cambios para hacer commit"
    exit 0
fi

# Hacer commit
echo "💾 Haciendo commit..."
git commit -m "$COMMIT_MESSAGE"

# Push al repositorio
echo "⬆️  Subiendo a GitHub..."
git push origin main

# Verificar si el push fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Deploy exitoso!"
    echo "🌐 Repositorio: https://github.com/makebyjordan/chatbot-crm"
    echo "📊 Ver cambios: https://github.com/makebyjordan/chatbot-crm/commits/main"
    echo ""
    echo "🎯 Próximos pasos:"
    echo "   • Vercel: Conectar repo para auto-deploy"
    echo "   • Netlify: Import desde GitHub"
    echo "   • Railway: Connect GitHub repo"
    echo ""
else
    echo "❌ Error en el push. Revisa la conexión y permisos."
    exit 1
fi
