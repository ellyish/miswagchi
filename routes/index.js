/* global Hogan */
/* global page */
/* global Parse */
(function () {
    // private api from

    var cache = {};

    function get(url, cb) {
        if (cache[url]) return cb(cache[url]);
        $.ajax({
            url: url,
            success: function (data) {
                cache[url] = data;
                cb(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            },
            dataType: 'text'
        });
    }


    var btnloader = "";
    btnloader += "  <div class=\"preloader-wrapper small active\">";
    btnloader += "    <div class=\"spinner-layer spinner-green-only\">";
    btnloader += "      <div class=\"circle-clipper left\">";
    btnloader += "        <div class=\"circle\"><\/div>";
    btnloader += "      <\/div><div class=\"gap-patch\">";
    btnloader += "        <div class=\"circle\"><\/div>";
    btnloader += "      <\/div><div class=\"circle-clipper right\">";
    btnloader += "        <div class=\"circle\"><\/div>";
    btnloader += "      <\/div>";
    btnloader += "    <\/div>";
    btnloader += "  <\/div>";
    btnloader += "";


    function addToCart(e) {
        e.preventDefault();
        if (store.get(e.target.dataset.storename) != undefined) {

            //search if the same item being added before if its

            var tmp = store.get(e.target.dataset.storename);

            var exist = $.grep(tmp, function (evt) {
                return evt.itemId == e.target.dataset.itemid;
            });

            if (exist.length == 0) {
                //if its not existed add it to the cart
                tmp.push({
                    itemId: e.target.dataset.itemid,
                    itemBrand: e.target.dataset.brand,
                    itemImg: e.target.dataset.img,
                    itemSciName: e.target.dataset.itemsciname,
                    itemComName: e.target.dataset.itemcomname,
                    itemPrice: e.target.dataset.priceperunit,
                    itemTotalPrice: e.target.dataset.itemtotalprice,
                    itemQuantity: e.target.dataset.itemquantity,
                    itemBonus: e.target.dataset.bonus,
                    itemPackage: e.target.dataset.package,
                    customerId: Parse.User._currentUser.id,
                    customerName: Parse.User._currentUser._serverData.username,
                })
                Materialize.toast('<pre style="font-family: ge-ss">تم اظافة المادة الى السلة</pre>', 2000) // 4000 is the duration of the toast


            } else if (exist.length == 1) {

                console.log(exist);

                exist[0].itemQuantity = parseInt(exist[0].itemQuantity) + parseInt(e.target.dataset.itemquantity);
                exist[0].itemTotalPrice = parseFloat(exist[0].itemPrice) * parseInt(exist[0].itemQuantity);

                console.log(exist);

                Materialize.toast('<pre style="font-family: ge-ss">المادة موجودة في السلة , تم تحديث الكمية</pre>', 2000) // 4000 is the duration of the toast

            } else {
                console.log("multiple existed");
                // multiple items found
            }



            store.set(e.target.dataset.storename, tmp)

        } else {

            var tmp = [];
            tmp.push({
                itemId: e.target.dataset.itemid,
                itemBrand: e.target.dataset.brand,
                itemImg: e.target.dataset.img,
                itemSciName: e.target.dataset.itemsciname,
                itemComName: e.target.dataset.itemcomname,
                itemPrice: e.target.dataset.priceperunit,
                itemTotalPrice: e.target.dataset.itemtotalprice,
                itemQuantity: e.target.dataset.itemquantity,
                itemBonus: e.target.dataset.bonus,
                itemPackage: e.target.dataset.package,
                customerName: Parse.User._currentUser.id,
                customerId: Parse.User._currentUser._serverData.username,

            })

            store.set(e.target.dataset.storename, tmp)
            Materialize.toast('<pre style="font-family: ge-ss">تم اظافة المادة الى السلة</pre>', 2000) // 4000 is the duration of the toast

        };



    }




    $("#search-bar input").keyup(function () {

        setTimeout(function () {
            var results = idx.search($("#search-bar input").val()).map(function (result) {
                return data.stores.filter(function (q) {
                    return q.id === result.ref
                })[0]
            })

            console.log(results);

            if (results.length == 0) {
                $('#content').empty().append(noresultTemp);
            } else {
                var resultObj = {}
                resultObj.stores = results
                var ractive = new Ractive({
                    // The `el` option can be a node, an ID, or a CSS selector.
                    el: '#content',

                    // We could pass in a string, but for the sake of convenience
                    // we're passing the ID of the <script> tag above.
                    template: searchTemp,

                    // Here, we're passing in some initial data
                    data: resultObj
                });

            };

            $(".add-to-cart").click(addToCart)


        }, 500)




    })


    var loadingTemp = "";
    loadingTemp += "<div class=\"container center\" style=\"margin-top:200px\">";
    loadingTemp += "    <div class=\"preloader-wrapper big active \">";
    loadingTemp += "    <div class=\"spinner-layer spinner-blue-only\">";
    loadingTemp += "      <div class=\"circle-clipper left\">";
    loadingTemp += "        <div class=\"circle\"><\/div>";
    loadingTemp += "      <\/div><div class=\"gap-patch\">";
    loadingTemp += "        <div class=\"circle\"><\/div>";
    loadingTemp += "      <\/div><div class=\"circle-clipper right\">";
    loadingTemp += "        <div class=\"circle\"><\/div>";
    loadingTemp += "      <\/div>";
    loadingTemp += "    <\/div>";
    loadingTemp += "  <\/div>";
    loadingTemp += "<\/div>";


    var searchTemp = "";
    searchTemp += "<div class=\"container\" style=\"text-align:left;margin-top:70px;\">";
    searchTemp += "  <ul class=\"collection\">";
    searchTemp += "      {{#stores}}";
    searchTemp += "      <li class=\"collection-item avatar\">";
    searchTemp += "          <a href=\"{{img._url}}\" class=\"fancybox\" style=\"position: absolute; left: 0px;\">";
    searchTemp += "                <img src=\"{{img._url}}\" alt=\"\" class=\"circle\">";
    searchTemp += "            <\/a>";
    searchTemp += "          <span class=\"title\">{{brand}} {{comName}}<\/span>";
    searchTemp += "          <p style=\"font-size: 12px; line-height: 14px;\">{{sciName}}<\/p>";
    searchTemp += "               <span class=\"item-badge\">{{storeName}}<\/span> ";
    searchTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Package: {{sheetPerPack}}x{{tabletPerSheet}} <\/span>";
    searchTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Bonus: {{bonus}}<\/span>";
    searchTemp += "          <a ";
    searchTemp += "          data-itemid=\"{{id}}\" data-itemcomname=\"{{comName}}\" data-itemsciname=\"{{sciName}}\" data-brand=\"{{brand}}\"";
    searchTemp += "            data-bonus=\"{{bonus}}\" data-priceperunit=\"{{price}}\" data-package=\"{{sheetPerPack}}x{{tabletPerSheet}}\"";
    searchTemp += "          data-img=\"{{img._url}}\"  data-storename=\"{{storeName}}\" data-itemtotalprice=\"{{price * min}}\" data-itemquantity=\"{{min}}\" ";
    searchTemp += "          href=\"addToCart\" class=\"add-to-cart secondary-content\" ";
    searchTemp += "          style=\"color:#03A9F4; right:10px; top:58px; font-size:14px\">اضافة الى السلة<\/a>";
    searchTemp += "            ";
    searchTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:35px; font-family: work sans; font-size:20px; width: 105px; text-align: right;\">{{Math.round(price * min * 100) / 100}}$<\/span>            ";
    searchTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:13px; font-family: work sans; font-size:16px\">x {{price}}$<\/span>";
    searchTemp += "            <span  class=\"secondary-content\" style=\"color:#03A9F4; right:73px; top:11px; font-family: work sans; font-size:20px\">";
    searchTemp += "                <input  min=\"1\" max=\"{{max}}\" value=\"{{min}}\" style=\"padding-left: 5px; font-size:16px; width: 40px; height: 23px;  border: 1px solid; background: #f3f3f3;\" type=\"number\">";
    searchTemp += "            <\/span>      ";
    searchTemp += "      <\/li>";
    searchTemp += "      {{\/stores}}";
    searchTemp += "";
    searchTemp += "";
    searchTemp += "<\/div>";
    searchTemp += "<div class=\"fixed-action-btn\"  style=\"bottom: 45px; left: 24px; right:auto;\">";
    // searchTemp += "<span class=\"items-count\">٣٣ مادة";
    // searchTemp += "<\/span>";
    searchTemp += " <a class=\"btn-floating btn-large accent-color\" href=\"\/checkout\">";
    searchTemp += "     <i class=\"large material-icons \">shopping_cart<\/i>";
    searchTemp += " <\/a>";
    searchTemp += "<\/div>";

    var noconnectionTemp = "";
    noconnectionTemp += "<div class=\"container center\" style=\"margin-top:200px\">";
    noconnectionTemp += "  <div>";
    noconnectionTemp += "تاكد من اتصالك بالانترنت ثم ";
    noconnectionTemp += "<a href=\"\/store\">أعد تحميل الصفحة</a>";
    noconnectionTemp += "  <\/div>";
    noconnectionTemp += "<\/div>";

    var profileTemp = "";
    profileTemp += "<div class=\"animated fadeIn container center\" style=\"margin-top:200px\">";
    profileTemp += "  <div>";
    profileTemp += "قريبا سيتم اظافة هذه الميزة";
    profileTemp += "  <\/div>";
    profileTemp += "<\/div>";


    var noresultTemp = "";
    noresultTemp += "<div class=\" container center\" style=\"margin-top:200px\">";
    noresultTemp += "  <div >";
    noresultTemp += " لا توجد نتائج ";
    noresultTemp += "  <\/div>";
    noresultTemp += "<\/div>";


    var storesTemp = "";
    storesTemp += "<div class=\"animated fadeIn container \" style=\"margin-top:70px;\">";
    storesTemp += "";
    storesTemp += " <div class=\"row\">";
    storesTemp += "";
    storesTemp += "     {{#stores}}";
    storesTemp += "     <div class=\"col l4 m4 s12\">";
    storesTemp += "         <a href=\"\/stores\/{{id}}\">";
    storesTemp += "";
    storesTemp += "             <div class=\"store-card default-primary-color\">";
    storesTemp += "                 <div class=\"store-card-title\">";
    storesTemp += "                     {{username}}";
    storesTemp += "                 <\/div>";
    storesTemp += "                 <div class=\"store-card-address\">";
    storesTemp += "                     {{addressLine1}} <br> {{addressLine2}}";
    storesTemp += "                 <\/div>";
    storesTemp += "             <\/div>";
    storesTemp += "         <\/a>";
    storesTemp += "     <\/div>";
    storesTemp += "     {{\/stores}}";
    storesTemp += "";
    storesTemp += "";
    storesTemp += " <\/div>";
    storesTemp += "<\/div>";
    storesTemp += "";
    storesTemp += "<div class=\"fixed-action-btn\" style=\"bottom: 45px; left: 24px; right:auto;\">";
    // storesTemp += "<span class=\"items-count\">٣٣ مادة";
    // storesTemp += "<\/span>";
    storesTemp += "  <a class=\"btn-floating btn-large\" href=\"\/checkout\">";
    storesTemp += "      <i class=\"large material-icons accent-color\">shopping_cart<\/i>";
    storesTemp += "  <\/a>";
    storesTemp += "<\/div>";
    storesTemp += "";

    var checkOutTemp = "";
    checkOutTemp += "<div class=\"container \" style=\"text-align:left;margin-top:70px;\">";
    checkOutTemp += "   {{#if keys.length == 0}}";
    checkOutTemp += "       <div class='animated fadeIn' style=\"text-align:center; margin-top:200px\">السلة فارغة للتسوق ارجع الى النافذة الرئيسية واختر المذخر الذي ترغب التسوق منه<\/div>";
    checkOutTemp += "   {{/if}}";
    checkOutTemp += "";
    checkOutTemp += "       {{#keys:num1}}";
    checkOutTemp += "      <span class=\"store{{num1}}\">";
    checkOutTemp += "      <p >{{store}}<\/p>";
    checkOutTemp += "   <ul class=\"collection\">";
    checkOutTemp += "       {{#item:num2}}";
    checkOutTemp += "       <li class=\"collection-item avatar\">";
    checkOutTemp += "           <img src=\"{{itemImg}}\" alt=\"\" class=\"circle\">";
    checkOutTemp += "           <span class=\"title\">{{itemBrand}} {{itemComName}}<\/span>";
    checkOutTemp += "           <p style=\"font-size: 12px; line-height: 14px;\">{{itemSciName}}</p>";
    checkOutTemp += "              <span class=\"item-badge\">{{store}}<\/span>";
    checkOutTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Package: {{itemPackage}}<\/span>";
    checkOutTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Bonus: {{itemBonus}}<\/span>";
    checkOutTemp += "           <a  href=\"\" class=\" secondary-content\" style=\"color:#03A9F4; font-size:20px\"><i data-storename=\"{{store}}\" data-itemid=\"{{itemId}}\" data-itemnum=\"{{num2}}\" data-storenum=\"{{num1}}\"   class=\"remove-item material-icons\">close<\/i><\/a>";
    checkOutTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:45px; top:35px; font-family: work sans; font-size:20px; width: 105px; text-align: right;\">{{Math.round(itemTotalPrice * 100) / 100}}$<\/span>";
    checkOutTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:45px; top:13px; font-family: work sans; font-size:16px\">{{itemQuantity}} x {{itemPrice}}$<\/span>";
    checkOutTemp += "           ";
    checkOutTemp += "       <\/li>";
    checkOutTemp += "       {{\/item}}";
    checkOutTemp += "   <\/ul>";
    checkOutTemp += "       <button  class=\"btn confirm-order\" data-storeid=\"{{storeid}}\" data-storename=\"{{store}}\" data-storenum=\"{{num1}}\" style=\"margin-bottom:20px;\" >تاكيد الطلب<\/button>";
    checkOutTemp += "       <button  class=\"btn cancel-order\" data-storename=\"{{store}}\" data-storenum=\"{{num1}}\" style=\"margin-bottom:20px;\" >الغاء<\/button>";
    checkOutTemp += "<\/span>";
    checkOutTemp += "       {{\/keys}}";
    checkOutTemp += "<\/div>";
    checkOutTemp += "<div class=\"fixed-action-btn\" style=\"bottom: 45px; left: 24px; right:auto;\">";
    checkOutTemp += " <a class=\"btn-floating btn-large accent-color\" href=\"\/\">";
    checkOutTemp += "     <i class=\"large material-icons \">home<\/i>";
    checkOutTemp += " <\/a>";
    checkOutTemp += "<\/div>";

    var archiveTemp = "";
    archiveTemp += "<div class=\"container \" style=\"text-align:left;margin-top:70px;\">";
    archiveTemp += "   {{#if bags.bags.length == 0}}";
    archiveTemp += "       <div class='animated fadeIn' style=\"text-align:center; margin-top:200px\">لا توجد طلبيات في الارشيف<\/div>";
    archiveTemp += "   {{/if}}";
    archiveTemp += "";
    archiveTemp += "       {{#bags.bags:num1}}";
    archiveTemp += "      <div class=\"store{{num1}} z-depth-1\" style='margin-bottom: 20px; padding: 15px; border-radius: 7px; border: 1px solid rgba(96, 125, 139, 0.48);'>";
    archiveTemp += "      <p class='left' style='text-align: left; font-family:work sans, ge-ss;'>{{200}}$ : المجموع <\/p>";
    archiveTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>من مذخر : {{storeName}} <\/p>";
    archiveTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>بتأريخ : {{createdAt}}  <\/p>";

    archiveTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>{{id}} : الرقم المميز <\/p>";
    archiveTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>الدفع : {{pay}} دفعت <\/p>";
    archiveTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>التجهيز : {{delivered}} تم <\/p>";
    archiveTemp += "   <ul class=\"collection\">";
    archiveTemp += "       {{#bag:num2}}";
    archiveTemp += "       <li class=\"collection-item avatar\">";
    archiveTemp += "           <img src=\"{{itemImg}}\" alt=\"\" class=\"circle\">";
    archiveTemp += "           <span class=\"title\">{{itemBrand}} {{itemComName}}<\/span>";
    archiveTemp += "           <p style=\"font-size: 12px; line-height: 14px;\">{{itemSciName}}</p>";
    archiveTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Package: {{itemPackage}}<\/span>";
    archiveTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Bonus: {{itemBonus}}<\/span>";
    archiveTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:35px; font-family: work sans; font-size:20px; width: 105px; text-align: right;\">{{Math.round(itemTotalPrice * 100) / 100}}$<\/span>";
    archiveTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:10px; font-family: work sans; font-size:16px\">{{itemQuantity}} x {{itemPrice}}$<\/span>";
    archiveTemp += "           ";
    archiveTemp += "       <\/li>";
    archiveTemp += "       {{\/bag}}";
    archiveTemp += "   <\/ul>";
    archiveTemp += "<\/div>";
    archiveTemp += "       {{\/bags.bags}}";
    archiveTemp += "<\/div>";
    archiveTemp += "<div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">";
    archiveTemp += " <a class=\"btn-floating btn-large accent-color\" href=\"\/\">";
    archiveTemp += "     <i class=\"large material-icons \">home<\/i>";
    archiveTemp += " <\/a>";
    archiveTemp += "<\/div>";


    var ordersTemp = "";
    ordersTemp += "<div class=\"container \" style=\"text-align:left;margin-top:70px;\">";
    ordersTemp += "   {{#if bags.bags.length == 0}}";
    ordersTemp += "       <div class='animated fadeIn' style=\"text-align:center; margin-top:200px\">لا توجد طلبيات في الارشيف<\/div>";
    ordersTemp += "   {{/if}}";
    ordersTemp += "";
    ordersTemp += "       {{#bags.bags:num1}}";
    ordersTemp += "      <div class=\"store{{num1}}\" style='margin-bottom: 40px; padding: 15px; border-radius: 7px; border: 1px solid rgba(96, 125, 139, 0.48);'>>";
    ordersTemp += "      <p class='left' style='text-align: left; font-family:work sans, ge-ss;'>{{200}}$ : المجموع <\/p>";
    ordersTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>اسم الصيدلية : {{pharmaName}}<\/p>";
    ordersTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>بتأريخ : {{createdAt}}  <\/p>";
    ordersTemp += "      <p style='text-align: right; font-family:work sans, ge-ss;'>{{id}} : الرقم المميز <\/p>";
    ordersTemp += "   <ul class=\"collection\">";
    ordersTemp += "       {{#bag:num2}}";
    ordersTemp += "       <li class=\"collection-item avatar\">";
    ordersTemp += "           <img src=\"{{itemImg}}\" alt=\"\" class=\"circle\">";
    ordersTemp += "           <span class=\"title\">{{itemBrand}} {{itemComName}}<\/span>";
    ordersTemp += "           <p style=\"font-size: 12px; line-height: 14px;\">{{itemSciName}}</p>";
    ordersTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Package: {{itemPackage}}<\/span>";
    ordersTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Bonus: {{itemBonus}}<\/span>";
    ordersTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:35px; font-family: work sans; font-size:20px; width: 105px; text-align: right;\">{{Math.round(itemTotalPrice * 100) / 100}}$<\/span>";
    ordersTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:13px; font-family: work sans; font-size:16px\">{{itemQuantity}} x {{itemPrice}}$<\/span>";
    ordersTemp += "           ";
    ordersTemp += "       <\/li>";
    ordersTemp += "       {{\/bag}}";
    ordersTemp += "   <\/ul>";
    ordersTemp += "<div class=\"row\">";
    ordersTemp += " <div class=\"col s2\">";
    ordersTemp += "         <button  class=\"btn\" >طباعة القائمة<\/button>";
    ordersTemp += " <\/div>";
    ordersTemp += " <div class=\"col s2\">";
    ordersTemp += "         <input type=\"checkbox\" id=\"s1\" \/>";
    ordersTemp += "        <label for=\"s1\">استحصلت<\/label>";
    ordersTemp += " <\/div>";
    ordersTemp += " <div class=\"col s2\">";
    ordersTemp += "              <input type=\"checkbox\" id=\"s2\" \/>";
    ordersTemp += "        <label for=\"s2\">جهزت<\/label>";
    ordersTemp += "";
    ordersTemp += " <\/div>";
    ordersTemp += "<\/div>";
    ordersTemp += "<\/div>";
    ordersTemp += "       {{\/bags.bags}}";
    ordersTemp += "<\/div>";
    ordersTemp += "<div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">";
    ordersTemp += " <a class=\"btn-floating btn-large accent-color\" href=\"\/\">";
    ordersTemp += "     <i class=\"large material-icons \">home<\/i>";
    ordersTemp += " <\/a>";
    ordersTemp += "<\/div>";




    var itemsTemp = "";
    itemsTemp += "<div class=\"container\" style=\"text-align:left;margin-top:70px;\">";
    itemsTemp += "  <div class=\"row\">";
    itemsTemp += "      <div class=\"col s4\" style=\"text-align: left;\">";
    itemsTemp += "          {{storeName}}";
    itemsTemp += "      <\/div>";
    itemsTemp += "      <div class=\"col s8\" style=\"text-align: right;\">";
    itemsTemp += "          رتب المنتجات حسب : <a href=\"\\stores\\{{storeId}}\\alphabet\">الاسم<\/a> | <a href=\"\\stores\\{{storeId}}\\price\">السعر<\/a>";
    itemsTemp += "      <\/div>";
    itemsTemp += "  <\/div>";
    itemsTemp += "";
    itemsTemp += "  <ul class=\"collection\">";
    itemsTemp += "      {{#stores}}";
    itemsTemp += "      <li class=\"collection-item avatar\">";
    itemsTemp += "          <a href=\"{{img._url}}\" class=\"fancybox\" style=\"position: absolute; left: 0px;\">";
    itemsTemp += "                <img src=\"{{img._url}}\" alt=\"\" class=\"circle\">";
    itemsTemp += "            <\/a>";
    itemsTemp += "          <span class=\"title\">{{brand}} {{comName}}<\/span>";
    itemsTemp += "          <p style=\"font-size: 12px; line-height: 14px;\">{{sciName}}<\/p>";
    itemsTemp += "              <!-- <span class=\"item-badge\">{{storeName}}<\/span> -->";
    itemsTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Package: {{sheetPerPack}}x{{tabletPerSheet}} <\/span>";
    itemsTemp += "              <span class=\"item-badge\" style=\"font-family: work sans;\">Bonus: {{bonus}}<\/span>";
    itemsTemp += "          <a ";
    itemsTemp += "          data-itemid=\"{{id}}\" data-itemcomname=\"{{comName}}\" data-itemsciname=\"{{sciName}}\" data-brand=\"{{brand}}\"";
    itemsTemp += "            data-bonus=\"{{bonus}}\" data-priceperunit=\"{{price}}\" data-package=\"{{sheetPerPack}}x{{tabletPerSheet}}\"";
    itemsTemp += "          data-img=\"{{img._url}}\"  data-storename=\"{{storeName}}\" data-itemtotalprice=\"{{price * min}}\" data-itemquantity=\"{{min}}\" ";
    itemsTemp += "          href=\"addToCart\" class=\"add-to-cart secondary-content\" ";
    itemsTemp += "          style=\"color:#03A9F4; right:10px; top:58px; font-size:14px\">اضافة الى السلة<\/a>";
    itemsTemp += "            ";
    itemsTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:35px; font-family: work sans; font-size:20px; width: 105px; text-align: right;\">{{Math.round(price * min * 100) / 100}}$<\/span>            ";
    itemsTemp += "          <span  class=\"secondary-content\" style=\"color:#03A9F4; right:10px; top:13px; font-family: work sans; font-size:16px\">x {{price}}$<\/span>";
    itemsTemp += "            <span  class=\"secondary-content\" style=\"color:#03A9F4; right:58px; top:12px; font-family: work sans; font-size:20px\">";
    itemsTemp += "                <input min=\"1\" max=\"{{max}}\" value=\"{{min}}\" style=\"padding-left: 5px; font-size:16px; width: 40px; height: 23px;  border: 1px solid; background: #f3f3f3;\" type=\"number\">";
    itemsTemp += "            <\/span>      ";
    itemsTemp += "      <\/li>";
    itemsTemp += "      {{\/stores}}";
    itemsTemp += "";
    itemsTemp += "  <\/ul>";
    itemsTemp += "";
    // itemsTemp += "  <div class=\"container\">";
    // itemsTemp += "      <div class=\"center\">تحميل اكثر<\/div>";
    // itemsTemp += "  <\/div>";
    itemsTemp += "";
    itemsTemp += "<\/div>";
    itemsTemp += "<div class=\"fixed-action-btn\" style=\"bottom: 45px; left: 24px; right:auto;\">";
    // itemsTemp += "<span class=\"items-count\">٣٣ مادة";
    // itemsTemp += "<\/span>";
    itemsTemp += "  <a class=\"btn-floating btn-large\" href=\"\/checkout\">";
    itemsTemp += "      <i class=\"large material-icons accent-color\">shopping_cart<\/i>";
    itemsTemp += "  <\/a>";
    itemsTemp += "<\/div>";
    itemsTemp += "";
    // itemsTemp += "  <ul class=\"pagination center\">";
    // itemsTemp += "    <li class=\"disabled\"><a href=\"#!\"><i class=\"material-icons\">chevron_left<\/i><\/a><\/li>";
    // itemsTemp += "    <li class=\"active\"><a href=\"#!\">1<\/a><\/li>";
    // itemsTemp += "    <li class=\"waves-effect\"><a href=\"#!\">2<\/a><\/li>";
    // itemsTemp += "    <li class=\"waves-effect\"><a href=\"#!\">3<\/a><\/li>";
    // itemsTemp += "    <li class=\"waves-effect\"><a href=\"#!\">4<\/a><\/li>";
    // itemsTemp += "    <li class=\"waves-effect\"><a href=\"#!\">5<\/a><\/li>";
    // itemsTemp += "    <li class=\"waves-effect\"><a href=\"#!\"><i class=\"material-icons\">chevron_right<\/i><\/a><\/li>";
    // itemsTemp += "  <\/ul>";
    // itemsTemp += "";


    var navmenuTempStores = "";
    navmenuTempStores += "<li class=\"left\"><a href=\"\\logout\"><i class=\"material-icons\">power_settings_new<\/i><\/a><\/li>";
    navmenuTempStores += "<li id=\"archive-btn\" class=\"left\"><a href=\"\\orders\"><i class=\"material-icons\">receipt<\/i><\/a><\/li>";
    navmenuTempStores += "";

    var navmenuTempCustomers = "";
    navmenuTempCustomers += "<li class=\"left\"><a href=\"\\logout\"><i class=\"material-icons\">power_settings_new<\/i><\/a><\/li>";
    navmenuTempCustomers += "<li id=\"archive-btn\" class=\"left\"><a href=\"\\archive\"><i class=\"material-icons\">archive<\/i><\/a><\/li>";
    navmenuTempCustomers += "<li id=\"search-btn\" class=\"left\"><a href=\"\\search\"><i class=\"material-icons\">search<\/i><\/a><\/li>";
    navmenuTempCustomers += "";

    var landingPageTemp = "";
    landingPageTemp += "<div class=\"cover default-primary-color text-primary-color\">";
    landingPageTemp += "    <!-- <img src=\"img\/cover.png\" alt=\"\"\/> -->";
    landingPageTemp += "    <div class=\"container\">";
    landingPageTemp += "        <div class=\"row\" style=\"padding-top:17%;\">";
    landingPageTemp += "            <div class=\"col l5 m6 s12 z-depth-1  signup-form accent-color\">";
    landingPageTemp += "                <p id=\"login-message\" class=\"center\" style=\"font-size:20px; margin:10px;\">قم بتسجيل الدخول حتى تبدأ بالتسوق<\/p>";
    landingPageTemp += "                <p style=\"text-align: center; margin:10px;\"><input id=\"name\" placeholder=\"اسم الصيدلية\" type=\"text\"><\/p>";
    landingPageTemp += "                <p style=\"text-align: center; margin:10px;\"><input id=\"password\" placeholder=\"رمز الدخول\" type=\"password\"><\/p>";
    landingPageTemp += "                <a class=\"signup-btn\">ابدأ بالتسوق <\/a>";
    landingPageTemp += "                <p style=\"text-align: center; margin:20px 0px 10px 0px;\">اذا ما عندك حساب <a style=\"color:#3140A1\" href=\"\/signup\">سجل بمسوكجي<\/a><\/p>";
    landingPageTemp += "            <\/div>";
    landingPageTemp += "            <div class=\"col l7 m6 s12 \" style=\"text-align:right;\">";
    landingPageTemp += "                <h1 style=\"color:white;\" style=\"font-family:'ghala-bold' !important;\">مسوكچي<\/h1>";
    landingPageTemp += "                <h3 style=\"color:#C5CAE9;\">كمل نقوصات صيدليتك من موبايلك<\/h3>";
    landingPageTemp += "                <h5 style=\"color:#C5CAE9;\">دور وتسوق من المذاخر بدون تعب والتوصيل مجاني<\/h5>";
    landingPageTemp += "            <\/div>";
    landingPageTemp += "        <\/div>";
    landingPageTemp += "    <\/div>";
    landingPageTemp += "<\/div>";
    landingPageTemp += "<div class=\"container\">";
    landingPageTemp += "    <div class=\"row\" style=\"text-align:right; min-height:240px;\">";
    landingPageTemp += "        <div class=\"col l6 s12 \">";
    landingPageTemp += "            <h4 style=\"text-align:right; margin-top:40px;\">للصيدليات<\/h4>";
    landingPageTemp += "            <ul style=\"font-size:16px;\">";
    landingPageTemp += "                <li>تصفح جميع المواد الموجودة في مذاخر بغداد •<\/li>";
    landingPageTemp += "                <li>بحث سهل وسريع بالاسم التجاري او العلمي عن المواد المفقودة •<\/li>";
    landingPageTemp += "                <li>اطلب المواد في اي وقت مع ميزة التوصيل السريع والمجاني •<\/li>";
    landingPageTemp += "                <li>ابقى مطلعا على اخر العروض •<\/li>";
    landingPageTemp += "            <\/ul>";
    landingPageTemp += "        <\/div>";
    landingPageTemp += "        <div class=\"col l6 s12\">";
    landingPageTemp += "            <h4 style=\"text-align:right; margin-top:40px;\">للمذاخر<\/h4>";
    landingPageTemp += "            <ul style=\"font-size:16px;\">";
    landingPageTemp += "                <li>حساب لكل مذخر يقوم بعرض المواد التي يرغب بها •<\/li>";
    landingPageTemp += "                <li>ادراة للطلبات توفر عليك مشاكل اخذ الاوردرات بالهاتف او الفايبر •  <\/li>";
    landingPageTemp += "                <li>تحليل فوري واحصائات عن عمليات البيع وكمية الربح •<\/li>";
    landingPageTemp += "                <li>ارسال العروض عن طريق اشعارات الهاتف •<\/li>";
    landingPageTemp += "            <\/ul>";
    landingPageTemp += "        <\/div>";
    landingPageTemp += "    <\/div>";
    landingPageTemp += "<\/div>";
    landingPageTemp += "<footer class=\"page-footer\" style=\"text-align: left;\">";
    landingPageTemp += "    <div class=\"container\">";
    landingPageTemp += "        <div class=\"row\">";
    landingPageTemp += "            <div class=\"col s12\">";
    landingPageTemp += "                <h5 class=\"white-text\">اتصل بنا<\/h5>";
    landingPageTemp += "                <ul>";
    landingPageTemp += "                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">facebook<\/a><\/li>";
    landingPageTemp += "                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">+9647722250042<\/a><\/li>";
    landingPageTemp += "                    <li><a class=\"grey-text text-lighten-3\" href=\"#!\">بغداد - الجادرية<\/a><\/li>";
    landingPageTemp += "                <\/ul>";
    landingPageTemp += "            <\/div>";
    landingPageTemp += "        <\/div>";
    landingPageTemp += "    <\/div>";
    landingPageTemp += "    <div class=\"footer-copyright\">";
    landingPageTemp += "        <div class=\"container\">";
    landingPageTemp += "            © 2015 سولو ستوديو للخدمات السحابية والتسويق ";
    landingPageTemp += "        <\/div>";
    landingPageTemp += "    <\/div>";
    landingPageTemp += "<\/footer>";


    var notloggednavTemp = "";
    notloggednavTemp += "<li id=\"search-btn\" class=\"left\"><a href=\"\">اول سوق الكتروني للادوية في العراق<\/a><\/li>";
    notloggednavTemp += "";

    // public api


    window.route = {

        landingPage: function (ctx, next) {
            $(".page-title").html("<a href='/'>مسوكجي</a>")


            if (Parse.User.current()) {

                if (Parse.User._currentUser._serverData.usertype == 2) {
                    page.redirect('/items');
                } else if (Parse.User._currentUser._serverData.usertype == 1) {
                    page.redirect('/stores');
                };


            } else {

                $('#content').empty().append(landingPageTemp)
                $(".signup-btn").click(function (e) {
                    e.preventDefault()
                    Parse.User.logIn($("#name").val(), $("#password").val(), {
                        success: function (user) {

                            if (Parse.User._currentUser._serverData.activated == false) {
                                page.redirect('/verification');

                            }

                            if (Parse.User._currentUser._serverData.usertype == 2) {
                                page.redirect('/items');
                            } else if (Parse.User._currentUser._serverData.usertype == 1) {
                                if (Parse.User._currentUser._serverData.activated == false) {
                                    page.redirect('/verification');

                                } else {
                                    page.redirect('/stores');

                                };
                            };


                        },
                        error: function (user, error) {
                            $('.signup-form').addClass("animation-target2")
                            setTimeout(function () {
                                $('.signup-form').removeClass("animation-target2")

                            }, 1000);
                        }
                    });

                })


                $('#nav-right').empty().append(notloggednavTemp)

            }
        },
        showFrontPagetoCustomer: function (ctx, next) {

            $(".page-title").html("<a href='/profile'>" + Parse.User._currentUser._serverData.username + "</a>")
            $('#nav-right').empty().append(navmenuTempCustomers)

            $('#search-btn').on('click', function (evt) {
                evt.preventDefault()
                $('#search-bar').toggle();

                $('#content').empty().append(noresultTemp);

                $('#search-bar input').focus();
                $('#close-search').click(function (evt) {
                    $('#search-bar').hide();
                    $('#search-bar input').val("");

                })

            });


            $('#content').empty().append(loadingTemp);

            var User = Parse.Object.extend("User");
            var query = new Parse.Query(User);
            query.equalTo("usertype", "2");

            query.find({
                error: function () {
                    $('#content').empty().append(noconnectionTemp);
                },
                success: function (results) {

                    var data = {
                        stores: []
                    };

                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {

                        var object = results[i]._serverData;
                        object.id = results[i].id;
                        data.stores.push(object)
                    }

                    var template = Hogan.compile(storesTemp),
                        content = template.render(data, storesTemp);
                    $('#content').empty().append(content);

                }
            });

            // next();

        },
        verification: function (ctx, next) {


            get('views/verification.html', function (html) {


                $('#content').empty().append(html);


            });

        },
        logout: function (ctx, next) {
            Parse.User.logOut()
            page.redirect('/')
        },
        showDrugStoreItemsAsList: function (ctx, next) {
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $(".page-title a").click(function (evt) {
                evt.preventDefault();
                page.redirect('/store')
            })
            $('#nav-right').empty().append(navmenuTempCustomers)

            $('#search-btn').on('click', function (evt) {
                evt.preventDefault()
                $('#search-bar').toggle();

                $('#content').empty().append(noresultTemp);

                $('#search-bar input').focus();
                $('#close-search').click(function (evt) {
                    $('#search-bar').hide();
                    $('#search-bar input').val("");

                })

            });



            $(".button-collapse").sideNav();

            $('#content').empty().append(loadingTemp);

            var Store = Parse.Object.extend("User");
            var query = new Parse.Query(Store);
            query.equalTo("objectId", ctx.params.storeid);
            query.find({
                success: function (result) {
                    var storeName = result[0]._serverData.username;

                    var User = Parse.Object.extend("Item");
                    var query = new Parse.Query(User);
                    query.equalTo("createdBy", ctx.params.storeid);

                    query.find({
                        error: function () {
                            $('#content').empty().append("no internet connection");
                        },
                        success: function (results) {



                            var data = {
                                storeName: storeName,
                                storeId: ctx.params.storeid,
                                stores: []
                            };

                            // Do something with the returned Parse.Object values
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i]._serverData;
                                object.id = results[i].id;
                                object.storeName = storeName;
                                data.stores.push(object)
                            }



                            // var template = Hogan.compile(itemsTemp),
                            //     content = template.render(data, itemsTemp);


                            // $('#content').empty().append(content);
                            var ractive = new Ractive({
                                // The `el` option can be a node, an ID, or a CSS selector.
                                el: '#content',

                                // We could pass in a string, but for the sake of convenience
                                // we're passing the ID of the <script> tag above.
                                template: itemsTemp,

                                // Here, we're passing in some initial data
                                data: data
                            });


                            $(".add-to-cart").click(addToCart)




                        }
                    });
                }
            })


        },
        showDrugStoreItemsAsListByOrder: function (ctx, next) {
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $(".page-title a").click(function (evt) {
                evt.preventDefault();
                page.redirect('/store')
            })
            $('#nav-right').empty().append(navmenuTempCustomers)

            $('#search-btn').on('click', function (evt) {
                evt.preventDefault()
                $('#search-bar').toggle();

                $('#content').empty().append(noresultTemp);

                $('#search-bar input').focus();
                $('#close-search').click(function (evt) {
                    $('#search-bar').hide();
                    $('#search-bar input').val("");

                })

            });
            $('#content').empty().append(loadingTemp);


            var Store = Parse.Object.extend("User");
            var query = new Parse.Query(Store);
            query.equalTo("objectId", ctx.params.storeid);
            query.find({
                success: function (result) {
                    var storeName = result[0]._serverData.username;

                    var User = Parse.Object.extend("Item");
                    var query = new Parse.Query(User);
                    query.equalTo("createdBy", ctx.params.storeid);

                    if (ctx.params.orderby == "price") {
                        query.ascending("price");
                    } else if (ctx.params.orderby == "alphabet") {
                        query.ascending("comName");
                    }



                    query.find({
                        success: function (results) {



                            var data = {
                                storeName: storeName,
                                storeId: ctx.params.storeid,
                                stores: []
                            };

                            // Do something with the returned Parse.Object values
                            for (var i = 0; i < results.length; i++) {
                                var object = results[i]._serverData;
                                object.id = results[i].id;
                                object.storeName = storeName;
                                data.stores.push(object)
                            }



                            // var template = Hogan.compile(itemsTemp),
                            //     content = template.render(data, itemsTemp);


                            // $('#content').empty().append(content);
                            var ractive = new Ractive({
                                // The `el` option can be a node, an ID, or a CSS selector.
                                el: '#content',

                                // We could pass in a string, but for the sake of convenience
                                // we're passing the ID of the <script> tag above.
                                template: itemsTemp,

                                // Here, we're passing in some initial data
                                data: data
                            });

                            $(".add-to-cart").click(addToCart)

                            $("[href]").each(function () {
                                if (this.href == window.location.href) {
                                    $(this).addClass("active");
                                }
                            });


                        }
                    });
                }
            })




        },
        signup: function (ctx, next) {
            get('views/signup.html', function (html) {
                $('#content').empty().append(html);
                $(".sign-btn").click(function (e) {
                    e.preventDefault()

                    var certFile;
                    var idFile;
                    var fileUploadControl = $("#opening-certificate")[0];
                    if (fileUploadControl.files.length > 0) {
                        var file = fileUploadControl.files[0];
                        var name = "photo.jpg";
                        certFile = new Parse.File(name, file);
                    }

                    var fileUploadControl2 = $("#oneid")[0];
                    if (fileUploadControl2.files.length > 0) {
                        var file = fileUploadControl2.files[0];
                        var name = "photo.jpg";
                        idFile = new Parse.File(name, file);
                    }

                    if (!($("#email").val() && $("#name").val() && $("#password").val() && $("#phone").val() && fileUploadControl.files.length && fileUploadControl2.files.length)) {
                        Materialize.toast('<pre style="font-family: ge-ss">تاكد من ادخال جميع المعلومات بصورة صحيحة</pre>', 2000) // 4000 is the duration of the toast
                        return false;
                    }



                    certFile.save().then(function () {
                        idFile.save().then(function () {
                            var user = new Parse.User();
                            user.set("email", $("#email").val());
                            user.set("password", $("#password").val());
                            user.set("username", $("#name").val());
                            user.set("phone", $("#phone").val());
                            user.set("activated", false);
                            user.set("usertype", "1");
                            user.set("cert", certFile);
                            user.set("existedId", idFile);

                            user.signUp(null, {
                                success: function (user) {
                                    page.redirect('/verification')
                                },
                                error: function (user, error) {
                                    console.log(error);
                                    if (error.code == 125) {
                                        Materialize.toast('<pre style="font-family: ge-ss">يرجى استخدام بريد الكتروني صحيح</pre>', 2000)
                                    }
                                    if (error.code == 203) {
                                        Materialize.toast('<pre style="font-family: ge-ss">البريد الالكتروني مستخدم</pre>', 2000)
                                    }
                                }
                            });
                        }, function (error) {

                        });
                    }, function (error) {

                    });



                })

            });
        },
        profile: function () {
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $('#content').empty().append(profileTemp);

        },
        archive: function () {
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $('#content').empty().append(loadingTemp);

            var Order = Parse.Object.extend("Order");
            var queryOrder = new Parse.Query(Order);
            queryOrder.equalTo("orderedById", Parse.User._currentUser.id);
            queryOrder.find({
                success: function (results) {

                    var orders = {bags: []}
                    for (var i = 0; i < results.length; i++) {
                            var object = results[i]._serverData;
                            object.id = results[i].id;
                            object.createdAt = (new Date(results[i].updatedAt)).toLocaleDateString();
                            object.storeName = results[i]._serverData.orderedFromName;
                            orders.bags.push(object)
                    }

                    console.log(orders);
                    var reactive = new Ractive({
                        // The `el` option can be a node, an ID, or a CSS selector.
                        el: '#content',

                        // We could pass in a string, but for the sake of convenience
                        // we're passing the ID of the <script> tag above.
                        template: archiveTemp,

                        // Here, we're passing in some initial data
                        data: {
                            bags: orders
                        }
                    });

                }
            })


        },
        orders: function () {
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $('#content').empty().append(loadingTemp);

            var Order = Parse.Object.extend("Order");
            var queryOrder = new Parse.Query(Order);
            queryOrder.equalTo("orderedFromName", Parse.User._currentUser._serverData.username);
            queryOrder.find({
                success: function (results) {
                    var orders = {bags: []}
                    for (var i = 0; i < results.length; i++) {
                            var object = results[i]._serverData;

                            object.id = results[i].id;
                            object.createdAt = (new Date(results[i].updatedAt)).toLocaleDateString();
                            object.storeName = results[i]._serverData.orderedFromName;
                            object.pharmaName = results[i]._serverData.orderedByName;

                            orders.bags.push(object)
                    }

                    console.log(orders);
                    var reactive = new Ractive({
                        // The `el` option can be a node, an ID, or a CSS selector.
                        el: '#content',

                        // We could pass in a string, but for the sake of convenience
                        // we're passing the ID of the <script> tag above.
                        template: ordersTemp,

                        // Here, we're passing in some initial data
                        data: {
                            bags: orders
                        }
                    });

                }
            })


        },
        items: function () {
            $(".page-title").html("<a href='/profile'>" + Parse.User._currentUser._serverData.username + "</a>")

            $('#nav-right').empty().append(navmenuTempStores)
            $('#content').empty().append(loadingTemp);

            get('views/dashboard/items.html', function (html) {


                var User = Parse.Object.extend("Item");
                var query = new Parse.Query(User);
                query.equalTo("createdBy", Parse.User._currentUser.id);
                query.find({
                    success: function (results) {

                        storeData = {
                            // storeName: storeName,
                            // storeId: ctx.params.storeid,
                            stores: []
                        };

                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i]._serverData;
                            object.id = results[i].id;
                            object.storeName = Parse.User._currentUser._serverData.username;
                            storeData.stores.push(object)
                        }

                        var ractive = new Ractive({
                            // The `el` option can be a node, an ID, or a CSS selector.
                            el: '#content',

                            // We could pass in a string, but for the sake of convenience
                            // we're passing the ID of the <script> tag above.
                            template: html,

                            // Here, we're passing in some initial data
                            data: storeData
                        });

                        $('.delete-item').click(function (e) {
                            e.preventDefault();
                            console.log(ractive);
                            var Item = Parse.Object.extend("Item");
                            var query = new Parse.Query(Item);
                            query.get(e.target.dataset.itemid, {
                                success: function (yourObj) {
                                    yourObj.destroy({});
                                    ractive.splice('stores', e.target.dataset.num, 1);
                                    Materialize.toast('<pre style="font-family: ge-ss">تم حذف العنصر</pre>', 2000) // 4000 is the duration of the toast

                                },
                                error: function (object, error) {
                                    Materialize.toast('<pre style="font-family: ge-ss">لم يتم حذف العنصر, حصل خطأ</pre>', 2000) // 4000 is the duration of the toast
                                }
                            });


                        })

                        $(".edit-item").click(function (e) {
                            e.preventDefault()
                            $('#modal2').openModal();
                            $("#sciName-edit").val(e.target.dataset.itemsciname);
                            $("#comName-edit").val(e.target.dataset.itemcomname);
                            $("#brand-edit").val(e.target.dataset.brand);
                            $("#price-edit").val(e.target.dataset.priceperunit);
                            $("#bonus-edit").val(e.target.dataset.bonus);
                            $("#max-edit").val(e.target.dataset.max);
                            $("#sheetperpack-edit").val(parseInt(e.target.dataset.sheetperpack));
                            $("#tabletpersheet-edit").val(parseInt(e.target.dataset.tabletpersheet));

                            var id = e.target.dataset.itemid;


                            $(".update-item").click(function (e) {
                                e.preventDefault()
                                var sciname = $("#sciName-edit").val();
                                var comname = $("#comName-edit").val();
                                var brand = $("#brand-edit").val();
                                var price = $("#price-edit").val();
                                var bonus = $("#bonus-edit").val();
                                var max = $("#max-edit").val();
                                var sheetperpack = $("#sheetperpack-edit").val();
                                var tabletpersheet = $("#tabletpersheet-edit").val();

                                if (!(sciname && max && comname && brand && price && bonus && sheetperpack && tabletpersheet)) {
                                    Materialize.toast('<pre style="font-family: ge-ss">يرجى ادخال جميع البيانات اولا </pre>', 2000) // 4000 is the duration of the toast
                                    return false;
                                }

                                var Item = Parse.Object.extend("Item");
                                var query = new Parse.Query(Item);
                                query.equalTo("objectId", id);
                                query.first({
                                    success: function (object) {

                                        object.save({
                                            sciName: sciname,
                                            comName: comname,
                                            brand: brand,
                                            bonus: bonus,
                                            max: parseInt(max, 10),
                                            price: parseFloat(price, 10),
                                            sheetPerPack: parseInt(sheetperpack, 10),
                                            tabletPerSheet: parseInt(tabletpersheet, 10),
                                        }, {
                                                success: function () {
                                                    Materialize.toast('<pre style="font-family: ge-ss">تم التحديث بنجاح </pre>', 2000)
                                                    $.each(storeData.stores, function () {
                                                        if (this.id === id) {
                                                            this.sciName = sciname;
                                                            this.comName = comname;
                                                            this.brand = brand;
                                                            this.price = parseFloat(price, 10);
                                                            this.sheetPerPack = parseInt(sheetperpack, 10);
                                                            this.tabletPerSheet = parseInt(sheetperpack, 10);
                                                            this.bonus = bonus;
                                                            this.max = max;

                                                        }
                                                    });

                                                    ractive.update()

                                                    $('#modal2').closeModal();


                                                }
                                            })

                                    },
                                    error: function (error) {
                                        alert("Error: " + error.code + " " + error.message);
                                    }
                                });

                            })

                        })


                        $(".cancel-item").click(function (e) {
                            e.preventDefault()
                        })


                        $(".show-price").change(function (e) {
                            e.preventDefault()
                            
                                var Item = Parse.Object.extend("Item");
                                var query = new Parse.Query(Item);
                                query.equalTo("objectId", e.target.dataset.itemid);
                                query.first({
                                    success: function (object) {

                                        object.save({
                                        showPrice: e.target.checked

                                        }, {
                                                success: function () {

                                                    console.log('done');
                                                }
                                            })

                                    },
                                    error: function (error) {
                                        alert("Error: " + error.code + " " + error.message);
                                    }
                                });

                        })

                        $(".show-item").change(function (e) {
                            e.preventDefault()
                                var Item = Parse.Object.extend("Item");
                                var query = new Parse.Query(Item);
                                query.equalTo("objectId", e.target.dataset.itemid);
                                query.first({
                                    success: function (object) {

                                        object.save({
                                        showToCustomer: e.target.checked

                                        }, {
                                                success: function () {

                                                    console.log('done');
                                                }
                                            })

                                    },
                                    error: function (error) {
                                        alert("Error: " + error.code + " " + error.message);
                                    }
                                });
                        })

                        $(".save-item").click(function (e) {
                            e.preventDefault()
                            var img;
                            var fileUploadControl = $("#img")[0];
                            if (fileUploadControl.files.length > 0) {
                                var file = fileUploadControl.files[0];
                                var name = "photo.jpg";
                                img = new Parse.File(name, file);
                            }

                            var sciname = $("#sciName").val();
                            var comname = $("#comName").val();
                            var brand = $("#brand").val();
                            var price = $("#price").val();
                            var bonus = $("#bonus").val();
                            var max = $("#max").val();
                            var sheetperpack = $("#sheetperpack").val();
                            var tabletpersheet = $("#tabletpersheet").val();
                            var showprice = $("#showprice").is(':checked');
                            var showitem = $("#showitem").is(':checked');

                            if (!(sciname && max && comname && brand && price && fileUploadControl.files.length > 0 && bonus && sheetperpack && tabletpersheet)) {
                                Materialize.toast('<pre style="font-family: ge-ss">يرجى ادخال جميع البيانات اولا </pre>', 2000) // 4000 is the duration of the toast
                                return false;
                            }

                            var Item = Parse.Object.extend("Item");
                            var newItem = new Item();
                            newItem.save({
                                sciName: sciname,
                                comName: comname,
                                img: img,
                                brand: brand,
                                showToCustomer: showitem,
                                showPrice: showprice,
                                price: parseFloat(price, 10),
                                sheetPerPack: parseInt(sheetperpack, 10),
                                tabletPerSheet: parseInt(tabletpersheet, 10),
                                storeName: Parse.User._currentUser._serverData.username,
                                createdBy: Parse.User._currentUser.id
                            }, {
                                    success: function (result) {
                                        $('#modal1').closeModal();
                                        console.log(result.attributes.img._url)
                                        storeData.stores.push({
                                            bonus: bonus,
                                            brand: brand,
                                            comName: comname,
                                            createdBy: Parse.User._currentUser.id,
                                            id: result.id,
                                            img: result.attributes.img,
                                            max: max,
                                            min: 1,
                                            price: price,
                                            sciName: sciname,
                                            sheetPerPack: sheetperpack,
                                            showPrice: showprice,
                                            showToCustomer: showitem,
                                            storeName: Parse.User._currentUser._serverData.username,
                                            tabletPerSheet: tabletpersheet,
                                        })
                                    }
                                })

                        })


                    }
                });



            })

        },
        checkout: function (ctx, next) {
            $('#content').empty().append(loadingTemp);
            console.log('invoked again');
            $(".page-title").html("<a href='/'>رجوع > </a>")
            $(".page-title a").click(function (evt) {
                evt.preventDefault();
                window.history.back();
            })
            $('#nav-right').empty().append(navmenuTempCustomers)

            $('#search-btn').on('click', function (evt) {
                evt.preventDefault()
                $('#search-bar').toggle();

                $('#content').empty().append(noresultTemp);

                $('#search-bar input').focus();
                $('#close-search').click(function (evt) {
                    $('#search-bar').hide();
                    $('#search-bar input').val("");

                })

            });


            var stores = store.getAll()
            var filtredStores = [];
            for (var key in stores) {
                if (stores.hasOwnProperty(key) && !(key.match(/^Parse.*$/))) {
                    filtredStores.push({
                        store: key,
                        item: stores[key]
                    })
                }
            }


            reactive = new Ractive({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#content',

                // We could pass in a string, but for the sake of convenience
                // we're passing the ID of the <script> tag above.
                template: checkOutTemp,

                // Here, we're passing in some initial data
                data: {
                    keys: filtredStores
                }
            });

            // console.log(filtredStores);

            $(".remove-item").click(function (e) {

                e.preventDefault();
                reactive.splice('keys[' + e.target.dataset.storenum + '].item', e.target.dataset.itemnum, 1);

                var tmp = store.get(e.target.dataset.storename)
                tmp = $.grep(tmp, function (evt) {
                    return evt.itemId !== e.target.dataset.itemid;
                });
                if (tmp.length == 0) {
                    store.remove(e.target.dataset.storename)
                    $(".store" + e.target.dataset.storenum).remove()
                } else {
                    store.set(e.target.dataset.storename, tmp)
                }

                reactive.update()

            })

            $(".cancel-order").click(function (e) {

                e.preventDefault();
                reactive.splice('keys', e.target.dataset.storenum, 1);

                store.remove(e.target.dataset.storename)

                reactive.update()


            })


            $(".confirm-order").click(function (e) {

                e.preventDefault();
                console.log(e.target.dataset.storename);
                console.log(e.target.dataset.storenum);
                console.log(store.get(e.target.dataset.storename));
                var Order = Parse.Object.extend("Order");
                var newOrder = new Order();
                newOrder.save({
                    bag: store.get(e.target.dataset.storename),
                    orderedById: Parse.User._currentUser.id,
                    orderedByName: Parse.User._currentUser._serverData.username,
                    orderedFromId: e.target.dataset.storeid,
                    orderedFromName: e.target.dataset.storename

                }, {
                        error: function (model, err) {
                            console.log(err);
                        }
                    })

                reactive.splice('keys', e.target.dataset.storenum, 1);

                store.remove(e.target.dataset.storename)
                Materialize.toast('<pre style="font-family: ge-ss">تم تأكيد الطلبية, سيقوم احد الموظفين بالاتصال بك خلال ساعة </pre>', 2000) // 4000 is the duration of the toast


                reactive.update()


            })




        }
    };


} ());