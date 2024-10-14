const express = require("express");
const path = require("path");
const app = express();
const cors=require("cors");
const session=require('express-session');
const morgan=require('morgan');
const fs=require('fs');



//here first install dotenv and require them as follows in main.js so we can use them in any folders
require('dotenv').config({path:('./util/.env')});

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Do not use Secure in development (HTTP)
        httpOnly: true, // Cookie accessible only by the web server
        sameSite: 'lax' // Use 'lax' for local development; avoids cross-origin issues
        //When using SameSite=None, if you don't set Secure: true, modern browsers will block the cookie
         //to enhance security and prevent potential misuse. so when secure false use 'lax'
    }
}));

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3001', // Frontend origin
    credentials: true 
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

//to write all the log request in a file to vieww whats happening
// Create a writable stream to the access.log file
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' } // 'a' flag ensures logs are appended
  );
  
  // Use Morgan middleware for logging HTTP requests
  app.use(morgan('combined', { stream: accessLogStream }));



// Router Path
const router = require('./router/router_path');  
app.use("/user", router);

// Sequelize Database
const sequelize = require('./util/database');  
const userdb = require('./models/user');      
const expensedb=require('./models/expense');
const orderdb=require('./models/orderpremium');
const passworddb=require('./models/resetpassword');
const { Stream } = require("stream");
//establishing connection between tables
expensedb.belongsTo(userdb, {
    foreignKey: {
        allowNull: false // Ensures that every expense must be linked to a user
    },
    onDelete: 'CASCADE' // Optional: Ensures expenses are deleted if the associated user is deleted
});

userdb.hasMany(expensedb, {
    foreignKey: 'userId'
});

userdb.hasMany(orderdb);
orderdb.belongsTo(userdb);

userdb.hasMany(passworddb);
passworddb.belongsTo(userdb);

// Sync models and start the server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch(err => {
        console.log("Error during DB sync:", err);
    });


