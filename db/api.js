var db = require('./index');
const uuid = require('node-uuid');
module.exports = {
    creatMember: async({
        name,
        dpid,
        rank,
        pic
    }) => {
        var now = Date.now();
        var friend = await db.Member.create({
            id: uuid.v4(),
            name,
            dpid,
            pic,
            rank,
            createdAt: now,
            updatedAt: now,
        });
        //console.log('created: ' + JSON.stringify(friend));
    },
    creatShop: async({
        name,
        rank,
        dpid,
        url
    }) => {
        var now = Date.now();
        var shop = await db.Shop.create({
            id: uuid.v4(),
            name,
            url,
            dpid,
            rank,
            createdAt: now,
            updatedAt: now,
        });
        //console.log('created: ' + JSON.stringify(shop));
    },
    getMembers: async() => {
        return await db.Member.findAll();
    },
    getShops: async() => {
        return await db.Shop.findAll();
    }
};


// (async() => {
//     var now = Date.now();
//     var dog = await TestTask.create({
//         id: 'd-' + now,
//         name: 'Odie',
//         gender: false,
//         createdAt: now,
//         updatedAt: now,
//     });
//     console.log('created: ' + JSON.stringify(dog));
//     process.exit();
// })();