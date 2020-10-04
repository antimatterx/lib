(function() {
    'use strict';
    var h = $("<div>").css({
        backgroundColor: "lightgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    h.append("<hr>Hello, World!<br>");
    var tools = {
        "test-page": "https://antimatter-x.github.io/lib/",
        "JavaScript エディタ": "https://antimatter-x.github.io/editor/"
    };
    for (var k in tools) {
        $("<a>", {
            href: k
        }).text(tools[k]).appendTo(h);
        h.append("<br>");
    };
})();
