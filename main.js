(function() {
    'use strict';
    //--------------------------------------------------
    var page = (function() {
            var h = $("<div>").appendTo("body"),
                header = $("<div>").append($("<h1>").text($("title").text()).css({
                    marginRight: "auto",
                    marginLeft: "10px"
                })).css({
                    display: "flex",
                    width: "100%",
                    height: "75px",
                    color: "#10aa10",
                    backgroundColor: "rgba(0, 0, 0, 0.25)",
                    alignItems: "center"
                }).appendTo(h),
                desc = $("<div>").appendTo(h),
                content = $("<div>").appendTo(h);
            desc.add(content).css({
                margin: "10px",
                paddingTop: "5px",
                paddingRight: "25px",
                paddingBottom: "5px",
                paddingLeft: "25px",
                borderRadius: "10px",
                color: "#e3e3e3",
                backgroundColor: "rgba(255, 255, 255, 0.125)"
            });
            $("body").css({
                margin: 0,
                backgroundColor: "#3a3a3a"
            }).add("html").add(h).css({
                width: "100%",
                height: "100%"
            });
            return {
                h: h,
                header: header,
                desc: desc,
                content: content
            };
        })(),
        desc = page.desc,
        content = page.content;
    //--------------------------------------------------
    $("<h2>").text("Hello, World!").css("color", "#f5f5f5").appendTo(desc);
    $("<p>").html("テストページです。<br>どのライブラリが読み込めていないか確認できます。").appendTo(desc);
    //--------------------------------------------------
    $("<h2>").text("ライブラリのチェック").appendTo(content);
    (function(container) {
        amx.loop([
            "jQuery",
            "antimatterx",
            "old_antimatterx",
            "cmdext",
            "yaju1919"
        ], function(k) {
            var lib = window[k] !== undefined;
            $("<div>").text(k + ": ").append($("<span>").text(lib ? "OK" : "Error").css("color", lib ? "lime" : "red")).appendTo(container);
        });
    })($("<div>").css({
        padding: "10px",
        width: "25%",
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10px"
    }).appendTo(content));
    $("<h2>").text("簡易コンソール").appendTo(content);
    (function(container) {
        var input = $(amx.addInputText(container[0], {
                textarea: true
            })).width("100%"),
            output = $("<div>").appendTo(container);
        $("<button>").text("実行").css("margin-bottom", "5px").on("click", function() {
            output.empty();
            try {
                console.log((0, eval)(input.val()));
            } catch (e) {
                console.error(e);
            };
        }).prependTo(container);

        function displayLog(x, color) {
            $("<div>").text((function() {
                if (typeof x === "object") {
                    if (x.message) return String(x);
                    return "{" + Object.keys(x).map(function(k) {
                        return k + ":" + String(x[k]);
                    }).join(",") + "}";
                } else return String(x);
            })()).css("background-color", color).appendTo(output);
        };
        (function() {
            if (!console) window.console = {};
            console.log = function(x) {
                displayLog(x, "gray");
            };
            console.error = function(x) {
                displayLog(x, "pink");
            };
            console.warn = function(x) {
                displayLog(x, "lightyellow");
            };
            console.info = function(x) {
                displayLog(x, "lightblue");
            };
        })();
    })($("<div>").css({
        padding: "10px",
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10px"
    }).appendTo(content));
    content.append("<br>");
    //--------------------------------------------------
    $("h2").css("color", "#f5f5f5");
    //--------------------------------------------------
})();
