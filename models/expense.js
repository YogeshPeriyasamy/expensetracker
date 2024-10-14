const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Expense=sequelize.define("expense",{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
   
},
{
    freezeTableName: true, // This will prevent Sequelize from pluralizing the table name
    //timestamps: false // this stops crete at and updated at
})
module.exports=Expense;