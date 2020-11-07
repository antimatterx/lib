(function() {
    'use strict';
    //--------------------------------------------------
    var h = $("<div>").css({
        backgroundColor: "lightgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    var desc = $("<div>").append("Hello, World!<br>テストページです。<br>どのライブラリが読み込めていないか確認できます。").css({
        backgroundColor: "darkgray",
        fontSize: "12px",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo(h);
    h.append("<hr>");
    //--------------------------------------------------
    $("<h2>").text("Check your library").appendTo(h);
    var libs = [
        "jQuery",
        "yaju1919",
        "antimatterx"
    ];
    libs.forEach(function(v) {
        var lib = window[v],
            elm = $("<div>").text(v + ": ").css("background-color", "slategray").appendTo(h);
        $("<span>").text(lib ? "OK" : "Error").css("color", lib ? "lime" : "red").appendTo(elm);
    });
    $("<h2>").text("My Page").appendTo(h);
    var pages = [
            "lib",
            "editor"
        ],
        origin = location.protocol + "//" + location.host + "/";
    pages.forEach(function(v) {
        var url = origin + v + "/";
        $.get(url).done(function(d) {
            $("<a>", {
                href: url,
                target: "_blank"
            }).text(d.match(/<title>(.*)<\/title>/)[1]).appendTo(h);
            h.append("<br>");
        });
    });
    //--------------------------------------------------
})();
