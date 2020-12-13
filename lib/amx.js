(function(window, undefined) {
    'use strict';
    // 定数
    var libNames = [ // ライブラリ名
        //"antimatterx",
        "amx"
    ];

    // ライブラリ
    var lib = {
        // メタ
        hello: function() { // ライブラリのプロパティの説明を返す
            return Object.keys(lib).map(function(k) {
                return [
                    k,
                    (lib[k].toString().match(/function.*?(\(.*?\))/) || [])[1] || Object.prototype.toString.call(lib[k]),
                    lib[k].toString().match(/\/\/.*/) || ""
                ].join(" ")
            }).join("\n");
        },
        //--------------------------------------------------
        // 型関連
        getType: function(x) { // 型名を返す
            return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
        },
        judgeType: function(x, typeName) { // xが指定された型名か判定する
            var type = lib.getType(x),
                comparisonType = lib.getType(typeName);
            if (comparisonType === "String") return type === typeName;
            else if (comparisonType === "Array") return typeName.indexOf(type);
            else return null;
        },
        initValue: function(val, defaultVal) { // valの型が異なる場合defaultValの値を返す
            return lib.getType(val) === lib.getType(defaultVal) ? val : defaultVal;
        },
        initParam: function(param, defaultParam) { // キーの型が異なる場合defaultParamのキーで上書きして返す
            param = lib.initValue(param, {});
            defaultParam = lib.initValue(defaultParam, {});
            Object.keys(defaultParam).forEach(function(k) {
                if (lib.getType(param[k]) !== lib.getType(defaultParam[k])) param[k] = defaultParam[k];
            });
            return param;
        },
        //--------------------------------------------------
        // 環境によって仕様が変わりやすい操作
        copy: function(str) { // 文字列をクリップボードにコピーする
            str = lib.initValue(str, "");
            if (lib.context.isNode) { // Node.js環境の場合
                try {
                    require("clipboardy").writeSync(str);
                } catch (e) {
                    throw new Error('If you want to use this method with Node.js, you need to run "npm install clipboardy".');
                };
            } else if (typeof window.navigator === "object" && typeof window.navigator.clipboard === "object" &&
                typeof window.location === "object" && window.location.protocol === "https:") window.navigator.clipboard.writeText(str); // Async Clipboard APIが利用可能な場合
            else { // 上記以外
                var e = document.createElement("textarea");
                e.value = str;
                document.body.appendChild(e);
                e.select();
                document.execCommand("copy");
                e.remove();
            };
        },
        //--------------------------------------------------
        // 配列関連
        max: function(array) { // 配列から最大値を求める
            array = lib.initValue(array, []);
            if (array.length < 1) return;
            return array.reduce(function(a, b) {
                return a > b ? a : b;
            });
        },
        min: function(array) { // 配列から最小値を求める
            array = lib.initValue(array, []);
            if (array.length < 1) return;
            return array.reduce(function(a, b) {
                return a < b ? a : b;
            });
        },
        makeArray: function(num) { // 0からnum-1までの連続した数値の配列を返す
            if (!lib.judgeType(num, "Number") || num < 1) return [];
            return new Array(++num).join(0).split("").map(function(v, i) {
                return i;
            });
        },
        nonOverlapArray: function(array) { // 配列を重複排除して返す
            array = lib.initValue(array, []);
            if (array.length < 2) return array;
            // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
            else if (lib.context.isAvailableES6) return Array.from(new Set(array)); // ES6構文が使えるならSetで重複排除
            else array.filter(function(x, i) {
                return array.indexOf(x) === i;
            });
        },
        randArray: function(array) { // 配列からランダムな要素を返す
            array = lib.initValue(array, []);
            if (array.length < 1) return;
            return array[Math.floor(Math.random() * array.length)];
        },
        shuffle: function(array) { // 配列をシャッフルして返す
            array = lib.initValue(array, []);
            if (array.length < 2) return array;
            lib.loop(array.length, function(n, i, arr) { // 配列の長さ分ループ
                var idx = Math.floor(Math.random() * arr.length--), // 0から配列の長さまでの乱数を生成した後に配列の長さをデクリメント
                    v = array[arr.length];
                array[arr.length] = array[idx];
                array[idx] = v;
            });
            return array;
        },
        //--------------------------------------------------
        // 文字列関連
        repeat: function(str, num) { // strをnum回繰り返した文字列を返す
            return new Array(lib.initValue(num, 0) + 1).join(lib.initValue(str, ""));
        },
        count: function(str, keyword) { // 文字列に特定の文字列がいくつ含まれているか
            str = lib.initValue(str, "");
            keyword = lib.initValue(keyword, "");
            return str === "" || keyword === "" ? 0 : (str.match(new RegExp(keyword, "g")) || []).length;
        },
        makeBase: function(num) { // 2から62までの進数の使用文字列を返す
            num = lib.initValue(num, 2);
            return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(0, num < 2 ? 2 : num > 62 ? 62 : num);
        },
        toHan: function(str) { // 全角 => 半角
            return lib.initValue(str, "").replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
            });
        },
        toZen: function(str) { // 半角 => 全角
            return lib.initValue(str, "").replace(/[A-Za-z0-9!-~]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
            });
        },
        toHira: function(str) { // カナ => ひら
            return lib.initValue(str, "").replace(/[\u30a1-\u30f6]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0x60);
            });
        },
        toKana: function(str) { // ひら => カナ
            return lib.initValue(str, "").replace(/[\u3041-\u3096]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) + 0x60);
            });
        },
        //--------------------------------------------------
        // URLとメールアドレス関連
        parseDomainLike: function(str) { // ドメインのような形式の文字列を配列にして返す
            str = lib.initValue(str, "");
            return str === "" ? [] : str.replace(/^.+?\/\/|\/.*$/g, "").split(".");
        },
        parseURL: function(url) { // URLを解析する
            url = lib.initValue(url, lib.context.href);
            var m = url.match(/^(https?:\/\/[\w!\/\+\-_~=;\.,\*&@\$%\(\)'\[\]]+)(\?[^#]*)?(#.*)?$/) || [];
            return {
                _matchResult: m.length > 0 ? m : null, // matchの結果
                isURL: m.length > 0 ? true : false, // URLかどうか
                url: m[0] ? m[0] : "", // URL
                address: m[1] ? m[1] : "", // URLクエリパラメータ文字列とURIフラグメントを除外したアドレス
                domain: lib.parseDomainLike(url), // ドメイン
                search: m[2] ? m[2] : "", // URLクエリパラメータ文字列
                param: (function() { // URLクエリパラメータ
                    var param = {};
                    (m[2] ? m[2] : "").slice(1).split("&").forEach(function(v) {
                        var q = v.split("=");
                        if (q[0] === "") return;
                        else if (q.length < 2) param[q[0]] = "";
                        else param[q[0]] = q[1];
                    });
                    return param;
                })(),
                fragment: m[3] ? m[3] : "" // URIフラグメント
            };
        },
        parseMailAddress: function(mailAddress) { // メールアドレスを解析する
            mailAddress = lib.initValue(mailAddress, "");
            var m = mailAddress.match(/^([\w\-\._]+)@([\w\-\._]+\.[A-Za-z]+)$/) || [];
            return {
                _matchResult: m.length > 0 ? m : null, // matchの結果
                isMailAddress: m.length > 0 ? true : false, // メールアドレスかどうか
                mailAddress: m[0] ? m[0] : "", // メールアドレス
                local: lib.parseDomainLike(m[1]), // ローカル部
                domain: lib.parseDomainLike(m[2]) // ドメイン
            };
        },
        getURLFromStr: function(str) { // 文字列からURLを取得して配列で返す
            return lib.initValue(str, "").match(/https?:\/\/[\w!\?\/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/g) || [];
        },
        getMailAddressFromStr: function(str) { // 文字列からメールアドレスを取得して配列で返す
            return lib.initValue(str, "").match(/[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+/g) || [];
        },
        //--------------------------------------------------
        // 変換関連
        BaseN: (function() { // N進数を作成するクラス
            // コンストラクタ
            function BaseN(base) { // N進数を作成するクラス
                if (lib.judgeType(base, "Number")) base = lib.makeBase(base);
                else base = lib.nonOverlapArray(lib.initValue(base, lib.makeBase(2)).split("")).join("");
                if (base.length < 2) base = lib.makeBase(2);
                if (!(this instanceof BaseN)) return new BaseN(base); // 作成されたオブジェクトじゃないならnew演算子でコンストラクタの呼び出し
                // プロパティ
                this.base = base;
            };

            // メソッド
            var p = BaseN.prototype; // プロトタイプ
            p.encode = function(num) { // 10進数 => N進数
                if (!lib.initValue(num, 0)) return this.base[0];
                var str = "";
                while (num) {
                    num = Math.floor(num);
                    str = this.base[num % this.base.length] + str;
                    num /= this.base.length;
                };
                return str.slice(1);
            };
            p.decode = function(str) { // N進数 => 10進数
                var base = this.base;
                str = lib.initValue(str, "");
                if (!str) return 0;
                return str.split("").reverse().map(function(v, i) {
                    return base.indexOf(v) * Math.pow(base.length, i);
                }).reduce(function(total, v) {
                    return total + v;
                });
            };

            return BaseN;
        })(),
        //--------------------------------------------------
        // 取得関連
        getContext: function(userAgent) { // OS名とブラウザ名を返す
            var ua = (lib.judgeType(userAgent, "String") ? userAgent :
                typeof window.navigator === "object" && typeof window.navigator.userAgent === "string" ? window.navigator.userAgent : "").toLowerCase();
            return {
                browser: lib.context.isNode ? null : lib._matchPatterns(ua, {
                    "Microsoft Edge": /edg(e|a|ios)/,
                    "Opera": /opera|opr/,
                    "Samsung Internet Browser": /samsungbrowser/,
                    "UC Browser": /ucbrowser/,
                    "Google Chrome": /ch(rome|ios)/,
                    "Mozilla Firefox": /firefox|fxios/,
                    "Safari": /safari/,
                    "Internet Explorer": /msie|trident/
                }),
                os: (function() {
                    if (lib.context.isNode && !lib.judgeType(userAgent, "String")) {
                        var osNames = {
                                "win32": "Microsoft Windows",
                                "darwin": "macOS",
                                "linux": "Linux"
                            },
                            os = process.platform;
                        if (!(os in osNames)) return null;
                        return osNames[os];
                    } else return lib._matchPatterns(ua, {
                        "Microsoft Windows": /windows nt/,
                        "Android": /android/,
                        "iOS": /ip(hone|ad)/,
                        "macOS": /mac os x/
                    });
                })()
            };
        },
        getIP: function(callback) { // IPアドレス等の情報を取得してcallbackの引数に渡す
            if (!lib.judgeType(callback, "Function")) return;
            var url = "https://ipinfo.io/?callback=a",
                pattern = /\{.*?\}/;
            if (lib.context.isNode) { // Node.jsの場合
                require("https").request(url, function(res) {
                    var data = "";
                    res.on("data", function(chunk) {
                        data += chunk;
                    });
                    res.on("end", function() {
                        var m = data.match(pattern);
                        if (m) callback(JSON.parse(m[0]));
                    });
                }).end();
            } else if (lib.judgeType(window.XMLHttpRequest, "Function")) { // XMLHttpRequestが利用できる場合
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "text";
                xhr.onload = function() {
                    var m = xhr.response.match(pattern);
                    if (m) callback(JSON.parse(m[0]));
                };
                xhr.send();
            };
        },
        //--------------------------------------------------
        // その他
        try: function(func) { // エラーが起きても止まらないように関数を実行する
            if (!lib.judgeType(func, "Function")) return;
            try {
                return func.apply(window, Array.prototype.slice.call(arguments, 1)); // 関数の返り値を返す
            } catch (e) {
                console.error(e);
                return e; // エラーメッセージを返す
            };
        },
        loop: function(num, func) { // 関数を指定回数実行する
            if (num < 1 || !lib.judgeType(num, "Number") ||
                !lib.judgeType(func, "Function")) return;
            new Array(++num).join(0).split("").map(function(v, i) {
                return ++i;
            }).some(func);
        },
        //--------------------------------------------------
        // プロパティ
        context: { // 環境
            href: typeof location === "object" ? location.href : "",
            isNode: typeof process === "object" && typeof process.release === "object" && process.release.name === "node", // Node.jsかどうかの真偽値
            isAvailableES6: typeof Symbol === "function" && typeof Symbol() === "symbol" // Symbolで判定したES6構文が利用可能かどうかの真偽値
        },
        conflictProperty: {}, // 競合したキーの値を格納するオブジェクト
        //--------------------------------------------------
        // プライベート関数 //////////////////////////////////////////////////
        _matchPatterns: function(str, patterns) { // 値のパターンにあったキーを返す
            patterns = lib.initValue(patterns, {});
            var idx = Object.keys(patterns).map(function(k) {
                return patterns[k].test(lib.initValue(str, ""));
            }).indexOf(true);
            return idx === -1 ? null : Object.keys(patterns)[idx];
        }
        //////////////////////////////////////////////////////////////////
    };

    // ライブラリ名と競合しているエクスポート先のキーの値をライブラリに格納
    libNames.forEach(function(k) {
        lib.conflictProperty[k] = (lib.context.isNode ? undefined : window[k]);
    });

    // エクスポート
    if (lib.context.isNode) module.exports = lib;
    else libNames.forEach(function(k) {
        window[k] = lib;
    });
})(typeof window === "object" ? window : this);
