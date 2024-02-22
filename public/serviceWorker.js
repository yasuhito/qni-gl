(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // -------------------------------------------------------------------------------------
    // refinements
    // -------------------------------------------------------------------------------------
    /**
     * @category refinements
     * @since 2.11.0
     */
    // -------------------------------------------------------------------------------------
    // instances
    // -------------------------------------------------------------------------------------
    /**
     * @category instances
     * @since 2.10.0
     */
    var Eq$1 = {
        equals: function (first, second) { return first === second; }
    };
    /**
     * @category instances
     * @since 2.10.0
     */
    var Ord$1 = {
        equals: Eq$1.equals,
        compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
    };
    /**
     * @category instances
     * @since 2.10.0
     */
    ({
        equals: Eq$1.equals,
        compare: Ord$1.compare,
        top: Infinity,
        bottom: -Infinity
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var _Array = {};

    var Apply = {};

    var _function = {};

    (function (exports) {
    	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    	        if (ar || !(i in from)) {
    	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
    	            ar[i] = from[i];
    	        }
    	    }
    	    return to.concat(ar || Array.prototype.slice.call(from));
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.dual = exports.getEndomorphismMonoid = exports.not = exports.SK = exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.unsafeCoerce = exports.identity = exports.apply = exports.getRing = exports.getSemiring = exports.getMonoid = exports.getSemigroup = exports.getBooleanAlgebra = void 0;
    	// -------------------------------------------------------------------------------------
    	// instances
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getBooleanAlgebra = function (B) {
    	    return function () { return ({
    	        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
    	        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
    	        zero: function () { return B.zero; },
    	        one: function () { return B.one; },
    	        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
    	        not: function (x) { return function (a) { return B.not(x(a)); }; }
    	    }); };
    	};
    	exports.getBooleanAlgebra = getBooleanAlgebra;
    	/**
    	 * Unary functions form a semigroup as long as you can provide a semigroup for the codomain.
    	 *
    	 * @example
    	 * import { Predicate, getSemigroup } from 'fp-ts/function'
    	 * import * as B from 'fp-ts/boolean'
    	 *
    	 * const f: Predicate<number> = (n) => n <= 2
    	 * const g: Predicate<number> = (n) => n >= 0
    	 *
    	 * const S1 = getSemigroup(B.SemigroupAll)<number>()
    	 *
    	 * assert.deepStrictEqual(S1.concat(f, g)(1), true)
    	 * assert.deepStrictEqual(S1.concat(f, g)(3), false)
    	 *
    	 * const S2 = getSemigroup(B.SemigroupAny)<number>()
    	 *
    	 * assert.deepStrictEqual(S2.concat(f, g)(1), true)
    	 * assert.deepStrictEqual(S2.concat(f, g)(3), true)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getSemigroup = function (S) {
    	    return function () { return ({
    	        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    	    }); };
    	};
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * Unary functions form a monoid as long as you can provide a monoid for the codomain.
    	 *
    	 * @example
    	 * import { Predicate } from 'fp-ts/Predicate'
    	 * import { getMonoid } from 'fp-ts/function'
    	 * import * as B from 'fp-ts/boolean'
    	 *
    	 * const f: Predicate<number> = (n) => n <= 2
    	 * const g: Predicate<number> = (n) => n >= 0
    	 *
    	 * const M1 = getMonoid(B.MonoidAll)<number>()
    	 *
    	 * assert.deepStrictEqual(M1.concat(f, g)(1), true)
    	 * assert.deepStrictEqual(M1.concat(f, g)(3), false)
    	 *
    	 * const M2 = getMonoid(B.MonoidAny)<number>()
    	 *
    	 * assert.deepStrictEqual(M2.concat(f, g)(1), true)
    	 * assert.deepStrictEqual(M2.concat(f, g)(3), true)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getMonoid = function (M) {
    	    var getSemigroupM = (0, exports.getSemigroup)(M);
    	    return function () { return ({
    	        concat: getSemigroupM().concat,
    	        empty: function () { return M.empty; }
    	    }); };
    	};
    	exports.getMonoid = getMonoid;
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getSemiring = function (S) { return ({
    	    add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
    	    zero: function () { return S.zero; },
    	    mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
    	    one: function () { return S.one; }
    	}); };
    	exports.getSemiring = getSemiring;
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getRing = function (R) {
    	    var S = (0, exports.getSemiring)(R);
    	    return {
    	        add: S.add,
    	        mul: S.mul,
    	        one: S.one,
    	        zero: S.zero,
    	        sub: function (f, g) { return function (x) { return R.sub(f(x), g(x)); }; }
    	    };
    	};
    	exports.getRing = getRing;
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.11.0
    	 */
    	var apply = function (a) {
    	    return function (f) {
    	        return f(a);
    	    };
    	};
    	exports.apply = apply;
    	/**
    	 * @since 2.0.0
    	 */
    	function identity(a) {
    	    return a;
    	}
    	exports.identity = identity;
    	/**
    	 * @since 2.0.0
    	 */
    	exports.unsafeCoerce = identity;
    	/**
    	 * @since 2.0.0
    	 */
    	function constant(a) {
    	    return function () { return a; };
    	}
    	exports.constant = constant;
    	/**
    	 * A thunk that returns always `true`.
    	 *
    	 * @since 2.0.0
    	 */
    	exports.constTrue = constant(true);
    	/**
    	 * A thunk that returns always `false`.
    	 *
    	 * @since 2.0.0
    	 */
    	exports.constFalse = constant(false);
    	/**
    	 * A thunk that returns always `null`.
    	 *
    	 * @since 2.0.0
    	 */
    	exports.constNull = constant(null);
    	/**
    	 * A thunk that returns always `undefined`.
    	 *
    	 * @since 2.0.0
    	 */
    	exports.constUndefined = constant(undefined);
    	/**
    	 * A thunk that returns always `void`.
    	 *
    	 * @since 2.0.0
    	 */
    	exports.constVoid = exports.constUndefined;
    	function flip(f) {
    	    return function () {
    	        var args = [];
    	        for (var _i = 0; _i < arguments.length; _i++) {
    	            args[_i] = arguments[_i];
    	        }
    	        if (args.length > 1) {
    	            return f(args[1], args[0]);
    	        }
    	        return function (a) { return f(a)(args[0]); };
    	    };
    	}
    	exports.flip = flip;
    	function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    	    switch (arguments.length) {
    	        case 1:
    	            return ab;
    	        case 2:
    	            return function () {
    	                return bc(ab.apply(this, arguments));
    	            };
    	        case 3:
    	            return function () {
    	                return cd(bc(ab.apply(this, arguments)));
    	            };
    	        case 4:
    	            return function () {
    	                return de(cd(bc(ab.apply(this, arguments))));
    	            };
    	        case 5:
    	            return function () {
    	                return ef(de(cd(bc(ab.apply(this, arguments)))));
    	            };
    	        case 6:
    	            return function () {
    	                return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
    	            };
    	        case 7:
    	            return function () {
    	                return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
    	            };
    	        case 8:
    	            return function () {
    	                return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
    	            };
    	        case 9:
    	            return function () {
    	                return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
    	            };
    	    }
    	    return;
    	}
    	exports.flow = flow;
    	/**
    	 * @since 2.0.0
    	 */
    	function tuple() {
    	    var t = [];
    	    for (var _i = 0; _i < arguments.length; _i++) {
    	        t[_i] = arguments[_i];
    	    }
    	    return t;
    	}
    	exports.tuple = tuple;
    	/**
    	 * @since 2.0.0
    	 */
    	function increment(n) {
    	    return n + 1;
    	}
    	exports.increment = increment;
    	/**
    	 * @since 2.0.0
    	 */
    	function decrement(n) {
    	    return n - 1;
    	}
    	exports.decrement = decrement;
    	/**
    	 * @since 2.0.0
    	 */
    	function absurd(_) {
    	    throw new Error('Called `absurd` function which should be uncallable');
    	}
    	exports.absurd = absurd;
    	/**
    	 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
    	 *
    	 * @example
    	 * import { tupled } from 'fp-ts/function'
    	 *
    	 * const add = tupled((x: number, y: number): number => x + y)
    	 *
    	 * assert.strictEqual(add([1, 2]), 3)
    	 *
    	 * @since 2.4.0
    	 */
    	function tupled(f) {
    	    return function (a) { return f.apply(void 0, a); };
    	}
    	exports.tupled = tupled;
    	/**
    	 * Inverse function of `tupled`
    	 *
    	 * @since 2.4.0
    	 */
    	function untupled(f) {
    	    return function () {
    	        var a = [];
    	        for (var _i = 0; _i < arguments.length; _i++) {
    	            a[_i] = arguments[_i];
    	        }
    	        return f(a);
    	    };
    	}
    	exports.untupled = untupled;
    	function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
    	    switch (arguments.length) {
    	        case 1:
    	            return a;
    	        case 2:
    	            return ab(a);
    	        case 3:
    	            return bc(ab(a));
    	        case 4:
    	            return cd(bc(ab(a)));
    	        case 5:
    	            return de(cd(bc(ab(a))));
    	        case 6:
    	            return ef(de(cd(bc(ab(a)))));
    	        case 7:
    	            return fg(ef(de(cd(bc(ab(a))))));
    	        case 8:
    	            return gh(fg(ef(de(cd(bc(ab(a)))))));
    	        case 9:
    	            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    	        default: {
    	            var ret = arguments[0];
    	            for (var i = 1; i < arguments.length; i++) {
    	                ret = arguments[i](ret);
    	            }
    	            return ret;
    	        }
    	    }
    	}
    	exports.pipe = pipe;
    	/**
    	 * Type hole simulation
    	 *
    	 * @since 2.7.0
    	 */
    	exports.hole = absurd;
    	/**
    	 * @since 2.11.0
    	 */
    	var SK = function (_, b) { return b; };
    	exports.SK = SK;
    	/**
    	 * Use `Predicate` module instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	function not(predicate) {
    	    return function (a) { return !predicate(a); };
    	}
    	exports.not = not;
    	/**
    	 * Use `Endomorphism` module instead.
    	 *
    	 * @category zone of death
    	 * @since 2.10.0
    	 * @deprecated
    	 */
    	var getEndomorphismMonoid = function () { return ({
    	    concat: function (first, second) { return flow(first, second); },
    	    empty: identity
    	}); };
    	exports.getEndomorphismMonoid = getEndomorphismMonoid;
    	/** @internal */
    	var dual = function (arity, body) {
    	    var isDataFirst = typeof arity === 'number' ? function (args) { return args.length >= arity; } : arity;
    	    return function () {
    	        var args = Array.from(arguments);
    	        if (isDataFirst(arguments)) {
    	            return body.apply(this, args);
    	        }
    	        return function (self) { return body.apply(void 0, __spreadArray([self], args, false)); };
    	    };
    	};
    	exports.dual = dual; 
    } (_function));

    var internal = {};

    (function (exports) {
    	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    	        if (ar || !(i in from)) {
    	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
    	            ar[i] = from[i];
    	        }
    	    }
    	    return to.concat(ar || Array.prototype.slice.call(from));
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.flatMapReader = exports.flatMapTask = exports.flatMapIO = exports.flatMapEither = exports.flatMapOption = exports.flatMapNullable = exports.liftOption = exports.liftNullable = exports.fromReadonlyNonEmptyArray = exports.has = exports.emptyRecord = exports.emptyReadonlyArray = exports.tail = exports.head = exports.isNonEmpty = exports.singleton = exports.right = exports.left = exports.isRight = exports.isLeft = exports.some = exports.none = exports.isSome = exports.isNone = void 0;
    	var function_1 = _function;
    	// -------------------------------------------------------------------------------------
    	// Option
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	var isNone = function (fa) { return fa._tag === 'None'; };
    	exports.isNone = isNone;
    	/** @internal */
    	var isSome = function (fa) { return fa._tag === 'Some'; };
    	exports.isSome = isSome;
    	/** @internal */
    	exports.none = { _tag: 'None' };
    	/** @internal */
    	var some = function (a) { return ({ _tag: 'Some', value: a }); };
    	exports.some = some;
    	// -------------------------------------------------------------------------------------
    	// Either
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	var isLeft = function (ma) { return ma._tag === 'Left'; };
    	exports.isLeft = isLeft;
    	/** @internal */
    	var isRight = function (ma) { return ma._tag === 'Right'; };
    	exports.isRight = isRight;
    	/** @internal */
    	var left = function (e) { return ({ _tag: 'Left', left: e }); };
    	exports.left = left;
    	/** @internal */
    	var right = function (a) { return ({ _tag: 'Right', right: a }); };
    	exports.right = right;
    	// -------------------------------------------------------------------------------------
    	// ReadonlyNonEmptyArray
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	var singleton = function (a) { return [a]; };
    	exports.singleton = singleton;
    	/** @internal */
    	var isNonEmpty = function (as) { return as.length > 0; };
    	exports.isNonEmpty = isNonEmpty;
    	/** @internal */
    	var head = function (as) { return as[0]; };
    	exports.head = head;
    	/** @internal */
    	var tail = function (as) { return as.slice(1); };
    	exports.tail = tail;
    	// -------------------------------------------------------------------------------------
    	// empty
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	exports.emptyReadonlyArray = [];
    	/** @internal */
    	exports.emptyRecord = {};
    	// -------------------------------------------------------------------------------------
    	// Record
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	exports.has = Object.prototype.hasOwnProperty;
    	// -------------------------------------------------------------------------------------
    	// NonEmptyArray
    	// -------------------------------------------------------------------------------------
    	/** @internal */
    	var fromReadonlyNonEmptyArray = function (as) { return __spreadArray([as[0]], as.slice(1), true); };
    	exports.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray;
    	/** @internal */
    	var liftNullable = function (F) {
    	    return function (f, onNullable) {
    	        return function () {
    	            var a = [];
    	            for (var _i = 0; _i < arguments.length; _i++) {
    	                a[_i] = arguments[_i];
    	            }
    	            var o = f.apply(void 0, a);
    	            return F.fromEither(o == null ? (0, exports.left)(onNullable.apply(void 0, a)) : (0, exports.right)(o));
    	        };
    	    };
    	};
    	exports.liftNullable = liftNullable;
    	/** @internal */
    	var liftOption = function (F) {
    	    return function (f, onNone) {
    	        return function () {
    	            var a = [];
    	            for (var _i = 0; _i < arguments.length; _i++) {
    	                a[_i] = arguments[_i];
    	            }
    	            var o = f.apply(void 0, a);
    	            return F.fromEither((0, exports.isNone)(o) ? (0, exports.left)(onNone.apply(void 0, a)) : (0, exports.right)(o.value));
    	        };
    	    };
    	};
    	exports.liftOption = liftOption;
    	/** @internal */
    	var flatMapNullable = function (F, M) {
    	     return (0, function_1.dual)(3, function (self, f, onNullable) {
    	        return M.flatMap(self, (0, exports.liftNullable)(F)(f, onNullable));
    	    });
    	};
    	exports.flatMapNullable = flatMapNullable;
    	/** @internal */
    	var flatMapOption = function (F, M) {
    	     return (0, function_1.dual)(3, function (self, f, onNone) { return M.flatMap(self, (0, exports.liftOption)(F)(f, onNone)); });
    	};
    	exports.flatMapOption = flatMapOption;
    	/** @internal */
    	var flatMapEither = function (F, M) {
    	     return (0, function_1.dual)(2, function (self, f) {
    	        return M.flatMap(self, function (a) { return F.fromEither(f(a)); });
    	    });
    	};
    	exports.flatMapEither = flatMapEither;
    	/** @internal */
    	var flatMapIO = function (F, M) {
    	     return (0, function_1.dual)(2, function (self, f) {
    	        return M.flatMap(self, function (a) { return F.fromIO(f(a)); });
    	    });
    	};
    	exports.flatMapIO = flatMapIO;
    	/** @internal */
    	var flatMapTask = function (F, M) {
    	     return (0, function_1.dual)(2, function (self, f) {
    	        return M.flatMap(self, function (a) { return F.fromTask(f(a)); });
    	    });
    	};
    	exports.flatMapTask = flatMapTask;
    	/** @internal */
    	var flatMapReader = function (F, M) {
    	     return (0, function_1.dual)(2, function (self, f) {
    	        return M.flatMap(self, function (a) { return F.fromReader(f(a)); });
    	    });
    	};
    	exports.flatMapReader = flatMapReader; 
    } (internal));

    var __createBinding$2 = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault$2 = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar$2 = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$2(result, mod, k);
        __setModuleDefault$2(result, mod);
        return result;
    };
    Object.defineProperty(Apply, "__esModule", { value: true });
    Apply.sequenceS = Apply.sequenceT = Apply.getApplySemigroup = Apply.apS = Apply.apSecond = Apply.apFirst = Apply.ap = void 0;
    /**
     * The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
     *
     * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
     * `f`.
     *
     * Instances must satisfy the following law in addition to the `Functor` laws:
     *
     * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) <-> F.ap(fbc, F.ap(fab, fa))`
     *
     * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
     *
     * @example
     * import * as O from 'fp-ts/Option'
     * import { pipe } from 'fp-ts/function'
     *
     * const f = (a: string) => (b: number) => (c: boolean) => a + String(b) + String(c)
     * const fa: O.Option<string> = O.some('s')
     * const fb: O.Option<number> = O.some(1)
     * const fc: O.Option<boolean> = O.some(true)
     *
     * assert.deepStrictEqual(
     *   pipe(
     *     // lift a function
     *     O.some(f),
     *     // apply the first argument
     *     O.ap(fa),
     *     // apply the second argument
     *     O.ap(fb),
     *     // apply the third argument
     *     O.ap(fc)
     *   ),
     *   O.some('s1true')
     * )
     *
     * @since 2.0.0
     */
    var function_1$2 = _function;
    var _$3 = __importStar$2(internal);
    function ap(F, G) {
        return function (fa) {
            return function (fab) {
                return F.ap(F.map(fab, function (gab) { return function (ga) { return G.ap(gab, ga); }; }), fa);
            };
        };
    }
    Apply.ap = ap;
    function apFirst(A) {
        return function (second) { return function (first) {
            return A.ap(A.map(first, function (a) { return function () { return a; }; }), second);
        }; };
    }
    Apply.apFirst = apFirst;
    function apSecond(A) {
        return function (second) {
            return function (first) {
                return A.ap(A.map(first, function () { return function (b) { return b; }; }), second);
            };
        };
    }
    Apply.apSecond = apSecond;
    function apS(F) {
        return function (name, fb) {
            return function (fa) {
                return F.ap(F.map(fa, function (a) { return function (b) {
                    var _a;
                    return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
                }; }), fb);
            };
        };
    }
    Apply.apS = apS;
    function getApplySemigroup(F) {
        return function (S) { return ({
            concat: function (first, second) {
                return F.ap(F.map(first, function (x) { return function (y) { return S.concat(x, y); }; }), second);
            }
        }); };
    }
    Apply.getApplySemigroup = getApplySemigroup;
    function curried(f, n, acc) {
        return function (x) {
            var combined = Array(acc.length + 1);
            for (var i = 0; i < acc.length; i++) {
                combined[i] = acc[i];
            }
            combined[acc.length] = x;
            return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
        };
    }
    var tupleConstructors = {
        1: function (a) { return [a]; },
        2: function (a) { return function (b) { return [a, b]; }; },
        3: function (a) { return function (b) { return function (c) { return [a, b, c]; }; }; },
        4: function (a) { return function (b) { return function (c) { return function (d) { return [a, b, c, d]; }; }; }; },
        5: function (a) { return function (b) { return function (c) { return function (d) { return function (e) { return [a, b, c, d, e]; }; }; }; }; }
    };
    function getTupleConstructor(len) {
        if (!_$3.has.call(tupleConstructors, len)) {
            tupleConstructors[len] = curried(function_1$2.tuple, len - 1, []);
        }
        return tupleConstructors[len];
    }
    function sequenceT(F) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var len = args.length;
            var f = getTupleConstructor(len);
            var fas = F.map(args[0], f);
            for (var i = 1; i < len; i++) {
                fas = F.ap(fas, args[i]);
            }
            return fas;
        };
    }
    Apply.sequenceT = sequenceT;
    function getRecordConstructor(keys) {
        var len = keys.length;
        switch (len) {
            case 1:
                return function (a) {
                    var _a;
                    return (_a = {}, _a[keys[0]] = a, _a);
                };
            case 2:
                return function (a) { return function (b) {
                    var _a;
                    return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a);
                }; };
            case 3:
                return function (a) { return function (b) { return function (c) {
                    var _a;
                    return (_a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a);
                }; }; };
            case 4:
                return function (a) { return function (b) { return function (c) { return function (d) {
                    var _a;
                    return (_a = {},
                        _a[keys[0]] = a,
                        _a[keys[1]] = b,
                        _a[keys[2]] = c,
                        _a[keys[3]] = d,
                        _a);
                }; }; }; };
            case 5:
                return function (a) { return function (b) { return function (c) { return function (d) { return function (e) {
                    var _a;
                    return (_a = {},
                        _a[keys[0]] = a,
                        _a[keys[1]] = b,
                        _a[keys[2]] = c,
                        _a[keys[3]] = d,
                        _a[keys[4]] = e,
                        _a);
                }; }; }; }; };
            default:
                return curried(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var r = {};
                    for (var i = 0; i < len; i++) {
                        r[keys[i]] = args[i];
                    }
                    return r;
                }, len - 1, []);
        }
    }
    function sequenceS(F) {
        return function (r) {
            var keys = Object.keys(r);
            var len = keys.length;
            var f = getRecordConstructor(keys);
            var fr = F.map(r[keys[0]], f);
            for (var i = 1; i < len; i++) {
                fr = F.ap(fr, r[keys[i]]);
            }
            return fr;
        };
    }
    Apply.sequenceS = sequenceS;

    var Chain = {};

    Object.defineProperty(Chain, "__esModule", { value: true });
    Chain.bind = Chain.tap = Chain.chainFirst = void 0;
    function chainFirst(M) {
        var tapM = tap(M);
        return function (f) { return function (first) { return tapM(first, f); }; };
    }
    Chain.chainFirst = chainFirst;
    /** @internal */
    function tap(M) {
        return function (first, f) { return M.chain(first, function (a) { return M.map(f(a), function () { return a; }); }); };
    }
    Chain.tap = tap;
    function bind(M) {
        return function (name, f) { return function (ma) { return M.chain(ma, function (a) { return M.map(f(a), function (b) {
            var _a;
            return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
        }); }); }; };
    }
    Chain.bind = bind;

    var FromEither = {};

    /**
     * The `FromEither` type class represents those data types which support errors.
     *
     * @since 2.10.0
     */
    var __createBinding$1 = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault$1 = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar$1 = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$1(result, mod, k);
        __setModuleDefault$1(result, mod);
        return result;
    };
    Object.defineProperty(FromEither, "__esModule", { value: true });
    FromEither.tapEither = FromEither.filterOrElse = FromEither.chainFirstEitherK = FromEither.chainEitherK = FromEither.fromEitherK = FromEither.chainOptionK = FromEither.fromOptionK = FromEither.fromPredicate = FromEither.fromOption = void 0;
    var Chain_1 = Chain;
    var function_1$1 = _function;
    var _$2 = __importStar$1(internal);
    function fromOption(F) {
        return function (onNone) { return function (ma) { return F.fromEither(_$2.isNone(ma) ? _$2.left(onNone()) : _$2.right(ma.value)); }; };
    }
    FromEither.fromOption = fromOption;
    function fromPredicate(F) {
        return function (predicate, onFalse) {
            return function (a) {
                return F.fromEither(predicate(a) ? _$2.right(a) : _$2.left(onFalse(a)));
            };
        };
    }
    FromEither.fromPredicate = fromPredicate;
    function fromOptionK(F) {
        var fromOptionF = fromOption(F);
        return function (onNone) {
            var from = fromOptionF(onNone);
            return function (f) { return (0, function_1$1.flow)(f, from); };
        };
    }
    FromEither.fromOptionK = fromOptionK;
    function chainOptionK(F, M) {
        var fromOptionKF = fromOptionK(F);
        return function (onNone) {
            var from = fromOptionKF(onNone);
            return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
        };
    }
    FromEither.chainOptionK = chainOptionK;
    function fromEitherK(F) {
        return function (f) { return (0, function_1$1.flow)(f, F.fromEither); };
    }
    FromEither.fromEitherK = fromEitherK;
    function chainEitherK(F, M) {
        var fromEitherKF = fromEitherK(F);
        return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
    }
    FromEither.chainEitherK = chainEitherK;
    function chainFirstEitherK(F, M) {
        var tapEitherM = tapEither(F, M);
        return function (f) { return function (ma) { return tapEitherM(ma, f); }; };
    }
    FromEither.chainFirstEitherK = chainFirstEitherK;
    function filterOrElse(F, M) {
        return function (predicate, onFalse) {
            return function (ma) {
                return M.chain(ma, function (a) { return F.fromEither(predicate(a) ? _$2.right(a) : _$2.left(onFalse(a))); });
            };
        };
    }
    FromEither.filterOrElse = filterOrElse;
    /** @internal */
    function tapEither(F, M) {
        var fromEither = fromEitherK(F);
        var tapM = (0, Chain_1.tap)(M);
        return function (self, f) { return tapM(self, fromEither(f)); };
    }
    FromEither.tapEither = tapEither;

    var Functor = {};

    Object.defineProperty(Functor, "__esModule", { value: true });
    Functor.asUnit = Functor.as = Functor.getFunctorComposition = Functor.let = Functor.bindTo = Functor.flap = Functor.map = void 0;
    /**
     * A `Functor` is a type constructor which supports a mapping operation `map`.
     *
     * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
     * constructor `f` to represent some computational context.
     *
     * Instances must satisfy the following laws:
     *
     * 1. Identity: `F.map(fa, a => a) <-> fa`
     * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
     *
     * @since 2.0.0
     */
    var function_1 = _function;
    function map(F, G) {
        return function (f) { return function (fa) { return F.map(fa, function (ga) { return G.map(ga, f); }); }; };
    }
    Functor.map = map;
    function flap(F) {
        return function (a) { return function (fab) { return F.map(fab, function (f) { return f(a); }); }; };
    }
    Functor.flap = flap;
    function bindTo(F) {
        return function (name) { return function (fa) { return F.map(fa, function (a) {
            var _a;
            return (_a = {}, _a[name] = a, _a);
        }); }; };
    }
    Functor.bindTo = bindTo;
    function let_(F) {
        return function (name, f) { return function (fa) { return F.map(fa, function (a) {
            var _a;
            return Object.assign({}, a, (_a = {}, _a[name] = f(a), _a));
        }); }; };
    }
    Functor.let = let_;
    /** @deprecated */
    function getFunctorComposition(F, G) {
        var _map = map(F, G);
        return {
            map: function (fga, f) { return (0, function_1.pipe)(fga, _map(f)); }
        };
    }
    Functor.getFunctorComposition = getFunctorComposition;
    /** @internal */
    function as(F) {
        return function (self, b) { return F.map(self, function () { return b; }); };
    }
    Functor.as = as;
    /** @internal */
    function asUnit(F) {
        var asM = as(F);
        return function (self) { return asM(self, undefined); };
    }
    Functor.asUnit = asUnit;

    var NonEmptyArray = {};

    var Ord = {};

    var Eq = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.eqDate = exports.eqNumber = exports.eqString = exports.eqBoolean = exports.eq = exports.strictEqual = exports.getStructEq = exports.getTupleEq = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.eqStrict = exports.URI = exports.contramap = exports.tuple = exports.struct = exports.fromEquals = void 0;
    	var function_1 = _function;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	var fromEquals = function (equals) { return ({
    	    equals: function (x, y) { return x === y || equals(x, y); }
    	}); };
    	exports.fromEquals = fromEquals;
    	// -------------------------------------------------------------------------------------
    	// combinators
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.10.0
    	 */
    	var struct = function (eqs) {
    	    return (0, exports.fromEquals)(function (first, second) {
    	        for (var key in eqs) {
    	            if (!eqs[key].equals(first[key], second[key])) {
    	                return false;
    	            }
    	        }
    	        return true;
    	    });
    	};
    	exports.struct = struct;
    	/**
    	 * Given a tuple of `Eq`s returns a `Eq` for the tuple
    	 *
    	 * @example
    	 * import { tuple } from 'fp-ts/Eq'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 * import * as B from 'fp-ts/boolean'
    	 *
    	 * const E = tuple(S.Eq, N.Eq, B.Eq)
    	 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
    	 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
    	 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
    	 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
    	 *
    	 * @since 2.10.0
    	 */
    	var tuple = function () {
    	    var eqs = [];
    	    for (var _i = 0; _i < arguments.length; _i++) {
    	        eqs[_i] = arguments[_i];
    	    }
    	    return (0, exports.fromEquals)(function (first, second) { return eqs.every(function (E, i) { return E.equals(first[i], second[i]); }); });
    	};
    	exports.tuple = tuple;
    	/* istanbul ignore next */
    	var contramap_ = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.contramap)(f)); };
    	/**
    	 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Eq<User>`.
    	 *
    	 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
    	 * for equality (meaning we have an `Eq<X>`)
    	 *
    	 * For example, given the following `User` type, we want to construct an `Eq<User>` that just looks at the `key` field
    	 * for each user (since it's known to be unique).
    	 *
    	 * If we have a way of comparing `UUID`s for equality (`eqUUID: Eq<UUID>`) and we know how to go from `User -> UUID`,
    	 * using `contramap` we can do this
    	 *
    	 * @example
    	 * import { contramap, Eq } from 'fp-ts/Eq'
    	 * import { pipe } from 'fp-ts/function'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * type UUID = string
    	 *
    	 * interface User {
    	 *   readonly key: UUID
    	 *   readonly firstName: string
    	 *   readonly lastName: string
    	 * }
    	 *
    	 * const eqUUID: Eq<UUID> = S.Eq
    	 *
    	 * const eqUserByKey: Eq<User> = pipe(
    	 *   eqUUID,
    	 *   contramap((user) => user.key)
    	 * )
    	 *
    	 * assert.deepStrictEqual(
    	 *   eqUserByKey.equals(
    	 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
    	 *     { key: 'k2', firstName: 'a1', lastName: 'b1' }
    	 *   ),
    	 *   false
    	 * )
    	 * assert.deepStrictEqual(
    	 *   eqUserByKey.equals(
    	 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
    	 *     { key: 'k1', firstName: 'a2', lastName: 'b1' }
    	 *   ),
    	 *   true
    	 * )
    	 *
    	 * @since 2.0.0
    	 */
    	var contramap = function (f) { return function (fa) {
    	    return (0, exports.fromEquals)(function (x, y) { return fa.equals(f(x), f(y)); });
    	}; };
    	exports.contramap = contramap;
    	/**
    	 * @category type lambdas
    	 * @since 2.0.0
    	 */
    	exports.URI = 'Eq';
    	/**
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	exports.eqStrict = {
    	    equals: function (a, b) { return a === b; }
    	};
    	var empty = {
    	    equals: function () { return true; }
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: function (x, y) { return (0, exports.fromEquals)(function (a, b) { return x.equals(a, b) && y.equals(a, b); }); }
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * @category instances
    	 * @since 2.6.0
    	 */
    	var getMonoid = function () { return ({
    	    concat: (0, exports.getSemigroup)().concat,
    	    empty: empty
    	}); };
    	exports.getMonoid = getMonoid;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Contravariant = {
    	    URI: exports.URI,
    	    contramap: contramap_
    	};
    	// -------------------------------------------------------------------------------------
    	// deprecated
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Use [`tuple`](#tuple) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getTupleEq = exports.tuple;
    	/**
    	 * Use [`struct`](#struct) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getStructEq = exports.struct;
    	/**
    	 * Use [`eqStrict`](#eqstrict) instead
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.strictEqual = exports.eqStrict.equals;
    	/**
    	 * This instance is deprecated, use small, specific instances instead.
    	 * For example if a function needs a `Contravariant` instance, pass `E.Contravariant` instead of `E.eq`
    	 * (where `E` is from `import E from 'fp-ts/Eq'`)
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.eq = exports.Contravariant;
    	/**
    	 * Use [`Eq`](./boolean.ts.html#eq) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.eqBoolean = exports.eqStrict;
    	/**
    	 * Use [`Eq`](./string.ts.html#eq) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.eqString = exports.eqStrict;
    	/**
    	 * Use [`Eq`](./number.ts.html#eq) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.eqNumber = exports.eqStrict;
    	/**
    	 * Use [`Eq`](./Date.ts.html#eq) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.eqDate = {
    	    equals: function (first, second) { return first.valueOf() === second.valueOf(); }
    	}; 
    } (Eq));

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.ordDate = exports.ordNumber = exports.ordString = exports.ordBoolean = exports.ord = exports.getDualOrd = exports.getTupleOrd = exports.between = exports.clamp = exports.max = exports.min = exports.geq = exports.leq = exports.gt = exports.lt = exports.equals = exports.trivial = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.URI = exports.contramap = exports.reverse = exports.tuple = exports.fromCompare = exports.equalsDefault = void 0;
    	var Eq_1 = Eq;
    	var function_1 = _function;
    	// -------------------------------------------------------------------------------------
    	// defaults
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category defaults
    	 * @since 2.10.0
    	 */
    	var equalsDefault = function (compare) {
    	    return function (first, second) {
    	        return first === second || compare(first, second) === 0;
    	    };
    	};
    	exports.equalsDefault = equalsDefault;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	var fromCompare = function (compare) { return ({
    	    equals: (0, exports.equalsDefault)(compare),
    	    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
    	}); };
    	exports.fromCompare = fromCompare;
    	// -------------------------------------------------------------------------------------
    	// combinators
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
    	 *
    	 * @example
    	 * import { tuple } from 'fp-ts/Ord'
    	 * import * as B from 'fp-ts/boolean'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * const O = tuple(S.Ord, N.Ord, B.Ord)
    	 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
    	 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
    	 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
    	 *
    	 * @since 2.10.0
    	 */
    	var tuple = function () {
    	    var ords = [];
    	    for (var _i = 0; _i < arguments.length; _i++) {
    	        ords[_i] = arguments[_i];
    	    }
    	    return (0, exports.fromCompare)(function (first, second) {
    	        var i = 0;
    	        for (; i < ords.length - 1; i++) {
    	            var r = ords[i].compare(first[i], second[i]);
    	            if (r !== 0) {
    	                return r;
    	            }
    	        }
    	        return ords[i].compare(first[i], second[i]);
    	    });
    	};
    	exports.tuple = tuple;
    	/**
    	 * @since 2.10.0
    	 */
    	var reverse = function (O) { return (0, exports.fromCompare)(function (first, second) { return O.compare(second, first); }); };
    	exports.reverse = reverse;
    	/* istanbul ignore next */
    	var contramap_ = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.contramap)(f)); };
    	/**
    	 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Ord<User>`.
    	 *
    	 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
    	 * for ordering (meaning we have an `Ord<X>`)
    	 *
    	 * For example, given the following `User` type, there are lots of possible choices for `X`,
    	 * but let's say we want to sort a list of users by `lastName`.
    	 *
    	 * If we have a way of comparing `lastName`s for ordering (`ordLastName: Ord<string>`) and we know how to go from `User -> string`,
    	 * using `contramap` we can do this
    	 *
    	 * @example
    	 * import { pipe } from 'fp-ts/function'
    	 * import { contramap, Ord } from 'fp-ts/Ord'
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * interface User {
    	 *   readonly firstName: string
    	 *   readonly lastName: string
    	 * }
    	 *
    	 * const ordLastName: Ord<string> = S.Ord
    	 *
    	 * const ordByLastName: Ord<User> = pipe(
    	 *   ordLastName,
    	 *   contramap((user) => user.lastName)
    	 * )
    	 *
    	 * assert.deepStrictEqual(
    	 *   RA.sort(ordByLastName)([
    	 *     { firstName: 'a', lastName: 'd' },
    	 *     { firstName: 'c', lastName: 'b' }
    	 *   ]),
    	 *   [
    	 *     { firstName: 'c', lastName: 'b' },
    	 *     { firstName: 'a', lastName: 'd' }
    	 *   ]
    	 * )
    	 *
    	 * @since 2.0.0
    	 */
    	var contramap = function (f) { return function (fa) {
    	    return (0, exports.fromCompare)(function (first, second) { return fa.compare(f(first), f(second)); });
    	}; };
    	exports.contramap = contramap;
    	/**
    	 * @category type lambdas
    	 * @since 2.0.0
    	 */
    	exports.URI = 'Ord';
    	/**
    	 * A typical use case for the `Semigroup` instance of `Ord` is merging two or more orderings.
    	 *
    	 * For example the following snippet builds an `Ord` for a type `User` which
    	 * sorts by `created` date descending, and **then** `lastName`
    	 *
    	 * @example
    	 * import * as D from 'fp-ts/Date'
    	 * import { pipe } from 'fp-ts/function'
    	 * import { contramap, getSemigroup, Ord, reverse } from 'fp-ts/Ord'
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * interface User {
    	 *   readonly id: string
    	 *   readonly lastName: string
    	 *   readonly created: Date
    	 * }
    	 *
    	 * const ordByLastName: Ord<User> = pipe(
    	 *   S.Ord,
    	 *   contramap((user) => user.lastName)
    	 * )
    	 *
    	 * const ordByCreated: Ord<User> = pipe(
    	 *   D.Ord,
    	 *   contramap((user) => user.created)
    	 * )
    	 *
    	 * const ordUserByCreatedDescThenLastName = getSemigroup<User>().concat(
    	 *   reverse(ordByCreated),
    	 *   ordByLastName
    	 * )
    	 *
    	 * assert.deepStrictEqual(
    	 *   RA.sort(ordUserByCreatedDescThenLastName)([
    	 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) },
    	 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
    	 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) }
    	 *   ]),
    	 *   [
    	 *     { id: 'e', lastName: 'f', created: new Date(1980, 10, 30) },
    	 *     { id: 'a', lastName: 'b', created: new Date(1973, 10, 30) },
    	 *     { id: 'c', lastName: 'd', created: new Date(1973, 10, 30) }
    	 *   ]
    	 * )
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: function (first, second) {
    	        return (0, exports.fromCompare)(function (a, b) {
    	            var ox = first.compare(a, b);
    	            return ox !== 0 ? ox : second.compare(a, b);
    	        });
    	    }
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * Returns a `Monoid` such that:
    	 *
    	 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
    	 * - its `empty` value is an `Ord` that always considers compared elements equal
    	 *
    	 * @example
    	 * import { sort } from 'fp-ts/Array'
    	 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
    	 * import * as S from 'fp-ts/string'
    	 * import * as B from 'fp-ts/boolean'
    	 * import { pipe } from 'fp-ts/function'
    	 * import { concatAll } from 'fp-ts/Monoid'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * interface User {
    	 *   readonly id: number
    	 *   readonly name: string
    	 *   readonly age: number
    	 *   readonly rememberMe: boolean
    	 * }
    	 *
    	 * const byName = pipe(
    	 *   S.Ord,
    	 *   contramap((p: User) => p.name)
    	 * )
    	 *
    	 * const byAge = pipe(
    	 *   N.Ord,
    	 *   contramap((p: User) => p.age)
    	 * )
    	 *
    	 * const byRememberMe = pipe(
    	 *   B.Ord,
    	 *   contramap((p: User) => p.rememberMe)
    	 * )
    	 *
    	 * const M = getMonoid<User>()
    	 *
    	 * const users: Array<User> = [
    	 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
    	 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
    	 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
    	 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
    	 * ]
    	 *
    	 * // sort by name, then by age, then by `rememberMe`
    	 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
    	 * assert.deepStrictEqual(sort(O1)(users), [
    	 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
    	 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
    	 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
    	 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
    	 * ])
    	 *
    	 * // now `rememberMe = true` first, then by name, then by age
    	 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
    	 * assert.deepStrictEqual(sort(O2)(users), [
    	 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
    	 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
    	 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
    	 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
    	 * ])
    	 *
    	 * @category instances
    	 * @since 2.4.0
    	 */
    	var getMonoid = function () { return ({
    	    concat: (0, exports.getSemigroup)().concat,
    	    empty: (0, exports.fromCompare)(function () { return 0; })
    	}); };
    	exports.getMonoid = getMonoid;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Contravariant = {
    	    URI: exports.URI,
    	    contramap: contramap_
    	};
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.11.0
    	 */
    	exports.trivial = {
    	    equals: function_1.constTrue,
    	    compare: /*#__PURE__*/ (0, function_1.constant)(0)
    	};
    	/**
    	 * @since 2.11.0
    	 */
    	var equals = function (O) {
    	    return function (second) {
    	        return function (first) {
    	            return first === second || O.compare(first, second) === 0;
    	        };
    	    };
    	};
    	exports.equals = equals;
    	// TODO: curry in v3
    	/**
    	 * Test whether one value is _strictly less than_ another
    	 *
    	 * @since 2.0.0
    	 */
    	var lt = function (O) {
    	    return function (first, second) {
    	        return O.compare(first, second) === -1;
    	    };
    	};
    	exports.lt = lt;
    	// TODO: curry in v3
    	/**
    	 * Test whether one value is _strictly greater than_ another
    	 *
    	 * @since 2.0.0
    	 */
    	var gt = function (O) {
    	    return function (first, second) {
    	        return O.compare(first, second) === 1;
    	    };
    	};
    	exports.gt = gt;
    	// TODO: curry in v3
    	/**
    	 * Test whether one value is _non-strictly less than_ another
    	 *
    	 * @since 2.0.0
    	 */
    	var leq = function (O) {
    	    return function (first, second) {
    	        return O.compare(first, second) !== 1;
    	    };
    	};
    	exports.leq = leq;
    	// TODO: curry in v3
    	/**
    	 * Test whether one value is _non-strictly greater than_ another
    	 *
    	 * @since 2.0.0
    	 */
    	var geq = function (O) {
    	    return function (first, second) {
    	        return O.compare(first, second) !== -1;
    	    };
    	};
    	exports.geq = geq;
    	// TODO: curry in v3
    	/**
    	 * Take the minimum of two values. If they are considered equal, the first argument is chosen
    	 *
    	 * @since 2.0.0
    	 */
    	var min = function (O) {
    	    return function (first, second) {
    	        return first === second || O.compare(first, second) < 1 ? first : second;
    	    };
    	};
    	exports.min = min;
    	// TODO: curry in v3
    	/**
    	 * Take the maximum of two values. If they are considered equal, the first argument is chosen
    	 *
    	 * @since 2.0.0
    	 */
    	var max = function (O) {
    	    return function (first, second) {
    	        return first === second || O.compare(first, second) > -1 ? first : second;
    	    };
    	};
    	exports.max = max;
    	/**
    	 * Clamp a value between a minimum and a maximum
    	 *
    	 * @since 2.0.0
    	 */
    	var clamp = function (O) {
    	    var minO = (0, exports.min)(O);
    	    var maxO = (0, exports.max)(O);
    	    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
    	};
    	exports.clamp = clamp;
    	/**
    	 * Test whether a value is between a minimum and a maximum (inclusive)
    	 *
    	 * @since 2.0.0
    	 */
    	var between = function (O) {
    	    var ltO = (0, exports.lt)(O);
    	    var gtO = (0, exports.gt)(O);
    	    return function (low, hi) { return function (a) { return ltO(a, low) || gtO(a, hi) ? false : true; }; };
    	};
    	exports.between = between;
    	// -------------------------------------------------------------------------------------
    	// deprecated
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Use [`tuple`](#tuple) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getTupleOrd = exports.tuple;
    	/**
    	 * Use [`reverse`](#reverse) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getDualOrd = exports.reverse;
    	/**
    	 * Use [`Contravariant`](#contravariant) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.ord = exports.Contravariant;
    	// default compare for primitive types
    	function compare(first, second) {
    	    return first < second ? -1 : first > second ? 1 : 0;
    	}
    	var strictOrd = {
    	    equals: Eq_1.eqStrict.equals,
    	    compare: compare
    	};
    	/**
    	 * Use [`Ord`](./boolean.ts.html#ord) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.ordBoolean = strictOrd;
    	/**
    	 * Use [`Ord`](./string.ts.html#ord) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.ordString = strictOrd;
    	/**
    	 * Use [`Ord`](./number.ts.html#ord) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.ordNumber = strictOrd;
    	/**
    	 * Use [`Ord`](./Date.ts.html#ord) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.ordDate = (0, function_1.pipe)(exports.ordNumber, 
    	/*#__PURE__*/
    	(0, exports.contramap)(function (date) { return date.valueOf(); })); 
    } (Ord));

    var ReadonlyNonEmptyArray = {};

    var Semigroup = {};

    var Magma = {};

    /**
     * A `Magma` is a pair `(A, concat)` in which `A` is a non-empty set and `concat` is a binary operation on `A`
     *
     * See [Semigroup](https://gcanti.github.io/fp-ts/modules/Semigroup.ts.html) for some instances.
     *
     * @since 2.0.0
     */
    Object.defineProperty(Magma, "__esModule", { value: true });
    Magma.concatAll = Magma.endo = Magma.filterSecond = Magma.filterFirst = Magma.reverse = void 0;
    // -------------------------------------------------------------------------------------
    // combinators
    // -------------------------------------------------------------------------------------
    /**
     * The dual of a `Magma`, obtained by swapping the arguments of `concat`.
     *
     * @example
     * import { reverse, concatAll } from 'fp-ts/Magma'
     * import * as N from 'fp-ts/number'
     *
     * const subAll = concatAll(reverse(N.MagmaSub))(0)
     *
     * assert.deepStrictEqual(subAll([1, 2, 3]), 2)
     *
     * @since 2.11.0
     */
    var reverse = function (M) { return ({
        concat: function (first, second) { return M.concat(second, first); }
    }); };
    Magma.reverse = reverse;
    /**
     * @since 2.11.0
     */
    var filterFirst = function (predicate) {
        return function (M) { return ({
            concat: function (first, second) { return (predicate(first) ? M.concat(first, second) : second); }
        }); };
    };
    Magma.filterFirst = filterFirst;
    /**
     * @since 2.11.0
     */
    var filterSecond = function (predicate) {
        return function (M) { return ({
            concat: function (first, second) { return (predicate(second) ? M.concat(first, second) : first); }
        }); };
    };
    Magma.filterSecond = filterSecond;
    /**
     * @since 2.11.0
     */
    var endo = function (f) {
        return function (M) { return ({
            concat: function (first, second) { return M.concat(f(first), f(second)); }
        }); };
    };
    Magma.endo = endo;
    // -------------------------------------------------------------------------------------
    // utils
    // -------------------------------------------------------------------------------------
    /**
     * Given a sequence of `as`, concat them and return the total.
     *
     * If `as` is empty, return the provided `startWith` value.
     *
     * @example
     * import { concatAll } from 'fp-ts/Magma'
     * import * as N from 'fp-ts/number'
     *
     * const subAll = concatAll(N.MagmaSub)(0)
     *
     * assert.deepStrictEqual(subAll([1, 2, 3]), -6)
     *
     * @since 2.11.0
     */
    var concatAll = function (M) {
        return function (startWith) {
            return function (as) {
                return as.reduce(function (a, acc) { return M.concat(a, acc); }, startWith);
            };
        };
    };
    Magma.concatAll = concatAll;

    (function (exports) {
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    var desc = Object.getOwnPropertyDescriptor(m, k);
    	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    	      desc = { enumerable: true, get: function() { return m[k]; } };
    	    }
    	    Object.defineProperty(o, k2, desc);
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.semigroupProduct = exports.semigroupSum = exports.semigroupString = exports.getFunctionSemigroup = exports.semigroupAny = exports.semigroupAll = exports.fold = exports.getIntercalateSemigroup = exports.getMeetSemigroup = exports.getJoinSemigroup = exports.getDualSemigroup = exports.getStructSemigroup = exports.getTupleSemigroup = exports.getFirstSemigroup = exports.getLastSemigroup = exports.getObjectSemigroup = exports.semigroupVoid = exports.concatAll = exports.last = exports.first = exports.intercalate = exports.tuple = exports.struct = exports.reverse = exports.constant = exports.max = exports.min = void 0;
    	/**
    	 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
    	 *
    	 * ```ts
    	 * interface Semigroup<A> {
    	 *   readonly concat: (x: A, y: A) => A
    	 * }
    	 * ```
    	 *
    	 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
    	 *
    	 * ```ts
    	 * concat(x, concat(y, z)) = concat(concat(x, y), z)
    	 * ```
    	 *
    	 * A common example of a semigroup is the type `string` with the operation `+`.
    	 *
    	 * ```ts
    	 * import { Semigroup } from 'fp-ts/Semigroup'
    	 *
    	 * const semigroupString: Semigroup<string> = {
    	 *   concat: (x, y) => x + y
    	 * }
    	 *
    	 * const x = 'x'
    	 * const y = 'y'
    	 * const z = 'z'
    	 *
    	 * semigroupString.concat(x, y) // 'xy'
    	 *
    	 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
    	 *
    	 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
    	 * ```
    	 *
    	 * *Adapted from https://typelevel.org/cats*
    	 *
    	 * @since 2.0.0
    	 */
    	var function_1 = _function;
    	var _ = __importStar(internal);
    	var M = __importStar(Magma);
    	var Or = __importStar(Ord);
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Get a semigroup where `concat` will return the minimum, based on the provided order.
    	 *
    	 * @example
    	 * import * as N from 'fp-ts/number'
    	 * import * as S from 'fp-ts/Semigroup'
    	 *
    	 * const S1 = S.min(N.Ord)
    	 *
    	 * assert.deepStrictEqual(S1.concat(1, 2), 1)
    	 *
    	 * @category constructors
    	 * @since 2.10.0
    	 */
    	var min = function (O) { return ({
    	    concat: Or.min(O)
    	}); };
    	exports.min = min;
    	/**
    	 * Get a semigroup where `concat` will return the maximum, based on the provided order.
    	 *
    	 * @example
    	 * import * as N from 'fp-ts/number'
    	 * import * as S from 'fp-ts/Semigroup'
    	 *
    	 * const S1 = S.max(N.Ord)
    	 *
    	 * assert.deepStrictEqual(S1.concat(1, 2), 2)
    	 *
    	 * @category constructors
    	 * @since 2.10.0
    	 */
    	var max = function (O) { return ({
    	    concat: Or.max(O)
    	}); };
    	exports.max = max;
    	/**
    	 * @category constructors
    	 * @since 2.10.0
    	 */
    	var constant = function (a) { return ({
    	    concat: function () { return a; }
    	}); };
    	exports.constant = constant;
    	// -------------------------------------------------------------------------------------
    	// combinators
    	// -------------------------------------------------------------------------------------
    	/**
    	 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
    	 *
    	 * @example
    	 * import { reverse } from 'fp-ts/Semigroup'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * assert.deepStrictEqual(reverse(S.Semigroup).concat('a', 'b'), 'ba')
    	 *
    	 * @since 2.10.0
    	 */
    	exports.reverse = M.reverse;
    	/**
    	 * Given a struct of semigroups returns a semigroup for the struct.
    	 *
    	 * @example
    	 * import { struct } from 'fp-ts/Semigroup'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * interface Point {
    	 *   readonly x: number
    	 *   readonly y: number
    	 * }
    	 *
    	 * const S = struct<Point>({
    	 *   x: N.SemigroupSum,
    	 *   y: N.SemigroupSum
    	 * })
    	 *
    	 * assert.deepStrictEqual(S.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
    	 *
    	 * @since 2.10.0
    	 */
    	var struct = function (semigroups) { return ({
    	    concat: function (first, second) {
    	        var r = {};
    	        for (var k in semigroups) {
    	            if (_.has.call(semigroups, k)) {
    	                r[k] = semigroups[k].concat(first[k], second[k]);
    	            }
    	        }
    	        return r;
    	    }
    	}); };
    	exports.struct = struct;
    	/**
    	 * Given a tuple of semigroups returns a semigroup for the tuple.
    	 *
    	 * @example
    	 * import { tuple } from 'fp-ts/Semigroup'
    	 * import * as B from 'fp-ts/boolean'
    	 * import * as N from 'fp-ts/number'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * const S1 = tuple(S.Semigroup, N.SemigroupSum)
    	 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
    	 *
    	 * const S2 = tuple(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
    	 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
    	 *
    	 * @since 2.10.0
    	 */
    	var tuple = function () {
    	    var semigroups = [];
    	    for (var _i = 0; _i < arguments.length; _i++) {
    	        semigroups[_i] = arguments[_i];
    	    }
    	    return ({
    	        concat: function (first, second) { return semigroups.map(function (s, i) { return s.concat(first[i], second[i]); }); }
    	    });
    	};
    	exports.tuple = tuple;
    	/**
    	 * Between each pair of elements insert `middle`.
    	 *
    	 * @example
    	 * import { intercalate } from 'fp-ts/Semigroup'
    	 * import * as S from 'fp-ts/string'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const S1 = pipe(S.Semigroup, intercalate(' + '))
    	 *
    	 * assert.strictEqual(S1.concat('a', 'b'), 'a + b')
    	 *
    	 * @since 2.10.0
    	 */
    	var intercalate = function (middle) {
    	    return function (S) { return ({
    	        concat: function (x, y) { return S.concat(x, S.concat(middle, y)); }
    	    }); };
    	};
    	exports.intercalate = intercalate;
    	// -------------------------------------------------------------------------------------
    	// instances
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Always return the first argument.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/Semigroup'
    	 *
    	 * assert.deepStrictEqual(S.first<number>().concat(1, 2), 1)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var first = function () { return ({ concat: function_1.identity }); };
    	exports.first = first;
    	/**
    	 * Always return the last argument.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/Semigroup'
    	 *
    	 * assert.deepStrictEqual(S.last<number>().concat(1, 2), 2)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var last = function () { return ({ concat: function (_, y) { return y; } }); };
    	exports.last = last;
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Given a sequence of `as`, concat them and return the total.
    	 *
    	 * If `as` is empty, return the provided `startWith` value.
    	 *
    	 * @example
    	 * import { concatAll } from 'fp-ts/Semigroup'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * const sum = concatAll(N.SemigroupSum)(0)
    	 *
    	 * assert.deepStrictEqual(sum([1, 2, 3]), 6)
    	 * assert.deepStrictEqual(sum([]), 0)
    	 *
    	 * @since 2.10.0
    	 */
    	exports.concatAll = M.concatAll;
    	// -------------------------------------------------------------------------------------
    	// deprecated
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Use `void` module instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupVoid = (0, exports.constant)(undefined);
    	/**
    	 * Use [`getAssignSemigroup`](./struct.ts.html#getAssignSemigroup) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	var getObjectSemigroup = function () { return ({
    	    concat: function (first, second) { return Object.assign({}, first, second); }
    	}); };
    	exports.getObjectSemigroup = getObjectSemigroup;
    	/**
    	 * Use [`last`](#last) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getLastSemigroup = exports.last;
    	/**
    	 * Use [`first`](#first) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getFirstSemigroup = exports.first;
    	/**
    	 * Use [`tuple`](#tuple) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getTupleSemigroup = exports.tuple;
    	/**
    	 * Use [`struct`](#struct) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getStructSemigroup = exports.struct;
    	/**
    	 * Use [`reverse`](#reverse) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getDualSemigroup = exports.reverse;
    	/**
    	 * Use [`max`](#max) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getJoinSemigroup = exports.max;
    	/**
    	 * Use [`min`](#min) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getMeetSemigroup = exports.min;
    	/**
    	 * Use [`intercalate`](#intercalate) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.getIntercalateSemigroup = exports.intercalate;
    	function fold(S) {
    	    var concatAllS = (0, exports.concatAll)(S);
    	    return function (startWith, as) { return (as === undefined ? concatAllS(startWith) : concatAllS(startWith)(as)); };
    	}
    	exports.fold = fold;
    	/**
    	 * Use [`SemigroupAll`](./boolean.ts.html#SemigroupAll) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupAll = {
    	    concat: function (x, y) { return x && y; }
    	};
    	/**
    	 * Use [`SemigroupAny`](./boolean.ts.html#SemigroupAny) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupAny = {
    	    concat: function (x, y) { return x || y; }
    	};
    	/**
    	 * Use [`getSemigroup`](./function.ts.html#getSemigroup) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.getFunctionSemigroup = function_1.getSemigroup;
    	/**
    	 * Use [`Semigroup`](./string.ts.html#Semigroup) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupString = {
    	    concat: function (x, y) { return x + y; }
    	};
    	/**
    	 * Use [`SemigroupSum`](./number.ts.html#SemigroupSum) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupSum = {
    	    concat: function (x, y) { return x + y; }
    	};
    	/**
    	 * Use [`SemigroupProduct`](./number.ts.html#SemigroupProduct) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.semigroupProduct = {
    	    concat: function (x, y) { return x * y; }
    	}; 
    } (Semigroup));

    (function (exports) {
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    var desc = Object.getOwnPropertyDescriptor(m, k);
    	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    	      desc = { enumerable: true, get: function() { return m[k]; } };
    	    }
    	    Object.defineProperty(o, k2, desc);
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    	        if (ar || !(i in from)) {
    	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
    	            ar[i] = from[i];
    	        }
    	    }
    	    return to.concat(ar || Array.prototype.slice.call(from));
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.reduceRight = exports.foldMap = exports.reduce = exports.mapWithIndex = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.flatMap = exports.ap = exports.alt = exports.altW = exports.of = exports.chunksOf = exports.splitAt = exports.chop = exports.chainWithIndex = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = exports.modifyAt = exports.updateAt = exports.sort = exports.groupBy = exports.group = exports.reverse = exports.concat = exports.concatW = exports.fromArray = exports.unappend = exports.unprepend = exports.range = exports.replicate = exports.makeBy = exports.fromReadonlyArray = exports.rotate = exports.union = exports.sortBy = exports.uniq = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.append = exports.appendW = exports.prepend = exports.prependW = exports.isOutOfBound = exports.isNonEmpty = exports.empty = void 0;
    	exports.groupSort = exports.chain = exports.intercalate = exports.updateLast = exports.modifyLast = exports.updateHead = exports.modifyHead = exports.matchRight = exports.matchLeft = exports.concatAll = exports.max = exports.min = exports.init = exports.last = exports.tail = exports.head = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.Comonad = exports.Alt = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getUnionSemigroup = exports.getEq = exports.getSemigroup = exports.getShow = exports.URI = exports.extract = exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = void 0;
    	exports.readonlyNonEmptyArray = exports.fold = exports.prependToAll = exports.insertAt = exports.snoc = exports.cons = exports.unsnoc = exports.uncons = exports.filterWithIndex = exports.filter = void 0;
    	var Apply_1 = Apply;
    	var Chain_1 = Chain;
    	var Eq_1 = Eq;
    	var function_1 = _function;
    	var Functor_1 = Functor;
    	var _ = __importStar(internal);
    	var Ord_1 = Ord;
    	var Se = __importStar(Semigroup);
    	// -------------------------------------------------------------------------------------
    	// internal
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @internal
    	 */
    	exports.empty = _.emptyReadonlyArray;
    	/**
    	 * @internal
    	 */
    	exports.isNonEmpty = _.isNonEmpty;
    	/**
    	 * @internal
    	 */
    	var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
    	exports.isOutOfBound = isOutOfBound;
    	/**
    	 * @internal
    	 */
    	var prependW = function (head) {
    	    return function (tail) {
    	        return __spreadArray([head], tail, true);
    	    };
    	};
    	exports.prependW = prependW;
    	/**
    	 * @internal
    	 */
    	exports.prepend = exports.prependW;
    	/**
    	 * @internal
    	 */
    	var appendW = function (end) {
    	    return function (init) {
    	        return __spreadArray(__spreadArray([], init, true), [end], false);
    	    };
    	};
    	exports.appendW = appendW;
    	/**
    	 * @internal
    	 */
    	exports.append = exports.appendW;
    	/**
    	 * @internal
    	 */
    	var unsafeInsertAt = function (i, a, as) {
    	    if ((0, exports.isNonEmpty)(as)) {
    	        var xs = _.fromReadonlyNonEmptyArray(as);
    	        xs.splice(i, 0, a);
    	        return xs;
    	    }
    	    return [a];
    	};
    	exports.unsafeInsertAt = unsafeInsertAt;
    	/**
    	 * @internal
    	 */
    	var unsafeUpdateAt = function (i, a, as) {
    	    if (as[i] === a) {
    	        return as;
    	    }
    	    else {
    	        var xs = _.fromReadonlyNonEmptyArray(as);
    	        xs[i] = a;
    	        return xs;
    	    }
    	};
    	exports.unsafeUpdateAt = unsafeUpdateAt;
    	/**
    	 * Remove duplicates from a `ReadonlyNonEmptyArray`, keeping the first occurrence of an element.
    	 *
    	 * @example
    	 * import { uniq } from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
    	 *
    	 * @since 2.11.0
    	 */
    	var uniq = function (E) {
    	    return function (as) {
    	        if (as.length === 1) {
    	            return as;
    	        }
    	        var out = [(0, exports.head)(as)];
    	        var rest = (0, exports.tail)(as);
    	        var _loop_1 = function (a) {
    	            if (out.every(function (o) { return !E.equals(o, a); })) {
    	                out.push(a);
    	            }
    	        };
    	        for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
    	            var a = rest_1[_i];
    	            _loop_1(a);
    	        }
    	        return out;
    	    };
    	};
    	exports.uniq = uniq;
    	/**
    	 * Sort the elements of a `ReadonlyNonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
    	 * etc...
    	 *
    	 * @example
    	 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { contramap } from 'fp-ts/Ord'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * interface Person {
    	 *   name: string
    	 *   age: number
    	 * }
    	 *
    	 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
    	 *
    	 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
    	 *
    	 * const sortByNameByAge = RNEA.sortBy([byName, byAge])
    	 *
    	 * const persons: RNEA.ReadonlyNonEmptyArray<Person> = [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 },
    	 *   { name: 'b', age: 2 }
    	 * ]
    	 *
    	 * assert.deepStrictEqual(sortByNameByAge(persons), [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 2 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 }
    	 * ])
    	 *
    	 * @since 2.11.0
    	 */
    	var sortBy = function (ords) {
    	    if ((0, exports.isNonEmpty)(ords)) {
    	        var M = (0, Ord_1.getMonoid)();
    	        return (0, exports.sort)(ords.reduce(M.concat, M.empty));
    	    }
    	    return function_1.identity;
    	};
    	exports.sortBy = sortBy;
    	/**
    	 * @since 2.11.0
    	 */
    	var union = function (E) {
    	    var uniqE = (0, exports.uniq)(E);
    	    return function (second) { return function (first) { return uniqE((0, function_1.pipe)(first, concat(second))); }; };
    	};
    	exports.union = union;
    	/**
    	 * Rotate a `ReadonlyNonEmptyArray` by `n` steps.
    	 *
    	 * @example
    	 * import { rotate } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    	 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
    	 *
    	 * @since 2.11.0
    	 */
    	var rotate = function (n) {
    	    return function (as) {
    	        var len = as.length;
    	        var m = Math.round(n) % len;
    	        if ((0, exports.isOutOfBound)(Math.abs(m), as) || m === 0) {
    	            return as;
    	        }
    	        if (m < 0) {
    	            var _a = (0, exports.splitAt)(-m)(as), f = _a[0], s = _a[1];
    	            return (0, function_1.pipe)(s, concat(f));
    	        }
    	        else {
    	            return (0, exports.rotate)(m - len)(as);
    	        }
    	    };
    	};
    	exports.rotate = rotate;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Return a `ReadonlyNonEmptyArray` from a `ReadonlyArray` returning `none` if the input is empty.
    	 *
    	 * @category conversions
    	 * @since 2.5.0
    	 */
    	var fromReadonlyArray = function (as) {
    	    return (0, exports.isNonEmpty)(as) ? _.some(as) : _.none;
    	};
    	exports.fromReadonlyArray = fromReadonlyArray;
    	/**
    	 * Return a `ReadonlyNonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
    	 *
    	 * **Note**. `n` is normalized to a natural number.
    	 *
    	 * @example
    	 * import { makeBy } from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const double = (n: number): number => n * 2
    	 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var makeBy = function (f) {
    	    return function (n) {
    	        var j = Math.max(0, Math.floor(n));
    	        var out = [f(0)];
    	        for (var i = 1; i < j; i++) {
    	            out.push(f(i));
    	        }
    	        return out;
    	    };
    	};
    	exports.makeBy = makeBy;
    	/**
    	 * Create a `ReadonlyNonEmptyArray` containing a value repeated the specified number of times.
    	 *
    	 * **Note**. `n` is normalized to a natural number.
    	 *
    	 * @example
    	 * import { replicate } from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var replicate = function (a) { return (0, exports.makeBy)(function () { return a; }); };
    	exports.replicate = replicate;
    	/**
    	 * Create a `ReadonlyNonEmptyArray` containing a range of integers, including both endpoints.
    	 *
    	 * @example
    	 * import { range } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var range = function (start, end) {
    	    return start <= end ? (0, exports.makeBy)(function (i) { return start + i; })(end - start + 1) : [start];
    	};
    	exports.range = range;
    	/**
    	 * Return the tuple of the `head` and the `tail`.
    	 *
    	 * @example
    	 * import { unprepend } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
    	 *
    	 * @since 2.9.0
    	 */
    	var unprepend = function (as) { return [(0, exports.head)(as), (0, exports.tail)(as)]; };
    	exports.unprepend = unprepend;
    	/**
    	 * Return the tuple of the `init` and the `last`.
    	 *
    	 * @example
    	 * import { unappend } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var unappend = function (as) { return [(0, exports.init)(as), (0, exports.last)(as)]; };
    	exports.unappend = unappend;
    	/**
    	 * @category conversions
    	 * @since 2.5.0
    	 */
    	var fromArray = function (as) { return (0, exports.fromReadonlyArray)(as.slice()); };
    	exports.fromArray = fromArray;
    	function concatW(second) {
    	    return function (first) { return first.concat(second); };
    	}
    	exports.concatW = concatW;
    	function concat(x, y) {
    	    return y ? x.concat(y) : function (y) { return y.concat(x); };
    	}
    	exports.concat = concat;
    	/**
    	 * @since 2.5.0
    	 */
    	var reverse = function (as) {
    	    return as.length === 1 ? as : __spreadArray([(0, exports.last)(as)], as.slice(0, -1).reverse(), true);
    	};
    	exports.reverse = reverse;
    	function group(E) {
    	    return function (as) {
    	        var len = as.length;
    	        if (len === 0) {
    	            return exports.empty;
    	        }
    	        var out = [];
    	        var head = as[0];
    	        var nea = [head];
    	        for (var i = 1; i < len; i++) {
    	            var a = as[i];
    	            if (E.equals(a, head)) {
    	                nea.push(a);
    	            }
    	            else {
    	                out.push(nea);
    	                head = a;
    	                nea = [head];
    	            }
    	        }
    	        out.push(nea);
    	        return out;
    	    };
    	}
    	exports.group = group;
    	/**
    	 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
    	 * function on each element, and grouping the results according to values returned
    	 *
    	 * @example
    	 * import { groupBy } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
    	 *   '1': ['a', 'b'],
    	 *   '2': ['ab']
    	 * })
    	 *
    	 * @since 2.5.0
    	 */
    	var groupBy = function (f) {
    	    return function (as) {
    	        var out = {};
    	        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
    	            var a = as_1[_i];
    	            var k = f(a);
    	            if (_.has.call(out, k)) {
    	                out[k].push(a);
    	            }
    	            else {
    	                out[k] = [a];
    	            }
    	        }
    	        return out;
    	    };
    	};
    	exports.groupBy = groupBy;
    	/**
    	 * @since 2.5.0
    	 */
    	var sort = function (O) {
    	    return function (as) {
    	        return as.length === 1 ? as : as.slice().sort(O.compare);
    	    };
    	};
    	exports.sort = sort;
    	/**
    	 * @since 2.5.0
    	 */
    	var updateAt = function (i, a) {
    	    return (0, exports.modifyAt)(i, function () { return a; });
    	};
    	exports.updateAt = updateAt;
    	/**
    	 * @since 2.5.0
    	 */
    	var modifyAt = function (i, f) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    	    };
    	};
    	exports.modifyAt = modifyAt;
    	/**
    	 * @since 2.5.1
    	 */
    	var zipWith = function (as, bs, f) {
    	    var cs = [f(as[0], bs[0])];
    	    var len = Math.min(as.length, bs.length);
    	    for (var i = 1; i < len; i++) {
    	        cs[i] = f(as[i], bs[i]);
    	    }
    	    return cs;
    	};
    	exports.zipWith = zipWith;
    	function zip(as, bs) {
    	    if (bs === undefined) {
    	        return function (bs) { return zip(bs, as); };
    	    }
    	    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
    	}
    	exports.zip = zip;
    	/**
    	 * @since 2.5.1
    	 */
    	var unzip = function (abs) {
    	    var fa = [abs[0][0]];
    	    var fb = [abs[0][1]];
    	    for (var i = 1; i < abs.length; i++) {
    	        fa[i] = abs[i][0];
    	        fb[i] = abs[i][1];
    	    }
    	    return [fa, fb];
    	};
    	exports.unzip = unzip;
    	/**
    	 * Prepend an element to every member of a `ReadonlyNonEmptyArray`.
    	 *
    	 * @example
    	 * import { prependAll } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	var prependAll = function (middle) {
    	    return function (as) {
    	        var out = [middle, as[0]];
    	        for (var i = 1; i < as.length; i++) {
    	            out.push(middle, as[i]);
    	        }
    	        return out;
    	    };
    	};
    	exports.prependAll = prependAll;
    	/**
    	 * Places an element in between members of a `ReadonlyNonEmptyArray`.
    	 *
    	 * @example
    	 * import { intersperse } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var intersperse = function (middle) {
    	    return function (as) {
    	        var rest = (0, exports.tail)(as);
    	        return (0, exports.isNonEmpty)(rest) ? (0, function_1.pipe)(rest, (0, exports.prependAll)(middle), (0, exports.prepend)((0, exports.head)(as))) : as;
    	    };
    	};
    	exports.intersperse = intersperse;
    	/**
    	 * @category sequencing
    	 * @since 2.10.0
    	 */
    	var chainWithIndex = function (f) {
    	    return function (as) {
    	        var out = _.fromReadonlyNonEmptyArray(f(0, (0, exports.head)(as)));
    	        for (var i = 1; i < as.length; i++) {
    	            out.push.apply(out, f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.chainWithIndex = chainWithIndex;
    	/**
    	 * A useful recursion pattern for processing a `ReadonlyNonEmptyArray` to produce a new `ReadonlyNonEmptyArray`, often used for "chopping" up the input
    	 * `ReadonlyNonEmptyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyNonEmptyArray` and produce a
    	 * value and the tail of the `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.10.0
    	 */
    	var chop = function (f) {
    	    return function (as) {
    	        var _a = f(as), b = _a[0], rest = _a[1];
    	        var out = [b];
    	        var next = rest;
    	        while ((0, exports.isNonEmpty)(next)) {
    	            var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
    	            out.push(b_1);
    	            next = rest_2;
    	        }
    	        return out;
    	    };
    	};
    	exports.chop = chop;
    	/**
    	 * Splits a `ReadonlyNonEmptyArray` into two pieces, the first piece has max `n` elements.
    	 *
    	 * @since 2.10.0
    	 */
    	var splitAt = function (n) {
    	    return function (as) {
    	        var m = Math.max(1, n);
    	        return m >= as.length ? [as, exports.empty] : [(0, function_1.pipe)(as.slice(1, m), (0, exports.prepend)((0, exports.head)(as))), as.slice(m)];
    	    };
    	};
    	exports.splitAt = splitAt;
    	/**
    	 * Splits a `ReadonlyNonEmptyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
    	 * the `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.10.0
    	 */
    	var chunksOf = function (n) { return (0, exports.chop)((0, exports.splitAt)(n)); };
    	exports.chunksOf = chunksOf;
    	var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
    	/* istanbul ignore next */
    	var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
    	var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
    	/* istanbul ignore next */
    	var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
    	/* istanbul ignore next */
    	var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
    	/* istanbul ignore next */
    	var _foldMap = function (M) {
    	    var foldMapM = (0, exports.foldMap)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
    	/* istanbul ignore next */
    	var _traverse = function (F) {
    	    var traverseF = (0, exports.traverse)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
    	};
    	/* istanbul ignore next */
    	var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
    	/* istanbul ignore next */
    	var _reduceWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _foldMapWithIndex = function (M) {
    	    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRightWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _traverseWithIndex = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
    	};
    	/**
    	 * @category constructors
    	 * @since 2.5.0
    	 */
    	exports.of = _.singleton;
    	/**
    	 * Less strict version of [`alt`](#alt).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the return types will be merged.
    	 *
    	 * @example
    	 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3] as RNEA.ReadonlyNonEmptyArray<number>,
    	 *     RNEA.altW(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 2, 3, 'a', 'b']
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.9.0
    	 */
    	var altW = function (that) {
    	    return function (as) {
    	        return (0, function_1.pipe)(as, concatW(that()));
    	    };
    	};
    	exports.altW = altW;
    	/**
    	 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
    	 * types of kind `* -> *`.
    	 *
    	 * In case of `ReadonlyNonEmptyArray` concatenates the inputs into a single array.
    	 *
    	 * @example
    	 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RNEA.alt(() => [4, 5])
    	 *   ),
    	 *   [1, 2, 3, 4, 5]
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.6.2
    	 */
    	exports.alt = exports.altW;
    	/**
    	 * @since 2.5.0
    	 */
    	var ap = function (as) { return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(as, (0, exports.map)(f)); }); };
    	exports.ap = ap;
    	/**
    	 * @example
    	 * import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RNEA.flatMap((n) => [`a${n}`, `b${n}`])
    	 *   ),
    	 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.14.0
    	 */
    	exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    	    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
    	});
    	/**
    	 * @since 2.5.0
    	 */
    	var extend = function (f) {
    	    return function (as) {
    	        var next = (0, exports.tail)(as);
    	        var out = [f(as)];
    	        while ((0, exports.isNonEmpty)(next)) {
    	            out.push(f(next));
    	            next = (0, exports.tail)(next);
    	        }
    	        return out;
    	    };
    	};
    	exports.extend = extend;
    	/**
    	 * @since 2.5.0
    	 */
    	exports.duplicate = 
    	/*#__PURE__*/ (0, exports.extend)(function_1.identity);
    	/**
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.flatten = 
    	/*#__PURE__*/ (0, exports.flatMap)(function_1.identity);
    	/**
    	 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
    	 * use the type constructor `F` to represent some computational context.
    	 *
    	 * @category mapping
    	 * @since 2.5.0
    	 */
    	var map = function (f) {
    	    return (0, exports.mapWithIndex)(function (_, a) { return f(a); });
    	};
    	exports.map = map;
    	/**
    	 * @category mapping
    	 * @since 2.5.0
    	 */
    	var mapWithIndex = function (f) {
    	    return function (as) {
    	        var out = [f(0, (0, exports.head)(as))];
    	        for (var i = 1; i < as.length; i++) {
    	            out.push(f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.mapWithIndex = mapWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduce = function (b, f) {
    	    return (0, exports.reduceWithIndex)(b, function (_, b, a) { return f(b, a); });
    	};
    	exports.reduce = reduce;
    	/**
    	 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
    	 *
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var foldMap = function (S) {
    	    return function (f) {
    	        return function (as) {
    	            return as.slice(1).reduce(function (s, a) { return S.concat(s, f(a)); }, f(as[0]));
    	        };
    	    };
    	};
    	exports.foldMap = foldMap;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceRight = function (b, f) {
    	    return (0, exports.reduceRightWithIndex)(b, function (_, b, a) { return f(b, a); });
    	};
    	exports.reduceRight = reduceRight;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceWithIndex = function (b, f) {
    	    return function (as) {
    	        return as.reduce(function (b, a, i) { return f(i, b, a); }, b);
    	    };
    	};
    	exports.reduceWithIndex = reduceWithIndex;
    	/**
    	 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
    	 *
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var foldMapWithIndex = function (S) {
    	    return function (f) {
    	        return function (as) {
    	            return as.slice(1).reduce(function (s, a, i) { return S.concat(s, f(i + 1, a)); }, f(0, as[0]));
    	        };
    	    };
    	};
    	exports.foldMapWithIndex = foldMapWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceRightWithIndex = function (b, f) {
    	    return function (as) {
    	        return as.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
    	    };
    	};
    	exports.reduceRightWithIndex = reduceRightWithIndex;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var traverse = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
    	};
    	exports.traverse = traverse;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var sequence = function (F) { return (0, exports.traverseWithIndex)(F)(function_1.SK); };
    	exports.sequence = sequence;
    	/**
    	 * @category sequencing
    	 * @since 2.6.3
    	 */
    	var traverseWithIndex = function (F) {
    	    return function (f) {
    	        return function (as) {
    	            var out = F.map(f(0, (0, exports.head)(as)), exports.of);
    	            for (var i = 1; i < as.length; i++) {
    	                out = F.ap(F.map(out, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, as[i]));
    	            }
    	            return out;
    	        };
    	    };
    	};
    	exports.traverseWithIndex = traverseWithIndex;
    	/**
    	 * @category Comonad
    	 * @since 2.6.3
    	 */
    	exports.extract = _.head;
    	/**
    	 * @category type lambdas
    	 * @since 2.5.0
    	 */
    	exports.URI = 'ReadonlyNonEmptyArray';
    	/**
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getShow = function (S) { return ({
    	    show: function (as) { return "[".concat(as.map(S.show).join(', '), "]"); }
    	}); };
    	exports.getShow = getShow;
    	/**
    	 * Builds a `Semigroup` instance for `ReadonlyNonEmptyArray`
    	 *
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: concat
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * @example
    	 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * const E = getEq(N.Eq)
    	 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
    	 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
    	 *
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getEq = function (E) {
    	    return (0, Eq_1.fromEquals)(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
    	};
    	exports.getEq = getEq;
    	/**
    	 * @since 2.11.0
    	 */
    	var getUnionSemigroup = function (E) {
    	    var unionE = (0, exports.union)(E);
    	    return {
    	        concat: function (first, second) { return unionE(second)(first); }
    	    };
    	};
    	exports.getUnionSemigroup = getUnionSemigroup;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Functor = {
    	    URI: exports.URI,
    	    map: _map
    	};
    	/**
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	exports.flap = (0, Functor_1.flap)(exports.Functor);
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Pointed = {
    	    URI: exports.URI,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FunctorWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Apply = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap
    	};
    	/**
    	 * Combine two effectful actions, keeping only the result of the first.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
    	/**
    	 * Combine two effectful actions, keeping only the result of the second.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Applicative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Chain = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap
    	};
    	/**
    	 * Composes computations in sequence, using the return value of one computation to determine the next computation and
    	 * keeping only the result of the first.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.chainFirst(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 1, 2, 2, 3, 3]
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.chainFirst = (0, Chain_1.chainFirst)(exports.Chain);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Monad = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Foldable = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FoldableWithIndex = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Traversable = {
    	    URI: exports.URI,
    	    map: _map,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.TraversableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alt = {
    	    URI: exports.URI,
    	    map: _map,
    	    alt: _alt
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Comonad = {
    	    URI: exports.URI,
    	    map: _map,
    	    extend: _extend,
    	    extract: exports.extract
    	};
    	// -------------------------------------------------------------------------------------
    	// do notation
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category do notation
    	 * @since 2.9.0
    	 */
    	exports.Do = (0, exports.of)(_.emptyRecord);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
    	var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
    	exports.let = let_;
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bind = (0, Chain_1.bind)(exports.Chain);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.apS = (0, Apply_1.apS)(exports.Apply);
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.5.0
    	 */
    	exports.head = exports.extract;
    	/**
    	 * @since 2.5.0
    	 */
    	exports.tail = _.tail;
    	/**
    	 * @since 2.5.0
    	 */
    	var last = function (as) { return as[as.length - 1]; };
    	exports.last = last;
    	/**
    	 * Get all but the last element of a non empty array, creating a new array.
    	 *
    	 * @example
    	 * import { init } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
    	 * assert.deepStrictEqual(init([1]), [])
    	 *
    	 * @since 2.5.0
    	 */
    	var init = function (as) { return as.slice(0, -1); };
    	exports.init = init;
    	/**
    	 * @since 2.5.0
    	 */
    	var min = function (O) {
    	    var S = Se.min(O);
    	    return function (as) { return as.reduce(S.concat); };
    	};
    	exports.min = min;
    	/**
    	 * @since 2.5.0
    	 */
    	var max = function (O) {
    	    var S = Se.max(O);
    	    return function (as) { return as.reduce(S.concat); };
    	};
    	exports.max = max;
    	/**
    	 * @since 2.10.0
    	 */
    	var concatAll = function (S) {
    	    return function (as) {
    	        return as.reduce(S.concat);
    	    };
    	};
    	exports.concatAll = concatAll;
    	/**
    	 * Break a `ReadonlyArray` into its first element and remaining elements.
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchLeft = function (f) {
    	    return function (as) {
    	        return f((0, exports.head)(as), (0, exports.tail)(as));
    	    };
    	};
    	exports.matchLeft = matchLeft;
    	/**
    	 * Break a `ReadonlyArray` into its initial elements and the last element.
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchRight = function (f) {
    	    return function (as) {
    	        return f((0, exports.init)(as), (0, exports.last)(as));
    	    };
    	};
    	exports.matchRight = matchRight;
    	/**
    	 * Apply a function to the head, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var modifyHead = function (f) {
    	    return function (as) {
    	        return __spreadArray([f((0, exports.head)(as))], (0, exports.tail)(as), true);
    	    };
    	};
    	exports.modifyHead = modifyHead;
    	/**
    	 * Change the head, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var updateHead = function (a) { return (0, exports.modifyHead)(function () { return a; }); };
    	exports.updateHead = updateHead;
    	/**
    	 * Apply a function to the last element, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var modifyLast = function (f) {
    	    return function (as) {
    	        return (0, function_1.pipe)((0, exports.init)(as), (0, exports.append)(f((0, exports.last)(as))));
    	    };
    	};
    	exports.modifyLast = modifyLast;
    	/**
    	 * Change the last element, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var updateLast = function (a) { return (0, exports.modifyLast)(function () { return a; }); };
    	exports.updateLast = updateLast;
    	/**
    	 * Places an element in between members of a `ReadonlyNonEmptyArray`, then folds the results using the provided `Semigroup`.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { intercalate } from 'fp-ts/ReadonlyNonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
    	 *
    	 * @since 2.12.0
    	 */
    	var intercalate = function (S) {
    	    var concatAllS = (0, exports.concatAll)(S);
    	    return function (middle) { return (0, function_1.flow)((0, exports.intersperse)(middle), concatAllS); };
    	};
    	exports.intercalate = intercalate;
    	// -------------------------------------------------------------------------------------
    	// legacy
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Alias of `flatMap`.
    	 *
    	 * @category legacy
    	 * @since 2.5.0
    	 */
    	exports.chain = exports.flatMap;
    	function groupSort(O) {
    	    var sortO = (0, exports.sort)(O);
    	    var groupO = group(O);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? groupO(sortO(as)) : exports.empty); };
    	}
    	exports.groupSort = groupSort;
    	function filter(predicate) {
    	    return (0, exports.filterWithIndex)(function (_, a) { return predicate(a); });
    	}
    	exports.filter = filter;
    	/**
    	 * Use [`filterWithIndex`](./ReadonlyArray.ts.html#filterwithindex) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	var filterWithIndex = function (predicate) {
    	    return function (as) {
    	        return (0, exports.fromReadonlyArray)(as.filter(function (a, i) { return predicate(i, a); }));
    	    };
    	};
    	exports.filterWithIndex = filterWithIndex;
    	/**
    	 * Use [`unprepend`](#unprepend) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.10.0
    	 * @deprecated
    	 */
    	exports.uncons = exports.unprepend;
    	/**
    	 * Use [`unappend`](#unappend) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.10.0
    	 * @deprecated
    	 */
    	exports.unsnoc = exports.unappend;
    	function cons(head, tail) {
    	    return tail === undefined ? (0, exports.prepend)(head) : (0, function_1.pipe)(tail, (0, exports.prepend)(head));
    	}
    	exports.cons = cons;
    	/**
    	 * Use [`append`](./ReadonlyArray.ts.html#append) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	var snoc = function (init, end) { return (0, function_1.pipe)(init, concat([end])); };
    	exports.snoc = snoc;
    	/**
    	 * Use [`insertAt`](./ReadonlyArray.ts.html#insertat) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	var insertAt = function (i, a) {
    	    return function (as) {
    	        return i < 0 || i > as.length ? _.none : _.some((0, exports.unsafeInsertAt)(i, a, as));
    	    };
    	};
    	exports.insertAt = insertAt;
    	/**
    	 * Use [`prependAll`](#prependall) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.prependToAll = exports.prependAll;
    	/**
    	 * Use [`concatAll`](#concatall) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.fold = exports.concatAll;
    	/**
    	 * This instance is deprecated, use small, specific instances instead.
    	 * For example if a function needs a `Functor` instance, pass `RNEA.Functor` instead of `RNEA.readonlyNonEmptyArray`
    	 * (where `RNEA` is from `import RNEA from 'fp-ts/ReadonlyNonEmptyArray'`)
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.readonlyNonEmptyArray = {
    	    URI: exports.URI,
    	    of: exports.of,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    extend: _extend,
    	    extract: exports.extract,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex,
    	    alt: _alt
    	}; 
    } (ReadonlyNonEmptyArray));

    (function (exports) {
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    var desc = Object.getOwnPropertyDescriptor(m, k);
    	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    	      desc = { enumerable: true, get: function() { return m[k]; } };
    	    }
    	    Object.defineProperty(o, k2, desc);
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    	        if (ar || !(i in from)) {
    	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
    	            ar[i] = from[i];
    	        }
    	    }
    	    return to.concat(ar || Array.prototype.slice.call(from));
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.mapWithIndex = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.flatMap = exports.ap = exports.alt = exports.altW = exports.chunksOf = exports.splitAt = exports.chop = exports.chainWithIndex = exports.foldMap = exports.foldMapWithIndex = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = exports.of = exports.copy = exports.modifyAt = exports.updateAt = exports.insertAt = exports.sort = exports.groupBy = exports.group = exports.reverse = exports.concat = exports.concatW = exports.unappend = exports.unprepend = exports.range = exports.replicate = exports.makeBy = exports.fromArray = exports.fromReadonlyNonEmptyArray = exports.rotate = exports.union = exports.sortBy = exports.uniq = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.append = exports.appendW = exports.prepend = exports.prependW = exports.isOutOfBound = exports.isNonEmpty = void 0;
    	exports.chain = exports.intercalate = exports.updateLast = exports.modifyLast = exports.updateHead = exports.modifyHead = exports.matchRight = exports.matchLeft = exports.concatAll = exports.max = exports.min = exports.init = exports.last = exports.tail = exports.head = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.Comonad = exports.Alt = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getUnionSemigroup = exports.getEq = exports.getSemigroup = exports.getShow = exports.URI = exports.extract = exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.reduceRight = exports.reduceWithIndex = exports.reduce = void 0;
    	exports.nonEmptyArray = exports.fold = exports.prependToAll = exports.snoc = exports.cons = exports.unsnoc = exports.uncons = exports.filterWithIndex = exports.filter = exports.groupSort = void 0;
    	var Apply_1 = Apply;
    	var Chain_1 = Chain;
    	var function_1 = _function;
    	var Functor_1 = Functor;
    	var _ = __importStar(internal);
    	var Ord_1 = Ord;
    	var RNEA = __importStar(ReadonlyNonEmptyArray);
    	// -------------------------------------------------------------------------------------
    	// internal
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @internal
    	 */
    	var isNonEmpty = function (as) { return as.length > 0; };
    	exports.isNonEmpty = isNonEmpty;
    	/**
    	 * @internal
    	 */
    	var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
    	exports.isOutOfBound = isOutOfBound;
    	/**
    	 * @internal
    	 */
    	var prependW = function (head) {
    	    return function (tail) {
    	        return __spreadArray([head], tail, true);
    	    };
    	};
    	exports.prependW = prependW;
    	/**
    	 * @internal
    	 */
    	exports.prepend = exports.prependW;
    	/**
    	 * @internal
    	 */
    	var appendW = function (end) {
    	    return function (init) {
    	        return __spreadArray(__spreadArray([], init, true), [end], false);
    	    };
    	};
    	exports.appendW = appendW;
    	/**
    	 * @internal
    	 */
    	exports.append = exports.appendW;
    	/**
    	 * @internal
    	 */
    	var unsafeInsertAt = function (i, a, as) {
    	    if ((0, exports.isNonEmpty)(as)) {
    	        var xs = (0, exports.fromReadonlyNonEmptyArray)(as);
    	        xs.splice(i, 0, a);
    	        return xs;
    	    }
    	    return [a];
    	};
    	exports.unsafeInsertAt = unsafeInsertAt;
    	/**
    	 * @internal
    	 */
    	var unsafeUpdateAt = function (i, a, as) {
    	    var xs = (0, exports.fromReadonlyNonEmptyArray)(as);
    	    xs[i] = a;
    	    return xs;
    	};
    	exports.unsafeUpdateAt = unsafeUpdateAt;
    	/**
    	 * Remove duplicates from a `NonEmptyArray`, keeping the first occurrence of an element.
    	 *
    	 * @example
    	 * import { uniq } from 'fp-ts/NonEmptyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
    	 *
    	 * @since 2.11.0
    	 */
    	var uniq = function (E) {
    	    return function (as) {
    	        if (as.length === 1) {
    	            return (0, exports.copy)(as);
    	        }
    	        var out = [(0, exports.head)(as)];
    	        var rest = (0, exports.tail)(as);
    	        var _loop_1 = function (a) {
    	            if (out.every(function (o) { return !E.equals(o, a); })) {
    	                out.push(a);
    	            }
    	        };
    	        for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
    	            var a = rest_1[_i];
    	            _loop_1(a);
    	        }
    	        return out;
    	    };
    	};
    	exports.uniq = uniq;
    	/**
    	 * Sort the elements of a `NonEmptyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
    	 * etc...
    	 *
    	 * @example
    	 * import * as NEA from 'fp-ts/NonEmptyArray'
    	 * import { contramap } from 'fp-ts/Ord'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * interface Person {
    	 *   name: string
    	 *   age: number
    	 * }
    	 *
    	 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
    	 *
    	 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
    	 *
    	 * const sortByNameByAge = NEA.sortBy([byName, byAge])
    	 *
    	 * const persons: NEA.NonEmptyArray<Person> = [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 },
    	 *   { name: 'b', age: 2 }
    	 * ]
    	 *
    	 * assert.deepStrictEqual(sortByNameByAge(persons), [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 2 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 }
    	 * ])
    	 *
    	 * @since 2.11.0
    	 */
    	var sortBy = function (ords) {
    	    if ((0, exports.isNonEmpty)(ords)) {
    	        var M = (0, Ord_1.getMonoid)();
    	        return (0, exports.sort)(ords.reduce(M.concat, M.empty));
    	    }
    	    return exports.copy;
    	};
    	exports.sortBy = sortBy;
    	/**
    	 * @since 2.11.0
    	 */
    	var union = function (E) {
    	    var uniqE = (0, exports.uniq)(E);
    	    return function (second) { return function (first) { return uniqE((0, function_1.pipe)(first, concat(second))); }; };
    	};
    	exports.union = union;
    	/**
    	 * Rotate a `NonEmptyArray` by `n` steps.
    	 *
    	 * @example
    	 * import { rotate } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    	 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
    	 *
    	 * @since 2.11.0
    	 */
    	var rotate = function (n) {
    	    return function (as) {
    	        var len = as.length;
    	        var m = Math.round(n) % len;
    	        if ((0, exports.isOutOfBound)(Math.abs(m), as) || m === 0) {
    	            return (0, exports.copy)(as);
    	        }
    	        if (m < 0) {
    	            var _a = (0, exports.splitAt)(-m)(as), f = _a[0], s = _a[1];
    	            return (0, function_1.pipe)(s, concat(f));
    	        }
    	        else {
    	            return (0, exports.rotate)(m - len)(as);
    	        }
    	    };
    	};
    	exports.rotate = rotate;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category conversions
    	 * @since 2.10.0
    	 */
    	exports.fromReadonlyNonEmptyArray = _.fromReadonlyNonEmptyArray;
    	/**
    	 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
    	 *
    	 * @category conversions
    	 * @since 2.0.0
    	 */
    	var fromArray = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(as) : _.none); };
    	exports.fromArray = fromArray;
    	/**
    	 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
    	 *
    	 * **Note**. `n` is normalized to a natural number.
    	 *
    	 * @example
    	 * import { makeBy } from 'fp-ts/NonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const double = (n: number): number => n * 2
    	 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var makeBy = function (f) {
    	    return function (n) {
    	        var j = Math.max(0, Math.floor(n));
    	        var out = [f(0)];
    	        for (var i = 1; i < j; i++) {
    	            out.push(f(i));
    	        }
    	        return out;
    	    };
    	};
    	exports.makeBy = makeBy;
    	/**
    	 * Create a `NonEmptyArray` containing a value repeated the specified number of times.
    	 *
    	 * **Note**. `n` is normalized to a natural number.
    	 *
    	 * @example
    	 * import { replicate } from 'fp-ts/NonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var replicate = function (a) { return (0, exports.makeBy)(function () { return a; }); };
    	exports.replicate = replicate;
    	/**
    	 * Create a `NonEmptyArray` containing a range of integers, including both endpoints.
    	 *
    	 * @example
    	 * import { range } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
    	 *
    	 * @category constructors
    	 * @since 2.11.0
    	 */
    	var range = function (start, end) {
    	    return start <= end ? (0, exports.makeBy)(function (i) { return start + i; })(end - start + 1) : [start];
    	};
    	exports.range = range;
    	/**
    	 * Return the tuple of the `head` and the `tail`.
    	 *
    	 * @example
    	 * import { unprepend } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(unprepend([1, 2, 3]), [1, [2, 3]])
    	 *
    	 * @since 2.9.0
    	 */
    	var unprepend = function (as) { return [(0, exports.head)(as), (0, exports.tail)(as)]; };
    	exports.unprepend = unprepend;
    	/**
    	 * Return the tuple of the `init` and the `last`.
    	 *
    	 * @example
    	 * import { unappend } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var unappend = function (as) { return [(0, exports.init)(as), (0, exports.last)(as)]; };
    	exports.unappend = unappend;
    	function concatW(second) {
    	    return function (first) { return first.concat(second); };
    	}
    	exports.concatW = concatW;
    	function concat(x, y) {
    	    return y ? x.concat(y) : function (y) { return y.concat(x); };
    	}
    	exports.concat = concat;
    	/**
    	 * @since 2.0.0
    	 */
    	var reverse = function (as) { return __spreadArray([(0, exports.last)(as)], as.slice(0, -1).reverse(), true); };
    	exports.reverse = reverse;
    	function group(E) {
    	    return function (as) {
    	        var len = as.length;
    	        if (len === 0) {
    	            return [];
    	        }
    	        var out = [];
    	        var head = as[0];
    	        var nea = [head];
    	        for (var i = 1; i < len; i++) {
    	            var a = as[i];
    	            if (E.equals(a, head)) {
    	                nea.push(a);
    	            }
    	            else {
    	                out.push(nea);
    	                head = a;
    	                nea = [head];
    	            }
    	        }
    	        out.push(nea);
    	        return out;
    	    };
    	}
    	exports.group = group;
    	/**
    	 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
    	 * function on each element, and grouping the results according to values returned
    	 *
    	 * @example
    	 * import { groupBy } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
    	 *   '1': ['a', 'b'],
    	 *   '2': ['ab']
    	 * })
    	 *
    	 * @since 2.0.0
    	 */
    	var groupBy = function (f) {
    	    return function (as) {
    	        var out = {};
    	        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
    	            var a = as_1[_i];
    	            var k = f(a);
    	            if (_.has.call(out, k)) {
    	                out[k].push(a);
    	            }
    	            else {
    	                out[k] = [a];
    	            }
    	        }
    	        return out;
    	    };
    	};
    	exports.groupBy = groupBy;
    	/**
    	 * @since 2.0.0
    	 */
    	var sort = function (O) {
    	    return function (as) {
    	        return as.slice().sort(O.compare);
    	    };
    	};
    	exports.sort = sort;
    	/**
    	 * @since 2.0.0
    	 */
    	var insertAt = function (i, a) {
    	    return function (as) {
    	        return i < 0 || i > as.length ? _.none : _.some((0, exports.unsafeInsertAt)(i, a, as));
    	    };
    	};
    	exports.insertAt = insertAt;
    	/**
    	 * @since 2.0.0
    	 */
    	var updateAt = function (i, a) {
    	    return (0, exports.modifyAt)(i, function () { return a; });
    	};
    	exports.updateAt = updateAt;
    	/**
    	 * @since 2.0.0
    	 */
    	var modifyAt = function (i, f) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    	    };
    	};
    	exports.modifyAt = modifyAt;
    	/**
    	 * @since 2.0.0
    	 */
    	exports.copy = exports.fromReadonlyNonEmptyArray;
    	/**
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	var of = function (a) { return [a]; };
    	exports.of = of;
    	/**
    	 * @since 2.5.1
    	 */
    	var zipWith = function (as, bs, f) {
    	    var cs = [f(as[0], bs[0])];
    	    var len = Math.min(as.length, bs.length);
    	    for (var i = 1; i < len; i++) {
    	        cs[i] = f(as[i], bs[i]);
    	    }
    	    return cs;
    	};
    	exports.zipWith = zipWith;
    	function zip(as, bs) {
    	    if (bs === undefined) {
    	        return function (bs) { return zip(bs, as); };
    	    }
    	    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
    	}
    	exports.zip = zip;
    	/**
    	 * @since 2.5.1
    	 */
    	var unzip = function (abs) {
    	    var fa = [abs[0][0]];
    	    var fb = [abs[0][1]];
    	    for (var i = 1; i < abs.length; i++) {
    	        fa[i] = abs[i][0];
    	        fb[i] = abs[i][1];
    	    }
    	    return [fa, fb];
    	};
    	exports.unzip = unzip;
    	/**
    	 * Prepend an element to every member of an array
    	 *
    	 * @example
    	 * import { prependAll } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	var prependAll = function (middle) {
    	    return function (as) {
    	        var out = [middle, as[0]];
    	        for (var i = 1; i < as.length; i++) {
    	            out.push(middle, as[i]);
    	        }
    	        return out;
    	    };
    	};
    	exports.prependAll = prependAll;
    	/**
    	 * Places an element in between members of an array
    	 *
    	 * @example
    	 * import { intersperse } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var intersperse = function (middle) {
    	    return function (as) {
    	        var rest = (0, exports.tail)(as);
    	        return (0, exports.isNonEmpty)(rest) ? (0, function_1.pipe)(rest, (0, exports.prependAll)(middle), (0, exports.prepend)((0, exports.head)(as))) : (0, exports.copy)(as);
    	    };
    	};
    	exports.intersperse = intersperse;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.foldMapWithIndex = RNEA.foldMapWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.foldMap = RNEA.foldMap;
    	/**
    	 * @category sequencing
    	 * @since 2.10.0
    	 */
    	var chainWithIndex = function (f) {
    	    return function (as) {
    	        var out = (0, exports.fromReadonlyNonEmptyArray)(f(0, (0, exports.head)(as)));
    	        for (var i = 1; i < as.length; i++) {
    	            out.push.apply(out, f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.chainWithIndex = chainWithIndex;
    	/**
    	 * @since 2.10.0
    	 */
    	var chop = function (f) {
    	    return function (as) {
    	        var _a = f(as), b = _a[0], rest = _a[1];
    	        var out = [b];
    	        var next = rest;
    	        while ((0, exports.isNonEmpty)(next)) {
    	            var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
    	            out.push(b_1);
    	            next = rest_2;
    	        }
    	        return out;
    	    };
    	};
    	exports.chop = chop;
    	/**
    	 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
    	 *
    	 * @since 2.10.0
    	 */
    	var splitAt = function (n) {
    	    return function (as) {
    	        var m = Math.max(1, n);
    	        return m >= as.length ? [(0, exports.copy)(as), []] : [(0, function_1.pipe)(as.slice(1, m), (0, exports.prepend)((0, exports.head)(as))), as.slice(m)];
    	    };
    	};
    	exports.splitAt = splitAt;
    	/**
    	 * @since 2.10.0
    	 */
    	var chunksOf = function (n) { return (0, exports.chop)((0, exports.splitAt)(n)); };
    	exports.chunksOf = chunksOf;
    	/* istanbul ignore next */
    	var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
    	/* istanbul ignore next */
    	var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
    	/* istanbul ignore next */
    	var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
    	/* istanbul ignore next */
    	var _extend = function (wa, f) { return (0, function_1.pipe)(wa, (0, exports.extend)(f)); };
    	/* istanbul ignore next */
    	var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
    	/* istanbul ignore next */
    	var _foldMap = function (M) {
    	    var foldMapM = (0, exports.foldMap)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
    	/* istanbul ignore next */
    	var _traverse = function (F) {
    	    var traverseF = (0, exports.traverse)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
    	};
    	/* istanbul ignore next */
    	var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
    	/* istanbul ignore next */
    	var _reduceWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _foldMapWithIndex = function (M) {
    	    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRightWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _traverseWithIndex = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
    	};
    	/**
    	 * Less strict version of [`alt`](#alt).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the return types will be merged.
    	 *
    	 * @example
    	 * import * as NEA from 'fp-ts/NonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3] as NEA.NonEmptyArray<number>,
    	 *     NEA.altW(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 2, 3, 'a', 'b']
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.9.0
    	 */
    	var altW = function (that) {
    	    return function (as) {
    	        return (0, function_1.pipe)(as, concatW(that()));
    	    };
    	};
    	exports.altW = altW;
    	/**
    	 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
    	 * types of kind `* -> *`.
    	 *
    	 * In case of `NonEmptyArray` concatenates the inputs into a single array.
    	 *
    	 * @example
    	 * import * as NEA from 'fp-ts/NonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     NEA.alt(() => [4, 5])
    	 *   ),
    	 *   [1, 2, 3, 4, 5]
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.6.2
    	 */
    	exports.alt = exports.altW;
    	/**
    	 * Apply a function to an argument under a type constructor.
    	 *
    	 * @since 2.0.0
    	 */
    	var ap = function (as) {
    	    return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(as, (0, exports.map)(f)); });
    	};
    	exports.ap = ap;
    	/**
    	 * @example
    	 * import * as NEA from 'fp-ts/NonEmptyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     NEA.flatMap((n) => [`a${n}`, `b${n}`])
    	 *   ),
    	 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.14.0
    	 */
    	exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    	    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
    	});
    	/**
    	 * @since 2.0.0
    	 */
    	var extend = function (f) {
    	    return function (as) {
    	        var next = (0, exports.tail)(as);
    	        var out = [f(as)];
    	        while ((0, exports.isNonEmpty)(next)) {
    	            out.push(f(next));
    	            next = (0, exports.tail)(next);
    	        }
    	        return out;
    	    };
    	};
    	exports.extend = extend;
    	/**
    	 * @since 2.5.0
    	 */
    	exports.duplicate = (0, exports.extend)(function_1.identity);
    	/**
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.flatten = (0, exports.flatMap)(function_1.identity);
    	/**
    	 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
    	 * use the type constructor `F` to represent some computational context.
    	 *
    	 * @category mapping
    	 * @since 2.0.0
    	 */
    	var map = function (f) { return (0, exports.mapWithIndex)(function (_, a) { return f(a); }); };
    	exports.map = map;
    	/**
    	 * @category mapping
    	 * @since 2.0.0
    	 */
    	var mapWithIndex = function (f) {
    	    return function (as) {
    	        var out = [f(0, (0, exports.head)(as))];
    	        for (var i = 1; i < as.length; i++) {
    	            out.push(f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.mapWithIndex = mapWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduce = RNEA.reduce;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceWithIndex = RNEA.reduceWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceRight = RNEA.reduceRight;
    	/**
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceRightWithIndex = RNEA.reduceRightWithIndex;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var traverse = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
    	};
    	exports.traverse = traverse;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var sequence = function (F) { return (0, exports.traverseWithIndex)(F)(function (_, a) { return a; }); };
    	exports.sequence = sequence;
    	/**
    	 * @category sequencing
    	 * @since 2.6.3
    	 */
    	var traverseWithIndex = function (F) {
    	    return function (f) {
    	        return function (as) {
    	            var out = F.map(f(0, (0, exports.head)(as)), exports.of);
    	            for (var i = 1; i < as.length; i++) {
    	                out = F.ap(F.map(out, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, as[i]));
    	            }
    	            return out;
    	        };
    	    };
    	};
    	exports.traverseWithIndex = traverseWithIndex;
    	/**
    	 * @since 2.7.0
    	 */
    	exports.extract = RNEA.head;
    	/**
    	 * @category type lambdas
    	 * @since 2.0.0
    	 */
    	exports.URI = 'NonEmptyArray';
    	/**
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	exports.getShow = RNEA.getShow;
    	/**
    	 * Builds a `Semigroup` instance for `NonEmptyArray`
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: concat
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * @example
    	 * import { getEq } from 'fp-ts/NonEmptyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * const E = getEq(N.Eq)
    	 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
    	 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	exports.getEq = RNEA.getEq;
    	/**
    	 * @since 2.11.0
    	 */
    	var getUnionSemigroup = function (E) {
    	    var unionE = (0, exports.union)(E);
    	    return {
    	        concat: function (first, second) { return unionE(second)(first); }
    	    };
    	};
    	exports.getUnionSemigroup = getUnionSemigroup;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Functor = {
    	    URI: exports.URI,
    	    map: _map
    	};
    	/**
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	exports.flap = (0, Functor_1.flap)(exports.Functor);
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Pointed = {
    	    URI: exports.URI,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FunctorWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Apply = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap
    	};
    	/**
    	 * Combine two effectful actions, keeping only the result of the first.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
    	/**
    	 * Combine two effectful actions, keeping only the result of the second.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Applicative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Chain = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap
    	};
    	/**
    	 * Composes computations in sequence, using the return value of one computation to determine the next computation and
    	 * keeping only the result of the first.
    	 *
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.chainFirst = 
    	/*#__PURE__*/ (0, Chain_1.chainFirst)(exports.Chain);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Monad = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Foldable = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FoldableWithIndex = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Traversable = {
    	    URI: exports.URI,
    	    map: _map,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.TraversableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alt = {
    	    URI: exports.URI,
    	    map: _map,
    	    alt: _alt
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Comonad = {
    	    URI: exports.URI,
    	    map: _map,
    	    extend: _extend,
    	    extract: exports.extract
    	};
    	// -------------------------------------------------------------------------------------
    	// do notation
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category do notation
    	 * @since 2.9.0
    	 */
    	exports.Do = (0, exports.of)(_.emptyRecord);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
    	var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
    	exports.let = let_;
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bind = (0, Chain_1.bind)(exports.Chain);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.apS = (0, Apply_1.apS)(exports.Apply);
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.0.0
    	 */
    	exports.head = RNEA.head;
    	/**
    	 * @since 2.0.0
    	 */
    	var tail = function (as) { return as.slice(1); };
    	exports.tail = tail;
    	/**
    	 * @since 2.0.0
    	 */
    	exports.last = RNEA.last;
    	/**
    	 * Get all but the last element of a non empty array, creating a new array.
    	 *
    	 * @example
    	 * import { init } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
    	 * assert.deepStrictEqual(init([1]), [])
    	 *
    	 * @since 2.2.0
    	 */
    	var init = function (as) { return as.slice(0, -1); };
    	exports.init = init;
    	/**
    	 * @since 2.0.0
    	 */
    	exports.min = RNEA.min;
    	/**
    	 * @since 2.0.0
    	 */
    	exports.max = RNEA.max;
    	/**
    	 * @since 2.10.0
    	 */
    	var concatAll = function (S) {
    	    return function (as) {
    	        return as.reduce(S.concat);
    	    };
    	};
    	exports.concatAll = concatAll;
    	/**
    	 * Break an `Array` into its first element and remaining elements.
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchLeft = function (f) {
    	    return function (as) {
    	        return f((0, exports.head)(as), (0, exports.tail)(as));
    	    };
    	};
    	exports.matchLeft = matchLeft;
    	/**
    	 * Break an `Array` into its initial elements and the last element.
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchRight = function (f) {
    	    return function (as) {
    	        return f((0, exports.init)(as), (0, exports.last)(as));
    	    };
    	};
    	exports.matchRight = matchRight;
    	/**
    	 * Apply a function to the head, creating a new `NonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var modifyHead = function (f) {
    	    return function (as) {
    	        return __spreadArray([f((0, exports.head)(as))], (0, exports.tail)(as), true);
    	    };
    	};
    	exports.modifyHead = modifyHead;
    	/**
    	 * Change the head, creating a new `NonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var updateHead = function (a) { return (0, exports.modifyHead)(function () { return a; }); };
    	exports.updateHead = updateHead;
    	/**
    	 * Apply a function to the last element, creating a new `NonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var modifyLast = function (f) {
    	    return function (as) {
    	        return (0, function_1.pipe)((0, exports.init)(as), (0, exports.append)(f((0, exports.last)(as))));
    	    };
    	};
    	exports.modifyLast = modifyLast;
    	/**
    	 * Change the last element, creating a new `NonEmptyArray`.
    	 *
    	 * @since 2.11.0
    	 */
    	var updateLast = function (a) { return (0, exports.modifyLast)(function () { return a; }); };
    	exports.updateLast = updateLast;
    	/**
    	 * Places an element in between members of a `NonEmptyArray`, then folds the results using the provided `Semigroup`.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { intercalate } from 'fp-ts/NonEmptyArray'
    	 *
    	 * assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
    	 *
    	 * @since 2.12.0
    	 */
    	exports.intercalate = RNEA.intercalate;
    	// -------------------------------------------------------------------------------------
    	// legacy
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Alias of `flatMap`.
    	 *
    	 * @category legacy
    	 * @since 2.0.0
    	 */
    	exports.chain = exports.flatMap;
    	function groupSort(O) {
    	    var sortO = (0, exports.sort)(O);
    	    var groupO = group(O);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? groupO(sortO(as)) : []); };
    	}
    	exports.groupSort = groupSort;
    	function filter(predicate) {
    	    return (0, exports.filterWithIndex)(function (_, a) { return predicate(a); });
    	}
    	exports.filter = filter;
    	/**
    	 * Use [`filterWithIndex`](./Array.ts.html#filterwithindex) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	var filterWithIndex = function (predicate) {
    	    return function (as) {
    	        return (0, exports.fromArray)(as.filter(function (a, i) { return predicate(i, a); }));
    	    };
    	};
    	exports.filterWithIndex = filterWithIndex;
    	/**
    	 * Use [`unprepend`](#unprepend) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.uncons = exports.unprepend;
    	/**
    	 * Use [`unappend`](#unappend) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.unsnoc = exports.unappend;
    	function cons(head, tail) {
    	    return tail === undefined ? (0, exports.prepend)(head) : (0, function_1.pipe)(tail, (0, exports.prepend)(head));
    	}
    	exports.cons = cons;
    	/**
    	 * Use [`append`](./Array.ts.html#append) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	var snoc = function (init, end) { return (0, function_1.pipe)(init, (0, exports.append)(end)); };
    	exports.snoc = snoc;
    	/**
    	 * Use [`prependAll`](#prependall) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.prependToAll = exports.prependAll;
    	/**
    	 * Use [`concatAll`](#concatall) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.fold = RNEA.concatAll;
    	/**
    	 * This instance is deprecated, use small, specific instances instead.
    	 * For example if a function needs a `Functor` instance, pass `NEA.Functor` instead of `NEA.nonEmptyArray`
    	 * (where `NEA` is from `import NEA from 'fp-ts/NonEmptyArray'`)
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.nonEmptyArray = {
    	    URI: exports.URI,
    	    of: exports.of,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    extend: _extend,
    	    extract: exports.extract,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex,
    	    alt: _alt
    	}; 
    } (NonEmptyArray));

    var ReadonlyArray = {};

    var number = {};

    (function (exports) {
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.Field = exports.MonoidProduct = exports.MonoidSum = exports.SemigroupProduct = exports.SemigroupSum = exports.MagmaSub = exports.Show = exports.Bounded = exports.Ord = exports.Eq = exports.isNumber = void 0;
    	// -------------------------------------------------------------------------------------
    	// refinements
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category refinements
    	 * @since 2.11.0
    	 */
    	var isNumber = function (u) { return typeof u === 'number'; };
    	exports.isNumber = isNumber;
    	// -------------------------------------------------------------------------------------
    	// instances
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Eq = {
    	    equals: function (first, second) { return first === second; }
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Ord = {
    	    equals: exports.Eq.equals,
    	    compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Bounded = {
    	    equals: exports.Eq.equals,
    	    compare: exports.Ord.compare,
    	    top: Infinity,
    	    bottom: -Infinity
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Show = {
    	    show: function (n) { return JSON.stringify(n); }
    	};
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.MagmaSub = {
    	    concat: function (first, second) { return first - second; }
    	};
    	/**
    	 * `number` semigroup under addition.
    	 *
    	 * @example
    	 * import { SemigroupSum } from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(SemigroupSum.concat(2, 3), 5)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.SemigroupSum = {
    	    concat: function (first, second) { return first + second; }
    	};
    	/**
    	 * `number` semigroup under multiplication.
    	 *
    	 * @example
    	 * import { SemigroupProduct } from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(SemigroupProduct.concat(2, 3), 6)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.SemigroupProduct = {
    	    concat: function (first, second) { return first * second; }
    	};
    	/**
    	 * `number` monoid under addition.
    	 *
    	 * The `empty` value is `0`.
    	 *
    	 * @example
    	 * import { MonoidSum } from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(MonoidSum.concat(2, MonoidSum.empty), 2)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.MonoidSum = {
    	    concat: exports.SemigroupSum.concat,
    	    empty: 0
    	};
    	/**
    	 * `number` monoid under multiplication.
    	 *
    	 * The `empty` value is `1`.
    	 *
    	 * @example
    	 * import { MonoidProduct } from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(MonoidProduct.concat(2, MonoidProduct.empty), 2)
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.MonoidProduct = {
    	    concat: exports.SemigroupProduct.concat,
    	    empty: 1
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Field = {
    	    add: exports.SemigroupSum.concat,
    	    zero: 0,
    	    mul: exports.SemigroupProduct.concat,
    	    one: 1,
    	    sub: exports.MagmaSub.concat,
    	    degree: function (_) { return 1; },
    	    div: function (first, second) { return first / second; },
    	    mod: function (first, second) { return first % second; }
    	}; 
    } (number));

    var Separated = {};

    (function (exports) {
    	/**
    	 * ```ts
    	 * interface Separated<E, A> {
    	 *    readonly left: E
    	 *    readonly right: A
    	 * }
    	 * ```
    	 *
    	 * Represents a result of separating a whole into two parts.
    	 *
    	 * @since 2.10.0
    	 */
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.right = exports.left = exports.flap = exports.Functor = exports.Bifunctor = exports.URI = exports.bimap = exports.mapLeft = exports.map = exports.separated = void 0;
    	var function_1 = _function;
    	var Functor_1 = Functor;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category constructors
    	 * @since 2.10.0
    	 */
    	var separated = function (left, right) { return ({ left: left, right: right }); };
    	exports.separated = separated;
    	var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
    	var _mapLeft = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapLeft)(f)); };
    	var _bimap = function (fa, g, f) { return (0, function_1.pipe)(fa, (0, exports.bimap)(g, f)); };
    	/**
    	 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
    	 * use the type constructor `F` to represent some computational context.
    	 *
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	var map = function (f) {
    	    return function (fa) {
    	        return (0, exports.separated)((0, exports.left)(fa), f((0, exports.right)(fa)));
    	    };
    	};
    	exports.map = map;
    	/**
    	 * Map a function over the first type argument of a bifunctor.
    	 *
    	 * @category error handling
    	 * @since 2.10.0
    	 */
    	var mapLeft = function (f) {
    	    return function (fa) {
    	        return (0, exports.separated)(f((0, exports.left)(fa)), (0, exports.right)(fa));
    	    };
    	};
    	exports.mapLeft = mapLeft;
    	/**
    	 * Map a pair of functions over the two type arguments of the bifunctor.
    	 *
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	var bimap = function (f, g) {
    	    return function (fa) {
    	        return (0, exports.separated)(f((0, exports.left)(fa)), g((0, exports.right)(fa)));
    	    };
    	};
    	exports.bimap = bimap;
    	/**
    	 * @category type lambdas
    	 * @since 2.10.0
    	 */
    	exports.URI = 'Separated';
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Bifunctor = {
    	    URI: exports.URI,
    	    mapLeft: _mapLeft,
    	    bimap: _bimap
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Functor = {
    	    URI: exports.URI,
    	    map: _map
    	};
    	/**
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	exports.flap = (0, Functor_1.flap)(exports.Functor);
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @since 2.10.0
    	 */
    	var left = function (s) { return s.left; };
    	exports.left = left;
    	/**
    	 * @since 2.10.0
    	 */
    	var right = function (s) { return s.right; };
    	exports.right = right; 
    } (Separated));

    var Witherable = {};

    var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
    Object.defineProperty(Witherable, "__esModule", { value: true });
    Witherable.filterE = Witherable.witherDefault = Witherable.wiltDefault = void 0;
    var _$1 = __importStar(internal);
    function wiltDefault(T, C) {
        return function (F) {
            var traverseF = T.traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), C.separate); };
        };
    }
    Witherable.wiltDefault = wiltDefault;
    function witherDefault(T, C) {
        return function (F) {
            var traverseF = T.traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), C.compact); };
        };
    }
    Witherable.witherDefault = witherDefault;
    function filterE(W) {
        return function (F) {
            var witherF = W.wither(F);
            return function (predicate) { return function (ga) { return witherF(ga, function (a) { return F.map(predicate(a), function (b) { return (b ? _$1.some(a) : _$1.none); }); }); }; };
        };
    }
    Witherable.filterE = filterE;

    var Zero = {};

    Object.defineProperty(Zero, "__esModule", { value: true });
    Zero.guard = void 0;
    function guard(F, P) {
        return function (b) { return (b ? P.of(undefined) : F.zero()); };
    }
    Zero.guard = guard;

    (function (exports) {
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    var desc = Object.getOwnPropertyDescriptor(m, k);
    	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    	      desc = { enumerable: true, get: function() { return m[k]; } };
    	    }
    	    Object.defineProperty(o, k2, desc);
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    	        if (ar || !(i in from)) {
    	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
    	            ar[i] = from[i];
    	        }
    	    }
    	    return to.concat(ar || Array.prototype.slice.call(from));
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.sort = exports.lefts = exports.rights = exports.reverse = exports.modifyAt = exports.deleteAt = exports.updateAt = exports.insertAt = exports.findLastIndex = exports.findLastMap = exports.findLast = exports.findFirstMap = exports.findFirst = exports.findIndex = exports.dropLeftWhile = exports.dropRight = exports.dropLeft = exports.spanLeft = exports.takeLeftWhile = exports.takeRight = exports.takeLeft = exports.init = exports.tail = exports.last = exports.head = exports.lookup = exports.isOutOfBound = exports.size = exports.scanRight = exports.scanLeft = exports.chainWithIndex = exports.foldRight = exports.matchRight = exports.matchRightW = exports.foldLeft = exports.matchLeft = exports.matchLeftW = exports.match = exports.matchW = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.replicate = exports.makeBy = exports.appendW = exports.append = exports.prependW = exports.prepend = exports.isNonEmpty = exports.isEmpty = void 0;
    	exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.reduceRight = exports.reduceWithIndex = exports.foldMap = exports.reduce = exports.foldMapWithIndex = exports.duplicate = exports.extend = exports.filterWithIndex = exports.partitionMapWithIndex = exports.partitionMap = exports.partitionWithIndex = exports.partition = exports.compact = exports.filterMap = exports.filterMapWithIndex = exports.filter = exports.separate = exports.mapWithIndex = exports.map = exports.flatten = exports.flatMap = exports.ap = exports.alt = exports.altW = exports.zero = exports.of = exports._chainRecBreadthFirst = exports._chainRecDepthFirst = exports.difference = exports.intersection = exports.union = exports.concat = exports.concatW = exports.comprehension = exports.fromOptionK = exports.chunksOf = exports.splitAt = exports.chop = exports.sortBy = exports.uniq = exports.elem = exports.rotate = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = void 0;
    	exports.toArray = exports.unsafeDeleteAt = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.fromEitherK = exports.FromEither = exports.filterE = exports.Witherable = exports.ChainRecBreadthFirst = exports.chainRecBreadthFirst = exports.ChainRecDepthFirst = exports.chainRecDepthFirst = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.FilterableWithIndex = exports.Filterable = exports.Compactable = exports.Extend = exports.Alternative = exports.guard = exports.Zero = exports.Alt = exports.Unfoldable = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getDifferenceMagma = exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.getOrd = exports.getEq = exports.getMonoid = exports.getSemigroup = exports.getShow = exports.URI = exports.unfold = exports.wilt = exports.wither = exports.traverseWithIndex = void 0;
    	exports.readonlyArray = exports.prependToAll = exports.snoc = exports.cons = exports.range = exports.chain = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.intercalate = exports.exists = exports.some = exports.every = exports.empty = exports.fromArray = void 0;
    	var Apply_1 = Apply;
    	var Chain_1 = Chain;
    	var Eq_1 = Eq;
    	var FromEither_1 = FromEither;
    	var function_1 = _function;
    	var Functor_1 = Functor;
    	var _ = __importStar(internal);
    	var N = __importStar(number);
    	var Ord_1 = Ord;
    	var RNEA = __importStar(ReadonlyNonEmptyArray);
    	var Separated_1 = Separated;
    	var Witherable_1 = Witherable;
    	var Zero_1 = Zero;
    	// -------------------------------------------------------------------------------------
    	// refinements
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Test whether a `ReadonlyArray` is empty.
    	 *
    	 * @example
    	 * import { isEmpty } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.strictEqual(isEmpty([]), true)
    	 *
    	 * @category refinements
    	 * @since 2.5.0
    	 */
    	var isEmpty = function (as) { return as.length === 0; };
    	exports.isEmpty = isEmpty;
    	/**
    	 * Test whether a `ReadonlyArray` is non empty.
    	 *
    	 * @category refinements
    	 * @since 2.5.0
    	 */
    	exports.isNonEmpty = RNEA.isNonEmpty;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Prepend an element to the front of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @example
    	 * import { prepend } from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	exports.prepend = RNEA.prepend;
    	/**
    	 * Less strict version of [`prepend`](#prepend).
    	 *
    	 * @since 2.11.0
    	 */
    	exports.prependW = RNEA.prependW;
    	/**
    	 * Append an element to the end of a `ReadonlyArray`, creating a new `ReadonlyNonEmptyArray`.
    	 *
    	 * @example
    	 * import { append } from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	exports.append = RNEA.append;
    	/**
    	 * Less strict version of [`append`](#append).
    	 *
    	 * @since 2.11.0
    	 */
    	exports.appendW = RNEA.appendW;
    	/**
    	 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { makeBy } from 'fp-ts/ReadonlyArray'
    	 *
    	 * const double = (n: number): number => n * 2
    	 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
    	 *
    	 * @category constructors
    	 * @since 2.5.0
    	 */
    	var makeBy = function (n, f) { return (n <= 0 ? exports.empty : RNEA.makeBy(f)(n)); };
    	exports.makeBy = makeBy;
    	/**
    	 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { replicate } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
    	 *
    	 * @category constructors
    	 * @since 2.5.0
    	 */
    	var replicate = function (n, a) { return (0, exports.makeBy)(n, function () { return a; }); };
    	exports.replicate = replicate;
    	function fromPredicate(predicate) {
    	    return function (a) { return (predicate(a) ? [a] : exports.empty); };
    	}
    	exports.fromPredicate = fromPredicate;
    	// -------------------------------------------------------------------------------------
    	// conversions
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category conversions
    	 * @since 2.11.0
    	 */
    	var fromOption = function (ma) { return (_.isNone(ma) ? exports.empty : [ma.value]); };
    	exports.fromOption = fromOption;
    	/**
    	 * Transforms an `Either` to a `ReadonlyArray`.
    	 *
    	 * @category conversions
    	 * @since 2.11.0
    	 */
    	var fromEither = function (e) { return (_.isLeft(e) ? exports.empty : [e.right]); };
    	exports.fromEither = fromEither;
    	/**
    	 * Less strict version of [`match`](#match).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(as) : onEmpty();
    	    };
    	};
    	exports.matchW = matchW;
    	/**
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	exports.match = exports.matchW;
    	/**
    	 * Less strict version of [`matchLeft`](#matchleft).
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchLeftW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(RNEA.head(as), RNEA.tail(as)) : onEmpty();
    	    };
    	};
    	exports.matchLeftW = matchLeftW;
    	/**
    	 * Break a `ReadonlyArray` into its first element and remaining elements.
    	 *
    	 * @example
    	 * import { matchLeft } from 'fp-ts/ReadonlyArray'
    	 *
    	 * const len: <A>(as: ReadonlyArray<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
    	 * assert.strictEqual(len([1, 2, 3]), 3)
    	 *
    	 * @category pattern matching
    	 * @since 2.10.0
    	 */
    	exports.matchLeft = exports.matchLeftW;
    	/**
    	 * Alias of [`matchLeft`](#matchleft).
    	 *
    	 * @category pattern matching
    	 * @since 2.5.0
    	 */
    	exports.foldLeft = exports.matchLeft;
    	/**
    	 * Less strict version of [`matchRight`](#matchright).
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchRightW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(RNEA.init(as), RNEA.last(as)) : onEmpty();
    	    };
    	};
    	exports.matchRightW = matchRightW;
    	/**
    	 * Break a `ReadonlyArray` into its initial elements and the last element.
    	 *
    	 * @category pattern matching
    	 * @since 2.10.0
    	 */
    	exports.matchRight = exports.matchRightW;
    	/**
    	 * Alias of [`matchRight`](#matchright).
    	 *
    	 * @category pattern matching
    	 * @since 2.5.0
    	 */
    	exports.foldRight = exports.matchRight;
    	// -------------------------------------------------------------------------------------
    	// combinators
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category sequencing
    	 * @since 2.7.0
    	 */
    	var chainWithIndex = function (f) {
    	    return function (as) {
    	        if ((0, exports.isEmpty)(as)) {
    	            return exports.empty;
    	        }
    	        var out = [];
    	        for (var i = 0; i < as.length; i++) {
    	            out.push.apply(out, f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.chainWithIndex = chainWithIndex;
    	/**
    	 * Same as `reduce` but it carries over the intermediate steps.
    	 *
    	 * @example
    	 * import { scanLeft } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
    	 *
    	 * @since 2.5.0
    	 */
    	var scanLeft = function (b, f) {
    	    return function (as) {
    	        var len = as.length;
    	        var out = new Array(len + 1);
    	        out[0] = b;
    	        for (var i = 0; i < len; i++) {
    	            out[i + 1] = f(out[i], as[i]);
    	        }
    	        return out;
    	    };
    	};
    	exports.scanLeft = scanLeft;
    	/**
    	 * Fold an array from the right, keeping all intermediate results instead of only the final result
    	 *
    	 * @example
    	 * import { scanRight } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
    	 *
    	 * @since 2.5.0
    	 */
    	var scanRight = function (b, f) {
    	    return function (as) {
    	        var len = as.length;
    	        var out = new Array(len + 1);
    	        out[len] = b;
    	        for (var i = len - 1; i >= 0; i--) {
    	            out[i] = f(as[i], out[i + 1]);
    	        }
    	        return out;
    	    };
    	};
    	exports.scanRight = scanRight;
    	/**
    	 * Calculate the number of elements in a `ReadonlyArray`.
    	 *
    	 * @since 2.10.0
    	 */
    	var size = function (as) { return as.length; };
    	exports.size = size;
    	/**
    	 * Test whether an array contains a particular index
    	 *
    	 * @since 2.5.0
    	 */
    	exports.isOutOfBound = RNEA.isOutOfBound;
    	function lookup(i, as) {
    	    return as === undefined ? function (as) { return lookup(i, as); } : (0, exports.isOutOfBound)(i, as) ? _.none : _.some(as[i]);
    	}
    	exports.lookup = lookup;
    	/**
    	 * Get the first element in an array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { head } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
    	 * assert.deepStrictEqual(head([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var head = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(RNEA.head(as)) : _.none); };
    	exports.head = head;
    	/**
    	 * Get the last element in an array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { last } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
    	 * assert.deepStrictEqual(last([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var last = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(RNEA.last(as)) : _.none); };
    	exports.last = last;
    	/**
    	 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { tail } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
    	 * assert.deepStrictEqual(tail([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var tail = function (as) {
    	    return (0, exports.isNonEmpty)(as) ? _.some(RNEA.tail(as)) : _.none;
    	};
    	exports.tail = tail;
    	/**
    	 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { init } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
    	 * assert.deepStrictEqual(init([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var init = function (as) {
    	    return (0, exports.isNonEmpty)(as) ? _.some(RNEA.init(as)) : _.none;
    	};
    	exports.init = init;
    	/**
    	 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const input: ReadonlyArray<number> = [1, 2, 3]
    	 * assert.deepStrictEqual(pipe(input, RA.takeLeft(2)), [1, 2])
    	 *
    	 * // out of bounds
    	 * assert.strictEqual(pipe(input, RA.takeLeft(4)), input)
    	 * assert.strictEqual(pipe(input, RA.takeLeft(-1)), input)
    	 *
    	 * @since 2.5.0
    	 */
    	var takeLeft = function (n) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(n, as) ? as : n === 0 ? exports.empty : as.slice(0, n);
    	    };
    	};
    	exports.takeLeft = takeLeft;
    	/**
    	 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const input: ReadonlyArray<number> = [1, 2, 3]
    	 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
    	 *
    	 * // out of bounds
    	 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
    	 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
    	 *
    	 * @since 2.5.0
    	 */
    	var takeRight = function (n) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(n, as) ? as : n === 0 ? exports.empty : as.slice(-n);
    	    };
    	};
    	exports.takeRight = takeRight;
    	function takeLeftWhile(predicate) {
    	    return function (as) {
    	        var out = [];
    	        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
    	            var a = as_1[_i];
    	            if (!predicate(a)) {
    	                break;
    	            }
    	            out.push(a);
    	        }
    	        var len = out.length;
    	        return len === as.length ? as : len === 0 ? exports.empty : out;
    	    };
    	}
    	exports.takeLeftWhile = takeLeftWhile;
    	var spanLeftIndex = function (as, predicate) {
    	    var l = as.length;
    	    var i = 0;
    	    for (; i < l; i++) {
    	        if (!predicate(as[i])) {
    	            break;
    	        }
    	    }
    	    return i;
    	};
    	function spanLeft(predicate) {
    	    return function (as) {
    	        var _a = (0, exports.splitAt)(spanLeftIndex(as, predicate))(as), init = _a[0], rest = _a[1];
    	        return { init: init, rest: rest };
    	    };
    	}
    	exports.spanLeft = spanLeft;
    	/**
    	 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const input: ReadonlyArray<number> = [1, 2, 3]
    	 * assert.deepStrictEqual(pipe(input, RA.dropLeft(2)), [3])
    	 * assert.strictEqual(pipe(input, RA.dropLeft(0)), input)
    	 * assert.strictEqual(pipe(input, RA.dropLeft(-1)), input)
    	 *
    	 * @since 2.5.0
    	 */
    	var dropLeft = function (n) {
    	    return function (as) {
    	        return n <= 0 || (0, exports.isEmpty)(as) ? as : n >= as.length ? exports.empty : as.slice(n, as.length);
    	    };
    	};
    	exports.dropLeft = dropLeft;
    	/**
    	 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const input: ReadonlyArray<number> = [1, 2, 3]
    	 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
    	 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
    	 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
    	 *
    	 * @since 2.5.0
    	 */
    	var dropRight = function (n) {
    	    return function (as) {
    	        return n <= 0 || (0, exports.isEmpty)(as) ? as : n >= as.length ? exports.empty : as.slice(0, as.length - n);
    	    };
    	};
    	exports.dropRight = dropRight;
    	function dropLeftWhile(predicate) {
    	    return function (as) {
    	        var i = spanLeftIndex(as, predicate);
    	        return i === 0 ? as : i === as.length ? exports.empty : as.slice(i);
    	    };
    	}
    	exports.dropLeftWhile = dropLeftWhile;
    	/**
    	 * Find the first index for which a predicate holds
    	 *
    	 * @example
    	 * import { findIndex } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
    	 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var findIndex = function (predicate) {
    	    return function (as) {
    	        for (var i = 0; i < as.length; i++) {
    	            if (predicate(as[i])) {
    	                return _.some(i);
    	            }
    	        }
    	        return _.none;
    	    };
    	};
    	exports.findIndex = findIndex;
    	function findFirst(predicate) {
    	    return function (as) {
    	        for (var i = 0; i < as.length; i++) {
    	            if (predicate(as[i])) {
    	                return _.some(as[i]);
    	            }
    	        }
    	        return _.none;
    	    };
    	}
    	exports.findFirst = findFirst;
    	/**
    	 * Find the first element returned by an option based selector function
    	 *
    	 * @example
    	 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface Person {
    	 *   readonly name: string
    	 *   readonly age?: number
    	 * }
    	 *
    	 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
    	 *
    	 * // returns the name of the first person that has an age
    	 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
    	 *
    	 * @since 2.5.0
    	 */
    	var findFirstMap = function (f) {
    	    return function (as) {
    	        for (var i = 0; i < as.length; i++) {
    	            var out = f(as[i]);
    	            if (_.isSome(out)) {
    	                return out;
    	            }
    	        }
    	        return _.none;
    	    };
    	};
    	exports.findFirstMap = findFirstMap;
    	function findLast(predicate) {
    	    return function (as) {
    	        for (var i = as.length - 1; i >= 0; i--) {
    	            if (predicate(as[i])) {
    	                return _.some(as[i]);
    	            }
    	        }
    	        return _.none;
    	    };
    	}
    	exports.findLast = findLast;
    	/**
    	 * Find the last element returned by an option based selector function
    	 *
    	 * @example
    	 * import { findLastMap } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface Person {
    	 *   readonly name: string
    	 *   readonly age?: number
    	 * }
    	 *
    	 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
    	 *
    	 * // returns the name of the last person that has an age
    	 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
    	 *
    	 * @since 2.5.0
    	 */
    	var findLastMap = function (f) {
    	    return function (as) {
    	        for (var i = as.length - 1; i >= 0; i--) {
    	            var out = f(as[i]);
    	            if (_.isSome(out)) {
    	                return out;
    	            }
    	        }
    	        return _.none;
    	    };
    	};
    	exports.findLastMap = findLastMap;
    	/**
    	 * Returns the index of the last element of the list which matches the predicate
    	 *
    	 * @example
    	 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface X {
    	 *   readonly a: number
    	 *   readonly b: number
    	 * }
    	 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
    	 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
    	 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
    	 *
    	 *
    	 * @since 2.5.0
    	 */
    	var findLastIndex = function (predicate) {
    	    return function (as) {
    	        for (var i = as.length - 1; i >= 0; i--) {
    	            if (predicate(as[i])) {
    	                return _.some(i);
    	            }
    	        }
    	        return _.none;
    	    };
    	};
    	exports.findLastIndex = findLastIndex;
    	/**
    	 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
    	 *
    	 * @example
    	 * import { insertAt } from 'fp-ts/ReadonlyArray'
    	 * import { some } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
    	 *
    	 * @since 2.5.0
    	 */
    	var insertAt = function (i, a) {
    	    return function (as) {
    	        return i < 0 || i > as.length ? _.none : _.some(RNEA.unsafeInsertAt(i, a, as));
    	    };
    	};
    	exports.insertAt = insertAt;
    	/**
    	 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
    	 *
    	 * @example
    	 * import { updateAt } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
    	 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var updateAt = function (i, a) {
    	    return (0, exports.modifyAt)(i, function () { return a; });
    	};
    	exports.updateAt = updateAt;
    	/**
    	 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
    	 *
    	 * @example
    	 * import { deleteAt } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
    	 * assert.deepStrictEqual(deleteAt(1)([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var deleteAt = function (i) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeDeleteAt)(i, as));
    	    };
    	};
    	exports.deleteAt = deleteAt;
    	/**
    	 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
    	 * of bounds
    	 *
    	 * @example
    	 * import { modifyAt } from 'fp-ts/ReadonlyArray'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * const double = (x: number): number => x * 2
    	 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
    	 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
    	 *
    	 * @since 2.5.0
    	 */
    	var modifyAt = function (i, f) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    	    };
    	};
    	exports.modifyAt = modifyAt;
    	/**
    	 * Reverse an array, creating a new array
    	 *
    	 * @example
    	 * import { reverse } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
    	 *
    	 * @since 2.5.0
    	 */
    	var reverse = function (as) { return (as.length <= 1 ? as : as.slice().reverse()); };
    	exports.reverse = reverse;
    	/**
    	 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
    	 *
    	 * @example
    	 * import { rights } from 'fp-ts/ReadonlyArray'
    	 * import { right, left } from 'fp-ts/Either'
    	 *
    	 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
    	 *
    	 * @since 2.5.0
    	 */
    	var rights = function (as) {
    	    var r = [];
    	    for (var i = 0; i < as.length; i++) {
    	        var a = as[i];
    	        if (a._tag === 'Right') {
    	            r.push(a.right);
    	        }
    	    }
    	    return r;
    	};
    	exports.rights = rights;
    	/**
    	 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
    	 *
    	 * @example
    	 * import { lefts } from 'fp-ts/ReadonlyArray'
    	 * import { left, right } from 'fp-ts/Either'
    	 *
    	 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
    	 *
    	 * @since 2.5.0
    	 */
    	var lefts = function (as) {
    	    var r = [];
    	    for (var i = 0; i < as.length; i++) {
    	        var a = as[i];
    	        if (a._tag === 'Left') {
    	            r.push(a.left);
    	        }
    	    }
    	    return r;
    	};
    	exports.lefts = lefts;
    	/**
    	 * Sort the elements of an array in increasing order, creating a new array
    	 *
    	 * @example
    	 * import { sort } from 'fp-ts/ReadonlyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
    	 *
    	 * @since 2.5.0
    	 */
    	var sort = function (O) {
    	    return function (as) {
    	        return as.length <= 1 ? as : as.slice().sort(O.compare);
    	    };
    	};
    	exports.sort = sort;
    	// TODO: curry and make data-last in v3
    	/**
    	 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
    	 * input array is short, excess elements of the longer array are discarded.
    	 *
    	 * @example
    	 * import { zipWith } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
    	 *
    	 * @since 2.5.0
    	 */
    	var zipWith = function (fa, fb, f) {
    	    var fc = [];
    	    var len = Math.min(fa.length, fb.length);
    	    for (var i = 0; i < len; i++) {
    	        fc[i] = f(fa[i], fb[i]);
    	    }
    	    return fc;
    	};
    	exports.zipWith = zipWith;
    	function zip(as, bs) {
    	    if (bs === undefined) {
    	        return function (bs) { return zip(bs, as); };
    	    }
    	    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
    	}
    	exports.zip = zip;
    	/**
    	 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
    	 *
    	 * @example
    	 * import { unzip } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
    	 *
    	 * @since 2.5.0
    	 */
    	var unzip = function (as) {
    	    var fa = [];
    	    var fb = [];
    	    for (var i = 0; i < as.length; i++) {
    	        fa[i] = as[i][0];
    	        fb[i] = as[i][1];
    	    }
    	    return [fa, fb];
    	};
    	exports.unzip = unzip;
    	/**
    	 * Prepend an element to every member of an array
    	 *
    	 * @example
    	 * import { prependAll } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	var prependAll = function (middle) {
    	    var f = RNEA.prependAll(middle);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
    	};
    	exports.prependAll = prependAll;
    	/**
    	 * Places an element in between members of an array
    	 *
    	 * @example
    	 * import { intersperse } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var intersperse = function (middle) {
    	    var f = RNEA.intersperse(middle);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
    	};
    	exports.intersperse = intersperse;
    	/**
    	 * Rotate a `ReadonlyArray` by `n` steps.
    	 *
    	 * @example
    	 * import { rotate } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    	 *
    	 * @since 2.5.0
    	 */
    	var rotate = function (n) {
    	    var f = RNEA.rotate(n);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
    	};
    	exports.rotate = rotate;
    	function elem(E) {
    	    return function (a, as) {
    	        if (as === undefined) {
    	            var elemE_1 = elem(E);
    	            return function (as) { return elemE_1(a, as); };
    	        }
    	        var predicate = function (element) { return E.equals(element, a); };
    	        var i = 0;
    	        for (; i < as.length; i++) {
    	            if (predicate(as[i])) {
    	                return true;
    	            }
    	        }
    	        return false;
    	    };
    	}
    	exports.elem = elem;
    	/**
    	 * Remove duplicates from an array, keeping the first occurrence of an element.
    	 *
    	 * @example
    	 * import { uniq } from 'fp-ts/ReadonlyArray'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
    	 *
    	 * @since 2.5.0
    	 */
    	var uniq = function (E) {
    	    var f = RNEA.uniq(E);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
    	};
    	exports.uniq = uniq;
    	/**
    	 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
    	 * etc...
    	 *
    	 * @example
    	 * import { sortBy } from 'fp-ts/ReadonlyArray'
    	 * import { contramap } from 'fp-ts/Ord'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * interface Person {
    	 *   readonly name: string
    	 *   readonly age: number
    	 * }
    	 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
    	 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
    	 *
    	 * const sortByNameByAge = sortBy([byName, byAge])
    	 *
    	 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
    	 * assert.deepStrictEqual(sortByNameByAge(persons), [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 2 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 }
    	 * ])
    	 *
    	 * @since 2.5.0
    	 */
    	var sortBy = function (ords) {
    	    var f = RNEA.sortBy(ords);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : as); };
    	};
    	exports.sortBy = sortBy;
    	/**
    	 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
    	 * `ReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
    	 * value and the tail of the `ReadonlyArray`.
    	 *
    	 * @example
    	 * import { Eq } from 'fp-ts/Eq'
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const group = <A>(S: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
    	 *   return RA.chop(as => {
    	 *     const { init, rest } = pipe(as, RA.spanLeft((a: A) => S.equals(a, as[0])))
    	 *     return [init, rest]
    	 *   })
    	 * }
    	 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
    	 *
    	 * @since 2.5.0
    	 */
    	var chop = function (f) {
    	    var g = RNEA.chop(f);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? g(as) : exports.empty); };
    	};
    	exports.chop = chop;
    	/**
    	 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
    	 *
    	 * @example
    	 * import { splitAt } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
    	 *
    	 * @since 2.5.0
    	 */
    	var splitAt = function (n) {
    	    return function (as) {
    	        return n >= 1 && (0, exports.isNonEmpty)(as) ? RNEA.splitAt(n)(as) : (0, exports.isEmpty)(as) ? [as, exports.empty] : [exports.empty, as];
    	    };
    	};
    	exports.splitAt = splitAt;
    	/**
    	 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
    	 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
    	 * definition of `chunksOf`; it satisfies the property that:
    	 *
    	 * ```ts
    	 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
    	 * ```
    	 *
    	 * whenever `n` evenly divides the length of `as`.
    	 *
    	 * @example
    	 * import { chunksOf } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
    	 *
    	 * @since 2.5.0
    	 */
    	var chunksOf = function (n) {
    	    var f = RNEA.chunksOf(n);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : exports.empty); };
    	};
    	exports.chunksOf = chunksOf;
    	/**
    	 * @category lifting
    	 * @since 2.11.0
    	 */
    	var fromOptionK = function (f) {
    	    return function () {
    	        var a = [];
    	        for (var _i = 0; _i < arguments.length; _i++) {
    	            a[_i] = arguments[_i];
    	        }
    	        return (0, exports.fromOption)(f.apply(void 0, a));
    	    };
    	};
    	exports.fromOptionK = fromOptionK;
    	function comprehension(input, f, g) {
    	    if (g === void 0) { g = function () { return true; }; }
    	    var go = function (scope, input) {
    	        return (0, exports.isNonEmpty)(input)
    	            ? (0, exports.flatMap)(RNEA.head(input), function (a) { return go((0, function_1.pipe)(scope, (0, exports.append)(a)), RNEA.tail(input)); })
    	            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
    	                : exports.empty;
    	    };
    	    return go(exports.empty, input);
    	}
    	exports.comprehension = comprehension;
    	/**
    	 * @since 2.11.0
    	 */
    	var concatW = function (second) {
    	    return function (first) {
    	        return (0, exports.isEmpty)(first) ? second : (0, exports.isEmpty)(second) ? first : first.concat(second);
    	    };
    	};
    	exports.concatW = concatW;
    	/**
    	 * @since 2.11.0
    	 */
    	exports.concat = exports.concatW;
    	function union(E) {
    	    var unionE = RNEA.union(E);
    	    return function (first, second) {
    	        if (second === undefined) {
    	            var unionE_1 = union(E);
    	            return function (second) { return unionE_1(second, first); };
    	        }
    	        return (0, exports.isNonEmpty)(first) && (0, exports.isNonEmpty)(second) ? unionE(second)(first) : (0, exports.isNonEmpty)(first) ? first : second;
    	    };
    	}
    	exports.union = union;
    	function intersection(E) {
    	    var elemE = elem(E);
    	    return function (xs, ys) {
    	        if (ys === undefined) {
    	            var intersectionE_1 = intersection(E);
    	            return function (ys) { return intersectionE_1(ys, xs); };
    	        }
    	        return xs.filter(function (a) { return elemE(a, ys); });
    	    };
    	}
    	exports.intersection = intersection;
    	function difference(E) {
    	    var elemE = elem(E);
    	    return function (xs, ys) {
    	        if (ys === undefined) {
    	            var differenceE_1 = difference(E);
    	            return function (ys) { return differenceE_1(ys, xs); };
    	        }
    	        return xs.filter(function (a) { return !elemE(a, ys); });
    	    };
    	}
    	exports.difference = difference;
    	var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
    	var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
    	var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
    	var _filter = function (fa, predicate) {
    	    return (0, function_1.pipe)(fa, (0, exports.filter)(predicate));
    	};
    	var _filterMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMap)(f)); };
    	var _partition = function (fa, predicate) {
    	    return (0, function_1.pipe)(fa, (0, exports.partition)(predicate));
    	};
    	var _partitionMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMap)(f)); };
    	var _partitionWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.partitionWithIndex)(predicateWithIndex)); };
    	var _partitionMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMapWithIndex)(f)); };
    	var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
    	var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
    	var _foldMap = function (M) {
    	    var foldMapM = (0, exports.foldMap)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
    	};
    	var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
    	var _reduceWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
    	};
    	var _foldMapWithIndex = function (M) {
    	    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
    	};
    	var _reduceRightWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
    	};
    	var _filterMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMapWithIndex)(f)); };
    	var _filterWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.filterWithIndex)(predicateWithIndex)); };
    	var _extend = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.extend)(f)); };
    	var _traverse = function (F) {
    	    var traverseF = (0, exports.traverse)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
    	};
    	/* istanbul ignore next */
    	var _traverseWithIndex = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
    	};
    	/** @internal */
    	var _chainRecDepthFirst = function (a, f) { return (0, function_1.pipe)(a, (0, exports.chainRecDepthFirst)(f)); };
    	exports._chainRecDepthFirst = _chainRecDepthFirst;
    	/** @internal */
    	var _chainRecBreadthFirst = function (a, f) { return (0, function_1.pipe)(a, (0, exports.chainRecBreadthFirst)(f)); };
    	exports._chainRecBreadthFirst = _chainRecBreadthFirst;
    	/**
    	 * @category constructors
    	 * @since 2.5.0
    	 */
    	exports.of = RNEA.of;
    	/**
    	 * @since 2.7.0
    	 */
    	var zero = function () { return exports.empty; };
    	exports.zero = zero;
    	/**
    	 * Less strict version of [`alt`](#alt).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the return types will be merged.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.altW(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 2, 3, 'a', 'b']
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.9.0
    	 */
    	var altW = function (that) {
    	    return function (fa) {
    	        return fa.concat(that());
    	    };
    	};
    	exports.altW = altW;
    	/**
    	 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
    	 * types of kind `* -> *`.
    	 *
    	 * In case of `ReadonlyArray` concatenates the inputs into a single array.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.alt(() => [4, 5])
    	 *   ),
    	 *   [1, 2, 3, 4, 5]
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.5.0
    	 */
    	exports.alt = exports.altW;
    	/**
    	 * @since 2.5.0
    	 */
    	var ap = function (fa) {
    	    return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); });
    	};
    	exports.ap = ap;
    	/**
    	 * Composes computations in sequence, using the return value of one computation to determine the next computation.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.flatMap((n) => [`a${n}`, `b${n}`])
    	 *   ),
    	 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
    	 * )
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.flatMap(() => [])
    	 *   ),
    	 *   []
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.14.0
    	 */
    	exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    	    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
    	});
    	/**
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.flatten = (0, exports.flatMap)(function_1.identity);
    	/**
    	 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
    	 * use the type constructor `F` to represent some computational context.
    	 *
    	 * @category mapping
    	 * @since 2.5.0
    	 */
    	var map = function (f) { return function (fa) {
    	    return fa.map(function (a) { return f(a); });
    	}; };
    	exports.map = map;
    	/**
    	 * @category mapping
    	 * @since 2.5.0
    	 */
    	var mapWithIndex = function (f) { return function (fa) {
    	    return fa.map(function (a, i) { return f(i, a); });
    	}; };
    	exports.mapWithIndex = mapWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var separate = function (fa) {
    	    var left = [];
    	    var right = [];
    	    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
    	        var e = fa_1[_i];
    	        if (e._tag === 'Left') {
    	            left.push(e.left);
    	        }
    	        else {
    	            right.push(e.right);
    	        }
    	    }
    	    return (0, Separated_1.separated)(left, right);
    	};
    	exports.separate = separate;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var filter = function (predicate) {
    	    return function (as) {
    	        return as.filter(predicate);
    	    };
    	};
    	exports.filter = filter;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var filterMapWithIndex = function (f) {
    	    return function (fa) {
    	        var out = [];
    	        for (var i = 0; i < fa.length; i++) {
    	            var optionB = f(i, fa[i]);
    	            if (_.isSome(optionB)) {
    	                out.push(optionB.value);
    	            }
    	        }
    	        return out;
    	    };
    	};
    	exports.filterMapWithIndex = filterMapWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var filterMap = function (f) {
    	    return (0, exports.filterMapWithIndex)(function (_, a) { return f(a); });
    	};
    	exports.filterMap = filterMap;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	exports.compact = (0, exports.filterMap)(function_1.identity);
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var partition = function (predicate) {
    	    return (0, exports.partitionWithIndex)(function (_, a) { return predicate(a); });
    	};
    	exports.partition = partition;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var partitionWithIndex = function (predicateWithIndex) {
    	    return function (as) {
    	        var left = [];
    	        var right = [];
    	        for (var i = 0; i < as.length; i++) {
    	            var a = as[i];
    	            if (predicateWithIndex(i, a)) {
    	                right.push(a);
    	            }
    	            else {
    	                left.push(a);
    	            }
    	        }
    	        return (0, Separated_1.separated)(left, right);
    	    };
    	};
    	exports.partitionWithIndex = partitionWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var partitionMap = function (f) {
    	    return (0, exports.partitionMapWithIndex)(function (_, a) { return f(a); });
    	};
    	exports.partitionMap = partitionMap;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var partitionMapWithIndex = function (f) {
    	    return function (fa) {
    	        var left = [];
    	        var right = [];
    	        for (var i = 0; i < fa.length; i++) {
    	            var e = f(i, fa[i]);
    	            if (e._tag === 'Left') {
    	                left.push(e.left);
    	            }
    	            else {
    	                right.push(e.right);
    	            }
    	        }
    	        return (0, Separated_1.separated)(left, right);
    	    };
    	};
    	exports.partitionMapWithIndex = partitionMapWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.5.0
    	 */
    	var filterWithIndex = function (predicateWithIndex) {
    	    return function (as) {
    	        return as.filter(function (a, i) { return predicateWithIndex(i, a); });
    	    };
    	};
    	exports.filterWithIndex = filterWithIndex;
    	/**
    	 * @since 2.5.0
    	 */
    	var extend = function (f) { return function (wa) {
    	    return wa.map(function (_, i) { return f(wa.slice(i)); });
    	}; };
    	exports.extend = extend;
    	/**
    	 * @since 2.5.0
    	 */
    	exports.duplicate = (0, exports.extend)(function_1.identity);
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var foldMapWithIndex = function (M) {
    	    return function (f) {
    	        return function (fa) {
    	            return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
    	        };
    	    };
    	};
    	exports.foldMapWithIndex = foldMapWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduce = function (b, f) {
    	    return (0, exports.reduceWithIndex)(b, function (_, b, a) { return f(b, a); });
    	};
    	exports.reduce = reduce;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var foldMap = function (M) {
    	    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    	    return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
    	};
    	exports.foldMap = foldMap;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceWithIndex = function (b, f) { return function (fa) {
    	    var len = fa.length;
    	    var out = b;
    	    for (var i = 0; i < len; i++) {
    	        out = f(i, out, fa[i]);
    	    }
    	    return out;
    	}; };
    	exports.reduceWithIndex = reduceWithIndex;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceRight = function (b, f) {
    	    return (0, exports.reduceRightWithIndex)(b, function (_, a, b) { return f(a, b); });
    	};
    	exports.reduceRight = reduceRight;
    	/**
    	 * @category folding
    	 * @since 2.5.0
    	 */
    	var reduceRightWithIndex = function (b, f) { return function (fa) {
    	    return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
    	}; };
    	exports.reduceRightWithIndex = reduceRightWithIndex;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var traverse = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
    	};
    	exports.traverse = traverse;
    	/**
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var sequence = function (F) {
    	    return function (ta) {
    	        return _reduce(ta, F.of((0, exports.zero)()), function (fas, fa) {
    	            return F.ap(F.map(fas, function (as) { return function (a) { return (0, function_1.pipe)(as, (0, exports.append)(a)); }; }), fa);
    	        });
    	    };
    	};
    	exports.sequence = sequence;
    	/**
    	 * @category sequencing
    	 * @since 2.6.3
    	 */
    	var traverseWithIndex = function (F) {
    	    return function (f) {
    	        return (0, exports.reduceWithIndex)(F.of((0, exports.zero)()), function (i, fbs, a) {
    	            return F.ap(F.map(fbs, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, a));
    	        });
    	    };
    	};
    	exports.traverseWithIndex = traverseWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.6.5
    	 */
    	var wither = function (F) {
    	    var _witherF = _wither(F);
    	    return function (f) { return function (fa) { return _witherF(fa, f); }; };
    	};
    	exports.wither = wither;
    	/**
    	 * @category filtering
    	 * @since 2.6.5
    	 */
    	var wilt = function (F) {
    	    var _wiltF = _wilt(F);
    	    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
    	};
    	exports.wilt = wilt;
    	/**
    	 * @since 2.6.6
    	 */
    	var unfold = function (b, f) {
    	    var out = [];
    	    var bb = b;
    	    // eslint-disable-next-line no-constant-condition
    	    while (true) {
    	        var mt = f(bb);
    	        if (_.isSome(mt)) {
    	            var _a = mt.value, a = _a[0], b_1 = _a[1];
    	            out.push(a);
    	            bb = b_1;
    	        }
    	        else {
    	            break;
    	        }
    	    }
    	    return out;
    	};
    	exports.unfold = unfold;
    	/**
    	 * @category type lambdas
    	 * @since 2.5.0
    	 */
    	exports.URI = 'ReadonlyArray';
    	/**
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getShow = function (S) { return ({
    	    show: function (as) { return "[".concat(as.map(S.show).join(', '), "]"); }
    	}); };
    	exports.getShow = getShow;
    	/**
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: function (first, second) { return ((0, exports.isEmpty)(first) ? second : (0, exports.isEmpty)(second) ? first : first.concat(second)); }
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * Returns a `Monoid` for `ReadonlyArray<A>`.
    	 *
    	 * @example
    	 * import { getMonoid } from 'fp-ts/ReadonlyArray'
    	 *
    	 * const M = getMonoid<number>()
    	 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
    	 *
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getMonoid = function () { return ({
    	    concat: (0, exports.getSemigroup)().concat,
    	    empty: exports.empty
    	}); };
    	exports.getMonoid = getMonoid;
    	/**
    	 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
    	 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
    	 * different lengths, the result is non equality.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { getEq } from 'fp-ts/ReadonlyArray'
    	 *
    	 * const E = getEq(S.Eq)
    	 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
    	 * assert.strictEqual(E.equals(['a'], []), false)
    	 *
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getEq = function (E) {
    	    return (0, Eq_1.fromEquals)(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
    	};
    	exports.getEq = getEq;
    	/**
    	 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
    	 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
    	 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
    	 * the same length, the result is equality.
    	 *
    	 * @example
    	 * import { getOrd } from 'fp-ts/ReadonlyArray'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * const O = getOrd(S.Ord)
    	 * assert.strictEqual(O.compare(['b'], ['a']), 1)
    	 * assert.strictEqual(O.compare(['a'], ['a']), 0)
    	 * assert.strictEqual(O.compare(['a'], ['b']), -1)
    	 *
    	 *
    	 * @category instances
    	 * @since 2.5.0
    	 */
    	var getOrd = function (O) {
    	    return (0, Ord_1.fromCompare)(function (a, b) {
    	        var aLen = a.length;
    	        var bLen = b.length;
    	        var len = Math.min(aLen, bLen);
    	        for (var i = 0; i < len; i++) {
    	            var ordering = O.compare(a[i], b[i]);
    	            if (ordering !== 0) {
    	                return ordering;
    	            }
    	        }
    	        return N.Ord.compare(aLen, bLen);
    	    });
    	};
    	exports.getOrd = getOrd;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getUnionSemigroup = function (E) {
    	    var unionE = union(E);
    	    return {
    	        concat: function (first, second) { return unionE(second)(first); }
    	    };
    	};
    	exports.getUnionSemigroup = getUnionSemigroup;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getUnionMonoid = function (E) { return ({
    	    concat: (0, exports.getUnionSemigroup)(E).concat,
    	    empty: exports.empty
    	}); };
    	exports.getUnionMonoid = getUnionMonoid;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getIntersectionSemigroup = function (E) {
    	    var intersectionE = intersection(E);
    	    return {
    	        concat: function (first, second) { return intersectionE(second)(first); }
    	    };
    	};
    	exports.getIntersectionSemigroup = getIntersectionSemigroup;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getDifferenceMagma = function (E) {
    	    var differenceE = difference(E);
    	    return {
    	        concat: function (first, second) { return differenceE(second)(first); }
    	    };
    	};
    	exports.getDifferenceMagma = getDifferenceMagma;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Functor = {
    	    URI: exports.URI,
    	    map: _map
    	};
    	/**
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	exports.flap = (0, Functor_1.flap)(exports.Functor);
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Pointed = {
    	    URI: exports.URI,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FunctorWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Apply = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap
    	};
    	/**
    	 * Combine two effectful actions, keeping only the result of the first.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
    	/**
    	 * Combine two effectful actions, keeping only the result of the second.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Applicative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Chain = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Monad = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap
    	};
    	/**
    	 * Composes computations in sequence, using the return value of one computation to determine the next computation and
    	 * keeping only the result of the first.
    	 *
    	 * @example
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.chainFirst(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 1, 2, 2, 3, 3]
    	 * )
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     RA.chainFirst(() => [])
    	 *   ),
    	 *   []
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.chainFirst = 
    	/*#__PURE__*/ (0, Chain_1.chainFirst)(exports.Chain);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Unfoldable = {
    	    URI: exports.URI,
    	    unfold: exports.unfold
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alt = {
    	    URI: exports.URI,
    	    map: _map,
    	    alt: _alt
    	};
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.Zero = {
    	    URI: exports.URI,
    	    zero: exports.zero
    	};
    	/**
    	 * @category do notation
    	 * @since 2.11.0
    	 */
    	exports.guard = (0, Zero_1.guard)(exports.Zero, exports.Pointed);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alternative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    alt: _alt,
    	    zero: exports.zero
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Extend = {
    	    URI: exports.URI,
    	    map: _map,
    	    extend: _extend
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Compactable = {
    	    URI: exports.URI,
    	    compact: exports.compact,
    	    separate: exports.separate
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Filterable = {
    	    URI: exports.URI,
    	    map: _map,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FilterableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    partitionMapWithIndex: _partitionMapWithIndex,
    	    partitionWithIndex: _partitionWithIndex,
    	    filterMapWithIndex: _filterMapWithIndex,
    	    filterWithIndex: _filterWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Foldable = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FoldableWithIndex = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Traversable = {
    	    URI: exports.URI,
    	    map: _map,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.TraversableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    traverseWithIndex: _traverseWithIndex
    	};
    	/**
    	 * @category sequencing
    	 * @since 2.11.0
    	 */
    	var chainRecDepthFirst = function (f) {
    	    return function (a) {
    	        var todo = __spreadArray([], f(a), true);
    	        var out = [];
    	        while (todo.length > 0) {
    	            var e = todo.shift();
    	            if (_.isLeft(e)) {
    	                todo.unshift.apply(todo, f(e.left));
    	            }
    	            else {
    	                out.push(e.right);
    	            }
    	        }
    	        return out;
    	    };
    	};
    	exports.chainRecDepthFirst = chainRecDepthFirst;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.ChainRecDepthFirst = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    chainRec: exports._chainRecDepthFirst
    	};
    	/**
    	 * @category sequencing
    	 * @since 2.11.0
    	 */
    	var chainRecBreadthFirst = function (f) {
    	    return function (a) {
    	        var initial = f(a);
    	        var todo = [];
    	        var out = [];
    	        function go(e) {
    	            if (_.isLeft(e)) {
    	                f(e.left).forEach(function (v) { return todo.push(v); });
    	            }
    	            else {
    	                out.push(e.right);
    	            }
    	        }
    	        for (var _i = 0, initial_1 = initial; _i < initial_1.length; _i++) {
    	            var e = initial_1[_i];
    	            go(e);
    	        }
    	        while (todo.length > 0) {
    	            go(todo.shift());
    	        }
    	        return out;
    	    };
    	};
    	exports.chainRecBreadthFirst = chainRecBreadthFirst;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.ChainRecBreadthFirst = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    chainRec: exports._chainRecBreadthFirst
    	};
    	var _wither = /*#__PURE__*/ (0, Witherable_1.witherDefault)(exports.Traversable, exports.Compactable);
    	var _wilt = /*#__PURE__*/ (0, Witherable_1.wiltDefault)(exports.Traversable, exports.Compactable);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Witherable = {
    	    URI: exports.URI,
    	    map: _map,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    wither: _wither,
    	    wilt: _wilt
    	};
    	/**
    	 * Filter values inside a context.
    	 *
    	 * @example
    	 * import { pipe } from 'fp-ts/function'
    	 * import * as RA from 'fp-ts/ReadonlyArray'
    	 * import * as T from 'fp-ts/Task'
    	 *
    	 * const filterE = RA.filterE(T.ApplicativePar)
    	 * async function test() {
    	 *   assert.deepStrictEqual(
    	 *     await pipe(
    	 *       [-1, 2, 3],
    	 *       filterE((n) => T.of(n > 0))
    	 *     )(),
    	 *     [2, 3]
    	 *   )
    	 * }
    	 * test()
    	 *
    	 * @since 2.11.0
    	 */
    	exports.filterE = (0, Witherable_1.filterE)(exports.Witherable);
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.FromEither = {
    	    URI: exports.URI,
    	    fromEither: exports.fromEither
    	};
    	/**
    	 * @category lifting
    	 * @since 2.11.0
    	 */
    	exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
    	// -------------------------------------------------------------------------------------
    	// unsafe
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category unsafe
    	 * @since 2.5.0
    	 */
    	exports.unsafeInsertAt = RNEA.unsafeInsertAt;
    	/**
    	 * @category unsafe
    	 * @since 2.5.0
    	 */
    	var unsafeUpdateAt = function (i, a, as) {
    	    return (0, exports.isNonEmpty)(as) ? RNEA.unsafeUpdateAt(i, a, as) : as;
    	};
    	exports.unsafeUpdateAt = unsafeUpdateAt;
    	/**
    	 * @category unsafe
    	 * @since 2.5.0
    	 */
    	var unsafeDeleteAt = function (i, as) {
    	    var xs = as.slice();
    	    xs.splice(i, 1);
    	    return xs;
    	};
    	exports.unsafeDeleteAt = unsafeDeleteAt;
    	/**
    	 * @category conversions
    	 * @since 2.5.0
    	 */
    	var toArray = function (as) { return as.slice(); };
    	exports.toArray = toArray;
    	/**
    	 * @category conversions
    	 * @since 2.5.0
    	 */
    	var fromArray = function (as) { return ((0, exports.isEmpty)(as) ? exports.empty : as.slice()); };
    	exports.fromArray = fromArray;
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * An empty array
    	 *
    	 * @since 2.5.0
    	 */
    	exports.empty = RNEA.empty;
    	function every(predicate) {
    	    return function (as) { return as.every(predicate); };
    	}
    	exports.every = every;
    	/**
    	 * Check if a predicate holds true for any array member.
    	 *
    	 * @example
    	 * import { some } from 'fp-ts/ReadonlyArray'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const isPositive = (n: number): boolean => n > 0
    	 *
    	 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
    	 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
    	 *
    	 * @since 2.9.0
    	 */
    	var some = function (predicate) {
    	    return function (as) {
    	        return as.some(predicate);
    	    };
    	};
    	exports.some = some;
    	/**
    	 * Alias of [`some`](#some)
    	 *
    	 * @since 2.11.0
    	 */
    	exports.exists = exports.some;
    	/**
    	 * Places an element in between members of a `ReadonlyArray`, then folds the results using the provided `Monoid`.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { intercalate } from 'fp-ts/ReadonlyArray'
    	 *
    	 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
    	 *
    	 * @since 2.12.0
    	 */
    	var intercalate = function (M) {
    	    var intercalateM = RNEA.intercalate(M);
    	    return function (middle) { return (0, exports.match)(function () { return M.empty; }, intercalateM(middle)); };
    	};
    	exports.intercalate = intercalate;
    	// -------------------------------------------------------------------------------------
    	// do notation
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category do notation
    	 * @since 2.9.0
    	 */
    	exports.Do = (0, exports.of)(_.emptyRecord);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
    	var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
    	exports.let = let_;
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bind = (0, Chain_1.bind)(exports.Chain);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.apS = (0, Apply_1.apS)(exports.Apply);
    	// -------------------------------------------------------------------------------------
    	// legacy
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Alias of `flatMap`.
    	 *
    	 * @category legacy
    	 * @since 2.5.0
    	 */
    	exports.chain = exports.flatMap;
    	// -------------------------------------------------------------------------------------
    	// deprecated
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Use `ReadonlyNonEmptyArray` module instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.range = RNEA.range;
    	/**
    	 * Use [`prepend`](#prepend) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.cons = RNEA.cons;
    	/**
    	 * Use [`append`](#append) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.snoc = RNEA.snoc;
    	/**
    	 * Use [`prependAll`](#prependall) instead.
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.prependToAll = exports.prependAll;
    	/**
    	 * This instance is deprecated, use small, specific instances instead.
    	 * For example if a function needs a `Functor` instance, pass `RA.Functor` instead of `RA.readonlyArray`
    	 * (where `RA` is from `import RA from 'fp-ts/ReadonlyArray'`)
    	 *
    	 * @category zone of death
    	 * @since 2.5.0
    	 * @deprecated
    	 */
    	exports.readonlyArray = {
    	    URI: exports.URI,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    mapWithIndex: _mapWithIndex,
    	    partitionMapWithIndex: _partitionMapWithIndex,
    	    partitionWithIndex: _partitionWithIndex,
    	    filterMapWithIndex: _filterMapWithIndex,
    	    filterWithIndex: _filterWithIndex,
    	    alt: _alt,
    	    zero: exports.zero,
    	    unfold: exports.unfold,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex,
    	    extend: _extend,
    	    wither: _wither,
    	    wilt: _wilt
    	}; 
    } (ReadonlyArray));

    (function (exports) {
    	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    var desc = Object.getOwnPropertyDescriptor(m, k);
    	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    	      desc = { enumerable: true, get: function() { return m[k]; } };
    	    }
    	    Object.defineProperty(o, k2, desc);
    	}) : (function(o, m, k, k2) {
    	    if (k2 === undefined) k2 = k;
    	    o[k2] = m[k];
    	}));
    	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    	}) : function(o, v) {
    	    o["default"] = v;
    	});
    	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    	    if (mod && mod.__esModule) return mod;
    	    var result = {};
    	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    	    __setModuleDefault(result, mod);
    	    return result;
    	};
    	Object.defineProperty(exports, "__esModule", { value: true });
    	exports.lefts = exports.rights = exports.reverse = exports.modifyAt = exports.deleteAt = exports.updateAt = exports.insertAt = exports.copy = exports.findLastIndex = exports.findLastMap = exports.findLast = exports.findFirstMap = exports.findFirst = exports.findIndex = exports.dropLeftWhile = exports.dropRight = exports.dropLeft = exports.spanLeft = exports.takeLeftWhile = exports.takeRight = exports.takeLeft = exports.init = exports.tail = exports.last = exports.head = exports.lookup = exports.isOutOfBound = exports.size = exports.scanRight = exports.scanLeft = exports.chainWithIndex = exports.foldRight = exports.matchRight = exports.matchRightW = exports.foldLeft = exports.matchLeft = exports.matchLeftW = exports.match = exports.matchW = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.replicate = exports.makeBy = exports.appendW = exports.append = exports.prependW = exports.prepend = exports.isNonEmpty = exports.isEmpty = void 0;
    	exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.reduceRight = exports.reduceWithIndex = exports.reduce = exports.foldMapWithIndex = exports.foldMap = exports.duplicate = exports.extend = exports.filterWithIndex = exports.alt = exports.altW = exports.partitionMapWithIndex = exports.partitionMap = exports.partitionWithIndex = exports.partition = exports.filter = exports.separate = exports.compact = exports.filterMap = exports.filterMapWithIndex = exports.mapWithIndex = exports.flatten = exports.flatMap = exports.ap = exports.map = exports.zero = exports.of = exports.difference = exports.intersection = exports.union = exports.concat = exports.concatW = exports.comprehension = exports.fromOptionK = exports.chunksOf = exports.splitAt = exports.chop = exports.sortBy = exports.uniq = exports.elem = exports.rotate = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = exports.sort = void 0;
    	exports.some = exports.every = exports.unsafeDeleteAt = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.fromEitherK = exports.FromEither = exports.filterE = exports.ChainRecBreadthFirst = exports.chainRecBreadthFirst = exports.ChainRecDepthFirst = exports.chainRecDepthFirst = exports.Witherable = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.FilterableWithIndex = exports.Filterable = exports.Compactable = exports.Extend = exports.Alternative = exports.guard = exports.Zero = exports.Alt = exports.Unfoldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getDifferenceMagma = exports.getIntersectionSemigroup = exports.getUnionMonoid = exports.getUnionSemigroup = exports.getOrd = exports.getEq = exports.getMonoid = exports.getSemigroup = exports.getShow = exports.URI = exports.unfold = exports.wilt = exports.wither = void 0;
    	exports.array = exports.prependToAll = exports.snoc = exports.cons = exports.empty = exports.range = exports.chain = exports.apS = exports.bind = exports.let = exports.bindTo = exports.Do = exports.intercalate = exports.exists = void 0;
    	var Apply_1 = Apply;
    	var Chain_1 = Chain;
    	var FromEither_1 = FromEither;
    	var function_1 = _function;
    	var Functor_1 = Functor;
    	var _ = __importStar(internal);
    	var NEA = __importStar(NonEmptyArray);
    	var RA = __importStar(ReadonlyArray);
    	var Separated_1 = Separated;
    	var Witherable_1 = Witherable;
    	var Zero_1 = Zero;
    	// -------------------------------------------------------------------------------------
    	// refinements
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Test whether an array is empty
    	 *
    	 * @example
    	 * import { isEmpty } from 'fp-ts/Array'
    	 *
    	 * assert.strictEqual(isEmpty([]), true)
    	 * assert.strictEqual(isEmpty(['a']), false)
    	 *
    	 * @category refinements
    	 * @since 2.0.0
    	 */
    	var isEmpty = function (as) { return as.length === 0; };
    	exports.isEmpty = isEmpty;
    	/**
    	 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
    	 *
    	 * @example
    	 * import { isNonEmpty } from 'fp-ts/Array'
    	 *
    	 * assert.strictEqual(isNonEmpty([]), false)
    	 * assert.strictEqual(isNonEmpty(['a']), true)
    	 *
    	 * @category refinements
    	 * @since 2.0.0
    	 */
    	exports.isNonEmpty = NEA.isNonEmpty;
    	// -------------------------------------------------------------------------------------
    	// constructors
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Prepend an element to the front of a `Array`, creating a new `NonEmptyArray`.
    	 *
    	 * @example
    	 * import { prepend } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	exports.prepend = NEA.prepend;
    	/**
    	 * Less strict version of [`prepend`](#prepend).
    	 *
    	 * @example
    	 * import { prependW } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([2, 3, 4], prependW("a")), ["a", 2, 3, 4]);
    	 *
    	 * @since 2.11.0
    	 */
    	exports.prependW = NEA.prependW;
    	/**
    	 * Append an element to the end of a `Array`, creating a new `NonEmptyArray`.
    	 *
    	 * @example
    	 * import { append } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	exports.append = NEA.append;
    	/**
    	 * Less strict version of [`append`](#append).
    	 *
    	 * @example
    	 * import { appendW } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([1, 2, 3], appendW("d")), [1, 2, 3, "d"]);
    	 *
    	 * @since 2.11.0
    	 */
    	exports.appendW = NEA.appendW;
    	/**
    	 * Return a `Array` of length `n` with element `i` initialized with `f(i)`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { makeBy } from 'fp-ts/Array'
    	 *
    	 * const double = (i: number): number => i * 2
    	 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
    	 * assert.deepStrictEqual(makeBy(-3, double), [])
    	 * assert.deepStrictEqual(makeBy(4.32164, double), [0, 2, 4, 6])
    	 *
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	var makeBy = function (n, f) { return (n <= 0 ? [] : NEA.makeBy(f)(n)); };
    	exports.makeBy = makeBy;
    	/**
    	 * Create a `Array` containing a value repeated the specified number of times.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { replicate } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
    	 * assert.deepStrictEqual(replicate(-3, 'a'), [])
    	 * assert.deepStrictEqual(replicate(2.985647, 'a'), ['a', 'a'])
    	 *
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	var replicate = function (n, a) { return (0, exports.makeBy)(n, function () { return a; }); };
    	exports.replicate = replicate;
    	function fromPredicate(predicate) {
    	    return function (a) { return (predicate(a) ? [a] : []); };
    	}
    	exports.fromPredicate = fromPredicate;
    	// -------------------------------------------------------------------------------------
    	// conversions
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Create an array from an `Option`. The resulting array will contain the content of the
    	 * `Option` if it is `Some` and it will be empty if the `Option` is `None`.
    	 *
    	 * @example
    	 * import { fromOption } from 'fp-ts/Array'
    	 * import { option } from "fp-ts";
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe(option.some("a"), fromOption),["a"])
    	 * assert.deepStrictEqual(pipe(option.none, fromOption),[])
    	 *
    	 * @category conversions
    	 * @since 2.11.0
    	 */
    	var fromOption = function (ma) { return (_.isNone(ma) ? [] : [ma.value]); };
    	exports.fromOption = fromOption;
    	/**
    	 * Create an array from an `Either`. The resulting array will contain the content of the
    	 * `Either` if it is `Right` and it will be empty if the `Either` is `Left`.
    	 *
    	 * @example
    	 * import { fromEither } from 'fp-ts/Array'
    	 * import { either } from "fp-ts";
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe(either.right("r"), fromEither), ["r"]);
    	 * assert.deepStrictEqual(pipe(either.left("l"), fromEither), []);
    	 *
    	 * @category conversions
    	 * @since 2.11.0
    	 */
    	var fromEither = function (e) { return (_.isLeft(e) ? [] : [e.right]); };
    	exports.fromEither = fromEither;
    	/**
    	 * Less strict version of [`match`](#match).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
    	 *
    	 * @example
    	 * import { matchW } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const matcherW = matchW(
    	 *   () => "No elements",
    	 *   (as) => as.length
    	 * );
    	 * assert.deepStrictEqual(pipe([1, 2, 3, 4], matcherW), 4);
    	 * assert.deepStrictEqual(pipe([], matcherW), "No elements");
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(as) : onEmpty();
    	    };
    	};
    	exports.matchW = matchW;
    	/**
    	 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
    	 * it passes the array to `onNonEmpty` and returns the result.
    	 *
    	 * @example
    	 * import { match } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const matcher = match(
    	 *   () => "No elements",
    	 *   (as) => `Found ${as.length} element(s)`
    	 * );
    	 * assert.deepStrictEqual(pipe([1, 2, 3, 4], matcher), "Found 4 element(s)");
    	 * assert.deepStrictEqual(pipe([], matcher), "No elements");
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	exports.match = exports.matchW;
    	/**
    	 * Less strict version of [`matchLeft`](#matchleft). It will work when `onEmpty` and
    	 * `onNonEmpty` have different return types.
    	 *
    	 * @example
    	 * import { matchLeftW } from 'fp-ts/Array'
    	 *
    	 * const f = matchLeftW(
    	 *   () => 0,
    	 *   (head: string, tail: string[]) => `Found "${head}" followed by ${tail.length} elements`
    	 * );
    	 * assert.strictEqual(f(["a", "b", "c"]), 'Found "a" followed by 2 elements');
    	 * assert.strictEqual(f([]), 0);
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchLeftW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(NEA.head(as), NEA.tail(as)) : onEmpty();
    	    };
    	};
    	exports.matchLeftW = matchLeftW;
    	/**
    	 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
    	 * it passes the array to `onNonEmpty` broken into its first element and remaining elements.
    	 *
    	 * @example
    	 * import { matchLeft } from 'fp-ts/Array'
    	 *
    	 * const len: <A>(as: Array<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
    	 * assert.strictEqual(len([1, 2, 3]), 3)
    	 *
    	 * @category pattern matching
    	 * @since 2.10.0
    	 */
    	exports.matchLeft = exports.matchLeftW;
    	/**
    	 * Alias of [`matchLeft`](#matchleft).
    	 *
    	 * @category pattern matching
    	 * @since 2.0.0
    	 */
    	exports.foldLeft = exports.matchLeft;
    	/**
    	 * Less strict version of [`matchRight`](#matchright). It will work when `onEmpty` and
    	 * `onNonEmpty` have different return types.
    	 *
    	 * @example
    	 * import { matchRightW } from 'fp-ts/Array'
    	 *
    	 * const f = matchRightW(
    	 *   () => 0,
    	 *   (head: string[], tail: string) => `Found ${head.length} elements folllowed by "${tail}"`
    	 * );
    	 * assert.strictEqual(f(["a", "b", "c"]), 'Found 2 elements folllowed by "c"');
    	 * assert.strictEqual(f([]), 0);
    	 *
    	 * @category pattern matching
    	 * @since 2.11.0
    	 */
    	var matchRightW = function (onEmpty, onNonEmpty) {
    	    return function (as) {
    	        return (0, exports.isNonEmpty)(as) ? onNonEmpty(NEA.init(as), NEA.last(as)) : onEmpty();
    	    };
    	};
    	exports.matchRightW = matchRightW;
    	/**
    	 * Takes an array, if the array is empty it returns the result of `onEmpty`, otherwise
    	 * it passes the array to `onNonEmpty` broken  into its initial elements and the last element.
    	 *
    	 * @example
    	 * import { matchRight } from 'fp-ts/Array'
    	 *
    	 * const len: <A>(as: Array<A>) => number = matchRight(
    	 *   () => 0,
    	 *   (head, _) => 1 + len(head)
    	 * );
    	 * assert.strictEqual(len([1, 2, 3]), 3);
    	 *
    	 * @category pattern matching
    	 * @since 2.10.0
    	 */
    	exports.matchRight = exports.matchRightW;
    	/**
    	 * Alias of [`matchRight`](#matchright).
    	 *
    	 * @category pattern matching
    	 * @since 2.0.0
    	 */
    	exports.foldRight = exports.matchRight;
    	// -------------------------------------------------------------------------------------
    	// combinators
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Same as [`chain`](#chain), but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { chainWithIndex, replicate } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const f = (index: number, x: string) => replicate(2, `${x}${index}`);
    	 * assert.deepStrictEqual(pipe(["a", "b", "c"], chainWithIndex(f)), ["a0", "a0", "b1", "b1", "c2", "c2"]);
    	 *
    	 * @category sequencing
    	 * @since 2.7.0
    	 */
    	var chainWithIndex = function (f) {
    	    return function (as) {
    	        var out = [];
    	        for (var i = 0; i < as.length; i++) {
    	            out.push.apply(out, f(i, as[i]));
    	        }
    	        return out;
    	    };
    	};
    	exports.chainWithIndex = chainWithIndex;
    	/**
    	 * Same as `reduce` but it carries over the intermediate steps
    	 *
    	 * @example
    	 * import { scanLeft } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
    	 *
    	 * @since 2.0.0
    	 */
    	var scanLeft = function (b, f) {
    	    return function (as) {
    	        var len = as.length;
    	        var out = new Array(len + 1);
    	        out[0] = b;
    	        for (var i = 0; i < len; i++) {
    	            out[i + 1] = f(out[i], as[i]);
    	        }
    	        return out;
    	    };
    	};
    	exports.scanLeft = scanLeft;
    	/**
    	 * Fold an array from the right, keeping all intermediate results instead of only the final result
    	 *
    	 * @example
    	 * import { scanRight } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
    	 *
    	 * @since 2.0.0
    	 */
    	var scanRight = function (b, f) {
    	    return function (as) {
    	        var len = as.length;
    	        var out = new Array(len + 1);
    	        out[len] = b;
    	        for (var i = len - 1; i >= 0; i--) {
    	            out[i] = f(as[i], out[i + 1]);
    	        }
    	        return out;
    	    };
    	};
    	exports.scanRight = scanRight;
    	/**
    	 * Calculate the number of elements in a `Array`.
    	 *
    	 * @example
    	 * import { size } from 'fp-ts/Array'
    	 *
    	 * assert.strictEqual(size(["a","b","c"]),3)
    	 *
    	 * @since 2.10.0
    	 */
    	var size = function (as) { return as.length; };
    	exports.size = size;
    	/**
    	 * Test whether an array contains a particular index
    	 *
    	 * @example
    	 * import { isOutOfBound } from 'fp-ts/Array'
    	 *
    	 * assert.strictEqual(isOutOfBound(1,["a","b","c"]),false)
    	 * assert.strictEqual(isOutOfBound(-1,["a","b","c"]),true)
    	 * assert.strictEqual(isOutOfBound(3,["a","b","c"]),true)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.isOutOfBound = NEA.isOutOfBound;
    	// TODO: remove non-curried overloading in v3
    	/**
    	 * This function provides a safe way to read a value at a particular index from an array.
    	 * It returns a `none` if the index is out of bounds, and a `some` of the element if the
    	 * index is valid.
    	 *
    	 * @example
    	 * import { lookup } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
    	 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.lookup = RA.lookup;
    	/**
    	 * Get the first element in an array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { head } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
    	 * assert.deepStrictEqual(head([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.head = RA.head;
    	/**
    	 * Get the last element in an array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { last } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
    	 * assert.deepStrictEqual(last([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.last = RA.last;
    	/**
    	 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { tail } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
    	 * assert.deepStrictEqual(tail([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	var tail = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(NEA.tail(as)) : _.none); };
    	exports.tail = tail;
    	/**
    	 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
    	 *
    	 * @example
    	 * import { init } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
    	 * assert.deepStrictEqual(init([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	var init = function (as) { return ((0, exports.isNonEmpty)(as) ? _.some(NEA.init(as)) : _.none); };
    	exports.init = init;
    	/**
    	 * Keep only a max number of elements from the start of an `Array`, creating a new `Array`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { takeLeft } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(takeLeft(2)([1, 2, 3, 4, 5]), [1, 2]);
    	 * assert.deepStrictEqual(takeLeft(7)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    	 * assert.deepStrictEqual(takeLeft(0)([1, 2, 3, 4, 5]), []);
    	 * assert.deepStrictEqual(takeLeft(-1)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    	 *
    	 * @since 2.0.0
    	 */
    	var takeLeft = function (n) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(n, as) ? (0, exports.copy)(as) : as.slice(0, n);
    	    };
    	};
    	exports.takeLeft = takeLeft;
    	/**
    	 * Keep only a max number of elements from the end of an `Array`, creating a new `Array`.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { takeRight } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(takeRight(2)([1, 2, 3, 4, 5]), [4, 5]);
    	 * assert.deepStrictEqual(takeRight(7)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    	 * assert.deepStrictEqual(takeRight(0)([1, 2, 3, 4, 5]), []);
    	 * assert.deepStrictEqual(takeRight(-1)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    	 *
    	 * @since 2.0.0
    	 */
    	var takeRight = function (n) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(n, as) ? (0, exports.copy)(as) : n === 0 ? [] : as.slice(-n);
    	    };
    	};
    	exports.takeRight = takeRight;
    	function takeLeftWhile(predicate) {
    	    return function (as) {
    	        var out = [];
    	        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
    	            var a = as_1[_i];
    	            if (!predicate(a)) {
    	                break;
    	            }
    	            out.push(a);
    	        }
    	        return out;
    	    };
    	}
    	exports.takeLeftWhile = takeLeftWhile;
    	var spanLeftIndex = function (as, predicate) {
    	    var l = as.length;
    	    var i = 0;
    	    for (; i < l; i++) {
    	        if (!predicate(as[i])) {
    	            break;
    	        }
    	    }
    	    return i;
    	};
    	function spanLeft(predicate) {
    	    return function (as) {
    	        var _a = (0, exports.splitAt)(spanLeftIndex(as, predicate))(as), init = _a[0], rest = _a[1];
    	        return { init: init, rest: rest };
    	    };
    	}
    	exports.spanLeft = spanLeft;
    	/**
    	 * Creates a new `Array` which is a copy of the input dropping a max number of elements from the start.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { dropLeft } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(dropLeft(2)([1, 2, 3]), [3]);
    	 * assert.deepStrictEqual(dropLeft(5)([1, 2, 3]), []);
    	 * assert.deepStrictEqual(dropLeft(0)([1, 2, 3]), [1, 2, 3]);
    	 * assert.deepStrictEqual(dropLeft(-2)([1, 2, 3]), [1, 2, 3]);
    	 *
    	 * @since 2.0.0
    	 */
    	var dropLeft = function (n) {
    	    return function (as) {
    	        return n <= 0 || (0, exports.isEmpty)(as) ? (0, exports.copy)(as) : n >= as.length ? [] : as.slice(n, as.length);
    	    };
    	};
    	exports.dropLeft = dropLeft;
    	/**
    	 * Creates a new `Array` which is a copy of the input dropping a max number of elements from the end.
    	 *
    	 * **Note**. `n` is normalized to a non negative integer.
    	 *
    	 * @example
    	 * import { dropRight } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(dropRight(2)([1, 2, 3]), [1]);
    	 * assert.deepStrictEqual(dropRight(5)([1, 2, 3]), []);
    	 * assert.deepStrictEqual(dropRight(0)([1, 2, 3]), [1, 2, 3]);
    	 * assert.deepStrictEqual(dropRight(-2)([1, 2, 3]), [1, 2, 3]);
    	 *
    	 * @since 2.0.0
    	 */
    	var dropRight = function (n) {
    	    return function (as) {
    	        return n <= 0 || (0, exports.isEmpty)(as) ? (0, exports.copy)(as) : n >= as.length ? [] : as.slice(0, as.length - n);
    	    };
    	};
    	exports.dropRight = dropRight;
    	function dropLeftWhile(predicate) {
    	    return function (as) { return as.slice(spanLeftIndex(as, predicate)); };
    	}
    	exports.dropLeftWhile = dropLeftWhile;
    	/**
    	 * `findIndex` returns an `Option` containing the first index for which a predicate holds.
    	 * It returns `None` if no element satisfies the predicate.
    	 * Similar to [`findFirst`](#findFirst) but returning the index instead of the element.
    	 *
    	 * @example
    	 * import { findIndex } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
    	 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.findIndex = RA.findIndex;
    	function findFirst(predicate) {
    	    return RA.findFirst(predicate);
    	}
    	exports.findFirst = findFirst;
    	/**
    	 * Given a selector function which takes an element and returns an option,
    	 * this function applies the selector to each element of the array and
    	 * returns the first `Some` result. Otherwise it returns `None`.
    	 *
    	 * @example
    	 * import { findFirstMap } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface Person {
    	 *   readonly name: string;
    	 *   readonly age: number;
    	 * }
    	 *
    	 * const persons: Array<Person> = [
    	 *   { name: "John", age: 16 },
    	 *   { name: "Mary", age: 45 },
    	 *   { name: "Joey", age: 28 },
    	 * ];
    	 *
    	 * const nameOfPersonAbove18 = (p: Person) => (p.age <= 18 ? none : some(p.name));
    	 * const nameOfPersonAbove70 = (p: Person) => (p.age <= 70 ? none : some(p.name));
    	 * assert.deepStrictEqual(findFirstMap(nameOfPersonAbove18)(persons), some("Mary"));
    	 * assert.deepStrictEqual(findFirstMap(nameOfPersonAbove70)(persons), none);
    	 *
    	 * @since 2.0.0
    	 */
    	exports.findFirstMap = RA.findFirstMap;
    	function findLast(predicate) {
    	    return RA.findLast(predicate);
    	}
    	exports.findLast = findLast;
    	/**
    	 * Given a selector function which takes an element and returns an option,
    	 * this function applies the selector to each element of the array starting from the
    	 * end and returns the last `Some` result. Otherwise it returns `None`.
    	 *
    	 * @example
    	 * import { findLastMap } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface Person {
    	 *   readonly name: string;
    	 *   readonly age: number;
    	 * }
    	 *
    	 * const persons: Array<Person> = [
    	 *   { name: "John", age: 16 },
    	 *   { name: "Mary", age: 45 },
    	 *   { name: "Joey", age: 28 },
    	 * ];
    	 *
    	 * const nameOfPersonAbove18 = (p: Person) => (p.age <= 18 ? none : some(p.name));
    	 * const nameOfPersonAbove70 = (p: Person) => (p.age <= 70 ? none : some(p.name));
    	 * assert.deepStrictEqual(findLastMap(nameOfPersonAbove18)(persons), some("Joey"));
    	 * assert.deepStrictEqual(findLastMap(nameOfPersonAbove70)(persons), none);
    	 *
    	 * @since 2.0.0
    	 */
    	exports.findLastMap = RA.findLastMap;
    	/**
    	 * Returns the index of the last element of the list which matches the predicate.
    	 * It returns an `Option` containing the index or `None` if not found.
    	 *
    	 * @example
    	 * import { findLastIndex } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * interface X {
    	 *   readonly a: number
    	 *   readonly b: number
    	 * }
    	 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
    	 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
    	 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.findLastIndex = RA.findLastIndex;
    	/**
    	 * This function takes an array and makes a new array containing the same elements.
    	 *
    	 * @since 2.0.0
    	 */
    	var copy = function (as) { return as.slice(); };
    	exports.copy = copy;
    	/**
    	 * Insert an element at the specified index, creating a new array,
    	 * or returning `None` if the index is out of bounds.
    	 *
    	 * @example
    	 * import { insertAt } from 'fp-ts/Array'
    	 * import { some } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
    	 *
    	 * @since 2.0.0
    	 */
    	var insertAt = function (i, a) {
    	    return function (as) {
    	        return i < 0 || i > as.length ? _.none : _.some((0, exports.unsafeInsertAt)(i, a, as));
    	    };
    	};
    	exports.insertAt = insertAt;
    	/**
    	 * Change the element at the specified index, creating a new array,
    	 * or returning `None` if the index is out of bounds.
    	 *
    	 * @example
    	 * import { updateAt } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
    	 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	var updateAt = function (i, a) { return (0, exports.modifyAt)(i, function () { return a; }); };
    	exports.updateAt = updateAt;
    	/**
    	 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds.
    	 *
    	 * @example
    	 * import { deleteAt } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
    	 * assert.deepStrictEqual(deleteAt(1)([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	var deleteAt = function (i) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeDeleteAt)(i, as));
    	    };
    	};
    	exports.deleteAt = deleteAt;
    	/**
    	 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
    	 * of bounds.
    	 *
    	 * @example
    	 * import { modifyAt } from 'fp-ts/Array'
    	 * import { some, none } from 'fp-ts/Option'
    	 *
    	 * const double = (x: number): number => x * 2
    	 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
    	 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
    	 *
    	 * @since 2.0.0
    	 */
    	var modifyAt = function (i, f) {
    	    return function (as) {
    	        return (0, exports.isOutOfBound)(i, as) ? _.none : _.some((0, exports.unsafeUpdateAt)(i, f(as[i]), as));
    	    };
    	};
    	exports.modifyAt = modifyAt;
    	/**
    	 * Reverse an array, creating a new array
    	 *
    	 * @example
    	 * import { reverse } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
    	 *
    	 * @since 2.0.0
    	 */
    	var reverse = function (as) { return ((0, exports.isEmpty)(as) ? [] : as.slice().reverse()); };
    	exports.reverse = reverse;
    	/**
    	 * Takes an `Array` of `Either` and produces a new `Array` containing
    	 * the values of all the `Right` elements in the same order.
    	 *
    	 * @example
    	 * import { rights } from 'fp-ts/Array'
    	 * import { right, left } from 'fp-ts/Either'
    	 *
    	 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
    	 *
    	 * @since 2.0.0
    	 */
    	var rights = function (as) {
    	    var r = [];
    	    for (var i = 0; i < as.length; i++) {
    	        var a = as[i];
    	        if (a._tag === 'Right') {
    	            r.push(a.right);
    	        }
    	    }
    	    return r;
    	};
    	exports.rights = rights;
    	/**
    	 * Takes an `Array` of `Either` and produces a new `Array` containing
    	 * the values of all the `Left` elements in the same order.
    	 *
    	 * @example
    	 * import { lefts } from 'fp-ts/Array'
    	 * import { left, right } from 'fp-ts/Either'
    	 *
    	 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
    	 *
    	 * @since 2.0.0
    	 */
    	var lefts = function (as) {
    	    var r = [];
    	    for (var i = 0; i < as.length; i++) {
    	        var a = as[i];
    	        if (a._tag === 'Left') {
    	            r.push(a.left);
    	        }
    	    }
    	    return r;
    	};
    	exports.lefts = lefts;
    	/**
    	 * Sort the elements of an array in increasing order, creating a new array
    	 *
    	 * @example
    	 * import { sort } from 'fp-ts/Array'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
    	 *
    	 * @since 2.0.0
    	 */
    	var sort = function (O) {
    	    return function (as) {
    	        return as.length <= 1 ? (0, exports.copy)(as) : as.slice().sort(O.compare);
    	    };
    	};
    	exports.sort = sort;
    	/**
    	 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
    	 * input array is short, excess elements of the longer array are discarded.
    	 *
    	 * @example
    	 * import { zipWith } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
    	 *
    	 * @since 2.0.0
    	 */
    	var zipWith = function (fa, fb, f) {
    	    var fc = [];
    	    var len = Math.min(fa.length, fb.length);
    	    for (var i = 0; i < len; i++) {
    	        fc[i] = f(fa[i], fb[i]);
    	    }
    	    return fc;
    	};
    	exports.zipWith = zipWith;
    	function zip(as, bs) {
    	    if (bs === undefined) {
    	        return function (bs) { return zip(bs, as); };
    	    }
    	    return (0, exports.zipWith)(as, bs, function (a, b) { return [a, b]; });
    	}
    	exports.zip = zip;
    	/**
    	 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
    	 *
    	 * @example
    	 * import { unzip } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
    	 *
    	 * @since 2.0.0
    	 */
    	var unzip = function (as) {
    	    var fa = [];
    	    var fb = [];
    	    for (var i = 0; i < as.length; i++) {
    	        fa[i] = as[i][0];
    	        fb[i] = as[i][1];
    	    }
    	    return [fa, fb];
    	};
    	exports.unzip = unzip;
    	/**
    	 * Creates a new `Array`, prepending an element to every member of the input `Array`.
    	 *
    	 * @example
    	 * import { prependAll } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.10.0
    	 */
    	var prependAll = function (middle) {
    	    var f = NEA.prependAll(middle);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : []); };
    	};
    	exports.prependAll = prependAll;
    	/**
    	 * Creates a new `Array` placing an element in between members of the input `Array`.
    	 *
    	 * @example
    	 * import { intersperse } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
    	 *
    	 * @since 2.9.0
    	 */
    	var intersperse = function (middle) {
    	    var f = NEA.intersperse(middle);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : (0, exports.copy)(as)); };
    	};
    	exports.intersperse = intersperse;
    	/**
    	 * Creates a new `Array` rotating the input `Array` by `n` steps.
    	 *
    	 * @example
    	 * import { rotate } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    	 *
    	 * @since 2.0.0
    	 */
    	var rotate = function (n) {
    	    var f = NEA.rotate(n);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : (0, exports.copy)(as)); };
    	};
    	exports.rotate = rotate;
    	// TODO: remove non-curried overloading in v3
    	/**
    	 * Test if a value is a member of an `Array`. Takes a `Eq<A>` as a single
    	 * argument which returns the function to use to search for a value of type `A` in
    	 * an `Array<A>`.
    	 *
    	 * @example
    	 * import { elem } from 'fp-ts/Array'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
    	 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
    	 *
    	 * @since 2.0.0
    	 */
    	exports.elem = RA.elem;
    	/**
    	 * Creates a new `Array` removing duplicate elements, keeping the first occurrence of an element,
    	 * based on a `Eq<A>`.
    	 *
    	 * @example
    	 * import { uniq } from 'fp-ts/Array'
    	 * import * as N from 'fp-ts/number'
    	 *
    	 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
    	 *
    	 * @since 2.0.0
    	 */
    	var uniq = function (E) {
    	    var f = NEA.uniq(E);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : (0, exports.copy)(as)); };
    	};
    	exports.uniq = uniq;
    	/**
    	 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
    	 * etc...
    	 *
    	 * @example
    	 * import { sortBy } from 'fp-ts/Array'
    	 * import { contramap } from 'fp-ts/Ord'
    	 * import * as S from 'fp-ts/string'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * interface Person {
    	 *   readonly name: string
    	 *   readonly age: number
    	 * }
    	 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
    	 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
    	 *
    	 * const sortByNameByAge = sortBy([byName, byAge])
    	 *
    	 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
    	 * assert.deepStrictEqual(sortByNameByAge(persons), [
    	 *   { name: 'a', age: 1 },
    	 *   { name: 'b', age: 2 },
    	 *   { name: 'b', age: 3 },
    	 *   { name: 'c', age: 2 }
    	 * ])
    	 *
    	 * @since 2.0.0
    	 */
    	var sortBy = function (ords) {
    	    var f = NEA.sortBy(ords);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : (0, exports.copy)(as)); };
    	};
    	exports.sortBy = sortBy;
    	/**
    	 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
    	 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
    	 * value and the rest of the array.
    	 *
    	 * @example
    	 * import { Eq } from 'fp-ts/Eq'
    	 * import * as A from 'fp-ts/Array'
    	 * import * as N from 'fp-ts/number'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
    	 *   return A.chop(as => {
    	 *     const { init, rest } = pipe(as, A.spanLeft((a: A) => S.equals(a, as[0])))
    	 *     return [init, rest]
    	 *   })
    	 * }
    	 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
    	 *
    	 * @since 2.0.0
    	 */
    	var chop = function (f) {
    	    var g = NEA.chop(f);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? g(as) : []); };
    	};
    	exports.chop = chop;
    	/**
    	 * Splits an `Array` into two pieces, the first piece has max `n` elements.
    	 *
    	 * @example
    	 * import { splitAt } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
    	 *
    	 * @since 2.0.0
    	 */
    	var splitAt = function (n) {
    	    return function (as) {
    	        return n >= 1 && (0, exports.isNonEmpty)(as) ? NEA.splitAt(n)(as) : (0, exports.isEmpty)(as) ? [(0, exports.copy)(as), []] : [[], (0, exports.copy)(as)];
    	    };
    	};
    	exports.splitAt = splitAt;
    	/**
    	 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
    	 * the array. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
    	 * definition of `chunksOf`; it satisfies the property that
    	 *
    	 * ```ts
    	 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
    	 * ```
    	 *
    	 * whenever `n` evenly divides the length of `xs`.
    	 *
    	 * @example
    	 * import { chunksOf } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
    	 *
    	 * @since 2.0.0
    	 */
    	var chunksOf = function (n) {
    	    var f = NEA.chunksOf(n);
    	    return function (as) { return ((0, exports.isNonEmpty)(as) ? f(as) : []); };
    	};
    	exports.chunksOf = chunksOf;
    	/**
    	 * @category lifting
    	 * @since 2.11.0
    	 */
    	var fromOptionK = function (f) {
    	    return function () {
    	        var a = [];
    	        for (var _i = 0; _i < arguments.length; _i++) {
    	            a[_i] = arguments[_i];
    	        }
    	        return (0, exports.fromOption)(f.apply(void 0, a));
    	    };
    	};
    	exports.fromOptionK = fromOptionK;
    	function comprehension(input, f, g) {
    	    if (g === void 0) { g = function () { return true; }; }
    	    var go = function (scope, input) {
    	        return (0, exports.isNonEmpty)(input)
    	            ? (0, exports.flatMap)(NEA.head(input), function (a) { return go((0, function_1.pipe)(scope, (0, exports.append)(a)), NEA.tail(input)); })
    	            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
    	                : [];
    	    };
    	    return go([], input);
    	}
    	exports.comprehension = comprehension;
    	/**
    	 * @since 2.11.0
    	 */
    	var concatW = function (second) {
    	    return function (first) {
    	        return (0, exports.isEmpty)(first) ? (0, exports.copy)(second) : (0, exports.isEmpty)(second) ? (0, exports.copy)(first) : first.concat(second);
    	    };
    	};
    	exports.concatW = concatW;
    	/**
    	 * @since 2.11.0
    	 */
    	exports.concat = exports.concatW;
    	function union(E) {
    	    var unionE = NEA.union(E);
    	    return function (first, second) {
    	        if (second === undefined) {
    	            var unionE_1 = union(E);
    	            return function (second) { return unionE_1(second, first); };
    	        }
    	        return (0, exports.isNonEmpty)(first) && (0, exports.isNonEmpty)(second)
    	            ? unionE(second)(first)
    	            : (0, exports.isNonEmpty)(first)
    	                ? (0, exports.copy)(first)
    	                : (0, exports.copy)(second);
    	    };
    	}
    	exports.union = union;
    	function intersection(E) {
    	    var elemE = (0, exports.elem)(E);
    	    return function (xs, ys) {
    	        if (ys === undefined) {
    	            var intersectionE_1 = intersection(E);
    	            return function (ys) { return intersectionE_1(ys, xs); };
    	        }
    	        return xs.filter(function (a) { return elemE(a, ys); });
    	    };
    	}
    	exports.intersection = intersection;
    	function difference(E) {
    	    var elemE = (0, exports.elem)(E);
    	    return function (xs, ys) {
    	        if (ys === undefined) {
    	            var differenceE_1 = difference(E);
    	            return function (ys) { return differenceE_1(ys, xs); };
    	        }
    	        return xs.filter(function (a) { return !elemE(a, ys); });
    	    };
    	}
    	exports.difference = difference;
    	var _map = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); };
    	/* istanbul ignore next */
    	var _mapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.mapWithIndex)(f)); };
    	var _ap = function (fab, fa) { return (0, function_1.pipe)(fab, (0, exports.ap)(fa)); };
    	/* istanbul ignore next */
    	var _filter = function (fa, predicate) { return (0, function_1.pipe)(fa, (0, exports.filter)(predicate)); };
    	/* istanbul ignore next */
    	var _filterMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMap)(f)); };
    	/* istanbul ignore next */
    	var _partition = function (fa, predicate) {
    	    return (0, function_1.pipe)(fa, (0, exports.partition)(predicate));
    	};
    	/* istanbul ignore next */
    	var _partitionMap = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMap)(f)); };
    	/* istanbul ignore next */
    	var _partitionWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.partitionWithIndex)(predicateWithIndex)); };
    	/* istanbul ignore next */
    	var _partitionMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.partitionMapWithIndex)(f)); };
    	/* istanbul ignore next */
    	var _alt = function (fa, that) { return (0, function_1.pipe)(fa, (0, exports.alt)(that)); };
    	var _reduce = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduce)(b, f)); };
    	/* istanbul ignore next */
    	var _foldMap = function (M) {
    	    var foldMapM = (0, exports.foldMap)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRight = function (fa, b, f) { return (0, function_1.pipe)(fa, (0, exports.reduceRight)(b, f)); };
    	/* istanbul ignore next */
    	var _reduceWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _foldMapWithIndex = function (M) {
    	    var foldMapWithIndexM = (0, exports.foldMapWithIndex)(M);
    	    return function (fa, f) { return (0, function_1.pipe)(fa, foldMapWithIndexM(f)); };
    	};
    	/* istanbul ignore next */
    	var _reduceRightWithIndex = function (fa, b, f) {
    	    return (0, function_1.pipe)(fa, (0, exports.reduceRightWithIndex)(b, f));
    	};
    	/* istanbul ignore next */
    	var _filterMapWithIndex = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.filterMapWithIndex)(f)); };
    	/* istanbul ignore next */
    	var _filterWithIndex = function (fa, predicateWithIndex) { return (0, function_1.pipe)(fa, (0, exports.filterWithIndex)(predicateWithIndex)); };
    	/* istanbul ignore next */
    	var _extend = function (fa, f) { return (0, function_1.pipe)(fa, (0, exports.extend)(f)); };
    	/* istanbul ignore next */
    	var _traverse = function (F) {
    	    var traverseF = (0, exports.traverse)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseF(f)); };
    	};
    	/* istanbul ignore next */
    	var _traverseWithIndex = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (ta, f) { return (0, function_1.pipe)(ta, traverseWithIndexF(f)); };
    	};
    	var _chainRecDepthFirst = RA._chainRecDepthFirst;
    	var _chainRecBreadthFirst = RA._chainRecBreadthFirst;
    	/**
    	 * Given an element of the base type, `of` builds an `Array` containing just that
    	 * element of the base type (this is useful for building a `Monad`).
    	 *
    	 * @example
    	 * import { of } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(of("a"), ["a"]);
    	 *
    	 * @category constructors
    	 * @since 2.0.0
    	 */
    	exports.of = NEA.of;
    	/**
    	 * Makes an empty `Array`, useful for building a [`Monoid`](#Monoid)
    	 *
    	 * @since 2.7.0
    	 */
    	var zero = function () { return []; };
    	exports.zero = zero;
    	/**
    	 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: Array<A>) => Array<B>`.
    	 * In practice it applies the base function to each element of the array and collects the
    	 * results in a new array.
    	 *
    	 * @example
    	 * import { map } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const f = (n: number) => n * 2;
    	 * assert.deepStrictEqual(pipe([1, 2, 3], map(f)), [2, 4, 6]);
    	 *
    	 * @category mapping
    	 * @since 2.0.0
    	 */
    	var map = function (f) { return function (fa) { return fa.map(function (a) { return f(a); }); }; };
    	exports.map = map;
    	/**
    	 * @example
    	 * import { ap, map, of } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * // a curried function with 3 input parameteres
    	 * const f = (s1: string) => (n: number) => (s2: string) => s1 + n + s2;
    	 *
    	 * // let's use `ap` to iterate `f` over an array for each input parameter
    	 * assert.deepStrictEqual(pipe(["a", "b"], map(f), ap([1, 2]), ap(["😀", "😫", "😎"])), [
    	 *   "a1😀", "a1😫", "a1😎",
    	 *   "a2😀", "a2😫", "a2😎",
    	 *   "b1😀", "b1😫", "b1😎",
    	 *   "b2😀", "b2😫", "b2😎",
    	 * ]);
    	 *
    	 * // given Array implements the Applicative interface with the `of` method,
    	 * // we can write exactly the same thing in a more symmetric way
    	 * // using `of` on `f` and `ap` on each array in input
    	 * assert.deepStrictEqual(
    	 *   pipe(of(f), ap(["a", "b"]), ap([1, 2]), ap(["😀", "😫", "😎"])),
    	 *   pipe(["a", "b"], map(f), ap([1, 2]), ap(["😀", "😫", "😎"]))
    	 * );
    	 *
    	 * @since 2.0.0
    	 */
    	var ap = function (fa) {
    	    return (0, exports.flatMap)(function (f) { return (0, function_1.pipe)(fa, (0, exports.map)(f)); });
    	};
    	exports.ap = ap;
    	/**
    	 * Composes computations in sequence, using the return value of one computation to
    	 * determine the next computation.
    	 *
    	 * In other words it takes a function `f` that produces an array from a single element of
    	 * the base type `A` and returns a new function which applies `f` to each element of the
    	 * input array (like [`map`](#map)) and, instead of returning an array of arrays, concatenates the
    	 * results into a single array (like [`flatten`](#flatten)).
    	 *
    	 * @example
    	 * import { flatMap, map, replicate } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const f = (n: number) => replicate(n, `${n}`);
    	 * assert.deepStrictEqual(pipe([1, 2, 3], map(f)), [["1"], ["2", "2"], ["3", "3", "3"]]);
    	 * assert.deepStrictEqual(pipe([1, 2, 3], flatMap(f)), ["1", "2", "2", "3", "3", "3"]);
    	 *
    	 * @category sequencing
    	 * @since 2.14.0
    	 */
    	exports.flatMap = (0, function_1.dual)(2, function (ma, f) {
    	    return (0, function_1.pipe)(ma, (0, exports.chainWithIndex)(function (i, a) { return f(a, i); }));
    	});
    	/**
    	 * Takes an array of arrays of `A` and flattens them into an array of `A`
    	 * by concatenating the elements of each array in order.
    	 *
    	 * @example
    	 * import { flatten } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(flatten([["a"], ["b", "c"], ["d", "e", "f"]]), ["a", "b", "c", "d", "e", "f"]);
    	 *
    	 * @category sequencing
    	 * @since 2.5.0
    	 */
    	exports.flatten = (0, exports.flatMap)(function_1.identity);
    	/**
    	 * Same as [`map`](#map), but the iterating function takes both the index and the value
    	 * of the element.
    	 *
    	 * @example
    	 * import { mapWithIndex } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * const f = (i: number, s: string) => `${s} - ${i}`;
    	 * assert.deepStrictEqual(pipe(["a", "b", "c"], mapWithIndex(f)), ["a - 0", "b - 1", "c - 2"]);
    	 *
    	 * @category mapping
    	 * @since 2.0.0
    	 */
    	var mapWithIndex = function (f) { return function (fa) {
    	    return fa.map(function (a, i) { return f(i, a); });
    	}; };
    	exports.mapWithIndex = mapWithIndex;
    	/**
    	 * Maps an array with an iterating function that takes the index and the value of
    	 * each element and returns an `Option`. It keeps only the `Some` values discarding
    	 * the `None`s.
    	 *
    	 * Same as [`filterMap`](#filterMap), but with an iterating function which takes also
    	 * the index as input.
    	 *
    	 * @example
    	 * import { filterMapWithIndex } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 * import { option } from "fp-ts";
    	 *
    	 * const f = (i: number, s: string) => (i % 2 === 1 ? option.some(s.toUpperCase()) : option.none);
    	 * assert.deepStrictEqual(pipe(["a", "no", "neither", "b"], filterMapWithIndex(f)), ["NO", "B"]);
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var filterMapWithIndex = function (f) {
    	    return function (fa) {
    	        var out = [];
    	        for (var i = 0; i < fa.length; i++) {
    	            var optionB = f(i, fa[i]);
    	            if (_.isSome(optionB)) {
    	                out.push(optionB.value);
    	            }
    	        }
    	        return out;
    	    };
    	};
    	exports.filterMapWithIndex = filterMapWithIndex;
    	/**
    	 * Maps an array with an iterating function that returns an `Option`
    	 * and it keeps only the `Some` values discarding the `None`s.
    	 *
    	 * @example
    	 * import { filterMap } from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 * import { option } from "fp-ts";
    	 *
    	 * const f = (s: string) => s.length === 1 ? option.some(s.toUpperCase()) : option.none;
    	 * assert.deepStrictEqual(pipe(["a", "no", "neither", "b"], filterMap(f)), ["A", "B"]);
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var filterMap = function (f) {
    	    return (0, exports.filterMapWithIndex)(function (_, a) { return f(a); });
    	};
    	exports.filterMap = filterMap;
    	/**
    	 * Compact an array of `Option`s discarding the `None` values and
    	 * keeping the `Some` values. It returns a new array containing the values of
    	 * the `Some` options.
    	 *
    	 * @example
    	 * import { compact } from 'fp-ts/Array'
    	 * import { option } from "fp-ts";
    	 *
    	 * assert.deepStrictEqual(compact([option.some("a"), option.none, option.some("b")]), ["a", "b"]);
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	exports.compact = (0, exports.filterMap)(function_1.identity);
    	/**
    	 * Separate an array of `Either`s into `Left`s and `Right`s, creating two new arrays:
    	 * one containing all the left values and one containing all the right values.
    	 *
    	 * @example
    	 * import { separate } from 'fp-ts/Array'
    	 * import { either } from "fp-ts";
    	 *
    	 * assert.deepStrictEqual(separate([either.right("r1"), either.left("l1"), either.right("r2")]), {
    	 *   left: ["l1"],
    	 *   right: ["r1", "r2"],
    	 * });
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var separate = function (fa) {
    	    var left = [];
    	    var right = [];
    	    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
    	        var e = fa_1[_i];
    	        if (e._tag === 'Left') {
    	            left.push(e.left);
    	        }
    	        else {
    	            right.push(e.right);
    	        }
    	    }
    	    return (0, Separated_1.separated)(left, right);
    	};
    	exports.separate = separate;
    	/**
    	 * Given an iterating function that is a `Predicate` or a `Refinement`,
    	 * `filter` creates a new `Array` containing the elements of the original
    	 * `Array` for which the iterating function is `true`.
    	 *
    	 * @example
    	 * import { filter } from 'fp-ts/Array'
    	 * import { isString } from "fp-ts/lib/string";
    	 *
    	 * assert.deepStrictEqual(filter(isString)(["a", 1, {}, "b", 5]), ["a", "b"]);
    	 * assert.deepStrictEqual(filter((x:number) => x > 0)([-3, 1, -2, 5]), [1, 5]);
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var filter = function (predicate) {
    	    return function (as) {
    	        return as.filter(predicate);
    	    };
    	};
    	exports.filter = filter;
    	/**
    	 * Given an iterating function that is a `Predicate` or a `Refinement`,
    	 * `partition` creates two new `Array`s: `right` containing the elements of the original
    	 * `Array` for which the iterating function is `true`, `left` containing the elements
    	 * for which it is false.
    	 *
    	 * @example
    	 * import { partition } from 'fp-ts/Array'
    	 * import { isString } from "fp-ts/lib/string";
    	 *
    	 * assert.deepStrictEqual(partition(isString)(["a", 1, {}, "b", 5]), { left: [1, {}, 5], right: ["a", "b"] });
    	 * assert.deepStrictEqual(partition((x: number) => x > 0)([-3, 1, -2, 5]), { left: [-3, -2], right: [1, 5] });
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var partition = function (predicate) {
    	    return (0, exports.partitionWithIndex)(function (_, a) { return predicate(a); });
    	};
    	exports.partition = partition;
    	/**
    	 * Same as [`partition`](#partition), but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { partitionWithIndex } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(partitionWithIndex((index, x: number) => index < 3 && x > 0)([-2, 5, 6, 7]), {
    	 *   left: [-2, 7],
    	 *   right: [5, 6],
    	 * });
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var partitionWithIndex = function (predicateWithIndex) {
    	    return function (as) {
    	        var left = [];
    	        var right = [];
    	        for (var i = 0; i < as.length; i++) {
    	            var b = as[i];
    	            if (predicateWithIndex(i, b)) {
    	                right.push(b);
    	            }
    	            else {
    	                left.push(b);
    	            }
    	        }
    	        return (0, Separated_1.separated)(left, right);
    	    };
    	};
    	exports.partitionWithIndex = partitionWithIndex;
    	/**
    	 * Given an iterating function that returns an `Either`,
    	 * `partitionMap` applies the iterating function to each element and it creates two `Array`s:
    	 * `right` containing the values of `Right` results, `left` containing the values of `Left` results.
    	 *
    	 * @example
    	 * import { partitionMap } from 'fp-ts/Array'
    	 * import { Either, left, right } from "fp-ts/lib/Either";
    	 *
    	 * const upperIfString = <B>(x: B): Either<B, string> =>
    	 *   typeof x === "string" ? right(x.toUpperCase()) : left(x);
    	 * assert.deepStrictEqual(partitionMap(upperIfString)([-2, "hello", 6, 7, "world"]), {
    	 *   left: [-2, 6, 7],
    	 *   right: [ 'HELLO', 'WORLD' ],
    	 * });
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var partitionMap = function (f) { return (0, exports.partitionMapWithIndex)(function (_, a) { return f(a); }); };
    	exports.partitionMap = partitionMap;
    	/**
    	 * Same as [`partitionMap`](#partitionMap), but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { partitionMapWithIndex } from 'fp-ts/Array'
    	 * import { Either, left, right } from "fp-ts/lib/Either";
    	 *
    	 * const upperIfStringBefore3 = <B>(index: number, x: B): Either<B, string> =>
    	 *   index < 3 && typeof x === "string" ? right(x.toUpperCase()) : left(x);
    	 * assert.deepStrictEqual(partitionMapWithIndex(upperIfStringBefore3)([-2, "hello", 6, 7, "world"]), {
    	 *   left: [-2, 6, 7, "world"],
    	 *   right: ["HELLO"],
    	 * });
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var partitionMapWithIndex = function (f) {
    	    return function (fa) {
    	        var left = [];
    	        var right = [];
    	        for (var i = 0; i < fa.length; i++) {
    	            var e = f(i, fa[i]);
    	            if (e._tag === 'Left') {
    	                left.push(e.left);
    	            }
    	            else {
    	                right.push(e.right);
    	            }
    	        }
    	        return (0, Separated_1.separated)(left, right);
    	    };
    	};
    	exports.partitionMapWithIndex = partitionMapWithIndex;
    	/**
    	 * Less strict version of [`alt`](#alt).
    	 *
    	 * The `W` suffix (short for **W**idening) means that the return types will be merged.
    	 *
    	 * @example
    	 * import * as A from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     A.altW(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 2, 3, 'a', 'b']
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.9.0
    	 */
    	var altW = function (that) {
    	    return function (fa) {
    	        return fa.concat(that());
    	    };
    	};
    	exports.altW = altW;
    	/**
    	 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
    	 * types of kind `* -> *`.
    	 *
    	 * In case of `Array` concatenates the inputs into a single array.
    	 *
    	 * @example
    	 * import * as A from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     A.alt(() => [4, 5])
    	 *   ),
    	 *   [1, 2, 3, 4, 5]
    	 * )
    	 *
    	 * @category error handling
    	 * @since 2.0.0
    	 */
    	exports.alt = exports.altW;
    	/**
    	 * Same as [`filter`](#filter), but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { filterWithIndex } from 'fp-ts/Array';
    	 *
    	 * const f = (index: number, x: number) => x > 0 && index <= 2;
    	 * assert.deepStrictEqual(filterWithIndex(f)([-3, 1, -2, 5]), [1]);
    	 *
    	 * @category filtering
    	 * @since 2.0.0
    	 */
    	var filterWithIndex = function (predicateWithIndex) {
    	    return function (as) {
    	        return as.filter(function (b, i) { return predicateWithIndex(i, b); });
    	    };
    	};
    	exports.filterWithIndex = filterWithIndex;
    	/**
    	 * Given an iterating function that takes `Array<A>` as input, `extend` returns
    	 * an array containing the results of the iterating function applied to the whole input
    	 * `Array`, then to the input `Array` without the first element, then to the input
    	 * `Array` without the first two elements, etc.
    	 *
    	 * @example
    	 * import { extend } from 'fp-ts/Array'
    	 *
    	 * const f = (a: string[]) => a.join(",");
    	 * assert.deepStrictEqual(extend(f)(["a", "b", "c"]), ["a,b,c", "b,c", "c"]);
    	 *
    	 * @since 2.0.0
    	 */
    	var extend = function (f) { return function (wa) {
    	    return wa.map(function (_, i) { return f(wa.slice(i)); });
    	}; };
    	exports.extend = extend;
    	/**
    	 * `duplicate` returns an array containing the whole input `Array`,
    	 * then to the input `Array` dropping the first element, then to the input
    	 * `Array` dropping the first two elements, etc.
    	 *
    	 * @example
    	 * import { duplicate } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(duplicate(["a", "b", "c"]), [["a", "b", "c"], ["b", "c"], ["c"]]);
    	 *
    	 * @since 2.0.0
    	 */
    	exports.duplicate = (0, exports.extend)(function_1.identity);
    	/**
    	 * Map and fold an `Array`.
    	 * Map the `Array` passing each value to the iterating function.
    	 * Then fold the results using the provided `Monoid`.
    	 *
    	 * @example
    	 * import { foldMap } from 'fp-ts/Array'
    	 *
    	 * const monoid = { concat: (a: string, b: string) => a + b, empty: "" };
    	 * const f = (s: string) => s.toUpperCase()
    	 * assert.deepStrictEqual(foldMap(monoid)(f)(["a", "b", "c"]), "ABC");
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.foldMap = RA.foldMap;
    	/**
    	 * Same as [`foldMap`](#foldMap) but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { foldMapWithIndex } from 'fp-ts/Array'
    	 *
    	 * const monoid = { concat: (a: string, b: string) => a + b, empty: "" };
    	 * const f = (index:number, s: string) => `${s.toUpperCase()}(${index})`
    	 * assert.deepStrictEqual(foldMapWithIndex(monoid)(f)(["a", "b", "c"]), "A(0)B(1)C(2)");
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.foldMapWithIndex = RA.foldMapWithIndex;
    	/**
    	 * Reduces an `Array`.
    	 *
    	 * `reduce` executes the supplied iterating function on each element of the array,
    	 * in order, passing in the element and the return value from the calculation on the preceding element.
    	 *
    	 * The first time that the iterating function is called there is no "return value of the
    	 * previous calculation", the initial value is used in its place.
    	 *
    	 * @example
    	 * import { reduce } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(reduce(5, (acc: number, cur: number) => acc * cur)([2, 3]), 5 * 2 * 3);
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduce = RA.reduce;
    	/**
    	 * Same as [`reduce`](#reduce) but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { reduceWithIndex } from 'fp-ts/Array'
    	 *
    	 * const f = (index: number, acc: string, cur: unknown) =>
    	 *   acc + (typeof cur === "string" ? cur.toUpperCase() + index : "");
    	 * assert.deepStrictEqual(reduceWithIndex("", f)([2, "a", "b", null]), "A1B2");
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceWithIndex = RA.reduceWithIndex;
    	/**
    	 * Same as [`reduce`](#reduce) but applied from the end to the start.
    	 *
    	 * *Note*: the iterating function in this case takes the accumulator as the last argument.
    	 *
    	 * @example
    	 * import { reduceRight } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(reduceRight("", (cur: string, acc: string) => acc + cur)(["a", "b", "c"]), "cba");
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceRight = RA.reduceRight;
    	/**
    	 * Same as [`reduceRight`](#reduceRight) but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { reduceRightWithIndex } from 'fp-ts/Array'
    	 *
    	 * const f = (index: number, cur: unknown, acc: string) =>
    	 *   acc + (typeof cur === "string" ? cur.toUpperCase() + index : "");
    	 * assert.deepStrictEqual(reduceRightWithIndex("", f)([2, "a", "b", null]), "B2A1");
    	 *
    	 * @category folding
    	 * @since 2.0.0
    	 */
    	exports.reduceRightWithIndex = RA.reduceRightWithIndex;
    	/**
    	 * Given an iterating function that returns a `HKT` (higher kinded type), `traverse`
    	 * applies the iterating function to each element of the `Array` and then [`sequence`](#sequence)-s
    	 * the results using the provided `Applicative`.
    	 *
    	 * E.g. suppose you have an `Array` and you want to format each element with a function
    	 * that returns a result or an error as `f = (a: A) => Either<Error, B>`, using `traverse`
    	 * you can apply `f` to all elements and directly obtain as a result an `Either<Error,Array<B>>`
    	 * i.e. an `Array<B>` if all the results are `B`, or an `Error` if some of the results
    	 * are `Error`s.
    	 *
    	 * @example
    	 * import { traverse } from 'fp-ts/Array'
    	 * import { Applicative, left, right } from "fp-ts/lib/Either";
    	 *
    	 * const f = (x: unknown) =>
    	 *   typeof x === "string" ? right(x.toUpperCase()) : left(new Error("not a string"));
    	 * assert.deepStrictEqual(traverse(Applicative)(f)(["a", "b"]), right(["A", "B"]));
    	 * assert.deepStrictEqual(traverse(Applicative)(f)(["a", 5]), left(new Error("not a string")));
    	 *
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var traverse = function (F) {
    	    var traverseWithIndexF = (0, exports.traverseWithIndex)(F);
    	    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
    	};
    	exports.traverse = traverse;
    	/**
    	 * `sequence` takes an `Array` where elements are `HKT<A>` (higher kinded type) and,
    	 * using an applicative of that `HKT`, returns an `HKT` of `Array<A>`.
    	 * E.g. it can turn an `Array<Either<Error, string>>` into an `Either<Error, Array<string>>`.
    	 *
    	 * `sequence` requires an `Applicative` of the `HKT` you are targeting, e.g. to turn an
    	 * `Array<Either<E, A>>` into an `Either<E, Array<A>>`, it needs an
    	 * `Applicative` for `Either`, to to turn an `Array<Option<A>>` into an `Option<Array<A>>`,
    	 * it needs an `Applicative` for `Option`.
    	 *
    	 * @example
    	 * import { sequence } from 'fp-ts/Array'
    	 * import { Applicative, left, right } from "fp-ts/lib/Either";
    	 *
    	 * assert.deepStrictEqual(sequence(Applicative)([right("a"), right("b")]), right(["a", "b"]));
    	 * assert.deepStrictEqual(
    	 *   sequence(Applicative)([right("a"), left(new Error("not a string"))]),
    	 *   left(new Error("not a string"))
    	 * );
    	 *
    	 * @category traversing
    	 * @since 2.6.3
    	 */
    	var sequence = function (F) {
    	    return function (ta) {
    	        return _reduce(ta, F.of((0, exports.zero)()), function (fas, fa) {
    	            return F.ap(F.map(fas, function (as) { return function (a) { return (0, function_1.pipe)(as, (0, exports.append)(a)); }; }), fa);
    	        });
    	    };
    	};
    	exports.sequence = sequence;
    	/**
    	 * Same as [`traverse`](#traverse) but passing also the index to the iterating function.
    	 *
    	 * @example
    	 * import { traverseWithIndex } from 'fp-ts/Array'
    	 * import { Applicative, left, right } from "fp-ts/lib/Either";
    	 *
    	 * const f = (index:number, x:unknown) =>
    	 *   typeof x === "string" ? right(x.toUpperCase() + index) : left(new Error("not a string"));
    	 * assert.deepStrictEqual(traverseWithIndex(Applicative)(f)(["a", "b"]), right(["A0", "B1"]));
    	 * assert.deepStrictEqual(traverseWithIndex(Applicative)(f)(["a", 5]), left(new Error("not a string")));
    	 *
    	 * @category sequencing
    	 * @since 2.6.3
    	 */
    	var traverseWithIndex = function (F) {
    	    return function (f) {
    	        return (0, exports.reduceWithIndex)(F.of((0, exports.zero)()), function (i, fbs, a) {
    	            return F.ap(F.map(fbs, function (bs) { return function (b) { return (0, function_1.pipe)(bs, (0, exports.append)(b)); }; }), f(i, a));
    	        });
    	    };
    	};
    	exports.traverseWithIndex = traverseWithIndex;
    	/**
    	 * @category filtering
    	 * @since 2.6.5
    	 */
    	var wither = function (F) {
    	    var _witherF = _wither(F);
    	    return function (f) { return function (fa) { return _witherF(fa, f); }; };
    	};
    	exports.wither = wither;
    	/**
    	 * @category filtering
    	 * @since 2.6.5
    	 */
    	var wilt = function (F) {
    	    var _wiltF = _wilt(F);
    	    return function (f) { return function (fa) { return _wiltF(fa, f); }; };
    	};
    	exports.wilt = wilt;
    	/**
    	 * `unfold` takes a function `f` which returns an `Option` of a tuple containing an outcome
    	 * value and an input for the following iteration.
    	 * `unfold` applies `f` to the initial value `b` and then recursively to the second
    	 * element of the tuple contained in the returned `option` of the previous
    	 * calculation until `f` returns `Option.none`.
    	 *
    	 * @example
    	 * import { unfold } from 'fp-ts/Array'
    	 * import { option } from 'fp-ts'
    	 *
    	 * const f = (n: number) => {
    	 *   if (n <= 0) return option.none;
    	 *   const returnValue = n * 2;
    	 *   const inputForNextRound = n - 1;
    	 *   return option.some([returnValue, inputForNextRound] as const);
    	 * };
    	 * assert.deepStrictEqual(unfold(5, f), [10, 8, 6, 4, 2]);
    	 *
    	 * @since 2.6.6
    	 */
    	var unfold = function (b, f) {
    	    var out = [];
    	    var bb = b;
    	    // eslint-disable-next-line no-constant-condition
    	    while (true) {
    	        var mt = f(bb);
    	        if (_.isSome(mt)) {
    	            var _a = mt.value, a = _a[0], b_1 = _a[1];
    	            out.push(a);
    	            bb = b_1;
    	        }
    	        else {
    	            break;
    	        }
    	    }
    	    return out;
    	};
    	exports.unfold = unfold;
    	/**
    	 * @category type lambdas
    	 * @since 2.0.0
    	 */
    	exports.URI = 'Array';
    	/**
    	 * `getShow` makes a `Show` for an `Array<A>` from a `Show` for
    	 * an `A`.
    	 *
    	 * @example
    	 * import { getShow } from 'fp-ts/Array'
    	 *
    	 * const numShow = { show: (n: number) => (n >= 0 ? `${n}` : `(${-n})`) };
    	 * assert.deepStrictEqual(getShow(numShow).show([-2, -1, 0, 1]), "[(2), (1), 0, 1]");
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	exports.getShow = RA.getShow;
    	/**
    	 * Get a `Semigroup` based on the concatenation of `Array`s.
    	 * See also [`getMonoid`](#getMonoid).
    	 *
    	 * @example
    	 * import { getSemigroup } from 'fp-ts/Array'
    	 *
    	 * const S = getSemigroup<number>();
    	 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1, 2, 2, 3]);
    	 *
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	var getSemigroup = function () { return ({
    	    concat: function (first, second) { return first.concat(second); }
    	}); };
    	exports.getSemigroup = getSemigroup;
    	/**
    	 * Returns a `Monoid` for `Array<A>` based on the concatenation of `Array`s.
    	 *
    	 * @example
    	 * import { getMonoid } from 'fp-ts/Array'
    	 *
    	 * const M = getMonoid<number>()
    	 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	var getMonoid = function () { return ({
    	    concat: (0, exports.getSemigroup)().concat,
    	    empty: []
    	}); };
    	exports.getMonoid = getMonoid;
    	/**
    	 * Derives an `Eq` over the `Array` of a given element type from the `Eq` of that type. The derived `Eq` defines two
    	 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
    	 * different lengths, the result is non equality.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { getEq } from 'fp-ts/Array'
    	 *
    	 * const E = getEq(S.Eq)
    	 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
    	 * assert.strictEqual(E.equals(['a'], []), false)
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	exports.getEq = RA.getEq;
    	/**
    	 * Derives an `Ord` over the `Array` of a given element type from the `Ord` of that type. The ordering between two such
    	 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
    	 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
    	 * the same length, the result is equality.
    	 *
    	 * @example
    	 * import { getOrd } from 'fp-ts/Array'
    	 * import * as S from 'fp-ts/string'
    	 *
    	 * const O = getOrd(S.Ord)
    	 * assert.strictEqual(O.compare(['b'], ['a']), 1)
    	 * assert.strictEqual(O.compare(['a'], ['a']), 0)
    	 * assert.strictEqual(O.compare(['a'], ['b']), -1)
    	 *
    	 * @category instances
    	 * @since 2.0.0
    	 */
    	exports.getOrd = RA.getOrd;
    	/**
    	 * Get a `Semigroup` based on the union of the elements of `Array`s.
    	 * Elements which equal according to the provided `Eq` are included
    	 * only once in the result.
    	 * See also [`getUnionMonoid`](#getUnionMonoid).
    	 *
    	 * @example
    	 * import { getUnionSemigroup } from 'fp-ts/Array';
    	 * import { Eq } from 'fp-ts/number';
    	 *
    	 * const S = getUnionSemigroup<number>(Eq);
    	 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1, 2, 3]);
    	 *
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getUnionSemigroup = function (E) {
    	    var unionE = union(E);
    	    return {
    	        concat: function (first, second) { return unionE(second)(first); }
    	    };
    	};
    	exports.getUnionSemigroup = getUnionSemigroup;
    	/**
    	 * Get a `Monoid` based on the union of the elements of `Array`s.
    	 * Elements which equal according to the provided `Eq` are included
    	 * only once in the result.
    	 *
    	 * @example
    	 * import { getUnionMonoid } from 'fp-ts/Array'
    	 * import { Eq } from 'fp-ts/number';
    	 *
    	 * const M = getUnionMonoid<number>(Eq);
    	 * assert.deepStrictEqual(M.concat([1, 2], [2, 3]), [1, 2, 3]);
    	 * assert.deepStrictEqual(M.empty,[]);
    	 *
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getUnionMonoid = function (E) { return ({
    	    concat: (0, exports.getUnionSemigroup)(E).concat,
    	    empty: []
    	}); };
    	exports.getUnionMonoid = getUnionMonoid;
    	/**
    	 * Get a `Semigroup` based on the intersection of the elements of `Array`s.
    	 * Only elements present in the two arrays which are equal according to the
    	 * provided `Eq` are included in the result.
    	 *
    	 * @example
    	 * import { getIntersectionSemigroup } from 'fp-ts/Array'
    	 * import { Eq } from 'fp-ts/number';
    	 *
    	 * const S = getIntersectionSemigroup<number>(Eq);
    	 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [2]);
    	 *
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getIntersectionSemigroup = function (E) {
    	    var intersectionE = intersection(E);
    	    return {
    	        concat: function (first, second) { return intersectionE(second)(first); }
    	    };
    	};
    	exports.getIntersectionSemigroup = getIntersectionSemigroup;
    	/**
    	 * Get a `Magma` for `Array` where the `concat` function is the differnce between
    	 * the first and the second array, i.e. the result contains all the elements of the
    	 * first array for which their is no equal element in the second array according
    	 * to the `Eq` provided.
    	 *
    	 *
    	 * @example
    	 * import { getDifferenceMagma } from 'fp-ts/Array'
    	 * import { Eq } from 'fp-ts/number';
    	 *
    	 * const S = getDifferenceMagma<number>(Eq);
    	 * assert.deepStrictEqual(S.concat([1, 2], [2, 3]), [1]);
    	 *
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	var getDifferenceMagma = function (E) {
    	    var differenceE = difference(E);
    	    return {
    	        concat: function (first, second) { return differenceE(second)(first); }
    	    };
    	};
    	exports.getDifferenceMagma = getDifferenceMagma;
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Functor = {
    	    URI: exports.URI,
    	    map: _map
    	};
    	/**
    	 * Given an input an `Array` of functions, `flap` returns an `Array` containing
    	 * the results of applying each function to the given input.
    	 *
    	 * @example
    	 * import { flap } from 'fp-ts/Array'
    	 *
    	 * const funs = [
    	 *   (n: number) => `Double: ${n * 2}`,
    	 *   (n: number) => `Triple: ${n * 3}`,
    	 *   (n: number) => `Square: ${n * n}`,
    	 * ];
    	 * assert.deepStrictEqual(flap(4)(funs), ['Double: 8', 'Triple: 12', 'Square: 16']);
    	 *
    	 * @category mapping
    	 * @since 2.10.0
    	 */
    	exports.flap = (0, Functor_1.flap)(exports.Functor);
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Pointed = {
    	    URI: exports.URI,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FunctorWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Apply = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap
    	};
    	/**
    	 * Combine two effectful actions, keeping only the result of the first.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apFirst = (0, Apply_1.apFirst)(exports.Apply);
    	/**
    	 * Combine two effectful actions, keeping only the result of the second.
    	 *
    	 * @since 2.5.0
    	 */
    	exports.apSecond = (0, Apply_1.apSecond)(exports.Apply);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Applicative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of
    	};
    	/**
    	 * @category instances
    	 * @since 2.10.0
    	 */
    	exports.Chain = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap
    	};
    	/**
    	 * Composes computations in sequence, using the return value of one computation to determine the next computation and
    	 * keeping only the result of the first.
    	 *
    	 * @example
    	 * import * as A from 'fp-ts/Array'
    	 * import { pipe } from 'fp-ts/function'
    	 *
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     A.chainFirst(() => ['a', 'b'])
    	 *   ),
    	 *   [1, 1, 2, 2, 3, 3]
    	 * )
    	 * assert.deepStrictEqual(
    	 *   pipe(
    	 *     [1, 2, 3],
    	 *     A.chainFirst(() => [])
    	 *   ),
    	 *   []
    	 * )
    	 *
    	 * @category sequencing
    	 * @since 2.0.0
    	 */
    	exports.chainFirst = 
    	/*#__PURE__*/ (0, Chain_1.chainFirst)(exports.Chain);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Monad = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Unfoldable = {
    	    URI: exports.URI,
    	    unfold: exports.unfold
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alt = {
    	    URI: exports.URI,
    	    map: _map,
    	    alt: _alt
    	};
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.Zero = {
    	    URI: exports.URI,
    	    zero: exports.zero
    	};
    	/**
    	 * @category do notation
    	 * @since 2.11.0
    	 */
    	exports.guard = (0, Zero_1.guard)(exports.Zero, exports.Pointed);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Alternative = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    alt: _alt,
    	    zero: exports.zero
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Extend = {
    	    URI: exports.URI,
    	    map: _map,
    	    extend: _extend
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Compactable = {
    	    URI: exports.URI,
    	    compact: exports.compact,
    	    separate: exports.separate
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Filterable = {
    	    URI: exports.URI,
    	    map: _map,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FilterableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    partitionMapWithIndex: _partitionMapWithIndex,
    	    partitionWithIndex: _partitionWithIndex,
    	    filterMapWithIndex: _filterMapWithIndex,
    	    filterWithIndex: _filterWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Foldable = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.FoldableWithIndex = {
    	    URI: exports.URI,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Traversable = {
    	    URI: exports.URI,
    	    map: _map,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence
    	};
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.TraversableWithIndex = {
    	    URI: exports.URI,
    	    map: _map,
    	    mapWithIndex: _mapWithIndex,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    traverseWithIndex: _traverseWithIndex
    	};
    	var _wither = /*#__PURE__*/ (0, Witherable_1.witherDefault)(exports.Traversable, exports.Compactable);
    	var _wilt = /*#__PURE__*/ (0, Witherable_1.wiltDefault)(exports.Traversable, exports.Compactable);
    	/**
    	 * @category instances
    	 * @since 2.7.0
    	 */
    	exports.Witherable = {
    	    URI: exports.URI,
    	    map: _map,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    wither: _wither,
    	    wilt: _wilt
    	};
    	/**
    	 * @category sequencing
    	 * @since 2.11.0
    	 */
    	exports.chainRecDepthFirst = RA.chainRecDepthFirst;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.ChainRecDepthFirst = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    chainRec: _chainRecDepthFirst
    	};
    	/**
    	 * @category sequencing
    	 * @since 2.11.0
    	 */
    	exports.chainRecBreadthFirst = RA.chainRecBreadthFirst;
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.ChainRecBreadthFirst = {
    	    URI: exports.URI,
    	    map: _map,
    	    ap: _ap,
    	    chain: exports.flatMap,
    	    chainRec: _chainRecBreadthFirst
    	};
    	/**
    	 * Filter values inside a context.
    	 *
    	 * @since 2.11.0
    	 */
    	exports.filterE = (0, Witherable_1.filterE)(exports.Witherable);
    	/**
    	 * @category instances
    	 * @since 2.11.0
    	 */
    	exports.FromEither = {
    	    URI: exports.URI,
    	    fromEither: exports.fromEither
    	};
    	/**
    	 * @category lifting
    	 * @since 2.11.0
    	 */
    	exports.fromEitherK = (0, FromEither_1.fromEitherK)(exports.FromEither);
    	// -------------------------------------------------------------------------------------
    	// unsafe
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category unsafe
    	 * @since 2.0.0
    	 */
    	exports.unsafeInsertAt = NEA.unsafeInsertAt;
    	/**
    	 * @category unsafe
    	 * @since 2.0.0
    	 */
    	var unsafeUpdateAt = function (i, a, as) {
    	    return (0, exports.isNonEmpty)(as) ? NEA.unsafeUpdateAt(i, a, as) : [];
    	};
    	exports.unsafeUpdateAt = unsafeUpdateAt;
    	/**
    	 * @category unsafe
    	 * @since 2.0.0
    	 */
    	var unsafeDeleteAt = function (i, as) {
    	    var xs = as.slice();
    	    xs.splice(i, 1);
    	    return xs;
    	};
    	exports.unsafeDeleteAt = unsafeDeleteAt;
    	// -------------------------------------------------------------------------------------
    	// utils
    	// -------------------------------------------------------------------------------------
    	/**
    	 * `every` tells if the provided predicate holds true for every element in the `Array`.
    	 *
    	 * @example
    	 * import { every } from 'fp-ts/Array'
    	 *
    	 * assert.equal(every((x: number) => x >= 0)([1, 2, 3]), true);
    	 * assert.equal(every((x: number) => x >= 0)([-1, 2, 3]), false);
    	 *
    	 * @since 2.9.0
    	 */
    	exports.every = RA.every;
    	/**
    	 * `some` tells if the provided predicate holds true at least for one element in the `Array`.
    	 *
    	 * @example
    	 * import { some } from 'fp-ts/Array'
    	 *
    	 * assert.equal(some((x: number) => x >= 0)([1, 2, 3]), true);
    	 * assert.equal(some((x: number) => x >= 10)([1, 2, 3]), false);
    	 *
    	 * @since 2.9.0
    	 */
    	var some = function (predicate) {
    	    return function (as) {
    	        return as.some(predicate);
    	    };
    	};
    	exports.some = some;
    	/**
    	 * Alias of [`some`](#some)
    	 *
    	 * @since 2.11.0
    	 */
    	exports.exists = exports.some;
    	/**
    	 * Places an element in between members of an `Array`, then folds the results using the provided `Monoid`.
    	 *
    	 * @example
    	 * import * as S from 'fp-ts/string'
    	 * import { intercalate } from 'fp-ts/Array'
    	 *
    	 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
    	 *
    	 * @since 2.12.0
    	 */
    	exports.intercalate = RA.intercalate;
    	// -------------------------------------------------------------------------------------
    	// do notation
    	// -------------------------------------------------------------------------------------
    	/**
    	 * @category do notation
    	 * @since 2.9.0
    	 */
    	exports.Do = (0, exports.of)(_.emptyRecord);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bindTo = (0, Functor_1.bindTo)(exports.Functor);
    	var let_ = /*#__PURE__*/ (0, Functor_1.let)(exports.Functor);
    	exports.let = let_;
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.bind = (0, Chain_1.bind)(exports.Chain);
    	/**
    	 * @category do notation
    	 * @since 2.8.0
    	 */
    	exports.apS = (0, Apply_1.apS)(exports.Apply);
    	// -------------------------------------------------------------------------------------
    	// legacy
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Alias of `flatMap`.
    	 *
    	 * @category legacy
    	 * @since 2.0.0
    	 */
    	exports.chain = exports.flatMap;
    	// -------------------------------------------------------------------------------------
    	// deprecated
    	// -------------------------------------------------------------------------------------
    	/**
    	 * Use `NonEmptyArray` module instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.range = NEA.range;
    	/**
    	 * Use a new `[]` instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.empty = [];
    	/**
    	 * Use `prepend` instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.cons = NEA.cons;
    	/**
    	 * Use `append` instead.
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.snoc = NEA.snoc;
    	/**
    	 * Use `prependAll` instead
    	 *
    	 * @category zone of death
    	 * @since 2.9.0
    	 * @deprecated
    	 */
    	exports.prependToAll = exports.prependAll;
    	/**
    	 * This instance is deprecated, use small, specific instances instead.
    	 * For example if a function needs a `Functor` instance, pass `A.Functor` instead of `A.array`
    	 * (where `A` is from `import A from 'fp-ts/Array'`)
    	 *
    	 * @category zone of death
    	 * @since 2.0.0
    	 * @deprecated
    	 */
    	exports.array = {
    	    URI: exports.URI,
    	    compact: exports.compact,
    	    separate: exports.separate,
    	    map: _map,
    	    ap: _ap,
    	    of: exports.of,
    	    chain: exports.flatMap,
    	    filter: _filter,
    	    filterMap: _filterMap,
    	    partition: _partition,
    	    partitionMap: _partitionMap,
    	    mapWithIndex: _mapWithIndex,
    	    partitionMapWithIndex: _partitionMapWithIndex,
    	    partitionWithIndex: _partitionWithIndex,
    	    filterMapWithIndex: _filterMapWithIndex,
    	    filterWithIndex: _filterWithIndex,
    	    alt: _alt,
    	    zero: exports.zero,
    	    unfold: exports.unfold,
    	    reduce: _reduce,
    	    foldMap: _foldMap,
    	    reduceRight: _reduceRight,
    	    traverse: _traverse,
    	    sequence: exports.sequence,
    	    reduceWithIndex: _reduceWithIndex,
    	    foldMapWithIndex: _foldMapWithIndex,
    	    reduceRightWithIndex: _reduceRightWithIndex,
    	    traverseWithIndex: _traverseWithIndex,
    	    extend: _extend,
    	    wither: _wither,
    	    wilt: _wilt
    	}; 
    } (_Array));

    (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    /**
     * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
     *
     * **Note**. `n` is normalized to a natural number.
     *
     * @example
     * import { makeBy } from 'fp-ts/NonEmptyArray'
     * import { pipe } from 'fp-ts/function'
     *
     * const double = (n: number): number => n * 2
     * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
     *
     * @category constructors
     * @since 2.11.0
     */
    var makeBy = function (f) {
        return function (n) {
            var j = Math.max(0, Math.floor(n));
            var out = [f(0)];
            for (var i = 1; i < j; i++) {
                out.push(f(i));
            }
            return out;
        };
    };
    /**
     * Create a `NonEmptyArray` containing a range of integers, including both endpoints.
     *
     * @example
     * import { range } from 'fp-ts/NonEmptyArray'
     *
     * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
     *
     * @category constructors
     * @since 2.11.0
     */
    var range = function (start, end) {
        return start <= end ? makeBy(function (i) { return start + i; })(end - start + 1) : [start];
    };

    var Sc=Object.create;var As=Object.defineProperty;var xc=Object.getOwnPropertyDescriptor;var Mc=Object.getOwnPropertyNames,qs=Object.getOwnPropertySymbols,Ec=Object.getPrototypeOf,Rs=Object.prototype.hasOwnProperty,vc=Object.prototype.propertyIsEnumerable;var Fs=(c,h,s)=>h in c?As(c,h,{enumerable:!0,configurable:!0,writable:!0,value:s}):c[h]=s,Ls=(c,h)=>{for(var s in h||(h={}))Rs.call(h,s)&&Fs(c,s,h[s]);if(qs)for(var s of qs(h))vc.call(h,s)&&Fs(c,s,h[s]);return c};var _=(c,h)=>()=>(h||c((h={exports:{}}).exports,h),h.exports);var Tc=(c,h,s,i)=>{if(h&&typeof h=="object"||typeof h=="function")for(let n of Mc(h))!Rs.call(c,n)&&n!==s&&As(c,n,{get:()=>h[n],enumerable:!(i=xc(h,n))||i.enumerable});return c};var js=(c,h,s)=>(s=c!=null?Sc(Ec(c)):{},Tc(h||!c||!c.__esModule?As(s,"default",{value:c,enumerable:!0}):s,c));var Us=_((Ns,Gs)=>{(function(c){var h=2e3,s={s:1,n:0,d:1};function i(u,o){if(isNaN(u=parseInt(u,10)))throw y.InvalidParameter;return u*o}function n(u,o){if(o===0)throw y.DivisionByZero;var l=Object.create(y.prototype);l.s=u<0?-1:1,u=u<0?-u:u;var m=O(u,o);return l.n=u/m,l.d=o/m,l}function p(u){for(var o={},l=u,m=2,w=4;w<=l;){for(;l%m===0;)l/=m,o[m]=(o[m]||0)+1;w+=1+2*m++;}return l!==u?l>1&&(o[l]=(o[l]||0)+1):o[u]=(o[u]||0)+1,o}var e=function(u,o){var l=0,m=1,w=1,v=0,A=0,X=0,L=1,z=1,S=0,x=1,q=1,C=1,F=1e7,Ts;if(u!=null)if(o!==void 0){if(l=u,m=o,w=l*m,l%1!==0||m%1!==0)throw y.NonIntegerParameter}else switch(typeof u){case"object":{if("d"in u&&"n"in u)l=u.n,m=u.d,"s"in u&&(l*=u.s);else if(0 in u)l=u[0],1 in u&&(m=u[1]);else throw y.InvalidParameter;w=l*m;break}case"number":{if(u<0&&(w=u,u=-u),u%1===0)l=u;else if(u>0){for(u>=1&&(z=Math.pow(10,Math.floor(1+Math.log(u)/Math.LN10)),u/=z);x<=F&&C<=F;)if(Ts=(S+q)/(x+C),u===Ts){x+C<=F?(l=S+q,m=x+C):C>x?(l=q,m=C):(l=S,m=x);break}else u>Ts?(S+=q,x+=C):(q+=S,C+=x),x>F?(l=q,m=C):(l=S,m=x);l*=z;}else (isNaN(u)||isNaN(o))&&(m=l=NaN);break}case"string":{if(x=u.match(/\d+|./g),x===null)throw y.InvalidParameter;if(x[S]==="-"?(w=-1,S++):x[S]==="+"&&S++,x.length===S+1?A=i(x[S++],w):x[S+1]==="."||x[S]==="."?(x[S]!=="."&&(v=i(x[S++],w)),S++,(S+1===x.length||x[S+1]==="("&&x[S+3]===")"||x[S+1]==="'"&&x[S+3]==="'")&&(A=i(x[S],w),L=Math.pow(10,x[S].length),S++),(x[S]==="("&&x[S+2]===")"||x[S]==="'"&&x[S+2]==="'")&&(X=i(x[S+1],w),z=Math.pow(10,x[S+1].length)-1,S+=3)):x[S+1]==="/"||x[S+1]===":"?(A=i(x[S],w),L=i(x[S+2],1),S+=3):x[S+3]==="/"&&x[S+1]===" "&&(v=i(x[S],w),A=i(x[S+2],w),L=i(x[S+4],1),S+=5),x.length<=S){m=L*z,w=l=X+m*v+z*A;break}}default:throw y.InvalidParameter}if(m===0)throw y.DivisionByZero;s.s=w<0?-1:1,s.n=Math.abs(l),s.d=Math.abs(m);};function f(u,o,l){for(var m=1;o>0;u=u*u%l,o>>=1)o&1&&(m=m*u%l);return m}function b(u,o){for(;o%2===0;o/=2);for(;o%5===0;o/=5);if(o===1)return 0;for(var l=10%o,m=1;l!==1;m++)if(l=l*10%o,m>h)return 0;return m}function M(u,o,l){for(var m=1,w=f(10,l,o),v=0;v<300;v++){if(m===w)return v;m=m*10%o,w=w*10%o;}return 0}function O(u,o){if(!u)return o;if(!o)return u;for(;;){if(u%=o,!u)return o;if(o%=u,!o)return u}}function y(u,o){if(e(u,o),this instanceof y)u=O(s.d,s.n),this.s=s.s,this.n=s.n/u,this.d=s.d/u;else return n(s.s*s.n,s.d)}y.DivisionByZero=new Error("Division by Zero"),y.InvalidParameter=new Error("Invalid argument"),y.NonIntegerParameter=new Error("Parameters must be integer"),y.prototype={s:1,n:0,d:1,abs:function(){return n(this.n,this.d)},neg:function(){return n(-this.s*this.n,this.d)},add:function(u,o){return e(u,o),n(this.s*this.n*s.d+s.s*this.d*s.n,this.d*s.d)},sub:function(u,o){return e(u,o),n(this.s*this.n*s.d-s.s*this.d*s.n,this.d*s.d)},mul:function(u,o){return e(u,o),n(this.s*s.s*this.n*s.n,this.d*s.d)},div:function(u,o){return e(u,o),n(this.s*s.s*this.n*s.d,this.d*s.n)},clone:function(){return n(this.s*this.n,this.d)},mod:function(u,o){if(isNaN(this.n)||isNaN(this.d))return new y(NaN);if(u===void 0)return n(this.s*this.n%this.d,1);if(e(u,o),s.n===0&&this.d===0)throw y.DivisionByZero;return n(this.s*(s.d*this.n)%(s.n*this.d),s.d*this.d)},gcd:function(u,o){return e(u,o),n(O(s.n,this.n)*O(s.d,this.d),s.d*this.d)},lcm:function(u,o){return e(u,o),s.n===0&&this.n===0?n(0,1):n(s.n*this.n,O(s.n,this.n)*O(s.d,this.d))},ceil:function(u){return u=Math.pow(10,u||0),isNaN(this.n)||isNaN(this.d)?new y(NaN):n(Math.ceil(u*this.s*this.n/this.d),u)},floor:function(u){return u=Math.pow(10,u||0),isNaN(this.n)||isNaN(this.d)?new y(NaN):n(Math.floor(u*this.s*this.n/this.d),u)},round:function(u){return u=Math.pow(10,u||0),isNaN(this.n)||isNaN(this.d)?new y(NaN):n(Math.round(u*this.s*this.n/this.d),u)},inverse:function(){return n(this.s*this.d,this.n)},pow:function(u,o){if(e(u,o),s.d===1)return s.s<0?n(Math.pow(this.s*this.d,s.n),Math.pow(this.n,s.n)):n(Math.pow(this.s*this.n,s.n),Math.pow(this.d,s.n));if(this.s<0)return null;var l=p(this.n),m=p(this.d),w=1,v=1;for(var A in l)if(A!=="1"){if(A==="0"){w=0;break}if(l[A]*=s.n,l[A]%s.d===0)l[A]/=s.d;else return null;w*=Math.pow(A,l[A]);}for(var A in m)if(A!=="1"){if(m[A]*=s.n,m[A]%s.d===0)m[A]/=s.d;else return null;v*=Math.pow(A,m[A]);}return s.s<0?n(v,w):n(w,v)},equals:function(u,o){return e(u,o),this.s*this.n*s.d===s.s*s.n*this.d},compare:function(u,o){e(u,o);var l=this.s*this.n*s.d-s.s*s.n*this.d;return (0<l)-(l<0)},simplify:function(u){if(isNaN(this.n)||isNaN(this.d))return this;u=u||.001;for(var o=this.abs(),l=o.toContinued(),m=1;m<l.length;m++){for(var w=n(l[m-1],1),v=m-2;v>=0;v--)w=w.inverse().add(l[v]);if(w.sub(o).abs().valueOf()<u)return w.mul(this.s)}return this},divisible:function(u,o){return e(u,o),!(!(s.n*this.d)||this.n*s.d%(s.n*this.d))},valueOf:function(){return this.s*this.n/this.d},toFraction:function(u){var o,l="",m=this.n,w=this.d;return this.s<0&&(l+="-"),w===1?l+=m:(u&&(o=Math.floor(m/w))>0&&(l+=o,l+=" ",m%=w),l+=m,l+="/",l+=w),l},toLatex:function(u){var o,l="",m=this.n,w=this.d;return this.s<0&&(l+="-"),w===1?l+=m:(u&&(o=Math.floor(m/w))>0&&(l+=o,m%=w),l+="\\frac{",l+=m,l+="}{",l+=w,l+="}"),l},toContinued:function(){var u,o=this.n,l=this.d,m=[];if(isNaN(o)||isNaN(l))return m;do m.push(Math.floor(o/l)),u=o%l,o=l,l=u;while(o!==1);return m},toString:function(u){var o=this.n,l=this.d;if(isNaN(o)||isNaN(l))return "NaN";u=u||15;var m=b(o,l),w=M(o,l,m),v=this.s<0?"-":"";if(v+=o/l|0,o%=l,o*=10,o&&(v+="."),m){for(var A=w;A--;)v+=o/l|0,o%=l,o*=10;v+="(";for(var A=m;A--;)v+=o/l|0,o%=l,o*=10;v+=")";}else for(var A=u;o&&A--;)v+=o/l|0,o%=l,o*=10;return v}},typeof define=="function"&&define.amd?define([],function(){return y}):typeof Ns=="object"?(Object.defineProperty(y,"__esModule",{value:!0}),y.default=y,y.Fraction=y,Gs.exports=y):c.Fraction=y;})(Ns);});var Hs=_((ri,Ws)=>{var Zs=(c=0)=>h=>`\x1B[${38+c};5;${h}m`,Vs=(c=0)=>(h,s,i)=>`\x1B[${38+c};2;${h};${s};${i}m`;function Ac(){let c=new Map,h={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}};h.color.gray=h.color.blackBright,h.bgColor.bgGray=h.bgColor.bgBlackBright,h.color.grey=h.color.blackBright,h.bgColor.bgGrey=h.bgColor.bgBlackBright;for(let[s,i]of Object.entries(h)){for(let[n,p]of Object.entries(i))h[n]={open:`\x1B[${p[0]}m`,close:`\x1B[${p[1]}m`},i[n]=h[n],c.set(p[0],p[1]);Object.defineProperty(h,s,{value:i,enumerable:!1});}return Object.defineProperty(h,"codes",{value:c,enumerable:!1}),h.color.close="\x1B[39m",h.bgColor.close="\x1B[49m",h.color.ansi256=Zs(),h.color.ansi16m=Vs(),h.bgColor.ansi256=Zs(10),h.bgColor.ansi16m=Vs(10),Object.defineProperties(h,{rgbToAnsi256:{value:(s,i,n)=>s===i&&i===n?s<8?16:s>248?231:Math.round((s-8)/247*24)+232:16+36*Math.round(s/255*5)+6*Math.round(i/255*5)+Math.round(n/255*5),enumerable:!1},hexToRgb:{value:s=>{let i=new RegExp("(?<colorString>[a-f\\d]{6}|[a-f\\d]{3})","i").exec(s.toString(16));if(!i)return [0,0,0];let{colorString:n}=i.groups;n.length===3&&(n=n.split("").map(e=>e+e).join(""));let p=Number.parseInt(n,16);return [p>>16&255,p>>8&255,p&255]},enumerable:!1},hexToAnsi256:{value:s=>h.rgbToAnsi256(...h.hexToRgb(s)),enumerable:!1}}),h}Object.defineProperty(Ws,"exports",{enumerable:!0,get:Ac});});var ss=_(J=>{Object.defineProperty(J,"__esModule",{value:!0});J.printIteratorEntries=Oc;J.printIteratorValues=ac;J.printListItems=Ic;J.printObjectProperties=Cc;var Nc=(c,h)=>{let s=Object.keys(c),i=h!==null?s.sort(h):s;return Object.getOwnPropertySymbols&&Object.getOwnPropertySymbols(c).forEach(n=>{Object.getOwnPropertyDescriptor(c,n).enumerable&&i.push(n);}),i};function Oc(c,h,s,i,n,p,e=": "){let f="",b=0,M=c.next();if(!M.done){f+=h.spacingOuter;let O=s+h.indent;for(;!M.done;){if(f+=O,b++===h.maxWidth){f+="\u2026";break}let y=p(M.value[0],h,O,i,n),u=p(M.value[1],h,O,i,n);f+=y+e+u,M=c.next(),M.done?h.min||(f+=","):f+=`,${h.spacingInner}`;}f+=h.spacingOuter+s;}return f}function ac(c,h,s,i,n,p){let e="",f=0,b=c.next();if(!b.done){e+=h.spacingOuter;let M=s+h.indent;for(;!b.done;){if(e+=M,f++===h.maxWidth){e+="\u2026";break}e+=p(b.value,h,M,i,n),b=c.next(),b.done?h.min||(e+=","):e+=`,${h.spacingInner}`;}e+=h.spacingOuter+s;}return e}function Ic(c,h,s,i,n,p){let e="";if(c.length){e+=h.spacingOuter;let f=s+h.indent;for(let b=0;b<c.length;b++){if(e+=f,b===h.maxWidth){e+="\u2026";break}b in c&&(e+=p(c[b],h,f,i,n)),b<c.length-1?e+=`,${h.spacingInner}`:h.min||(e+=",");}e+=h.spacingOuter+s;}return e}function Cc(c,h,s,i,n,p){let e="",f=Nc(c,h.compareKeys);if(f.length){e+=h.spacingOuter;let b=s+h.indent;for(let M=0;M<f.length;M++){let O=f[M],y=p(O,h,b,i,n),u=p(c[O],h,b,i,n);e+=`${b+y}: ${u}`,M<f.length-1?e+=`,${h.spacingInner}`:h.min||(e+=",");}e+=h.spacingOuter+s;}return e}});var Ks=_(j=>{Object.defineProperty(j,"__esModule",{value:!0});j.test=j.serialize=j.default=void 0;var Xs=ss(),Os=globalThis["jest-symbol-do-not-touch"]||globalThis.Symbol,_c=typeof Os=="function"&&Os.for?Os.for("jest.asymmetricMatcher"):1267621,ps=" ",Qs=(c,h,s,i,n,p)=>{let e=c.toString();if(e==="ArrayContaining"||e==="ArrayNotContaining")return ++i>h.maxDepth?`[${e}]`:`${e+ps}[${(0, Xs.printListItems)(c.sample,h,s,i,n,p)}]`;if(e==="ObjectContaining"||e==="ObjectNotContaining")return ++i>h.maxDepth?`[${e}]`:`${e+ps}{${(0, Xs.printObjectProperties)(c.sample,h,s,i,n,p)}}`;if(e==="StringMatching"||e==="StringNotMatching"||e==="StringContaining"||e==="StringNotContaining")return e+ps+p(c.sample,h,s,i,n);if(typeof c.toAsymmetricMatcher!="function")throw new Error(`Asymmetric matcher ${c.constructor.name} does not implement toAsymmetricMatcher()`);return c.toAsymmetricMatcher()};j.serialize=Qs;var Ys=c=>c&&c.$$typeof===_c;j.test=Ys;var $c={serialize:Qs,test:Ys},kc=$c;j.default=kc;});var sh=_(G=>{Object.defineProperty(G,"__esModule",{value:!0});G.test=G.serialize=G.default=void 0;var Js=ss(),Dc=" ",rs=["DOMStringMap","NamedNodeMap"],Pc=/^(HTML\w*Collection|NodeList)$/,Bc=c=>rs.indexOf(c)!==-1||Pc.test(c),gs=c=>c&&c.constructor&&!!c.constructor.name&&Bc(c.constructor.name);G.test=gs;var zc=c=>c.constructor.name==="NamedNodeMap",ts=(c,h,s,i,n,p)=>{let e=c.constructor.name;return ++i>h.maxDepth?`[${e}]`:(h.min?"":e+Dc)+(rs.indexOf(e)!==-1?`{${(0, Js.printObjectProperties)(zc(c)?Array.from(c).reduce((f,b)=>(f[b.name]=b.value,f),{}):Ls({},c),h,s,i,n,p)}}`:`[${(0, Js.printListItems)(Array.from(c),h,s,i,n,p)}]`)};G.serialize=ts;var qc={serialize:ts,test:gs},Fc=qc;G.default=Fc;});var hh=_(as=>{Object.defineProperty(as,"__esModule",{value:!0});as.default=Rc;function Rc(c){return c.replace(/</g,"&lt;").replace(/>/g,"&gt;")}});var es=_($=>{Object.defineProperty($,"__esModule",{value:!0});$.printText=$.printProps=$.printElementAsLeaf=$.printElement=$.printComment=$.printChildren=void 0;var ch=Lc(hh());function Lc(c){return c&&c.__esModule?c:{default:c}}var jc=(c,h,s,i,n,p,e)=>{let f=i+s.indent,b=s.colors;return c.map(M=>{let O=h[M],y=e(O,s,f,n,p);return typeof O!="string"&&(y.indexOf(`
`)!==-1&&(y=s.spacingOuter+f+y+s.spacingOuter+i),y=`{${y}}`),`${s.spacingInner+i+b.prop.open+M+b.prop.close}=${b.value.open}${y}${b.value.close}`}).join("")};$.printProps=jc;var Gc=(c,h,s,i,n,p)=>c.map(e=>h.spacingOuter+s+(typeof e=="string"?ih(e,h):p(e,h,s,i,n))).join("");$.printChildren=Gc;var ih=(c,h)=>{let s=h.colors.content;return s.open+(0, ch.default)(c)+s.close};$.printText=ih;var Uc=(c,h)=>{let s=h.colors.comment;return `${s.open}<!--${(0, ch.default)(c)}-->${s.close}`};$.printComment=Uc;var Zc=(c,h,s,i,n)=>{let p=i.colors.tag;return `${p.open}<${c}${h&&p.close+h+i.spacingOuter+n+p.open}${s?`>${p.close}${s}${i.spacingOuter}${n}${p.open}</${c}`:`${h&&!i.min?"":" "}/`}>${p.close}`};$.printElement=Zc;var Vc=(c,h)=>{let s=h.colors.tag;return `${s.open}<${c}${s.close} \u2026${s.open} />${s.close}`};$.printElementAsLeaf=Vc;});var lh=_(U=>{Object.defineProperty(U,"__esModule",{value:!0});U.test=U.serialize=U.default=void 0;var r=es(),Wc=1,nh=3,ph=8,eh=11,Hc=/^((HTML|SVG)\w*)?Element$/,Xc=c=>{try{return typeof c.hasAttribute=="function"&&c.hasAttribute("is")}catch(h){return !1}},Qc=c=>{let h=c.constructor.name,{nodeType:s,tagName:i}=c,n=typeof i=="string"&&i.includes("-")||Xc(c);return s===Wc&&(Hc.test(h)||n)||s===nh&&h==="Text"||s===ph&&h==="Comment"||s===eh&&h==="DocumentFragment"},uh=c=>{var h;return ((h=c==null?void 0:c.constructor)==null?void 0:h.name)&&Qc(c)};U.test=uh;function Yc(c){return c.nodeType===nh}function Kc(c){return c.nodeType===ph}function Is(c){return c.nodeType===eh}var oh=(c,h,s,i,n,p)=>{if(Yc(c))return (0, r.printText)(c.data,h);if(Kc(c))return (0, r.printComment)(c.data,h);let e=Is(c)?"DocumentFragment":c.tagName.toLowerCase();return ++i>h.maxDepth?(0, r.printElementAsLeaf)(e,h):(0, r.printElement)(e,(0, r.printProps)(Is(c)?[]:Array.from(c.attributes).map(f=>f.name).sort(),Is(c)?{}:Array.from(c.attributes).reduce((f,b)=>(f[b.name]=b.value,f),{}),h,s+h.indent,i,n,p),(0, r.printChildren)(Array.prototype.slice.call(c.childNodes||c.children),h,s+h.indent,i,n,p),h,s)};U.serialize=oh;var Jc={serialize:oh,test:uh},rc=Jc;U.default=rc;});var wh=_(Z=>{Object.defineProperty(Z,"__esModule",{value:!0});Z.test=Z.serialize=Z.default=void 0;var hs=ss(),gc="@@__IMMUTABLE_ITERABLE__@@",tc="@@__IMMUTABLE_LIST__@@",si="@@__IMMUTABLE_KEYED__@@",hi="@@__IMMUTABLE_MAP__@@",fh="@@__IMMUTABLE_ORDERED__@@",ci="@@__IMMUTABLE_RECORD__@@",ii="@@__IMMUTABLE_SEQ__@@",ni="@@__IMMUTABLE_SET__@@",pi="@@__IMMUTABLE_STACK__@@",g=c=>`Immutable.${c}`,us=c=>`[${c}]`,cs=" ",mh="\u2026",ei=(c,h,s,i,n,p,e)=>++i>h.maxDepth?us(g(e)):`${g(e)+cs}{${(0, hs.printIteratorEntries)(c.entries(),h,s,i,n,p)}}`;function ui(c){let h=0;return {next(){if(h<c._keys.length){let s=c._keys[h++];return {done:!1,value:[s,c.get(s)]}}return {done:!0,value:void 0}}}}var oi=(c,h,s,i,n,p)=>{let e=g(c._name||"Record");return ++i>h.maxDepth?us(e):`${e+cs}{${(0, hs.printIteratorEntries)(ui(c),h,s,i,n,p)}}`},li=(c,h,s,i,n,p)=>{let e=g("Seq");return ++i>h.maxDepth?us(e):c[si]?`${e+cs}{${c._iter||c._object?(0, hs.printIteratorEntries)(c.entries(),h,s,i,n,p):mh}}`:`${e+cs}[${c._iter||c._array||c._collection||c._iterable?(0, hs.printIteratorValues)(c.values(),h,s,i,n,p):mh}]`},Cs=(c,h,s,i,n,p,e)=>++i>h.maxDepth?us(g(e)):`${g(e)+cs}[${(0, hs.printIteratorValues)(c.values(),h,s,i,n,p)}]`,bh=(c,h,s,i,n,p)=>c[hi]?ei(c,h,s,i,n,p,c[fh]?"OrderedMap":"Map"):c[tc]?Cs(c,h,s,i,n,p,"List"):c[ni]?Cs(c,h,s,i,n,p,c[fh]?"OrderedSet":"Set"):c[pi]?Cs(c,h,s,i,n,p,"Stack"):c[ii]?li(c,h,s,i,n,p):oi(c,h,s,i,n,p);Z.serialize=bh;var dh=c=>c&&(c[gc]===!0||c[ci]===!0);Z.test=dh;var fi={serialize:bh,test:dh},mi=fi;Z.default=mi;});var Sh=_(a=>{var _s=Symbol.for("react.element"),$s=Symbol.for("react.portal"),os=Symbol.for("react.fragment"),ls=Symbol.for("react.strict_mode"),fs=Symbol.for("react.profiler"),ms=Symbol.for("react.provider"),bs=Symbol.for("react.context"),bi=Symbol.for("react.server_context"),ds=Symbol.for("react.forward_ref"),ws=Symbol.for("react.suspense"),ys=Symbol.for("react.suspense_list"),Ss=Symbol.for("react.memo"),xs=Symbol.for("react.lazy"),di=Symbol.for("react.offscreen"),yh;yh=Symbol.for("react.module.reference");function P(c){if(typeof c=="object"&&c!==null){var h=c.$$typeof;switch(h){case _s:switch(c=c.type,c){case os:case fs:case ls:case ws:case ys:return c;default:switch(c=c&&c.$$typeof,c){case bi:case bs:case ds:case xs:case Ss:case ms:return c;default:return h}}case $s:return h}}}a.ContextConsumer=bs;a.ContextProvider=ms;a.Element=_s;a.ForwardRef=ds;a.Fragment=os;a.Lazy=xs;a.Memo=Ss;a.Portal=$s;a.Profiler=fs;a.StrictMode=ls;a.Suspense=ws;a.SuspenseList=ys;a.isAsyncMode=function(){return !1};a.isConcurrentMode=function(){return !1};a.isContextConsumer=function(c){return P(c)===bs};a.isContextProvider=function(c){return P(c)===ms};a.isElement=function(c){return typeof c=="object"&&c!==null&&c.$$typeof===_s};a.isForwardRef=function(c){return P(c)===ds};a.isFragment=function(c){return P(c)===os};a.isLazy=function(c){return P(c)===xs};a.isMemo=function(c){return P(c)===Ss};a.isPortal=function(c){return P(c)===$s};a.isProfiler=function(c){return P(c)===fs};a.isStrictMode=function(c){return P(c)===ls};a.isSuspense=function(c){return P(c)===ws};a.isSuspenseList=function(c){return P(c)===ys};a.isValidElementType=function(c){return typeof c=="string"||typeof c=="function"||c===os||c===fs||c===ls||c===ws||c===ys||c===di||typeof c=="object"&&c!==null&&(c.$$typeof===xs||c.$$typeof===Ss||c.$$typeof===ms||c.$$typeof===bs||c.$$typeof===ds||c.$$typeof===yh||c.getModuleId!==void 0)};a.typeOf=P;});var Mh=_((on,xh)=>{xh.exports=Sh();});var Oh=_(V=>{Object.defineProperty(V,"__esModule",{value:!0});V.test=V.serialize=V.default=void 0;var Q=wi(Mh()),Ms=es();function vh(c){if(typeof WeakMap!="function")return null;var h=new WeakMap,s=new WeakMap;return (vh=function(i){return i?s:h})(c)}function wi(c,h){if(!h&&c&&c.__esModule)return c;if(c===null||typeof c!="object"&&typeof c!="function")return {default:c};var s=vh(h);if(s&&s.has(c))return s.get(c);var i={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var p in c)if(p!=="default"&&Object.prototype.hasOwnProperty.call(c,p)){var e=n?Object.getOwnPropertyDescriptor(c,p):null;e&&(e.get||e.set)?Object.defineProperty(i,p,e):i[p]=c[p];}return i.default=c,s&&s.set(c,i),i}var Th=(c,h=[])=>(Array.isArray(c)?c.forEach(s=>{Th(s,h);}):c!=null&&c!==!1&&h.push(c),h),Eh=c=>{let h=c.type;if(typeof h=="string")return h;if(typeof h=="function")return h.displayName||h.name||"Unknown";if(Q.isFragment(c))return "React.Fragment";if(Q.isSuspense(c))return "React.Suspense";if(typeof h=="object"&&h!==null){if(Q.isContextProvider(c))return "Context.Provider";if(Q.isContextConsumer(c))return "Context.Consumer";if(Q.isForwardRef(c)){if(h.displayName)return h.displayName;let s=h.render.displayName||h.render.name||"";return s!==""?`ForwardRef(${s})`:"ForwardRef"}if(Q.isMemo(c)){let s=h.displayName||h.type.displayName||h.type.name||"";return s!==""?`Memo(${s})`:"Memo"}}return "UNDEFINED"},yi=c=>{let{props:h}=c;return Object.keys(h).filter(s=>s!=="children"&&h[s]!==void 0).sort()},Ah=(c,h,s,i,n,p)=>++i>h.maxDepth?(0, Ms.printElementAsLeaf)(Eh(c),h):(0, Ms.printElement)(Eh(c),(0, Ms.printProps)(yi(c),c.props,h,s+h.indent,i,n,p),(0, Ms.printChildren)(Th(c.props.children),h,s+h.indent,i,n,p),h,s);V.serialize=Ah;var Nh=c=>c!=null&&Q.isElement(c);V.test=Nh;var Si={serialize:Ah,test:Nh},xi=Si;V.default=xi;});var Ch=_(W=>{Object.defineProperty(W,"__esModule",{value:!0});W.test=W.serialize=W.default=void 0;var Es=es(),ks=globalThis["jest-symbol-do-not-touch"]||globalThis.Symbol,Mi=typeof ks=="function"&&ks.for?ks.for("react.test.json"):245830487,Ei=c=>{let{props:h}=c;return h?Object.keys(h).filter(s=>h[s]!==void 0).sort():[]},ah=(c,h,s,i,n,p)=>++i>h.maxDepth?(0, Es.printElementAsLeaf)(c.type,h):(0, Es.printElement)(c.type,c.props?(0, Es.printProps)(Ei(c),c.props,h,s+h.indent,i,n,p):"",c.children?(0, Es.printChildren)(c.children,h,s+h.indent,i,n,p):"",h,s);W.serialize=ah;var Ih=c=>c&&c.$$typeof===Mi;W.test=Ih;var vi={serialize:ah,test:Ih},Ti=vi;W.default=Ti;});var Vh=_(R=>{Object.defineProperty(R,"__esModule",{value:!0});R.default=R.DEFAULT_OPTIONS=void 0;R.format=Zh;R.plugins=void 0;var Ai=Y(Hs()),is=ss(),Ni=Y(Ks()),Oi=Y(sh()),ai=Y(lh()),Ii=Y(wh()),Ci=Y(Oh()),_i=Y(Ch());function Y(c){return c&&c.__esModule?c:{default:c}}var Bh=Object.prototype.toString,$i=Date.prototype.toISOString,ki=Error.prototype.toString,_h=RegExp.prototype.toString,Ds=c=>typeof c.constructor=="function"&&c.constructor.name||"Object",Di=c=>typeof window!="undefined"&&c===window,Pi=/^Symbol\((.*)\)(.*)$/,Bi=/\n/gi,vs=class extends Error{constructor(h,s){super(h),this.stack=s,this.name=this.constructor.name;}};function zi(c){return c==="[object Array]"||c==="[object ArrayBuffer]"||c==="[object DataView]"||c==="[object Float32Array]"||c==="[object Float64Array]"||c==="[object Int8Array]"||c==="[object Int16Array]"||c==="[object Int32Array]"||c==="[object Uint8Array]"||c==="[object Uint8ClampedArray]"||c==="[object Uint16Array]"||c==="[object Uint32Array]"}function qi(c){return Object.is(c,-0)?"-0":String(c)}function Fi(c){return String(`${c}n`)}function $h(c,h){return h?`[Function ${c.name||"anonymous"}]`:"[Function]"}function kh(c){return String(c).replace(Pi,"Symbol($1)")}function Dh(c){return `[${ki.call(c)}]`}function zh(c,h,s,i){if(c===!0||c===!1)return `${c}`;if(c===void 0)return "undefined";if(c===null)return "null";let n=typeof c;if(n==="number")return qi(c);if(n==="bigint")return Fi(c);if(n==="string")return i?`"${c.replace(/"|\\/g,"\\$&")}"`:`"${c}"`;if(n==="function")return $h(c,h);if(n==="symbol")return kh(c);let p=Bh.call(c);return p==="[object WeakMap]"?"WeakMap {}":p==="[object WeakSet]"?"WeakSet {}":p==="[object Function]"||p==="[object GeneratorFunction]"?$h(c,h):p==="[object Symbol]"?kh(c):p==="[object Date]"?isNaN(+c)?"Date { NaN }":$i.call(c):p==="[object Error]"?Dh(c):p==="[object RegExp]"?s?_h.call(c).replace(/[\\^$*+?.()|[\]{}]/g,"\\$&"):_h.call(c):c instanceof Error?Dh(c):null}function qh(c,h,s,i,n,p){if(n.indexOf(c)!==-1)return "[Circular]";n=n.slice(),n.push(c);let e=++i>h.maxDepth,f=h.min;if(h.callToJSON&&!e&&c.toJSON&&typeof c.toJSON=="function"&&!p)return H(c.toJSON(),h,s,i,n,!0);let b=Bh.call(c);return b==="[object Arguments]"?e?"[Arguments]":`${f?"":"Arguments "}[${(0, is.printListItems)(c,h,s,i,n,H)}]`:zi(b)?e?`[${c.constructor.name}]`:`${f||!h.printBasicPrototype&&c.constructor.name==="Array"?"":`${c.constructor.name} `}[${(0, is.printListItems)(c,h,s,i,n,H)}]`:b==="[object Map]"?e?"[Map]":`Map {${(0, is.printIteratorEntries)(c.entries(),h,s,i,n,H," => ")}}`:b==="[object Set]"?e?"[Set]":`Set {${(0, is.printIteratorValues)(c.values(),h,s,i,n,H)}}`:e||Di(c)?`[${Ds(c)}]`:`${f||!h.printBasicPrototype&&Ds(c)==="Object"?"":`${Ds(c)} `}{${(0, is.printObjectProperties)(c,h,s,i,n,H)}}`}function Ri(c){return c.serialize!=null}function Fh(c,h,s,i,n,p){let e;try{e=Ri(c)?c.serialize(h,s,i,n,p,H):c.print(h,f=>H(f,s,i,n,p),f=>{let b=i+s.indent;return b+f.replace(Bi,`
${b}`)},{edgeSpacing:s.spacingOuter,min:s.min,spacing:s.spacingInner},s.colors);}catch(f){throw new vs(f.message,f.stack)}if(typeof e!="string")throw new Error(`pretty-format: Plugin must return type "string" but instead returned "${typeof e}".`);return e}function Rh(c,h){for(let s=0;s<c.length;s++)try{if(c[s].test(h))return c[s]}catch(i){throw new vs(i.message,i.stack)}return null}function H(c,h,s,i,n,p){let e=Rh(h.plugins,c);if(e!==null)return Fh(e,c,h,s,i,n);let f=zh(c,h.printFunctionName,h.escapeRegex,h.escapeString);return f!==null?f:qh(c,h,s,i,n,p)}var Ps={comment:"gray",content:"reset",prop:"yellow",tag:"cyan",value:"green"},Lh=Object.keys(Ps),Li=c=>c,B=Li({callToJSON:!0,compareKeys:void 0,escapeRegex:!1,escapeString:!0,highlight:!1,indent:2,maxDepth:1/0,maxWidth:1/0,min:!1,plugins:[],printBasicPrototype:!0,printFunctionName:!0,theme:Ps});R.DEFAULT_OPTIONS=B;function ji(c){if(Object.keys(c).forEach(h=>{if(!Object.prototype.hasOwnProperty.call(B,h))throw new Error(`pretty-format: Unknown option "${h}".`)}),c.min&&c.indent!==void 0&&c.indent!==0)throw new Error('pretty-format: Options "min" and "indent" cannot be used together.');if(c.theme!==void 0){if(c.theme===null)throw new Error('pretty-format: Option "theme" must not be null.');if(typeof c.theme!="object")throw new Error(`pretty-format: Option "theme" must be of type "object" but instead received "${typeof c.theme}".`)}}var Gi=c=>Lh.reduce((h,s)=>{let i=c.theme&&c.theme[s]!==void 0?c.theme[s]:Ps[s],n=i&&Ai.default[i];if(n&&typeof n.close=="string"&&typeof n.open=="string")h[s]=n;else throw new Error(`pretty-format: Option "theme" has a key "${s}" whose value "${i}" is undefined in ansi-styles.`);return h},Object.create(null)),Ui=()=>Lh.reduce((c,h)=>(c[h]={close:"",open:""},c),Object.create(null)),jh=c=>{var h;return (h=c==null?void 0:c.printFunctionName)!=null?h:B.printFunctionName},Gh=c=>{var h;return (h=c==null?void 0:c.escapeRegex)!=null?h:B.escapeRegex},Uh=c=>{var h;return (h=c==null?void 0:c.escapeString)!=null?h:B.escapeString},Ph=c=>{var h,s,i,n,p,e,f;return {callToJSON:(h=c==null?void 0:c.callToJSON)!=null?h:B.callToJSON,colors:c!=null&&c.highlight?Gi(c):Ui(),compareKeys:typeof(c==null?void 0:c.compareKeys)=="function"||(c==null?void 0:c.compareKeys)===null?c.compareKeys:B.compareKeys,escapeRegex:Gh(c),escapeString:Uh(c),indent:c!=null&&c.min?"":Zi((s=c==null?void 0:c.indent)!=null?s:B.indent),maxDepth:(i=c==null?void 0:c.maxDepth)!=null?i:B.maxDepth,maxWidth:(n=c==null?void 0:c.maxWidth)!=null?n:B.maxWidth,min:(p=c==null?void 0:c.min)!=null?p:B.min,plugins:(e=c==null?void 0:c.plugins)!=null?e:B.plugins,printBasicPrototype:(f=c==null?void 0:c.printBasicPrototype)!=null?f:!0,printFunctionName:jh(c),spacingInner:c!=null&&c.min?" ":`
`,spacingOuter:c!=null&&c.min?"":`
`}};function Zi(c){return new Array(c+1).join(" ")}function Zh(c,h){if(h&&(ji(h),h.plugins)){let i=Rh(h.plugins,c);if(i!==null)return Fh(i,c,Ph(h),"",0,[])}let s=zh(c,jh(h),Gh(h),Uh(h));return s!==null?s:qh(c,Ph(h),"",0,[])}var Vi={AsymmetricMatcher:Ni.default,DOMCollection:Oi.default,DOMElement:ai.default,Immutable:Ii.default,ReactElement:Ci.default,ReactTestComponent:_i.default};R.plugins=Vi;var Wi=Zh;R.default=Wi;});var Wh=js(Us()),Hh=js(Vh());function ns(c){let h=Hi(c);return new Wh.default(h).valueOf()*Math.PI}function Hi(c){return c.replace(/(\d+)π/g,"$1").replace(/π/g,"1")}var Bs=0,I=class extends Error{constructor(c,h){super(c),this.detailsObj=h,this.name="Error",this.message=c,this.stack=new Error().stack,this.stack!==void 0&&(this.stack=this.stack.replace(/^Error\n\s+at new DetailedError (\S+)\s?\n\s+at /,`
    `)),Bs++;try{this.details=Bs===1?(0,Hh.format)(this.detailsObj):"(failed to prettyFormat detailsObj due to possibly re-entrancy)";}catch(s){console.error(s),this.details="(failed to prettyFormat detailsObj, see the console for details)";}finally{Bs--;}}},Xi=[{character:"\xBD",ref:"\xBD",expanded:"1/2",value:.5},{character:"\xBC",ref:"\xBC",expanded:"1/4",value:.25},{character:"\xBE",ref:"\xBE",expanded:"3/4",value:.75},{character:"\u2153",ref:"\u2153",expanded:"1/3",value:.3333333333333333},{character:"\u2154",ref:"\u2154",expanded:"2/3",value:.6666666666666666},{character:"\u2155",ref:"\u2155",expanded:"1/5",value:.2},{character:"\u2156",ref:"\u2156",expanded:"2/5",value:.4},{character:"\u2157",ref:"\u2157",expanded:"3/5",value:.6},{character:"\u2158",ref:"\u2158",expanded:"4/5",value:.8},{character:"\u2159",ref:"\u2159",expanded:"1/6",value:.16666666666666666},{character:"\u215A",ref:"\u215A",expanded:"5/6",value:.8333333333333334},{character:"\u2150",ref:"\u2150",expanded:"1/7",value:.14285714285714285},{character:"\u215B",ref:"\u215B",expanded:"1/8",value:.125},{character:"\u215C",ref:"\u215C",expanded:"3/8",value:.375},{character:"\u215D",ref:"\u215D",expanded:"5/8",value:.625},{character:"\u215E",ref:"\u215E",expanded:"7/8",value:.875},{character:"\u2151",ref:"\u2151",expanded:"1/9",value:.1111111111111111},{character:"\u2152",ref:"\u2152",expanded:"1/10",value:.1}],k=class{static parseFloat(c){if(c.length===0)throw new Error(`Not a number: '${c}'`);if(c[0]==="-")return -k.parseFloat(c.substr(1));if(c[0]==="\u221A")return Math.sqrt(k.parseFloat(c.substr(1)));let h=k.matchUnicodeFraction(i=>i.character===c);if(h!==void 0)return h.value;let s=parseFloat(c);if(isNaN(s))throw new Error(`Not a number: '${c}'`);return s}static simplifyByRounding(c,h){if(c<0)return -k.simplifyByRounding(-c,h);let s=c%1;if(s<=h||1-s<=h)return Math.round(c);let i=k.matchUnicodeFraction(p=>Math.abs(p.value-c)<=h);if(i!==void 0)return i.value;let n=k.matchUnicodeFraction(p=>Math.abs(Math.sqrt(p.value)-c)<=h);return n!==void 0?Math.sqrt(n.value):c}static matchUnicodeFraction(c){for(let h of Xi)if(c(h))return h}constructor(c,h,s,i){this.allowAbbreviation=c,this.maxAbbreviationError=h,this.fixedDigits=s,this.itemSeparator=i;}formatFloat(c){return this.allowAbbreviation?this.abbreviateFloat(c,this.maxAbbreviationError,this.fixedDigits):this.fixedDigits!==void 0?c.toFixed(this.fixedDigits):String(c)}abbreviateFloat(c,h=0,s=void 0){if(Math.abs(c)<h)return "0";if(c<0)return `-${this.abbreviateFloat(-c,h,s)}`;let i=k.matchUnicodeFraction(p=>Math.abs(p.value-c)<=h);if(i!==void 0)return i.character;let n=k.matchUnicodeFraction(p=>Math.abs(Math.sqrt(p.value)-c)<=h);return n!==void 0?`\u221A${n.character}`:c%1!==0&&s!==void 0?c.toFixed(s):c.toString()}},K=k;K.CONSISTENT=new k(!1,0,2,", "),K.EXACT=new k(!0,0,void 0,", "),K.MINIFIED=new k(!0,0,void 0,","),K.SIMPLIFIED=new k(!0,5e-4,3,", ");var D=class{static need(c,h,s){if(c!==!0){let i=s===void 0?"(not provided)":`[${Array.prototype.slice.call(s).join(", ")}]`,n=`Precondition failed

Message: ${h===void 0?"(not provided)":h}

Args: ${i}`;throw new Error(n)}}static notNull(c){D.need(c!=null,"notNull");}static snappedCosSin(c){let h=Math.PI/4,s=Math.round(c/h);if(s*h===c){let i=Math.sqrt(.5);return [[1,0],[i,i],[0,1],[-i,i],[-1,0],[-i,-i],[0,-1],[i,-i]][s&7]}return [Math.cos(c),Math.sin(c)]}},E=class{static from(c){if(c instanceof E)return c;if(typeof c=="number")return new E(c,0);throw new I("Unrecognized value type.",{v:c})}static polar(c,h){let[s,i]=D.snappedCosSin(h);return new E(c*s,c*i)}static realPartOf(c){if(c instanceof E)return c.real;if(typeof c=="number")return c;throw new I("Unrecognized value type.",{v:c})}static imagPartOf(c){if(c instanceof E)return c.imag;if(typeof c=="number")return 0;throw new I("Unrecognized value type.",{v:c})}constructor(c,h){this.real=c,this.imag=h;}static rootsOfQuadratic(c,h,s){if(c=E.from(c),h=E.from(h),s=E.from(s),c.isEqualTo(0)){if(!h.isEqualTo(0))return [s.times(-1).dividedBy(h)];if(!s.isEqualTo(0))return [];throw Error("Degenerate")}let i=h.times(h).minus(c.times(s).times(4)).sqrts(),n=h.times(-1),p=c.times(2);return i.map(e=>n.minus(e).dividedBy(p))}isEqualTo(c){return c instanceof E?this.real===c.real&&this.imag===c.imag:typeof c=="number"?this.real===c&&this.imag===0:!1}isApproximatelyEqualTo(c,h){if(c instanceof E||typeof c=="number"){let s=this.minus(E.from(c));return Math.abs(s.real)<=h&&Math.abs(s.imag)<=h&&s.abs()<=h}return !1}norm2(){return this.real*this.real+this.imag*this.imag}abs(){return Math.sqrt(this.norm2())}unit(){let c=this.norm2();return c<1e-5?E.polar(1,this.phase()):this.dividedBy(Math.sqrt(c))}plus(c){let h=E.from(c);return new E(this.real+h.real,this.imag+h.imag)}minus(c){let h=E.from(c);return new E(this.real-h.real,this.imag-h.imag)}times(c){let h=E.from(c);return new E(this.real*h.real-this.imag*h.imag,this.real*h.imag+this.imag*h.real)}dividedBy(c){let h=E.from(c),s=h.norm2();if(s===0)throw new Error("Division by Zero");let i=this.times(h.conjugate());return new E(i.real/s,i.imag/s)}sqrts(){let[c,h]=[this.real,this.imag],s=Math.sqrt(Math.sqrt(c*c+h*h));if(s===0)return [E.ZERO];if(h===0&&c<0)return [new E(0,s),new E(0,-s)];let i=this.phase()/2,n=E.polar(s,i);return [n,n.times(-1)]}conjugate(){return new E(this.real,-this.imag)}toString(c){return c=c||K.EXACT,c.allowAbbreviation?this.toStringAllowSingleValue(c):this.toStringBothValues(c)}neg(){return new E(-this.real,-this.imag)}raisedTo(c){return c===.5&&this.imag===0&&this.real>=0?new E(Math.sqrt(this.real),0):E.ZERO.isEqualTo(c)?E.ONE:this.isEqualTo(E.ZERO)?E.ZERO:this.ln().times(E.from(c)).exp()}exp(){return E.polar(Math.exp(this.real),this.imag)}cos(){let c=this.times(E.I);return c.exp().plus(c.neg().exp()).times(.5)}sin(){let c=this.times(E.I);return c.exp().minus(c.neg().exp()).dividedBy(new E(0,2))}tan(){return this.sin().dividedBy(this.cos())}ln(){return new E(Math.log(this.abs()),this.phase())}phase(){return Math.atan2(this.imag,this.real)}toStringAllowSingleValue(c){return Math.abs(this.imag)<=c.maxAbbreviationError?c.formatFloat(this.real):Math.abs(this.real)<=c.maxAbbreviationError?Math.abs(this.imag-1)<=c.maxAbbreviationError?"i":Math.abs(this.imag+1)<=c.maxAbbreviationError?"-i":`${c.formatFloat(this.imag)}i`:this.toStringBothValues(c)}toStringBothValues(c){let h=this.imag>=0?"+":"-",s=c.allowAbbreviation&&Math.abs(Math.abs(this.imag)-1)<=c.maxAbbreviationError?"":c.formatFloat(Math.abs(this.imag));return `${(c.allowAbbreviation||c.fixedDigits===void 0||this.real<0?"":"+")+c.formatFloat(this.real)+h+s}i`}},T=E;T.ZERO=new E(0,0),T.ONE=new E(1,0),T.I=new E(0,1);var Xh="Bloch",Qh="\u2022",Yh="H",Kh="Measure",Jh="P",rh="QFT\u2020",gh="QFT",th="X^\xBD",sc="Rx",hc="Ry",cc="Rz",ic="S\u2020",nc="S",pc="\u2026",ec="Swap",uc="T\u2020",oc="T",lc="|0>",fc="|1>",mc="X",bc="Y",dc="Z";var N=class{static PHASE(h){let s=ns(h),i=T.from(Math.E);return N.square(1,0,0,i.raisedTo(T.I.times(s)))}static get RNOT(){let h=T.I,s=h.neg();return N.square(h.plus(1),s.plus(1),s.plus(1),h.plus(1)).times(.5)}static RX(h){let s=ns(h),i=T.I.neg(),n=Math.cos(s/2),p=Math.sin(s/2);return N.square(n,i.times(p),i.times(p),n)}static RY(h){let s=ns(h),i=Math.cos(s/2),n=Math.sin(s/2);return N.square(i,-n,n,i)}static RZ(h){let s=ns(h),i=T.from(Math.E),n=T.I;return N.square(i.raisedTo(n.neg().times(s/2)),0,0,i.raisedTo(n.times(s/2)))}static fromRows(h){let s=h.length,i=h.map(b=>b.length);if(!_Array.isNonEmpty(i))throw new I("Zero height",{rows:h});let n=ReadonlyNonEmptyArray.uniq(Eq$1)(i);if(n.length!==1)throw new I("Inconsistent row widths.",{rows:h});let p=n[0],e=new Float64Array(p*s*2),f=0;for(let b of h)for(let M of b)e[f]=T.realPartOf(M),e[f+1]=T.imagPartOf(M),f+=2;return new N(p,s,e)}static generate(h,s,i){let n=new Float64Array(h*s*2);for(let p=0;p<s;p++)for(let e=0;e<h;e++){let f=(p*h+e)*2,b=i(p,e);n[f]=T.realPartOf(b),n[f+1]=T.imagPartOf(b);}return new N(h,s,n)}static solo(h){return new N(1,1,new Float64Array([T.realPartOf(h),T.imagPartOf(h)]))}static square(...h){D.need(Array.isArray(h),"Array.isArray(coefs)",h);let s=Math.round(Math.sqrt(h.length));return D.need(s*s===h.length,"Matrix.square: non-square number of arguments"),N.generate(s,s,(i,n)=>h[i*s+n])}static col(...h){return D.need(Array.isArray(h),"Array.isArray(coefs)",h),N.generate(1,h.length,s=>h[s])}static row(...h){return D.need(Array.isArray(h),"Array.isArray(coefs)",h),N.generate(h.length,1,(s,i)=>h[i])}static identity(h){if(!Number.isInteger(h)||h<=0)throw new I("Bad size",{size:h});let s=new Float64Array(h*h*2);for(let i=0;i<h;i++)s[i*(h+1)*2]=1;return new N(h,h,s)}static zero(h,s){return new N(h,s,new Float64Array(h*s*2))}constructor(h,s,i){if(h*s*2!==i.length)throw new I("width*height*2 !== buffer.length",{width:h,height:s,len:i.length});this.width=h,this.height=s,this.buffer=i;}columnAt(h){D.need(h>=0&&h<=this.width,"colIndex >= 0 && colIndex <= this.width");let s=[];for(let i=0;i<this.height;i++)s.push(this.cell(h,i));return s}adjoint(){let h=this.height,s=this.width,i=new Float64Array(h*s*2);for(let n=0;n<s;n++)for(let p=0;p<h;p++){let e=(p*this.width+n)*2,f=(n*h+p)*2;i[f]=this.buffer[e],i[f+1]=-this.buffer[e+1];}return new N(h,s,i)}times(h){return h instanceof N?this.timesMatrix(h):this.timesScalar(h)}timesMatrix(h){if(this.width!==h.height)throw new I("Incompatible sizes.",{this:this,other:h});let s=h.width,i=this.height,n=this.width,p=new Float64Array(s*i*2);for(let e=0;e<i;e++)for(let f=0;f<s;f++){let b=(e*s+f)*2;for(let M=0;M<n;M++){let O=(e*n+M)*2,y=(M*s+f)*2,u=this.buffer[O],o=this.buffer[O+1],l=h.buffer[y],m=h.buffer[y+1],w=u*l-o*m,v=u*m+l*o;p[b]+=w,p[b+1]+=v;}}return new N(s,i,p)}timesScalar(h){let s=new Float64Array(this.buffer.length),i=T.realPartOf(h),n=T.imagPartOf(h);for(let p=0;p<s.length;p+=2){let e=this.buffer[p],f=this.buffer[p+1];s[p]=e*i-f*n,s[p+1]=e*n+f*i;}return new N(this.width,this.height,s)}isEqualTo(h){if(this===h)return !0;if(!(h instanceof N))return !1;let s=h;return this.width===s.width&&this.height===s.height&&range(0,this.buffer.length-1).every(i=>this.buffer[i]===s.buffer[i])}isApproximatelyEqualTo(h,s){return h instanceof N&&this.width===h.width&&this.height===h.height&&Math.sqrt(this.minus(h).norm2())<=s}minus(h){let{width:s,height:i,buffer:n}=this,p=h.buffer;D.need(h.width===s&&h.height===i,"Matrix.minus: compatible sizes");let e=new Float64Array(this.buffer.length);for(let f=0;f<e.length;f++)e[f]=n[f]-p[f];return new N(s,i,e)}norm2(){let h=0;for(let s of this.buffer)h+=s*s;return h}toString(h=K.EXACT){return `{{${this.rows().map(i=>i.map(n=>n.toString(h)).join(h.itemSeparator)).join(`}${h.itemSeparator}{`)}}}`}rows(){return range(0,this.height-1).map(h=>range(0,this.width-1).map(s=>this.cell(s,h)))}cell(h,s){if(h<0||s<0||h>=this.width||s>=this.height)throw new I("Cell out of range",{col:h,row:s,width:this.width,height:this.height});let i=(this.width*s+h)*2;return new T(this.buffer[i],this.buffer[i+1])}set(h,s,i){if(h<0||s<0||h>=this.width||s>=this.height)throw new I("Cell out of range",{col:h,row:s,width:this.width,height:this.height});let n=(this.width*s+h)*2;this.buffer[n]=i.real,this.buffer[n+1]=i.imag;}isApproximatelyHermitian(h){if(this.width!==this.height)return !1;for(let s=0;s<this.width;s++)for(let i=0;i<this.height;i++){let n=(this.width*i+s)*2,p=(this.width*s+i)*2;if(Math.abs(this.buffer[n]-this.buffer[p])>h||Math.abs(this.buffer[n+1]+this.buffer[p+1])>h)return !1}return !0}plus(h){let{width:s,height:i,buffer:n}=this,p=h.buffer;D.need(h.width===s&&h.height===i,"Matrix.plus: compatible sizes");let e=new Float64Array(this.buffer.length);for(let f=0;f<e.length;f++)e[f]=n[f]+p[f];return new N(s,i,e)}tensorProduct(h){let s=this.width,i=this.height,n=h.width,p=h.height,e=s*n,f=i*p,b=new Float64Array(e*f*2);for(let M=0;M<i;M++)for(let O=0;O<p;O++)for(let y=0;y<s;y++)for(let u=0;u<n;u++){let o=(M*s+y)*2,l=(O*n+u)*2,m=((M*p+O)*e+(y*n+u))*2,w=this.buffer[o],v=this.buffer[o+1],A=h.buffer[l],X=h.buffer[l+1],L=w*A-v*X,z=w*X+v*A;b[m]=L,b[m+1]=z;}return new N(e,f,b)}timesQubitOperation(h,s,i,n){D.need((i&1<<s)===0,"Matrix.timesQubitOperation: self-controlled"),D.need(h.width===2&&h.height===2,"Matrix.timesQubitOperation: not 2x2");let{width:p,height:e,buffer:f}=this,[b,M,O,y,u,o,l,m]=h.buffer;D.need(e>=2<<s,"Matrix.timesQubitOperation: qubit index out of range");let w=new Float64Array(f),v=0;for(let A=0;A<e;A++){let X=(i&A^n)!==0,L=(A&1<<s)!==0;for(let z=0;z<p;z++){if(!X&&!L){let S=v+(1<<s)*2*p,x=w[v],q=w[v+1],C=w[S],F=w[S+1];w[v]=x*b-q*M+C*O-F*y,w[v+1]=x*M+q*b+C*y+F*O,w[S]=x*u-q*o+C*l-F*m,w[S+1]=x*o+q*u+C*m+F*l;}v+=2;}}return new N(p,e,w)}trace(){let h=0,s=0,i=this.width*2+2;for(let n=0;n<this.buffer.length;n+=i)h+=this.buffer[n],s+=this.buffer[n+1];return new T(h,s)}qubitDensityMatrixToBlochVector(){if(this.width!==2||this.height!==2)throw new I("Need a 2x2 density matrix.",this);if(!this.isApproximatelyHermitian(.01))throw new I("Density matrix should be Hermitian.",this);if(!this.trace().isApproximatelyEqualTo(1,.01))throw new I("Density matrix should have unit trace.",this);let[h,s,i,n,p,e,f,b]=this.buffer,M=p+i,O=e-n,y=h-f;return [M,O,y]}clone(){return new N(this.width,this.height,this.buffer.slice())}},d=N;d.H=N.square(1,1,1,-1).times(Math.sqrt(.5)),d.PAULI_X=N.square(0,1,1,0),d.PAULI_Y=N.square(0,new T(0,-1),T.I,0),d.PAULI_Z=N.square(1,0,0,-1),d.S=N.square(1,0,0,T.from(Math.E).raisedTo(T.I.times(Math.PI/2))),d.SDagger=N.square(1,0,0,T.from(Math.E).raisedTo(T.I.times(Math.PI/-2))),d.T=N.square(1,0,0,T.from(Math.E).raisedTo(T.I.times(Math.PI/4))),d.TDagger=N.square(1,0,0,T.from(Math.E).raisedTo(T.I.times(Math.PI/-4)));var t=class{get bra(){return this.matrix.adjoint()}get ket(){return this.matrix}constructor(h){typeof h=="string"?this.matrix=this.bitstringToMatrix(h):this.matrix=h,this.size=this.matrix.height,this.nqubit=Math.log2(this.size);}amplifier(h){return this.matrix.cell(0,h)}setAmplifier(h,s){this.matrix.set(0,h,s);}blochVector(h){return this.qubitDensityMatrix(h).qubitDensityMatrixToBlochVector()}isApproximatelyEqualTo(h,s){return h instanceof t&&this.matrix.isApproximatelyEqualTo(h.matrix,s)}timesQubitOperation(h,s,i){this.matrix=this.matrix.timesQubitOperation(h,s,i,i);}toString(){return this.matrix.toString()}bitstringToMatrix(h){let s=!1,i="",n=[],p=new I("Invalid StateVector bit string",h);for(let e of h.split(""))switch(e){case"0":{if(s)throw p;n.push(d.col(1,0));break}case"1":{if(s)throw p;n.push(d.col(0,1));break}case"+":{if(s)throw p;n.push(d.col(1,1).times(Math.sqrt(.5)));break}case"-":{s?i+="-":n.push(d.col(1,-1).times(Math.sqrt(.5)));break}case"i":{s?i+="i":n.push(d.col(1,new T(0,1)).times(Math.sqrt(.5)));break}case"(":{if(s)throw p;s=!0,i="";break}case")":{if(!s||i!=="-i")throw p;n.push(d.col(1,new T(0,-1)).times(Math.sqrt(.5))),s=!1;break}default:throw p}if(n.length===0)throw p;return n.reduce((e,f)=>e.tensorProduct(f))}qubitDensityMatrix(h){if(h<0||h>=this.nqubit)throw new I("Qubit index out of range",h);let s=[...Array(Math.log2(this.matrix.height)).keys()].filter(p=>p!==h),i=(p,e)=>e.sort().reverse().reduce((f,b)=>{let M=f>>b+1;M=M<<b;let O=(1<<b)-1&f;return M|O},p),n=d.zero(2,2);for(let p=0;p<this.matrix.height;p++)for(let e=0;e<this.matrix.height;e++){if(!s.every(u=>(p>>u&1)===(e>>u&1)))continue;let b=this.matrix.cell(0,e).times(this.matrix.cell(0,p).conjugate());if(b.isEqualTo(0))continue;let M=i(e,s)===0?d.col(1,0):d.col(0,1),O=i(p,s)===0?d.row(1,0):d.row(0,1),y=M.times(O);n=n.plus(y.times(b));}return n}};function wc(c,h){return Math.round(c*Math.pow(10,h))/Math.pow(10,h)}var yc=class{constructor(h){typeof h=="string"?this.state=new t(h):this.state=h,this.measuredBits={},this.flags={};}runStep(h){this.blochVectors={};for(let s of h)switch(s.type){case lc:this.write(0,...s.targets);break;case fc:this.write(1,...s.targets);break;case Xh:for(let i of s.targets)this.blochVectors[i]=this.state.blochVector(i);break;case Yh:if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.ach(s.controls||[],s.antiControls||[],...s.targets):this.h(...s.targets);break;case mc:if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acnot(s.controls||[],s.antiControls||[],...s.targets):this.x(...s.targets);break;case bc:if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acy(s.controls||[],s.antiControls||[],...s.targets):this.y(...s.targets);break;case dc:if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acz(s.controls||[],s.antiControls||[],...s.targets):this.z(...s.targets);break;case pc:break;case Jh:{if(!s.angle)break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acphase(s.controls||[],s.antiControls||[],s.angle,s.targets[0]):this.cphase(s.targets.slice(1),s.angle,s.targets[0]);break}case nc:{if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acs(s.controls||[],s.antiControls||[],...s.targets):this.s(...s.targets);break}case ic:{if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acsDagger(s.controls||[],s.antiControls||[],...s.targets):this.sDagger(...s.targets);break}case oc:{if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.act(s.controls||[],s.antiControls||[],...s.targets):this.t(...s.targets);break}case uc:{if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.actDagger(s.controls||[],s.antiControls||[],...s.targets):this.tDagger(...s.targets);break}case gh:this.qft(s.span,...s.targets);break;case rh:this.qftDagger(s.span,...s.targets);break;case Qh:{this.cz(s.targets.slice(1),s.targets[0]);break}case ec:{s.controls&&s.controls.length===1?this.cswap(s.controls[0],s.targets[0],s.targets[1]):this.swap(s.targets[0],s.targets[1]);break}case th:if(s.if&&!this.flags[s.if])break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acrnot(s.controls||[],s.antiControls||[],...s.targets):this.rnot(...s.targets);break;case sc:if(s.if&&!this.flags[s.if]||!s.angle)break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acrx(s.controls||[],s.antiControls||[],s.angle,...s.targets):this.rx(s.angle,...s.targets);break;case hc:if(s.if&&!this.flags[s.if]||!s.angle)break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acry(s.controls||[],s.antiControls||[],s.angle,...s.targets):this.ry(s.angle,...s.targets);break;case cc:if(s.if&&!this.flags[s.if]||!s.angle)break;s.controls&&s.controls.length>0||s.antiControls&&s.antiControls.length>0?this.acrz(s.controls||[],s.antiControls||[],s.angle,...s.targets):this.rz(s.angle,...s.targets);break;case Kh:for(let i of s.targets)this.measure(i),s.flag&&(this.flags[s.flag]=this.measuredBits[i]===1);break;default:throw new Error("Unknown instruction")}return this}write(h,...s){for(let i of s){let n=wc(this.pZero(i),5);(h===0&&n===0||h===1&&n===1)&&this.x(i);}return this}h(...h){return this.u(d.H,...h),this}ch(h,...s){return this.cu(h,d.H,...s),this}ach(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.H,...i),this.x(...s),this}x(...h){return this.u(d.PAULI_X,...h),this}cnot(h,...s){return this.cu(h,d.PAULI_X,...s),this}acnot(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.PAULI_X,...i),this.x(...s),this}y(...h){return this.u(d.PAULI_Y,...h),this}cy(h,...s){return this.cu(h,d.PAULI_Y,...s),this}acy(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.PAULI_Y,...i),this.x(...s),this}z(...h){return this.u(d.PAULI_Z,...h),this}cz(h,...s){return this.cu(h,d.PAULI_Z,...s),this}acz(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.PAULI_Z,...i),this.x(...s),this}phase(h,...s){return this.u(d.PHASE(h),...s),this}cphase(h,s,...i){return this.cu(h,d.PHASE(s),...i),this}acphase(h,s,i,...n){let p;return typeof h=="number"?p=[h].concat(s):p=h.concat(s),this.x(...s),this.cu(p,d.PHASE(i),...n),this.x(...s),this}s(...h){return this.u(d.S,...h),this}acs(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.S,...i),this.x(...s),this}sDagger(...h){return this.u(d.SDagger,...h),this}acsDagger(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.SDagger,...i),this.x(...s),this}t(...h){return this.u(d.T,...h),this}ct(h,...s){return this.cu(h,d.T,...s),this}act(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.T,...i),this.x(...s),this}tDagger(...h){return this.u(d.TDagger,...h),this}actDagger(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.TDagger,...i),this.x(...s),this}swap(h,s){return this.cnot(h,s).cnot(s,h).cnot(h,s),this}cswap(h,s,i){return this.cnot([h,s],i).cnot([h,i],s).cnot([h,s],i),this}rnot(...h){return this.u(d.RNOT,...h),this}crnot(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.RNOT,...i),this.x(...s),this}acrnot(h,s,...i){let n;return typeof h=="number"?n=[h].concat(s):n=h.concat(s),this.x(...s),this.cu(n,d.RNOT,...i),this.x(...s),this}rx(h,...s){return this.u(d.RX(h),...s),this}acrx(h,s,i,...n){let p;return typeof h=="number"?p=[h].concat(s):p=h.concat(s),this.x(...s),this.cu(p,d.RX(i),...n),this.x(...s),this}crx(h,s,...i){return this.cu(h,d.RX(s),...i),this}ry(h,...s){return this.u(d.RY(h),...s),this}cry(h,s,...i){return this.cu(h,d.RY(s),...i),this}acry(h,s,i,...n){let p;return typeof h=="number"?p=[h].concat(s):p=h.concat(s),this.x(...s),this.cu(p,d.RY(i),...n),this.x(...s),this}rz(h,...s){return this.u(d.RZ(h),...s),this}crz(h,s,...i){return this.cu(h,d.RZ(s),...i),this}acrz(h,s,i,...n){let p;return typeof h=="number"?p=[h].concat(s):p=h.concat(s),this.x(...s),this.cu(p,d.RZ(i),...n),this.x(...s),this}qft(h,...s){for(let i of s)this.qftSingleTargetBit(h,i);return this}qftSingleTargetBit(h,s){switch(h){case 1:{this.h(s);break}case 2:{this.swap(s,s+1).h(s).cphase(s+1,"\u03C0/2",s).h(s+1);break}case 3:{this.swap(s,s+2).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).h(s+2);break}case 4:{this.swap(s,s+3).swap(s+1,s+2).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).h(s+3);break}case 5:{this.swap(s,s+4).swap(s+1,s+3).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).h(s+4);break}case 6:{this.swap(s,s+5).swap(s+1,s+4).swap(s+2,s+3).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).h(s+5);break}case 7:{this.swap(s,s+6).swap(s+1,s+5).swap(s+2,s+4).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).h(s+6);break}case 8:{this.swap(s,s+7).swap(s+1,s+6).swap(s+2,s+5).swap(s+3,s+4).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).h(s+7);break}case 9:{this.swap(s,s+8).swap(s+1,s+7).swap(s+2,s+6).swap(s+3,s+5).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).h(s+8);break}case 10:{this.swap(s,s+9).swap(s+1,s+8).swap(s+2,s+7).swap(s+3,s+6).swap(s+4,s+5).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).h(s+9);break}case 11:{this.swap(s,s+10).swap(s+1,s+9).swap(s+2,s+8).swap(s+3,s+7).swap(s+4,s+6).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).h(s+10);break}case 12:{this.swap(s,s+11).swap(s+1,s+10).swap(s+2,s+9).swap(s+3,s+8).swap(s+4,s+7).swap(s+5,s+6).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).cphase(s+11,"\u03C0/2048",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).cphase(s+11,"\u03C0/1024",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).cphase(s+11,"\u03C0/512",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).cphase(s+11,"\u03C0/256",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).cphase(s+11,"\u03C0/128",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).cphase(s+11,"\u03C0/64",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).cphase(s+11,"\u03C0/32",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).cphase(s+11,"\u03C0/16",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).cphase(s+11,"\u03C0/8",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).cphase(s+11,"\u03C0/4",s+8).h(s+10).cphase(s+11,"\u03C0/2",s+9).h(s+11);break}case 13:{this.swap(s,s+12).swap(s+1,s+11).swap(s+2,s+10).swap(s+3,s+9).swap(s+4,s+8).swap(s+5,s+7).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).cphase(s+11,"\u03C0/2048",s).cphase(s+12,"\u03C0/4096",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).cphase(s+11,"\u03C0/1024",s+1).cphase(s+12,"\u03C0/2048",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).cphase(s+11,"\u03C0/512",s+2).cphase(s+12,"\u03C0/1024",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).cphase(s+11,"\u03C0/256",s+3).cphase(s+12,"\u03C0/512",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).cphase(s+11,"\u03C0/128",s+4).cphase(s+12,"\u03C0/256",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).cphase(s+11,"\u03C0/64",s+5).cphase(s+12,"\u03C0/128",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).cphase(s+11,"\u03C0/32",s+6).cphase(s+12,"\u03C0/64",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).cphase(s+11,"\u03C0/16",s+7).cphase(s+12,"\u03C0/32",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).cphase(s+11,"\u03C0/8",s+8).cphase(s+12,"\u03C0/16",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).cphase(s+11,"\u03C0/4",s+8).cphase(s+12,"\u03C0/8",s+8).h(s+10).cphase(s+11,"\u03C0/2",s+9).cphase(s+12,"\u03C0/4",s+9).h(s+11).cphase(s+13,"\u03C0/2",s+10).h(s+12);break}case 14:{this.swap(s,s+13).swap(s+1,s+12).swap(s+2,s+11).swap(s+3,s+10).swap(s+4,s+9).swap(s+5,s+8).swap(s+6,s+7).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).cphase(s+11,"\u03C0/2048",s).cphase(s+12,"\u03C0/4096",s).cphase(s+13,"\u03C0/8192",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).cphase(s+11,"\u03C0/1024",s+1).cphase(s+12,"\u03C0/2048",s+1).cphase(s+13,"\u03C0/4096",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).cphase(s+11,"\u03C0/512",s+2).cphase(s+12,"\u03C0/1024",s+2).cphase(s+13,"\u03C0/2048",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).cphase(s+11,"\u03C0/256",s+3).cphase(s+12,"\u03C0/512",s+3).cphase(s+13,"\u03C0/1024",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).cphase(s+11,"\u03C0/128",s+4).cphase(s+12,"\u03C0/256",s+4).cphase(s+13,"\u03C0/512",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).cphase(s+11,"\u03C0/64",s+5).cphase(s+12,"\u03C0/128",s+5).cphase(s+13,"\u03C0/256",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).cphase(s+11,"\u03C0/32",s+6).cphase(s+12,"\u03C0/64",s+6).cphase(s+13,"\u03C0/128",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).cphase(s+11,"\u03C0/16",s+7).cphase(s+12,"\u03C0/32",s+7).cphase(s+13,"\u03C0/64",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).cphase(s+11,"\u03C0/8",s+8).cphase(s+12,"\u03C0/16",s+8).cphase(s+13,"\u03C0/32",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).cphase(s+11,"\u03C0/4",s+8).cphase(s+12,"\u03C0/8",s+8).cphase(s+13,"\u03C0/16",s+8).h(s+10).cphase(s+11,"\u03C0/2",s+9).cphase(s+12,"\u03C0/4",s+9).cphase(s+13,"\u03C0/8",s+9).h(s+11).cphase(s+13,"\u03C0/2",s+10).cphase(s+14,"\u03C0/4",s+10).h(s+12).cphase(s+14,"\u03C0/2",s+11).h(s+13);break}case 15:{this.swap(s,s+14).swap(s+1,s+13).swap(s+2,s+12).swap(s+3,s+11).swap(s+4,s+10).swap(s+5,s+9).swap(s+6,s+8).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).cphase(s+11,"\u03C0/2048",s).cphase(s+12,"\u03C0/4096",s).cphase(s+13,"\u03C0/8192",s).cphase(s+14,"\u03C0/16384",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).cphase(s+11,"\u03C0/1024",s+1).cphase(s+12,"\u03C0/2048",s+1).cphase(s+13,"\u03C0/4096",s+1).cphase(s+14,"\u03C0/8192",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).cphase(s+11,"\u03C0/512",s+2).cphase(s+12,"\u03C0/1024",s+2).cphase(s+13,"\u03C0/2048",s+2).cphase(s+14,"\u03C0/4096",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).cphase(s+11,"\u03C0/256",s+3).cphase(s+12,"\u03C0/512",s+3).cphase(s+13,"\u03C0/1024",s+3).cphase(s+14,"\u03C0/2048",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).cphase(s+11,"\u03C0/128",s+4).cphase(s+12,"\u03C0/256",s+4).cphase(s+13,"\u03C0/512",s+4).cphase(s+14,"\u03C0/1024",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).cphase(s+11,"\u03C0/64",s+5).cphase(s+12,"\u03C0/128",s+5).cphase(s+13,"\u03C0/256",s+5).cphase(s+14,"\u03C0/512",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).cphase(s+11,"\u03C0/32",s+6).cphase(s+12,"\u03C0/64",s+6).cphase(s+13,"\u03C0/128",s+6).cphase(s+14,"\u03C0/256",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).cphase(s+11,"\u03C0/16",s+7).cphase(s+12,"\u03C0/32",s+7).cphase(s+13,"\u03C0/64",s+7).cphase(s+14,"\u03C0/128",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).cphase(s+11,"\u03C0/8",s+8).cphase(s+12,"\u03C0/16",s+8).cphase(s+13,"\u03C0/32",s+8).cphase(s+14,"\u03C0/64",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).cphase(s+11,"\u03C0/4",s+8).cphase(s+12,"\u03C0/8",s+8).cphase(s+13,"\u03C0/16",s+8).cphase(s+14,"\u03C0/32",s+8).h(s+10).cphase(s+11,"\u03C0/2",s+9).cphase(s+12,"\u03C0/4",s+9).cphase(s+13,"\u03C0/8",s+9).cphase(s+14,"\u03C0/16",s+9).h(s+11).cphase(s+13,"\u03C0/2",s+10).cphase(s+14,"\u03C0/4",s+10).cphase(s+15,"\u03C0/8",s+10).h(s+12).cphase(s+14,"\u03C0/2",s+11).cphase(s+15,"\u03C0/4",s+11).h(s+13).cphase(s+15,"\u03C0/2",s+12).h(s+14);break}case 16:{this.swap(s,s+15).swap(s+1,s+14).swap(s+2,s+13).swap(s+3,s+12).swap(s+4,s+11).swap(s+5,s+10).swap(s+6,s+9).swap(s+7,s+8).h(s).cphase(s+1,"\u03C0/2",s).cphase(s+2,"\u03C0/4",s).cphase(s+3,"\u03C0/8",s).cphase(s+4,"\u03C0/16",s).cphase(s+5,"\u03C0/32",s).cphase(s+6,"\u03C0/64",s).cphase(s+7,"\u03C0/128",s).cphase(s+8,"\u03C0/256",s).cphase(s+9,"\u03C0/512",s).cphase(s+10,"\u03C0/1024",s).cphase(s+11,"\u03C0/2048",s).cphase(s+12,"\u03C0/4096",s).cphase(s+13,"\u03C0/8192",s).cphase(s+14,"\u03C0/16384",s).cphase(s+15,"\u03C0/32768",s).h(s+1).cphase(s+2,"\u03C0/2",s+1).cphase(s+3,"\u03C0/4",s+1).cphase(s+4,"\u03C0/8",s+1).cphase(s+5,"\u03C0/16",s+1).cphase(s+6,"\u03C0/32",s+1).cphase(s+7,"\u03C0/64",s+1).cphase(s+8,"\u03C0/128",s+1).cphase(s+9,"\u03C0/256",s+1).cphase(s+10,"\u03C0/512",s+1).cphase(s+11,"\u03C0/1024",s+1).cphase(s+12,"\u03C0/2048",s+1).cphase(s+13,"\u03C0/4096",s+1).cphase(s+14,"\u03C0/8192",s+1).cphase(s+15,"\u03C0/16384",s+1).h(s+2).cphase(s+3,"\u03C0/2",s+2).cphase(s+4,"\u03C0/4",s+2).cphase(s+5,"\u03C0/8",s+2).cphase(s+6,"\u03C0/16",s+2).cphase(s+7,"\u03C0/32",s+2).cphase(s+8,"\u03C0/64",s+2).cphase(s+9,"\u03C0/128",s+2).cphase(s+10,"\u03C0/256",s+2).cphase(s+11,"\u03C0/512",s+2).cphase(s+12,"\u03C0/1024",s+2).cphase(s+13,"\u03C0/2048",s+2).cphase(s+14,"\u03C0/4096",s+2).cphase(s+15,"\u03C0/8192",s+2).h(s+3).cphase(s+4,"\u03C0/2",s+3).cphase(s+5,"\u03C0/4",s+3).cphase(s+6,"\u03C0/8",s+3).cphase(s+7,"\u03C0/16",s+3).cphase(s+8,"\u03C0/32",s+3).cphase(s+9,"\u03C0/64",s+3).cphase(s+10,"\u03C0/128",s+3).cphase(s+11,"\u03C0/256",s+3).cphase(s+12,"\u03C0/512",s+3).cphase(s+13,"\u03C0/1024",s+3).cphase(s+14,"\u03C0/2048",s+3).cphase(s+15,"\u03C0/4096",s+3).h(s+4).cphase(s+5,"\u03C0/2",s+4).cphase(s+6,"\u03C0/4",s+4).cphase(s+7,"\u03C0/8",s+4).cphase(s+8,"\u03C0/16",s+4).cphase(s+9,"\u03C0/32",s+4).cphase(s+10,"\u03C0/64",s+4).cphase(s+11,"\u03C0/128",s+4).cphase(s+12,"\u03C0/256",s+4).cphase(s+13,"\u03C0/512",s+4).cphase(s+14,"\u03C0/1024",s+4).cphase(s+15,"\u03C0/2048",s+4).h(s+5).cphase(s+6,"\u03C0/2",s+5).cphase(s+7,"\u03C0/4",s+5).cphase(s+8,"\u03C0/8",s+5).cphase(s+9,"\u03C0/16",s+5).cphase(s+10,"\u03C0/32",s+5).cphase(s+11,"\u03C0/64",s+5).cphase(s+12,"\u03C0/128",s+5).cphase(s+13,"\u03C0/256",s+5).cphase(s+14,"\u03C0/512",s+5).cphase(s+15,"\u03C0/1024",s+5).h(s+6).cphase(s+7,"\u03C0/2",s+6).cphase(s+8,"\u03C0/4",s+6).cphase(s+9,"\u03C0/8",s+6).cphase(s+10,"\u03C0/16",s+6).cphase(s+11,"\u03C0/32",s+6).cphase(s+12,"\u03C0/64",s+6).cphase(s+13,"\u03C0/128",s+6).cphase(s+14,"\u03C0/256",s+6).cphase(s+15,"\u03C0/512",s+6).h(s+7).cphase(s+8,"\u03C0/2",s+7).cphase(s+9,"\u03C0/4",s+7).cphase(s+10,"\u03C0/8",s+7).cphase(s+11,"\u03C0/16",s+7).cphase(s+12,"\u03C0/32",s+7).cphase(s+13,"\u03C0/64",s+7).cphase(s+14,"\u03C0/128",s+7).cphase(s+15,"\u03C0/256",s+7).h(s+8).cphase(s+9,"\u03C0/2",s+8).cphase(s+10,"\u03C0/4",s+8).cphase(s+11,"\u03C0/8",s+8).cphase(s+12,"\u03C0/16",s+8).cphase(s+13,"\u03C0/32",s+8).cphase(s+14,"\u03C0/64",s+8).cphase(s+15,"\u03C0/128",s+8).h(s+9).cphase(s+10,"\u03C0/2",s+8).cphase(s+11,"\u03C0/4",s+8).cphase(s+12,"\u03C0/8",s+8).cphase(s+13,"\u03C0/16",s+8).cphase(s+14,"\u03C0/32",s+8).cphase(s+15,"\u03C0/64",s+8).h(s+10).cphase(s+11,"\u03C0/2",s+9).cphase(s+12,"\u03C0/4",s+9).cphase(s+13,"\u03C0/8",s+9).cphase(s+14,"\u03C0/16",s+9).cphase(s+15,"\u03C0/32",s+9).h(s+11).cphase(s+13,"\u03C0/2",s+10).cphase(s+14,"\u03C0/4",s+10).cphase(s+15,"\u03C0/8",s+10).cphase(s+16,"\u03C0/16",s+10).h(s+12).cphase(s+14,"\u03C0/2",s+11).cphase(s+15,"\u03C0/4",s+11).cphase(s+16,"\u03C0/8",s+11).h(s+13).cphase(s+15,"\u03C0/2",s+12).cphase(s+16,"\u03C0/4",s+12).h(s+14).cphase(s+16,"\u03C0/2",s+13).h(s+15);break}default:throw new Error(`Invalid span: ${h}`)}return this}qftDagger(h,...s){for(let i of s)this.qftDaggerSingleTargetBit(h,i);return this}qftDaggerSingleTargetBit(h,s){switch(h){case 1:{this.h(s);break}case 2:{this.h(s+1).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+1);break}case 3:{this.h(s+2).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+2);break}case 4:{this.h(s+3).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+3).swap(s+1,s+2);break}case 5:{this.h(s+4).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+4).swap(s+1,s+3);break}case 6:{this.h(s+5).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+5).swap(s+1,s+4).swap(s+2,s+3);break}case 7:{this.h(s+6).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+6).swap(s+1,s+5).swap(s+2,s+4);break}case 8:{this.h(s+7).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+7).swap(s+1,s+6).swap(s+2,s+5).swap(s+3,s+4);break}case 9:{this.h(s+8).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+8).swap(s+1,s+7).swap(s+2,s+6).swap(s+3,s+5);break}case 10:{this.h(s+9).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+9).swap(s+1,s+8).swap(s+2,s+7).swap(s+3,s+6).swap(s+4,s+5);break}case 11:{this.h(s+10).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+10).swap(s+1,s+9).swap(s+2,s+8).swap(s+3,s+7).swap(s+4,s+6);break}case 12:{this.h(s+11).cphase(s+11,"-\u03C0/2",s+10).h(s+10).cphase(s+11,"-\u03C0/4",s+9).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+11,"-\u03C0/8",s+8).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+11,"-\u03C0/16",s+7).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+11,"-\u03C0/32",s+6).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+11,"-\u03C0/64",s+5).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+11,"-\u03C0/128",s+4).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+11,"-\u03C0/256",s+3).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+11,"-\u03C0/512",s+2).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+11,"-\u03C0/1024",s+1).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+11,"-\u03C0/2048",s).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+11).swap(s+1,s+10).swap(s+2,s+9).swap(s+3,s+8).swap(s+4,s+7).swap(s+5,s+6);break}case 13:{this.h(s+12).cphase(s+12,"-\u03C0/2",s+11).h(s+11).cphase(s+12,"-\u03C0/4",s+10).cphase(s+11,"-\u03C0/2",s+10).h(s+10).cphase(s+12,"-\u03C0/8",s+9).cphase(s+11,"-\u03C0/4",s+9).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+12,"-\u03C0/16",s+8).cphase(s+11,"-\u03C0/8",s+8).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+12,"-\u03C0/32",s+7).cphase(s+11,"-\u03C0/16",s+7).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+12,"-\u03C0/64",s+6).cphase(s+11,"-\u03C0/32",s+6).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+12,"-\u03C0/128",s+5).cphase(s+11,"-\u03C0/64",s+5).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+12,"-\u03C0/256",s+4).cphase(s+11,"-\u03C0/128",s+4).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+12,"-\u03C0/512",s+3).cphase(s+11,"-\u03C0/256",s+3).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+12,"-\u03C0/1024",s+2).cphase(s+11,"-\u03C0/512",s+2).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+12,"-\u03C0/2048",s+1).cphase(s+11,"-\u03C0/1024",s+1).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+12,"-\u03C0/4096",s).cphase(s+11,"-\u03C0/2048",s).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+12).swap(s+1,s+11).swap(s+2,s+10).swap(s+3,s+9).swap(s+4,s+8).swap(s+5,s+7);break}case 14:{this.h(s+13).cphase(s+13,"-\u03C0/2",s+12).h(s+12).cphase(s+13,"-\u03C0/4",s+11).cphase(s+12,"-\u03C0/2",s+11).h(s+11).cphase(s+13,"-\u03C0/8",s+10).cphase(s+12,"-\u03C0/4",s+10).cphase(s+11,"-\u03C0/2",s).h(s+10).cphase(s+13,"-\u03C0/16",s+9).cphase(s+12,"-\u03C0/8",s+9).cphase(s+11,"-\u03C0/4",s+9).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+13,"-\u03C0/32",s+8).cphase(s+12,"-\u03C0/16",s+8).cphase(s+11,"-\u03C0/8",s+8).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+13,"-\u03C0/64",s+7).cphase(s+12,"-\u03C0/32",s+7).cphase(s+11,"-\u03C0/16",s+7).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+13,"-\u03C0/128",s+6).cphase(s+12,"-\u03C0/64",s+6).cphase(s+11,"-\u03C0/32",s+6).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+13,"-\u03C0/256",s+5).cphase(s+12,"-\u03C0/128",s+5).cphase(s+11,"-\u03C0/64",s+5).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+13,"-\u03C0/512",s+4).cphase(s+12,"-\u03C0/256",s+4).cphase(s+11,"-\u03C0/128",s+4).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+13,"-\u03C0/1024",s+3).cphase(s+12,"-\u03C0/512",s+3).cphase(s+11,"-\u03C0/256",s+3).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+13,"-\u03C0/2048",s+2).cphase(s+12,"-\u03C0/1024",s+2).cphase(s+11,"-\u03C0/512",s+2).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+13,"-\u03C0/4096",s+1).cphase(s+12,"-\u03C0/2048",s+1).cphase(s+11,"-\u03C0/1024",s+1).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+13,"-\u03C0/8192",s).cphase(s+12,"-\u03C0/4096",s).cphase(s+11,"-\u03C0/2048",s).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+13).swap(s+1,s+12).swap(s+2,s+11).swap(s+3,s+10).swap(s+4,s+9).swap(s+5,s+8).swap(s+6,s+7);break}case 15:{this.h(s+14).cphase(s+14,"-\u03C0/2",s+13).h(s+13).cphase(s+14,"-\u03C0/4",s+12).cphase(s+13,"-\u03C0/2",s+12).h(s+12).cphase(s+14,"-\u03C0/8",s+11).cphase(s+13,"-\u03C0/4",s+11).cphase(s+12,"-\u03C0/2",s+11).h(s+11).cphase(s+14,"-\u03C0/16",s+10).cphase(s+13,"-\u03C0/8",s+10).cphase(s+12,"-\u03C0/4",s+10).cphase(s+11,"-\u03C0/2",s+10).h(s+10).cphase(s+14,"-\u03C0/32",s+9).cphase(s+13,"-\u03C0/16",s+9).cphase(s+12,"-\u03C0/8",s+9).cphase(s+11,"-\u03C0/4",s+9).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+14,"-\u03C0/64",s+8).cphase(s+13,"-\u03C0/32",s+8).cphase(s+12,"-\u03C0/16",s+8).cphase(s+11,"-\u03C0/8",s+8).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+14,"-\u03C0/128",s+7).cphase(s+13,"-\u03C0/64",s+7).cphase(s+12,"-\u03C0/32",s+7).cphase(s+11,"-\u03C0/16",s+7).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+14,"-\u03C0/256",s+6).cphase(s+13,"-\u03C0/128",s+6).cphase(s+12,"-\u03C0/64",s+6).cphase(s+11,"-\u03C0/32",s+6).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+14,"-\u03C0/512",s+5).cphase(s+13,"-\u03C0/256",s+5).cphase(s+12,"-\u03C0/128",s+5).cphase(s+11,"-\u03C0/64",s+5).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+14,"-\u03C0/1024",s+4).cphase(s+13,"-\u03C0/512",s+4).cphase(s+12,"-\u03C0/256",s+4).cphase(s+11,"-\u03C0/128",s+4).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+14,"-\u03C0/2048",s+3).cphase(s+13,"-\u03C0/1024",s+3).cphase(s+12,"-\u03C0/512",s+3).cphase(s+11,"-\u03C0/256",s+3).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+14,"-\u03C0/4096",s+2).cphase(s+13,"-\u03C0/2048",s+2).cphase(s+12,"-\u03C0/1024",s+2).cphase(s+11,"-\u03C0/512",s+2).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+14,"-\u03C0/8192",s+1).cphase(s+13,"-\u03C0/4096",s+1).cphase(s+12,"-\u03C0/2048",s+1).cphase(s+11,"-\u03C0/1024",s+1).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+14,"-\u03C0/16384",s).cphase(s+13,"-\u03C0/8192",s).cphase(s+12,"-\u03C0/4096",s).cphase(s+11,"-\u03C0/2048",s).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s,s+14).swap(s+1,s+13).swap(s+2,s+12).swap(s+3,s+11).swap(s+4,s+10).swap(s+5,s+9).swap(s+6,s+8);break}case 16:{this.h(s+15).cphase(s+15,"-\u03C0/2",s+14).h(s+14).cphase(s+15,"-\u03C0/4",s+13).cphase(s+14,"-\u03C0/4",s+13).h(s+13).cphase(s+15,"-\u03C0/8",s+12).cphase(s+14,"-\u03C0/4",s+12).cphase(s+13,"-\u03C0/2",s+12).h(s+12).cphase(s+15,"-\u03C0/16",s+11).cphase(s+14,"-\u03C0/8",s+11).cphase(s+13,"-\u03C0/4",s+11).cphase(s+12,"-\u03C0/2",s+11).h(s+11).cphase(s+15,"-\u03C0/32",s+10).cphase(s+14,"-\u03C0/16",s+10).cphase(s+13,"-\u03C0/8",s+10).cphase(s+12,"-\u03C0/4",s+10).cphase(s+11,"-\u03C0/2",s+10).h(s+10).cphase(s+15,"-\u03C0/64",s+9).cphase(s+14,"-\u03C0/32",s+9).cphase(s+13,"-\u03C0/16",s+9).cphase(s+12,"-\u03C0/8",s+9).cphase(s+11,"-\u03C0/4",s+9).cphase(s+10,"-\u03C0/2",s+9).h(s+9).cphase(s+15,"-\u03C0/128",s+8).cphase(s+14,"-\u03C0/64",s+8).cphase(s+13,"-\u03C0/32",s+8).cphase(s+12,"-\u03C0/16",s+8).cphase(s+11,"-\u03C0/8",s+8).cphase(s+10,"-\u03C0/4",s+8).cphase(s+9,"-\u03C0/2",s+8).h(s+8).cphase(s+15,"-\u03C0/256",s+7).cphase(s+14,"-\u03C0/128",s+7).cphase(s+13,"-\u03C0/64",s+7).cphase(s+12,"-\u03C0/32",s+7).cphase(s+11,"-\u03C0/16",s+7).cphase(s+10,"-\u03C0/8",s+7).cphase(s+9,"-\u03C0/4",s+7).cphase(s+8,"-\u03C0/2",s+7).h(s+7).cphase(s+15,"-\u03C0/512",s+6).cphase(s+14,"-\u03C0/256",s+6).cphase(s+13,"-\u03C0/128",s+6).cphase(s+12,"-\u03C0/64",s+6).cphase(s+11,"-\u03C0/32",s+6).cphase(s+10,"-\u03C0/16",s+6).cphase(s+9,"-\u03C0/8",s+6).cphase(s+8,"-\u03C0/4",s+6).cphase(s+7,"-\u03C0/2",s+6).h(s+6).cphase(s+15,"-\u03C0/1024",s+5).cphase(s+14,"-\u03C0/512",s+5).cphase(s+13,"-\u03C0/256",s+5).cphase(s+12,"-\u03C0/128",s+5).cphase(s+11,"-\u03C0/64",s+5).cphase(s+10,"-\u03C0/32",s+5).cphase(s+9,"-\u03C0/16",s+5).cphase(s+8,"-\u03C0/8",s+5).cphase(s+7,"-\u03C0/4",s+5).cphase(s+6,"-\u03C0/2",s+5).h(s+5).cphase(s+15,"-\u03C0/2048",s+4).cphase(s+14,"-\u03C0/1024",s+4).cphase(s+13,"-\u03C0/512",s+4).cphase(s+12,"-\u03C0/256",s+4).cphase(s+11,"-\u03C0/128",s+4).cphase(s+10,"-\u03C0/64",s+4).cphase(s+9,"-\u03C0/32",s+4).cphase(s+8,"-\u03C0/16",s+4).cphase(s+7,"-\u03C0/8",s+4).cphase(s+6,"-\u03C0/4",s+4).cphase(s+5,"-\u03C0/2",s+4).h(s+4).cphase(s+15,"-\u03C0/4096",s+3).cphase(s+14,"-\u03C0/2048",s+3).cphase(s+13,"-\u03C0/1024",s+3).cphase(s+12,"-\u03C0/512",s+3).cphase(s+11,"-\u03C0/256",s+3).cphase(s+10,"-\u03C0/128",s+3).cphase(s+9,"-\u03C0/64",s+3).cphase(s+8,"-\u03C0/32",s+3).cphase(s+7,"-\u03C0/16",s+3).cphase(s+6,"-\u03C0/8",s+3).cphase(s+5,"-\u03C0/4",s+3).cphase(s+4,"-\u03C0/2",s+3).h(s+3).cphase(s+15,"-\u03C0/8192",s+2).cphase(s+14,"-\u03C0/4096",s+2).cphase(s+13,"-\u03C0/2048",s+2).cphase(s+12,"-\u03C0/1024",s+2).cphase(s+11,"-\u03C0/512",s+2).cphase(s+10,"-\u03C0/256",s+2).cphase(s+9,"-\u03C0/128",s+2).cphase(s+8,"-\u03C0/64",s+2).cphase(s+7,"-\u03C0/32",s+2).cphase(s+6,"-\u03C0/16",s+2).cphase(s+5,"-\u03C0/8",s+2).cphase(s+4,"-\u03C0/4",s+2).cphase(s+3,"-\u03C0/2",s+2).h(s+2).cphase(s+15,"-\u03C0/16384",s+1).cphase(s+14,"-\u03C0/8192",s+1).cphase(s+13,"-\u03C0/4096",s+1).cphase(s+12,"-\u03C0/2048",s+1).cphase(s+11,"-\u03C0/1024",s+1).cphase(s+10,"-\u03C0/512",s+1).cphase(s+9,"-\u03C0/256",s+1).cphase(s+8,"-\u03C0/128",s+1).cphase(s+7,"-\u03C0/64",s+1).cphase(s+6,"-\u03C0/32",s+1).cphase(s+5,"-\u03C0/16",s+1).cphase(s+4,"-\u03C0/8",s+1).cphase(s+3,"-\u03C0/4",s+1).cphase(s+2,"-\u03C0/2",s+1).h(s+1).cphase(s+15,"-\u03C0/32768",s).cphase(s+14,"-\u03C0/16384",s).cphase(s+13,"-\u03C0/8192",s).cphase(s+12,"-\u03C0/4096",s).cphase(s+11,"-\u03C0/2048",s).cphase(s+10,"-\u03C0/1024",s).cphase(s+9,"-\u03C0/512",s).cphase(s+8,"-\u03C0/256",s).cphase(s+7,"-\u03C0/128",s).cphase(s+6,"-\u03C0/64",s).cphase(s+5,"-\u03C0/32",s).cphase(s+4,"-\u03C0/16",s).cphase(s+3,"-\u03C0/8",s).cphase(s+2,"-\u03C0/4",s).cphase(s+1,"-\u03C0/2",s).h(s).swap(s+1,s+15).swap(s+2,s+14).swap(s+3,s+13).swap(s+4,s+12).swap(s+5,s+11).swap(s+6,s+10).swap(s+7,s+9).swap(s+8,s+8).swap(s+9,s+7).swap(s+10,s+6);break}default:throw new Error(`Invalid span: ${h}`)}return this}measure(...h){for(let s of h){let i=this.pZero(s);if(Math.random()<=i){for(let p=0;p<1<<this.state.nqubit;p++)p&1<<s&&this.state.setAmplifier(p,T.ZERO),this.state.setAmplifier(p,this.state.amplifier(p).dividedBy(Math.sqrt(i)));this.measuredBits[s]=0;}else {for(let p=0;p<1<<this.state.nqubit;p++)p&1<<s||this.state.setAmplifier(p,T.ZERO),this.state.setAmplifier(p,this.state.amplifier(p).dividedBy(Math.sqrt(1-i)));this.measuredBits[s]=1;}}return this}amplitudes(){return this.state.matrix.columnAt(0)}u(h,...s){for(let i of s)this.state.timesQubitOperation(h,i,0);}cu(h,s,...i){let p=(typeof h=="number"?[h]:h).reduce((e,f)=>e|1<<f,0);for(let e of i)this.state.timesQubitOperation(s,e,p);}pZero(h){let s=0;for(let i=0;i<1<<this.state.nqubit;i++)i&1<<h||(s+=Math.pow(this.state.amplifier(i).abs(),2));return s}};/*! Bundled license information:

    fraction.js/fraction.js:
      (**
       * @license Fraction.js v4.2.0 05/03/2022
       * https://www.xarg.org/2014/03/rational-numbers-in-javascript/
       *
       * Copyright (c) 2021, Robert Eisele (robert@xarg.org)
       * Dual licensed under the MIT or GPL Version 2 licenses.
       **)

    react-is/cjs/react-is.production.min.js:
      (**
       * @license React
       * react-is.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       *)
    */

    // Install SW
    self.addEventListener("install", function () {
        console.log("ServiceWorker installed");
    });
    // TODO: Qni の runSimulator にあたるハンドラを実行
    self.addEventListener("message", function (event) {
        var circuitJson = event.data.circuitJson;
        var qubitCount = event.data.qubitCount;
        var stepIndex = event.data.stepIndex;
        var simulator = new yc("0".repeat(qubitCount));
        var vector = simulator.state.matrix.clone();
        var amplitudes = [];
        for (var i = 0; i < vector.height; i++) {
            var c = vector.cell(0, i);
            amplitudes.push([c.real, c.imag]);
        }
        // バックエンドを呼ぶ
        function call_backend() {
            return __awaiter(this, void 0, void 0, function () {
                var params, response, jsondata, i, stepResult, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            params = new URLSearchParams({
                                id: circuitJson,
                                qubitCount: qubitCount,
                                stepIndex: stepIndex,
                            });
                            return [4 /*yield*/, fetch("http://localhost:3000/backend.json?".concat(params), {
                                    method: "GET",
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("Failed to connect to Qni's backend endpoint.");
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            jsondata = _a.sent();
                            console.dir(jsondata);
                            for (i = 0; i < jsondata.length; i++) {
                                stepResult = jsondata[i];
                                self.postMessage({
                                    type: "step",
                                    step: i,
                                    amplitudes: stepResult["amplitudes"],
                                    blochVectors: stepResult["blochVectors"],
                                    measuredBits: stepResult["measuredBits"],
                                    flags: {},
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            // eslint-disable-next-line no-console
                            console.error(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        call_backend();
        self.postMessage({
            type: "finished",
            qubitCount: qubitCount,
            amplitudes: amplitudes,
        });
    });

})();
//# sourceMappingURL=serviceWorker.js.map
