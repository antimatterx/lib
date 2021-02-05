/*!
 * LibraryTemplate JavaScript Library v1.0.0
 * https://github.com/AntimatterX/lib/blob/main/lib/librarytemplate.js
 * 
 * This library is declared globally in non-Node.js environments with the following name.
 * librarytemplate
 * 
 * Released under the MIT license
 */
(function (globalObject, undefined) {
    'use strict';
    // 定数
    var globalKeys = [ // グローバルオブジェクトでのライブラリのキー
        "librarytemplate"
    ],
        context = { // 環境
            href: (typeof location === "object" && typeof location.href === "string" ? location.href : ""), // 現在のURI
            isNode: (typeof process === "object" && typeof process.release === "object" && process.release.name === "node"), // Node.jsかどうか
            isAvailableModuleExports: (typeof module === "object" && typeof module.exports !== "undefined"), // ModuleExportsの利用可否
            isAvailableDocument: (typeof document === "object" && document instanceof Document), // documentの利用可否
            isAvailableGMStorage: (typeof GM === "object" && typeof GM.setValue === "function" && typeof GM.getValue === "function"), // GreasemonkeyのストレージAPIの利用可否
            isAvailableES6: (typeof Symbol === "function" && typeof Symbol() === "symbol") // Symbolで判定したES6構文の利用可否
        },
        init = { // 初期化用の関数群
            /**
             * 型名を返す
             * @param {?*} x 任意の値
             * @returns {string} 型名
             */
            getType: function (x) {
                return Object.prototype.toString.call(x).replace(/^\[object (.+)\]$/, "$1");
            },
            /**
             * 指定された型かどうか判定する
             * @param {?*} x 任意の値
             * @param {string|Array<string>} type 型名または型名のリスト
             * @returns {boolean} 指定された型かどうかの真偽値
             */
            isType: function (x, type) {
                var xType = lib.getType(x),
                    appointedType = lib.getType(type);
                return (appointedType === "String" ? (xType === type) :
                    appointedType === "Array" ? (type.indexOf(xType) !== -1) :
                        false);
            },
            /**
             * デフォルト値と型が異なる場合はデフォルト値を返す
             * @param {?*} x 任意の値
             * @param {?*} defaultValue デフォルト値
             * @param {string|Array<string>} [allowType=[]] 他に許容する型名または型名のリスト
             * @returns {?*} 検証された値
             */
            initType: function (x, defaultValue, allowType) {
                return (lib.isType(x, [lib.getType(defaultValue)].concat(lib.isType(allowType, "Array") ? allowType :
                    lib.getType(allowType, "String") ? [allowType] :
                        [])) ? x : defaultValue);
            }
        };

    // ライブラリ
    var lib = (void 0);

    // エクスポート
    if (context.isNode && context.isAvailableModuleExports) module.exports = lib;
    else globalKeys.forEach(function (k) {
        globalObject[k] = lib;
    });
})(typeof window === "object" ? window : this);
