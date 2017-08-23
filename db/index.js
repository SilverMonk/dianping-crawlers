const Sequelize = require('sequelize');

const sequelize = new Sequelize('dianping', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});
const Member = sequelize.define('member', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    dpid: {
        type: Sequelize.STRING(100),
        primaryKey: true
    },
    pic: Sequelize.STRING(255),
    rank: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {});
const Shop = sequelize.define('shop', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    dpid: {
        type: Sequelize.STRING(100),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    url: Sequelize.STRING(255),
    rank: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {});

module.exports = {
    sequelize,
    Member,
    Shop
};