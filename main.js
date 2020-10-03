(function() {
    'use strict';
    var h = $("<div>").appendTo("body");
    $("<h1>").text($("title").text()).appendTo(h);
    h.append("Hello, World!");
})();
