# Mini Food App

This app was built using the express module.
In this project I made a recipe app which basically allows the users of the app to post food. Users of the app are required to register and login to post the foods along with their ingredients, instruction and image. This app has a search facility which visitors of the website can view the recipes by the ingredients specified. The admin of the website has its own route to take control of the posted food, the user which created it, the food's image and delete the recipies. This app uses sequelize for the user model, MySQl database for the users table,local storage for storing the recipes and sessions to keep track of the users. The authentication was done through Passport.js tool. Images were uploaded using multer node package module. Flash messages were used to notify the users whether they have logged in or logged out. The login session is terminated when the user logs out.

Below are the snapshots of the project.
![Mini Food App](Assets/miniFoodApp.PNG)

#
Admin route
![Mini Food App](Assets/miniFoodApp2.PNG)

## Instructions

* Install MySQL server.
* Create your desired database in MySQL server.
* In the config.json file in the config folder of the app, specify the database you have created in the development mode.
* Install the Node.js dependencies by using the "npm install" command and run the Node.js app.
* The users table will be created in the database and the app starts.
* Make sure you are connected to MySQL database when running the app.

## Usage
This app provides the visitors with the recipes posted by different users and to search them by ingredients.

## Tests
This app was tested manually.

## Future
More features such as updating the recipies and making validations for the users data will be added in future.