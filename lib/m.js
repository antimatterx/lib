(
    /**
     * @param {typeof globalThis} root 
     * @param {undefined} undef 
     * @returns {{ main: Function, root: typeof globalThis, undef: undefined, lib: { [x: string]: any } }}
     */
    function main(root, undef) {
        'use strict';
        // 定数
        var MAX_SAFE_INTEGER = 9007199254740991, // Math.pow(2, 53) - 1
            MIN_SAFE_INTEGER = -9007199254740991,
            MAX_ARRAY_LENGTH = 4294967295, // Math.pow(2, 32) - 1
            ERROR_MESSAGE = Object.freeze({
                document: 'This feature is only available in environments where Document is available'
            }),
            COLOR_NAME = Object.freeze({
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
            });

        // 関数
        /**
         * @param {string} id 
         * @returns {any}
         */
        function requireNodeModule(id) {
            try {
                return require(id);
            } catch (e) {
                return e;
            }
        }

        // ライブラリ
        var lib = {
            // 型関連
            /**
             * @param {any} x 
             * @returns {string}
             */
            getType: function (x) {
                return Object.prototype.toString.call(x).slice(8, -1);
            },
            /**
             * @param {any} x 
             * @param {string|RegExp|string[]} typeName 
             * @returns {boolean}
             */
            isType: function (x, typeName) {
                var xType = lib.getType(x);
                switch (lib.getType(typeName)) {
                    case 'String':
                        return xType === typeName;
                    case 'RegExp':
                        return typeName.test(xType);
                    case 'Array':
                        return typeName.indexOf(xType) !== -1;
                    default:
                        return false;
                }
            },
            /**
             * @param {any} x 
             * @param {any} defaultValue 
             * @param {string|RegExp|string[]} allowType 
             * @returns {any}
             */
            castType: function (x, defaultValue, allowType) {
                var typeList = lib.isType(allowType, 'RegExp') ? allowType : [lib.getType(defaultValue)];
                if (Array.isArray(typeList)) Array.prototype.push.apply(
                    typeList,
                    Array.isArray(allowType) ? allowType : typeof allowType === 'string' ? [allowType] : []
                );
                return lib.isType(x, typeList) ? x : defaultValue;
            },
            /**
             * @param {{ [x: string]: any }} param 
             * @param {{ [x: string]: any }} defaultParam 
             * @param {string|RegExp|string[]|Array<string|RegExp|string[]>} allowTypeList 
             * @returns {{ [x: string]: any }}
             */
            castParam: function (param, defaultParam, allowTypeList) {
                param = typeof param === 'object' && param !== null ? param : {};
                defaultParam = typeof defaultParam === 'object' && defaultParam !== null ? defaultParam : {};
                var defaultParamKeys = Object.getOwnPropertyNames(defaultParam)
                    .concat(Object.getOwnPropertySymbols(defaultParam));
                switch (lib.getType(allowTypeList)) {
                    case 'String':
                    case 'RegExp':
                    case 'Array':
                        var obj = {};
                        for (var i = 0; i < defaultParamKeys.length; i++) onj[defaultParamKeys[i]] = allowTypeList;
                        allowTypeList = obj;
                    default:
                        allowTypeList = typeof allowTypeList === 'object' && allowTypeList !== null ? allowTypeList : {};
                }
                var clone = {},
                    paramKeys = Object.getOwnPropertyNames(param)
                        .concat(Object.getOwnPropertySymbols(param));
                for (var i = 0; i < paramKeys.length; i++) clone[paramKeys[i]] = param[paramKeys[i]];
                for (var i = 0; i < defaultParamKeys.length; i++) {
                    var k = defaultParamKeys[i];
                    clone[k] = !(k in param) ? defaultParam[k] : lib.castType(
                        param[k], defaultParam[k],
                        lib.castType(allowTypeList[k], [], ['String', 'RegExp'])
                    );
                }
                return clone;
            },
            /**
             * @param {any} a 
             * @param {any} b 
             * @returns {boolean}
             */
            is: function (a, b) {
                // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is
                return a === b ? (a !== 0 || (1 / a === 1 / b)) : (a !== a && b !== b);
            },
            //--------------------------------------------------
            // 主にブラウザ関係の環境依存関連
            /**
             * @param {string} str 
             * @param {boolean} [execCommand=false] 
             */
            copy: function (str, execCommand) {
                str = typeof str === 'string' ? str : '';
                if (!(lib._nodeModule.clipboardy instanceof Error)) lib._nodeModule.clipboardy.writeSync(str);
                else {
                    if (!lib._available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document);
                    if (typeof execCommand === 'boolean' ? execCommand : false) lib.copy(str, true);
                    else if (typeof clipboardData === 'object' && clipboardData !== null) clipboardData.setData('Text', str);
                    else if (typeof navigator === 'object' && navigator !== null &&
                        typeof navigator.clipboard === 'object' && navigator.clipboard !== null &&
                        typeof location === 'object' && location !== null && location.protocol === 'https:') navigator.clipboard.writeText(str).catch(function () {
                            lib.copy(str, true);
                        });
                    else {
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
                }
            },
            fileDownload: (function () {
                /** @constructor */
                function FDFactory() { }

                /**
                 * @param {string} filename 
                 * @param {Blob} blob 
                 * @returns {HTMLAnchorElement|null}
                 */
                FDFactory.prototype.fromBlob = function (filename, blob) {
                    if (!lib._available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document);
                    if (typeof filename !== 'string' || filename === '' ||
                        typeof URL !== 'function' || typeof URL.createObjectURL !== 'function') return null;
                    var e = document.createElement('a');
                    e.href = URL.createObjectURL(blob);
                    e.target = '_blank';
                    e.rel = 'noopener noreferrer';
                    e.download = filename;
                    e.click();
                    URL.revokeObjectURL(e.href);
                    return e;
                };
                /**
                 * @param {string} title 
                 * @param {string} str 
                 * @returns {HTMLAnchorElement|null}
                 */
                FDFactory.prototype.text = function (title, str) {
                    title = (typeof title === 'string' && title.length > 0 ? title : 'download') + '.txt';
                    str = typeof str === 'string' ? str : '';
                    if (!(lib._nodeModule.fs instanceof Error)) {
                        lib._nodeModule.fs.writeFileSync(title, str);
                        return null;
                    }
                    else return this.fromBlob(title, new Blob([
                        new Uint8Array([0xef, 0xbb, 0xbf]),
                        str.replace(/\n/g, '\r\n')
                    ]), { type: 'text/plain' });
                };
                /**
                 * @param {string} title 
                 * @param {string} dataURL 
                 * @returns {HTMLAnchorElement|null}
                 */
                FDFactory.prototype.image = function (title, dataURL) {
                    if (typeof dataURL !== 'string' || dataURL === '') return;
                    var m = dataURL.match(/^data:(image\/([a-z]+));base64,(.+)$/);
                    if (!m) return;
                    title = typeof title === 'string' && title.length > 0 ? title : 'download.' + m[2];
                    if (!(lib._nodeModule.fs instanceof Error)) {
                        lib._nodeModule.fs.writeFileSync(title, m[3], 'base64');
                        return null;
                    }
                    else {
                        var b = atob(m[3]),
                            cont = new Uint8Array(b.length);
                        for (var i = 0; i < b.length; i++) cont[i] = b.charCodeAt(i);
                        return this.fromBlob(title, new Blob([cont], { type: m[1] }));
                    }
                };

                return new FDFactory();
            })(),
            //--------------------------------------------------
            // 配列関連
            /**
             * @param {number} start 
             * @param {number} [stop=start] 
             * @param {number} [step=1] 
             * @returns {number[]}
             */
            range: function (start, stop, step) {
                start = lib.clamp(typeof start === 'number' ? start : 0, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
                stop = lib.clamp(typeof stop === 'number' ? stop : 0, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
                step = lib.clamp(typeof step === 'number' ? step : 1, -MAX_ARRAY_LENGTH, MAX_ARRAY_LENGTH);
                if (step === 0) step = lib.is(step, -0) ? -1 : 1;
                if (arguments.length === 1) {
                    stop = start;
                    start = 0;
                }
                var arr = [];
                if ((start > stop && !lib.isNegative(step)) ||
                    (start < stop && lib.isNegative(step))) return arr;
                for (var i = 0; i < Math.abs(Math.ceil((stop - start) / step)); i++) arr.push(start + i * step);
                return arr;
            },
            /**
             * @param {any[]} array 
             * @returns {any[]}
             */
            nonOverlap: function (array) {
                array = Array.isArray(array) ? array : [];
                // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
                if (typeof Set === 'function') return Array.from(new Set(array));
                else {
                    var hasNaN = false,
                        arr = [];
                    for (var i = 0; i < array.length; i++) {
                        if (!hasNaN && array[i] !== array[i] ? hasNaN = true : array.indexOf(array[i]) === i) arr.push(array[i]);
                    }
                    return arr;
                }
            },
            /**
             * @param {any[]} array 
             * @param {boolean} [secure=false] 
             * @returns {any}
             */
            randArray: function (array, secure) {
                array = Array.isArray(array) ? array : [];
                return array[lib.randInt(0, array.length - 1, secure)];
            },
            /**
             * @param {any[]} array 
             * @param {boolean} [secure=false] 
             * @returns {any[]}
             */
            shuffle: function (array, secure) {
                array = Array.isArray(array) ? array.slice() : [];
                var len = array.length;
                while (len > 0) {
                    var i = lib.randInt(0, (len--) - 1, secure),
                        v = array[len];
                    array[len] = array[i];
                    array[i] = v;
                }
                return array;
            },
            //--------------------------------------------------
            // 文字列関連
            /**
             * @param {string} str 
             * @param {number} count 
             * @returns {string}
             */
            repeat: function (str, count) {
                str = typeof str === 'string' ? str : '';
                count = lib.clamp(
                    arguments.length === 1 ? 1 : count,
                    0, MAX_SAFE_INTEGER
                );
                if (str.length === 0 || count === 0) return '';
                if (count < (MAX_ARRAY_LENGTH - 1)) return new Array(count + 1).join(str);
                var maxCount = str.length * count;
                for (var i = Math.floor(Math.log(count) / Math.log(2)); i > 0; i--) str += str;
                return str + str.substring(0, maxCount - str.length);
            },
            /**
             * @param {string} str 
             * @returns {string}
             */
            reverse: function (str) {
                return typeof str === 'string' ? str.split('').reverse().join('') : '';
            },
            /**
             * @param {string|number} baseOrRadix
             * @returns {string} 
             */
            makeBase: function (baseOrRadix) {
                if (typeof baseOrRadix !== 'string') return (
                    '0123456789'
                    + 'abcdefghijklmnopqrstuvwxyz'
                    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                ).substr(0, lib.clamp(baseOrRadix, 2, 62));
                baseOrRadix = lib.nonOverlap(baseOrRadix.split('')).join('');
                return baseOrRadix.length < 2 ? '01' : baseOrRadix;
            },
            escapeRegExp: function (str) {
                // https://s8a.jp/javascript-escape-regexp
                return typeof str === 'string' && str.length > 0 ? str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&') : '';
            },
            stringImage: (function () {
                /** @constructor */
                function SIFactory() { }

                /** @param {string} str */
                SIFactory.prototype.encode = function (str) {
                    str = typeof str === 'string' ? str : '';
                    return new lib.Deferred(function (resolve, reject) {
                        if (str.length === 0) reject(new RangeError('The string to be converted must be at least one character long'));
                        var arr = [];
                        for (var i = 0; i < str.length; i++) {
                            var n = str.charCodeAt(i);
                            if (n < 128) arr.push(n);
                            else arr.push(
                                128,
                                (0xff00 & n) >> 8,// 前
                                0xff & n // 後
                            );
                        }
                        var width = Math.ceil(Math.sqrt(arr.length / 3)),
                            cv = !(lib._nodeModule.canvas instanceof Error) ? new lib._nodeModule.canvas.Canvas(width, width) :
                                document.createElement('canvas');
                        if (lib._nodeModule.canvas instanceof Error) {
                            cv.setAttribute('width', width);
                            cv.setAttribute('height', width);
                        }
                        var ctx = cv.getContext('2d'),
                            imgData = ctx.getImageData(0, 0, width, width),
                            cnt = 0;
                        for (var i = 0; i < arr.length; i++) {
                            var x = i * 4;
                            for (var o = 0; o < 3; o++) imgData.data[x + o] = arr[cnt++] || 0;
                            imgData.data[x + 3] = 255; // 透過を指定するとputImageDataで画素値が変わる現象がある
                        }
                        ctx.putImageData(imgData, 0, 0);
                        resolve(cv.toDataURL('image/png'));
                    });
                };
                /** @param {string} src */
                SIFactory.prototype.decode = function (src) {
                    return new lib.Deferred(function (resolve, reject) {
                        var img = new (!(lib._nodeModule.canvas instanceof Error) ? lib._nodeModule.canvas.Image : Image)();
                        img.onload = function () {
                            var width = img.width,
                                height = img.height,
                                cv = !(lib._nodeModule.canvas instanceof Error) ? new lib._nodeModule.canvas.Canvas(width, width) :
                                    document.createElement('canvas');
                            if (lib._nodeModule.canvas instanceof Error) {
                                cv.setAttribute('width', width);
                                cv.setAttribute('height', width);
                            }
                            var ctx = cv.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            var data = ctx.getImageData(0, 0, width, height).data,
                                arr = [],
                                str = '';
                            for (var i = 0; i < data.length; i++) {
                                for (var o = 0; o < 3; o++) arr.push(data[i * 4 + o]);
                            }
                            for (var i = 0; i < arr.length; i++) {
                                var n = arr[i];
                                if (n < 128) str += String.fromCharCode(n);
                                else if (n === 128) {
                                    str += String.fromCharCode((arr[i + 1] << 8) + arr[i + 2]);
                                    i += 2;
                                }
                            }
                            resolve(str.replace(/\0+$/, ''));
                        };
                        img.onerror = function () {
                            reject('Invalid image source');
                        };
                        img.src = typeof src === 'string' ? src : '';
                    });
                };

                return new SIFactory();
            })(),
            base58: (function () {
                /** @constructor */
                function B58Factory() { }

                B58Factory._sign = B58Factory.prototype._sign = 'WXYZ';

                /**
                 * @param {string} str 
                 * @returns {string}
                 */
                B58Factory.prototype.encode = function (str) {
                    str = typeof str === 'string' ? str : '';
                    var to58 = new lib.BaseN(58),
                        res = '';
                    for (var i = 0; i < str.length; i++) {
                        if (to58.base.indexOf(str[i]) !== -1) res += B58Factory._sign[0] + str[i] + B58Factory._sign[0];
                        else {
                            var encoded = to58.encode(str.charCodeAt(i)),
                                len = encoded.length;
                            res += len > 3 ? '' : B58Factory._sign[len] + (lib.repeat('0', len) + encoded).slice(-len) + B58Factory._sign[len];
                        }
                    }
                    return res.replace(/([WXYZ])\1/g, '').replace(/[WXYZ](?=[WXYZ])/g, '').slice(0, -1).replace(/^W/, '');
                };
                /**
                 * @param {string} str 
                 * @returns {string}
                 */
                B58Factory.prototype.decode = function (str) {
                    return typeof str === 'string' ? str.replace(/[WXYZ][^WXYZ]*/g, function (m) {
                        var idx = B58Factory._sign.indexOf(m[0]),
                            to58 = new lib.BaseN(58);
                        if (idx === 0) return m.slice(1);
                        return m.slice(1).replace(new RegExp('.{' + idx + '}', 'g'), function (n) {
                            return String.fromCharCode(to58.decode(n));
                        });
                    }) : '';
                };

                return new B58Factory();
            })(),
            //--------------------------------------------------
            // 数値関連
            /**
             * @param {number} v 
             * @returns {boolean}
             */
            isNaN: function (v) {
                return v !== v && typeof v === 'number';
            },
            /**
             * @param {number} num 
             * @returns {boolean}
             */
            isFinite: function (num) {
                return typeof num === 'number' && isFinite(num);
            },
            /**
             * @param {number} num 
             * @returns {boolean}
             */
            isNegative: function (num) {
                if (lib.is(num, -0)) return true;
                return typeof num === 'number' && num < 0;
            },
            /**
             * @param {number} num 
             * @param {number} min 
             * @param {number} [max=MAX_SAFE_INTEGER] 
             * @param {boolean} [safeNaN=false] 
             * @returns {number}
             */
            clamp: function (num, min, max, safeNaN) {
                num = typeof num === 'number' ? num : -Infinity;
                if ((typeof safeNaN === 'boolean' ? safeNaN : false) &&
                    num !== num) return NaN;
                if (typeof min !== 'number' || min !== min) min = -Infinity;
                if (typeof max !== 'number' || max !== max) max = Infinity;
                if (min > max) min = max;
                return num < min ? min :
                    num > max ? max :
                        num;
            },
            /**
             * @param {number} min 
             * @param {number} max 
             * @param {boolean} [secure=false]
             * @returns {number} 
             */
            randInt: function (min, max, secure) {
                min = lib.clamp(
                    typeof min === 'number' ? min : MIN_SAFE_INTEGER,
                    MIN_SAFE_INTEGER, MAX_SAFE_INTEGER
                );
                max = lib.clamp(
                    typeof max === 'number' ? max : MAX_SAFE_INTEGER,
                    MIN_SAFE_INTEGER, MAX_SAFE_INTEGER
                );
                if (min > max) min = max;
                if (typeof secure === 'boolean' ? secure : false) {
                    if (max < MAX_SAFE_INTEGER) max++;
                    if (!(lib._nodeModule.crypto instanceof Error)) return lib._nodeModule.crypto.randomInt(min, max);
                    else if (typeof crypto === 'object' && crypto !== null &&
                        typeof crypto.getRandomValues === 'function') {
                        var numRange = max - min,
                            reqBytes = Math.ceil((Math.log(numRange) * Math.LOG2E) / 8);
                        if (reqBytes < 1) return min;
                        var maxNum = Math.pow(256, reqBytes),
                            arr = new Uint8Array(reqBytes);
                        while (true) {
                            root.crypto.getRandomValues(arr);
                            var val = 0;
                            for (var i = 0; i < reqBytes; i++) val = (val << 8) + arr[i];
                            if (val < maxNum - maxNum % numRange) return min + (val % numRange);
                        }
                    } else return NaN;
                } else return Math.floor(Math.random() * Math.abs(max - min + 1)) + min;
            },
            /**
             * @param {number} num 
             * @returns {number}
             */
            factorial: function (num) {
                num = typeof num === 'number' ? num : NaN;
                if (!lib.isFinite(num) || num !== num) return num;
                if (num === 0) return lib.is(num, -0) ? -1 : 1;
                var x = Math.abs(num);
                for (var i = x - 1; i > 0; i--) x *= i;
                return num < 0 ? -x : x;
            },
            BaseN: (function () {
                /**
                 * @constructor
                 * @param {string|number} baseOrRadix 
                 */
                function BaseN(baseOrRadix) {
                    if (!(this instanceof BaseN)) return new BaseN(baseOrRadix);
                    this.base = lib.makeBase(baseOrRadix);
                }

                /**
                 * @param {number} num 
                 * @returns {string}
                 */
                BaseN.prototype.encode = function (num) {
                    num = Math.floor(Math.abs(lib.clamp(num, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)));
                    if (num < this.base.length) return this.base[num];
                    if (this.base.length <= 36 && this.base === lib.makeBase(this.base.length)) return num.toString(this.base.length);
                    var res = '';
                    while (num) {
                        num = Math.floor(num);
                        res = this.base[num % this.base.length] + res;
                        num /= this.base.length;
                    }
                    return res.slice(1);
                };
                /**
                 * @param {string} str 
                 * @returns {number}
                 */
                BaseN.prototype.decode = function (str) {
                    str = typeof str === 'string' ? str : '';
                    if (!new RegExp('^[' + lib.escapeRegExp(this.base) + ']+$').test(str)) return NaN;
                    var arr = str.split('').reverse(),
                        dec = 0;
                    for (var i = 0; i < arr.length; i++) dec += this.base.indexOf(arr[i]) * Math.pow(this.base.length, i);
                    return dec;
                };

                return BaseN;
            })(),
            //--------------------------------------------------
            // DOM関連
            /**
             * @param {Element|string} query 
             * @returns {Element}
             */
            selector: function (query) {
                if (!lib._available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document);
                return query instanceof Element ? query :
                    typeof query === 'string' ? document.querySelector(query || '') || document.body :
                        document.body;
            },
            /**
             * @param {Element} elm 
             * @returns {CSSStyleDeclaration}
             */
            getCSS: function (elm) {
                if (!lib._available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document);
                elm = lib.selector(elm);
                return elm.currentStyle || document.defaultView.getComputedStyle(elm, '');
            },
            //--------------------------------------------------
            // その他
            /** @returns {{ [x: string]: any }} */
            noConflict: function () {
                for (var i = 0; i < lib._keys.length; i++) {
                    var k = lib._keys[i];
                    if (k in lib._conflict) root[k] = lib._conflict[k];
                    else delete root[k];
                }
                return lib;
            },
            getIP: function () {
                return new lib.Deferred(function (resolve, reject) {
                    function fail() {
                        reject(new Error('Failed to retrieve from API'));
                    }
                    function done(body) {
                        try {
                            resolve(JSON.parse(body.match(/\{[\s\S]*?\}/)[0]));
                        } catch (e) {
                            fail();
                        }
                    }
                    var url = 'https://ipinfo.io/?callback=a';
                    if (!(lib._nodeModule.axios instanceof Error)) {
                        lib._nodeModule.axios.get(url).then(function (res) {
                            done(res.data);
                        }).catch(fail);
                    } else if (typeof XMLHttpRequest === 'function') {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url);
                        xhr.onload = function () {
                            done(xhr.response);
                        };
                        xhr.onerror = fail;
                        xhr.send();
                    } else reject(new lib.errors.DependencyError('No available communication modules were found'));
                });
            },
            getColorName: function () {
                return COLOR_NAME;
            },
            /**
             * @param {string} color 
             * @returns {number[]}
             */
            getRGB: function (color) {
                color = typeof color === 'string' ? color : '';
                if (Object.keys(COLOR_NAME).indexOf(color) !== -1) color = '#' + COLOR_NAME[color];
                if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(color)) {
                    var rgb = color.match(/[\da-f]{2}/ig) || [0, 0, 0];
                    for (var i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i].toString(16), '16');
                    return rgb;
                } else {
                    if (!lib._available.document) throw new lib.errors.DependencyError('Except for certain named colors, RGB is obtained by style, so the environment must be one where document is available');
                    var e = document.createElement('div');
                    document.body.appendChild(e);
                    e.style.color = color;
                    var rgb = lib.getCSS(e).color.match(/\d+/g) || [0, 0, 0];
                    for (var i = 0; i < rgb.length; i++) rgb[i] = Number(rgb[i]);
                    document.body.removeChild(e);
                    return rgb;
                }
            },
            /**
             * @param {number} red 
             * @param {number} green 
             * @param {number} blue 
             * @returns {number[]}
             */
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
                return [
                    hue,
                    (((max + min) / 2) < 255 / 2 ? (
                        max + min <= 0 ? 0 :
                            (max - min) / (max + min) * 100
                    ) : (max - min) / (255 * 2 - max - min) * 100) || 0,
                    (max + min) / 255 / 2 * 100
                ];
            },
            /**
             * @param {number} hue 
             * @param {number} saturation 
             * @param {number} luminance 
             * @returns {number[]}
             */
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
                return [r * 255, g * 255, b * 255]
            },
            Deferred: (function () {
                // https://github.com/taylorhakes/promise-polyfill
                /**
                 * @constructor
                 * @param {Function} func 
                 */
                function Deferred(func) {
                    if (!(this instanceof Deferred)) throw new TypeError('Promises must be constructed via new');
                    if (typeof func !== 'function') throw new TypeError('not a function');
                    this._state = 0;
                    this._handled = false;
                    this._value = undef;
                    this._deferreds = [];
                    Deferred._doResolve(func, this);
                }

                Deferred._immediateFn = (function (setTimeoutFunc, setImmediateFunc) {
                    return (
                        /** @param {Function} func */
                        function (func) {
                            typeof setImmediateFunc === 'function' ? setImmediateFunc(func) : setTimeoutFunc(func, 0);
                        }
                    );
                })(
                    setTimeout,
                    typeof setImmediate !== 'undefined' ? setImmediate : null
                );
                Deferred._noop = function () { };
                /**
                 * @param {any} x 
                 * @returns {boolean}
                 */
                Deferred._isArray = function (x) {
                    return !!(x && typeof x.length !== 'undefined');
                };
                /**
                 * @param {Function} func 
                 * @param {any} thisArg 
                 * @returns {Function}
                 */
                Deferred._bind = function (func, thisArg) {
                    return (
                        /** @param {...any} */
                        function () {
                            func.apply(thisArg, arguments);
                        }
                    );
                };
                /** @param {any} err */
                Deferred._unhandledRejectionFn = function _unhandledRejectionFn(err) {
                    if (typeof console === 'object' && console !== null) console.warn('Possible Unhandled Promise Rejection:', err);
                };
                /**
                 * 
                 * @param {Deferred} that 
                 * @param {Deferred._Handler} deferred 
                 * @returns {void}
                 */
                Deferred._handle = function (that, deferred) {
                    while (that._state === 3) that = that._value;
                    if (that._state === 0) return void that._deferreds.push(deferred);
                    that._handled = true;
                    Deferred._immediateFn(function () {
                        var cb = that._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                        if (cb === null) return void (Deferred[that._state === 1 ? '_resolve' : '_reject'])(
                            deferred.promise, that._value
                        );
                        var ret;
                        try {
                            ret = cb(that._value);
                        } catch (e) {
                            return void Deferred._reject(deferred.promise, e);
                        }
                        Deferred._resolve(deferred.promise, ret);
                    });
                };
                /**
                 * @param {Deferred} that 
                 */
                Deferred._finale = function (that) {
                    if (that._state === 2 && that._deferreds.length === 0) Deferred._immediateFn(function () {
                        if (!that._handled) Deferred._unhandledRejectionFn(that._value);
                    });
                    for (var i = 0, len = that._deferreds.length; i < len; i++) Deferred._handle(that, that._deferreds[i]);
                    that._deferreds = null;
                };
                /**
                 * @param {Deferred} that 
                 * @param {any} newValue 
                 * @returns {void}
                 */
                Deferred._resolve = function (that, newValue) {
                    try {
                        if (newValue === that) throw new TypeError('A promise cannot be resolved with itself');
                        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                            var then = newValue.then;
                            if (newValue instanceof Deferred) {
                                that._state = 3;
                                that._value = newValue;
                                return void Deferred._finale(that);
                            } else if (typeof then === 'function') return void Deferred._doResolve(Deferred._bind(then, newValue), that);
                        }
                        that._state = 1;
                        that._value = newValue;
                        Deferred._finale(that);
                    } catch (e) {
                        Deferred._reject(that, e);
                    }
                };
                /**
                 * @param {Function} that 
                 * @param {any} newValue 
                 */
                Deferred._reject = function (that, newValue) {
                    that._state = 2;
                    that._value = newValue;
                    Deferred._finale(that);
                };
                /**
                 * @param {Function} func 
                 * @param {Deferred} that 
                 * @returns {void}
                 */
                Deferred._doResolve = function (func, that) {
                    var done = false;
                    try {
                        func(
                            function (value) {
                                if (done) return;
                                done = true;
                                Deferred._resolve(that, value);
                            },
                            function (reason) {
                                if (done) return;
                                done = true;
                                Deferred._reject(that, reason);
                            }
                        );
                    } catch (e) {
                        if (done) return;
                        done = true;
                        Deferred._reject(that, e);
                    }
                };
                /**
                 * @constructor
                 * @param {Function} onFulfilled 
                 * @param {Function} onRejected 
                 * @param {Deferred} promise 
                 */
                Deferred._Handler = function (onFulfilled, onRejected, promise) {
                    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                    this.promise = promise;
                };
                /**
                 * @param {any} value 
                 * @returns {Deferred}
                 */
                Deferred.resolve = function (value) {
                    return value && typeof value === 'object' && value.constructor === Deferred ? value :
                        new Deferred(function (resolve) {
                            resolve(value);
                        });
                };
                /**
                 * @param {any} value 
                 * @returns {Deferred}
                 */
                Deferred.reject = function (value) {
                    return new Deferred(function (resolve, reject) {
                        reject(value);
                    });
                };
                /**
                 * @param {any[]} arr 
                 * @returns {Deferred}
                 */
                Deferred.allSettled = function (arr) {
                    return new Deferred(function (resolve, reject) {
                        if (!(arr && typeof arr.length !== 'undefined')) return reject(
                            new TypeError(
                                typeof arr
                                + ' '
                                + arr
                                + ' is not iterable(cannot read property Symbol(Symbol.iterator))'
                            )
                        );
                        var args = Array.prototype.slice.call(arr);
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;
                        function res(i, val) {
                            if (val && (typeof val === 'object' || typeof val === 'function')) {
                                var then = val.then;
                                if (typeof then === 'function') {
                                    return void then.call(
                                        val,
                                        function (val) {
                                            res(i, val);
                                        },
                                        function (e) {
                                            args[i] = { status: 'rejected', reason: e };
                                            if (--remaining === 0) resolve(args);
                                        }
                                    );
                                }
                            }
                            args[i] = { status: 'fulfilled, value: val' };
                            if (--remaining === 0) resolve(args);
                        }
                        for (var i = 0; i < args.length; i++) res(i, args[i]);
                    });
                };
                /**
                 * @param {any[]} arr 
                 * @returns {Deferred}
                 */
                Deferred.all = function (arr) {
                    return new Deferred(function (resolve, reject) {
                        if (!Deferred._isArray(arr)) return reject(new TypeError('Promise.all accepts an array'));
                        var args = Array.prototype.slice.call(arr);
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;
                        function res(i, val) {
                            try {
                                if (val && (typeof val === 'object' || typeof val === 'function')) {
                                    var then = val.then;
                                    if (typeof then === 'function') return void then.call(
                                        val,
                                        function (val) {
                                            res(i, val);
                                        },
                                        reject
                                    );
                                }
                                args[i] = val;
                                if (--remaining === 0) resolve(args);
                            } catch (e) {
                                reject(e);
                            }
                        }
                        for (var i = 0; i < args.length; i++) res(i, args[i]);
                    });
                };
                /**
                 * @param {any[]} arr 
                 * @returns {Deferred}
                 */
                Deferred.race = function (arr) {
                    return new Deferred(function (resolve, reject) {
                        if (!Deferred._isArray(arr)) return reject(new TypeError('Promise.race accepts an array'));
                        for (var i = 0, len = arr.length; i < len; i++) Deferred.resolve(arr[i]).then(resolve, reject);
                    });
                };

                /**
                 * @param {Function} onFulfilled 
                 * @param {Function} onRejected 
                 * @returns {Deferred}
                 */
                Deferred.prototype.then = function (onFulfilled, onRejected) {
                    var d = new Deferred(Deferred._noop);
                    Deferred._handle(this, new (Deferred._Handler)(onFulfilled, onRejected, d));
                    return d;
                };
                /** @param {Function} onRejected */
                Deferred.prototype['catch'] = function (onRejected) {
                    return this.then(null, onRejected);
                };
                /** @param {Function} callback */
                Deferred.prototype['finally'] = function (callback) {
                    return this.then(
                        function (value) {
                            return Deferred.resolve(callback()).then(function () {
                                return value;
                            });
                        },
                        function (reason) {
                            return Deferred.resolve(callback()).then(function () {
                                return Deferred.reject(reason);
                            });
                        }
                    );
                };

                return Deferred;
            })(),
            //--------------------------------------------------
            // プロパティ
            version: '1.0.0',
            errors: {
                DependencyError: (function () {
                    /**
                     * @constructor
                     * @param {string} [message=undefined] 
                     */
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
            ////////////////////////////////////////////////////////////////////////
            // プライベートプロパティ ////////////////////////////////////////////////
            _conflict: {},
            _keys: [
                'm'
            ],
            _nodeModule: {
                clipboardy: requireNodeModule('clipboardy'),
                fs: requireNodeModule('fs'),
                canvas: requireNodeModule('canvas'),
                crypto: requireNodeModule('crypto'),
                axios: requireNodeModule('axios')
            },
            _available: {
                document: typeof document === 'object' && document instanceof Document
            }
            ////////////////////////////////////////////////////////////////////////
        };

        // エクスポート
        if (typeof exports === 'object' && exports !== null && !exports.nodeType &&
            typeof module === 'object' && module !== null && !module.nodeType
            && module.exports === exports) module.exports = lib;
        else {
            for (var i = 0; i < lib._keys.length; i++) {
                var k = lib._keys[i];
                if (k in root) lib._conflict[k] = root[k];
                root[k] = lib;
            }
        }
    }
)(
    typeof window === 'object' && window !== null ? window : this,
    void 0
);
