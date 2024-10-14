const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false,
       
        unique: true      // Use 'unique' instead of 'isUnique'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ispremium:{
        type:Sequelize.BOOLEAN
    },
    totalspent:{
        type:Sequelize.INTEGER,
    }
});

module.exports = User;
