/*!
 * CmdExt JavaScript Library v2.0.1
 * https://github.com/AntimatterX/antimatterx.github.io/blob/main/assets/lib/CmdExt/CmdExt.js
 * 
 * Copyright (c) 2021 AntimatterX
 * 
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 * 
 * This library is declared globally in non-Node.js environments with the following name.
 * $CmdExt
 * 
 * Last Update: 2021-03-28T11:23:45.139Z
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
        key: '$CmdExt', // 文字列か文字列の配列のグローバルでのライブラリのキー
        val: (function () { // エクスポートされるライブラリの値
            /**
             * CmdExtクラスのインスタンスを作成します。
             * @param {Object<string, string|Array<string>|Object<string, ?*>|boolean>} options オプションを渡します。
             * @returns {CmdExt} CmdExtクラスのインスタンスを返します。
             */
            function CmdExt(options) {
                if (!(this instanceof CmdExt)) return new CmdExt(options);
                options = CmdExt._castParam(options, {
                    separator: '',
                    quots: [],
                    commands: {},
                    caseInsensitive: false
                }, {
                    quots: 'String'
                });
                this.separator = /^\S+$/.test(options.separator) ? options.separator : '.';
                this.quots = CmdExt._initQuots(options.quots);
                this.commands = options.commands;
                this.caseInsensitive = options.caseInsensitive;
                this._handlers = {
                    commanderror: [],
                    commandnotfound: [],
                    disabledcommand: []
                };
            }

            CmdExt.prototype._getType = CmdExt._getType = _ctx.fn.getType;
            CmdExt.prototype._isType = CmdExt._isType = _ctx.fn.isType;
            CmdExt.prototype._castType = CmdExt._castType = _ctx.fn.castType;
            CmdExt.prototype._castParam = CmdExt._castParam = _ctx.fn.castParam;
            /**
             * 正規表現のメタ文字をエスケープします。
             * @param {string} str エスケープする文字列を渡します。
             * @returns {string} エスケープされた文字列を返します。
             */
            CmdExt.prototype._escapeRegExp = CmdExt._escapeRegExp = function (str) {
                // https://s8a.jp/javascript-escape-regexp
                return (typeof str === 'string' ? str : '').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
            };
            /**
             * 引用符を初期化します。
             * @param {...Array<string>|string} quots 初期化する引用符の配列か可変長の引用符の文字列を渡します。
             * @returns {Array<string>} 初期化された引用符の配列を返します。
             */
            CmdExt.prototype._initQuots = CmdExt._initQuots = function (quots) {
                return (CmdExt._isType(quots, 'Array') ? quots.concat(Array.prototype.slice.call(arguments, 1)) :
                    Array.prototype.slice.call(arguments)).slice()
                    .filter(function (v, i, arr) {
                        return arr.indexOf(v) === i && typeof v === 'string' && /^\S+$/.test(v);
                    })
                    .map(function (v) {
                        return CmdExt._escapeRegExp(v);
                    })
                    .sort(function (a, b) {
                        return b.length - a.length;
                    });
            };
            /**
             * 引数の文字列を解析します。
             * @param {string} str 解析する文字列を渡します。
             * @param {...Array<string>|string} quots 引用符の配列か可変長の引用符の文字列を渡します。
             * @returns {Array<string>} 解析された引数の配列を返します。
             */
            CmdExt.parseArg = function (str, quots) {
                var reversed = typeof str === 'string' && str.length > 0 ? str.split('').reverse().join('') : '',
                    quotsPattern = '(?:(' + CmdExt._initQuots.apply(null, Array.prototype.slice.call(arguments, 1)).join('|') + ')(?!\\\\))',
                    args = [];
                if (quotsPattern === '(?:()(?!\\\\))' ||
                    !new RegExp(quotsPattern).test(reversed)) args = reversed.match(/\S+/g) || [];
                else {
                    var m,
                        argRegExp = new RegExp('(?:^|\\s+)' + quotsPattern + '[\\s\\S]*?\\1(?:$|\\s+)|\\S+', 'g');
                    while ((m = argRegExp.exec(reversed)) !== null) args.push(m[0].trim());
                }
                return args.reverse().map(function (v) {
                    return v
                        .replace(new RegExp('^' + quotsPattern + '([\\s\\S]*?)\\1$'), '$2')
                        .replace(/([^\\]+)\\/g, '$1')
                        .split('').reverse().join('');
                });
            };

            CmdExt.prototype.errors = CmdExt.errors = (function () {
                var errors = {};
                errors.CommandError = (function () {
                    /**
                     * CommandErrorのエラーオブジェクトを作成します。
                     * @param {string} message エラーメッセージの文字列を渡します。
                     * @returns {CommandError} CommandErrorのエラーオブジェクトを返します。
                     */
                    function CommandError(message) {
                        if (!(this instanceof CommandError)) return new CommandError(message);
                        var err = new Error(message);
                        err.name = 'CommandError';
                        Object.setPrototypeOf(err, Object.getPrototypeOf(this));
                        if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(err, CommandError);
                        return err;
                    }

                    CommandError.prototype = Object.create(Error.prototype, {
                        constructor: {
                            value: CommandError,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    Object.setPrototypeOf(CommandError, Error);

                    return CommandError;
                })();
                errors.CommandNotFound = (function () {
                    /**
                     * CommandNotFoundのエラーオブジェクトを作成します。
                     * @param {string} message エラーメッセージの文字列を渡します。
                     * @returns {CommandNotFound} CommandNotFoundのエラーオブジェクトを返します。
                     */
                    function CommandNotFound(message) {
                        if (!(this instanceof CommandNotFound)) return new CommandNotFound(message);
                        var err = new errors.CommandError(message);
                        err.name = 'CommandNotFound';
                        Object.setPrototypeOf(err, Object.getPrototypeOf(this));
                        if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(err, CommandNotFound);
                        return err;
                    }

                    CommandNotFound.prototype = Object.create(errors.CommandError.prototype, {
                        constructor: {
                            value: CommandNotFound,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    Object.setPrototypeOf(CommandNotFound, errors.CommandError);

                    return CommandNotFound;
                })();
                errors.DisabledCommand = (function () {
                    /**
                     * DisabledCommandのエラーオブジェクトを作成します。
                     * @param {string} message エラーメッセージの文字列を渡します。
                     * @returns {DisabledCommand} DisabledCommandのエラーオブジェクトを返します。
                     */
                    function DisabledCommand(message) {
                        if (!(this instanceof DisabledCommand)) return new DisabledCommand(message);
                        var err = new errors.CommandError(message);
                        err.name = 'DisabledCommand';
                        Object.setPrototypeOf(err, Object.getPrototypeOf(this));
                        if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(err, DisabledCommand);
                        return err;
                    }

                    DisabledCommand.prototype = Object.create(errors.CommandError.prototype, {
                        constructor: {
                            value: DisabledCommand,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    Object.setPrototypeOf(DisabledCommand, errors.CommandError);

                    return DisabledCommand;
                })();
                return errors;
            })();

            /**
             * 登録されてるハンドラーを発火させます。
             * @param {string} type 発火させるイベント名の文字列を渡します。
             * @param {...?*} args ハンドラーの引数を渡します。
             * @returns {CmdExt} インスタンス自身を返します。
             */
            CmdExt.prototype._trigger = function (type, args) {
                if (type in this._handlers) {
                    for (var i = 0; i < this._handlers[type].length; i++) {
                        if (typeof this._handlers[type][i] === 'function') this._handlers[type][i].apply(
                            null,
                            Array.prototype.slice.call(arguments, 1)
                        );
                    }
                }
                return this;
            };
            /**
             * ハンドラーを登録します。
             * @param {string} type イベント名の文字列を渡します。
             * @param {Function} handler ハンドラーの関数を渡します。
             * @returns {CmdExt} インスタンス自身を返します。
             */
            CmdExt.prototype._addHandler = function (type, handler) {
                if (type in this._handlers && typeof handler === 'function') this._handlers[type].push(handler);
                return this;
            };
            /**
             * パス文字列を区切り文字で分割します。
             * @param {string} pathname 分割するパス文字列を渡します。
             * @returns {Array<string>} 分割されたパスの配列を返します。
             */
            CmdExt.prototype._getPath = function (pathname) {
                if (pathname === '') return [pathname];
                pathname = typeof pathname === 'string' ? pathname : '';
                return pathname.length < 1 ? [] :
                    this.caseInsensitive ? pathname.replace(new RegExp(CmdExt._escapeRegExp(this.separator), 'ig'), function (m) {
                        return m.toLowerCase();
                    }).split(this.separator.toLowerCase()) :
                        pathname.split(this.separator);
            };
            /**
             * 引数の文字列を解析します。
             * @param {string} str 解析する文字列を渡します。
             * @returns {Array<string>} 解析された引数の配列を返します。
             */
            CmdExt.prototype.parseArg = function (str) {
                return CmdExt.parseArg(str, this.quots);
            };
            /**
             * コマンドの文字列を解析します。
             * @param {string} str 解析する文字列を渡します。
             * @returns {Object<string, Array<string|undefined>|null|boolean|string|Array<string>>} 解析結果をオブジェクトで返します。
             */
            CmdExt.prototype.parseCommand = function (str) {
                str = typeof str === 'string' ? str : '';
                var m = str.match(/^(\S+)(?:\s+([\s\S]*))?$/) || [];
                return {
                    _matchResult: m.length > 0 ? m : null,
                    isCommand: this.has(m[1] || ''),
                    text: str,
                    pathname: m[1] || '',
                    path: this._getPath(m[1] || ''),
                    argname: m[2] || '',
                    args: this.parseArg(m[2] || '')
                };
            };
            /**
             * パス文字列に一致するコマンドを取得します。
             * @param {string} pathname パス文字列を渡します。
             * @returns {Object<string, ?*>|undefined} パス文字列に一致するコマンドがあった場合はコマンドのオブジェクトを返します。
             */
            CmdExt.prototype.get = function (pathname) {
                var path = this._getPath(pathname),
                    now = this.commands,
                    initialized = [];
                for (var i = 0; i < path.length; i++) {
                    var nameList = {},
                        nowKeys = Object.keys(now);
                    for (var o = 0; o < nowKeys.length; o++) {
                        var key = nowKeys[o];
                        nameList[key] = key;
                        if (CmdExt._isType(now[key].aliases, 'Array')) {
                            for (var p = 0; p < now[key].aliases.length; p++) nameList[now[key].aliases[p]] = key;
                        }
                    }
                    var key = nameList[((' ' + Object.keys(nameList).join(' ') + ' ').match(
                        new RegExp(' (' + CmdExt._escapeRegExp(path[i]) + ') '),
                        this.caseInsensitive ? 'i' : undefined
                    ) || [])[1]];
                    if (key === undefined) return;
                    var command = CmdExt._castParam(now[key], {
                        aliases: [],
                        callback: null,
                        subcommands: null,
                        enabled: false
                    }, {
                        callback: 'Function',
                        subcommands: 'Object'
                    });
                    command.commandName = key;
                    command.parent = initialized[i - 1] || null;
                    command.raw = {
                        parent: ((command.parent || {}).raw || {}).command || null,
                        command: now[key]
                    };
                    command.enabled = typeof now[key].callback === 'function' &&
                        typeof now[key].enabled === 'boolean' ? now[key].enabled : typeof now[key].callback === 'function';
                    initialized.push(command);
                    if (CmdExt._isType(now[key].subcommands, 'Object')) now = now[key].subcommands;
                }
                return initialized.pop();
            };
            /**
             * パス文字列に一致するコマンドを設定します。
             * @param {string} pathname パス文字列を渡します。
             * @param {Object<string, ?*>} command コマンドのオブジェクトを渡します。
             * @returns {CmdExt} インスタンス自身を返します。
             */
            CmdExt.prototype.set = function (pathname, command) {
                var path = this._getPath(pathname);
                if (path.length > 0) {
                    for (var i = 0; i < path.length; i++) {
                        var parentPath = path.slice(0, i),
                            nowCommand = this.get(path.slice(0, i + 1).join(this.separator)),
                            parent = ((this.get(parentPath.join(this.separator)) || {}).raw || {}).command || this.commands;
                        if (nowCommand === undefined) {
                            if (parent !== this.commands && !CmdExt._isType(parent.subcommands, 'Object')) parent.subcommands = {};
                            var target = parent === this.commands ? parent : parent.subcommands;
                            target[path[i]] = {};
                            if (path[i + 1] !== undefined) target[path[i]].subcommands = {};
                        }
                    }
                    command = CmdExt._castType(command, {});
                    var rawCommand = this.get(pathname).raw.command,
                        dataKeys = Object.keys(command);
                    for (var i = 0; i < dataKeys.length; i++) rawCommand[dataKeys[i]] = command[dataKeys[i]];
                }
                return this;
            };
            /**
             * パス文字列に一致するコマンドを削除します。
             * @param {string} pathname パス文字列を渡します。
             * @returns {boolean} 削除に成功したかの真偽値を返します。
             */
            CmdExt.prototype.delete = function (pathname) {
                var command = this.get(pathname);
                return command === undefined ? false :
                    delete ((((command.parent || {}).raw || {}).command || {}).subcommands || this.commands)[command.commandName];
            };
            /**
             * パス文字列に一致するコマンドが存在するか調べます。
             * @param {string} pathname パス文字列を渡します。
             * @returns {boolean} 存在するかの真偽値を返します。
             */
            CmdExt.prototype.has = function (pathname) {
                return this.get(pathname) !== undefined;
            };
            /**
             * 文字列からコマンドを解析して一致するコマンドを実行します。
             * @param {string} str 文字列を渡します。
             * @returns {CmdExt} インスタンス自身を返します。
             */
            CmdExt.prototype.exec = function (str) {
                var parsed = this.parseCommand(str),
                    command = this.get(parsed.pathname),
                    context = {
                        cmdext: this,
                        text: str,
                        args: parsed.args,
                        error: command === undefined ? new CmdExt.errors.CommandNotFound("Command '" + parsed.pathname + "' is not found") :
                            !command.enabled ? new CmdExt.errors.DisabledCommand("Command '" + parsed.pathname + "' is disabled") :
                                null,
                        failed: command === undefined || (command !== undefined && !command.enabled),
                        parseData: parsed,
                        command: command
                    };
                if (context.failed) this._trigger('commanderror', context);
                if (command === undefined || !command.enabled) {
                    if (this._handlers.commanderror.length < 1 &&
                        ((command === undefined && this._handlers.commandnotfound.length < 1) ||
                            (!command.enabled && this._handlers.disabledcommand.length < 1))) throw err;
                    else this._trigger(command === undefined ? 'commandnotfound' : 'disabledcommand', context);
                }
                return this;
            };
            /**
             * ハンドラーを登録します。
             * @param {string|Object<string, Function>} type 空白区切りのイベント名の文字列かイベント名とハンドラーが組のオブジェクトを渡します。
             * @param {Function} [handler=undefined] ハンドラーの関数を渡します。
             * @returns {CmdExt} インスタンス自身を返します。
             */
            CmdExt.prototype.on = function (type, handler) {
                switch (CmdExt._getType(type)) {
                    case 'String':
                        var types = type.match(/\S+/g) || [];
                        for (var i = 0; i < types.length; i++) this._addHandler(types[i], handler);
                        break;
                    case 'Object':
                        var typeKeys = Object.keys(type);
                        for (var i = 0; i < typeKeys.length; i++) this._addHandler(typeKeys[i], type[typeKeys[i]]);
                        break;
                }
                return this;
            };

            return CmdExt;
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
