(function() {
    'use strict';
    var h = $("<div>").css({
        backgroundColor: "darkgray",
        borderRadius: "25px",
        padding: "1em"
    }).appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    h.append("Hello, World!");
})();
