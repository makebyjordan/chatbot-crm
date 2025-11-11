# 🚀 INICIO RÁPIDO - Chatbot CRM Dashboard

## ✅ Lo que ya está configurado:

✅ **Dependencias instaladas** - `npm install` completado
✅ **Prisma generado** - Cliente de base de datos listo  
✅ **Configuración Supabase** - Schema actualizado para Supabase
✅ **Variables de entorno** - Plantilla .env creada
✅ **Scripts helpers** - Comandos automáticos disponibles

## 🎯 LO QUE NECESITAS HACER AHORA:

### 1️⃣ **Configurar Supabase (2 opciones):**

**Opción A - Automática (Recomendada):**
```bash
npm run setup:supabase
```
*Te guiará paso a paso para ingresar tus credenciales*

**Opción B - Manual:**
- Edita el archivo `.env` y reemplaza las credenciales
- Ver `SUPABASE_SETUP.md` para más detalles

### 2️⃣ **Crear tablas y poblar datos:**
```bash
npm run setup:complete
```
*Esto ejecuta: prisma generate + db push + seed*

### 3️⃣ **Ejecutar la aplicación:**
```bash
npm run dev
```

### 4️⃣ **¡Listo! 🎉**
- **App**: http://localhost:3000
- **Base de datos**: `npx prisma studio`

---

## 📋 Credenciales que necesitas de Supabase:

Ve a tu proyecto en Supabase y obtén:

1. **PROJECT_REF** - En la URL del dashboard
2. **PASSWORD** - Password de tu base de datos  
3. **ANON_KEY** - Settings > API > anon public
4. **SERVICE_ROLE_KEY** - Settings > API > service_role secret

---

## 🔧 Comandos Disponibles:

```bash
# Configuración
npm run setup:supabase     # Configurar credenciales Supabase
npm run setup:complete     # Setup completo (db:push + seed)

# Base de datos
npm run db:push           # Aplicar schema a Supabase
npm run db:seed           # Poblar con datos de ejemplo
npm run db:studio         # Ver datos en navegador

# Desarrollo
npm run dev               # Ejecutar en desarrollo
npm run build             # Build para producción
```

---

## 🎯 Estado actual del proyecto:

✅ **Frontend completo**: Dashboard, Chat, Clientes, Sheets
✅ **API completa**: 10 endpoints funcionales
✅ **Base de datos**: Schema con 5 tablas relacionadas
✅ **Integraciones**: n8n webhooks preparado
✅ **UI/UX**: Dark mode, responsive, loading states
✅ **Validaciones**: Zod schemas en toda la app

**🚀 Solo faltan tus credenciales de Supabase para que todo funcione!**
