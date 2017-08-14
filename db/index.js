const Sequelize = require('sequelize');

var sequelize = new Sequelize('dianping', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});
var TestTask = sequelize.define('testtask', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.BIGINT,
}, {});
//TestTask.sync({force: true});
(async() => {
    var now = Date.now();
    var dog = await TestTask.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        createdAt: now,
        updatedAt: now,
    });
    console.log('created: ' + JSON.stringify(dog));
})();
// 　　
// var mysql = require('mysql2');　
// var env = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'dianping'　　　　　　
// };
// // var env = {
// //     host: '120.77.200.91',
// //     user: 'root',
// //     password: 'change4db',
// //     database: 'dianping'　　　　　　
// // };
// var pool = mysql.createPool(env);

// exports.do = function(sql, params, callback) {
//     this.getConnection(function(err, connection) {
//         connection.query(sql, params, function() {
//             callback.apply(connection, arguments);
//             connection.release();
//         });
//     })
// }.bind(pool);