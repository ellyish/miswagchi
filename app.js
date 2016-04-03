page('/signup', route.signup)

page('/stores', route.showFrontPagetoCustomer)
page('/stores/:storeid', route.showDrugStoreItemsAsList)
page('/stores/:storeid/:orderby', route.showDrugStoreItemsAsListByOrder)
page('/items', route.items)
page('/checkout', route.checkout)
page('/verification', route.verification)
page('/logout', route.logout)
page('/profile', route.profile)
page('/archive', route.archive)
page('/orders', route.orders)



page('/', route.landingPage);

page('/*', route.landingPage)
page();

function removeItem(e) {
    // e.preventDefault();
    var tmp = store.get(e.target.dataset.storename);
    var tmp = $.grep(tmp, function (evt) { return evt.itemId !== e.target.dataset.itemid; });


    alert('hello')
    store.set(e.target.dataset.storename, tmp)


    var stores = store.getAll()
    var filtredStores = [];
    for (var key in stores) {
        if (stores.hasOwnProperty(key) && !(key.match(/^Parse.*$/))) {
            filtredStores.push({ store: key, item: stores[key] })
        }
    }

    var reactive = new Ractive({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#content',

        // We could pass in a string, but for the sake of convenience
        // we're passing the ID of the <script> tag above.
        template: checkOutTemp,

        // Here, we're passing in some initial data
        data: { keys: filtredStores }
    })

}

$(document).ready(function () {
    $(".fancybox").fancybox();
});


var Items = Parse.Object.extend("Item");
var query = new Parse.Query(Items);

query.find({
    success: function (results) {



        data = {
            stores: []
        };

        idx = lunr(function () {
            this.field('comName', { boost: 10 })
            this.field('brand'),
            this.field('sciName')
        })

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {

            var object = results[i]._serverData;
            object.id = results[i].id;
            data.stores.push(object)

            idx.add(object)



        }

        console.log(object);
        // store.set("items", data)



    }
});


