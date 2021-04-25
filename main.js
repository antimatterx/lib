(function() {
    'use strict';
    //--------------------------------------------------
    var page = (function() {
        var h = $("<div>").appendTo("body"),
            header = $("<div>").append($("<h1>").text($("title").text()).css({
                padding: "5px",
                margin: "0px auto 20px 10px"
            })).css({
                width: "100%",
                color: "#10aa10",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                wordWrap: "break-word"
            }).appendTo(h),
            desc = $("<div>"),
            content = $("<div>");
        desc.add(content).css({
            margin: "10px",
            paddingTop: "5px",
            paddingRight: "25px",
            paddingBottom: "5px",
            paddingLeft: "25px",
            borderRadius: "10px",
            color: "#e3e3e3",
            backgroundColor: "rgba(255, 255, 255, 0.125)"
        }).appendTo(h);
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
    })();
    //--------------------------------------------------
    $("<h2>").text("hello, World!").add($("<p>").html("テストページです。<br>どのライブラリが読み込めていないか確認できます。")).appendTo(page.desc);
    //--------------------------------------------------
    $("<h2>").text("ライブラリのチェック").appendTo(page.content);
    (function(container) {
        amx.loop([
            "jQuery",
            "m",
            "awx",
            "$$amx",
            "$amx",
            "antimatterx",
            "old_antimatterx",
            "$CmdExt",
            "CmdExt",
            "yaju1919"
        ], function(k) {
            var lib = (window[k] !== undefined);
            $("<div>").text(k + ": ").append($("<span>").text(lib ? "OK" : "Error").css({
                backgroundColor: lib ? "lightgreen" : "pink",
                color: lib ? "green" : "red",
                borderRadius: "5px"
            })).appendTo(container);
        });
    })($("<div>").css({
        padding: "10px",
        color: "black",
        display: "inline-block",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10px"
    }).appendTo(page.content));
    //--------------------------------------------------
    $("<h2>").text("簡易コンソール").appendTo(page.content);
    (function(container, clearAllInterval) {
        var input = $(amx.addInputText(container[0], {
                save: "input",
                textarea: true
            })).css({
                backgroundColor: "black",
                color: "lightblue",
                width: "100%",
                height: "500px",
                maxWidth: "100%",
                // maxHeight: $(window).height() / 3,
                padding: "5px",
                boxSizing: "border-box",
                overflow: "visible scroll"
            }).on('click keyup', function (e) {
                $(e.target).css('width', '100%');
            }),
            output = $("<div>").css({
                backgroundColor: "lightgray",
                width: "100%",
                maxHeight: $(window).height() / 3,
                padding: "1em",
                boxSizing: "border-box",
                overflow: "visible scroll"
            }).appendTo(container[0]),
            clearBtn = amx.addButton(container[0], {
                title: "クリア",
                insertBefore: true,
                click: function() {
                    clearAllInterval();
                    output.empty();
                }
            });
        amx.addButton(container[0], {
            title: "実行",
            insertBefore: true,
            click: function() {
                clearBtn.click();
                try {
                    console.log((0, eval)(input.val()));
                } catch (e) {
                    console.error(e);
                };
            }
        });
        (function(addResult, list) {
            var origin = {};
            if (!window.console) window.console = {};
            amx.loop(list, function(k) {
                origin[k] = window.console[k] || function() {};
                var arr = list[k];
                window.console[k] = (function() {
                    var key = k,
                        back = arr[0],
                        color = arr[1],
                        symbol = arr[2];
                    return function() {
                        origin[key].apply(console, arguments);
                        addResult(amx.stringize(Array.prototype.slice.call(arguments), true), back, color, symbol);
                    };
                })();
            });
        })(function(str, back, color, symbol) { // addResult
            var line = $("<div>").css({
                    backgroundColor: back,
                    color: color,
                    textAlign: "left",
                    maxWidth: "100%"
                }).appendTo(output),
                symbolColor = amx.getCSS(line[0]).backgroundColor.match(/[0-9]+/g).map(function(v, i) {
                    var n = Number(v),
                        d = (n - n * 0.1);
                    return d >= 0 ? d : 0;
                });
            $("<div>").text(symbol || Array.prototype.slice.call(output.children()).filter(function(e) {
                return e.style.backgroundColor === "white";
            }).length - 1).css({
                backgroundColor: "rgb(" + symbolColor + ")",
                width: "3em",
                textAlign: "center"
            }).appendTo(line);
            $("<div>").text(str).css("margin-left", "1em").appendTo(line);
            line.find("div").css("display", "inline-block");
        }, { // list
            log: ["white", "black", ""],
            error: ["pink", "red", "×"],
            warn: ["lightyellow", "orange", "▲"],
            info: ["lightblue", "blue", "●"]
        });
    })($("<div>").css({
        padding: "10px",
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10px"
    }).appendTo(page.content), (function() { // clearAllInterval
        var setTimeout_copy = window.setTimeout,
            setInterval_copy = window.setInterval,
            setIds = []; // 時間差関数のidを格納
        window.setTimeout = function() {
            var id = setTimeout_copy.apply(window, arguments);
            setIds.push(id);
            return id;
        };
        window.setInterval = function() {
            var id = setInterval_copy.apply(window, arguments);
            setIds.push(id);
            return id;
        };
        return function() { // 時間差関数を全てクリアする
            while (setIds.length > 0) {
                var clearId = setIds.pop();
                clearTimeout(id);
                clearInterval(id);
            };
        };
    })());
    //--------------------------------------------------
    page.content.append("<br>");
    $("h2").css("color", "#f5f5f5");
    //--------------------------------------------------
})();
