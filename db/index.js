　　
var mysql = require('mysql2');　
var env = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dianping'　　　　　　
};
// var env = {
//     host: '120.77.200.91',
//     user: 'root',
//     password: 'change4db',
//     database: 'dianping'　　　　　　
// };
var pool = mysql.createPool(env);

exports.do = function(sql, params, callback) {
    this.getConnection(function(err, connection) {
        connection.query(sql, params, function() {
            callback.apply(connection, arguments);
            connection.release();
        });
    })
}.bind(pool);
