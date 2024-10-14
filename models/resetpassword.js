const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Password=sequelize.define("password",{
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true, 
        
    },
 
      status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
},
{
    freezeTableName: true, // This will prevent Sequelize from pluralizing the table name
    // timestamps: false // this stops crete at and updated at
})
module.exports=Password;