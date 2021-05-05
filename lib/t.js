(
    /**
     * @param {window|global|globalThis} root
     * @param {undefined} undef
     */
    function (root, undef) {
        'use strict'
        // constant
        /** @readonly */
        var MAX_SAFE_INTEGER = 9007199254740991, // Math.pow(2, 53) - 1
            MIN_SAFE_INTEGER = -9007199254740991,
            MAX_ARRAY_LENGTH = 4294967295, // Math.pow(2, 32) - 1
            NEGATIVE_MAX_ARRAY_LENGTH = -4294967295,
            ERROR_MESSAGE = Object.freeze({
                document: 'This feature is only available in environments where Document is available',
                storage: 'This method requires an available storage API'
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
            })

        // local vars
        var ss,
            covers = [],
            href = typeof location === 'object' && location !== null && typeof location.href === 'string' ? location.href : '',
            available = {
                document: typeof document === 'object' && document !== null && document instanceof Document,
                gmStorage: typeof GM === 'object' && GM !== null &&
                    typeof GM.getValue === 'function' && typeof GM.setValue === 'function'
            },
            reqAnimFrame = root.requestAnimationFrame ||
                root.webkitRequestAnimationFrame ||
                root.mozRequestAnimationFrame ||
                root.oRequestAnimationFrame ||
                root.msRequestAnimationFrame ||
                function (callback) {
                    return root.setTimeout(callback, 1000 / 60)
                },
            cancelAnimFrame = root.cancelAnimationFrame ||
                root.webkitCancelAnimationFrame ||
                root.mozCancelAnimationFrame ||
                root.oCancelAnimationFrame ||
                root.msCancelAnimationFrame ||
                root.clearTimeout,
            NodeModuleCache = (function () {
                function NodeModuleCache() {
                    if (!(this instanceof NodeModuleCache)) return new NodeModuleCache()
                    this._key = []
                    this._cache = []
                }

                var CacheData = (function () {
                    function CacheData(nmc, id) {
                        if (!(this instanceof CacheData)) return new CacheData(nmc, id)
                        id = String(id)
                        this._nmc = nmc
                        this._id = id
                        try {
                            this._value = require(id)
                            this.isFailed = false
                        } catch (e) {
                            this._value = e
                            this.isFailed = true
                        } finally {
                            nmc._key.push(id)
                            nmc._cache.push(this)
                        }
                    }

                    CacheData.prototype.release = function () {
                        var idx = this._nmc._key.indexOf(this._id)
                        if (idx === -1) return false
                        this._nmc._key.splice(idx, 1)
                        this._nmc._cache.splice(idx, 1)
                        return true
                    }

                    CacheData.prototype.value = function (value) {
                        if (arguments.length === 0) return this._value
                        this._value = value
                        this.isFailed = false
                        return this
                    }

                    return CacheData
                })()

                NodeModuleCache.prototype.require = function (id) {
                    id = String(id)
                    var idx = this._key.indexOf(id)
                    if (idx !== -1) return this._cache[idx]
                    return new CacheData(this, id)
                }

                NodeModuleCache.prototype.release = function () {
                    while (this._key.length > 0 || this._cache.length > 0) {
                        this._key.pop()
                        this._cache.pop()
                    }
                    return this
                }

                NodeModuleCache.prototype.has = function (id) {
                    return this._key.indexOf(String(id)) !== -1
                }

                return NodeModuleCache
            })(),
            nmc = new NodeModuleCache()

        // fns
        function getTimestamp() {
            return typeof performance === 'object' && performance !== null &&
                typeof performance.now === 'function' ? performance.now() :
                typeof Date.now === 'function' ? Date.now() :
                    new Date().getTime()
        }
        function rawSelector(query) {
            return query instanceof Element ? query :
                document.querySelector(typeof query === 'string' && /\S+/.test(query) ? query : 'body') || document.body
        }
        function rawGetCSS(elm) {
            elm = rawSelector(elm)
            return elm.currentStyle || document.defaultView.getComputedStyle(elm, '')
        }
        function rawGetFontSize(elm) {
            return Number(rawGetCSS(elm).fontSize.slice(0, -2)) + 1
        }
        function rawTriggerEvent(elm, event) {
            elm = rawSelector(elm)
            event = typeof event === 'string' ? event : ''
            // https://qiita.com/ryounagaoka/items/a48d3a4c4faf78a99ae5
            if (typeof document.createEvent === 'function') {
                var ev = document.createEvent('HTMLEvents')
                ev.initEvent(event, true, true) // event type, bubbling, cancelable
                elm.dispatchEvent(ev)
            } else elm.fireEvent('on' + event, document.createEventObject())
        }
        function setAttr(p, elm) {
            if (p.id !== '') elm.setAttribute('id', p.id)
            if (p.class !== '') elm.classList.add(p.class)
            if (typeof p.placeholder === 'string' && p.placeholder.length > 0) elm.setAttribute('placeholder', p.placeholder)
            elm.style.maxWidth = '95%'
            elm.style.minWidth = rawGetFontSize() * 5
            elm.style.verticalAlign = 'middle'
        }
        function setResize(p, elm, func) {
            function resize() {
                var fontSize = rawGetFontSize(),
                    pw = p.parentNode.style.width
                // Adjusting the width
                function mostLongLine(str) {
                    var arr = str.split('\n'),
                        max = arr[0].length
                    for (var i = 1; i < arr.length; i++) {
                        if (max < arr[i].length) max = arr[i].length
                    }
                    return max
                }
                if (p.width !== '') elm.style.width = p.width
                else {
                    var maxWidth = pw
                    if (p.title !== '') maxWidth -= fontSize * (p.title.length + 1)
                    var width = fontSize * mostLongLine(func())
                    if (p.placeholder !== '') {
                        var phWidth = fontSize * mostLongLine(p.placeholder)
                        if (phWidth > width) width = phWidth
                    }
                    if (width > maxWidth) width = maxWidth
                    elm.style.width = width + 'px'
                }
                // Height Adjustment
                if (!p.textarea) return
                if (p.height !== '') elm.style.height = p.height
                else {
                    var line = func().split('\n').length,
                        linePh = p.placeholder.split('\n').length
                    if (line < linePh) line = linePh
                    var lines = func().split('\n')
                    for (var i = 0; i < lines.length; i++) {
                        line += Math.floor((lines[i].length * fontSize) / pw)
                    }
                    elm.style.height = line + 'em'
                }
            }
            resize()
            window.addEventListener('resize', resize)
            elm.addEventListener('keyup', resize)
            elm.addEventListener('click', resize)
            elm.addEventListener('change', resize)
            elm.addEventListener('appear', resize)
        }
        function setCommonInput(lib, p, elm) {
            var h = document.createElement('div')
            lib.addElement(p.parentNode, h, !!p.insertBefore)
            if (p.title !== '') h.textContent = p.title + ': '
            h.appendChild(elm)
            elm.value = p.value
            elm.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') p.enter()
            })
            if (!!p.readonly) {
                elm.setAttribute('readonly', true)
                elm.addEventListener('click', function () {
                    lib.copy(elm.value)
                    elm.select()
                })
                elm.style.backgroundColor = '#e9e9e9'
                elm.style.tabIndex = '-1'
                elm.style.cursor = 'pointer'
            }
            if (p.save.key !== '') new lib.SaveStorage({
                namespace: p.save.namespace,
                type: p.save.type
            }).load(p.save.key).then(function (v) {
                elm.value = v
                rawTriggerEvent(elm, 'change')
            })
        }
        function tryFunc(func) {
            try {
                func()
            } catch (e) {
                console.error(e)
            }
        }

        // lib
        var libConflict = {},
            libKey = [
                'antimatterx',
                'amx'
            ],
            lib = Object.freeze({
                // type related
                typeOf: function (x) {
                    return Object.prototype.toString.call(x).slice(8, -1)
                },
                isType: function (x, typeName) {
                    var xType = lib.typeOf(x)
                    switch (lib.typeOf(typeName)) {
                        case 'String':
                            return xType === typeName
                        case 'RegExp':
                            return typeName.test(xType)
                        case 'Array':
                            return typeName.indexOf(xType) !== -1
                        default:
                            return false
                    }
                },
                cast: function (x, defaultValue, allowType) {
                    var typeList = lib.isType(allowType, 'RegExp') ? allowType : [lib.typeOf(defaultValue)]
                    if (Array.isArray(typeList)) Array.prototype.push.apply(
                        typeList,
                        Array.isArray(allowType) ? allowType : typeof allowType === 'string' ? [allowType] : []
                    )
                    return lib.isType(x, typeList) ? x : defaultValue
                },
                castParam: function (param, defaultParam, allowTypeList) {
                    param = typeof param === 'object' && param !== null ? param : {}
                    defaultParam = typeof defaultParam === 'object' && defaultParam !== null ? defaultParam : {}
                    var defaultParamKeys = []
                    if (typeof defaultParam === 'object') Array.prototype.push.apply(
                        defaultParamKeys,
                        Object.getOwnPropertyNames(defaultParam)
                            .concat(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(defaultParam) : [])
                    )
                    switch (lib.typeOf(allowTypeList)) {
                        case 'String':
                        case 'RegExp':
                        case 'Array':
                            var obj = {}
                            for (var i = 0; i < defaultParamKeys.length; i++) obj[defaultParamKeys[i]] = allowTypeList
                            allowTypeList = obj
                        default:
                            allowTypeList = typeof allowTypeList === 'object' && allowTypeList !== null ? allowTypeList : {}
                    }
                    var clone = {},
                        paramKeys = []
                    if (typeof param === 'object') Array.prototype.push.apply(
                        paramKeys,
                        Object.getOwnPropertyNames(param)
                            .concat(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(param) : [])
                    )
                    for (var i = 0; i < paramKeys.length; i++) clone[paramKeys[i]] = param[paramKeys[i]]
                    for (var i = 0; i < defaultParamKeys.length; i++) {
                        var k = defaultParamKeys[i]
                        clone[k] = !(k in param) ? defaultParam[k] : lib.cast(
                            param[k], defaultParam[k],
                            lib.cast(allowTypeList[k], [], ['String', 'RegExp'])
                        )
                    }
                    return clone
                },
                is: function (a, b) {
                    return a === b ? (a !== 0 || (1 / a === 1 / b)) : (a !== a && b !== b)
                },
                isIterable: function (x) {
                    if (x === undef || x === null ||
                        typeof Symbol !== 'function' || typeof Symbol.iterator !== 'symbol') return false
                    return typeof x[Symbol.iterator] === 'function'
                },
                isArrayLike: function (x) {
                    if (typeof x !== 'object' || x === null) return false
                    if (lib.isIterable(x) ||
                        (typeof x === 'number' && x > -1 && x === x && x.length < Infinity &&
                            x !== x.window)) return true
                    return false
                },
                //--------------------------------------------------
                // mainly related to browser-related environment dependencies
                copy: function (str, execCommand) {
                    // This method depends on the package and browser APIs
                    str = typeof str === 'string' ? str : ''
                    var nmcClipboardy = nmc.require('clipboardy')
                    if (!nmcClipboardy.isFailed) nmcClipboardy.value().writeSync(str)
                    else {
                        if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                        if (!!execCommand) {
                            var e = document.createElement('textarea')
                            e.value = str
                            document.body.appendChild(e)
                            e.style.position = 'fixed'
                            e.style.left = '-100%'
                            e.select()
                            try {
                                document.execCommand('copy')
                            } catch (e) {
                                throw e
                            } finally {
                                e.blur()
                                document.body.removeChild(e)
                            }
                        } else if (typeof clipboardData === 'object' && clipboardData !== null) clipboardData.setData('Text', str)
                        else if (typeof navigator === 'object' && navigator !== null &&
                            typeof navigator.clipboard === 'object' && navigator.clipboard !== null &&
                            typeof location === 'object' && location !== null && location.protocol === 'https:') navigator.clipboard.writeText(str)
                                .catch(function (e) {
                                    console.warn(e)
                                    lib.copy(str, true)
                                })
                        else lib.copy(str, true)
                    }
                },
                fileDownload: (function () {
                    function FDFactory() {
                        if (!(this instanceof FDFactory)) return new FDFactory()
                    }

                    var URLObject = root.URL || root.webkitURL

                    FDFactory.prototype.fromBlob = function (filename, blob) {
                        if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                        if (typeof filename !== 'string' || filename === '' ||
                            typeof URLObject !== 'function' || typeof URLObject.createObjectURL !== 'function') return null
                        var e = document.createElement('a')
                        e.href = URLObject.createObjectURL(blob)
                        e.target = '_blank'
                        e.rel = 'noopener noreferrer'
                        e.download = filename
                        e.click()
                        URLObject.revokeObjectURL(e.href)
                        return e
                    }
                    FDFactory.prototype.text = function (str, title) {
                        str = typeof str === 'string' ? str : ''
                        title = (typeof title === 'string' && title.length > 0 ? title : 'download') + '.txt'
                        var nmcFS = nmc.require('fs')
                        if (!nmcFS.isFailed) {
                            nmcFS.value().writeFileSync(title, str)
                            return null
                        }
                        else return this.fromBlob(title, new Blob([
                            new Uint8Array([0xef, 0xbb, 0xbf]),
                            str.replace(/\n/g, '\r\n')
                        ]), { type: 'text/plain' })
                    }
                    FDFactory.prototype.image = function (dataURL, title) {
                        if (typeof dataURL !== 'string' || dataURL === '') return
                        var m = dataURL.match(/^data:(image\/([a-z]+));base64,(.+)$/)
                        if (!m) return
                        title = (typeof title === 'string' && title.length > 0 ? title : 'download') + ('.' + m[2])
                        var nmcFS = nmc.require('fs')
                        if (!nmcFS.isFailed) {
                            nmcFS.value().writeFileSync(title, m[3], 'base64')
                            return null
                        }
                        else {
                            var b = atob(m[3]),
                                cont = new Uint8Array(b.length)
                            for (var i = 0; i < b.length; i++) cont[i] = b.charCodeAt(i)
                            return this.fromBlob(title, new Blob([cont], { type: m[1] }))
                        }
                    }

                    return new FDFactory()
                })(),
                stringImage: (function () {
                    // This method depends on the browser's implementation of toDataURL (because some browsers, such as the 3DS browser, will change the pixel value)
                    function SIFactory() {
                        if (!(this instanceof SIFactory)) return new SIFactory()
                    }

                    SIFactory.prototype.encode = function (str) {
                        str = typeof str === 'string' ? str : ''
                        return new lib.Deferred(function (resolve, reject) {
                            if (str.length === 0) reject(new RangeError('The string to be converted must be at least one character long'))
                            var arr = []
                            for (var i = 0; i < str.length; i++) {
                                var n = str.charCodeAt(i)
                                if (n < 128) arr.push(n)
                                else arr.push(
                                    128,
                                    (0xff00 & n) >> 8, // prev
                                    0xff & n // after
                                )
                            }
                            var width = Math.ceil(Math.sqrt(arr.length / 3)),
                                nmcCanvas = nmc.require('canvas'),
                                cv = nmcCanvas.isFailed ? document.createElement('canvas') : new (nmcCanvas.value().Canvas)(width, width)
                            if (nmcCanvas.isFailed) {
                                cv.setAttribute('width', width)
                                cv.setAttribute('height', width)
                            }
                            var ctx = cv.getContext('2d'),
                                imgData = ctx.getImageData(0, 0, width, width),
                                cnt = 0
                            for (var i = 0; i < arr.length; i++) {
                                var x = i * 4
                                for (var o = 0; o < 3; o++) imgData.data[x + o] = arr[cnt++] || 0
                                imgData.data[x + 3] = 255 // There is a phenomenon that the pixel value changes in putImageData when transparency is specified
                            }
                            ctx.putImageData(imgData, 0, 0)
                            resolve(cv.toDataURL('image/png'))
                        })
                    }
                    SIFactory.prototype.decode = function (src) {
                        return new lib.Deferred(function (resolve, reject) {
                            var nmcCanvas = nmc.require('canvas'),
                                img = new (nmcCanvas.isFailed ? Image : nmcCanvas.value().Image)()
                            img.onload = function () {
                                var width = img.width,
                                    height = img.height,
                                    cv = nmcCanvas.isFailed ? document.createElement('canvas') : new (nmcCanvas.value().Canvas)(width, height)
                                if (nmcCanvas.isFailed) {
                                    cv.setAttribute('width', width)
                                    cv.setAttribute('height', height)
                                }
                                var ctx = cv.getContext('2d')
                                ctx.drawImage(img, 0, 0)
                                var data = ctx.getImageData(0, 0, width, height).data,
                                    arr = [],
                                    str = ''
                                for (var i = 0; i < data.length; i++) {
                                    for (var o = 0; o < 3; o++) arr.push(data[i * 4 + o])
                                }
                                for (var i = 0; i < arr.length; i++) {
                                    var n = arr[i]
                                    if (n < 128) str += String.fromCharCode(n)
                                    else if (n === 128) {
                                        str += String.fromCharCode((arr[i + 1] << 8) + arr[i + 2])
                                        i += 2
                                    }
                                }
                                resolve(str.replace(/\0+$/, ''))
                            }
                            img.onerror = function () {
                                reject('Invalid image source')
                            }
                            img.src = typeof src === 'string' ? src : ''
                        })
                    }

                    return new SIFactory()
                })(),
                SaveStorage: (function () {
                    function SaveStorage(options) {
                        if (!(this instanceof SaveStorage)) return new SaveStorage(options)
                        options = typeof options === 'object' && options !== null ? options : {}
                        this._namespace = typeof options.namespace === 'string' ? options.namespace : href
                        this._type = SaveStorage.isAvailableStorageType(options.type) ? options.type :
                            SaveStorage.getAvailableStorageType()
                        if (this.type === null) throw new lib.DependencyError(ERROR_MESSAGE.storage)
                    }

                    SaveStorage.isAvailableStorageType = function (type) {
                        switch (type) {
                            case 'GreasemonkeyStorage':
                                return available.gmStorage
                            case 'LocalStorage':
                                return typeof localStorage === 'object'
                            case 'Cookie':
                                return available.document && typeof document.cookie === 'string'
                            default:
                                return false
                        }
                    }
                    SaveStorage.getAvailableStorageType = function () {
                        var types = ['GreasemonkeyStorage', 'LocalStorage', 'Cookie']
                        for (var i = 0; i < types.length; i++) {
                            if (SaveStorage.isAvailableStorageType(types[i])) return types[i]
                        }
                        return null
                    }
                    SaveStorage.prototype.makeKey = function (key) {
                        key = typeof key === 'string' ? key : ''
                        return this._namespace + (key.length > 0 ? '|' : '') + key
                    }
                    SaveStorage.prototype.keys = function () {
                        var namespaceRegExp = new RegExp('^' + lib.escapeRegExp(this._namespace + '|')),
                            arr = []
                        switch (this._type) {
                            case 'GreasemonkeyStorage':
                                if (available.gmStorage && typeof GM.listValues !== 'function') throw new lib.DependencyError("If you want to use this method with Greasemonkey's storage API, you need to import GM.listValues")
                                return new lib.Deferred(function (resolve, reject) {
                                    GM.listValues().then(function (v) {
                                        for (var i = 0; i < v.length; i++) {
                                            if (namespaceRegExp.test(v[i])) arr.push(v[i].replace(namespaceRegExp, ''))
                                        }
                                        resolve(arr)
                                    }).catch(reject)
                                })
                            case 'LocalStorage':
                                var vals = Object.keys(localStorage)
                                for (var i = 0; i < localStorage.length; i++) {
                                    if (namespaceRegExp.test(vals[i])) arr.push(vals[i].replace(namespaceRegExp, ''))
                                }
                                break
                            case 'Cookie':
                                var cookies = document.cookie.split('; ')
                                for (var i = 0; i < cookies.length; i++) {
                                    var v = lib.base58.decode(cookies[i].split('=')[0])
                                    if (namespaceRegExp.test(v)) arr.push(v.replace(namespaceRegExp, ''))
                                }
                                break
                        }
                        return arr
                    }
                    SaveStorage.prototype.remove = function (key) {
                        var saveKey = this.makeKey(key)
                        if (saveKey.length === 0) return
                        switch (this._type) {
                            case 'GreasemonkeyStorage':
                                if (available.gmStorage && typeof GM.deleteValue !== 'function') throw new lib.DependencyError("If you want to use this method with Greasemonkey's storage API, you need to import GM.deleteValue")
                                GM.deleteValue(saveKey)
                                break
                            case 'LocalStorage':
                                localStorage.removeItem(saveKey)
                                break
                            case 'Cookie':
                                document.cookie = lib.base58.encode(saveKey) + '=; max-age=0'
                                break
                        }
                    }
                    SaveStorage.prototype.save = function (key, value) {
                        value = String(value)
                        var saveKey = this.makeKey(key)
                        if (saveKey.length === 0) return
                        switch (this._type) {
                            case 'GreasemonkeyStorage':
                                GM.setValue(saveKey, value)
                                break
                            case 'LocalStorage':
                                localStorage.setItem(saveKey, value)
                                break
                            case 'Cookie':
                                var datas = [saveKey, value]
                                for (var i = 0; i < datas.length; i++) datas[i] = lib.base58.encode(datas[i])
                                document.cookie = datas.join('=')
                                break
                        }
                    }
                    SaveStorage.prototype.load = function (key) {
                        var that = this
                        return new lib.Deferred(function (resolve, reject) {
                            var saveKey = that.makeKey(key)
                            if (saveKey.length === 0) reject(new RangeError('Invalid key'))
                            switch (that._type) {
                                case 'GreasemonkeyStorage':
                                    GM.getValue(saveKey, '').then(function (v) {
                                        resolve(v)
                                    })
                                    break
                                case 'LocalStorage':
                                    resolve(localStorage.getItem(saveKey) || '')
                                    break
                                case 'Cookie':
                                    var val = '',
                                        cookies = document.cookie.split('; ')
                                    for (var i = 0; i < cookies.length; i++) {
                                        var q = cookies[i].split('=')
                                        if (lib.base58.decode(q[0]) !== saveKey) continue
                                        val = lib.base58.decode(q[1])
                                        break
                                    }
                                    resolve(val)
                                    break
                            }
                        })
                    }

                    return SaveStorage
                })(),
                //--------------------------------------------------
                // array related
                max: function (array) {
                    array = Array.isArray(array) ? array : []
                    var max = -Infinity
                    for (var i = 0; i < array.length; i++) {
                        var v = array[i]
                        if (i === 0) max = v
                        if (typeof v !== 'number') throw new TypeError('The element at index ' + i + ' is not a numeric type')
                        if (v !== v) throw new TypeError('The element of index ' + i + ' is NaN')
                        if (max < v) max = v
                    }
                    return max
                },
                min: function (array) {
                    array = Array.isArray(array) ? array : []
                    var min = Infinity
                    for (var i = 0; i < array.length; i++) {
                        var v = array[i]
                        if (i === 0) min = v
                        if (typeof v !== 'number') throw new TypeError('The element at index ' + i + ' is not a numeric type')
                        if (v !== v) throw new TypeError('The element of index ' + i + ' is NaN')
                        if (min > v) min = v
                    }
                    return min
                },
                range: function (start, stop, step) {
                    start = lib.clamp(typeof start === 'number' ? start : 0, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)
                    stop = lib.clamp(typeof stop === 'number' ? stop : 0, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)
                    step = lib.clamp(typeof step === 'number' ? step : 1, NEGATIVE_MAX_ARRAY_LENGTH, MAX_ARRAY_LENGTH)
                    if (step === 0) step = lib.is(step, -0) ? -1 : 1
                    if (arguments.length === 1) {
                        stop = start
                        start = 0
                    }
                    var arr = []
                    if ((start > stop && !lib.isNegative(step)) ||
                        (start < stop && lib.isNegative(step))) return arr
                    for (var i = 0; i < Math.abs(Math.ceil((stop - start) / step)); i++) arr.push(start + i * step)
                    return arr
                },
                nonOverlap: function (array) {
                    array = Array.isArray(array) ? array : []
                    // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
                    if (typeof Set === 'function') return Array.from(new Set(array))
                    else {
                        var hasNaN = false,
                            arr = []
                        for (var i = 0; i < array.length; i++) {
                            var v = array[i]
                            if (!hasNaN && v !== v ? hasNaN = true : array.indexOf(v) === i) arr.push(v)
                        }
                        return arr
                    }
                },
                randArray: function (array, weights) {
                    // https://www.namakedame.work/js-randomized-algorithm/
                    array = Array.isArray(array) ? array : []
                    if (arguments.length < 2) return array[lib.randInt(0, (array.length || 1) - 1)]
                    if (!Array.isArray(weights)) throw new TypeError('Weights should be specified as an array of numbers')
                    weights = weights.slice(0, array.length)
                    var totalWeight = 0
                    for (var i = 0; i < weights.length; i++) totalWeight += Number(weights[i])
                    var r = Math.random() * totalWeight,
                        n = 0
                    for (var i = 0; i < weights.length; i++) {
                        n += Number(weights[i])
                        if (r < n) return array[i]
                    }
                },
                shuffle: function (array) {
                    array = Array.isArray(array) ? array.slice() : []
                    var len = array.length
                    while (len > 0) {
                        var i = Math.floor(Math.random() * len--),
                            v = array[len]
                        array[len] = array[i]
                        array[i] = v
                    }
                    return array
                },
                //--------------------------------------------------
                // string related
                repeat: function (str, count) {
                    str = typeof str === 'string' ? str : ''
                    count = lib.clamp(
                        arguments.length === 1 ? 1 : count,
                        0, MAX_SAFE_INTEGER
                    )
                    if (typeof String.prototype.repeat === 'function') return str.repeat(count)
                    if (str.length === 0 || count === 0) return ''
                    if (count < MAX_ARRAY_LENGTH) return new Array(count + 1).join(str)
                    var maxCount = str.length * count
                    for (var i = Math.floor(Math.log(count) / Math.log(2)); i > 0; i--) str += str
                    return str + str.substring(0, maxCount - str.length)
                },
                reverse: function (str) {
                    return typeof str === 'string' ? str.split('').reverse().join('') : ''
                },
                escapeRegExp: function (str) {
                    // https://s8a.jp/javascript-escape-regexp
                    return typeof str === 'string' && str.length > 0 ? str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&') : ''
                },
                stringCase: (function () {
                    function SCFactory() {
                        if (!(this instanceof SCFactory)) return new SCFactory()
                    }

                    SCFactory.prototype.toHankaku = function (str) {
                        return typeof str === 'string' ? str.replace(/[\uff01-\uff5e]/g, function (c) {
                            return String.fromCharCode(c.charCodeAt() - 0xfee0)
                        }) : ''
                    }
                    SCFactory.prototype.toZenkaku = function (str) {
                        return typeof str === 'string' ? str.replace(/[\u0021-\u007e]/g, function (c) {
                            return String.fromCharCode(c.charCodeAt() + 0xfee0)
                        }) : ''
                    }
                    SCFactory.prototype.toHiragana = function (str) {
                        return typeof str === 'string' ? str.replace(/[\u30a1-\u30f6]/g, function (c) {
                            return String.fromCharCode(c.charCodeAt() - 0x60)
                        }) : ''
                    }
                    SCFactory.prototype.toKatakana = function (str) {
                        return typeof str === 'string' ? str.replace(/[\u3041-\u3096]/g, function (c) {
                            return String.fromCharCode(c.charCodeAt() + 0x60)
                        }) : ''
                    }

                    return new SCFactory()
                })(),
                base58: (function () {
                    function B58Factory() {
                        if (!(this instanceof B58Factory)) return new B58Factory()
                        this._to58 = null
                    }

                    B58Factory.sign = 'WXYZ'

                    B58Factory.prototype.encode = function (str) {
                        str = typeof str === 'string' ? str : ''
                        var to58 = this._to58 || (this._to58 = new lib.BaseN(58)),
                            res = ''
                        for (var i = 0; i < str.length; i++) {
                            if (to58.base.indexOf(str[i]) !== -1) res += B58Factory.sign[0] + str[i] + B58Factory.sign[0]
                            else {
                                var encoded = to58.encode(str.charCodeAt(i)),
                                    len = encoded.length
                                res += len > 3 ? '' : B58Factory.sign[len] + (lib.repeat('0', len) + encoded).slice(-len) + B58Factory.sign[len]
                            }
                        }
                        return res.replace(/([WXYZ])\1/g, '').replace(/[WXYZ](?=[WXYZ])/g, '').slice(0, -1).replace(/^W/, '')
                    }
                    B58Factory.prototype.decode = function (str) {
                        var to58 = this._to58 || (this._to58 = new lib.BaseN(58))
                        return typeof str === 'string' ? str.replace(/[WXYZ][^WXYZ]*/g, function (m) {
                            var idx = B58Factory.sign.indexOf(m[0])
                            if (idx === 0) return m.slice(1)
                            return m.slice(1).replace(new RegExp('.{' + idx + '}', 'g'), function (n) {
                                return String.fromCharCode(to58.decode(n))
                            })
                        }) : ''
                    }

                    return new B58Factory()
                })(),
                //--------------------------------------------------
                // numeric related
                isNaN: function (n) {
                    return n !== n && typeof n === 'number'
                },
                isFinite: function (num) {
                    return typeof num === 'number' && isFinite(num)
                },
                isNegative: function (num) {
                    return lib.is(num, -0) ? true : typeof num === 'number' && num < 0
                },
                clamp: function (num, min, max, safeNaN) {
                    num = typeof num === 'number' ? num : -Infinity
                    if (!!safeNaN && num !== num) return NaN
                    if (typeof min !== 'number' || min !== min) min = -Infinity
                    if (typeof max !== 'number' || max !== max) max = Infinity
                    if (min > max) min = max
                    return num < min ? min :
                        num > max ? max :
                            num
                },
                randInt: function (min, max, secure) {
                    min = lib.clamp(
                        typeof min === 'number' ? min : MIN_SAFE_INTEGER,
                        MIN_SAFE_INTEGER, MAX_SAFE_INTEGER
                    )
                    max = lib.clamp(
                        typeof max === 'number' ? max : MAX_SAFE_INTEGER,
                        MIN_SAFE_INTEGER, MAX_SAFE_INTEGER
                    )
                    if (min > max) min = max
                    if (!!secure) {
                        if (max < MAX_SAFE_INTEGER) max++
                        var nmcCrypto = nmc.require('crypto')
                        if (!nmcCrypto.isFailed) return nmcCrypto.value().randomInt(min, max)
                        else if (typeof crypto === 'object' && crypto !== null &&
                            typeof crypto.getRandomValues === 'function') {
                            var numRange = max - min,
                                reqBytes = Math.ceil((Math.log(numRange) * Math.LOG2E) / 8)
                            if (reqBytes < 1) return min
                            var maxNum = Math.pow(256, reqBytes),
                                arr = new Uint8Array(reqBytes)
                            while (true) {
                                root.crypto.getRandomValues(arr)
                                var v = 0
                                for (var i = 0; i < reqBytes; i++) v = (v << 8) + arr[i]
                                if (v < maxNum - maxNum % numRange) return min + (v % numRange)
                            }
                        } else return NaN
                    } else return Math.floor(Math.random() * Math.abs(max - min + 1)) + min
                },
                factorial: function (num) {
                    num = typeof num === 'number' ? num : NaN
                    if (!lib.isFinite(num) || num !== num) return num
                    if (num === 0) return lib.is(num, -0) ? -1 : 1
                    var x = Math.abs(num)
                    for (var i = x - 1; i > 0; i--) x *= i
                    return num < 0 ? -x : x
                },
                BaseN: (function () {
                    function BaseN(baseOrRadix) {
                        if (!(this instanceof BaseN)) return new BaseN(baseOrRadix)
                        this.base = BaseN.makeBase(baseOrRadix)
                    }

                    BaseN.makeBase = function (baseOrRadix) {
                        if (typeof baseOrRadix !== 'string') return (
                            '0123456789'
                            + 'abcdefghijklmnopqrstuvwxyz'
                            + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                        ).substr(0, lib.clamp(baseOrRadix, 2, 62))
                        baseOrRadix = lib.nonOverlap(baseOrRadix.split(''))
                        return baseOrRadix.length < 2 ? '01' : baseOrRadix.join('')
                    }

                    BaseN.prototype.encode = function (num) {
                        num = Math.floor(Math.abs(lib.clamp(num, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)))
                        if (num < this.base.length) return this.base[num]
                        if (this.base.length <= 36 && this.base === BaseN.makeBase(this.base.length)) return num.toString(this.base.length)
                        var res = ''
                        while (num > 0) {
                            num = Math.floor(num)
                            res = this.base[num % this.base.length] + res
                            num /= this.base.length
                        }
                        return res.slice(1)
                    }
                    BaseN.prototype.decode = function (str) {
                        str = typeof str === 'string' ? str : ''
                        if (!new RegExp('^[' + lib.escapeRegExp(this.base) + ']+$').test(str)) return NaN
                        var arr = str.split('').reverse(),
                            dec = 0
                        for (var i = 0; i < arr.length; i++) dec += this.base.indexOf(arr[i]) * Math.pow(this.base.length, i)
                        return dec
                    }

                    return BaseN
                })(),
                //--------------------------------------------------
                // DOM related
                selector: function (query) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    return rawSelector(query)
                },
                triggerEvent: function (elm, event) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    rawTriggerEvent(elm, event)
                },
                setAttr: function (elm, attr) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    elm = lib.selector(elm)
                    attr = typeof attr === 'object' && attr !== null ? attr : {}
                    var attrs = Object.keys(attr)
                    for (var i = 0; i < attrs.length; i++) elm.setAttribute(attrs[i], attr[attrs[i]])
                    return elm
                },
                setCSS: function (elm, css) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    elm = lib.selector(elm)
                    css = typeof css === 'object' && css !== null ? css : {}
                    var styles = Object.keys(css)
                    for (var i = 0; i < styles.length; i++) elm.style[styles[i]] = css[styles[i]]
                    return elm
                },
                getCSS: function (elm) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    return rawGetCSS(elm)
                },
                getFontSize: function (elm) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    return rawGetFontSize(elm)
                },
                getRGB: function (color) {
                    color = typeof color === 'string' ? color : ''
                    if (Object.keys(COLOR_NAME).indexOf(color) !== -1) color = '#' + COLOR_NAME[color]
                    if (/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(color)) {
                        var rgb = color.match(/[\da-f]{2}/ig) || [0, 0, 0]
                        for (var i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i].toString(16), '16')
                        return rgb
                    } else {
                        if (!available.document) throw new lib.errors.DependencyError('Except for certain named colors, RGB is obtained by style, so the environment must be one where document is available')
                        var e = document.createElement('div')
                        document.body.appendChild(e)
                        e.style.color = color
                        var rgb = lib.getCSS(e).color.match(/\d+/g) || [0, 0, 0]
                        for (var i = 0; i < rgb.length; i++) rgb[i] = Number(rgb[i])
                        document.body.removeChild(e)
                        return rgb
                    }
                },
                setWallpaper: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        src: null,
                        position: 'center', // 画像を常に天地左右の中央に配置
                        size: 'cover', // 表示するコンテナの大きさに基づいて背景画像を調整
                        repeat: 'no-repeat'// 画像をタイル状に繰り返し表示しない
                    }, { src: ['String', 'Undefined'] })
                    var isValidCover = options.cover !== null && options.cover !== undef && options !== false
                    options.cover = lib.castParam(options.cover, {
                        color: '#ffffff', // カバー色
                        opacity: 0.8, // カバーの不透明度
                        zIndex: -1000, // カバーのz-index
                        removePrevCover: true // 前のカバーを消すかどうか
                    })
                    if (!isValidCover || options.cover.removePrevCover) {
                        while (covers.length > 0) {
                            var prevCover = covers.pop()
                            if (prevCover.parentNode !== null) prevCover.parentNode.removeChild(prevCover) // 存在するカバーなら削除
                        }
                    }
                    if (typeof options.src === 'string' || options.src === null || options.src === undef) {
                        lib.setCSS(document.body, {
                            backgroundImage: (typeof options.src === 'string' && options.src.length === 0) ||
                                options.src === null || options.src === undef ? 'none' : 'url("' + src + '")',
                            backgroundAttachment: 'fixed', // コンテンツの高さが画像の高さより大きい場合動かないように固定
                            backgroundPosition: options.position,
                            backgroundSize: options.size,
                            backgroundRepeat: options.repeat
                        })
                    }
                    if (isValidCover) {
                        var rgb = lib.getRGB(options.cover.color),
                            e = document.createElement('div')
                        document.body.appendChild(e)
                        covers.push(e)
                        lib.setCSS(e, {
                            zIndex: options.cover.zIndex.toString(),
                            backgroundColor: rgb ? 'rgba(' + rgb.concat([options.cover.opacity]).join(', ') + ')' : options.cover.color,
                            position: 'fixed',
                            top: '0',
                            right: '0',
                            bottom: '0',
                            left: '0'
                        })
                        return e
                    }
                    return null
                },
                addElement: function (parentNode, elm, insertBefore) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    parentNode = lib.selector(parentNode)
                    elm = lib.selector(elm)
                    if (!!insertBefore) parentNode.insertBefore(elm, parentNode.firstChild)
                    else parentNode.appendChild(elm)
                    return elm
                },
                addInputText: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        // parentNode: parent element
                        id: '', // HTML
                        class: '', // HTML
                        title: '', // title label
                        placeholder: '', // placeholder
                        // value: Initial value
                        change: function () { }, // Function to be executed when the value is changed
                        enter: function () { }, // Function to be executed when the Enter key is pressed
                        // save: Area to store the changed values
                        hankaku: false, // If true, it will be automatically converted to half-width
                        max: Infinity, // Maximum input length
                        insertBefore: false, // If true, insert the element at the beginning of the parent element
                        textarea: false, // If true, it becomes a textarea element
                        width: '', // width is fixed at this value
                        height: '', // Height is fixed at this value
                        readonly: false, // If true, the user will not be able to edit, and all will be selected and copied when clicked
                        trim: false // If true, auto-deletes spaces and other characters at both ends of the input
                    })
                    options.parentNode = lib.selector(options.parentNode)
                    options.value = options.value === undef ? '' : String(options.value)
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var e = document.createElement(!!options.textarea ? 'textarea' : 'input')
                    setCommonInput(lib, options, e)
                    setAttr(options, e)
                    setResize(options, e, function () {
                        return e.value
                    })
                    if (!!options.textarea) {
                        // https://qiita.com/okyawa/items/8c7bee52b203f6956d44
                        var s = e.value
                        e.focus()
                        e.value = ''
                        e.value = s
                        e.blur()
                    }
                    function change() {
                        var v = e.value
                        if (!!options.trim) v = v.trim()
                        if (!!options.hankaku) v = lib.stringCase.toHankaku(v)
                        if (v.length > options.max) v = v.slice(0, options.max)
                        var re = options.change(v)
                        if (typeof re === 'string') v = re
                        e.value = v
                        if (options.save.key !== '') new lib.SaveStorage({
                            namespace: options.save.namespace,
                            type: options.save.type
                        }).save(options.save.key, v)
                    }
                    e.addEventListener('change', change)
                    tryFunc(change)
                    return e
                },
                addInputNumber: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        // parentNode: parent element
                        id: '', // HTML
                        class: '', // HTML
                        title: '', // title label
                        placeholder: '', // placeholder
                        // value: Initial value
                        change: function () { }, // Function to be executed when the value is changed
                        enter: function () { }, // Function to be executed when the Enter key is pressed
                        // save: Area to store the changed values
                        // min: Minimum value that can be entered
                        // max: Maximum value that can be entered
                        insertBefore: false, // If true, insert the element at the beginning of the parent element
                        width: '', // width is fixed at this value
                        int: false, // If true, set it to an integer automatically
                        readonly: false // If true, the user will not be able to edit, and all will be selected and copied when clicked
                    })
                    options.parentNode = lib.selector(options.parentNode)
                    options.value = typeof options.value === 'string' || typeof options.value === 'number' ? Number(options.value) : 0
                    options.min = typeof options.min === 'string' || typeof options.min === 'number' ? Number(options.min) : 0
                    options.max = typeof options.max === 'string' || typeof options.max === 'number' ? Number(options.max) : Infinity
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var e = document.createElement('input')
                    setCommonInput(lib, options, e)
                    setAttr(options, e)
                    setResize(options, e, function () {
                        return e.value
                    })
                    function change() {
                        var n = Number(lib.stringCase.toHankaku(e.value).trim())
                        if (n !== n) n = 0
                        if (n < options.min) n = options.min
                        else if (n > options.max) n = options.max
                        if (!!options.int) n = Math.floor(n)
                        var re = options.change(n)
                        if (typeof re === 'number') n = re
                        var v = String(n)
                        e.value = v
                        if (options.save.key !== '') new lib.SaveStorage({
                            namespace: options.save.namespace,
                            type: options.save.type
                        }).save(options.save.key, v)
                    }
                    e.addEventListener('change', change)
                    tryFunc(change)
                    return e
                },
                addInputRange: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        // parentNode: parent element
                        id: '', // HTML
                        class: '', // HTML
                        title: '', // title label
                        // value: Initial value
                        change: function () { }, // Function to be executed when the value is changed
                        // save: Area to store the changed values
                        // min: Minimum value that can be entered
                        // max: Maximum value that can be entered
                        step: 1, // Phase Unit
                        insertBefore: false, // If true, insert the element at the beginning of the parent element
                        width: '' // width is fixed at this value
                    })
                    options.parentNode = lib.selector(options.parentNode)
                    options.value = typeof options.value === 'string' || typeof options.value === 'number' ? Number(options.value) : 0
                    options.min = typeof options.min === 'string' || typeof options.min === 'number' ? Number(options.min) : 0
                    options.max = typeof options.max === 'string' || typeof options.max === 'number' ? Number(options.max) : 100
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var e = document.createElement('input')
                    e.type = 'range'
                    e.value = options.value
                    e.min = options.min
                    e.max = options.max
                    e.step = options.step
                    setCommonInput(lib, options, e)
                    setAttr(options, e)
                    function change() {
                        var n = Number(e.value)
                        if (n !== n) n = 0
                        var re = options.change(n)
                        if (typeof re === 'number') n = re
                        var v = String(n)
                        e.value = v
                        if (options.save.key !== '') new lib.SaveStorage({
                            namespace: options.save.namespace,
                            type: options.save.type
                        }).save(options.save.key, v)
                    }
                    e.addEventListener('change', change)
                    tryFunc(change)
                    return e
                },
                addInputBool: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        // parentNode: parent element
                        id: '', // HTML
                        class: '', // HTML
                        title: '', // title label
                        value: false, // Initial value
                        change: function () { }, // Function to be executed when the value is changed
                        // save: Area to store the changed values
                        insertBefore: false // If true, insert the element at the beginning of the parent element
                    })
                    options.parentNode = lib.selector(options.parentNode)
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var flag = !!options.value,
                        e = document.createElement('button')
                    lib.addElement(options.parentNode, e, !!options.insertBefore)
                    e.textContent = options.title
                    e.addEventListener('click', function () {
                        flag = !flag
                        change() // Hoisting
                    })
                    setAttr(options, e)
                    var check = document.createElement('input')
                    lib.addElement(e, check, true)
                    check.type = 'checkbox'
                    if (options.save.key !== '') new lib.SaveStorage({
                        namespace: options.save.namespace,
                        type: options.save.type
                    }).load(options.save.key).then(function (v) {
                        flag = (v === '1')
                        change() // Hoisting
                    })
                    function change() {
                        var re = options.change(flag)
                        if (typeof re === 'boolean') flag = re
                        e.style.backgroundColor = flag ? 'orange' : 'gray'
                        check.checked = flag
                        if (options.save.key !== '') new lib.SaveStorage({
                            namespace: options.save.namespace,
                            type: options.save.type
                        }).save(options.save.key, flag ? '1' : '0')
                    }
                    tryFunc(change)
                    return e
                },
                addSelect: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, {
                        // parentNode: parent element
                        id: '', // HTML
                        class: '', // HTML
                        title: '', // title label
                        placeholder: '', // placeholder
                        // value: Initial value
                        // list: Associative array of choices
                        change: function () { }, // Function to be executed when the value is changed
                        // save: Area to store the changed values
                        insertBefore: false, // If true, insert the element at the beginning of the parent element
                        width: '' // width is fixed at this value
                    })
                    options.parentNode = lib.selector(options.parentNode)
                    options.value = options.value === undef ? '' : String(options.value)
                    if (Array.isArray(options.list)) {
                        var obj = {}
                        for (var i = 0; i < options.list.length; i++) {
                            var v = options.list[i]
                            obj[v] = v
                        }
                        options.list = obj
                    } else options.list = typeof options.list === 'object' && options.list !== null ? options.list : {}
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var e = document.createElement('select')
                    function getValue() {
                        return e.value || ''
                    }
                    function updateSelect() {
                        var v = getValue()
                        while (e.childNodes.length > 0) e.removeChild(e.firstChild)
                        if (options.placeholder !== '') {
                            var desc = document.createElement('option')
                            e.appendChild(desc)
                            desc.textContent = options.placeholder
                            desc.value = ''
                            desc.style.display = 'none'
                        }
                        var vals = []
                        for (var k in options.list) {
                            vals.push(String(options.list[k]))
                            var opt = document.createElement('option')
                            e.appendChild(opt)
                            opt.textContent = k
                            opt.value = String(options.list[k])
                        }
                        if (!!v) e.value = v
                        if (vals.indexOf(v) === -1) e.value = e.firstChild.value
                    }
                    e.addEventListener('mouseenter', updateSelect)
                    e.addEventListener('updateselect', updateSelect)
                    setCommonInput(lib, options, e)
                    setAttr(options, e)
                    setResize(options, e, getValue)
                    function change() {
                        var v = getValue(),
                            re = options.change(v)
                        if (typeof re === 'string') v = re
                        e.value = v
                        if (options.save.key !== '') new lib.SaveStorage({
                            namespace: options.save.namespace,
                            type: options.save.type
                        }).save(options.save.key, v)
                    }
                    e.addEventListener('change', change)
                    tryFunc(updateSelect)
                    return e
                },
                addHideArea: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, { // see addInputBool
                        // parentNode: parent element
                        id2: '', // HTML(hidden area div element)
                        class2: '', // HTML(hidden area div element)
                        speed: 100, // Speed to display [sec]
                        insertBefore: false // If true, insert the element at the beginning of the parent element
                        // elm: Elements to hide
                    })
                    options.save = lib.castParam(options.save, {
                        key: '', // save key
                        namespace: href, // Namespace of the storage area
                        type: lib.SaveStorage.getAvailableStorageType() // Type of storage used for storage
                    })
                    var e = document.createElement('div')
                    lib.addElement(lib.selector(options.parentNode), e, options.insertBefore)
                    var front = document.createElement('span')
                    e.appendChild(front)
                    var area = options.elm || document.createElement('div')
                    e.appendChild(area)
                    var initialCount = 0,
                        boolBtn
                    options.change = function (flag) { // Change is used by this function and is not reflected in the settings
                        if (initialCount++ < (options.save.key === '' ? 1 : 2)) {
                            area.style.display = flag ? 'block' : 'none'
                            return
                        }
                        function disabledBoolBtn(bool) {
                            var elms = [boolBtn].concat(Array.prototype.slice.call(boolBtn.childNodes))
                            for (var i = 0; i < elms.length; i++) elms[i].disabled = !!bool
                        }
                        function doneFade() {
                            var elms = document.querySelectorAll('input,textarea,select')
                            for (var i = 0; i < elms.length; i++) lib.triggerEvent(elms[i], 'appear')
                            disabledBoolBtn(false)
                        }
                        disabledBoolBtn(true)
                        var start = getTimestamp()
                        if (flag) {
                            if (lib.getCSS(area).display !== 'none') return
                            if (area.style.display === 'none') area.style.display = ''
                            else area.style.display = 'block'
                            area.style.opacity = 0
                            reqAnimFrame(function tick(timestamp) {
                                var easing = (timestamp - start) / options.speed
                                area.style.opacity = Math.min(easing, 1)
                                if (easing < 1) reqAnimFrame(tick)
                                else {
                                    area.style.opacity = ''
                                    doneFade()
                                }
                            })
                        } else {
                            if (lib.getCSS(area).display !== 'block') return
                            area.style.opacity = 1
                            reqAnimFrame(function tick(timestamp) {
                                var easing = (timestamp - start) / options.speed
                                area.style.opacity = Math.max(1 - easing, 0)
                                if (easing < 1) reqAnimFrame(tick)
                                else {
                                    area.style.display = 'none'
                                    area.style.opacity = ''
                                    doneFade()
                                }
                            })
                        }
                    }
                    if (options.id2 !== '') area.setAttribute('id', options.id2)
                    if (options.class2 !== '') area.classList.add(options.class2)
                    options.insertBefore = false
                    options.parentNode = front
                    return boolBtn = lib.addInputBool(options)
                },
                addTab: function (options) {
                    if (!available.document) throw new lib.errors.DependencyError(ERROR_MESSAGE.document)
                    options = lib.castParam(options, { // see addInputBool
                        title: '', // title label
                        value: '', // Initial value(tab name)
                        list: {} // Tab names and elements
                    })
                    var e = document.createElement('div')
                    lib.addElement(lib.selector(options.parentNode), e, options.insertBefore)
                    var h = document.createElement('div')
                    e.appendChild(h)
                    var area = document.createElement('div')
                    e.appendChild(area)
                    if (options.title !== '') h.textContent = options.title + ': '
                    var btns = {}, resultObject = { activeTabName: '', element: e }
                    for (var k in options.list) {
                        (function (k) {
                            var btn = btns[k] = document.createElement('button')
                            h.appendChild(btn)
                            btn.textContent = k
                            btn.addEventListener('click', function () {
                                resultObject.activeTabName = k
                                var elms = h.getElementsByTagName('button')
                                for (var i = 0; i < elms.length; i++) elms[i].style.backgroundColor = 'gray'
                                btn.style.backgroundColor = 'yellow'
                                var childs = area.childNodes
                                for (var i = 0; i < childs.length; i++) childs[i].style.display = 'none'
                                options.list[k].style.display = 'block'
                                lib.triggerEvent(window, 'resize')
                            })
                        })(k)
                        area.appendChild(options.list[k])
                    }
                    if (btns[options.value]) btns[options.value].click()
                    else {
                        var btn = h.getElementsByTagName('button')[0]
                        if (btn) btn.click()
                    }
                    return resultObject
                },
                //--------------------------------------------------
                // other
                NodeModuleCache: NodeModuleCache,
                isCircular: function (obj) {
                    // https://javascripter.hatenablog.com/entry/20090702/1246525649
                    return typeof obj === 'object' && obj !== null && (function fn(obj, seen) {
                        var dataKeys = Object.keys(obj)
                        for (var i = 0; i < dataKeys.length; i++) {
                            var k = dataKeys[i]
                            if (seen.indexOf(obj) !== -1 ||
                                (typeof obj[k] === 'object' && obj[k] !== null && fn(obj[k], seen.concat([obj])))) return true
                        }
                        return false
                    })(obj, [])
                },
                noConflict: function () {
                    for (var i = 0; i < libKey.length; i++) {
                        var k = libKey[i]
                        if (k in libConflict) root[k] = libConflict[k]
                        else delete root[k]
                    }
                    return lib
                },
                getIP: function () {
                    return new lib.Deferred(function (resolve, reject) {
                        function fail() {
                            reject(new Error('Failed to retrieve from API'))
                        }
                        function done(body) {
                            try {
                                resolve(JSON.parse(body.match(/\{[\s\S]*?\}/)[0]));
                            } catch (e) {
                                fail();
                            }
                        }
                        var nmcHTTPS = nmc.require('https'),
                            opts = {
                                hostname: 'ipinfo.io',
                                path: '/',
                                method: 'GET',
                                data: 'callback=a'
                            }
                        if (!nmcHTTPS.isFailed) {
                            var req = nmcHTTPS.value().request(opts, function (res) {
                                var body = ''
                                res.on('data', function (chunk) {
                                    body += chunk
                                })
                                res.on('end', function () {
                                    done(body)
                                })
                            })
                            req.on('error', function () {
                                fail()
                            })
                            req.end()
                        } else if (typeof XMLHttpRequest !== 'undefined') {
                            var xhr = new XMLHttpRequest()
                            xhr.open(
                                opts.method,
                                'https://'
                                + opts.hostname
                                + opts.path
                                + '?'
                                + opts.data
                            )
                            xhr.onload = function () {
                                done(xhr.response)
                            }
                            xhr.onerror = function () {
                                fail()
                            }
                            xhr.send()
                        } else reject(new lib.errors.DependencyError('No available communication modules were found'))
                    })
                },
                rgb2hsl: function (red, green, blue) {
                    red = lib.clamp(red, 0, 255)
                    green = lib.clamp(green, 0, 255)
                    blue = lib.clamp(blue, 0, 255)
                    var max = Math.max(red, green, blue),
                        min = Math.min(red, green, blue),
                        hue = max === min ? 0 :
                            max === red ? 60 * ((green - blue) / (max - min)) :
                                max === green ? 60 * ((blue - red) / (max - min)) + 360 / 3 :
                                    60 * ((red - green) / (max - min)) + 360 * 2 / 3
                    if (hue < 0) hue += 360
                    return [
                        hue,
                        (((max + min) / 2) < 255 / 2 ? (
                            max + min <= 0 ? 0 :
                                (max - min) / (max + min) * 100
                        ) : (max - min) / (255 * 2 - max - min) * 100) || 0,
                        (max + min) / 255 / 2 * 100
                    ]
                },
                hsl2rgb: function (hue, saturation, luminance) {
                    var max = 0, min = 0,
                        r = 0, g = 0, b = 0,
                        h = lib.clamp(hue, 0, 360) % 360,
                        s = lib.clamp(saturation, 0, 100) / 100,
                        l = lib.clamp(luminance, 0, 100) / 100,
                        q = h / 60
                    if (l < 0.5) {
                        max = l + l * s
                        min = l - l * s
                    } else {
                        max = l + (1 - l) * s
                        min = l - (1 - l) * s
                    }
                    if (q <= 1) {
                        r = max
                        g = (h / 60) * (max - min) + min
                        b = min
                    } else if (q <= 2) {
                        r = ((60 * 2 - h) / 60) * (max - min) + min
                        g = max
                        b = min
                    } else if (q <= 3) {
                        r = min
                        g = max
                        b = ((h - 60 * 2) / 60) * (max - min) + min
                    } else if (q <= 4) {
                        r = min
                        g = ((60 * 4 - h) / 60) * (max - min) + min
                        b = max
                    } else if (q <= 5) {
                        r = ((h - 60 * 4) / 60) * (max - min) + min
                        g = min
                        b = max
                    } else {
                        r = max
                        g = min
                        b = ((360 - h) / 60) * (max - min) + min
                    }
                    return [r * 255, g * 255, b * 255]

                },
                intervalWorker: (function () {
                    function IWFactory() {
                        if (!(this instanceof IWFactory)) return new IWFactory()
                        this._workers = []
                    }

                    IWFactory.prototype.start = function (workerOrId, delay) {
                        delay = Number(delay) || 0
                        var id = NaN,
                            worker = {
                                worker: null,
                                count: 0,
                                delay: delay,
                                timestamp: NaN,
                                requestId: NaN,
                                stop: true
                            }
                        if (typeof workerOrId === 'function') worker.worker = workerOrId
                        else {
                            id = Number(workerOrId)
                            if (id !== id || id < 0 || id > (this._workers.length - 1)) throw new RangeError('There is no worker with the specified id')
                            worker = this._workers[id]
                            if (arguments.length > 1) worker.delay = delay
                        }
                        worker.count = 0
                        worker.timestamp = getTimestamp()
                        worker.stop = false
                        worker.requestId = reqAnimFrame(function fn() {
                            if ((getTimestamp() - worker.timestamp) >= worker.delay) {
                                worker.worker(worker.count++)
                                worker.timestamp = getTimestamp()
                            }
                            if (!worker.stop) worker.requestId = reqAnimFrame(fn)
                        })
                        return id !== id ? this._workers.push(worker) - 1 : id
                    }
                    IWFactory.prototype.stop = function (id) {
                        id = Number(id)
                        if (id !== id || id < 0 || id > (this._workers.length - 1)) throw new RangeError('There is no worker with the specified id')
                        var worker = this._workers[id]
                        cancelAnimFrame(worker.requestId)
                        worker.count = 0
                        worker.timestamp = NaN
                        worker.requestId = NaN
                        worker.stop = true
                        return this
                    }

                    return new IWFactory()
                })(),
                Deferred: (function () {
                    // https://github.com/taylorhakes/promise-polyfill
                    var fn = {
                        immediateFn: (function (setTimeoutFn, setImmediateFn) {
                            return (
                                function (func) {
                                    typeof setImmediateFn === 'function' ? setImmediateFn(func) : setTimeoutFn(func, 0)
                                }
                            )
                        })(
                            setTimeout,
                            typeof setImmediate !== 'undefined' ? setImmediate : null
                        ),
                        noop: function () { },
                        isArray: function (x) {
                            return !!(x && typeof x.length !== 'undefined')
                        },
                        bind: function (func, thisArg) {
                            return (
                                function () {
                                    func.apply(thisArg, arguments)
                                }
                            )
                        },
                        unhandledRejectionFn: function (err) {
                            if (typeof console === 'object' && console !== null) console.warn('Possible Unhandled Promise Rejection:', err);
                        },
                        handle: function (that, deferred) {
                            while (that._state === 3) that = that._value
                            if (that._state === 0) return void that._deferreds.push(deferred)
                            that._handled = true
                            fn.immediateFn(function () {
                                var cb = deferred[that._state === 1 ? 'onFulfilled' : 'onRejected']
                                if (cb === null) return void (fn[that._state === 1 ? 'resolve' : 'reject'])(
                                    deferred.promise, that._value
                                )
                                var ret
                                try {
                                    ret = cb(that._value)
                                } catch (e) {
                                    return void fn.reject(deferred.promise, ret)
                                }
                                fn.resolve(deferred.promise, ret)
                            })
                        },
                        finale: function (that) {
                            if (that._state === 2 && that._deferreds.length === 0) fn.immediateFn(function () {
                                if (!that._handled) fn.unhandledRejectionFn(that._value)
                            })
                            for (var i = 0, len = that._deferreds.length; i < len; i++) fn.handle(that, that._deferreds[i])
                            that._deferreds = null
                        },
                        resolve: function (that, newValue) {
                            try {
                                if (newValue === that) throw new TypeError('Chaining cycle detected for promise')
                                if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                                    var then = newValue.then
                                    if (newValue instanceof Deferred) {
                                        that._state = 3
                                        that._value = newValue
                                        return void fn.finale(that)
                                    } else if (typeof then === 'function') return fn.doResolve(fn.bind(then, newValue), that)
                                }
                                that._state = 1
                                that._value = newValue
                                fn.finale(that)
                            } catch (e) {
                                fn.reject(that, e)
                            }
                        },
                        reject: function (that, newValue) {
                            that._state = 2
                            that._value = newValue
                            fn.finale(that)
                        },
                        doResolve: function (func, that) {
                            var done = false
                            try {
                                func(
                                    function (value) {
                                        if (done) return
                                        done = true
                                        fn.resolve(that, value)
                                    },
                                    function (reason) {
                                        if (done) return
                                        done = true
                                        fn.reject(that, reason)
                                    }
                                )
                            } catch (e) {
                                if (done) return
                                done = true
                                fn.reject(that, e)
                            }
                        },
                        Handler: function (onFulfilled, onRejected, promise) {
                            this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
                            this.onRejected = typeof onRejected === 'function' ? onRejected : null
                            this.promise = promise
                        }
                    }

                    function Deferred(resolver) {
                        if (!(this instanceof Deferred)) return new Deferred(resolver)
                        if (typeof resolver !== 'function') return new TypeError('resolver is not a function')
                        this._state = 0
                        this._handled = false
                        this._value = undef
                        this._deferreds = []
                        fn.doResolve(resolver, this)
                    }

                    Deferred.resolve = function (value) {
                        return value && typeof value === 'object' && value.constructor === Deferred ? value :
                            new Deferred(function (resolve) {
                                resolve(value)
                            })
                    }
                    Deferred.reject = function (value) {
                        return new Deferred(function (resolve, reject) {
                            reject(value)
                        })
                    }
                    Deferred.allSettled = function (arr) {
                        return new Deferred(function (resolve, reject) {
                            if (!(arr && typeof arr.length !== 'undefined')) return reject(
                                new TypeError(
                                    typeof arr
                                    + ' '
                                    + arr
                                    + ' is not iterable(cannot read property Symbol(Symbol.iterator))'
                                )
                            )
                            var args = Array.prototype.slice.call(arr)
                            if (args.length === 0) return resolve([])
                            var remaining = args.length
                            function res(i, v) {
                                if (v && (typeof v === 'object' || typeof v === 'function')) {
                                    var then = v.then
                                    if (typeof then === 'function') return void then.call(
                                        v,
                                        function (v) {
                                            res(i, v)
                                        },
                                        function (e) {
                                            args[i] = { status: 'rejected', reason: e }
                                            if (--remaining === 0) resolve(args)
                                        }
                                    )
                                }
                                args[i] = { status: 'fulfilled', value: v }
                                if (--remaining === 0) resolve(args)
                            }
                            for (var i = 0; i < args.length; i++) res.call(i, args[i])
                        })
                    }
                    Deferred.all = function (arr) {
                        return new Deferred(function (resolve, reject) {
                            if (!fn.isArray(arr)) return reject(new TypeError('Deferred.race accepts an array'))
                            var args = Array.prototype.slice.call(arr)
                            if (args.length === 0) return resolve([])
                            var remaining = args.length
                            function res(i, v) {
                                try {
                                    if (v && (typeof v === 'object' || typeof v === 'function')) {
                                        var then = v.then
                                        if (typeof then === 'function') return void then.call(
                                            v,
                                            function (v) {
                                                res(i, v)
                                            },
                                            reject
                                        )
                                    }
                                    args[i] = v
                                    if (--remaining === 0) resolve(args)
                                } catch (e) {
                                    reject(e)
                                }
                            }
                            for (var i = 0; i < args.length; i++) res(i, args[i])
                        })
                    }
                    Deferred.race = function (arr) {
                        return new Deferred(function (resolve, reject) {
                            if (fn.isArray(arr)) return reject(new TypeError('Deferred.race accepts an array'))
                            for (var i = 0; i < arr.length; i++) Deferred.resolve(arr[i]).then(resolve, reject)
                        })
                    }

                    Deferred.prototype.then = function (onFulfilled, onRejected) {
                        var d = new Deferred(fn.noop)
                        fn.handle(this, new fn.Handler(onFulfilled, onRejected, d))
                        return d
                    }
                    Deferred.prototype['catch'] = function (onRejected) {
                        return this.then(null, onRejected)
                    }
                    Deferred.prototype['finally'] = function (callback) {
                        return this.then(
                            function (value) {
                                return Deferred.resolve(callback()).then(function () {
                                    return value
                                })
                            },
                            function (reason) {
                                return Deferred.resolve(callback()).then(function () {
                                    return Deferred.reject(reason)
                                })
                            }
                        )
                    }

                    return Deferred
                })(),
                //--------------------------------------------------
                // property
                version: '2.0.0',
                errors: {
                    DependencyError: (function () {
                        function DependencyError(message) {
                            if (!(this instanceof DependencyError)) return new DependencyError(message)
                            var err = new Error(message)
                            err.name = 'DependencyError'
                            var thisProto = typeof Object.getPrototypeOf === 'function' ? Object.getPrototypeOf(this) : this.__proto__
                            if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(err, thisProto)
                            else err.__proto__ = thisProto
                            if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(err, DependencyError)
                            return err
                        }

                        DependencyError.prototype = Object.create(Error.prototype, {
                            constructor: {
                                value: DependencyError,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        })
                        if (typeof Object.setPrototypeOf === 'function') Object.setPrototypeOf(DependencyError, Error)
                        else DependencyError.__proto__ = Error

                        return DependencyError
                    })()
                }
                //--------------------------------------------------
                // https://aahub.org/mlt/c813aa33856bd5cd0ae51a6989216b13
                /*
                 *　　　　　　　　　　　　 ＿＿＿
                 *. 　 　　　　　　　　 ／
                 *　　　　　　　　　／.　　　　　　　　　　　　＼
                 *.　　　　　　　／_　--ﾆﾆﾆﾆﾆﾆ-　 _　　　　 ＼
                 *　　　　　　　ｌ-　 ¨　　　　　　　 ¨　　¨　_　☆ ∨
                 *　　　｡s升　　　　　　　　_　　-―――　　___
                 *　　　`ー―‐―――　¨　　　　　　　　　　　 ヽ　l.____ノ}
                 *　　　　 .′.　　　 　|.　/Ⅴ　 ﾄ､. 　 　　ｌ|　　 |.乂＿__ノ
                 *　　　　 | /　　　　　| / 　Ⅴ. |　＼　ﾄ､ i|　　 |　|
                 *　　　　 |ハ.　　　　i|T　 T ＼|　T　 T ﾘ　　　|　|
                 *　　　　　　　　|＼. i|乂 ノ　　 　乂 ノ /　　 八,
                 *. 　 　 　 　 ＼|　|⊂⊃ 　　　　　　⊂⊃　/　 .′
                 *.　　　　　　　　 /　　＞　 ＿＿　 イ　　, ′　{
                 *　　　　 　 　 　′　/γ´ﾆ |-／/　　.イ. 　　 八
                 *　　　 　 　／.　　 /.　| ＼ .|ﾆﾆ′　/-＼ 　　　 ＼
                 *.　　　　／　≧o｡ |７. |　　|＼/､　　| 八ｲ　ﾄ､　　　｀
                 *　　　 八{.　　|　/　　_|　　|=/　 ＼ {=ｌ　i|　|　’:,　λ　　Y
                 *　　　　　　r- ､____〈ﾆ.|　　ｌ/.　　 /-- ＼|　|　　}　从　　′
                 *　　　　　　|: : : }.:.:.:.:|ﾄ|___./__　／､ﾆﾆﾆﾆ〉从. /／ |／
                 *. 　　 　　　}: : :.l｡s升 ゝY: : :.Y.:.:.:.:.l｡o≦
                 *　　 　　　　｀¨´　 　　　 ’,: : :l .｡s升
                 *　　　　　　　　　　　　　　 ｀¨´
                 */
                //--------------------------------------------------
            })

        // export
        if (typeof exports === 'object' && exports !== null && !exports.nodeType &&
            typeof module === 'object' && module !== null && !module.nodeType &&
            module.exports === exports) module.exports = lib
        else {
            for (var i = 0; i < libKey.length; i++) {
                var k = libKey[i]
                if (k in root) libConflict[k] = root[k]
                root[k] = lib
            }
        }
    }
)(
    typeof globalThis === 'object' && globalThis !== null ? globalThis :
        typeof window === 'object' && window !== null ? window :
            this,
    void 0
)
