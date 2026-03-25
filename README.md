# Portal Inmobiliario MVP

MVP completo para un portal inmobiliario local con arquitectura separada:

- `frontend`: Next.js + TypeScript + Tailwind CSS
- `backend`: Django + Django REST Framework + SQLite
- Sin Docker, listo para correr en local

Repositorio:

- `https://github.com/MartinCanoARG/portal-inmobiliario-mvp`

## Que incluye

- Home publica con hero, buscador, propiedades destacadas, planes y CTA
- Resultados publicos con filtros, ordenamiento y vista de mapa con Leaflet + OpenStreetMap
- Detalle de propiedad con galeria, ubicacion, mapa y contacto al anunciante
- Landing de publicacion para captar inmobiliarias y particulares
- Panel privado de anunciante con login, dashboard, alta y edicion de propiedades
- Admin de Django configurado para planes, anunciantes y moderacion de propiedades
- Seed demo con 3 planes, 3 anunciantes principales, 12 propiedades y usuario admin

## Estructura

```text
/
|-- frontend/
`-- backend/
```

## Requisitos previos

Antes de arrancar, cada companero tiene que instalar esto:

1. Git
   Descarga oficial: `https://git-scm.com/download/win`
2. Python 3
   Descarga oficial: `https://www.python.org/downloads/`
3. Node.js
   Descarga oficial: `https://nodejs.org/en/download`

### Versiones recomendadas

- Python 3.11 o 3.12
- Node.js 20 LTS o superior
- Git actualizado

Notas:

- En Windows, durante la instalacion de Python conviene marcar la opcion `Add python.exe to PATH`.
- Node.js ya incluye `npm`, asi que no hace falta instalar `npm` por separado.
- SQLite no hace falta instalarla aparte porque Django usa el archivo local `db.sqlite3` cuando existe, o lo crea con las migraciones.

## Clonar el proyecto

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/MartinCanoARG/portal-inmobiliario-mvp.git
cd portal-inmobiliario-mvp
```

## Inicio rapido en Windows

Si usan Windows, la forma mas simple es:

1. Abrir una terminal en la carpeta del proyecto
2. Ejecutar el backend:

```bat
start-backend.cmd
```

3. En otra terminal, ejecutar el frontend:

```bat
start-frontend.cmd
```

O bien abrir ambos a la vez:

```bat
start-local.cmd
```

Eso hace lo siguiente automaticamente:

- crea el entorno virtual de Python en `backend/.venv` si no existe
- instala dependencias del backend
- aplica migraciones
- carga los datos demo
- instala dependencias del frontend si faltan
- limpia la cache local de Next.js

## Instalacion manual paso a paso

Esta opcion sirve para Windows, macOS y Linux.

### 1. Backend

Desde la raiz del proyecto:

```bash
cd backend
python -m venv .venv
```

Activar el entorno virtual:

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows CMD:

```bat
.venv\Scripts\activate.bat
```

macOS / Linux:

```bash
source .venv/bin/activate
```

Instalar dependencias y preparar la base:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 127.0.0.1:8000
```

Backend disponible en:

- API: `http://127.0.0.1:8000/api/`
- Admin: `http://127.0.0.1:8000/admin/`

### 2. Frontend

Abrir otra terminal, volver a la raiz del proyecto y ejecutar:

```bash
cd frontend
npm install
npm run dev
```

Si PowerShell bloquea `npm`, usar:

```powershell
npm.cmd install
npm.cmd run dev
```

Frontend disponible en:

- `http://127.0.0.1:3000`

## Variables de entorno

La app usa por defecto esta API local:

- `http://127.0.0.1:8000/api`

Si quieren cambiarla, crear `frontend/.env.local` con:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Credenciales demo

- Admin Django
  - usuario: `admin`
  - contrasena: `admin1234`
- Inmobiliaria Premium
  - usuario: `premium-agency`
  - contrasena: `demo1234`
- Inmobiliaria Basica
  - usuario: `basic-agency`
  - contrasena: `demo1234`
- Particular
  - usuario: `particular-demo`
  - contrasena: `demo1234`

## Endpoints principales

- `GET /api/properties/`
- `GET /api/properties/{slug}/`
- `GET /api/plans/`
- `GET /api/advertisers/`
- `POST /api/auth/login/`
- `GET /api/dashboard/properties/`
- `POST /api/dashboard/properties/`

## Problemas comunes

### `python` no se reconoce

- Reinstalar Python marcando `Add python.exe to PATH`
- Cerrar y abrir la terminal despues de instalar

### `npm` no se reconoce

- Reinstalar Node.js desde la pagina oficial
- Cerrar y abrir la terminal despues de instalar

### PowerShell bloquea scripts

Si falla la activacion del entorno virtual en PowerShell, probar:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Si prefieren no cambiar esa politica, pueden usar `CMD` o ejecutar `start-backend.cmd`.

### El frontend levanta pero no trae datos

- Verificar que el backend este corriendo en `http://127.0.0.1:8000`
- Verificar que `frontend/.env.local` no apunte a otra URL

### Quiero reiniciar la base demo

Desde `backend/`:

```bash
python manage.py migrate
python manage.py seed_demo
```

## Verificacion realizada

- `python manage.py makemigrations accounts properties`
- `python manage.py migrate`
- `python manage.py seed_demo`
- `python manage.py check`
- login API validado con credenciales demo
- listado y detalle publico validados con el test client de Django
- `npm run build` ejecutado con exito en frontend

## Notas tecnicas

- Se usan URLs de imagenes mock para simplificar la demo local y evitar dependencias extra de procesamiento de archivos.
- SQLite queda lista para desarrollo local y la estructura esta preparada para migrar mas adelante a PostgreSQL.
- El portal deja claro que solo publica avisos, no intermedia operaciones y puede moderar publicaciones.

## Fuentes oficiales de descarga

- Git for Windows: `https://git-scm.com/download/win`
- Python: `https://www.python.org/downloads/`
- Node.js: `https://nodejs.org/en/download`

Referencias consultadas:

- Python downloads: `https://www.python.org/downloads/`
- Node.js downloads: `https://nodejs.org/en/download`
- Git for Windows: `https://git-scm.com/download/win`
