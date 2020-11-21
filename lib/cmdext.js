(function(globalObject) {
    'use strict';
    // プライベート関数
    function _getType(x) { // 型名を返す
        return Object.prototype.toString.call(x).replace(/\[object |\]/g, "");
    };

    function _initValue(val, defaultVal) { // valの型が異なる場合defaultValの値を返す
        return _getType(val) === _getType(defaultVal) ? val : defaultVal;
    };

    function _initParam(param, defaultParam) { // キーの型が異なる場合defaultParamのキーで上書きして返す
        param = _initValue(param, {});
        defaultParam = _initValue(defaultParam, {});
        Object.keys(defaultParam).forEach(function(k) {
            if (_getType(param[k]) !== _getType(defaultParam[k])) param[k] = defaultParam[k];
        });
        return param;
    };

    function _getExportTarget() { // エクスポート先を取得する
        return (typeof exports === "object" && typeof module === "object" ? exports : globalObject);
    };

    function _levenshtein(str1, str2, threshold) { // レーベンシュタイン距離で文字列の類似度を取得
        str1 = _initValue(str1, "");
        str2 = _initValue(str2, "");
        threshold = _initValue(threshold, 0);
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

    function _isIncludesAliases(lowerCase, delimiter, aliases, path) { // コマンドのパスにエイリアスが含まれているか
        return path.split(delimiter).some(function(v) {
            return aliases.map(function(v) {
                return lowerCase ? v.toLowerCase() : v;
            }).indexOf(v) !== -1;
        });
    };

    function _recursiveFlattenCommands(obj, lowerCase, delimiter, prevPath, totalAliases, flattened) { // 再帰的にフラットなコマンドのリストを作成
        obj = _initValue(obj, {});
        lowerCase = _initValue(lowerCase, false);
        delimiter = _initValue(delimiter, ".");
        prevPath = prevPath === undefined ? "" : (lowerCase ? prevPath.toLowerCase() : prevPath) + delimiter;
        totalAliases = _initValue(totalAliases, []);
        flattened = _initValue(flattened, {});
        if (_getType(obj) === "Object") Object.keys(obj).forEach(function(k) {
            totalAliases = totalAliases.concat(_initValue(obj[k].aliases, []));
            var path = prevPath + (lowerCase ? k.toLowerCase() : k), // 完全なパス
                isGroup = (obj[k].subcommands !== undefined), // サブコマンドがあるか
                isCallable = obj[k].isCallable === undefined ? (_getType(obj[k].action) === "Function") : _initValue(obj[k].isCallable, false), // 呼び出せるかどうか
                action = _initValue(obj[k].action, function() {}), // 処理
                details = _initValue(obj[k].details, ["", ""]), // 説明
                aliases = _initValue(obj[k].aliases, []); // エイリアス
            flattened[path] = {
                original: k, // エイリアスではないオリジナルのコマンド名
                isGroup: isGroup,
                isCallable: isCallable,
                isAlias: _isIncludesAliases(lowerCase, delimiter, totalAliases, path) // コマンドのパスにエイリアスが含まれているか
            };
            if (obj[k].action !== undefined) flattened[path].action = action;
            if (obj[k].details !== undefined) flattened[path].details = details;
            if (obj[k].aliases !== undefined) {
                flattened[path].aliases = aliases;
                obj[k].aliases.forEach(function(v) {
                    v = prevPath + (lowerCase ? v.toLowerCase() : v);
                    flattened[v] = {
                        original: k,
                        isGroup: isGroup,
                        isCallable: isCallable,
                        isAlias: _isIncludesAliases(lowerCase, delimiter, totalAliases, v)
                    };
                    if (obj[k].action !== undefined) flattened[v].action = action;
                    if (obj[k].details !== undefined) flattened[v].details = details;
                    if (obj[k].aliases !== undefined) flattened[v].aliases = aliases;
                    if (obj[k].subcommands !== undefined) _recursiveFlattenCommands(obj[k].subcommands, lowerCase, delimiter, v, totalAliases, flattened);
                });
            };
            if (obj[k].subcommands !== undefined) _recursiveFlattenCommands(obj[k].subcommands, lowerCase, delimiter, path, totalAliases, flattened);
        });
        return flattened;
    };

    function _commandsSimilarity(str, commands, caseInsensitive, delimiter) { // 文字列とコマンドリストの各コマンドの類似性を返す
        str = _initValue(str, "");
        commands = _initValue(commands, {});
        caseInsensitive = _initValue(caseInsensitive, false);
        delimiter = _initValue(delimiter, ".");
        var flattened = _recursiveFlattenCommands(commands, caseInsensitive, delimiter),
            similarity = {};
        Object.keys(flattened).forEach(function(k) {
            similarity[k] = {
                isGroup: flattened[k].isGroup,
                isCallable: flattened[k].isCallable,
                isAlias: flattened[k].isAlias,
                percent: _levenshtein(caseInsensitive ? str.toLowerCase() : str, k)
            };
        });
        return similarity;
    };

    // クラス
    var cmdext = {}; // ライブラリのオブジェクト
    cmdext.CmdExt = (function(old_cmdext) {
        // コンストラクタ
        function CmdExt(prefix, delimiter) {
            prefix = _initValue(prefix, "!"); // コマンドプレフィックス
            delimiter = _initValue(delimiter, "."); // コマンドのパスの分割文字
            if (!(this instanceof CmdExt)) return new CmdExt(prefix, delimiter); // 作成されたオブジェクトじゃないならnew演算子でコンストラクタの呼び出し
            this.prefix = prefix;
            this.delimiter = delimiter;
        };

        // メソッド
        var p = CmdExt.prototype; // プロトタイプ
        p.argumentParse = function(str, toNumber) { // 引数文字列解析
            str = _initValue(str, ""); // 解析する文字列
            toNumber = _initValue(toNumber, false); // 数字に変換できるなら変換するか
            var m = str.split("").reverse().join("").match(/"(?!\\).*?"(?!\\)|[\S]+/g); // 古いブラウザでは正規表現の後読みが使えないので文字列を反転して先読みにする
            return m === null ? [] : m.reverse().map(function(v) {
                var x = v.replace(/^"(?!\\)(.*)"(?!\\)$/g, "$1").replace(/"\\/g, '"').split("").reverse().join("");
                return isNaN(Number(x)) || !toNumber ? x : Number(x);
            });
        };
        p.commandParse = function(str) { // コマンド構文解析
            str = _initValue(str, ""); // 解析する文字列
            if (str.substr(0, this.prefix.length) !== this.prefix || str.length === this.prefix.length) return {
                isCommand: false,
                path: [],
                args: []
            };
            var splited = str.substr(this.prefix.length).split(" ");
            return {
                isCommand: true,
                path: this.delimiter ? splited[0].split(this.delimiter) : splited[0],
                args: splited.length > 1 ? p.argumentParse.call(this, splited.slice(1).join(" ")) : []
            };
        };
        p.flattenCommands = function(commands, lowerCase) { // フラットなコマンドのリストを作成
            commands = _initValue(commands, {}); // フラットにするコマンドのリスト
            lowerCase = _initValue(lowerCase, false); // コマンドを小文字にするか
            return _recursiveFlattenCommands(commands, lowerCase, this.delimiter);
        };
        p.commandExecutor = function(str, commands, options) { // 文字列がコマンドリストに含まれていたら実行する
            // options
            //  .args ... コマンドの関数に渡す引数の配列
            //  .caseInsensitive ... コマンドを大文字小文字区別しないか
            //  .oncommandnotfound ... コマンドが見つからなかったとき実行する関数
            //  .oncommanderror ... コマンドではなかったとき実行する関数
            str = _initValue(str, ""); // コマンド文字列
            commands = _initValue(commands, {}); // コマンドのリスト
            options = _initParam(options, { // オプション
                args: [],
                caseInsensitive: false,
                oncommandnotfound: function() {},
                oncommanderror: function() {}
            });
            var command = p.commandParse.call(this, str),
                flattened = p.flattenCommands.call(this, commands, options.caseInsensitive),
                path = command.path.map(function(v) {
                    return options.caseInsensitive ? v.toLowerCase() : v;
                }).join(this.delimiter),
                similarity = _commandsSimilarity(command.isCommand ? command.path.join(this.delimiter) : str, commands, options.caseInsensitive, this.delimiter),
                args = [command.isCommand, command.path, command.args, similarity].concat(options.args);
            if (!command.isCommand) options.oncommanderror.apply(null, args); // コマンドじゃなかった場合
            else if (flattened[path] === undefined) options.oncommandnotfound.apply(null, args); // コマンドリストに含まれていなかった場合
            else if (!flattened[path].isCallable) options.oncommandnotfound.apply(null, args); // 呼び出し可能じゃなかった場合
            else if (_getType(flattened[path].action) === "Function") flattened[path].action.apply(null, args); // コマンドにaction関数が設定されていた場合
            else options.oncommanderror.apply(null, args); // 不明なエラー
        };
        p.noConflict = function() { // cmdextを前のものに戻した後、ライブラリを返す
            _getExportTarget().cmdext = old_cmdext;
            return cmdext;
        };

        return CmdExt;
    })(_getExportTarget().cmdext);

    // プライベートメソッド
    cmdext.lib = {
        getType: _getType,
        initValue: _initValue,
        initParam: _initParam,
        getExportTarget: _getExportTarget,
        levenshtein: _levenshtein,
        isIncludesAliases: _isIncludesAliases,
        recursiveFlattenCommandse: _recursiveFlattenCommands,
        commandsSimilarity: _commandsSimilarity
    };

    // エクスポート
    _getExportTarget().cmdext = cmdext;
})(this);
