/*!
 * AntimatterX JavaScript Library v2.0.0
 * https://github.com/AntimatterX/lib/blob/main/lib/$$amx.js
 * 
 * Copyright (c) 2021 AntimatterX
 * 
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 * 
 * To use the 'copy' method with Node.js, you need the 'clipboardy' package.
 * https://www.npmjs.com/package/clipboardy
 * 
 * This library is declared globally in non-Node.js environments with the following name.
 * $$antimatterx, $$amx
 * 
 * Last Update: 2021-03-05T16:03:12.310Z
 */
(function _main(_root, undefined) {
    'use strict';
    // 環境
    var _ctx = {
        libKey: [],
        conflict: {},
        fn: {
            /**
             * グローバルのライブラリのプロパティを読み込み前に戻します。
             * @returns {Object<string, ?*>} 読み込み前のプロパティのリストをオブジェクトで返します。
             * @example
             * ObjectWithThisMethod.noConflict();
             */
            noConflict: function () {
                for (var i = 0; i < _ctx.libKey.length; i++) {
                    var key = _ctx.libKey[i];
                    if (key in _ctx.conflict) _root[key] = _ctx.conflict[key];
                }
                return _ctx.conflict;
            },
            /**
             * 型名を返します。
             * @param {?*} [x=undefined] 型名を取得する値を渡します。
             * @returns {string} 第一引数に渡した値の型名の文字列を返します。
             * @example
             * // 'Array'
             * ObjectWithThisMethod.getType([]);
             */
            getType: function (x) {
                return Object.prototype.toString.call(x).slice(8, -1);
            },
            /**
             * 指定した型名か判定します。
             * @param {?*} x 判定する値を渡します。
             * @param {string|RegExp|Array<string>} typeName 型名の文字列か、型名にマッチする正規表現か、型名の配列を渡します。
             * @returns {boolean} 第一引数に渡した値の型名が第二引数に渡された型名か判定して真偽値で返します。
             * @example
             * // true
             * ObjectWithThisMethod.isType('Hello, World!', 'String');
             * ObjectWithThisMethod.isType(document.body, /Element$/);
             * ObjectWithThisMethod.isType('Hello, World!', [ 'String', 'Number' ]);
             * ObjectWithThisMethod.isType(12345, [ 'String', 'Number' ]);
             */
            isType: function (x, typeName) {
                var xType = _ctx.fn.getType(x);
                switch (_ctx.fn.getType(typeName)) {
                    case 'String':
                        return xType === typeName;
                    case 'RegExp':
                        return typeName.test(xType);
                    case 'Array':
                        return typeName.indexOf(xType) > -1;
                    default:
                        return false;
                }
            },
            /**
             * デフォルト値の型にキャストします。
             * @param {?*} x キャストする値を渡します。
             * @param {?*} defaultValue デフォルトの値を渡します。
             * @param {string|RegExp|Array<string>} [allowType=[]] デフォルト値の型以外にも許容する
             *     型の型名の文字列か、型名にマッチする正規表現か、型名の配列を渡します。
             * @returns {?*} デフォルト値の型にキャストされた値を返します。
             * @example
             * // 12345
             * ObjectWithThisMethod.castType('Hello, World!', 12345);
             * 
             * // 'Hello, World!'
             * ObjectWithThisMethod.castType('Hello, World!', 12345, 'String');
             */
            castType: function (x, defaultValue, allowType) {
                return _ctx.fn.isType(x, _ctx.fn.isType(allowType, 'RegExp') ? allowType :
                    [_ctx.fn.getType(defaultValue)].concat(
                        _ctx.fn.isType(allowType, 'Array') ? allowType :
                            typeof allowType === 'string' ? [allowType] :
                                []
                    )) ? x : defaultValue;
            },
            /**
             * オブジェクトのプロパティをデフォルト値のオブジェクトのプロパティの型にキャストします。
             * @param {Object<string, ?*>} param キャストするオブジェクトを渡します。
             * @param {Object<string, ?*>} defaultParam デフォルト値のオブジェクトを渡します。
             * @param {string|RegExp|Array<string>|Object<string, string|RegExp|Array<string>>} [allowTypeList={}] デフォルト値のオブジェクトのプロパティの型以外にも許容する
             *     型名の文字列か、型名にマッチする正規表現または型名の配列とデフォルト値のプロパティ名が組のオブジェクトを渡します。
             * @returns {Object<string. ?*>} デフォルト値の型にキャストされたオブジェクトを返します。
             * @example
             * // { foo: 12345, bar: 'Hello, World!', foobar: 'foobar' }
             * ObjectWithThisMethod.castParam({ foo: 12345, bar: 'Hello, World!', foobar: null }, { foo: 0, bar: '', foobar: 'foobar' });
             */
            castParam: function (param, defaultParam, allowTypeList) {
                param = _ctx.fn.castType(param, {});
                defaultParam = _ctx.fn.castType(defaultParam, {});
                var defaultParamKeys = Object.keys(defaultParam);
                allowTypeList = (function () {
                    switch (_ctx.fn.getType(allowTypeList)) {
                        case 'String':
                        case 'RegExp':
                        case 'Array':
                            var obj = {};
                            for (var i = 0; i < defaultParamKeys.length; i++) obj[defaultParamKeys[i]] = allowTypeList;
                            return obj;
                        default:
                            return _ctx.fn.castType(allowTypeList, {});
                    }
                })();
                var clone = (function () {
                    var obj = {},
                        propKeys = Object.keys(param);
                    for (var i = 0; i < propKeys.length; i++)obj[propKeys[i]] = param[propKeys[i]];
                    return obj;
                })();
                for (var i = 0; i < defaultParamKeys.length; i++) {
                    var key = defaultParamKeys[i];
                    clone[key] = !(key in param) ? defaultParam[key] :
                        _ctx.fn.castType(
                            param[key], defaultParam[key],
                            _ctx.fn.castType(allowTypeList[key], [], ['String', 'RegExp'])
                        );
                }
                return clone;
            }
        }
    };


    // ライブラリ
    var _lib = {
        key: [ // 文字列か文字列の配列のグローバルでのライブラリのキー
            '$$antimatterx',
            '$$amx'
        ],
        val: (function () { // エクスポートされるライブラリの値
            function _requireNodeModule(id) {
                return typeof require === 'function' ? require(typeof id === 'string' ? id : '') : undefined;
            }
            var lib = {
                // 型関連
                getType: _ctx.fn.getType,
                isType: _ctx.fn.isType,
                castType: _ctx.fn.castType,
                castParam: _ctx.fn.castParam,
                //--------------------------------------------------
                // 配列関連
                nonOverlap: function (array) {
                    array = lib.castType(array, []).slice();
                    if (array.length < 2) return array;
                    // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
                    if (typeof Set === 'function' && lib.isType(new Set(), 'Set')) return Array.from(new Set(array));
                    else {
                        var hasNaN = false;
                        return array.filter(function (v, i, arr) {
                            return !hasNaN && lib.isNaN(v) ? hasNaN = true : arr.indexOf(v) === i;
                        });
                    }
                },
                //--------------------------------------------------
                // 文字列関連
                repeat: function (str, count) {
                    return new Array(lib.clamp(count, 0, lib._maxArrayLength) + 1)
                        .join(typeof str === 'string' ? str : '');
                },
                reverse: function (str) {
                    return (typeof str === 'string' ? str : '').split('').reverse().join('');
                },
                makeBase: function (base) {
                    if (typeof base !== 'string') return (
                        '0123456789'
                        + 'abcdefghijklmnopqrstuvwxyz'
                        + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                    ).substr(0, lib.clamp(base, 2, 62));
                    base = lib.nonOverlap(base.split('')).join('');
                    return base.length < 2 ? '01' : base;
                },
                escapeRegExp: function (str) {
                    // https://s8a.jp/javascript-escape-regexp
                    return (typeof str === 'string' ? str : '').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
                },
                URI: (function () {
                    function URI(uri) {
                        if (!(this instanceof URI)) return new URI(uri);
                        var parseData = URI.parse(uri = typeof uri === 'string' ? uri : lib._href),
                            dataKeys = Object.keys(parseData);
                        for (var i = 0; i < dataKeys.length; i++) this[dataKeys[i]] = parseData[dataKeys[i]];
                    }


                    URI.makeQuery = URI.prototype.makeQuery = function (param) {
                        param = lib.castType(param, {});
                        return Object.keys(param).map(function (k) {
                            if (k.length > 0) return encodeURIComponent(k) + (
                                lib.isType(param[k], ['Number', 'BigInt']) ? '=' + encodeURIComponent(param[k].toString() + (typeof param[k] === 'bigint' ? 'n' : '')) :
                                    typeof param[k] === 'string' && param[k].length > 0 ? '=' + encodeURIComponent(param[k]) :
                                        ''
                            );
                        }).join('&');
                    };
                    URI.parseQuery = URI.prototype.parseQuery = function (str) {
                        var obj = {};
                        (typeof str === 'string' ? str : '').split('&').forEach(function (v) {
                            var q = v.split('=');
                            if (q[0].length === 0) return;
                            else obj[q[0]] = q.length < 2 ? '' : q[1];
                        });
                        return obj;
                    };
                    URI.parseHostname = URI.prototype.parseHostname = function (uri) {
                        var m = (typeof uri === 'string' ? uri : lib._href).match(/^[^:]+:\/\/([^/.]+\.[^\/]+)/) || [];
                        return m.length > 0 ? m[1].split('.') : [];
                    };
                    URI.parse = URI.prototype.parse = function (uri) {
                        var m = (typeof uri === 'string' ? uri : lib._href).match(new RegExp('^' + URI.pattern + '$')) || [],
                            isURI = m.length > 0;
                        return {
                            _matchResult: isURI ? m : null, // matchの結果
                            isURI: isURI, // URIかどうか
                            href: m[0] || '', // URI
                            address: m[1] || '', // クエリパラメータ文字列とフラグメントを除外したURI
                            protocol: m[2] || '', // プロトコル
                            hostname: URI.parseHostname(m[1] || '').join('') || '', // ホスト名
                            host: URI.parseHostname(m[1] || ''), // ホスト
                            pathname: m[3] === undefined ? m[4] : '/' + (m[4] || '').split('/').slice(1).join('/'), // パス名
                            path: m[3] === undefined ? [m[4]] : (m[4] || '').split('/').slice(1).filter(function (v) { // パス
                                return v.length > 0;
                            }),
                            search: m[5] || '', // クエリパラメータ文字列
                            params: URI.parseQuery((m[5] || '').slice(1)), // クエリパラメータ
                            fragment: m[6] || '' // フラグメント
                        };
                    };
                    URI.findURI = URI.prototype.findURI = function (str) {
                        return (typeof str === 'string' ? str : '').match(new RegExp(URI.pattern, 'g')) || [];
                    };
                    URI.pattern = URI.prototype.pattern = '(([^:]+:)(//)?([^?#]+))(\\?[^#]*)?(#.*)?';

                    return URI;
                })(),
                //--------------------------------------------------
                // 数値関連
                isNaN: function (v) {
                    return v !== v && typeof v === 'number';
                },
                isFinite: function (num) {
                    return typeof num === 'number' && isFinite(num);
                },
                isNegative: function (num) {
                    return typeof num === 'number' && !lib.isNaN(num) &&
                        (lib.isFinite(num) ? 1 / num : num) < 0;
                },
                clamp: function (num, min, max, safeNaN) {
                    num = typeof num === 'number' ? num : -Infinity;
                    if ((typeof safeNaN === 'boolean' ? safeNaN : false) && lib.isNaN(num)) return NaN;
                    if (typeof min !== 'number' || lib.isNaN(min)) min = -Infinity;
                    if (typeof max !== 'number' || lib.isNaN(max)) max = Infinity;
                    if (min > max) min = max;
                    return num < min ? min :
                        num > max ? max :
                            num;
                },
                randInt: function (min, max, secure) {
                    min = lib.clamp(
                        typeof min === 'number' ? min : lib._minSafeInt,
                        lib._minSafeInt, lib._maxSafeInt
                    );
                    max = lib.clamp(
                        typeof max === 'number' ? max : lib._maxSafeInt,
                        lib._minSafeInt, lib._maxSafeInt
                    );
                    if (min > max) min = max;
                    if (typeof secure === 'boolean' ? secure : false) {
                        max++;
                        if (lib._nodeModule.crypto) return lib._nodeModule.crypto.randomInt(min, max);
                        else {
                            var numRange = max - min,
                                reqBytes = Math.ceil((Math.log(numRange) * Math.LOG2E) / 8);
                            if (reqBytes < 1) return min;
                            var maxNum = Math.pow(256, reqBytes),
                                arr = new Uint8Array(reqBytes);
                            while (true) {
                                window.crypto.getRandomValues(arr);
                                var val = 0;
                                for (var i = 0; i < reqBytes; i++) val = (val << 8) + arr[i];
                                if (val < maxNum - maxNum & numRane) return min + (val % numRange);
                            }
                        }
                    } else return Math.floor(Math.random() * Math.abs(max - min + 1)) + min;
                },
                factorial: function (num) {
                    num = typeof num === 'number' ? num : NaN;
                    if (!lib.isFinite(num) || lib.isNaN(num)) return num;
                    if (num === 0) return lib.isNegative(num) ? -1 : 1;
                    var x = Math.abs(num);
                    for (var i = x - 1; i > 0; i--) x *= i;
                    return num < 0 ? -x : x;
                },
                BaseN: (function () {
                    function BaseN(base) {
                        if (!(this instanceof BaseN)) return new BaseN(base);
                        this.base = lib.makeBase(base);
                    }

                    BaseN.prototype.encode = function (num) {
                        num = Math.floor(Math.abs(lib.clamp(num, lib._minSafeInt, lib._maxSafeInt)));
                        if (num === 0) return this.base[0];
                        if (this.base === lib.makeBase(36)) return num.toString(36);
                        var str = '';
                        while (num) {
                            str = this.base[(num = Math.floor(num)) % this.base.length] + str;
                            num /= this.base.length;
                        }
                        return str.slice(1);
                    };
                    BaseN.prototype.decode = function (str) {
                        str = typeof str === 'string' ? str : '';
                        var base = this.base;
                        if (!new RegExp('^[' + base.split('').map(function (v) {
                            return lib.escapeRegExp(v);
                        }).join('') + ']+$').test(str)) return 0;
                        return str.split('').reverse().map(function (v, i) {
                            return base.indexOf(v) * Math.pow(base.length, i);
                        }).reduce(function (x, v) {
                            return x + v;
                        });
                    };

                    return BaseN;
                })(),
                //--------------------------------------------------
                // DOM関連
                selector: function (elm) {
                    return elm instanceof Element ? elm :
                        typeof elm === 'string' ? document.querySelector(elm || 'body') || document.body :
                            document.body;
                },
                getCSS: function (elm) {
                    elm = lib.selector(elm);
                    return elm.currentStyle || document.defaultView.getComputedStyle(elm, '');
                },
                //--------------------------------------------------
                // その他
                getIP: function (callback) {
                    function func(resolve, reject) {
                        function fail() {
                            var err = new Error('Failed to retrieve from API.');
                            if (typeof reject === 'function') reject(err);
                            else throw err;
                        }
                        function done(body) {
                            var res;
                            try {
                                res = JSON.parse(body.match(/\{[^}]*\}/)[0]);
                            } catch (e) {
                                fail();
                            }
                            if (typeof resolve === 'function') resolve(res);
                            if (typeof callback === 'function') callback(res);
                        }
                        var options = {
                            hostname: 'ipinfo.io',
                            path: '/',
                            method: 'GET',
                            data: 'callback=a'
                        };
                        if (lib._nodeModule.https) {
                            var req = lib._nodeModule.https.request(options, function (res) {
                                var body = '';
                                res.on('data', function (chunk) {
                                    body += chunk;
                                });
                                res.on('end', function () {
                                    done(body);
                                });
                            });
                            req.on('error', fail);
                            req.end();
                        } else if (typeof XMLHttpRequest === 'function') {
                            var xhr = new XMLHttpRequest();
                            xhr.open(
                                options.method,
                                'https://'
                                + options.hostname
                                + options.path
                                + '?' + options.data
                            );
                            xhr.onload = function () {
                                done(xhr.response);
                            };
                            xhr.onerror = function () {
                                fail();
                            };
                            xhr.send();
                        } else fail();
                    }
                    return typeof Promise === 'function' ? new Promise(func) : void func();
                },
                getRGB: function (color) {
                    color = typeof color === 'string' ? color : '';
                    var r = 0, g = 0, b = 0;
                    if (Object.keys(lib._colorName).indexOf(color) !== -1) color = '#' + lib._colorName[color];
                    if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(color)) {
                        var rgb = color.match(/[\da-f]{2}/ig).map(function (v) {
                            return parseInt(v, 16);
                        });
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                    } else {
                        lib._checkDependency('document');
                        var e = document.createElement('div');
                        document.body.appendChild(e);
                        e.style.color = color;
                        var rgb = (lib.getCSS(e).color.match(/\d+/g) || [0, 0, 0]).map(function (v) {
                            return Number(v);
                        });
                        document.body.removeChild(e);
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                    }
                    return {
                        red: r,
                        green: g,
                        blue: b
                    };
                },
                rgb2hsl: function (red, green, blue) {
                    red = lib.clamp(red, 0, 255);
                    green = lib.clamp(green, 0, 255);
                    blue = lib.clamp(blue, 0, 255);
                    var max = Math.max(red, green, blue),
                        min = Math.min(red, green, blue),
                        hue = max === min ? 0 :
                            max === red ? 60 * ((green - blue) / (max - min)) :
                                max === green ? 60 * ((blue - red) / (max - min)) + 360 / 3 :
                                    60 * ((red - green) / (max - min)) + 360 * 2 / 3;
                    if (hue < 0) hue += 360;
                    return {
                        hue: hue,
                        saturation: (((max + min) / 2) < 255 / 2 ? (
                            max + min <= 0 ? 0 :
                                (max - min) / (max + min) * 100
                        ) : (max - min) / (255 * 2 - max - min) * 100) || 0,
                        luminance: (max + min) / 255 / 2 * 100
                    };
                },
                hsl2rgb: function (hue, saturation, luminance) {
                    var max = 0, min = 0,
                        r = 0, g = 0, b = 0,
                        h = lib.clamp(hue, 0, 360) % 360,
                        s = lib.clamp(saturation, 0, 100) / 100,
                        l = lib.clamp(luminance, 0, 100) / 100,
                        q = h / 60;
                    if (l < 0.5) {
                        max = l + l * s;
                        min = l - l * s;
                    } else {
                        max = l + (1 - l) * s;
                        min = l - (1 - l) * s;
                    }
                    if (q <= 1) {
                        r = max;
                        g = (h / 60) * (max - min) + min;
                        b = min;
                    } else if (q <= 2) {
                        r = ((60 * 2 - h) / 60) * (max - min) + min;
                        g = max;
                        b = min;
                    } else if (q <= 3) {
                        r = min;
                        g = max;
                        b = ((h - 60 * 2) / 60) * (max - min) + min;
                    } else if (q <= 4) {
                        r = min;
                        g = ((60 * 4 - h) / 60) * (max - min) + min;
                        b = max;
                    } else if (q <= 5) {
                        r = ((h - 60 * 4) / 60) * (max - min) + min;
                        g = min;
                        b = max;
                    } else {
                        r = max;
                        g = min;
                        b = ((360 - h) / 60) * (max - min) + min;
                    }
                    return {
                        red: r * 255,
                        green: g * 255,
                        blue: b * 255
                    };
                },
                //--------------------------------------------------
                // プロパティ
                version: '2.0.0',
                conflict: _ctx.conflict,
                errors: {
                    DependencyError: (function () {
                        function DependencyError(message) {
                            if (!(this instanceof DependencyError)) return new DependencyError(message);
                            var err = new Error(message);
                            err.name = 'DependencyError';
                            var thisProto = typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(this) : this.__proto__;
                            if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(err, thisProto);
                            else err.__proto__ = thisProto;
                            if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(err, DependencyError);
                            return err;
                        }

                        DependencyError.prototype = Object.create(Error.prototype, {
                            constructor: {
                                value: DependencyError,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                        if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(DependencyError, Error);
                        else DependencyError.__proto__ = Error;

                        return DependencyError;
                    })()
                },
                //--------------------------------------------------
                // プライベートメソッド //////////////////////////////////////////////////
                _requireNodeModule: _requireNodeModule,
                _checkDependency: function (type) {
                    if (!lib._available[type]) throw new lib.errors.DependencyError(lib._errorMessage[type]);
                },
                ////////////////////////////////////////////////////////////////////////
                // プライベートプロパティ ////////////////////////////////////////////////
                _isNode: typeof process === 'object' && typeof process.release === 'object' && process.release.name === 'node',
                _href: typeof location === 'object' ? location.href : '',
                _maxSafeInt: Math.pow(2, 53) - 1,
                _minSafeInt: -(Math.pow(2, 53) - 1),
                _maxArrayLength: Math.pow(2, 32) - 1,
                _available: {
                    document: typeof document === 'object' && document instanceof Document
                },
                _errorMessage: {
                    document: 'This feature is only available in environments where Document is available.'
                },
                _nodeModule: {
                    crypto: _requireNodeModule('crypto'),
                    https: _requireNodeModule('https')
                },
                _colorName: {
                    yellowgreen: '9acd32', yellow: 'ffff00', lightgoldenrodyellow: 'fafad2', whitesmoke: 'f5f5f5', lightcyan: 'e0ffff',
                    white: 'ffffff', lightcoral: 'f08080', wheat: 'f5deb3', lightblue: 'add8e6', violet: 'ee82ee',
                    lemonchiffon: 'fffacd', turquoise: '40e0d0', lawngreen: '7cfc00', tomato: 'ff6347', lavenderblush: 'fff0f5',
                    thistle: 'd8bfd8', lavender: 'e6e6fa', teal: '008080', khaki: 'f0e68c', tan: 'd2b48c',
                    ivory: 'fffff0', steelblue: '4682b4', indigo: '4b0082', springgreen: '00ff7f', indianred: 'cd5c5c',
                    snow: 'fffafa', hotpink: 'ff69b4', slategray: '708090', honeydew: 'f0fff0', slateblue: '6a5acd',
                    greenyellow: 'adff2f', skyblue: '87ceeb', green: '008000', silver: 'c0c0c0', gray: '808080',
                    sienna: 'a0522d', goldenrod: 'daa520', seashell: 'fff5ee', gold: 'ffd700', seagreen: '2e8b57',
                    ghostwhite: 'f8f8ff', sandybrown: 'f4a460', gainsboro: 'dcdcdc', salmon: 'fa8072', fuchsia: 'ff00ff',
                    saddlebrown: '8b4513', forestgreen: '228b22', royalblue: '4169e1', floralwhite: 'fffaf0', rosybrown: 'bc8f8f',
                    firebrick: 'b22222', richblue: '0cb0e0', feldsper: 'fed0e0', red: 'ff0000', dodgerblue: '1e90ff',
                    purple: '800080', dimgray: '696969', powderblue: 'b0e0e6', deepskyblue: '00bfff', plum: 'dda0dd',
                    deeppink: 'ff1493', pink: 'ffc0cb', darkviolet: '9400d3', peru: 'cd853f', darkturquoise: '00ced1',
                    peachpuff: 'ffdab9', darkslategray: '2f4f4f', papayawhip: 'ffefd5', darkslateblue: '483d8b', palevioletred: 'db7093',
                    darkseagreen: '8fbc8f', paleturquoise: 'afeeee', darksalmon: 'e9967a', palegreen: '98fb98', darkred: '8b0000',
                    palegoldenrod: 'eee8aa', darkorchid: '9932cc', orchid: 'da70d6', darkorange: 'ff8c00', orangered: 'ff4500',
                    darkolivegreen: '556b2f', orange: 'ffa500', darkmagenta: '8b008b', olivedrab: '6b8e23', darkkhaki: 'bdb76b',
                    olive: '808000', darkgreen: '006400', oldlace: 'fdf5e6', darkgray: 'a9a9a9', navy: '000080',
                    darkgoldenrod: 'b8860b', navajowhite: 'ffdead', darkcyan: '008b8b', moccasin: 'ffe4b5', darkbrown: 'da0b00',
                    mistyrose: 'ffe4e1', darkblue: '00008b', mintcream: 'f5fffa', cyan: '00ffff', midnightblue: '191970',
                    crimson: 'dc143c', mediumvioletred: 'c71585', cornsilk: 'fff8dc', mediumturquoise: '48d1cc', cornflowerblue: '6495ed',
                    mediumspringgreen: '00fa9a', cornflower: 'bfefdf', mediumslateblue: '7b68ee', coral: 'ff7f50', mediumseagreen: '3cb371',
                    copper: 'bf00df', mediumpurple: '9370db', coolcopper: 'd98719', mediumorchid: 'ba55d3', chocolate: 'd2691e',
                    mediumblue: '0000cd', chartreuse: '7fff00', mediumaquamarine: '66cdaa', cadetblue: '5f9ea0', maroon: '800000',
                    burlywood: 'deb887', magenta: 'ff00ff', brown: 'a52a2a', linen: 'faf0e6', brass: 'b5a642',
                    limegreen: '32cd32', blueviolet: '8a2be2', lime: '00ff00', blue: '0000ff', lightyellow: 'ffffe0',
                    blanchedalmond: 'ffebcd', lightsteelblue: 'b0c4de', black: '000000', lightslategray: '778899', bisque: 'ffe4c4',
                    lightskyblue: '87cefa', beige: 'f5f5dc', lightseagreen: '20b2aa', azure: 'f0ffff', lightsalmon: 'ffa07a',
                    aquamarine: '7fffd4', lightpink: 'ffb6c1', aqua: '00ffff', lightgrey: 'd3d3d3', antiquewhite: 'faebd7',
                    lightgreen: '90ee90', aliceblue: 'f0f8ff'
                }
                ////////////////////////////////////////////////////////////////////////
            };
            return lib;
        })()
    };

    // エクスポート
    _ctx.libKey = _ctx.fn.castType(_lib.key, [_lib.key]);
    if (typeof module === 'object' &&
        typeof module.exports === 'object' && module.exports !== null) module.exports = _lib.val;
    else {
        for (var i = 0; i < _ctx.libKey.length; i++) {
            var k = _ctx.libKey[i];
            if (k in _root) _ctx.conflict[k] = _root[k];
            _root[k] = _lib.val;
        }
    }

    // ローカル変数をオブジェクトで返す
    return {
        _root: _root,
        'undefined': undefined,
        _main: _main,
        _ctx: _ctx,
        _lib: _lib
    };
})(typeof window === 'object' ? window : this);
