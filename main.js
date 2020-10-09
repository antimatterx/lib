(function() {
    'use strict';
    //////////////////////////////////////////////////
    var h = $("<div>").css({
        backgroundColor: "lightgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    var desc = $("<div>").append("Hello, World!<br>テストページです。").css({
        backgroundColor: "darkgray",
        fontSize: "12px",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo(h);
    h.append("<hr>");
    //////////////////////////////////////////////////
    $("<h2>").text("my pages").appendTo(h);
    var projects = [
        "lib",
        "editor",
        "err"
    ];
    var origin = location.protocol + "//" + location.host + "/";
    projects.forEach(function(v) {
        var url = origin + v + "/";
        $.get(url).done(function(data) { // 通信成功
            var title = data.match(/<title>(.*)<\/title>/)[1];
            $("<a>", {
                href: url
            }).text(title).appendTo(h);
            h.append("<br>")
        });
    });
    //////////////////////////////////////////////////
})();
(function() {
    'use strict';
    //////////////////////////////////////////////////
    var h = $("<div>").css({
        backgroundColor: "lightgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    var desc = $("<div>").append("Hello, World!<br>テストページです。").css({
        backgroundColor: "darkgray",
        fontSize: "12px",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo(h);
    h.append("<hr>");
    //////////////////////////////////////////////////
    $("<h2>").text("my pages").appendTo(h);
    var projects = [
        "lib",
        "editor"
    ];
    var origin = location.protocol + "//" + location.host + "/";
    projects.forEach(function(v) {
        var url = origin + v + "/";
        $.get(url).done(function(data) {
            var title = data.match(/<title>(.*)<\/title>/)[1];
            $("<a>", {
                href: url
            }).text(title).appendTo(h);
            h.append("<br>")
        });
    });
    //////////////////////////////////////////////////
})();
