(function(window, undefined) {
    'use strict';
    // https://github.com/yaju1919/lib/blob/master/lib/yaju1919.js
    var antimatterx = {
        // 型判定
        getType: function(x) { // 型を返す
            // return value sample
            // String, Number, Boolean, Array, Object, RegExp, Function, Null, Undefined,
            // HTMLElement, HTMLDivElement, HTMLSpanElement, HTMLUnknownElement etc.
            return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
        },
        judgeType: function(x, typeName) { // xが指定された型名ならtrueを返す
            var type = antimatterx.getType(x);
            switch (antimatterx.getType(typeName)) {
                case "String":
                    return typeName === type;
                case "Array":
                    return typeName.indexOf(type) !== -1;
                default:
                    return null;
            };
        },
        init: function(param, defaultParam) { // キーの型が異なる場合defaultParamのキーで上書きして返す
            if (!antimatterx.judgeType(param, "Object")) param = {};
            for (var k in defaultParam) {
                var defaultType = antimatterx.getType(defaultParam[k]);
                var type = antimatterx.getType(param[k]);
                if (type !== defaultType) param[k] = defaultParam[k];
            };
            return param;
        },
        //--------------------------------------------------
        // 文字列操作
        repeat: function(str, num) { // strをnum回繰り返した文字列を返す
            return new Array(num + 1).join(str);
        },
        toHan: function(str) { // 全角 => 半角
            return str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
            });
        },
        toZen: function(str) { // 半角 => 全角
            return str.replace(/[A-Za-z0-9!-~]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
            });
        },
        toHira: function(str) { // カナ => ひら
            return str.replace(/[\u30a1-\u30f6]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0x60);
            });
        },
        toKana: function(str) { // ひら => カナ
            return str.replace(/[\u3041-\u3096]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) + 0x60);
            });
        },
        //--------------------------------------------------
        // 配列関連
        max: function(array) { // 配列から最大値を求める
            return array.reduce(function(a, b) {
                return a > b ? a : b;
            });
        },
        min: function(array) {
            return array.reduce(function(a, b) { // 配列から最小値を求める
                return a < b ? a : b;
            });
        },
        makeArray: function(num) { // 0~n-1までの連続した数値の配列を返す
            if (isNaN(num)) return [];
            var arr = [];
            for (var i = 0; i < num; i++) arr.push(i);
            return arr;
        },
        randArray: function(array) { // 配列のランダムな要素を返す
            return array[Math.floor(Math.random() * array.length)];
        },
        //--------------------------------------------------
        // ブラウザによって仕様が変わりやすい操作
        copy: function(str) { // 文字列をクリップボードにコピーする
            var e = document.createElement("textarea");
            e.textContent = str;
            document.body.appendChild(e);
            e.select();
            document.execCommand("copy");
            document.body.removeChild(e);
        },
        download: function(title, str) { // 文字列をテキストファイル形式で保存
            if (!antimatterx.judgeType(title, "String") || !antimatterx.judgeType(str, "String") || title === "" || str === "") return false;
            var strText = str.replace(/\n/g, "\r\n"); // 改行を置換
            var bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // 文字化け対策
            var blob = new Blob([bom, strText], {
                type: "text/plain"
            });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.target = "_blank";
            a.download = title + ".txt";
            a.click();
        },
        downloadImage: function(title, dataURL) { // 画像を保存
            if (!antimatterx.judgeType(title, "String") || title === "") return false;
            var a = document.createElement("a");
            a.href = dataURL;
            a.download = title + "." + dataURL.match(/^data:image\/([^;]+).+$/)[1];
            a.click();
        },
        //--------------------------------------------------
        // データの保存
        makeSaveKey: function(key) { // URLごとに保存する領域を分けるためのキーを作成
            if (!antimatterx.judgeType(key, "String") || key === "") return false;
            var thisURL = location.href.split("?")[0] + "|";
            return thisURL + key;
        },
        getSaveKeys: function() { // 保存されているキーを配列で取得
            var arr = [];
            var thisURL = location.href.split("?")[0] + "|";
            if (window.localStorage) {
                for (var i = 0; i < window.localStorage.length; i++) {
                    var key = window.localStorage.key(i);
                    if (!key.indexOf(thisURL)) arr.push(key.replace(thisURL, ""));
                };
            } else {
                document.cookie.split(";").map(function(v) {
                    var key = antimatterx.decode(v.split("=")[0]);
                    if (!key.indexOf(thisURL)) arr.push(key.replace(thisURL, ""));
                });
            };
            return arr;
        },
        removeSavaData: function(key) {
            var saveKey = antimatterx.makeSaveKey(key);
            if (!saveKey) return false;
            if (window.localStorage) window.localStorage.removeItem(saveKey);
            else document.cookie = antimatterx.encode(saveKey) + "=; max-age=0";
        },
        save: function(key, val) { // 文字列を保存
            var saveKey = antimatterx.makeSaveKey(key);
            if (!saveKey) return false;
            if (window.localStorage) window.localStorage.setItem(saveKey, val);
            else document.cookie = antimatterx.encode(saveKey) + "=" + antimatterx.encode(val);
        },
        load: function(key, callback) { // 保存した文字列を読み込んでcallbackの引数に渡す
            var saveKey = antimatterx.makeSaveKey(key);
            if (!saveKey) return false;
            var data = null;
            if (window.localStorage) {
                data = window.localStorage.getItem(saveKey);
                if (data === null) return false;
            } else {
                var encodeKey = antimatterx.encode(saveKey);
                var i = document.cookie.indexOf(encodeKey + "=") + encodeKey.length + 1;
                if (i === -1) return false;
                data = antimatterx.decode(document.cookie.slice(i).split(";")[0]);
            };
            callback(data);
        },
        //--------------------------------------------------
        // DOM操作
        getCSS: function(elm) { // 要素のCSSを取得する
            var e = $(elm || document.body).get(0);
            return e.currentStyle || document.defaultView.getComputedStyle(e, "");
        },
        getFontSize: function(elm) { // 要素のフォントサイズを取得する
            var size = antimatterx.getCSS(elm).fontSize;
            return Number(size.slice(0, -2)) + 1;
        },
        getRGB: function(color) { // color文字列をRGBの配列にして返す
            var elm = $("<div>").appendTo(document.body).css("color", color);
            var m = antimatterx.getCSS(elm).color.match(/[0-9]+/g);
            elm.remove();
            if (!m) return false;
            return m.map(function(n) {
                return Number(n);
            });
        },
        setWallpaper: function(url, cover) { // 壁紙を設定する
            var p = antimatterx.init(cover, {
                color: "white",
                opacity: 0.8
            });
            var colors = antimatterx.getRGB(p.color);
            var elm = $("<div>").css({
                zIndex: "-114514",
                background: colors ? "rgba(" + colors.join(",") + "," + p.opacity + ")" : p.color,
                position: "fixed",
                top: "0",
                right: "0",
                bottom: "0",
                left: "0"
            }).appendTo("body");
            if (!url) return elm;
            $("body").css({
                backgroundImage: 'url("' + url + '")',
                backgroundAttachment: "fixed", // コンテンツの高さが画像の高さより大きい時、動かないように固定
                backgroundPosition: "center center", // 画像を常に天地左右の中央に配置
                backgroundSize: "cover", // 表示するコンテナの大きさに基づいて、背景画像を調整
                backgroundRepeat: "no-repeat" // 画像をタイル状に繰り返し表示しない
            });
            return elm;
        },
        //--------------------------------------------------
        // HTML要素の追加
        addInputText: function(parentNode, param) { // 文字列入力欄を追加
            var p = antimatterx.init(param, {
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                placeholder: "", // 説明文
                value: "", // 初期値
                change: function() {}, // 値が変更されたとき実行する関数
                enter: function() {}, // Enterキーで実行する関数
                save: "", // 変更された値を保存する領域
                hankaku: false, // trueなら自動で半角化
                max: Infinity, // 入力可能な最大長
                textarea: false, // trueならtextarea要素になる
                width: "", // widthがこの値で固定
                height: "", // textareaの時にheightがこの値で固定
                readonly: false, // trueならユーザーは編集不可&クリック時全選択&コピー
                trim: false // trueなら入力の両端の空白文字などを自動削除
            });
            p.value = String(p.value);
            var elm = $(p.textarea ? "<textarea>" : "<input>");
            _setCommonInput(p, elm, parentNode);
            _setAttr(p, elm);
            _setResize(p, elm, parentNode, function() {
                return elm.val();
            });
            if (p.textarea && antimatterx.getBrowser() === "Google Chrome") { // https://qiita.com/okyawa/items/8c7bee52b203f6956d44
                var str = elm.val();
                elm.focus();
                elm.val("");
                elm.val(str);
                elm.blur();
            };

            function change() {
                var v = elm.val();
                if (p.trim) v = v.trim();
                if (p.hankaku) v = antimatterx.toHan(v);
                var re = p.change(v);
                if (antimatterx.judgeType(re, "String")) v = re;
                elm.val(v);
                if (p.save) antimatterx.save(p.save, v);
            };
            elm.on("change", change);
            antimatterx.try(change);
            return elm;
        },
        addInputNumber: function(parentNode, param) { // 数値入力欄を追加
            if (antimatterx.judgeType(param, "Object")) {
                ["value", "min", "max"].forEach(function(v) {
                    if (antimatterx.judgeType(param[v], "String")) param[v] = Number(param[v]);
                });
            };
            var p = antimatterx.init(param, {
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                placeholder: "", // 説明文
                value: 0, // 初期値
                change: function() {}, // 値が変更されたとき実行する関数
                enter: function() {}, // Enterキーで実行する関数
                save: "", // 変更された値を保存する領域
                min: 0, // 入力可能な最小値
                max: Infinity, // 入力可能な最大値
                int: false, // trueなら自動で整数化
                width: "", // widthがこの値で固定
                readonly: false // trueならユーザーは編集不可&クリック時全選択&コピー
            });
            p.value = Number(p.value);
            var elm = $("<input>");
            _setCommonInput(p, elm, parentNode);
            _setAttr(p, elm);
            _setResize(p, elm, parentNode, function() {
                return elm.val();
            });

            function change() {
                var n = Number(antimatterx.toHan(elm.val().trim()).replace(/[^0-9\.\-\+]/g, ""));
                if (isNaN(n)) n = 0;
                if (n < p.min) n = p.min;
                else if (n > p.max) n = p.max;
                if (p.int) n = Math.floor(n);
                var re = p.change(n);
                if (antimatterx.judgeType(re, "Number")) n = re;
                var v = String(n);
                elm.val(v);
                if (p.save) antimatterx.save(p.save, v);
            };
            elm.on("change", change);
            antimatterx.try(change);
            return elm;
        },
        addInputRange: function(parentNode, param) { // 数値入力レンジバーを追加
            if (antimatterx.judgeType(param, "Object")) {
                ["value", "min", "max"].forEach(function(v) {
                    if (antimatterx.judgeType(param[v], "String")) param[v] = Number(param[v]);
                });
            };
            var p = antimatterx.init({
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                value: 50, // 初期値
                change: function() {}, // 値が変更されたとき実行する関数
                save: "", // 変更された値を保存する領域
                min: 0, // 入力可能な最小値
                max: 100, // 入力可能な最大値
                width: "", // widthがこの値で固定
                step: 1,
            });
            p.value = Number(p.value);
            var elm = $("<input>", {
                type: "range",
                value: p.value,
                min: p.min,
                max: p.max,
                step: p.step
            });
            _setCommonInput(p, elm, parentNode);
            _setAttr(p, elm);

            function change() {
                var n = Number(elm.val());
                if (isNaN(n)) n = 0;
                var re = p.change(n);
                if (antimatterx.judgeType(re, "Number")) n = re;
                var v = String(n);
                elm.val(v);
                if (p.save) antimatterx.save(p.save, v);
            };
            elm.on("change", change);
            antimatterx.try(change);
            return elm;
        },
        addInputButton: function(parentNode, param) { // ボタンを追加
            var p = antimatterx.init(param, {
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                click: function() {}, // クリックされたとき実行する関数
            });
            var elm = $("<button>").text(p.title).on("click", p.click).appendTo(parentNode);
            if (p.id !== "") elm.attr("id", p.id);
            if (p.class !== "") elm.addClass(p.class);
            return elm;
        },
        addInputBool: function(parentNode, param) { // ON/OFFボタンを追加
            var p = antimatterx.init(param, {
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                value: false, // 初期値
                change: function() {}, // 値が変更されたとき実行する関数
                save: "" // 変更された値を保存する領域
            });
            var flag = !!p.value;
            var elm = $("<button>").text(p.title).click(function() {
                flag = !flag;
                change();
            }).appendTo(parentNode);
            _setAttr(q, elm);
            var check = $("<input>", {
                type: "checkbox"
            }).prependTo(elm);
            if (p.save) antimatterx.load(p.save, function(v) {
                flag = (v === "1");
                change();
            });

            function change() {
                var re = p.change(flag);
                if (antimatterx.judgeType(re, "Boolean")) flag = re;
                elm.css("background-color", flag ? "orange" : "gray");
                check.prop("checked", flag);
                if (p.save) antimatterx.save(p.save, flag ? "1" : "0");
            };
            antimatterx.try(change);
            return elm;
        },
        addInputSelect: function(parentNode, param) { // 選択肢を追加
            var p = antimatterx.init(param, {
                id: "", // HTML
                class: "", // HTML
                title: "", // タイトル
                placeholder: "", // 説明文
                value: "", // 初期値
                change: function() {}, // 値が変更されたとき実行する関数
                save: "", // 変更された値を保存する領域
                list: {}, // 選択肢の連想配列
                width: "" // widthがこの値で固定
            });
            p.value = String(p.value);
            var elm = $("<select>");

            function getVal() {
                return elm.val() || "";
            };

            function updateSelect() {
                var v = getVal();
                elm.empty();
                if (p.placeholder !== '') $("<option>").text(p.placeholder).val("").hide().appendTo(elm);
                for (var k in p.list) $("<option>").text(k).val(String(p.list[k])).appendTo(elm);
                if (v) elm.val(v);
            };
            updateSelect();
            elm.hover(updateSelect).on("updateSelect", updateSelect); // "updateSelect"イベントをtoggleなどで発火させると更新
            _setCommonInput(p, elm, parentNode);
            _setAttr(p, elm);
            _setResize(p, elm, parentNode, getVal);

            function change() {};
            elm.on("change", change);
            antimatterx.try(change);
            return elm;
        },
        addHideArea: function(parentNode, param) { // ボタンで表示を切り替えられる非表示エリアを追加
            var p = antimatterx.init(param, { // addInputBool参照
                id2: "", // HTML
                class2: "", // HTML
                speed: 300, // 表示スピード[秒]
                elm: $("<div>") // 非表示エリアにする要素
            });
            var h = $("<div>").appendTo(parentNode);
            var front = $("<span>").appendTo(h);
            var area = p.elm.appendTo(h);
            p.change = function(flag) {
                area[flag ? "show" : "hide"](p.speed);
                setTimeout(function() {
                    $(window).resize();
                }, p.speed);
            };
            if (p.id2 !== "") area.attr("id", p.id2);
            if (p.class2 !== "") area.addClass(p.class2);
            antimatterx.addInputBool(front, p);
            return h;
        },
        addTab: function(parentNode, param) {
            var p = antimatterx.init(param, {
                list: {}, // タブの名前と要素
                title: "", // タイトル
                value: "", // 初期値(タブの名前)
            });
            var h = $("<div>").appendTo(parentNode);
            var tabs = $("<div>").appendTo(h);
            var area = $("<div>").appendTo(h);
            if (p.title !== "") tabs.text(p.title + ": ");
            var btns = {};
            for (var k in p.list) {
                (function(k) {
                    btns[k] = $("<button>").text(k).on("click", function(e) {
                        tabs.find("button").css("background-color", "gray");
                        $(e.target).css("background-color", "yellow");
                        area.children().hide();
                        p.list[k].show();
                        $(window).resize();
                    }).appendTo(tabs);
                })(k);
                area.append(p.list[k]);
            };
            if (btns[p.value]) btns[p.value].click();
            else h.find("button").first().click();
            return h;
        },
        //--------------------------------------------------
        // 変換関連
        BaseN: function(base) { // N進数を作成するクラス
            if (typeof base !== "string" || base.length < 2) return false;
            return {
                encode: function(num) { // 10進数 => N進数
                    var str = "";
                    if (!num) return base[0];
                    while (num) {
                        num = Math.floor(num);
                        str = base[num % base.length] + str;
                        num /= base.length;
                    };
                    return str.slice(1);
                },
                decode: function(str) { // N進数 => 10進数
                    return String(str).split("").reverse().map(function(v, i) {
                        return base.indexOf(v) * Math.pow(base.length, i);
                    }).reduce(function(total, v) {
                        return total + v;
                    });
                },
                base: base
            };
        },
        strToImage: { // 文字列と画像を相互変換する
            encode: function(str, callback) {
                var arr = [];
                str.split("").forEach(function(c) {
                    var n = c.charCodeAt();
                    if (n < 128) arr.push(n);
                    else {
                        arr.push(128);
                        arr.push((0xff00 & n) >> 8); // 前
                        arr.push(0xff & n); // 後
                    };
                });
                var width = Math.ceil(Math.sqrt(arr.length / 3));
                var cv = $("<canvas>").attr({
                    width: width,
                    height: width
                });
                var ctx = cv[0].getContext("2d");
                var imgData = ctx.getImageData(0, 0, width, width),
                    cnt = 0;
                for (var i = 0; i < arr.length; i++) {
                    var x = i * 4;
                    for (var o = 0; o < 3; o++) imgData.data[x + o] = arr[cnt++] || 0;
                    imgData.data[x + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
                };
                ctx.putImageData(imgData, 0, 0);
                callback(cv[0].toDataURL("image/png"));
            },
            decode: function(callback) {
                var inputFile = $("<input>", {
                    type: "file"
                }).change(function(e) {
                    var file = e.target.files[0];
                    if (!file) return;
                    var blobURL = window.URL.createObjectURL(file);
                    var img = new Image();
                    img.onload = function() {
                        var width = img.width,
                            height = img.height;
                        var cv = $("<canvas>").attr({
                            width: width,
                            height: height
                        });
                        var ctx = cv[0].getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        var data = ctx.getImageData(0, 0, width, height).data;
                        var arr = [];
                        for (var i = 0; i < data.length; i++) {
                            var x = i * 4;
                            for (var o = 0; o < 3; o++) arr.push(data[x + o]);
                        };
                        var str = "";
                        for (var i = 0; i < arr.length; i++) {
                            var n = arr[i];
                            if (n < 128) str += String.fromCharCode(n);
                            else if (n === 128) {
                                str += String.fromCharCode((arr[i + 1] << 8) + arr[i + 2]);
                                i += 2
                            };
                        };
                        callback(str.replace(/\0+$/, ""));
                    };
                    img.src = blobURL;
                }).click();
            }
        },
        // 0~9, a~z, A~V => 無変換、左端にWを追加
        // 58進数の一桁、左端にXを追加
        // 58進数の二桁、左端にYを追加
        // 58進数の三桁、左端にZを追加
        encode: function(str) { // 文字列をエンコード
            var to58 = antimatterx.BaseN("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV"),
                sign = "WXYZ";
            if (typeof str !== "string") return false;
            return str.split("").map(function(v) {
                if (to58.base.indexOf(v) !== -1) return sign[0] + v + sign[0];
                else {
                    var str = to58.encode(v.charCodeAt(0)),
                        len = str.length;
                    if (len > 3) return ""; // 58**3以上のUnicodeは空文字
                    return sign[len] + (antimatterx.repeat("0", len) + str).slice(-len) + sign[len];
                };
            }).join("").replace(/(W|X|Y|Z)\1/g, "").replace(/(W|X|Y|Z)(?=(W|X|Y|Z))/g, "").slice(0, -1).replace(/^W/, "");
        },
        decode: function(str) { // エンコードされた文字列をデコード
            var to58 = antimatterx.BaseN("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV"),
                sign = "WXYZ";
            if (typeof str !== "string") return false;
            return str.replace(/(W|X|Y|Z)[^WXYZ]*/g, function(v) {
                var s = v.slice(1);
                var i = sign.indexOf(v[0]);
                if (!i) return s;
                return s.replace(new RegExp(".{" + i + "}", "g"), function(n) {
                    return String.fromCharCode(to58.decode(n));
                });
            });
        },
        //--------------------------------------------------
        // その他
        try: function(func) { // 失敗しても処理が止まらないようにfuncを実行する
            try {
                func();
            } catch (e) {
                console.error(e);
            };
        },
        getBrowser: function() { // ブラウザ名を取得
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/edg(e|a|ios)/)) return "Microsoft Edge";
            else if (ua.match(/opera|opr/)) return "Opera";
            else if (ua.match(/samsungbrowser/)) return "Samsung Internet Browser";
            else if (ua.match(/ucbrowser/)) return "UC Browser";
            else if (ua.match(/ch(rome|ios)/)) return "Google Chrome";
            else if (ua.match(/firefox|fxios/)) return "Mozilla Firefox";
            else if (ua.match(/safari/)) return "Safari";
            else if (ua.match(/msie|trident/)) return "Internet Explorer";
            else return false;
        },
        getOS: function() { // OS名を取得
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/windows nt/)) return "Microsoft Windows";
            else if (ua.match(/android/)) return "Android";
            else if (ua.match(/ip(hone|ad)/)) return "iOS";
            else if (ua.match(/mac os x/)) return "macOS";
            else return false;
        },
        getIP: function(callback) { // IPアドレス等の情報を取得してcallbackの引数に渡す
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://ipinfo.io/?callback=a");
            xhr.responseType = "text";
            xhr.onload = function() {
                var m = xhr.response.match(/{.*?}/);
                if (!m) return;
                callback(JSON.parse(m[0]));
            };
            xhr.send();
        }
        //--------------------------------------------------
    };
    // プライベート関数 //////////////////////////////////////////////////
    function _setAttr(p, elm) { // 要素の属性の設定
        if (p.id !== "") elm.attr("id", p.id);
        if (p.class !== "") elm.addClass(p.class);
        elm.attr("placeholder", p.placeholder).css({
            maxWidth: "95%",
            minWidth: antimatterx.getFontSize() * 5,
            verticalAlign: "middle"
        });
    };

    function _setResize(p, elm, parentNode, func) { // リサイズ処理
        function resize() {
            // 幅の調整
            function mostLongLine(str) { // 文字列の中で最も長い行の文字数
                return antimatterx.max(str.split("\n").map(function(v) {
                    return v.length;
                }));
            };
            var fontSize = antimatterx.getFontSize(),
                pWidth = $(parentNode).width;
            if (p.width !== "") elm.width(p.width);
            else {
                var maxWidth = pWidth;
                if (p.title !== "") maxWidth -= fontSize * (p.title.length + 1);
                var width = fontSize * mostLongLine(func());
                if (p.placeholder !== "") {
                    var phWidth = fontSize * mostLongLine(p.placeholder);
                    if (phWidth > width) width = phWidth;
                };
                if (width > maxWidth) width = maxWidth;
                elm.width(width);
            };
            // 高さの調整
            if (!p.textarea) return;
            if (p.height !== "") elm.height(p.height);
            else {
                var line = func().split("\n").length;
                var lineP = p.placeholder.split("\n").length;
                if (line < lineP) line = lineP;
                func().split("\n").forEach(function(v) {
                    line += Math.floor((v.length * fontSize) / pWidth);
                });
                elm.height(line + "em");
            };
        };
        resize();
        $(window).resize(resize);
        elm.on("keyup click", resize);
    };

    function _setCommonInput(p, elm, parentNode) { // 標準的な要素の設定
        var h = $("<div>").appendTo(parentNode);
        if (p.title !== "") h.text(p.title + ": ");
        elm.appendTo(h).val(p.value).on("keypress", function(e) {
            if (e.key === "Enter") p.enter();
        });
        if (p.readonly) {
            elm.attr("readonly", true).on("click", function() {
                antimatterx.copy(elm.val());
            }).css({
                backgroundColor: "#e9e9e9",
                tabIndex: "-1",
                curor: "pointer"
            });
        };
        if (p.save) {
            antimatterx.load(p.save, function(v) {
                elm.val(v);
                elm.trigger("change");
            });
        };
    };
    //////////////////////////////////////////////////////////////////
    window.antimatterx = antimatterx;
})(typeof window === "object" ? window : this);
