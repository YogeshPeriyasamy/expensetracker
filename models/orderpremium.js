const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Order=sequelize.define("order",{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
    },
    orderid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    paymentid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
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
module.exports=Order;