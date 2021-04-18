'use strict';
(function _main(_root, _undef) {
    var _ctx = {
        libKey: [],
        conflict: {},
        fn: {
            noConflict: function () {
                for (var i = 0; i < _ctx.libKey.length; i++) {
                    var k = _ctx.libKey[i];
                    if (k in _ctx.conflict) _root[k] = _ctx.conflict[k];
                    else delete _root[k];
                }
                return _ctx.conflict;
            },
            getType: function (x) {
                return Object.prototype.toString.call(x).slice(8, -1);
            },
            isType: function (x, typeName) {
                var xType = _ctx.fn.getType(x);
                switch (_ctx.fn.getType(typeName)) {
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
            castType: function (x, defaultValue, allowType) {
                var typeList = _ctx.fn.isType(allowType, 'RegExp') ? allowType : [_ctx.fn.getType(defaultValue)];
                if (Array.isArray(typeList)) Array.prototype.push.apply(
                    typeList,
                    Array.isArray(allowType) ? allowType : typeof allowType === 'string' ? [allowType] : []
                );
                return _ctx.fn.isType(x, typeList) ? x : defaultValue;
            },
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
                    for (var i = 0; i < propKeys.length; i++) obj[propKeys[i]] = param[propKeys[i]];
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

    var _lib = {
        key: [
            '
        ],
        val: (function () {
            function _requireNodeModule(id) {
                try {
                    return require(id);
                } catch (e) {
                    return e;
                }
            }

            var lib = {
                // 型関連
                getType: _ctx.fn.getType,
                isType: _ctx.fn.isType,
                castType: _ctx.fn.castType,
                castParam: _ctx.fn.castParam,
                is: function (a, b) {
                    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is
                    return a == b ? (a !== 0 || (1 / a === 1 / b)) : (a !== a && b !== b);
                },
                //--------------------------------------------------
                // 主にブラウザ関係の環境依存関連
                copy: function (str, execCommand) {
                    str = typeof str === 'string' ? str : '';
                    function execCommandCopy() {
                        lib._checkDependency('document');
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
                    if (lib._isNode) {
                        if (lib._nodeModule.clipboardy instanceof Error) lib._checkDependency('clipboardy');
                        else lib._nodeModule.clipboardy.writeSync(str);
                    } else if (typeof execCommand === 'boolean' ? execCommand : false) execCommandCopy();
                    else if (typeof clipboardData === 'object') clipboardData.setData('Text', str);
                    else if (typeof navigator === 'object' && typeof navigator.clipboard === 'object' &&
                        typeof location === 'object' && location.protocol === 'https:') navigator.clipboard.writeText(str).catch(function () {
                            lib.copy(str, true);
                        });
                    else execCommandCopy();
                },
                FileDownload: (function () {
                    function FDFactory() { }

                    FDFactory.prototype.from = function (filename, blob) {
                        lib._checkDependency('document');
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
                    FDFactory.prototype.text = function (title, str) {
                        title = (typeof title === 'string' && title.length > 0 ? title : 'download') + '.txt';
                        str = typeof str === 'string' ? str : '';
                        if (!(lib._nodeModule.fs instanceof Error)) fs.writeFileSync(title, str);
                        else return this.from(title, new Blob([
                            new Uint8Array([0xef, 0xbb, 0xbf]),
                            str.replace(/\n/g, '\r\n')
                        ]), { type: 'text/plain' });
                    };
                    FDFactory.prototype.image = function (title, dataURL) {
                        if (typeof dataURL !== 'string' || dataURL === '') return;
                        var m = dataURL.match(/^data:(image\/([a-z]+));base64,(.+)$/);
                        if (!m) return;
                        title = typeof title === 'string' && title.length > 0 ? title : 'download.' + m[2];
                        if (!(lib._nodeModule.fs instanceof Error)) fs.writeFileSync(title, m[3], 'base64');
                        else {
                            var b = atob(m[3]),
                                cont = new Uint8Array(b.length);
                            for (var i = 0; i < b.length; i++) cont[i] = b.charCodeAt(i);
                            return this.from(title, new Blob([cont], { type: m[1] }));
                        }
                    };

                    return new FDFactory();
                })(),
                //--------------------------------------------------
                // 配列関連
                range: function (start, stop, step) {
                    start = lib.clamp(typeof start === 'number' ? start : 0, lib._minSafeInt, lib._maxSafeInt);
                    stop = lib.clamp(typeof stop === 'number' ? stop : 0, lib._minSafeInt, lib._maxSafeInt);
                    step = lib.clamp(typeof step === 'number' ? step : 1, -lib._maxArrayLength, lib._maxArrayLength);
                    if (step === 0) step = (lib.isNegative(step) ? -1 : 1);
                    if (arguments.length === 1) {
                        stop = start;
                        start = 0;
                    }
                    if ((start > stop && !lib.isNegative(step)) ||
                        (start < stop && lib.isNegative(step))) return [];
                    var arr = new Array(Math.abs(Math.ceil((stop - start) / step)));
                    for (var i = 0; i < arr.length; i++) arr[i] = start + i * step;
                    return arr;
                },
                nonOverlap: function (array) {
                    array = Array.isArray(array) ? array : [];
                    if (array.length < 2) return array;
                    // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
                    if (typeof Set === 'function') return Array.from(new Set(array));
                    else {
                        var hasNaN = false,
                            filtered = [];
                        for (var i = 0; i < array.length; i++) {
                            if (!hasNaN && lib.isNaN(array[i]) ? hasNaN = true : array.indexOf(array[i]) === i) filtered.push(array[i]);
                        }
                        return filtered;
                    }
                },
                randArray: function (array, secure) {
                    array = Array.isArray(array) ? array : [];
                    return array[lib.randInt(0, array.length - 1, secure)];
                },
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
                repeat: function (str, count) {
                    str = typeof str === 'string' ? str : '';
                    count = lib.clamp(count, 0, lib._maxSafeInt);
                    if (str.length === 0) return '';
                    if (count < lib._maxArrayLength) return new Array(count + 1).join(str);
                    var repeatStr = '';
                    for (var i = 0; i < count; i++) repeatStr += str;
                    return repeatStr;
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
                inspect: function (x) {
                    var seen = [];
                    return (function func(x) {
                        if (seen.indexOf(x) !== -1) return '[Circular]';
                        var xType = lib.getType(x),
                            res = [];
                        switch (xType) {
                            case 'Map':
                                seen.push(x);
                                var mapKeys = Array.from(x.keys());
                                for (var i = 0; i < mapKeys.length; i++) {
                                    var k = mapKeys[i];
                                    res.push(func(k) + ' => ' + func(x.get(k)));
                                }
                                seen.pop();
                                return 'Map(' + x.size + ') {' + (x.size === 0 ? '' : ' ' + res.join(', ') + ' ') + '}';
                            case 'Set':
                                seen.push(x);
                                var vals = Array.from(x.values());
                                for (var i = 0; i < vals.length; i++) res.push(func(vals[i]));
                                seen.pop();
                                return 'Set(' + x.size + ') {' + (x.size === 0 ? '' : ' ' + res.join(', ') + ' ') + '}';
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
                                if (typeof x === 'object') {
                                    var isArr = Array.isArray(x),
                                        literal = isArr ? { left: '[', right: ']' } : {
                                            left: (function () {
                                                if (x.constructor === Object || x.constructor.name === '') return '';
                                                if ('name' in x.constructor) return x.constructor.name + ' ';
                                                var constructorName = x.constructor.toString().replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
                                                return constructorName === '' ? '' : constructorName + ' ';
                                            })() + '{',
                                            right: '}'
                                        },
                                        propKeys = Object.getOwnPropertyNames(x)
                                            .concat(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(x) : []);
                                    if (propKeys.length === 0) return literal.left + literal.right;
                                    seen.push(x);
                                    for (var i = 0; i < propKeys.length; i++) {
                                        var k = propKeys[i],
                                            descript = Object.getOwnPropertyDescriptor(x, k);
                                        console.log(descript.enumerable);
                                        res.push((function () {
                                            if (typeof k === 'symbol' || !descript.enumerable) return '[' + k.toString() + ']: ';
                                            if (isArr && /^\d+$/.test(k)) return '';
                                            return (/^([a-z$_][\w$]*)$/i.test(k) ? k : "'" + k + "'") + ': ';
                                        })() + (
                                                typeof descript.get === 'function' && typeof descript.set === 'function' ? '[Getter/Setter]' :
                                                    typeof descript.get === 'function' ? '[Getter]' :
                                                        typeof descript.set === 'function' ? '[Setter]' :
                                                            func(x[k])
                                            ));
                                    }
                                    seen.pop();
                                    return literal.left + ' ' + res.join(', ') + ' ' + literal.right;
                                } else return xType;
                        }
                    })(x);
                },
                URI: (function () {
                    function URI(uri) {
                        if (!(this instanceof URI)) return new URI(uri);
                        var parseData = URI.from(uri),
                            dataKeys = Object.keys(parseData);
                        for (var i = 0; i < dataKeys.length; i++) this[dataKeys[i]] = parseData[dataKeys[i]];
                    }

                    URI.from = URI.prototype.from = function (uri) {
                        var m = (
                            typeof uri === 'string' ? uri :
                                typeof URL === 'function' && uri instanceof URL ? uri.href :
                                    lib._href
                        ).match(new RegExp('^' + URI.pattern + '$')) || [];
                        return m;
                    };
                    URI.pattern = URI.prototype.pattern = '(([^:]+:)(//)?([^?#]+))(\\?[^#]*)?(#.*)?';

                    return URI;
                })(),
                StringImage: (function () {
                    function SIFactory() { }

                    SIFactory.prototype.encode = function (str) {
                        str = typeof str === 'string' ? str : '';
                        return new lib.PromiseLike(function (resolve, reject) {
                            lib._checkDependency('document');
                            if (str.length === 0) reject(new RangeError('The string to be converted must be at least one character long.'));
                            var arr = [];
                            for (var i = 0; i < str.length; i++) {
                                var n = str.charCodeAt(i);
                                if (n < 128) arr.push(n);
                                else arr.push(
                                    128,
                                    (0xff00 & n) >> 8, // 前
                                    0xff & n // 後
                                );
                            }
                            var width = Math.ceil(Math.sqrt(arr.length / 3)),
                                cv = document.createElement('canvas');
                            cv.setAttribute('width', width);
                            cv.setAttribute('height', width);
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
                    SIFactory.prototype.decode = function (src) {
                        return new lib.PromiseLike(function (resolve, reject) {
                            lib._checkDependency('document');
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
                                reject(new Error('Invalid image source.'));
                            };
                            img.src = typeof src === 'string' ? src : '';
                        });
                    };

                    return new SIFactory();
                })(),
                Base58: (function () {
                    function B58Factory() { }

                    B58Factory.prototype._getBaseNInstance = (function () {
                        var to58;
                        return function () {
                            return to58 || (to58 = new lib.BaseN(58));
                        };
                    })();
                    B58Factory.prototype.encode = function (str) {
                        str = typeof str === 'string' ? str : '';
                        var to58 = this._getBaseNInstance(),
                            replaced = '';
                        for (var i = 0; i < str.length; i++) {
                            if (to58.base.indexOf(str[i]) !== -1) replaced += this._sign[0] + str[i] + this._sign[0];
                            else {
                                var encoded = to58.encode(str.charCodeAt(i)),
                                    len = encoded.length;
                                replaced += len > 3 ? '' : this._sign[len] + (lib.repeat('0', len) + encoded).slice(-len) + this._sign[len];
                            }
                        }
                        return replaced.replace(/([WXYZ])\1/g, '').replace(/[WXYZ](?=[WXYZ])/g, '').slice(0, -1).replace(/^W/, '');
                    };
                    B58Factory.prototype.decode = function (str) {
                        var that = this;
                        return (typeof str === 'string' ? str : '').replace(/[WXYZ][^WXYZ]*/g, function (m) {
                            var idx = that._sign.indexOf(m[0]);
                            if (idx === 0) return m.slice(1);
                            return m.slice(1).replace(new RegExp('.{' + idx + '}', 'g'), function (n) {
                                return String.fromCharCode(that._getBaseNInstance().decode(n));
                            });
                        });
                    };
                    B58Factory.prototype._sign = 'WXYZ';

                    return new B58Factory();
                })(),
                EditDistance: (function () {
                    // https://www.bugbugnow.net/2020/02/levenshtein-distance.html
                    function EditDistance(a, b) {
                        if (!(this instanceof EditDistance)) return new EditDistance(a, b);
                        this._a = typeof a === 'string' ? a : '';
                        this._b = typeof b === 'string' ? b : '';
                        this._max = Math.max(this._a.length, this._b.length);
                    }

                    function snake(k, y, a, b) {
                        var x = y - k;
                        while (x < a.length && y < b.length && a.charCodeAt(x) === b.charCodeAt(y)) {
                            x++;
                            y++;
                        }
                        return y;
                    }

                    EditDistance.prototype.levenshtein = function (threshold) {
                        var that = this;
                        threshold = (1 - lib.clamp(
                            typeof threshold === 'number' ? threshold : 0,
                            lib._minSafeInt, lib._maxSafeInt
                        )) * that._max;
                        if (that._a === that._b) return threshold >= 1 ? threshold : 1;
                        return 1 - ((function () {
                            var s1 = that._a.length < that._b.length ? that._a : that._b,
                                s2 = that._a.length < that._b.length ? that._b : that._a,
                                len1 = s1.length, len2 = s2.length;
                            if (threshold === 0 || threshold > len2) threshold = len2;
                            if (len2 - len1 >= threshold || len1 === 0) return threshold;
                            var r, c, min, minDistance, ins, sub, d = [];
                            for (c = 1; c <= len2; c++) d.push(c);
                            for (r = 0; r < len1; r++) {
                                ins = min = r + 1;
                                minDistance = len2;
                                for (c = 0; c < len2; c++) {
                                    sub = ins - (s1.charCodeAt(r) !== s2.charCodeAt(c) ? 0 : 1);
                                    ins = d[c] + 1;
                                    min = min < ins ? (min < sub ? min + 1 : sub) : (ins < sub ? ins : sub);
                                    d[c] = min;
                                    if (min < minDistance) minDistance = min;
                                }
                                if (minDistance >= threshold) return threshold;
                            }
                            return min > threshold ? threshold : min;
                        })() / that._max);
                    };
                    EditDistance.prototype.editOND = function () {
                        var that = this;
                        if (that._a === that._b) return 1;
                        return 1 - ((function () {
                            var len1 = that._a.length,
                                len2 = that._b.length,
                                max = len1 + len2,
                                offset = max + 1,
                                x, y, d, k, kk,
                                v = new Array(offset * 2 + 1);
                            v[1 + offset] = 0;
                            for (d = 0; d <= max; d++) {
                                for (k = -d; k <= d; k += 2) {
                                    kk = k + offset;
                                    x = (k === -d || (k !== d && v[kk - 1] < v[kk + 1])) ? v[kk + 1] : v[kk - 1] + 1;
                                    y = x - k;
                                    while (x < len1 && y < len2 && that._a.charCodeAt(x) === that._b.charCodeAt(y)) {
                                        x++;
                                        y++;
                                    }
                                    v[kk] = x;
                                    if (x >= len1 && y >= len2) return d;
                                }
                            }
                            return -1;
                        })() / that._max);
                    };
                    EditDistance.prototype.editONP = function () {
                        var that = this;
                        if (that._a === that._b) return 1;
                        return 1 - ((function () {
                            var s1 = that._a.length < that._b.length ? that._a : that._b,
                                s2 = that._a.length < that._b.length ? that._b : that._a,
                                k, kk, p,
                                v0, v1,
                                len1 = s1.length, len2 = s2.length,
                                delta = len2 - len1,
                                offset = len1 + 1,
                                dd = delta + offset,
                                dc = dd - 1,
                                de = dd + 1,
                                max = len1 + len2 + 3,
                                fp = [];
                            for (p = 0; p < max; p++) fp.push(-1);
                            for (p = 0; fp[dd] != len2; p++) {
                                for (k = -p; k < delta; k++) {
                                    kk = k + offset;
                                    v0 = fp[kk - 1] + 1;
                                    v1 = fp[kk + 1];
                                    fp[kk] = snake(k, (v0 > v1 ? v0 : v1), s1, s2);
                                }
                                for (k = delta + p; k > delta; k--) {
                                    kk = k + offset;
                                    v0 = fp[kk - 1] + 1;
                                    v1 = fp[kk + 1];
                                    fp[kk] = snake(k, (v0 > v1 ? v0 : v1), s1, s2);
                                }
                                v0 = fp[dc] + 1;
                                v1 = fp[de];
                                fp[dd] = snake(delta, (v0 > v1 ? v0 : v1), s1, s2);
                            }
                            return delta + (p - 1) * 2;
                        })() / that._max);
                    };

                    return EditDistance;
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
                        if (!(lib._nodeModule.crypto instanceof Error)) return lib._nodeModule.crypto.randomInt(min, max);
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
                                if (val < maxNum - maxNum % numRange) return min + (val % numRange);
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
                            num = Math.floor(num);
                            str = this.base[num % this.base.length] + str;
                            num /= this.base.length;
                        }
                        return str.slice(1);
                    };
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
                selector: function (elm) {
                    lib._checkDependency('document');
                    return elm instanceof Element ? elm :
                        typeof elm === 'string' ? document.querySelector(elm || 'body') || document.body :
                            document.body;
                },
                getCSS: function (elm) {
                    lib._checkDependency('document');
                    elm = lib.selector(elm);
                    return elm.currentStyle || document.defaultView.getComputedStyle(elm, '');
                },
                //--------------------------------------------------
                // その他
                noConflict: function () {
                    _ctx.fn.noConflict();
                    return lib;
                },
                loadLib: function (src) {
                    lib._checkDependency('document');
                    src = (Array.isArray(src) ? src : [src]).concat(Array.prototype.slice.call(arguments, 1));
                    return new lib.PromiseLike(function (resolve) {
                        var ifr = document.createElement('iframe');
                        document.body.appendChild(ifr);
                        ifr.style.display = 'none';
                        var cnt = 0,
                            ifrWin = (function () {
                                var obj = {},
                                    propKeys = lib.getKeys(ifr.contentWindow).all;
                                for (var i = 0; i < propKeys.length; i++) obj[propKeys[i]] = ifr.contentWindow[propKeys[i]];
                                return obj;
                            })();
                        for (var i = 0; i < src.length; i++) {
                            var e = ifr.contentDocument.createElement('script');
                            ifr.contentDocument.body.appendChild(e);
                            e.src = src[i];
                            e.onload = e.onerror = function () {
                                if (++cnt < src.length) return;
                                var diff = {},
                                    nowIfrWin = (function () {
                                        var obj = {},
                                            propKeys = lib.getKeys(ifr.contentWindow).all;
                                        for (var i = 0; i < propKeys.length; i++) obj[propKeys[i]] = ifr.contentWindow[propKeys[i]];
                                        return obj;
                                    })(),
                                    propKeys = lib.getKeys(nowIfrWin).all;
                                for (var o = 0; o < propKeys.length; o++) {
                                    var k = propKeys[o];
                                    if (!lib.is(ifrWin[k], nowIfrWin[k])) diff[k] = nowIfrWin[k];
                                }
                                document.body.removeChild(ifr);
                                resolve({
                                    diff: diff,
                                    iframe: ifr
                                });
                            };
                        }
                    });
                },
                getKeys: function (x) {
                    var res = {
                        default: {
                            enumerable: [],
                            unenumable: [],
                            symbol: []
                        },
                        proto: {
                            enumerable: [],
                            unenumable: [],
                            symbol: []
                        },
                        all: []
                    };
                    if (x === null || x === _undef) return null;
                    function pushKey(obj, type) {
                        if (typeof Object.getOwnPropertySymbols === 'function') Array.prototype.push.apply(type.symbol, Object.getOwnPropertySymbols(obj));
                        var dataKeys = Object.getOwnPropertyNames(obj);
                        for (var i = 0; i < dataKeys.length; i++) (type[
                            obj.propertyIsEnumerable(dataKeys[i]) ? 'enumerable' : 'unenumable'
                        ]).push(dataKeys[i]);
                        Array.prototype.push.apply(res.all, dataKeys.concat(type.symbol));
                    }
                    var proto = typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(x) : x.__proto__;
                    if (proto === null) res.proto = null;
                    else pushKey(proto, res.proto);
                    if (typeof x === 'object' || typeof x === 'function') pushKey(x, res.default);
                    if (res) res.all = lib.nonOverlap(res.all);
                    return res;
                },
                getColorName: function () {
                    return lib._colorName;
                },
                getRGB: function (color) {
                    color = typeof color === 'string' ? color : '';
                    var r = 0, g = 0, b = 0;
                    if (Object.keys(lib._colorName).indexOf(color) !== -1) color = '#' + lib._colorName[color];
                    if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(color)) {
                        var rgb = color.match(/[\da-f]{2}/ig) || [0, 0, 0];
                        for (var i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i].toString(16), '16');
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                    } else {
                        lib._checkDependency('document');
                        var e = document.createElement('div');
                        document.body.appendChild(e);
                        e.style.color = color;
                        var rgb = lib.getCSS(e).color.match(/\d+/g) || [0, 0, 0];
                        for (var i = 0; i < rgb.length; i++) rgb[i] = Number(rgb[i]);
                        document.body.removeChild(e);
                        r = rgb[0];
                        g = rgb[1];
                        b = rgb[2];
                    }
                    return [r, g, b];
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
                    return [
                        hue,
                        (((max + min) / 2) < 255 / 2 ? (
                            max + min <= 0 ? 0 :
                                (max - min) / (max + min) * 100
                        ) : (max - min) / (255 * 2 - max - min) * 100) || 0,
                        (max + min) / 255 / 2 * 100
                    ];
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
                    return [r * 255, g * 255, b * 255]
                },
                PromiseLike: (function () {
                    // https://github.com/taylorhakes/promise-polyfill
                    function PromiseLike(func) {
                        if (!(this instanceof PromiseLike)) throw new TypeError('Promises must be constructed via new');
                        if (typeof func !== 'function') throw new TypeError('not a function');
                        this._state = 0;
                        this._handled = false;
                        this._value = _undef;
                        this._deferreds = [];
                        PromiseLike._doResolve(func, this);
                    }

                    PromiseLike._immediateFn = (function (setTimeoutFunc, setImmediateFunc) {
                        return function (func) {
                            typeof setImmediateFunc === 'function' ? setImmediateFunc(func) : setTimeoutFunc(func, 0);
                        };
                    })(
                        setTimeout,
                        typeof setImmediate !== 'undefined' ? setImmediate : null
                    );
                    PromiseLike._noop = function () { };
                    PromiseLike._isArray = function (x) {
                        return !!(x && typeof x.length !== 'undefined');
                    };
                    PromiseLike._bind = function (func, thisArg) {
                        return function () {
                            func.apply(thisArg, arguments);
                        };
                    };
                    PromiseLike._unhandledRejectionFn = function _unhandledRejectionFn(err) {
                        if (typeof console === 'object' && console !== null) console.warn('Possible Unhandled Promise Rejection:', err);
                    };
                    PromiseLike._handle = function (that, deferred) {
                        while (that._state === 3) that = that._value;
                        if (that._state === 0) return void that._deferreds.push(deferred);
                        that._handled = true;
                        PromiseLike._immediateFn(function () {
                            var cb = that._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                            if (cb === null) return void (PromiseLike[that._state === 1 ? '_resolve' : '_reject'])(
                                deferred.promise, that._value
                            );
                            var ret;
                            try {
                                ret = cb(that._value);
                            } catch (e) {
                                return void PromiseLike._reject(deferred.promise, e);
                            }
                            PromiseLike._resolve(deferred.promise, ret);
                        });
                    };
                    PromiseLike._finale = function (that) {
                        if (that._state === 2 && that._deferreds.length === 0) PromiseLike._immediateFn(function () {
                            if (!that._handled) PromiseLike._unhandledRejectionFn(that._value);
                        });
                        for (var i = 0, len = that._deferreds.length; i < len; i++) PromiseLike._handle(that, that._deferreds[i]);
                        that._deferreds = null;
                    };
                    PromiseLike._resolve = function (that, newValue) {
                        try {
                            if (newValue === that) throw new TypeError('A promise cannot be resolved with itself.');
                            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                                var then = newValue.then;
                                if (newValue instanceof PromiseLike) {
                                    that._state = 3;
                                    that._value = newValue;
                                    return void PromiseLike._finale(that);
                                } else if (typeof then === 'function') return void PromiseLike._doResolve(PromiseLike._bind(then, newValue), that);
                            }
                            that._state = 1;
                            that._value = newValue;
                            PromiseLike._finale(that);
                        } catch (e) {
                            PromiseLike._reject(that, e);
                        }
                    };
                    PromiseLike._reject = function (that, newValue) {
                        that._state = 2;
                        that._value = newValue;
                        PromiseLike._finale(that);
                    };
                    PromiseLike._doResolve = function (func, that) {
                        var done = false;
                        try {
                            func(
                                function (value) {
                                    if (done) return;
                                    done = true;
                                    PromiseLike._resolve(that, value);
                                },
                                function (reason) {
                                    if (done) return;
                                    done = true;
                                    PromiseLike._reject(that, reason);
                                }
                            );
                        } catch (e) {
                            if (done) return;
                            done = true;
                            PromiseLike._reject(that, e);
                        }
                    };
                    PromiseLike._Handler = function (onFulfilled, onRejected, promise) {
                        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                        this.promise = promise;
                    };
                    PromiseLike.resolve = function (value) {
                        return value && typeof value === 'object' && value.constructor === PromiseLike ? value :
                            new PromiseLike(function (resolve) {
                                resolve(value);
                            });
                    };
                    PromiseLike.reject = function (value) {
                        return new PromiseLike(function (resolve, reject) {
                            reject(value);
                        });
                    };
                    PromiseLike.allSettled = function (arr) {
                        return new PromiseLike(function (resolve, reject) {
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
                    PromiseLike.all = function (arr) {
                        return new PromiseLike(function (resolve, reject) {
                            if (!PromiseLike._isArray(arr)) return reject(new TypeError('Promise.all accepts an array'));
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
                    PromiseLike.race = function (arr) {
                        return new PromiseLike(function (resolve, reject) {
                            if (!PromiseLike._isArray(arr)) return reject(new TypeError('Promise.race accepts an array'));
                            for (var i = 0, len = arr.length; i < len; i++) PromiseLike.resolve(arr[i]).then(resolve, reject);
                        });
                    };

                    PromiseLike.prototype.then = function (onFulfilled, onRejected) {
                        var pl = new PromiseLike(PromiseLike._noop);
                        PromiseLike._handle(this, new (PromiseLike._Handler)(onFulfilled, onRejected, pl));
                        return pl;
                    };
                    PromiseLike.prototype['catch'] = function (onRejected) {
                        return this.then(null, onRejected);
                    };
                    PromiseLike.prototype['finally'] = function (callback) {
                        return this.then(
                            function (value) {
                                return PromiseLike.resolve(callback()).then(function () {
                                    return value;
                                });
                            },
                            function (reason) {
                                return PromiseLike.resolve(callback()).then(function () {
                                    return PromiseLike.reject(reason);
                                });
                            }
                        );
                    };

                    return PromiseLike;
                })(),
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
                _maxSafeInt: Math.pow(2, 53) - 1,
                _minSafeInt: -(Math.pow(2, 53) - 1),
                _maxArrayLength: Math.pow(2, 32) - 1,
                _href: typeof location === 'object' ? location.href : '',
                _isNode: typeof process === 'object' && typeof process.release === 'object' && process.release.name === 'node',
                _available: {
                    document: typeof document === 'object' && document instanceof Document,
                    clipboardy: false
                },
                _errorMessage: {
                    document: 'This feature is only available in environments where Document is available.',
                    clipboardy: "To use this feature with Node.js, the 'clipboardy' package is required."
                },
                _nodeModule: {
                    clipboardy: _requireNodeModule('clipboardy'),
                    fs: _requireNodeModule('fs'),
                    crypto: _requireNodeModule('crypto')
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

    if (typeof module === 'object' && module !== null) module.exports = _lib.val;
    else {
        for (var i = 0; i < _lib.key.length; i++) {
            var k = _ctx.libKey[i] = _lib.key[i];
            if (k in _root) _ctx.conflict[k] = _root[k];
            _root[k] = _lib.val;
        }
    }

    return {
        _main: _main,
        _root: _root,
        _undef: _undef,
        _ctx: _ctx,
        _lib: _lib
    };
})(typeof window === 'object' && window !== null ? window : this, void 0);
