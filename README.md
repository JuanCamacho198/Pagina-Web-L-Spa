**L-SPA Web**

Proyecto frontend para sitio de spa de lujo. Tecnologías: React + Vite + Firebase.

Descripción corta
- Interfaz web responsive con navegación pública/privada, autenticación (Firebase), gestión de citas, catálogo de servicios, carrito y flujo de checkout simulado.

Tecnologías
- Frontend: React, Vite
- Enrutamiento: react-router-dom
- UI/Utilidades: react-icons, react-datepicker
- Autenticación / BBDD ligera: Firebase

Características principales
- Autenticación: registro e inicio de sesión con Firebase Auth
- Gestión de citas: crear, listar y gestionar citas de usuario
- Catálogo de servicios: listado y detalles con precios
- Carrito y Checkout: flujo simulado con confirmación de pago
- Vistas responsive y componentes reutilizables

Requisitos
- Node.js 16+ recomendado (18+ recomendado para entornos modernos)
- npm, pnpm o yarn

Instalación y ejecución
1) Instalar dependencias
```
npm install
```
2) Ejecutar en desarrollo
```
npm run dev
```
3) Construir para producción
```
npm run build
```
4) Previsualizar build local
```
npm run preview
```
5) Lint
```
npm run lint
```

Configuración de Firebase y variables de entorno
- El proyecto usa Firebase; la configuración se encuentra en src/firebase/firebaseConfig.js.
- Crea un proyecto en Firebase (Auth, Firestore si aplica) y sustituye las credenciales en firebaseConfig.js.
- Opcional: usa variables de entorno prefijadas VITE_ (recomendado).
- Crea un archivo .env.local en la raíz con las claves VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID, VITE_FIREBASE_MEASUREMENT_ID. Copia de .env.example si está disponible.
- No subas .env.local al repositorio; añádelo a .gitignore.

Estructura del proyecto (relevante)
- src/(): código fuente
- src/views/: vistas principales (Home, Login, Services, Citas, Payment, etc.)
- src/views/components/: componentes reutilizables (NavBar, Footer, Cart, TimePicker, etc.)
- src/models/: modelos para datos y llamadas a Firebase
- src/controllers/: lógica de negocio
- src/firebase/firebaseConfig.js: configuración de Firebase

Contribuciones
- Respeta las instrucciones de CONTRIBUTING.md (ver guía de aportes)
- Abre issues o PRs para cambios significativos

Licencia
- MIT. Ver LICENSE en el repositorio

Autores
- Juan Camacho, Julian Galeano, Vanessa Benitez
- Contacto: abrir un issue en el repositorio o contactar al autor responsable

Guía de despliegue
- Preparar entorno con variables de entorno
- Construir y desplegar en hosting estático (Vercel, Netlify, etc.)

Notas finales
- Este readme ha sido optimizado para claridad y profesionalidad. Si necesitas, puedo adaptar el tono (más técnico, más comercial) o generar versiones en inglés.
