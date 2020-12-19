(function(globalObject, undefined) {
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
                ].join(" ");
            }).join("\n");
        },
        //--------------------------------------------------
        // 型関連
        getType: function(x) { // 型名を返す
            return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
        },
        isType: function(x, typeName) { // xが指定された型名か判定する
            var type = lib.getType(x),
                comparisonType = lib.getType(typeName);
            if (comparisonType === "String") return type === typeName;
            else if (comparisonType === "Array") return typeName.indexOf(type) !== -1;
            else return false;
        },
        initType: function(val, defaultVal) { // valの型が異なる場合defaultValの値を返す
            return lib.isType(val, lib.getType(defaultVal)) ? val : defaultVal;
        },
        initParam: function(param, defaultParam) { // キーの型が異なる場合defaultParamのキーで上書きして返す
            if (!(lib.isType(param, "Object") && lib.isType(defaultParam, "Object") ||
                    lib.isType(param, "Array") && lib.isType(defaultParam, "Array"))) return {};
            var resultParam = {};
            Object.keys(param).forEach(function(k) {
                resultParam[k] = (lib.isType(param[k], lib.getType(defaultParam[k])) ? param[k] : defaultParam[k]);
            });
            return lib.isType(param, "Object") ? resultParam : Object.keys(resultParam).map(function(k) {
                return resultParam[k];
            });
        },
        //--------------------------------------------------
        // 環境によって仕様が変わりやすい操作
        copy: function(str) { // 文字列をクリップボードにコピーする
            str = lib.initType(str, "");
            if (lib.context.isNode) { // Node.jsの場合
                try {
                    require("clipboardy").writeSync(str);
                } catch (e) {
                    lib._displayWarn("clipboardy");
                };
            } else if (typeof navigator === "object" && typeof navigator.clipboard === "object" &&
                typeof location === "object" && location.protocol === "https:") navigator.clipboard.writeText(str); // Async Clipboard APIが利用可能な場合
            else if (lib.context.isAvailableDocument) { // 上記以外でDocumentが利用可能な場合
                var e = document.createElement("textarea");
                e.value = e;
                document.body.appendChild(e);
                e.select();
                document.execCommand("copy");
                e.remove();
            };
        },
        downloadBlob: function(filename, blob) { // blobからファイルを保存する
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            else if (!lib.context.isAvailableES6) return lib._displayWarn("es6");
            else if (!lib.isType(filename, "String") || filename === "" || !lib.isType(blob, "Blob")) return;
            var m = filename.match(/([^\.]*)(\..+)?/),
                e = document.createElement("a");
            e.href = URL.createObjectURL(blob);
            e.target = "_blank";
            e.download = m[1] + (m[2] || "");
            e.click();
            return e;
        },
        downloadText: function(title, str) { // 文字列をテキストファイル形式で保存する
            str = lib.initType(str, "");
            if (!lib.isType(title, "String") || title === "") title = "download";
            if (lib.context.isNode) require("fs").writeFileSync(title + ".txt", str);
            else return lib.downloadBlob(title + ".txt", new Blob([
                new Uint8Array([0xEF, 0xBB, 0xBF]), // 文字化け対策
                str.replace(/\n/g, "\r\n")
            ], {
                type: "text/plain"
            }));
        },
        downloadImage: function(title, base64) { // Base64から画像を保存
            if (!lib.isType(base64, "String") || base64 === "") return;
            if (!lib.isType(title, "String") || title === "") title = "download";
            var m = base64.match(/^data:(image\/([a-z]+));base64,(.+)$/);
            if (!m) return;
            if (lib.context.isNode) require("fs").writeFileSync(title + "." + m[2], m[3], "base64");
            else {
                var b = atob(m[3]),
                    cont = new Uint8Array(b.length);
                for (var i = 0; i < b.length; i++) cont[i] = b.charCodeAt(i);
                return lib.downloadBlob(title + "." + m[2], new Blob([cont], {
                    type: m[1]
                }));
            };
        },
        //--------------------------------------------------
        // 配列関連
        max: function(array) { // 配列から最大値を求める
            array = lib.initType(array, []);
            if (array.length < 1) return Infinity;
            return array.reduce(function(a, b) {
                return a > b ? a : b;
            });
        },
        min: function(array) { // 配列から最小値を求める
            array = lib.initType(array, []);
            if (array.length < 1) return -Infinity;
            return array.reduce(function(a, b) {
                return a < b ? a : b;
            });
        },
        makeArray: function(count) { // 0からcount-1までの連続した数値の配列を返す
            if (count < 1 || isNaN(count) || !isFinite(count) || !lib.isType(count, "Number")) return [];
            return new Array(++count).join(0).split("").map(function(v, i) {
                return i;
            });
        },
        nonOverlapArray: function(array) { // 配列を重複排除して返す
            array = lib.initType(array, []);
            if (array.length < 2) return array;
            // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
            if (lib.context.isAvailableES6) return Array.from(new Set(array)); // ES6構文が使えるならSetで重複排除
            else return array.filter(function(x, i) {
                return array.indexOf(x) === i;
            });
        },
        randArray: function(array) { // 配列からランダムな要素を返す
            array = lib.initType(array, []);
            return array[Math.floor(Math.random() * array.length)];
        },
        shuffle: function(array) { // 配列をシャッフルして返す
            array = lib.initType(array, []);
            lib.loop(array.length, function(a, b, arr) { // 配列の長さ分ループ
                var i = Math.floor(Math.random() * arr.length--), // 0から配列の長さまでの乱数を生成した後に配列の長さをデクリメント
                    v = array[arr.length];
                array[arr.length] = array[i];
                array[i] = v;
            });
            return array;
        },
        //--------------------------------------------------
        // 文字列関連
        repeat: function(str, count) { // strをcount回繰り返した文字列を返す
            count = lib.initType(count, 0);
            if (isNaN(count) || !isFinite(count) || count < 0) count = 0;
            return new Array(++count).join(lib.initType(str, ""));
        },
        count: function(str, keyword) { // 文字列に特定の文字列がいくつ含まれているか
            str = lib.initType(str, "");
            keyword = lib.initType(keyword, "");
            return str === "" || keyword === "" ? 0 : (str.match(new RegExp(keyword, "g")) || []).length;
        },
        makeBase: function(base) { // N進数の使用文字列を返す
            if (!lib.isType(base, "String")) return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(0, lib.initRange(base, 2, 62));
            base = lib.nonOverlapArray(base.split("")).join("");
            return base.length < 2 ? "01" : base;
        },
        toCase: function(str, caseType) { // 指定したケースに変換して返す
            str = lib.initType(str, "");
            caseType = lib.initType(caseType, "");
            var caseList = {
                han: str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(c) { // 全角 => 半角
                    return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
                }),
                zen: str.replace(/[A-Za-z0-9!-~]/g, function(c) { // 半角 => 全角
                    return String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
                }),
                hira: str.replace(/[\u30a1-\u30f6]/g, function(c) { // カナ => ひら
                    return String.fromCharCode(c.charCodeAt(0) - 0x60);
                }),
                kana: str.replace(/[\u3041-\u3096]/g, function(c) { // ひら => カナ
                    return String.fromCharCode(c.charCodeAt(0) + 0x60);
                })
            };
            return caseType in caseList ? caseList[caseType] : caseList;
        },
        matchFromPatternList: function(str, patternList) { // 値のパターンにあったキーを返す
            patternList = lib.initType(patternList, {});
            var i = Object.keys(patternList).map(function(k) {
                return lib.initType(patternList[k], /^$/).test(lib.initType(str, ""));
            }).indexOf(true);
            return i === -1 ? null : Object.keys(patternList)[i];
        },
        encodeImage: function(str, callback) { // 文字列を画像化してcallbackの引数に渡す
            if (!lib.context.isAvailableDocument || !lib.isType(callback, "Function")) return;
            var arr = [];
            lib.initType(str, "").split("").forEach(function(c) {
                var n = c.charCodeAt();
                if (n < 128) arr.push(n);
                else {
                    arr.push(128);
                    arr.push((0xff00 & n) >> 8); // 前
                    arr.push(0xff & n); // 後
                };
            });
            var width = Math.ceil(Math.sqrt(arr.length / 3)),
                cv = document.createElement("canvas");
            cv.setAttribute("width", width);
            cv.setAttribute("height", width);
            var ctx = cv.getContext("2d"),
                imgData = ctx.getImageData(0, 0, width, width),
                cnt = 0;
            for (var i = 0; i < arr.length; i++) {
                var x = i * 4;
                for (var o = 0; o < 3; o++) imgData.data[x + o] = arr[cnt++] || 0;
                imgData.data[x + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
            };
            ctx.putImageData(imgData, 0, 0);
            callback(cv.toDataURL("image/png"));
        },
        decodeImage: function(base64, callback) { // 画像を文字列化してcallbackの引数に渡す
            if (!lib.context.isAvailableDocument || !lib.isType(base64, "String") || !lib.isType(callback, "Function")) return;
            var img = new Image();
            img.onload = function() {
                var width = img.width,
                    height = img.height,
                    cv = document.createElement("canvas");
                cv.setAttribute("width", width);
                cv.setAttribute("height", height);
                var ctx = cv.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var data = ctx.getImageData(0, 0, width, height).data,
                    arr = [],
                    str = "";
                for (var i = 0; i < data.length; i++) {
                    for (var o = 0; o < 3; o++) arr.push(data[i * 4 + o]);
                };
                for (var i = 0; i < arr.length; i++) {
                    var n = arr[i];
                    if (n < 128) str += String.fromCharCode(n);
                    else if (n === 128) {
                        str += String.fromCharCode((arr[i + 1] << 8) + arr[i + 2]);
                        i += 2;
                    };
                };
                callback(str.replace(/\0+$/, ""));
            };
            img.src = base64;
        },
        encodeBase58: function(str) { // 文字列 => 58進数
            // 0~9, a~z, A~V => 無変換、左端にWを追加
            // 58進数の一桁 => 左端にXを追加
            // 58進数の二桁 => 左端にYを追加
            // 58進数の三桁 => 左端にZを追加
            str = lib.initType(str, "");
            var to58 = new lib.BaseN(58),
                sign = "WXYZ";
            return str.split("").map(function(c) {
                if (to58.base.indexOf(c) !== -1) return sign[0] + c + sign[0];
                else {
                    var encoded = to58.encode(c.charCodeAt()),
                        len = encoded.length;
                    if (len > 3) return ""; // 58**3以上のUnicodeは空文字
                    return sign[len] + (lib.repeat("0", len) + encoded).slice(-len) + sign[len];
                };
            }).join("").replace(/(W|X|Y|Z)\1/g, "").replace(/(W|X|Y|Z)(?=(W|X|Y|Z))/g, "").slice(0, -1).replace(/^W/, "");
        },
        decodeBase58: function(str) { // 58進数 => 文字列
            var to58 = new lib.BaseN(58),
                sign = "WXYZ";
            return lib.initType(str, "").replace(/(W|X|Y|Z)[^WXYZ]*/g, function(v) {
                var s = v.slice(1),
                    i = sign.indexOf(v[0]);
                if (!i) return s;
                return s.replace(new RegExp(".{" + i + "}", "g"), function(n) {
                    return String.fromCharCode(to58.decode(n));
                });
            });
        },
        //--------------------------------------------------
        // アドレス関連
        parseDomain: function(str) { // ドメインのような形式の文字列を配列にして返す
            str = lib.initType(str, "");
            return str === "" ? [] : str.replace(/^.+?\/\/|\/.*$/g, "").split(".");
        },
        parseURL: function(url) { // URLを解析する
            url = lib.initType(url, lib.context.href);
            var m = url.match(/^((https?:)\/\/[\w!\/\+\-_~=;\.,\*&@\$%\(\)'\[\]]+)(\?[^#]*)?(#.*)?$/) || [];
            return {
                _matchResult: m.length > 0 ? m : null, // matchの結果
                isURL: m.length > 0, // URLかどうか
                href: m[0] || "", // URL
                address: m[1] || "", // URLクエリパラメータ文字列とURIフラグメントを除外したアドレス
                protocol: m[2] || "", // プロトコル
                domain: lib.parseDomain(m[1] || ""), // ドメイン
                path: (m[1] || "").replace(/https?:\/\/[^\/]+/, "").match(/[^\/]+/g) || [], // パス
                search: m[3] || "", // URLクエリパラメータ文字列
                param: (function() { // URLクエリパラメータ
                    var param = {};
                    lib.loop((m[3] || "").slice(1).split("&"), function(v) {
                        var q = v.split("=");
                        if (q[0] === "") return;
                        else if (q.length < 2) param[q[0]] = "";
                        else param[q[0]] = q[1];
                    });
                    return param;
                })(),
                fragment: m[4] || "" // URIフラグメント
            };
        },
        parseMailAddress: function(mailAddress) { // メールアドレスを解析する
            mailAddress = lib.initType(mailAddress, "");
            var m = mailAddress.match(/^([\w\-\._]+)@([\w\-\._]+\.[A-Za-z]+)$/) || [];
            return {
                _matchResult: m.length > 0 ? m : null, // matchの結果
                isMailAddress: m.length > 0, // メールアドレスかどうか
                mailAddress: m[0] || "", // メールアドレス
                local: lib.parseDomain(m[1]), // ローカル部
                domain: lib.parseDomain(m[2]) // ドメイン
            };
        },
        extractURL: function(str) { // 文字列からURLを抽出する
            return lib.initType(str, "").match(/https?:\/\/[\w!\?\/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/g) || [];
        },
        extractMailAddress: function(str) { // 文字列からメールアドレスを抽出する
            return lib.initType(str, "").match(/[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+/g) || [];
        },
        //--------------------------------------------------
        // 数値関連
        initRange: function(num, min, max, safeNaN) { // minからmaxまでの範囲にして返す
            num = lib.initType(num, -Infinity);
            if (!lib.isType(min, "Number") || isNaN(min)) min = -Infinity;
            if (!lib.isType(max, "Number") || isNaN(max)) max = Infinity;
            if (min > max) min = max;
            if (!lib.initType(safeNaN, false) && isNaN(num)) return min;
            return num < min ? min : // minより小さい時
                num > max ? max : // maxより大きい時
                num; // 範囲内の時
        },
        randInt: function(min, max) { // ランダムな整数を返す
            if (!lib.isType(min, "Number") || isNaN(min) || min === -Infinity) min = Number.MIN_SAFE_INTEGER;
            if (!lib.isType(max, "Number") || isNaN(max) || max === Infinity) max = Number.MAX_SAFE_INTEGER;
            if (min > max) min = max;
            return Math.floor(Math.random() * Math.abs(max - min + 1)) + min;
        },
        factorial: function(num, safeNaN) { // 階乗して返す
            num = lib.initType(num, 1);
            if (lib.initType(safeNaN, false) && isNaN(num) || num === Infinity) return num;
            else if (num < 2 || isNaN(num)) return 1;
            return num * lib.factorial(--num);
        },
        BaseN: (function() { // N進数を作成するクラス
            // コンストラクタ
            function BaseN(base) { // N進数を作成するクラス
                if (!(this instanceof BaseN)) return new BaseN(base); // 作成されたオブジェクトじゃないならnew演算子でコンストラクタの呼び出し
                this.base = lib.makeBase(base);
            };

            // メソッド
            var p = BaseN.prototype; // プロトタイプ
            p.encode = function(num) { // 10進数 => N進数
                num = Math.floor(lib.initType(num, 0));
                if (num < 1 || isNaN(num) || num === -Infinity) return this.base[0];
                else if (num === Infinity) return this.base[this.base.length - 1];
                var str = "";
                while (num) {
                    num = Math.floor(num);
                    str = this.base[num % this.base.length] + str;
                    num /= this.base.length;
                };
                return str.slice(1);
            };
            p.decode = function(str) { // N進数 => 10進数
                str = lib.initType(str, "");
                var base = this.base;
                if (str === "" || str.split("").some(function(v) {
                        return base.indexOf(v) === -1;
                    })) return 0;
                return str.split("").reverse().map(function(v, i) {
                    return base.indexOf(v) * Math.pow(base.length, i);
                }).reduce(function(total, v) {
                    return total + v;
                });
            };

            return BaseN;
        })(),
        //--------------------------------------------------
        // DOM操作関連
        initElement: function(elm) { // 適切なHTML要素を返す
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            elm = elm instanceof HTMLElement ? elm :
                typeof elm === "string" ? document.querySelector(elm || "body") || document.body :
                document.body;
            return elm;
        },
        setCSS: function(elm, css) { // 要素にCSSを設定する
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            elm = lib.initElement(elm);
            css = lib.initType(css, {});
            lib.loop(css, function(k) {
                elm.style[k] = css[k];
            });
            return elm;
        },
        getCSS: function(elm) { // 要素のCSSを取得する
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            elm = lib.initElement(elm);
            return elm.currentStyle || document.defaultView.getComputedStyle(elm, "");
        },
        getFontSize: function(elm) { // 要素のフォントサイズを取得する
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            elm = lib.initElement(elm);
            return Number(lib.getCSS(elm).fontSize.slice(0, -2)) + 1;
        },
        getRGB: function(color) { // color文字列をRGBの配列にして返す
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            var e = document.createElement("div");
            document.body.appendChild(e);
            e.style.color = lib.initType(color, "");
            var m = lib.getCSS(e).color.match(/[0-9]+/g);
            e.remove();
            return m ? m.map(function(n) {
                return Number(n);
            }) : [0, 0, 0];
        },
        setWallpaper: function(src, cover) { // 壁紙を設定する
            if (!lib.context.isAvailableDocument) return lib._displayWarn("document");
            cover = lib.initParam(cover, {
                color: "white",
                opacity: 0.8
            });
            var rgb = lib.getRGB(cover.color),
                e = document.createElement("div");
            document.body.appendChild(e);
            lib.setCSS(e, {
                zIndex: "-100000",
                backgroundColor: rgb ? "rgba(" + rgb.join(",") + "," + cover.opacity + ")" : cover.color,
                position: "fixed",
                top: "0",
                right: "0",
                bottom: "0",
                left: "0"
            });
            if (!lib.isType(src, ["String", "Null", "Undefined"])) return e;
            lib.setCSS(document.body, {
                backgroundImage: src === "" || lib.isType(src, ["Null", "Undefined"]) ? "none" : 'url("' + src + '")',
                backgroundAttachment: "fixed", // コンテンツの高さが画像の高さより大きい場合動かないように固定
                backgroundPosition: "center center", // 画像を常に天地左右の中央に配置
                backgroundSize: "cover", // 表示するコンテナの大きさに基づいて背景画像を調整
                backgroundRepeat: "no-repeat" // 画像をタイル状に繰り返し表示しない
            });
            return e;
        },
        //--------------------------------------------------
        // その他
        getContext: function(userAgent) { // OS名とブラウザ名を返す
            userAgent = (lib.isType(userAgent, "String") ? userAgent :
                typeof navigator === "object" ? navigator.userAgent : "").toLowerCase();
            return {
                browser: lib.matchFromPatternList(userAgent, {
                    "Microsoft Edge": /edg(e|a|ios)/,
                    "Opera": /opera|opr/,
                    "Samsung Internet Browser": /samsungbrowser/,
                    "UC Browser": /ucbrowser/,
                    "Google Chrome": /ch(rome|ios)/,
                    "Mozilla Firefox": /firefox|fxios/,
                    "Safari": /safari/,
                    "Internet Explorer": /msie|trident/
                }) || "",
                os: (function() {
                    if (lib.context.isNode && userAgent === "") {
                        var osNames = {
                                "win32": "Microsoft Windows",
                                "darwin": "macOS",
                                "linux": "Linux"
                            },
                            os = process.platform;
                        return os in osNames ? osNames[os] : "";
                    } else return lib.matchFromPatternList(userAgent, {
                        "Microsoft Windows": /windows nt/,
                        "Android": /android/,
                        "iOS": /ip(hone|ad)/,
                        "macOS": /mac os x/
                    }) || "";
                })()
            };
        },
        getIP: function(callback) { // IPアドレス等の情報を取得してcallbackの引数に渡す
            if (!lib.initType(callback, "Function")) return;
            var url = "https://ipinfo.io/?callback=a",
                pattern = /\{.*?\}/;
            if (lib.context.isNode) { // Node.jsの場合
                require("https").request(url, function(res) {
                    var data = [];
                    res.on("data", function(chunk) {
                        data.push(chunk);
                    });
                    res.on("end", function() {
                        var m = data.join("").match(pattern);
                        if (m) callback(JSON.parse(m[0]));
                    });
                }).end();
            } else if (typeof XMLHttpRequest === "function") { // XMLHttpRequestが利用可能な場合
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
        tryFunc: function(func, fail, always) { // エラーが起きても止まらないように関数を実行する
            try { // 実行
                return lib.initType(func, function() {}).apply(window, Array.prototype.slice.call(arguments, 3));
            } catch (e) { // エラー時
                return lib.initType(fail, function(e) {
                    return e;
                })(e);
            } finally { // 終了時
                lib.initType(always, function() {})();
            };
        },
        loop: function(count, func) { // 関数を指定回数かオブジェクトまたは配列の長さ分実行する
            if (!lib.isType(func, "Function")) return;
            if (lib.isType(count, "Number") && count > 0 && !isNaN(count) && isFinite(count)) lib.makeArray(count).some(func);
            else if (lib.isType(count, "Object") && Object.keys(count).length > 0) Object.keys(count).some(func);
            else if (lib.isType(count, "Array") && count.length > 0) count.some(func);
        },
        //--------------------------------------------------
        // プロパティ
        context: { // 環境
            href: typeof location === "object" ? location.href : "", // 現在のURL
            isNode: typeof process === "object" && typeof process.release === "object" && process.release.name === "node", // Node.jsかどうか
            isAvailableDocument: typeof document === "object" && document instanceof Document, // documentの利用可否
            isAvailableES6: typeof Symbol === "function" && typeof Symbol() === "symbol" // Symbolで判定したES6構文の利用可否
        },
        conflict: {}, // 競合しているグローバルオブジェクトのプロパティを格納するオブジェクト
        //--------------------------------------------------
        // プライベート関数 //////////////////////////////////////////////////
        _displayWarn: function(warnType) { // 警告を表示する
            warnType = lib.initType(warnType, "");
            var warns = {
                "document": "This method can only be executed in an environment where document is available.",
                "es6": "This method is only available in ES6 (ES2015) and above.",
                "clipboardy": 'If you want to use this method with Node.js, you need to run "npm install clipboardy".'
            };
            if (warnType in warns) console.warn(warns[warnType]);
        }
        //////////////////////////////////////////////////////////////////
    };

    // 競合しているグローバルオブジェクトのプロパティをライブラリに格納
    libNames.forEach(function(k) {
        lib.conflict[k] = globalObject[k];
    });

    // エクスポート
    if (lib.context.isNode) module.exports = lib;
    else libNames.forEach(function(k) {
        globalObject[k] = lib;
    });
})(typeof window === "object" ? window : this);
