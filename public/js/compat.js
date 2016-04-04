// jshint bitwise:false
// vim: et ts=4 sw=4 sts=4
;(function () {
    "use strict";

    // JavaScript 1.6

    if (typeof Array.prototype.indexOf !== 'function') { // {{{
        /**
         * Returns the first index at which a given element can be found in
         * the array, or -1 if it is not present. Elements of the array are
         * compared using strict equality (triple-equals operator).
         */
        Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }

            var t = Object(this);
            var len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = +fromIndex || 0; // unary plus converts to number

            if (n >= len) {
                return -1;
            }

            var i = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (i < len) {
                if ((i in t) && t[i] === searchElement) {
                    return i;
                }
                ++i;
            }

            return -1;
        };
    } // }}}

    if (typeof Array.prototype.lastIndexOf !== 'function') {
        Array.prototype.lastIndexOf = function lastIndexOf(searchElement, fromIndex) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }

            var t = Object(this);
            var len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = len - 1;

            if (arguments.length > 1) {
                n = +fromIndex;
                if (n != n) { // NaN
                    n = 0;
                } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            var k;
            for (k = n >= 0
                ? Math.min(n, len - 1)
                : len - Math.abs(n); k >= 0; k--) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
    

    if (typeof Array.prototype.forEach !== 'function') { // {{{
        /**
         * Executes a provided function once per array element.
         */
        Array.prototype.forEach = function forEach(callback, thisArg) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; ++i) {
                if (i in t) {
                    callback.call(thisArg, t[i], i, t);
                }
            }
        };
    } // }}}

    if (typeof Array.prototype.filter !== 'function') // {{{
    {
        /**
         * Creates a new array with all elements that pass the test
         * implemented by the provided function.
         */
        Array.prototype.filter = function filter(callback, thisArg)
        {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(this);
            var len = t.length >>> 0;
            var res = [];

            for (var i = 0; i < len; ++i) {
                if (i in t) {
                    var val = t[i];
                    if (callback.call(thisArg, val, i, t)) {
                        res[res.length] = val;
                    }
                }
            }

            return res;
        };
    } // }}}

    if (typeof Array.prototype.every !== 'function') { // {{{
        /**
         * Tests whether all elements in the array pass the test implemented
         * by the provided function.
         */
        Array.prototype.every = function every(callback, thisArg) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; ++i) {
                if ((i in t) && !callback.call(thisArg, t[i], i, t)) {
                    return false;
                }
            }

            return true;
        };
    } // }}}

    if (typeof Array.prototype.some !== 'function') { // {{{
        /**
         * Tests whether some element in the array passes the test implemented
         * by the provided function.
         */
        Array.prototype.some = function some(callback, thisArg) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; ++i) {
                if ((i in t) && callback.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    } // }}}

    if (typeof Array.prototype.map !== 'function') { // {{{
        /**
         * Creates a new array with the results of calling a provided function
         * on every element in this array.
         */
        Array.prototype.map = function map(callback, thisArg) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
            // Production steps of ECMA-262, Edition 5, 15.4.4.19
            // Reference: http://es5.github.com/#x15.4.4.19
            var T, A, k;

            if (typeof this === 'undefined' || this === null) {
                throw new TypeError('this is null or not defined');
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            // >>> (zero-fill right shift; fills with zeros from the left, sign is not preserved)
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) where Array is
            // the standard built-in constructor with that name and len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while (k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[k];

                    // ii. Let mappedValue be the result of calling the Call internal method of callback
                    // with T as the this value and argument list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty( A, k, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                    // For best browser support, use the following:
                    A[k] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
        };
    } // }}}

    // JavaScript 1.8

    if (typeof Array.prototype.reduce !== 'function') { // {{{
        /**
         * Polyfill of JavaScript 1.8 Array.prototype.reduce().
         *
         * Applies a function against an accumulator and each value of the array
         * (from left-to-right, excluding holes) has to reduce it to a single value.
         *
         * This function is implemented natively in Chrome, FF 3.0+, IE 9+, Opera 10.5+ and Safari 4.0+.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce 
         */
        Array.prototype.reduce = function reduce(callback /*, initialValue*/) {
            if (this === null || typeof this === 'undefined') {
                throw new TypeError('this is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }
            var t = Object(this), // must be an object so that 'in' operator doesn't throw
                len = t.length >>> 0,
                k = 0,
                value;
            if (arguments.length > 1) {
                value = arguments[1];
            } else {
                // find first element in array
                while (k < len && !(k in t)) {
                    k++;
                }
                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }
                value = t[k++];
            }
            for ( ; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        };
    } // }}}
})();
