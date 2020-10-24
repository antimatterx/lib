(function() {
    'use strict';
    //--------------------------------------------------
    var h = $("<div>").css({
        backgroundColor: "lightgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appednTo(h);
    var desc = $("<div>").append("Hello, World!<br>テストページです。<br>どのライブラリが使えないのかチェックしたりできます。").css({
        backgroundColor: "darkgray",
        fontSize: "12px",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo(h);
    h.append("<hr>");
    //--------------------------------------------------
    $("<h2>").text("Check your library").appendTo(h);
    var library = [
        "jQuery",
        "antimatterx"
    ];
    library.forEach(function(v) {
        var a = window[v];
        $("<div>").text(v + ": " + (a ? "OK" : "Error")).appendTo(h);
    });
    $("<h2>").text("my pages").appendTo(h);
    var pages = [
        "lib",
        "editor"
    ];
    var origin = location.protocol + "//" + location.host + "/";
    pages.forEach(function(v) {
        var url = origin + v + "/";
        $.get(url).done(function(d) {
            var title = d.match(/<title>(.*)<\/title>/)[1];
            $("<a>", {
                href: url
            }).text(title).appendTo(h);
            h.append("<br>");
        });
    });
    //--------------------------------------------------
})();
