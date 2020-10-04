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
    h.apped("Hello, World!<br>テストページです。")
    h.append("<hr>");
    //////////////////////////////////////////////////
    $("<h2>").text("my pages").appendTo(h);
    var list = {
        "test-page": "lib",
        "JavaScript エディタ": "editor"
    };
    for (var k in list) {
        $("<a>", {
            href: "https://antimatter-x.github.io/" + list[k]
        }).text(k).appendTo(h);
        h.append("<br>")
    };
    //////////////////////////////////////////////////
})();
