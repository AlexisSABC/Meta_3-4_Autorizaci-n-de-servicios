# Descripcion
Este proyecto en Node funciona como una app web local que permite registrar datos de jugadores y rosters a una base de datos,
permitiendo realizar multiples peticione HTTP por medio de un archivo de REST Client.

## Instrucciones de instalacion
Simplemente descarga todo el conjunto de archivos de este repositorio y abrelo con Visual Studio Code.
Guarda todo este proyecto dentro de una sola carpeta

Primero, dentro de "sports_webapp_backend", ejecuta los siguientes comandos:
- npm install
- npm install sequelize mysql2
- npm install --save-dev sequelize-cli

Tras esto, debes crear los siguientes elementos para poder utilizar la base de datos local con MYSQL:
- Nombre de usuario: meta32User
- Password: 123456789
- Base de datos: sportsDB

Finalmente, para poder crear las tablas y alimentar las tablas con datos previos, ejecutar lo siguiente:
- pnpx sequelize-cli db:migrate
- pnpx sequelize-cli db:seed:all

Despues, dentro de "sports_webapp_frontend": ejecuta el siguiente comando:
- npm install

## Nuevos EndPoints con ayuda de Google OAuth
Se han agregado EndPoints al backend para poder realizar validaciones con ayuda de googleOAuth
- GET /auth/google/login = Inicia el flujo OAuth y devuelve o redirige a la URL de autorización de Google.
- GET /auth/google/callback = Procesa el código devuelto por Google, autentica/registra el usuario y emite la sesión JWT/CSRF.
- POST /api/v1/auth/logout = Cierra la sesión activa y destruye las cookies.
= GET /api/v1/auth/verify = Verifica la validez del token activo y el rol asignado.

## Crear certificados SSL
Para poder crear los certificados SSL y poder ejecutar este proyecto web, debes realizar lo siguiente:
- Mover el archivo "openssl.cnf" a tu carpeta "C:\Program Files\OpenSSL-Win64\bin".
- Ejecutar el siguiente comando: openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -days 365 -subj "/C=MX/ST=Estado/L=Ciudad/O=MiEmpresa/CN=localhost" -config "C:\Program Files\OpenSSL-Win64\bin\openssl.cnf"
- En "sports_webapp_backend" crear la carpeta "cert".
- Mover los archivos generados "server.crt" y "server.key" a la carpeta "cert".

## Credenciales Google OAuth
Para poder ejecutar correctamente este proyecto, debes realizar lo siguiente en la carpeta "sports_webapp_backend".
- Generar tus credenciales "ID de cliente de OAuth", esto te generara una ID de cliente y un Cliente Secreto.
- Dentro del archivo ".end", reemplazar "a" de "GOOGLE_CLIENT_ID" y de "GOOGLE_CLIENT_SECRET" por las credencias generadas.

## Instrucciones de ejecucion
Para poder ejecutar esta app web, debes ejecutar los siguientes dos comandos desde el directorio raiz:
- npm --prefix ./sports_webapp_backend run dev
- npm --prefix ./sports_webapp_frontend run dev

Ya ejecutados ambos comandos, somalente entra al siguiente enlace y explora la aplicacion web:
- http://localhost:5173/login

No necesitas ingresar mas credenciales que las que ya se establecen por defecto.

## Documentacion Swagger
Para acceder a la documentacion de esta app web, puede utilizar el siguiente enlace local al momento de estar 
ejecutando al app web
- http://localhost:3000/docs