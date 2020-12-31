/*!
 * CmdExt JavaScript Library v1.0.0
 * https://github.com/AntiMatter-X/lib/blob/main/lib/cmdext.js
 *
 * This library is declared globally in non-Node.js environments with the following name.
 * CmdExt
 *
 * Released under the MIT license
 */
(function(globalObject, undefined) {
    'use strict';
    // 定数
    var globalKeys = [ // グローバルでのライブラリのキー
            "CmdExt"
        ],
        context = { // 環境
            isNode: typeof process === "object" && typeof process.release === "object" && process.release.name === "node", // Node.jsかどうか
            isAvailableES6: typeof Symbol === "function" && typeof Symbol() === "symbol" // Symbolで判定したES6構文の利用可否
        };

    // ライブラリ
    var lib = (function() {
        // プライベート関数
        function _getType(x) { // 型名を返す
            return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
        };

        function _isType(x, typeName) { // xが指定された型名か判定する
            var type = _getType(x),
                comparisonType = _getType(typeName);
            if (comparisonType === "String") return type === typeName;
            else if (comparisonType === "Array") return typeName.indexOf(type) !== -1;
            else return false;
        };

        function _initType(value, defaultValue) { // valueの型が異なる場合defaultValueの値を返す
            return _isType(value, _getType(defaultValue)) ? value : defaultValue;
        };

        function _initParam(param, defaultParam) { // キーの型が異なる場合defaultParamのキーで上書きして返す
            if (!(_isType(param, _getType(defaultParam)) && _isType(param, ["Object", "Array"]))) return lib.isType(defaultParam, "Array") ? [] : {};
            Object.keys(defaultParam).forEach(function(k) {
                if (!_isType(param[k], _getType(defaultParam[k]))) param[k] = defaultParam[k];
            });
            return param;
        };

        function _escapeRegExp(str) { // 正規表現のメタ文字をエスケープして返す
            // https://s8a.jp/javascript-escape-regexp
            return _initType(str, "").replace(/[\\\^\$\.\*\+\?\(\)\[\]\{\}\|]/g, "\\$&");
        };

        function _nonOverlapArray(array) { // 配列を重複排除して返す
            array = _initType(array, []);
            if (array.length < 2) return array;
            // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
            if (context.isAvailableES6) return Array.from(new Set(array)); // ES6構文が使えるならSetで重複排除
            else return array.filter(function(x, i) {
                return array.indexOf(x) === i;
            });
        };

        function _levenshtein(str1, str2, threshold) { // レーベンシュタイン距離で文字列の類似度を取得する
            str1 = _initType(str1, "");
            str2 = _initType(str2, "");
            threshold = _initType(threshold, 0);
            var max = Math.max(str1.length, str2.length),
                str2Long = str1.length < str2.length,
                s1 = str2Long ? str1 : str2,
                s2 = str2Long ? str2 : str1,
                len1 = s1.length,
                len2 = s2.length;
            if (threshold === undefined || threshold === 0 || threshold > len2) threshold = len2;
            if (len2 - len1 >= threshold || len1 === 0) return threshold;
            var r, c, min, ins, sub, minDistance, d = [];
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
                };
                if (minDistance >= threshold) return threshold;
            };
            return 100 - ((min > threshold ? threshold : min) / max * 100);
        };

        function _recursiveInitCommandList(x, toLower, str, delimiter, _commandList, _prevPath) { // 再帰的にコマンドのリストを初期化して返す
            toLower = _initType(toLower, false);
            _commandList = _initType(_commandList, _initType(x, {}));
            var obj = {};
            if (_isType(x, "Object")) Object.keys(x).forEach(function(k) {
                var key = (toLower ? k.toLowerCase() : k);
                obj[key] = {
                    raw: x[k],
                    original: k,
                    isGroup: _isType(x[k].subcommands, "Object") && Object.keys(x[k].subcommands).length > 0,
                    isCallable: !_isType(x[k].action, "Function") ? false : // 関数じゃなかった時
                        _initType(x[k].isCallable, true) ? true : // 関数かつ呼び出し可能だった時
                        false // 関数かつ呼び出し不可だった時
                };
                if (_isType(x[k].action, "Function")) obj[key].action = x[k].action;
                if (_isType(x[k].details, "Array") && x[k].details.length > 1) obj[key].details = x[k].details;
                if (_isType(x[k].subcommands, "Object")) obj[key].subcommands = _recursiveInitCommandList(x[k].subcommands, toLower, str, delimiter, _commandList, _initType(_prevPath, []).concat([key]));
                if (_isType(x[k].aliases, "Array") && x[k].aliases.length > 0) obj[key].aliases = x[k].aliases;
                if (_isType(str, "String") && _isType(delimiter, "String")) {
                    var path = _initPath(str.split(delimiter), _commandList, toLower);
                    obj[key].similarity = _levenshtein(path.length > 0 ? path.join(delimiter) : str, (_isType(_prevPath, "Array") ? _prevPath : []).concat([key]).join(delimiter));
                };
                if (_isType(_prevPath, "Array")) obj[key].prevPath = _prevPath;
            });
            return obj;
        };

        function _initPath(path, commandList, toLower, _arr) { // コマンドパスを初期化して返す
            toLower = _initType(toLower, false);
            path = _initType(path, []).map(function(k) {
                return toLower ? k.toLowerCase() : k;
            });
            commandList = _recursiveInitCommandList(_initType(commandList, {}), toLower);
            _arr = _initType(_arr, []);
            if (_arr.length < path.length) {
                var key = (function() {
                    var obj = {};
                    Object.keys(commandList).forEach(function(k) {
                        obj[k] = k;
                        (commandList[k].aliases || []).forEach(function(alias) {
                            obj[toLower ? alias.toLowerCase() : alias] = k;
                        });
                    });
                    return obj;
                })()[path[_arr.length]];
                return _initPath(path, _isType(key, "Undefined") ? commandList : commandList[key].subcommands, toLower, _arr.concat([key]));
            } else return _arr.indexOf(undefined) === -1 ? _arr : [];
        };

        function _getProperty(obj, pathname) { // パス文字列と同じパスのプロパティを返す
            var path = _initType(pathname, "").split("."),
                result = _initType(obj, {});
            for (var i = 0; i <= path.length - 1; i++) {
                if (_isType(result[path[i]], "Undefined")) return undefined;
                result = result[path[i]];
            };
            return result;
        };

        function _recursiveFlattenInitialized(initialized, delimiter, _obj) { // 初期化されたコマンドのリストを再帰的にフラット化して返す
            delimiter = _initType(delimiter, ".");
            _obj = _initType(_obj, {});
            if (_isType(initialized, "Object")) Object.keys(initialized).forEach(function(k) {
                var key = (_isType(initialized[k].prevPath, "Array") ? initialized[k].prevPath.join(delimiter) + delimiter : "") + k;
                _obj[key] = {};
                Object.keys(initialized[k]).forEach(function(k2) {
                    _obj[key][k2] = initialized[k][k2];
                });
                if (_isType(initialized[k].subcommands, "Object")) _recursiveFlattenInitialized(initialized[k].subcommands, delimiter, _obj)
            });
            return _obj;
        };

        // コンストラクタ
        function CmdExt(options) {
            if (!(this instanceof CmdExt)) return new CmdExt(options); // 作成されたオブジェクトじゃないならnew演算子でコンストラクタの呼び出し
            this.options = _initParam(_initType(options, {}), {
                prefix: "!", // コマンドプレフィックス
                delimiter: ".", // コマンドパス区切り文字
                quots: ['"', "'", "`"] // 引数文字列内引用符
            });
        };

        // 静的メソッド
        var staticMethods = {
            // メタ
            noConflict: function() { // グローバルのライブラリのキーを前の状態に戻す
                globalKeys.forEach(function(k) {
                    globalObject[k] = lib.conflict[k];
                });
                return lib;
            },
            //--------------------------------------------------
            // 解析関連
            parseArgs: function(str, quots) { // 引数文字列を解析して配列で返す
                str = _initType(str, "");
                quots = _nonOverlapArray(_initType(quots, [])).filter(function(v) {
                    return /^\S+$/.test(_initType(v, ""));
                }).map(function(v) {
                    return _escapeRegExp(v);
                }).sort(function(a, b) {
                    return b.length - a.length;
                });
                var quotsGroup = "(" + quots.join("|") + ")";
                return quots.length > 0 ? ((str.split("").reverse().join("").match(new RegExp(quotsGroup + "(?!\\\\)[\\s\\S]*?\\1(?!\\\\)|\\S+", "g")) || []).reverse().map(function(v) {
                    return v.replace(new RegExp("^" + quotsGroup + "(?!\\\\)([\\s\\S]*)\\1(?!\\\\)$"), "$2").replace(/([^\\]*)\\/g, "$1").split("").reverse().join("");
                }) || []) : (str.match(/\S+/g) || []);
            },
            initCommandList: function(commandList, toLower, str, delimiter) { // コマンドのリストを初期化して返す
                return _recursiveInitCommandList(_initType(commandList, {}), _initType(toLower, false), str, delimiter);
            },
            flattenInitialized: function(initialized, delimiter) { // 初期化されたコマンドのリストをフラット化して返す
                return _recursiveFlattenInitialized(_initType(initialized, {}), _initType(delimiter, "."));
            },
            //--------------------------------------------------
            // プロパティ
            conflict: (function() { // 競合しているグローバルのプロパティ
                var obj = {};
                globalKeys.forEach(function(k) {
                    obj[k] = globalObject[k];
                });
                return obj;
            })(),
            //--------------------------------------------------
            // プライベートメソッド //////////////////////////////////////////////////
            _getType: _getType, // 型名を返す
            _isType: _isType, // xが指定された型名か判定する
            _initType: _initType, // valueの型が異なる場合defaultValueの値を返す
            _initParam: _initParam, // キーの型が異なる場合defaultParamのキーで上書きして返す
            _escapeRegExp: _escapeRegExp, // 正規表現のメタ文字をエスケープして返す
            _nonOverlapArray: _nonOverlapArray, // 配列を重複排除して返す
            _levenshtein: _levenshtein, // レーベンシュタイン距離で文字列の類似度を取得する
            _recursiveInitCommandList: _recursiveInitCommandList, // 再帰的にコマンドのリストを初期化して返す
            _initPath: _initPath, //  // コマンドパスを初期化して返す
            _getProperty: _getProperty, // パス文字列と同じパスのプロパティを返す
            _recursiveFlattenInitialized: _recursiveFlattenInitialized // 初期化されたコマンドのリストを再帰的にフラット化して返す
            ///////////////////////////////////////////////////////////////////
        };
        Object.keys(staticMethods).forEach(function(k) { // 静的メソッドを定義
            CmdExt[k] = staticMethods[k];
        });

        // メソッド
        var p = CmdExt.prototype = { // プロトタイプ
            constructor: CmdExt, // コンストラクタ
            parseCommand: function(str) { // コマンド文字列を解析して返す
                str = _initType(str, "");
                var m = str.match(new RegExp("^" + _escapeRegExp(this.options.prefix) + "(\\S+)(.*)$")) || [],
                    isCommand = (m.length > 0);
                return {
                    _matchResult: isCommand ? m : null, // matchの結果
                    isCommand: isCommand, // コマンドかどうか
                    message: str, // 解析した文字列
                    pathname: m[1] ? m[1] : "", // コマンドパス文字列
                    path: _isType(m[1], "Undefined") ? [] : m[1].split(this.options.delimiter), // コマンドパス
                    argsname: m[2] ? m[2].trim() : "", // 引数文字列
                    args: CmdExt.parseArgs(m[2] ? m[2].trim() : "", this.options.quots) // 引数
                };
            },
            exec: function(str, commandList, options) { // 文字列を解析してコマンドのリストに存在するコマンドなら実行する
                str = _initType(str, "");
                commandList = _initType(commandList, {});
                options = _initParam(_initType(options, {}), {
                    args: [], // コマンド実行の時に呼び出される関数に渡す引数配列
                    caseInsensitive: false, // 大文字と小文字を区別しないかどうか
                    oncommandnotfounderror: function() {}, // コマンドが見つからない時に実行する関数
                    onnotcommanderror: function() {}, // コマンドじゃなかった時に実行する関数
                    onunknownerror: function() {} // 不明なエラー時に実行する関数
                });
                var parsed = p.parseCommand.call(this, str),
                    initialized = _recursiveInitCommandList(commandList, options.caseInsensitive, parsed.isCommand ? parsed.pathname : str, this.options.delimiter),
                    command = _initType(_getProperty(initialized, _initPath(parsed.path, commandList, options.caseInsensitive).join(".subcommands.")), {}),
                    args = [parsed.isCommand, parsed.path, parsed.args, {
                        parsed: parsed, // コマンド解析の結果
                        command: command, // 一致したコマンド
                        similarity: (function(flattened) { // 類似度のリスト
                            var obj = {};
                            Object.keys(flattened).forEach(function(k) {
                                obj[k] = flattened[k].similarity;
                            });
                            return obj;
                        })(_recursiveFlattenInitialized(initialized, this.options.delimiter))
                    }].concat(options.args);
                return (!parsed.isCommand ? options.onnotcommanderror : // コマンドではない場合
                    !_initType(command.isCallable, false) ? options.oncommandnotfounderror : // 呼び出し不可なコマンドだった場合
                    _isType(command.action, "Function") && _initType(command.isCallable, false) ? command.action : // 呼び出し可能なコマンドだった場合
                    options.onunknownerror).apply(globalObject, args); // 不明なエラー
            }
        };
        Object.keys(staticMethods).forEach(function(k) { // プロトタイプに静的メソッドを継承
            p[k] = staticMethods[k];
        });

        return CmdExt;
    })();

    // エクスポート
    if (context.isNode) module.exports = lib;
    else globalKeys.forEach(function(k) {
        globalObject[k] = lib;
    });
})(typeof window === "object" ? window : this);
