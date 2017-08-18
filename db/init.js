const db = require('./index');

async function member_init_fun() {
    return db.Member.sync({
        force: true
    });
}

async function shop_init_fun() {
    return db.Shop.sync({
        force: true
    });
};

(async() => {
    await member_init_fun().catch(function(err) {
        console.log(err);
    });;
    await shop_init_fun().catch(function(err) {
        console.log(err);
    });
    console.log('completed');
})();