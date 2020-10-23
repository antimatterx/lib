(function(window, undefined) {
    'use strict';
    // https://github.com/yaju1919/lib/blob/master/lib/yaju1919.js
    var antimatterx = {
        // 型判定
        getType: function(x) { // 型を返す
            return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
        },
        judgeType: function(x, typeName) { // xが指定された型名ならtrueを返す
            var type = antimatterx.getType(x);
            switch (yaju1919.getType(typeName)) {
                case "String":
                    return typeName === type;
                case "Array":
                    return typeName.indexOf(type) !== -1;
                default:
                    return null;
            };
        },
        //--------------------------------------------------
        // 文字列操作
        repeat: function(str, num) { // strをnum回繰り返した文字列を返す
            return new Array(num + 1).join(str);
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
        }
        //--------------------------------------------------
    };
    window.antimatterx = antimatterx;
})(typeof window === "object" ? window : this);
