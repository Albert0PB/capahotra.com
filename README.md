# capahotra.com

## Desarrollo del proyecto

### Instalación de dependencias y configuración inicial

#### Creación del proyecto RILT

```console
laravel new # crear el proyecto Laravel

npm i # instalación de los paquetes JS

npm i --save-dev @vitejs/plugin-react # instalación de React.js
npm i react-dom

composer require inertiajs/inertia-laravel # instalación de Inertia.js por la parte del servidor

php artisan inertia:middleware # creación del middleware de Inertia.js

npm i @inertiajs/react # instalación de Inertia.js por la parte del cliente

# npm i tailwindcss @tailwindcss/vite 
# con Laravel 12.x, Tailwind CSS v4 ya viene instalado, por lo que este comando no es necesario
# en Tailwind CSS v4 no se utiliza ningún archivo tailwind.config
# en su lugar, se utiliza el archivo /resources/css/app.css
```

#### Primeras configuraciones


