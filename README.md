# execute command for required packages for project
npm install

# set value to variable inside .env file as per your system configuration
DB_CONNECTION=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=lucid
MYSQL_PASSWORD=
MYSQL_DB_NAME=lucid
APP_TITLE="Demo"
APP_URL="http://127.0.0.1:${PORT}"
APP_ASSETS_URL="${APP_URL}/appassets"
THEME_URL="${APP_ASSETS_URL}/theme"
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USERNAME=<username>
SMTP_PASSWORD=<password>
SMTP_EMAIL=""

# run below command for create database and table
node ace migration:run

# if you wat to change default data entries for some tables then
go to: database\seeders\Admin.ts file and set your value

# run below command to insert seeder values in table
node ace db:seed //For add some entries

# run command for project
node ace serve --watch

# go to web browser and execute url link below
Ex: 127.0.0.1:3333

# functionality of the project
- Signin and Signout
- forgot password
- reset password
- dashboard view

Note: Used SMTP mail integration for send password reset link while forget password. 

# For more details for deployment on production:
https://docs.adonisjs.com/guides/deployment#starting-the-production-server

  # for deployment on production
  # -- Compiling TypeScript to JavaScript
  node ace build --production

  # -- Starting the production server
  cd build
  npm ci --production

  # Start server
  node server.js

  Note: If the build step was performed in a CI/CD pipeline and you have copied only the build folder to your production server, the build directory becomes the root of your application. Then execute:
  npm ci --production

  # Start server
  node server.js


