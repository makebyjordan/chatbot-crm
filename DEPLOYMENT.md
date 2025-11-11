# 🚀 Deployment Guide - Chatbot CRM

Tu proyecto ya está conectado a GitHub y listo para deployment automático.

## 📋 Repositorio GitHub

**🔗 URL**: https://github.com/makebyjordan/chatbot-crm
**🌿 Rama**: main
**✅ Estado**: Conectado y sincronizado

---

## ⚡ Scripts de Deploy Rápido

### 🔄 Deploy Básico
```bash
# Con mensaje personalizado
./deploy.sh "✨ Agregar nueva funcionalidad de filtros"

# O con npm script
npm run deploy "🐛 Fix bug en la paginación"
```

### 🚀 Deploy Rápido (sin mensaje)
```bash
npm run deploy:quick
```

### 🏗️ Deploy con Build
```bash
npm run deploy:build
```

### 📊 Ver estado
```bash
npm run git:status
```

### ⬇️ Recibir actualizaciones
```bash
npm run git:pull
```

---

## 🌐 Platforms de Deployment

### 1. **Vercel** (Recomendado para Next.js)

**Setup:**
1. Ve a [vercel.com](https://vercel.com)
2. Connect GitHub account
3. Import repository: `makebyjordan/chatbot-crm`
4. Configure environment variables:
   ```
   DATABASE_URL=tu-supabase-url
   DIRECT_URL=tu-supabase-direct-url
   NEXT_PUBLIC_SUPABASE_URL=https://yaulcpztvxbfnllkdamh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   N8N_WEBHOOK_URL=tu-n8n-url
   WEBHOOK_SECRET=tu-webhook-secret
   ```
5. Deploy!

**🔄 Auto-deploy**: Cada push a `main` se deploya automáticamente

---

### 2. **Netlify**

**Setup:**
1. Ve a [netlify.com](https://netlify.com)
2. New site from Git > GitHub
3. Repository: `makebyjordan/chatbot-crm`
4. Build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. Environment variables (mismo que Vercel)

---

### 3. **Railway**

**Setup:**
1. Ve a [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Select `makebyjordan/chatbot-crm`
4. Add environment variables
5. Deploy

---

## 🔧 Environment Variables para Production

**Necesarias para deployment:**

```env
# Database (ya configurada)
DATABASE_URL=postgresql://postgres:chatbotcrm2024@db.yaulcpztvxbfnllkdamh.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:chatbotcrm2024@db.yaulcpztvxbfnllkdamh.supabase.co:5432/postgres

# Supabase (ya configurada)
NEXT_PUBLIC_SUPABASE_URL=https://yaulcpztvxbfnllkdamh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# URLs de producción (actualizar)
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/chat

# Security
WEBHOOK_SECRET=tu-clave-super-segura-produccion
```

---

## 🔄 Workflow de Desarrollo

### 📝 Hacer cambios locales:
1. Editar archivos
2. Probar: `npm run dev`
3. Deploy: `./deploy.sh "📝 Descripción del cambio"`

### 🌍 Ver cambios en producción:
- **Vercel**: https://tu-app.vercel.app
- **GitHub**: https://github.com/makebyjordan/chatbot-crm

### 📊 Monitorear:
- **Commits**: https://github.com/makebyjordan/chatbot-crm/commits/main
- **Deployments**: Panel de Vercel/Netlify
- **Database**: `npm run db:studio`

---

## 🔗 Links Importantes

- **🗂️ Repositorio**: https://github.com/makebyjordan/chatbot-crm
- **📊 Commits**: https://github.com/makebyjordan/chatbot-crm/commits/main
- **🌐 Issues**: https://github.com/makebyjordan/chatbot-crm/issues
- **🔧 Actions**: https://github.com/makebyjordan/chatbot-crm/actions

---

## 🚨 Troubleshooting

**Deploy falló:**
```bash
git status
git pull origin main
./deploy.sh "🔄 Sync y fix deploy"
```

**Conflictos de merge:**
```bash
git pull origin main
# Resolver conflictos manualmente
git add .
git commit -m "🔀 Resolve merge conflicts"
git push origin main
```

**Reset a commit anterior:**
```bash
git log --oneline  # Ver commits
git reset --hard COMMIT_ID
git push --force origin main  # ⚠️ Solo si es necesario
```

---

## 🎯 Próximos Pasos

1. **✅ Setup Vercel** - Deploy automático
2. **🔧 Configurar n8n** - IA responses en producción
3. **📊 Google Sheets** - Sync real con API
4. **🔐 Auth** - Implementar autenticación
5. **📱 PWA** - Convertir en Progressive Web App

**🎉 ¡Tu proyecto está listo para el mundo!**
