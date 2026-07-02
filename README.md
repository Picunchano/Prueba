# NanaConecta

Plataforma web que conecta trabajadoras de casa particular con familias empleadoras en Chile.

## Descripción

En Chile hay 260.000 trabajadoras de casa particular y el 48% trabaja sin contrato formal. Los métodos actuales para encontrar trabajo o trabajadora son grupos de Facebook, WhatsApp y recomendaciones de conocidos. No hay verificación, no hay trazabilidad, no hay confianza estructurada. NanaConecta resuelve eso mediante una plataforma digital especializada con sistema de postulaciones, contratos, reseñas y mensajería.

## Decisión Arquitectónica: Monolito MVC

El proyecto implementa arquitectura monolítica justificada por tres razones concretas:

- Equipo de desarrollo individual: un solo codebase maximiza la velocidad de entrega
- MVP en etapa temprana: sin necesidad de escala independiente por servicio
- Costo operacional mínimo: un servidor versus N servidores en microservicios

La migración a microservicios se planifica usando el patrón Strangler Fig cuando el módulo de verificación de identidad requiera escala independiente.

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | 18.3.1 / 6.0.0 |
| Routing | react-router-dom | 6.28.0 |
| HTTP Client | Axios | 1.7.9 |
| Backend | Node.js + Express | 5.2.1 |
| ORM | Prisma | 5.22.0 |
| Base de Datos | PostgreSQL | 16 Alpine |
| Autenticación | JWT + bcryptjs | 9.0.3 / 3.0.3 |
| Seguridad | helmet + express-rate-limit | 8.2.0 / 8.5.2 |
| Validación | express-validator | 7.3.2 |
| Upload | multer | 2.2.0 |
| Contenedores | Docker + Compose | Latest |
| Orquestación | Kubernetes | 3 réplicas + HPA |
| Gestor paquetes | pnpm | 11.9.0 |

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Node.js 20 o superior
- pnpm instalado globalmente (`npm install -g pnpm`)
- Git

## Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Picunchano/nanaconecta.git
cd nanaconecta
```

### 2. Crear las variables de entorno

Crear el archivo `backend/.env`:
```
DATABASE_URL=postgresql://nana_user:nana_pass_2024@localhost:5432/nanaconecta_db
JWT_SECRET=nanaconecta_jwt_secret_super_seguro_2024_xyz
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Levantar base de datos y backend

```bash
docker compose up -d --build
```

Este comando construye la imagen del backend, levanta PostgreSQL con healthcheck, ejecuta las migraciones automáticamente y sirve la API en el puerto 3000.

### 4. Cargar datos de prueba

```bash
docker compose exec backend sh -c "node prisma/seed.js"
```

Esto crea 6 trabajadoras, 3 familias empleadoras y 4 trabajos de prueba con contraseña `Test1234`.

### 5. Instalar y levantar el frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### 6. Verificar que todo funciona

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada: `{"status":"ok","message":"NanaConecta API running"}`

### URLs de acceso

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/health

## Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| maria.gonzalez@gmail.com | Test1234 | Trabajadora |
| carmen.lopez@gmail.com | Test1234 | Trabajadora |
| rosa.martinez@gmail.com | Test1234 | Trabajadora |
| familia.rodriguez@gmail.com | Test1234 | Empleadora |
| familia.soto@gmail.com | Test1234 | Empleadora |

## Estructura del Proyecto

```
NanaConecta/
├── docker-compose.yml
├── README.md
├── k8s/
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── configmap.yaml
│   ├── deployment.yaml        ← 3 réplicas + rolling update + health probes
│   ├── service.yaml
│   └── hpa.yaml               ← Autoescalado 3-10 réplicas
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── public/uploads/avatars/ ← Fotos de perfil (volumen Docker)
│   ├── prisma/
│   │   ├── schema.prisma      ← 8 modelos
│   │   └── seed.js            ← Datos de prueba
│   └── src/
│       ├── app.js             ← helmet → CORS → json → static → morgan → rate limit → rutas → 404 → error handler
│       ├── controllers/       ← 9 controladores
│       ├── routes/            ← 9 archivos de rutas
│       ├── middlewares/       ← auth, role, validate, upload
│       └── validators/        ← authValidators, jobValidators, reviewValidators
└── frontend/
    ├── public/pictures/       ← familia.jpg, nana.jpg
    └── src/
        ├── api/               ← axios con interceptor JWT
        ├── context/           ← AuthContext
        ├── components/        ← Navbar, PaymentModal, PricingCards, ReviewModal, ReviewsList
        ├── pages/             ← 10 páginas
        └── styles/            ← global.css, animations.css
```

