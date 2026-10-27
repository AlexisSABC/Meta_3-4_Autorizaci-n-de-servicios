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