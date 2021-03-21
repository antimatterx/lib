/*!
 * AntimatterX JavaScript Library v2.0.0
 * https://github.com/AntimatterX/antimatterx.github.io/blob/main/assets/lib/antimatterx/antimatterx.js
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
 * antimatterx, amx
 * 
 * Last Update: 2021-03-05T16:03:12.310Z
 */
(function _main(_root, undefined) {
    'use strict';
    // 環境
    var _ctx = {
        libKeys: [],
        conflicts: {},
        fn: {
            /**
             * グローバルのライブラリのプロパティを読み込み前に戻します。
             * @returns {Object<string, ?*>} 読み込み前のプロパティのリストをオブジェクトで返します。
             * @example
             * // return value: {}
             * ObjectWithThisMethod.noConflict();
             */
            noConflict: function () {
                _ctx.libKeys.forEach(function (k) {
                    if (k in _ctx.conflicts) _root[k] = _ctx.conflicts[k];
                });
                return _ctx.conflicts;
            },
            /**
             * 型名を返します。
             * @param {?*} [x=undefined] 型名を取得する値を渡します。
             * @returns {string} 第一引数に渡した値の型名の文字列を返します。
             * @example
             * // return value: 'Object'
             * ObjectWithThisMethod.getType({});
             * 
             * // return value: 'Array'
             * ObjectWithThisMethod.getType([]);
             */
            getType: function (x) {
                return Object.prototype.toString.call(x).slice(8, -1);
            },
            /**
             * 指定した型名か判定します。
             * @param {?*} x 判定する値を渡します。
             * @param {string|Array<string>} type 型名の文字列または型名の配列を渡します。
             * @returns {boolean} 第一引数に渡した値の型名が第二引数に渡された型名か判定して真偽値で返します。
             * @example
             * // return value: true
             * ObjectWithThisMethod.isType('Hello, Wolrd!', 'String');
             * 
             * // return value: false
             * ObjectWithThisMethod.isType(123, 'String');
             */
            isType: function (x, type) {
                var xType = _ctx.fn.getType(x);
                switch (_ctx.fn.getType(type)) {
                    case 'String':
                        return xType === type;
                    case 'Array':
                        return type.indexOf(xType) > -1;
                    default:
                        return false;
                }
            },
            /**
             * デフォルト値の型にキャストします。
             * @param {?*} x キャストする値を渡します。
             * @param {?*} defaultValue デフォルトの値を渡します。
             * @param {string|Array<string>} [allowType=[]] デフォルト値の型以外にも許容する型の型名の文字列または型名の配列を渡します。
             * @returns {?*} デフォルト値の型にキャストされた値を返します。
             * @example
             * // return value: 0
             * ObjectWithThisMethod.castType('Hello, World!', 0);
             * 
             * // return value: 'Hello, World!'
             * ObjectWithThisMethod.castType('Hello, World!', 0, 'String');
             */
            castType: function (x, defaultValue, allowType) {
                return _ctx.fn.isType(x, [_ctx.fn.getType(defaultValue)].concat(Array.isArray(allowType) ? allowType :
                    typeof allowType === 'string' ? [allowType] : [])) ? x : defaultValue;
            },
            /**
             * オブジェクトのプロパティをデフォルト値のオブジェクトのプロパティの型にキャストします。
             * @param {Object<string, ?*>|Array<?*>} param キャストするオブジェクトを渡します。
             * @param {Object<string, ?*>|Array<?*>} defaultParam デフォルト値のオブジェクトを渡します。
             * @param {string|Object<string, string|Array<string>>|Array<string|Array<string>>} [allowTypeList={}] デフォルト値のオブジェクトのプロパティの型以外にも許容する
             *     型名の文字列または型名の配列とデフォルト値のプロパティ名が組のオブジェクトを渡します。
             * @returns {Object<string, ?*} デフォルト値の型にキャストされたオブジェクトを返します。
             * @example
             * // return value: { foo: 0, bar: null, foobar: 'Hello, World!' }
             * ObjectWithThisMethod.castParam({ foo: undefined, bar: null, foobar: 'Hello, World!' }, { foo: 0, bar: [] }, { foo: 'String', bar: ['Null', 'Object'] });
             *
             * // return value: { 0: 123, 1: 'foobar', 2: 2 }
             * ObjectWithThisMethod.fn.castParam([ 123, 'foobar', null ], [ 0, 1, 2 ], 'String');
             */
            castParam: function (param, defaultParam, allowTypeList) {
                param = _ctx.fn.castType(param, {}, 'Array');
                defaultParam = _ctx.fn.castType(defaultParam, {}, 'Array');
                allowTypeList = (function () {
                    var obj = {};
                    switch (_ctx.fn.getType(allowTypeList)) {
                        case 'String':
                            Object.keys(defaultParam).forEach(function (k) {
                                obj[k] = allowTypeList;
                            });
                            break;
                        case 'Object':
                            obj = allowTypeList;
                            break;
                        case 'Array':
                            allowTypeList.forEach(function (v, i) {
                                obj[i] = v;
                            });
                            break;
                    }
                    return obj;
                })();
                var clone = (function () {
                    var obj = {};
                    Object.keys(param).forEach(function (k) {
                        obj[k] = param[k];
                    });
                    return obj;
                })();
                Object.keys(defaultParam).forEach(function (k) {
                    clone[k] = !(k in param) ? defaultParam[k] :
                        _ctx.fn.castType(
                            param[k], defaultParam[k],
                            _ctx.fn.castType(allowTypeList[k], [], 'String')
                        );
                });
                return clone;
            }
        }
    };

    // ライブラリ
    var _lib = {
        keys: [ // グローバルでのライブラリのキー
            '$amx'
        ],
        value: { // ライブラリの値
            // メタ
            noConflict: function () {
                _ctx.fn.noConflict();
                return _lib.value;
            },
            //--------------------------------------------------
            // 型関連
            getType: _ctx.fn.getType,
            isType: _ctx.fn.isType,
            castType: _ctx.fn.castType,
            castParam: _ctx.fn.castParam,
            //--------------------------------------------------
            // 主にブラウザ関係の環境依存関連
            copy: function (str, useExecCommand) {
                str = typeof str === 'string' ? str : '';
                function execCommandCopy() {
                    if (!_lib.value._available.document) _lib.value._dependencyError('document');
                    var e = document.createElement('textarea');
                    e.value = str;
                    document.body.appendChild(e);
                    e.style.position = 'fixed';
                    e.style.left = '-100%';
                    e.select();
                    try {
                        document.execCommand('copy');
                    } catch (e) {
                        throw e;
                    } finally {
                        e.blur();
                        document.body.removeChild(e);
                    }
                }
                if (_lib.value._isNode) {
                    try {
                        require('clipboardy').writeSync(str);
                    } catch (e) {
                        _lib.value._dependencyError('clipboardy');
                    }
                } else if (typeof useExecCommand === 'boolean' ? useExecCommand : false) execCommandCopy();
                else if (typeof clipboardData === 'object') clipboardData.setData('Text', str);
                else if (typeof navigator === 'object' && typeof navigator.clipboard === 'object' &&
                    typeof location === 'object' && location.protocol === 'https:') navigator.clipboard.writeText(str).catch(function () {
                        _lib.value.copy(str, true);
                    });
                else execCommandCopy();
            },
            downloadFromBlob: function (filename, blob) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                if (typeof filename !== 'string' || filename === '' ||
                    typeof URL !== 'function' || typeof URL.createObjectURL !== 'function') return;
                var e = document.createElement('a');
                e.href = URL.createObjectURL(blob);
                e.target = '_blank';
                e.rel = 'noopener noreferrer';
                e.download = filename;
                e.click();
                URL.revokeObjectURL(e.href);
                return e;
            },
            downloadText: function (title, str) {
                title = (typeof title === 'string' && title.length > 0 ? title : 'download') + '.txt';
                str = typeof str === 'string' ? str : '';
                if (_lib.value._isNode) require('fs').writeFileSync(title, str);
                else return _lib.value.downloadFromBlob(title, new Blob([
                    new Uint8Array([0xef, 0xbb, 0xbf]),
                    str.replace(/\n/g, '\r\n')
                ]), { type: 'text/plain' });
            },
            downloadImage: function (title, dataURL) {
                if (typeof dataURL !== 'string' || dataURL === '') return;
                var m = dataURL.match(/^data:(image\/([a-z]+));base64,(.+)$/);
                if (!m) return;
                title = typeof title === 'string' && title.length > 0 ? title : 'download.' + m[2];
                if (_lib.value._isNode) require('fs').writeFileSync(title, m[3], 'base64');
                else {
                    var b = atob(m[3]),
                        cont = new Uint8Array(b.length);
                    for (var i = 0; i < b.length; i++)cont[i] = b.charCodeAt(i);
                    return _lib.value.downloadFromBlob(title, new Blob([cont], { type: m[1] }));
                }
            },
            //--------------------------------------------------
            // データ保存関連
            SaveStorage: (function () {
                function SaveStorage(options) {
                    if (!(this instanceof SaveStorage)) return new SaveStorage(options);
                    options = _lib.value.castParam(options, {
                        uri: _lib.value._href,
                        storageType: null
                    }, { storageType: 'String' });
                    this.uri = _lib.value.parseURI(options.uri).address;
                    this.storageType = SaveStorage.isAvailableStorageType(options.storageType) ? options.storageType :
                        SaveStorage.getAvailableStorageType();
                    if (this.storageType === null) _lib.value._dependencyError('storage');
                }

                SaveStorage.isAvailableStorageType = function (storageType) {
                    switch (storageType) {
                        case 'GMStorage':
                            return _lib.value._available.gmStorage;
                        case 'LocalStorage':
                            return localStorage === 'object';
                        case 'Cookie':
                            return _lib.value._available.document && typeof document.cookie === 'string';
                        default:
                            return false;
                    }
                };
                SaveStorage.getAvailableStorageType = function () {
                    return _lib.value._available.gmStorage ? 'GMStorage' :
                        typeof localStorage === 'object' ? 'LocalStorage' :
                            _lib.value._available.document && typeof document.cookie === 'string' ? 'Cookie' :
                                null;
                };

                var p = SaveStorage.prototype;
                p.makeKey = function (key) {
                    key = typeof key === 'string' ? key : '';
                    return key.length > 0 && this.uri.length > 0 ? this.uri + '|' + key : '';
                };
                p.getKeys = function () {
                    var saveAreaRegExp = new RegExp('^' + _lib.value.escapeRegExp(this.uri + '|'));
                    switch (this.storageType) {
                        case 'LocalStorage':
                            return Object.keys(localStorage).filter(function (k) {
                                return saveAreaRegExp.test(k);
                            }).map(function (k) {
                                return k.replace(saveAreaRegExp, '');
                            });
                        case 'Cookie':
                            return document.cookie.split('; ').filter(function (v) {
                                return saveAreaRegExp.test(_lib.value.decodeBase58(v.split('=')[0]));
                            }).map(function (v) {
                                return _lib.value.decodeBase58(v.split('=')[0]).replace(saveAreaRegExp, '');
                            });
                        default:
                            return [];
                    }
                };
                p.removeData = function (key) {
                    var saveKey = this.makeKey(key);
                    if (saveKey.length < 1) return;
                    switch (this.storageType) {
                        case 'LocalStorage':
                            localStorage.removeItem(saveKey);
                            break;
                        case 'Cookie':
                            document.cookie = _lib.value.encodeBase58(saveKey) + '=; max-age=0';
                            break;
                    }
                };
                p.save = function (key, value) {
                    value = typeof value === 'string' ? value : '';
                    var saveKey = this.makeKey(key);
                    if (saveKey.length < 1) return;
                    switch (this.storageType) {
                        case 'GMStorage':
                            GM.setValue(key, value);
                            break;
                        case 'LocalStorage':
                            localStorage.setItem(saveKey, value);
                            break;
                        case 'Cookie':
                            document.cookie = [saveKey, value].map(function (v) {
                                return _lib.value.encodeBase58(v);
                            }).join('=');
                            break;
                    }
                }
                p.load = function (key, callback) {
                    var that = this;
                    function func(resolve, reject) {
                        var saveKey = that.makeKey(key);
                        if (saveKey.length < 1) {
                            var err = new Error('Invalid key.');
                            if (typeof reject === 'function') reject(err);
                            else throw err;
                        }
                        function loaded(value) {
                            if (typeof resolve === 'function') resolve(value);
                            if (typeof callback === 'function') callback(value);
                        }
                        switch (that.storageType) {
                            case 'GMStorage':
                                GM.getValue(key, '').then(function (value) {
                                    loaded(value);
                                });
                                break;
                            case 'LocalStorage':
                                loaded(_lib.value.castType(localStorage.getItem(saveKey), ''));
                                break;
                            case 'Cookie':
                                loaded((document.cookie.split('; ').map(function (v) {
                                    return v.split('=').map(function (v) {
                                        return _lib.value.decodeBase58(v);
                                    });
                                }).filter(function (v) {
                                    return v[0] === saveKey;
                                })[0] || [])[1] || '');
                                break;
                        }
                    }
                    return typeof Promise === 'function' ? new Promise(func) : func();
                };

                return SaveStorage;
            })(),
            //--------------------------------------------------
            // 配列関連
            max: function (array) {
                array = _lib.value.castType(array, []).slice();
                return array.length < 1 ? -Infinity : array.reduce(function (a, b) {
                    return a > b ? a : b;
                });
            },
            min: function (array) {
                array = _lib.value.castType(array, []).slice();
                return array.length < 1 ? Infinity : array.reduce(function (a, b) {
                    return a < b ? a : b;
                });
            },
            range: function (count) {
                count = _lib.value.clamp(count, 0, _lib.value._maxSafeInt);
                return typeof Array.prototype.keys === 'function' ? (typeof Array.from === 'function' ? Array.from : Array.prototype.slice.call)(new Array(count).keys()) :
                    new Array(count + 1).join(0).split('').map(function (v, i) {
                        return i;
                    });
            },
            indexOf: function (array, v) {
                array = _lib.value.castType(array, []).slice();
                if (_lib.value.isNaN(v)) {
                    var i = 0;
                    while (i < array.length + 1 &&
                        !_lib.value.isNaN(array[i])) i++;
                    return i > array.length ? -1 : i;
                } else return array.indexOf(v);
            },
            nonOverlap: function (array) {
                array = _lib.value.castType(array, []).slice();
                if (array.length < 2) return array;
                // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
                if (typeof Set === 'function' && _lib.value.isType(new Set(), 'Set')) return (typeof Array.from === 'function' ? Array.from : Array.prototype.slice.call)(new Set(array));
                else {
                    var hasNaN = false;
                    return array.filter(function (v, i, arr) {
                        return !hasNaN && v !== v && typeof NaN === 'number' ? hasNaN = true : arr.indexOf(v) === i;
                    });
                }
            },
            randArray: function (array) {
                array = _lib.value.castType(array, []).slice();
                return array[Math.floor(Math.random() * array.length)];
            },
            shuffle: function (array) {
                array = _lib.value.castType(array, []).slice();
                var len = array.length;
                while (len > 0) {
                    var i = Math.floor(Math.random() * len--),
                        v = array[len];
                    array[len] = array[i];
                    array[i] = v;
                }
                return array;
            },
            //--------------------------------------------------
            // 文字列関連
            repeat: function (str, count) {
                return new Array(_lib.value.clamp(count, 0, _lib.value._maxSafeInt) + 1).join(_lib.value.castType(str, ''));
            },
            reverse: function (str) {
                _lib.value.castType(str, '').split('').reverse().join('');
            },
            makeBase: function (base) {
                if (typeof base !== 'string') return [
                    '0123456789',
                    'abcdefghijklmnopqrstuvwxyz',
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                ].join('').substr(0, _lib.value.clamp(base, 2, 62));
                base = _lib.value.nonOverlap(base.split('')).join('');
                return base.length < 2 ? '01' : base;
            },
            consoleStringize: function (x) {
                return Array.prototype.slice.call(arguments).map(function (v) {
                    var seen = [];
                    return (function stringize(x) {
                        if (_lib.value.indexOf(seen, x) > -1) return "[Circular]";
                        var xType = _lib.value.getType(x);
                        if (x instanceof Object && typeof x !== 'function') {
                            var isArr = xType === 'Array',
                                literal = isArr ? { left: '[', right: ']' } : { left: xType + ' {', right: '}' },
                                propKeys = (
                                    _lib.value.isType(x, 'Map') ? Array.from(x.keys()) :
                                        _lib.value.isType(x, 'Set') ? Array.from(new Array(x.size).keys()) :
                                            Object.keys(x)
                                ).concat(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(x) : []);
                            if ((isArr ? x : propKeys).length < 1) return literal.left + literal.right;
                            seen.push(x);
                            var res = (literal.left + ' ') + (isArr ? x.map(function (v) {
                                return stringize(v);
                            }) : propKeys.map(function (k) {
                                return (typeof k === 'symbol' ? '[' + k.toString() + ']' :
                                    (/^(\d+|[a-z$_][\w$]*)$/i.test(k) ? k : stringize(k))) + ': ' + stringize(
                                        _lib.value.isType(x, 'Map') ? x.get(k) :
                                            _lib.value.isType(x, 'Set') ? Array.from(x.values())[k] :
                                                x[k]
                                    );
                            })).join(', ') + (' ' + literal.right);
                            seen.pop(x);
                            return res;
                        }
                        switch (xType) {
                            case 'String':
                                return "'" + x + "'";
                            case 'Function':
                                return '[Function]';
                            case 'BigInt':
                                return x.toString() + 'n';
                            case 'Date':
                                return x.toISOString();
                            case 'Undefined':
                            case 'Null':
                            case 'Number':
                            case 'Symbol':
                            case 'RegExp':
                            case 'Boolean':
                            case 'Error':
                                return String(x);
                            default:
                                return xType;
                        }
                    })(v);
                }).join(' ');
            },
            escapeRegExp: function (str) {
                // https://s8a.jp/javascript-escape-regexp
                return _lib.value.castType(str, '').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
            },
            escapeHTML: function (str) {
                // https://qiita.com/saekis/items/c2b41cd8940923863791
                return _lib.value.castType(str, '').replace(/[&'`"<>]/g, function (m) {
                    return '&' + ({
                        '&': 'amp',
                        "'": '#x27',
                        '`': '#x60',
                        '"': 'quot',
                        '<': 'lt',
                        '>': 'gt'
                    })[m] + ';';
                });
            },
            makeQuery: function (param) {
                param = _lib.value.castType(param, {});
                return '?' + Object.keys(param).map(function (k) {
                    if (k.length > 0) return encodeURIComponent(k) + (
                        _lib.value.isType(param[k], ['Number', 'BigInt']) ? '=' + encodeURIComponent(_lib.value.consoleStringize(param[k])) :
                            typeof param[k] === 'string' && param[k].length > 0 ? '=' + encodeURIComponent(param[k]) :
                                ''
                    );
                }).join('&');
            },
            parseQuery: function (str) {
                var obj = {};
                (typeof str === 'string' ? str : '').slice(1).split('&').forEach(function (v) {
                    var q = v.split('=');
                    if (q[0].length < 1) return;
                    else obj[q[0]] = q.length < 2 ? '' : q[1];
                });
                return obj;
            },
            parseDomain: function (uri) {
                var m = (typeof uri === 'string' ? uri : _lib.value._href).match(/^[^:]+:\/\/([^/.]+\.[^\/]+)/) || [];
                return m.length > 0 ? m[1].split('.') : [];
            },
            parseURI: function (uri) {
                var m = (typeof uri === 'string' ? uri : _lib.value._href).match(new RegExp('^' + _lib.value._patterns.uri + '$')) || [],
                    isURI = m.length > 0;
                return {
                    _matchResult: isURI ? m : null, // matchの結果
                    isURI: isURI, // URIかどうか
                    href: m[0] || '', // URI
                    address: m[1] || '', // クエリパラメータ文字列とフラグメントを除外したURI
                    protocol: m[2] || '', // プロトコル
                    domainname: _lib.value.parseDomain(m[1] || '').join('.') || '', // ドメイン文字列
                    domain: _lib.value.parseDomain(m[1] || ''), // ドメイン
                    pathname: m[3] === undefined ? m[4] : '/' + (m[4] || '').split('/').slice(1).join('/'), // パス文字列
                    path: m[3] === undefined ? [m[4]] : (m[4] || '').split('/').slice(1).filter(function (v) { // パス
                        return v.length > 0;
                    }),
                    search: m[5] || '', // クエリパラメータ文字列
                    params: _lib.value.parseQuery(m[5] || ''), // クエリパラメータ
                    fragment: m[6] || '' // フラグメント
                };
            },
            parseMailAddress: function (mailAddress) {
                var m = (typeof mailAddress === 'string' ? mailAddress : '').match(new RegExp('^' + _lib.value._patterns.mailAddress + '$')) || [],
                    isMailAddress = m.length > 0;
                return {
                    _matchResult: isMailAddress ? m : null, // matchの結果
                    isMailAddress: isMailAddress, // メールアドレスかどうか
                    mailAddress: m[0] || '', // メールアドレス
                    localname: m[1] || '', // ローカル部文字列
                    local: (m[1] || '').match(/[^.]+/g) || [], // ローカル部
                    domainname: m[2] || '', // ドメイン文字列
                    domain: (m[2] || '').match(/[^.]+/g) || [] // ドメイン
                };
            },
            extractURI: function (str) {
                return (typeof str === 'string' ? str : '').match(new RegExp(_lib.value._patterns.uri, 'g')) || []
            },
            extractMailAddress: function (str) {
                return (typeof str === 'string' ? str : '').match(new RegExp(_lib.value._patterns.mailAddress, 'g')) || [];
            },
            encodeImage: function (str, callback) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                function func(resolve, reject) {
                    if ((typeof str === 'string' ? str : '').length < 1) {
                        var err = new RangeError('The string to be converted must be at least one character long.');
                        if (typeof reject === 'function') reject(err);
                        else throw err;
                    }
                    var arr = [];
                    str.split('').forEach(function (c) {
                        var n = c.charCodeAt();
                        if (n < 128) arr.push(n);
                        else arr.push(
                            128,
                            (0xff00 & n) >> 8, // 前
                            0xff & n // 後
                        );
                    });
                    var width = Math.ceil(Math.sqrt(arr.length / 3)),
                        cv = document.createElement('canvas');
                    cv.setAttribute('width', width);
                    cv.setAttribute('height', width);
                    var ctx = cv.getContext('2d'),
                        imgData = ctx.getImageData(0, 0, width, width),
                        cnt = 0;
                    for (var i = 0; i < arr.length; i++) {
                        var x = i * 4;
                        for (var o = 0; o < 3; o++)imgData.data[x + o] = arr[cnt++] || 0;
                        imgData.data[x + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
                    }
                    ctx.putImageData(imgData, 0, 0);
                    var dataURL = cv.toDataURL('image/png');
                    if (typeof callback === 'function') callback(dataURL);
                    if (typeof resolve === 'function') resolve(dataURL);
                }
                return typeof Promise === 'function' ? new Promise(func) : void func();
            },
            decodeImage: function (src, callback) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                function func(resolve, reject) {
                    var img = new Image();
                    img.onload = function () {
                        var width = img.width,
                            height = img.height,
                            cv = document.createElement('canvas');
                        cv.setAttribute('width', width);
                        cv.setAttribute('height', height);
                        var ctx = cv.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        var data = ctx.getImageData(0, 0, width, height).data,
                            arr = [],
                            str = '';
                        for (var i = 0; i < data.length; i++) {
                            for (var o = 0; o < 3; o++)arr.push(data[i * 4 + o]);
                        }
                        for (var i = 0; i < arr.length; i++) {
                            var n = arr[i];
                            if (n < 128) str += String.fromCharCode(n);
                            else if (n === 128) {
                                str += String.fromCharCode((arr[i + 1] << 8) + arr[i + 2]);
                                i += 2;
                            }
                        }
                        var decoded = str.replace(/\0+$/, '');
                        if (typeof callback === 'function') callback(decoded);
                        if (typeof resolve === 'function') resolve(decoded);
                    };
                    img.onerror = function () {
                        var err = new Error('Invalid image source.');
                        if (typeof reject === 'function') reject(err);
                        else throw err;
                    };
                    img.src = typeof src === 'string' ? src : '';
                }
                return typeof Promise === 'function' ? new Promise(func) : void func();
            },
            encodeBase58: function (str) {
                str = typeof str === 'string' ? str : '';
                var to58 = new _lib.value.BaseN(58),
                    sign = 'WXYZ';
                return str.replace(/[\s\S]/g, function (c) {
                    if (to58.base.indexOf(c) > -1) return sign[0] + c + sign[0];
                    else {
                        var encoded = to58.encode(c.charCodeAt()),
                            len = encoded.length;
                        return len > 3 ? '' : sign[len] + (_lib.value.repeat('0', len) + encoded).slice(-len) + sign[len];
                    }
                }).replace(/[WXYZ]\1/g, '').replace(/[WXYZ](?=[WXYZ])/g, '').slice(0, -1).replace(/^W/, '');
            },
            decodeBase58: function (str) {
                var to58 = new _lib.value.BaseN(58),
                    sign = 'WXYZ';
                return (typeof str === 'string' ? str : '').replace(/[WXYZ][^WXYZ]*/g, function (m) {
                    var idx = sign.indexOf(m[0]);
                    if (idx === 0) return m.slice(1);
                    return m.slice(1).replace(new RegExp('.{' + idx + '}', 'g'), function (n) {
                        return String.fromCharCode(to58.decode(n));
                    });
                });
            },
            //--------------------------------------------------
            // 数値関連
            isNaN: function (v) {
                return v !== v && typeof v === 'number';
            },
            isFinite: function (num) {
                return typeof num === 'number' && isFinite(num);
            },
            isNegative: function (num) {
                return typeof num === 'number' && !_lib.value.isNaN(num) ? (_lib.value.isFinite(num) ? 1 / num : num) < 0 :
                    false;
            },
            clamp: function (num, min, max, safeNaN) {
                num = _lib.value.castType(num, -Infinity);
                if (_lib.value.castType(safeNaN, false) && _lib.value.isNaN(num)) return NaN;
                if (typeof min !== 'number' || _lib.value.isNaN(min)) min = -Infinity;
                if (typeof max !== 'number' || _lib.value.isNaN(max)) max = Infinity;
                if (min > max) min = max;
                return num < min ? min :
                    num > max ? max :
                        num;
            },
            randInt: function (min, max, secure) {
                min = _lib.value.clamp(
                    _lib.value.castType(min, _lib.value._minSafeInt),
                    _lib.value._minSafeInt, _lib.value._maxSafeInt
                );
                max = _lib.value.clamp(
                    _lib.value.castType(max, _lib.value._maxSafeInt),
                    _lib.value._minSafeInt, _lib.value._maxSafeInt
                );
                if (min > max) min = max;
                if (_lib.value.castType(secure, false)) {
                    if (!_lib.value._available.webCryptoAPI) _lib.value._dependencyError('webCryptoAPI');
                    max++;
                    var numRange = max - min,
                        reqBytes = Math.ceil((Math.log(numRange) * Math.LOG2E) / 8);
                    if (reqBytes < 1) return min;
                    var maxNum = Math.pow(256, reqBytes),
                        arr = new Uint8Array(reqBytes);
                    while (true) {
                        window.crypto.getRandomValues(arr);
                        var val = 0;
                        for (var i = 0; i < reqBytes; i++)val = (val << 8) + arr[i];
                        if (val < maxNum - maxNum % numRange) return min + (val % numRange);
                    }
                } else return Math.floor(Math.random() * Math.abs(max - min + 1)) + min;
            },
            factorial: function (num) {
                num = _lib.value.castType(num, NaN);
                if (!_lib.value.isFinite(num) || _lib.value.isNaN(num)) return num;
                if (num === 0) return _lib.value.isNegative(num) ? -1 : 1;
                var x = Math.abs(num);
                for (var i = x - 1; i > 0; i--)x *= i;
                return num < 0 ? -x : x;
            },
            BaseN: (function () {
                function BaseN(base) {
                    if (!(this instanceof BaseN)) return new BaseN(base);
                    this.base = _lib.value.makeBase(base);
                }

                var p = BaseN.prototype;
                p.encode = function (num) {
                    num = Math.floor(Math.abs(_lib.value.clamp(num, _lib.value._minSafeInt, _lib.value._maxSafeInt)));
                    if (num === 0) return this.base[0];
                    var str = '';
                    while (num) {
                        str = this.base[(num = Math.floor(num)) % this.base.length] + str;
                        num /= this.base.length;
                    }
                    return str.slice(1);
                };
                p.decode = function (str) {
                    str = _lib.value.castType(str, '');
                    var base = this.base;
                    if (!new RegExp('^[' + base.split('').map(function (v) {
                        return _lib.value.escapeRegExp(v);
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
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                return elm instanceof Element ? elm :
                    typeof elm === 'string' ? document.querySelector(elm || 'body') || document.body :
                        document.body;
            },
            triggerEvent: function (elm, event) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                elm = _lib.value.selector(elm);
                event = typeof event === 'string' ? event : '';
                // https://qiita.com/ryounagaoka/items/a48d3a4c4faf78a99ae5
                if (typeof document.createEvent === 'function') {
                    var ev = document.createEvent('HTMLEvents');
                    ev.initEvent(event, true, true); // event type, bubbling, cancelable
                    elm.dispatchEvent(ev);
                } else elm.fireEvent('on' + event, document.createEventObject());
            },
            setAttr: function (elm, attr) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                elm = _lib.value.selector(elm);
                attr = _lib.value.castType(attr, {});
                Object.keys(attr).forEach(function (k) {
                    elm.setAttribute(k, attr[k]);
                });
                return elm;
            },
            setCSS: function (elm, css) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                elm = _lib.value.selector(elm);
                css = _lib.value.castType(css, {});
                Object.keys(css).forEach(function (k) {
                    elm.style[k] = css[k];
                });
                return elm;
            },
            getCSS: function (elm) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                elm = _lib.value.selector(elm);
                return elm.currentStyle || document.defaultView.getComputedStyle(elm, '');
            },
            getFontSize: function (elm) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                return Number(_lib.value.getCSS(elm).fontSize.slice(0, -2)) + 1;
            },
            getRGB: function (color) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                var e = document.createElement('div');
                document.body.appendChild(e);
                e.style.color = typeof color === 'string' ? color : '';
                var m = _lib.value.getCSS(e).color.match(/\d+/g);
                document.body.removeChild(e);
                return m ? m.map(function (n) {
                    return Number(n);
                }) : [0, 0, 0];
            },
            setWallpaper: function (src, options) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                options = _lib.value.castParam(_lib.value.castType(options, {}), {
                    cover: undefined,
                    position: 'center center', // 画像を常に天地左右の中央に配置
                    size: 'cover', // 表示するコンテナの大きさに基づいて背景画像を調整
                    repeat: 'no-repeat' // 画像をタイル状に繰り返し表示しない
                }, { cover: ['Null', 'Object'] });
                var isValidCover = !_lib.value.isType(options.cover, ['Null', 'Undefined']) && options.cover !== false;
                options.cover = _lib.value.castParam(_lib.value.castType(options.cover, {}), {
                    color: '#ffffff', // カバー色
                    opacity: 0.8, // カバーの不透明度
                    zIndex: -1000, // カバーのz-index
                    removePrevCover: true // 前のカバーを消すかどうか
                });
                if (!isValidCover || options.cover.removePrevCover) {
                    while (_lib.value._covers.length > 0) {
                        var prevCover = _lib.value._covers.pop();
                        if (prevCover.parentNode !== null) prevCover.parentNode.removeChild(prevCover); // 存在するカバーなら削除
                    }
                }
                if (_lib.value.isType(src, ['String', 'Null', 'Undefined'])) {
                    _lib.value.setCSS(document.body, {
                        backgroundImage: (src || '').length < 1 || _lib.value.isType(src, ['Null', 'Undefined']) ? 'none' : 'url("' + src + '")',
                        backgroundAttachment: 'fixed', // コンテンツの高さが画像の高さより大きい場合動かないように固定
                        backgroundPosition: options.position,
                        backgroundSize: options.size,
                        backgroundRepeat: options.repeat
                    });
                }
                if (isValidCover) {
                    var rgb = _lib.value.getRGB(options.cover.color),
                        e = document.createElement('div');
                    document.body.appendChild(e);
                    _lib.value._covers.push(e);
                    _lib.value.setCSS(e, {
                        zIndex: options.cover.zIndex.toString(),
                        backgroundColor: rgb ? 'rgba(' + rgb.concat([options.cover.opacity]).join(', ') + ')' : options.cover.color,
                        position: 'fixed',
                        top: '0',
                        right: '0',
                        bottom: '0',
                        left: '0'
                    });
                    return e;
                }
            },
            addElement: function (parentNode, elm, insertBefore) {
                if (!_lib.value._available.document) _lib.value._dependencyError('document');
                parentNode = _lib.value.selector(parentNode);
                elm = _lib.value.selector(elm);
                if (typeof insertBefore === 'boolean' ? insertBefore : false) parentNode.insertBefore(elm, parentNode.firstChild);
                else parentNode.appendChild(elm);
                return elm;
            },
            //--------------------------------------------------
            // その他
            isCircular: function (obj) {
                // https://javascripter.hatenablog.com/entry/20090702/1246525649
                return obj instanceof Object && (function recursiveIsCircular(obj, ancestors) {
                    return Object.keys(obj).some(function (k) {
                        return _lib.value.indexOf(ancestors, obj) > -1 ||
                            obj[k] instanceof Object && recursiveIsCircular(obj[k], _lib.value.castType(ancestors, []).concat([obj]));
                    });
                })(obj);
            },
            getIP: function (callback) {
                function func(resolve, reject) {
                    function failReq() {
                        var err = new Error('Failed to retrieve from API.');
                        if (typeof reject === 'function') reject(err);
                        else throw err;
                    }
                    function doneReq(str) {
                        try {
                            var res = JSON.parse(str.match(/\{.*?\}/)[0]);
                        } catch (e) {
                            failReq();
                        }
                        if (typeof resolve === 'function') resolve(res);
                        if (typeof callback === 'function') callback(res);
                    }
                    var url = 'https://ipinfo.io/?callback=a';
                    if (_lib.value._isNode) require('https').request(url, function (res) {
                        var data = [];
                        res.on('data', function (chunk) {
                            data.push(chunk);
                        });
                        res.on('end', function () {
                            doneReq(data.join(''));
                        });
                    }).end();
                    else if (typeof XMLHttpRequest === 'function') {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url)
                        xhr.responseType = 'text';
                        xhr.onload = function () {
                            doneReq(xhr.response);
                        };
                        xhr.onerror = function () {
                            failReq();
                        };
                        xhr.send();
                    } else failReq();
                }
                return typeof Promise === 'function' ? new Promise(func) : void func();
            },
            tryFunc: function (func, onFail) {
                try {
                    func();
                } catch (e) {
                    (typeof onFail === 'function' ? onFail : console.error)(e);
                }
            },
            //--------------------------------------------------
            // プロパティ
            version: '2.0.0',
            conflicts: _ctx.conflicts,
            //--------------------------------------------------
            // プライベートメソッド //////////////////////////////////////////////////
            _dependencyError: function (dependencyType, isMessage) {
                throw new Error(
                    _lib.value.castType(isMessage, false) ? dependencyType :
                        dependencyType in _lib.value._errorMessages ? _lib.value._errorMessages[dependencyType] :
                            dependencyType
                );
            },
            ////////////////////////////////////////////////////////////////////////
            // プライベートプロパティ ////////////////////////////////////////////////
            _covers: [],
            _maxSafeInt: Math.pow(2, 53) - 1,
            _minSafeInt: -(Math.pow(2, 53) - 1),
            _patterns: {
                uri: '(([^:]+:)(//)?([^?#]+))(\\?[^#]*)?(#.*)?',
                mailAddress: '([\\w-._]+)@([\\w-._]+\\.[A-Za-z]+)'
            },
            _errorMessages: {
                document: 'This feature is only available in environments where Document is available.',
                storage: 'You will need available storage to use this feature.',
                webCryptoAPI: 'This feature is available only in environments where the Web Crypto API is available.',
                clipboardy: "To use this feature with Node.js, the 'clipboardy' package is required."
            },
            _href: typeof location === 'object' ? location.href : '',
            _isNode: typeof process === 'object' && typeof process.release === 'object' && process.release.name === 'node',
            _available: {
                document: typeof document === 'object' && document instanceof Document,
                gmStorage: typeof GM === 'object' && typeof GM.setValue === 'function' && typeof GM.getValue === 'function',
                webCryptoAPI: !(typeof process === 'object' && typeof process.release === 'object' && process.release.name === 'node') && _ctx.fn.isType(_root.crypto, 'Crypto')
            }
            ////////////////////////////////////////////////////////////////////////
        }
    };

    // エクスポート
    _ctx.libKeys = _lib.keys;
    if (typeof module === 'object' && module.exports !== undefined) module.exports = _lib.value;
    else _lib.keys.forEach(function (k) {
        if (k in _root) _ctx.conflicts[k] = _root[k];
        _root[k] = _lib.value;
    });

    // ローカル変数をオブジェクトで返す
    return {
        _root: _root,
        'undefined': undefined,
        _main: _main,
        _ctx: _ctx,
        _lib: _lib
    };
})(typeof window === 'object' ? window : this);