## Endpoints de la API

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| GET | /api/health | No | - | Estado del servidor |
| POST | /api/auth/register | No | - | Crear cuenta |
| POST | /api/auth/login | No | - | Iniciar sesión, devuelve JWT |
| GET | /api/auth/me | Si | - | Usuario autenticado |
| GET | /api/users/profile | Si | - | Ver perfil propio |
| PUT | /api/users/profile | Si | - | Editar perfil |
| PUT | /api/users/profile/worker | Si | WORKER | Editar perfil trabajadora |
| PUT | /api/users/profile/employer | Si | EMPLOYER | Editar perfil empleadora |
| POST | /api/users/avatar | Si | - | Subir foto de perfil |
| GET | /api/workers | No | - | Listar trabajadoras |
| GET | /api/workers/:id | No | - | Ver perfil de trabajadora |
| GET | /api/employers | No | - | Listar empleadores |
| GET | /api/employers/:id | No | - | Ver perfil de empleador |
| GET | /api/jobs | No | - | Listar trabajos |
| GET | /api/jobs/my | Si | EMPLOYER | Mis trabajos publicados |
| GET | /api/jobs/:id | No | - | Detalle de trabajo |
| POST | /api/jobs | Si | EMPLOYER | Publicar trabajo |
| PUT | /api/jobs/:id | Si | EMPLOYER | Editar trabajo |
| DELETE | /api/jobs/:id | Si | EMPLOYER | Eliminar trabajo |
| POST | /api/applications/:jobId/apply | Si | WORKER | Postularse |
| GET | /api/applications/my | Si | WORKER | Mis postulaciones |
| GET | /api/applications/employer | Si | EMPLOYER | Postulaciones recibidas |
| PUT | /api/applications/:id/accept | Si | EMPLOYER | Aceptar postulación |
| PUT | /api/applications/:id/reject | Si | EMPLOYER | Rechazar postulación |
| GET | /api/contracts/my | Si | Ambos | Mis contratos |
| POST | /api/contracts | Si | EMPLOYER | Crear contrato |
| PUT | /api/contracts/:id/complete | Si | Ambos | Completar contrato |
| PUT | /api/contracts/:id/cancel | Si | Ambos | Cancelar contrato |
| POST | /api/reviews | Si | Ambos | Dejar reseña |
| GET | /api/reviews/user/:userId | No | - | Ver reseñas de usuario |
| POST | /api/messages | Si | Ambos | Enviar mensaje |
| GET | /api/messages/contacts | Si | Ambos | Lista de contactos |
| GET | /api/messages/conversation/:userId | Si | Ambos | Ver conversación |

## Modelos de Base de Datos

```
User ──────────┬── WorkerProfile  (1:1)
               ├── EmployerProfile (1:1)
               ├── Job             (1:N como employer)
               ├── Application     (1:N como worker)
               ├── Contract        (1:N como worker y employer)
               ├── Review          (1:N como autor y destinatario)
               └── Message         (1:N como sender y receiver)

Job ───────────┬── Application (1:N)
               └── Contract   (1:N)

Contract ──────── Review (1:N)
```

## Seguridad

- Contraseñas hasheadas con bcrypt, factor de costo 12
- Tokens JWT con expiración de 7 días
- Helmet con Content-Security-Policy configurado
- CORS restrictivo: solo orígenes permitidos explícitamente
- Rate limiting: 100 req/15min general, 5 intentos/15min en auth
- Todos los secretos en variables de entorno
- El login devuelve el mismo mensaje independiente de si el email existe
- Subida de archivos limitada a JPEG/PNG/WebP, máximo 5MB

## Páginas del Frontend

| Ruta | Página | Auth |
|------|--------|------|
| / | Home con hero, stats, planes de precios | No |
| /login | Iniciar sesión | No |
| /register | Registro + selección de plan | No |
| /jobs | Listado de trabajos con filtros | No |
| /jobs/:id | Detalle de trabajo + postulación | No |
| /workers | Listado de trabajadoras con filtros | No |
| /workers/:id | Perfil público de trabajadora | No |
| /pricing | Página de planes de pago | No |
| /dashboard | Panel de control según rol | Si |
| /profile | Editar perfil y foto | Si |
| /messages | Chat con contactos | Si |

## Kubernetes

Los manifiestos en la carpeta `k8s/` despliegan el backend con alta disponibilidad:

```bash
kubectl apply -f k8s/
```

El deployment usa 3 réplicas con rolling update (maxSurge 1, maxUnavailable 0), liveness y readiness probes en `/api/health`, y recursos CPU/memoria definidos. El HPA escala automáticamente entre 3 y 10 réplicas según uso de CPU (70%) y memoria (80%).

## Comandos Docker

```bash
# Levantar todo el stack
docker compose up -d --build

# Ver logs del backend
docker compose logs backend -f

# Ver estado de contenedores
docker compose ps

# Cargar datos de prueba
docker compose exec backend sh -c "node prisma/seed.js"

# Detener
docker compose down

# Detener y borrar volúmenes (resetea BD)
docker compose down -v
```

## Modelo de Monetización

| Año | Modelo | Estimación |
|-----|--------|-----------|
| Año 1 | Freemium — acceso gratuito | Validación de usuarios |
| Año 2 | Plan Familiar $9.990/mes | $5M CLP/mes con 500 familias |
| Año 2 | Verificación antecedentes $4.990 | Por demanda |
| Año 3 | Comisión 10% primera remuneración | Por contrato verificado |

Las trabajadoras nunca pagan para acceder al mercado laboral.

## Autor

Leonardo Picunche
Arquitectura de Desarrollo Web ICCE1042
Universidad Mayor 2026