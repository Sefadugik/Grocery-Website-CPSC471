const { rejects } = require('assert');
const { error } = require('console');
const mysql = require('mysql');
const { resolve } = require('path');

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sunny3489$",
    database: "GROCERY_STORE"
});

function makeOrder(params) {
    
    const managerID = params.mgrID;
    const supplierID = params.supID;
    const items = params.items;

    const queryChecking = new Promise((resolve, reject) => {
        dbConnection.connect((err) => {
            if(err) reject(err);
            
            // add to Orders
            const orderSQL = `INSERT INTO ORDERS (mgrID, supID) VALUES ('${managerID}', '${supplierID}')`;
            dbConnection.query(orderSQL, (error, result) => {
                if(error) throw error;

                var orderID;
                orderID = result.insertId;

                // add list of items to order 
                for (var i = 0; i < items.length; i++) {
                    const orderItemSQL = `INSERT INTO ORDER_ITEMS (orderID, itemID) VALUES (${orderID}, '${items[i]}')`;
                    dbConnection.query(orderItemSQL, (error, result) => {
                        if(error) throw error;
                    });
                }
                dbConnection.end();
            });
            resolve();
        });

    });
        
}

function getAllOrders() {
    const queryChecking = new Promise((resolve, reject) => {
        dbConnection.connect((err) => {
            if(err) reject(err);

            var orderInfo;

            const getOrdersSQL = `
                SELECT ORDERS.*, GROUP_CONCAT(ORDER_ITEMS.itemID) AS itemIDs
                FROM ORDERS
                LEFT JOIN ORDER_ITEMS ON ORDERS.orderID = ORDER_ITEMS.orderID
                GROUP BY ORDERS.orderID`;

            dbConnection.query(getOrdersSQL, (error, result) => {
                if(error) throw error;
                console.log(result);
                orderInfo = result;
            });
        });
    });

}

/*
test = {
    mgrID: 'bPX1xJtKFzD5P5o5LzZt',
    supID: 1,
    items: [1,2,3]
}
makeOrder(test);
*/

getAllOrders();

return;
module.exports = {
    makeOrder
};