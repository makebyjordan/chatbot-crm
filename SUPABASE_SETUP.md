# 🔧 Configuración de Supabase

## 📋 Pasos para conectar tu proyecto Supabase

### 1. 🔑 Obtener Credenciales de Supabase

Ve a tu proyecto de Supabase y copia las siguientes credenciales:

**En el Dashboard de Supabase:**
1. Ve a `Settings` > `Database` 
2. Scroll hasta **Connection parameters**
3. Copia los valores necesarios

### 2. 📝 Configurar Variables de Entorno

Reemplaza los valores en el archivo `.env` con tus credenciales reales:

```env
# 🗄️ DATABASE_URL (Connection pooling)
DATABASE_URL="postgresql://postgres.TU_PROJECT_REF:TU_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# 🔗 DIRECT_URL (Direct connection para migraciones)
DIRECT_URL="postgresql://postgres.TU_PROJECT_REF:TU_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# 🌐 SUPABASE URLs y Keys
NEXT_PUBLIC_SUPABASE_URL="https://TU_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key-aqui"
```

### 3. 📊 Encontrar tus Credenciales

**PROJECT_REF:**
- En la URL de tu dashboard: `https://supabase.com/dashboard/project/TU_PROJECT_REF`

**PASSWORD:**
- La contraseña que configuraste al crear el proyecto
- Si la olvidaste, ve a `Settings` > `Database` > `Reset database password`

**ANON_KEY:**
- Ve a `Settings` > `API`
- Copia el valor de `anon` `public`

**SERVICE_ROLE_KEY:**
- Ve a `Settings` > `API`  
- Copia el valor de `service_role` `secret`

### 4. 🗂️ Ejemplo Completo

```env
# Ejemplo con valores reales (REEMPLAZA CON LOS TUYOS)
DATABASE_URL="postgresql://postgres.abcdefghijk12345:mi_password_super_segura@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.abcdefghijk12345:mi_password_super_segura@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijk12345.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. 🚀 Ejecutar Migraciones

Una vez configurado el `.env`:

```bash
# Aplicar el schema a Supabase
npx prisma db push

# Poblar con datos de ejemplo
npm run db:seed
```

### 6. ✅ Verificar Conexión

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio
```

### 🔍 Troubleshooting

**❌ Error de conexión:**
- Verifica que el PROJECT_REF y PASSWORD sean correctos
- Asegúrate de que no hay espacios extra en las URLs

**❌ Error de permisos:**
- Verifica que el SERVICE_ROLE_KEY sea correcto
- Puede ser necesario habilitar Row Level Security en Supabase

**❌ Error de migración:**
- Usa `npx prisma db push` en lugar de migrate para Supabase
- Verifica que DIRECT_URL esté configurada correctamente

### 📱 Próximo Paso

Una vez configurado, ejecuta:
```bash
npm run dev
```

¡Y tu aplicación estará corriendo en http://localhost:3000! 🎉
