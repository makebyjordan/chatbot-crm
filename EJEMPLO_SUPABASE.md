# 📋 EJEMPLO COMPLETO - Configuración Supabase

## 🔍 Dónde encontrar cada credencial:

### 1. PROJECT_REF
**Ubicación:** URL del dashboard de Supabase
```
https://supabase.com/dashboard/project/abcdefghijk12345
                                     ^^^^^^^^^^^^^^^^
                                     Tu PROJECT_REF
```

### 2. PASSWORD
**Ubicación:** Settings > Database > Database password
- Si no la recuerdas: "Reset database password"

### 3. ANON_KEY  
**Ubicación:** Settings > API
- Busca la sección "Project API keys"
- Copia el valor de **"anon" "public"**

### 4. SERVICE_ROLE_KEY
**Ubicación:** Settings > API  
- Busca la sección "Project API keys"
- Copia el valor de **"service_role" "secret"**

---

## 📝 Ejemplo de archivo .env configurado:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres.abcdefghijk12345:MiPassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.abcdefghijk12345:MiPassword123@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijk12345.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprMTIzNDUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTc3NzEyMCwiZXhwIjoxOTUxMzUzMTIwfQ.abc123def456ghi789jkl012mno345pqr678stu"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprMTIzNDUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM1Nzc3MTIwLCJleHAiOjE5NTEzNTMxMjB9.xyz789abc123def456ghi789jkl012mno345pqr"

# n8n Integration
N8N_WEBHOOK_URL="http://localhost:5678/webhook/chat"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Webhook Security
WEBHOOK_SECRET="mi-clave-secreta-super-segura-2024"
```

---

## 🎯 Pasos después de configurar:

1. **Verificar conexión:**
```bash
npx prisma db push
```

2. **Poblar con datos:**
```bash
npm run db:seed
```

3. **Ejecutar app:**
```bash
npm run dev
```

4. **Ver base de datos:**
```bash
npx prisma studio
```

---

## ⚠️ Troubleshooting común:

**Error "Invalid connection string":**
- Verifica que PROJECT_REF y PASSWORD sean correctos
- No debe haber espacios en las URLs

**Error "Invalid API key":**
- Verifica que ANON_KEY y SERVICE_ROLE_KEY sean correctos  
- Asegúrate de copiar las keys completas

**Error de permisos:**
- Puede necesitar configurar Row Level Security en Supabase
- El SERVICE_ROLE_KEY debe tener permisos completos

---

## 🔗 Links útiles de tu proyecto:

Reemplaza `PROJECT_REF` con el tuyo:

- **Dashboard**: https://supabase.com/dashboard/project/PROJECT_REF
- **Database**: https://supabase.com/dashboard/project/PROJECT_REF/editor  
- **API Settings**: https://supabase.com/dashboard/project/PROJECT_REF/settings/api
- **Database Settings**: https://supabase.com/dashboard/project/PROJECT_REF/settings/database
