var db = require('./index');
const uuid = require('node-uuid');
module.exports = {
    creatMember: async({
        name,
        dpid,
        pic
    }) => {
        var now = Date.now();
        var friend = await db.Member.create({
            id: uuid.v1(),
            name,
            dpid,
            pic,
            createdAt: now,
            updatedAt: now,
        });
        console.log('created: ' + JSON.stringify(friend));
    },
    creatShop: async({
        name,
        url
    }) => {
        var now = Date.now();
        var shop = await db.Shop.create({
            id: uuid.v1(),
            name,
            url,
            createdAt: now,
            updatedAt: now,
        });
        console.log('created: ' + JSON.stringify(shop));
    },
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