/**!
 * LibraryTemplate JavaScript Library v2.0.0
 * https://github.com/AntimatterX/lib/blob/main/lib/librarytemplate.js
 * 
 * This library is declared globally in non-Node.js environments with the following name.
 * librarytemplate
 * 
 * Released under the MIT license
 * 
 * Last Update
 * 2021-02-26T17:07:08.141Z
 */
(function _main(_root, undefined) {
    'use strict';
    // 環境
    var _ctx = {
        libKeys: [],
        conflict: {},
        available: {
            moduleExports: (typeof module === 'object' && module.exports !== undefined)
        },
        fn: {
            /**
             * グローバルのライブラリを前の状態に戻す
             * @returns {Object<symbol|string|number, ?*>} 衝突していたプロパティのリスト
             */
            noConflict: function () {
                _ctx.libKeys.forEach(function (k) {
                    if (k in _ctx.conflict) _root[k] = _ctx.conflict[k];
                });
                return _ctx.conflict;
            },
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
                var xType = _ctx.fn.getType(x),
                    appointedType = _ctx.fn.getType(type);
                return appointedType === 'String' ? xType === type :
                    appointedType === 'Array' ? type.indexOf(xType) > -1 :
                        false;
            },
            /**
             * デフォルト値と型が異なる場合はデフォルト値を返す
             * @param {?*} x 任意の値
             * @param {?*} defaultValue デフォルト値
             * @param {string|Array<string>} [allowType=[]] 他に許容する型名または型名のリスト
             * @returns {?*} キャストされた値
             */
            castType: function (x, defaultValue, allowType) {
                return _ctx.fn.isType(x, [_ctx.fn.getType(defaultValue)].concat(_ctx.fn.isType(allowType, 'Array') ? allowType :
                    lib.getType(allowType, 'String') ? [allowType] :
                        [])) ? x : defaultValue;
            }
        }
    };

    // ライブラリ
    var _lib = {
        keys: [ // グローバルでのライブラリのキー
            'librarytemplate'
        ],
        value: null // ライブラリの値
    };

    // エクスポート
    _ctx.libKeys = _lib.keys;
    if (_ctx.available.moduleExports) module.exports = _lib.value;
    else _lib.keys.forEach(function (k) {
        if (k in _root) _ctx.conflict[k] = _root[k];
        _root[k] = _lib.value;
    });

    // 利用可能な変数を返す
    return {
        _root: _root, // グローバルオブジェクト
        undefined: undefined, // undefined
        _main: _main, // ライブラリを読み込む関数
        _ctx: _ctx, // 環境
        _lib: _lib // ライブラリ
    };
})(typeof window === 'object' ? window : this);
