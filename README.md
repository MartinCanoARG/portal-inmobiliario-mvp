# Portal Inmobiliario MVP

MVP completo para un portal inmobiliario local con arquitectura separada:

- `frontend`: Next.js + TypeScript + Tailwind CSS
- `backend`: Django + Django REST Framework + SQLite
- Sin Docker, listo para correr en local

## Qué incluye

- Home pública con hero, buscador, propiedades destacadas, planes y CTA
- Resultados públicos con filtros, ordenamiento y vista de mapa con Leaflet + OpenStreetMap
- Detalle de propiedad con galería, ubicación, mapa y contacto al anunciante
- Landing de publicación para captar inmobiliarias y particulares
- Panel privado de anunciante con login, dashboard, alta y edición de propiedades
- Admin de Django configurado para planes, anunciantes y moderación de propiedades
- Seed demo con 3 planes, 3 anunciantes principales, 12 propiedades y usuario admin

## Estructura

```text
/
├─ frontend/
└─ backend/
```

## Credenciales demo

- Admin Django:
  - usuario: `admin`
  - contraseña: `admin1234`
- Inmobiliaria Premium:
  - usuario: `premium-agency`
  - contraseña: `demo1234`
- Inmobiliaria Básica:
  - usuario: `basic-agency`
  - contraseña: `demo1234`
- Particular:
  - usuario: `particular-demo`
  - contraseña: `demo1234`

## Cómo correr el backend

Desde la raíz del proyecto:

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

En Windows también podés evitar PowerShell y levantarlo directo con:

```bat
start-backend.cmd
```

Backend disponible en:

- API: `http://127.0.0.1:8000/api/`
- Admin: `http://127.0.0.1:8000/admin/`

Endpoints principales:

- `GET /api/properties/`
- `GET /api/properties/{slug}/`
- `GET /api/plans/`
- `GET /api/advertisers/`
- `POST /api/auth/login/`
- `GET /api/dashboard/properties/`
- `POST /api/dashboard/properties/`

## Cómo correr el frontend

Desde otra terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

En Windows también podés evitar el bloqueo de `npm.ps1` con:

```bat
start-frontend.cmd
```

Para abrir backend y frontend en dos ventanas al mismo tiempo:

```bat
start-local.cmd
```

Frontend disponible en:

- `http://127.0.0.1:3000`

La app usa por defecto esta API local:

- `http://127.0.0.1:8000/api`

Si querés cambiarla, podés crear `frontend/.env.local` con:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Verificación realizada

- `python manage.py makemigrations accounts properties`
- `python manage.py migrate`
- `python manage.py seed_demo`
- `python manage.py check`
- Login API validado con credenciales demo
- Listado y detalle público validados con el test client de Django
- `npm.cmd run build` ejecutado con éxito en frontend

## Notas técnicas

- Se usan URLs de imágenes mock para simplificar la demo local y evitar dependencias extra de procesamiento de archivos.
- SQLite queda lista para desarrollo local y la estructura está preparada para migrar más adelante a PostgreSQL.
- El portal deja claro que solo publica avisos, no intermedia operaciones y puede moderar publicaciones.
