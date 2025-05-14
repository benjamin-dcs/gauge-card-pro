var _excluded = ["message", "explanation"];
var _Symbol$metadata, _a$1$litPropertyMetad, _a$1$reactiveElementV, _t$2$litHtmlVersions, _s$litElementHydrateS, _s$litElementVersions, _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0, _templateObject1, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
var _marked = /*#__PURE__*/_regeneratorRuntime().mark(toFailures);
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof2(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i.return && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof2(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, catch: function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof2(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n5 = 0, F = function F() {}; return { s: F, n: function n() { return _n5 >= r.length ? { done: !0 } : { done: !1, value: r[_n5++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof2(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof2(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof2(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof2(o) { "@babel/helpers - typeof"; return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof2(o); }
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof2(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$3 = globalThis,
  e$3 = t$3.ShadowRoot && (void 0 === t$3.ShadyCSS || t$3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
  s$2 = Symbol(),
  o$5 = new WeakMap();
var n$4 = /*#__PURE__*/function () {
  function n(t, e, o) {
    _classCallCheck(this, n);
    if (this._$cssResult$ = true, o !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  return _createClass(n, [{
    key: "styleSheet",
    get: function get() {
      var t = this.o;
      var s = this.t;
      if (e$3 && void 0 === t) {
        var _e2 = void 0 !== s && 1 === s.length;
        _e2 && (t = o$5.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), _e2 && o$5.set(s, t));
      }
      return t;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.cssText;
    }
  }]);
}();
var r$4 = function r$4(t) {
    return new n$4("string" == typeof t ? t : t + "", void 0, s$2);
  },
  i$5 = function i$5(t) {
    for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      e[_key - 1] = arguments[_key];
    }
    var o = 1 === t.length ? t[0] : e.reduce(function (e, s, o) {
      return e + function (t) {
        if (true === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      }(s) + t[o + 1];
    }, t[0]);
    return new n$4(o, t, s$2);
  },
  S$1 = function S$1(s, o) {
    if (e$3) s.adoptedStyleSheets = o.map(function (t) {
      return t instanceof CSSStyleSheet ? t : t.styleSheet;
    });else {
      var _iterator = _createForOfIteratorHelper(o),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _e3 = _step.value;
          var _o2 = document.createElement("style"),
            _n = t$3.litNonce;
          void 0 !== _n && _o2.setAttribute("nonce", _n), _o2.textContent = _e3.cssText, s.appendChild(_o2);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  },
  c$2 = e$3 ? function (t) {
    return t;
  } : function (t) {
    return t instanceof CSSStyleSheet ? function (t) {
      var e = "";
      var _iterator2 = _createForOfIteratorHelper(t.cssRules),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _s = _step2.value;
          e += _s.cssText;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return r$4(e);
    }(t) : t;
  };

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var i$4 = Object.is,
  e$2 = Object.defineProperty,
  h$1 = Object.getOwnPropertyDescriptor,
  r$3 = Object.getOwnPropertyNames,
  o$4 = Object.getOwnPropertySymbols,
  n$3 = Object.getPrototypeOf,
  a$1 = globalThis,
  c$1 = a$1.trustedTypes,
  l$1 = c$1 ? c$1.emptyScript : "",
  p$1 = a$1.reactiveElementPolyfillSupport,
  d$1 = function d$1(t, s) {
    return t;
  },
  u$1 = {
    toAttribute: function toAttribute(t, s) {
      switch (s) {
        case Boolean:
          t = t ? l$1 : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute: function fromAttribute(t, s) {
      var i = t;
      switch (s) {
        case Boolean:
          i = null !== t;
          break;
        case Number:
          i = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            i = JSON.parse(t);
          } catch (t) {
            i = null;
          }
      }
      return i;
    }
  },
  f$1 = function f$1(t, s) {
    return !i$4(t, s);
  },
  b$1 = {
    attribute: true,
    type: String,
    converter: u$1,
    reflect: false,
    useDefault: false,
    hasChanged: f$1
  };
(_Symbol$metadata = Symbol.metadata) !== null && _Symbol$metadata !== void 0 ? _Symbol$metadata : Symbol.metadata = Symbol("metadata"), (_a$1$litPropertyMetad = a$1.litPropertyMetadata) !== null && _a$1$litPropertyMetad !== void 0 ? _a$1$litPropertyMetad : a$1.litPropertyMetadata = new WeakMap();
var y$1 = /*#__PURE__*/function (_HTMLElement) {
  function y() {
    var _this;
    _classCallCheck(this, y);
    _this = _callSuper(this, y), _this._$Ep = void 0, _this.isUpdatePending = false, _this.hasUpdated = false, _this._$Em = null, _this._$Ev();
    return _this;
  }
  _inherits(y, _HTMLElement);
  return _createClass(y, [{
    key: "_$Ev",
    value: function _$Ev() {
      var _this2 = this,
        _this$constructor$l;
      this._$ES = new Promise(function (t) {
        return _this2.enableUpdating = t;
      }), this._$AL = new Map(), this._$E_(), this.requestUpdate(), (_this$constructor$l = this.constructor.l) === null || _this$constructor$l === void 0 ? void 0 : _this$constructor$l.forEach(function (t) {
        return t(_this2);
      });
    }
  }, {
    key: "addController",
    value: function addController(t) {
      var _this$_$EO, _t$hostConnected;
      ((_this$_$EO = this._$EO) !== null && _this$_$EO !== void 0 ? _this$_$EO : this._$EO = new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && ((_t$hostConnected = t.hostConnected) === null || _t$hostConnected === void 0 ? void 0 : _t$hostConnected.call(t));
    }
  }, {
    key: "removeController",
    value: function removeController(t) {
      var _this$_$EO2;
      (_this$_$EO2 = this._$EO) === null || _this$_$EO2 === void 0 || _this$_$EO2.delete(t);
    }
  }, {
    key: "_$E_",
    value: function _$E_() {
      var t = new Map(),
        s = this.constructor.elementProperties;
      var _iterator3 = _createForOfIteratorHelper(s.keys()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _i2 = _step3.value;
          this.hasOwnProperty(_i2) && (t.set(_i2, this[_i2]), delete this[_i2]);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      t.size > 0 && (this._$Ep = t);
    }
  }, {
    key: "createRenderRoot",
    value: function createRenderRoot() {
      var _this$shadowRoot;
      var t = (_this$shadowRoot = this.shadowRoot) !== null && _this$shadowRoot !== void 0 ? _this$shadowRoot : this.attachShadow(this.constructor.shadowRootOptions);
      return S$1(t, this.constructor.elementStyles), t;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$renderRoot, _this$_$EO3;
      (_this$renderRoot = this.renderRoot) !== null && _this$renderRoot !== void 0 ? _this$renderRoot : this.renderRoot = this.createRenderRoot(), this.enableUpdating(true), (_this$_$EO3 = this._$EO) === null || _this$_$EO3 === void 0 ? void 0 : _this$_$EO3.forEach(function (t) {
        var _t$hostConnected2;
        return (_t$hostConnected2 = t.hostConnected) === null || _t$hostConnected2 === void 0 ? void 0 : _t$hostConnected2.call(t);
      });
    }
  }, {
    key: "enableUpdating",
    value: function enableUpdating(t) {}
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this$_$EO4;
      (_this$_$EO4 = this._$EO) === null || _this$_$EO4 === void 0 || _this$_$EO4.forEach(function (t) {
        var _t$hostDisconnected;
        return (_t$hostDisconnected = t.hostDisconnected) === null || _t$hostDisconnected === void 0 ? void 0 : _t$hostDisconnected.call(t);
      });
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(t, s, i) {
      this._$AK(t, i);
    }
  }, {
    key: "_$ET",
    value: function _$ET(t, s) {
      var i = this.constructor.elementProperties.get(t),
        e = this.constructor._$Eu(t, i);
      if (void 0 !== e && true === i.reflect) {
        var _i$converter;
        var _h2 = (void 0 !== ((_i$converter = i.converter) === null || _i$converter === void 0 ? void 0 : _i$converter.toAttribute) ? i.converter : u$1).toAttribute(s, i.type);
        this._$Em = t, null == _h2 ? this.removeAttribute(e) : this.setAttribute(e, _h2), this._$Em = null;
      }
    }
  }, {
    key: "_$AK",
    value: function _$AK(t, s) {
      var i = this.constructor,
        e = i._$Eh.get(t);
      if (void 0 !== e && this._$Em !== e) {
        var _t$converter, _ref4, _h3$fromAttribute, _this$_$Ej;
        var _t = i.getPropertyOptions(e),
          _h3 = "function" == typeof _t.converter ? {
            fromAttribute: _t.converter
          } : void 0 !== ((_t$converter = _t.converter) === null || _t$converter === void 0 ? void 0 : _t$converter.fromAttribute) ? _t.converter : u$1;
        this._$Em = e, this[e] = (_ref4 = (_h3$fromAttribute = _h3.fromAttribute(s, _t.type)) !== null && _h3$fromAttribute !== void 0 ? _h3$fromAttribute : (_this$_$Ej = this._$Ej) === null || _this$_$Ej === void 0 ? void 0 : _this$_$Ej.get(e)) !== null && _ref4 !== void 0 ? _ref4 : null, this._$Em = null;
      }
    }
  }, {
    key: "requestUpdate",
    value: function requestUpdate(t, s, i) {
      if (void 0 !== t) {
        var _i$hasChanged, _this$_$Ej2;
        var _e4 = this.constructor,
          _h4 = this[t];
        if (i !== null && i !== void 0 ? i : i = _e4.getPropertyOptions(t), !(((_i$hasChanged = i.hasChanged) !== null && _i$hasChanged !== void 0 ? _i$hasChanged : f$1)(_h4, s) || i.useDefault && i.reflect && _h4 === ((_this$_$Ej2 = this._$Ej) === null || _this$_$Ej2 === void 0 ? void 0 : _this$_$Ej2.get(t)) && !this.hasAttribute(_e4._$Eu(t, i)))) return;
        this.C(t, s, i);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
  }, {
    key: "C",
    value: function C(t, s, _ref5, r) {
      var _this$_$Ej3, _ref6, _this$_$Eq;
      var i = _ref5.useDefault,
        e = _ref5.reflect,
        h = _ref5.wrapped;
      i && !((_this$_$Ej3 = this._$Ej) !== null && _this$_$Ej3 !== void 0 ? _this$_$Ej3 : this._$Ej = new Map()).has(t) && (this._$Ej.set(t, (_ref6 = r !== null && r !== void 0 ? r : s) !== null && _ref6 !== void 0 ? _ref6 : this[t]), true !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), true === e && this._$Em !== t && ((_this$_$Eq = this._$Eq) !== null && _this$_$Eq !== void 0 ? _this$_$Eq : this._$Eq = new Set()).add(t));
    }
  }, {
    key: "_$EP",
    value: function () {
      var _$EP2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var t;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.isUpdatePending = true;
              _context.prev = 1;
              _context.next = 4;
              return this._$ES;
            case 4:
              _context.next = 9;
              break;
            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              Promise.reject(_context.t0);
            case 9:
              t = this.scheduleUpdate();
              _context.t1 = null != t;
              if (!_context.t1) {
                _context.next = 14;
                break;
              }
              _context.next = 14;
              return t;
            case 14:
              return _context.abrupt("return", !this.isUpdatePending);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[1, 6]]);
      }));
      function _$EP() {
        return _$EP2.apply(this, arguments);
      }
      return _$EP;
    }()
  }, {
    key: "scheduleUpdate",
    value: function scheduleUpdate() {
      return this.performUpdate();
    }
  }, {
    key: "performUpdate",
    value: function performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        var _this$renderRoot2;
        if ((_this$renderRoot2 = this.renderRoot) !== null && _this$renderRoot2 !== void 0 ? _this$renderRoot2 : this.renderRoot = this.createRenderRoot(), this._$Ep) {
          var _iterator4 = _createForOfIteratorHelper(this._$Ep),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _step4$value = _slicedToArray(_step4.value, 2),
                _t2 = _step4$value[0],
                _s2 = _step4$value[1];
              this[_t2] = _s2;
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          this._$Ep = void 0;
        }
        var _t3 = this.constructor.elementProperties;
        if (_t3.size > 0) {
          var _iterator5 = _createForOfIteratorHelper(_t3),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _step5$value = _slicedToArray(_step5.value, 2),
                _s3 = _step5$value[0],
                _i3 = _step5$value[1];
              var _t4 = _i3.wrapped,
                _e5 = this[_s3];
              true !== _t4 || this._$AL.has(_s3) || void 0 === _e5 || this.C(_s3, void 0, _i3, _e5);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      }
      var t = false;
      var s = this._$AL;
      try {
        var _this$_$EO5;
        t = this.shouldUpdate(s), t ? (this.willUpdate(s), (_this$_$EO5 = this._$EO) !== null && _this$_$EO5 !== void 0 && _this$_$EO5.forEach(function (t) {
          var _t$hostUpdate;
          return (_t$hostUpdate = t.hostUpdate) === null || _t$hostUpdate === void 0 ? void 0 : _t$hostUpdate.call(t);
        }), this.update(s)) : this._$EM();
      } catch (s) {
        throw t = false, this._$EM(), s;
      }
      t && this._$AE(s);
    }
  }, {
    key: "willUpdate",
    value: function willUpdate(t) {}
  }, {
    key: "_$AE",
    value: function _$AE(t) {
      var _this$_$EO6;
      (_this$_$EO6 = this._$EO) !== null && _this$_$EO6 !== void 0 && _this$_$EO6.forEach(function (t) {
        var _t$hostUpdated;
        return (_t$hostUpdated = t.hostUpdated) === null || _t$hostUpdated === void 0 ? void 0 : _t$hostUpdated.call(t);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t)), this.updated(t);
    }
  }, {
    key: "_$EM",
    value: function _$EM() {
      this._$AL = new Map(), this.isUpdatePending = false;
    }
  }, {
    key: "updateComplete",
    get: function get() {
      return this.getUpdateComplete();
    }
  }, {
    key: "getUpdateComplete",
    value: function getUpdateComplete() {
      return this._$ES;
    }
  }, {
    key: "shouldUpdate",
    value: function shouldUpdate(t) {
      return true;
    }
  }, {
    key: "update",
    value: function update(t) {
      var _this3 = this;
      this._$Eq && (this._$Eq = this._$Eq.forEach(function (t) {
        return _this3._$ET(t, _this3[t]);
      })), this._$EM();
    }
  }, {
    key: "updated",
    value: function updated(t) {}
  }, {
    key: "firstUpdated",
    value: function firstUpdated(t) {}
  }], [{
    key: "addInitializer",
    value: function addInitializer(t) {
      var _this$l;
      this._$Ei(), ((_this$l = this.l) !== null && _this$l !== void 0 ? _this$l : this.l = []).push(t);
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return this.finalize(), this._$Eh && _toConsumableArray(this._$Eh.keys());
    }
  }, {
    key: "createProperty",
    value: function createProperty(t) {
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : b$1;
      if (s.state && (s.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = true), this.elementProperties.set(t, s), !s.noAccessor) {
        var _i4 = Symbol(),
          _h5 = this.getPropertyDescriptor(t, _i4, s);
        void 0 !== _h5 && e$2(this.prototype, t, _h5);
      }
    }
  }, {
    key: "getPropertyDescriptor",
    value: function getPropertyDescriptor(t, s, i) {
      var _h$;
      var _ref7 = (_h$ = h$1(this.prototype, t)) !== null && _h$ !== void 0 ? _h$ : {
          get: function get() {
            return this[s];
          },
          set: function set(t) {
            this[s] = t;
          }
        },
        e = _ref7.get,
        r = _ref7.set;
      return {
        get: e,
        set: function set(s) {
          var h = e === null || e === void 0 ? void 0 : e.call(this);
          r !== null && r !== void 0 && r.call(this, s), this.requestUpdate(t, h, i);
        },
        configurable: true,
        enumerable: true
      };
    }
  }, {
    key: "getPropertyOptions",
    value: function getPropertyOptions(t) {
      var _this$elementProperti;
      return (_this$elementProperti = this.elementProperties.get(t)) !== null && _this$elementProperti !== void 0 ? _this$elementProperti : b$1;
    }
  }, {
    key: "_$Ei",
    value: function _$Ei() {
      if (this.hasOwnProperty(d$1("elementProperties"))) return;
      var t = n$3(this);
      t.finalize(), void 0 !== t.l && (this.l = _toConsumableArray(t.l)), this.elementProperties = new Map(t.elementProperties);
    }
  }, {
    key: "finalize",
    value: function finalize() {
      if (this.hasOwnProperty(d$1("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
        var _t5 = this.properties,
          _s4 = [].concat(_toConsumableArray(r$3(_t5)), _toConsumableArray(o$4(_t5)));
        var _iterator6 = _createForOfIteratorHelper(_s4),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _i5 = _step6.value;
            this.createProperty(_i5, _t5[_i5]);
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      var t = this[Symbol.metadata];
      if (null !== t) {
        var _s5 = litPropertyMetadata.get(t);
        if (void 0 !== _s5) {
          var _iterator7 = _createForOfIteratorHelper(_s5),
            _step7;
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var _step7$value = _slicedToArray(_step7.value, 2),
                _t6 = _step7$value[0],
                _i6 = _step7$value[1];
              this.elementProperties.set(_t6, _i6);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
      }
      this._$Eh = new Map();
      var _iterator8 = _createForOfIteratorHelper(this.elementProperties),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var _step8$value = _slicedToArray(_step8.value, 2),
            _t7 = _step8$value[0],
            _s6 = _step8$value[1];
          var _i7 = this._$Eu(_t7, _s6);
          void 0 !== _i7 && this._$Eh.set(_i7, _t7);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
  }, {
    key: "finalizeStyles",
    value: function finalizeStyles(s) {
      var i = [];
      if (Array.isArray(s)) {
        var _e6 = new Set(s.flat(1 / 0).reverse());
        var _iterator9 = _createForOfIteratorHelper(_e6),
          _step9;
        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _s7 = _step9.value;
            i.unshift(c$2(_s7));
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      } else void 0 !== s && i.push(c$2(s));
      return i;
    }
  }, {
    key: "_$Eu",
    value: function _$Eu(t, s) {
      var i = s.attribute;
      return false === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
y$1.elementStyles = [], y$1.shadowRootOptions = {
  mode: "open"
}, y$1[d$1("elementProperties")] = new Map(), y$1[d$1("finalized")] = new Map(), p$1 !== null && p$1 !== void 0 && p$1({
  ReactiveElement: y$1
}), ((_a$1$reactiveElementV = a$1.reactiveElementVersions) !== null && _a$1$reactiveElementV !== void 0 ? _a$1$reactiveElementV : a$1.reactiveElementVersions = []).push("2.1.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$2 = globalThis,
  i$3 = t$2.trustedTypes,
  s$1 = i$3 ? i$3.createPolicy("lit-html", {
    createHTML: function createHTML(t) {
      return t;
    }
  }) : void 0,
  e$1 = "$lit$",
  h = "lit$".concat(Math.random().toFixed(9).slice(2), "$"),
  o$3 = "?" + h,
  n$2 = "<".concat(o$3, ">"),
  r$2 = document,
  l = function l() {
    return r$2.createComment("");
  },
  c = function c(t) {
    return null === t || "object" != _typeof2(t) && "function" != typeof t;
  },
  a = Array.isArray,
  u = function u(t) {
    return a(t) || "function" == typeof (t === null || t === void 0 ? void 0 : t[Symbol.iterator]);
  },
  d = "[ \t\n\f\r]",
  f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  v = /-->/g,
  _ = />/g,
  m = RegExp(">|".concat(d, "(?:([^\\s\"'>=/]+)(").concat(d, "*=").concat(d, "*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)"), "g"),
  p = /'/g,
  g = /"/g,
  $ = /^(?:script|style|textarea|title)$/i,
  y = function y(t) {
    return function (i) {
      for (var _len2 = arguments.length, s = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        s[_key2 - 1] = arguments[_key2];
      }
      return {
        _$litType$: t,
        strings: i,
        values: s
      };
    };
  },
  x = y(1),
  b = y(2),
  T = Symbol.for("lit-noChange"),
  E = Symbol.for("lit-nothing"),
  A = new WeakMap(),
  C = r$2.createTreeWalker(r$2, 129);
function P(t, i) {
  if (!a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i) : i;
}
var V = function V(t, i) {
  var s = t.length - 1,
    o = [];
  var r,
    l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "",
    c = f;
  for (var _i8 = 0; _i8 < s; _i8++) {
    var _s8 = t[_i8];
    var _a2 = void 0,
      _u = void 0,
      _d2 = -1,
      _y = 0;
    for (; _y < _s8.length && (c.lastIndex = _y, _u = c.exec(_s8), null !== _u);) _y = c.lastIndex, c === f ? "!--" === _u[1] ? c = v : void 0 !== _u[1] ? c = _ : void 0 !== _u[2] ? ($.test(_u[2]) && (r = RegExp("</" + _u[2], "g")), c = m) : void 0 !== _u[3] && (c = m) : c === m ? ">" === _u[0] ? (c = r !== null && r !== void 0 ? r : f, _d2 = -1) : void 0 === _u[1] ? _d2 = -2 : (_d2 = c.lastIndex - _u[2].length, _a2 = _u[1], c = void 0 === _u[3] ? m : '"' === _u[3] ? g : p) : c === g || c === p ? c = m : c === v || c === _ ? c = f : (c = m, r = void 0);
    var _x2 = c === m && t[_i8 + 1].startsWith("/>") ? " " : "";
    l += c === f ? _s8 + n$2 : _d2 >= 0 ? (o.push(_a2), _s8.slice(0, _d2) + e$1 + _s8.slice(_d2) + h + _x2) : _s8 + h + (-2 === _d2 ? _i8 : _x2);
  }
  return [P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), o];
};
var N = /*#__PURE__*/function () {
  function N(_ref8, n) {
    var t = _ref8.strings,
      s = _ref8._$litType$;
    _classCallCheck(this, N);
    var r;
    this.parts = [];
    var c = 0,
      a = 0;
    var u = t.length - 1,
      d = this.parts,
      _V = V(t, s),
      _V2 = _slicedToArray(_V, 2),
      f = _V2[0],
      v = _V2[1];
    if (this.el = N.createElement(f, n), C.currentNode = this.el.content, 2 === s || 3 === s) {
      var _t8 = this.el.content.firstChild;
      _t8.replaceWith.apply(_t8, _toConsumableArray(_t8.childNodes));
    }
    for (; null !== (r = C.nextNode()) && d.length < u;) {
      if (1 === r.nodeType) {
        if (r.hasAttributes()) {
          var _iterator0 = _createForOfIteratorHelper(r.getAttributeNames()),
            _step0;
          try {
            for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
              var _t9 = _step0.value;
              if (_t9.endsWith(e$1)) {
                var _i9 = v[a++],
                  _s9 = r.getAttribute(_t9).split(h),
                  _e7 = /([.?@])?(.*)/.exec(_i9);
                d.push({
                  type: 1,
                  index: c,
                  name: _e7[2],
                  strings: _s9,
                  ctor: "." === _e7[1] ? H : "?" === _e7[1] ? I : "@" === _e7[1] ? L : k
                }), r.removeAttribute(_t9);
              } else _t9.startsWith(h) && (d.push({
                type: 6,
                index: c
              }), r.removeAttribute(_t9));
            }
          } catch (err) {
            _iterator0.e(err);
          } finally {
            _iterator0.f();
          }
        }
        if ($.test(r.tagName)) {
          var _t0 = r.textContent.split(h),
            _s0 = _t0.length - 1;
          if (_s0 > 0) {
            r.textContent = i$3 ? i$3.emptyScript : "";
            for (var _i0 = 0; _i0 < _s0; _i0++) r.append(_t0[_i0], l()), C.nextNode(), d.push({
              type: 2,
              index: ++c
            });
            r.append(_t0[_s0], l());
          }
        }
      } else if (8 === r.nodeType) if (r.data === o$3) d.push({
        type: 2,
        index: c
      });else {
        var _t1 = -1;
        for (; -1 !== (_t1 = r.data.indexOf(h, _t1 + 1));) d.push({
          type: 7,
          index: c
        }), _t1 += h.length - 1;
      }
      c++;
    }
  }
  return _createClass(N, null, [{
    key: "createElement",
    value: function createElement(t, i) {
      var s = r$2.createElement("template");
      return s.innerHTML = t, s;
    }
  }]);
}();
function S(t, i) {
  var _s$_$Co, _h6, _h7, _h7$_$AO, _s$_$Co2;
  var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : t;
  var e = arguments.length > 3 ? arguments[3] : undefined;
  if (i === T) return i;
  var h = void 0 !== e ? (_s$_$Co = s._$Co) === null || _s$_$Co === void 0 ? void 0 : _s$_$Co[e] : s._$Cl;
  var o = c(i) ? void 0 : i._$litDirective$;
  return ((_h6 = h) === null || _h6 === void 0 ? void 0 : _h6.constructor) !== o && ((_h7 = h) !== null && _h7 !== void 0 && (_h7$_$AO = _h7._$AO) !== null && _h7$_$AO !== void 0 && _h7$_$AO.call(_h7, false), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? ((_s$_$Co2 = s._$Co) !== null && _s$_$Co2 !== void 0 ? _s$_$Co2 : s._$Co = [])[e] = h : s._$Cl = h), void 0 !== h && (i = S(t, h._$AS(t, i.values), h, e)), i;
}
var M = /*#__PURE__*/function () {
  function M(t, i) {
    _classCallCheck(this, M);
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  return _createClass(M, [{
    key: "parentNode",
    get: function get() {
      return this._$AM.parentNode;
    }
  }, {
    key: "_$AU",
    get: function get() {
      return this._$AM._$AU;
    }
  }, {
    key: "u",
    value: function u(t) {
      var _t$creationScope;
      var _this$_$AD = this._$AD,
        i = _this$_$AD.el.content,
        s = _this$_$AD.parts,
        e = ((_t$creationScope = t === null || t === void 0 ? void 0 : t.creationScope) !== null && _t$creationScope !== void 0 ? _t$creationScope : r$2).importNode(i, true);
      C.currentNode = e;
      var h = C.nextNode(),
        o = 0,
        n = 0,
        l = s[0];
      for (; void 0 !== l;) {
        var _l2;
        if (o === l.index) {
          var _i1 = void 0;
          2 === l.type ? _i1 = new R(h, h.nextSibling, this, t) : 1 === l.type ? _i1 = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (_i1 = new z$1(h, this, t)), this._$AV.push(_i1), l = s[++n];
        }
        o !== ((_l2 = l) === null || _l2 === void 0 ? void 0 : _l2.index) && (h = C.nextNode(), o++);
      }
      return C.currentNode = r$2, e;
    }
  }, {
    key: "p",
    value: function p(t) {
      var i = 0;
      var _iterator1 = _createForOfIteratorHelper(this._$AV),
        _step1;
      try {
        for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
          var _s1 = _step1.value;
          void 0 !== _s1 && (void 0 !== _s1.strings ? (_s1._$AI(t, _s1, i), i += _s1.strings.length - 2) : _s1._$AI(t[i])), i++;
        }
      } catch (err) {
        _iterator1.e(err);
      } finally {
        _iterator1.f();
      }
    }
  }]);
}();
var R = /*#__PURE__*/function () {
  function R(t, i, s, e) {
    var _e$isConnected;
    _classCallCheck(this, R);
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = (_e$isConnected = e === null || e === void 0 ? void 0 : e.isConnected) !== null && _e$isConnected !== void 0 ? _e$isConnected : true;
  }
  return _createClass(R, [{
    key: "_$AU",
    get: function get() {
      var _this$_$AM$_$AU, _this$_$AM;
      return (_this$_$AM$_$AU = (_this$_$AM = this._$AM) === null || _this$_$AM === void 0 ? void 0 : _this$_$AM._$AU) !== null && _this$_$AM$_$AU !== void 0 ? _this$_$AM$_$AU : this._$Cv;
    }
  }, {
    key: "parentNode",
    get: function get() {
      var _t10;
      var t = this._$AA.parentNode;
      var i = this._$AM;
      return void 0 !== i && 11 === ((_t10 = t) === null || _t10 === void 0 ? void 0 : _t10.nodeType) && (t = i.parentNode), t;
    }
  }, {
    key: "startNode",
    get: function get() {
      return this._$AA;
    }
  }, {
    key: "endNode",
    get: function get() {
      return this._$AB;
    }
  }, {
    key: "_$AI",
    value: function _$AI(t) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      t = S(this, t, i), c(t) ? t === E || null == t || "" === t ? (this._$AH !== E && this._$AR(), this._$AH = E) : t !== this._$AH && t !== T && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : u(t) ? this.k(t) : this._(t);
    }
  }, {
    key: "O",
    value: function O(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
  }, {
    key: "T",
    value: function T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
    }
  }, {
    key: "_",
    value: function _(t) {
      this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t : this.T(r$2.createTextNode(t)), this._$AH = t;
    }
  }, {
    key: "$",
    value: function $(t) {
      var _this$_$AH;
      var i = t.values,
        s = t._$litType$,
        e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = N.createElement(P(s.h, s.h[0]), this.options)), s);
      if (((_this$_$AH = this._$AH) === null || _this$_$AH === void 0 ? void 0 : _this$_$AH._$AD) === e) this._$AH.p(i);else {
        var _t11 = new M(e, this),
          _s10 = _t11.u(this.options);
        _t11.p(i), this.T(_s10), this._$AH = _t11;
      }
    }
  }, {
    key: "_$AC",
    value: function _$AC(t) {
      var i = A.get(t.strings);
      return void 0 === i && A.set(t.strings, i = new N(t)), i;
    }
  }, {
    key: "k",
    value: function k(t) {
      a(this._$AH) || (this._$AH = [], this._$AR());
      var i = this._$AH;
      var s,
        e = 0;
      var _iterator10 = _createForOfIteratorHelper(t),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _h8 = _step10.value;
          e === i.length ? i.push(s = new R(this.O(l()), this.O(l()), this, this.options)) : s = i[e], s._$AI(_h8), e++;
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
      e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
  }, {
    key: "_$AR",
    value: function _$AR() {
      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._$AA.nextSibling;
      var i = arguments.length > 1 ? arguments[1] : undefined;
      for ((_this$_$AP = this._$AP) === null || _this$_$AP === void 0 ? void 0 : _this$_$AP.call(this, false, true, i); t && t !== this._$AB;) {
        var _this$_$AP;
        var _i10 = t.nextSibling;
        t.remove(), t = _i10;
      }
    }
  }, {
    key: "setConnected",
    value: function setConnected(t) {
      var _this$_$AP2;
      void 0 === this._$AM && (this._$Cv = t, (_this$_$AP2 = this._$AP) === null || _this$_$AP2 === void 0 ? void 0 : _this$_$AP2.call(this, t));
    }
  }]);
}();
var k = /*#__PURE__*/function () {
  function k(t, i, s, e, h) {
    _classCallCheck(this, k);
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = E;
  }
  return _createClass(k, [{
    key: "tagName",
    get: function get() {
      return this.element.tagName;
    }
  }, {
    key: "_$AU",
    get: function get() {
      return this._$AM._$AU;
    }
  }, {
    key: "_$AI",
    value: function _$AI(t) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      var s = arguments.length > 2 ? arguments[2] : undefined;
      var e = arguments.length > 3 ? arguments[3] : undefined;
      var h = this.strings;
      var o = false;
      if (void 0 === h) t = S(this, t, i, 0), o = !c(t) || t !== this._$AH && t !== T, o && (this._$AH = t);else {
        var _e8 = t;
        var _n2, _r;
        for (t = h[0], _n2 = 0; _n2 < h.length - 1; _n2++) _r = S(this, _e8[s + _n2], i, _n2), _r === T && (_r = this._$AH[_n2]), o || (o = !c(_r) || _r !== this._$AH[_n2]), _r === E ? t = E : t !== E && (t += (_r !== null && _r !== void 0 ? _r : "") + h[_n2 + 1]), this._$AH[_n2] = _r;
      }
      o && !e && this.j(t);
    }
  }, {
    key: "j",
    value: function j(t) {
      t === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t !== null && t !== void 0 ? t : "");
    }
  }]);
}();
var H = /*#__PURE__*/function (_k2) {
  function H() {
    var _this4;
    _classCallCheck(this, H);
    _this4 = _callSuper(this, H, arguments), _this4.type = 3;
    return _this4;
  }
  _inherits(H, _k2);
  return _createClass(H, [{
    key: "j",
    value: function j(t) {
      this.element[this.name] = t === E ? void 0 : t;
    }
  }]);
}(k);
var I = /*#__PURE__*/function (_k3) {
  function I() {
    var _this5;
    _classCallCheck(this, I);
    _this5 = _callSuper(this, I, arguments), _this5.type = 4;
    return _this5;
  }
  _inherits(I, _k3);
  return _createClass(I, [{
    key: "j",
    value: function j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== E);
    }
  }]);
}(k);
var L = /*#__PURE__*/function (_k4) {
  function L(t, i, s, e, h) {
    var _this6;
    _classCallCheck(this, L);
    _this6 = _callSuper(this, L, [t, i, s, e, h]), _this6.type = 5;
    return _this6;
  }
  _inherits(L, _k4);
  return _createClass(L, [{
    key: "_$AI",
    value: function _$AI(t) {
      var _S;
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      if ((t = (_S = S(this, t, i, 0)) !== null && _S !== void 0 ? _S : E) === T) return;
      var s = this._$AH,
        e = t === E && s !== E || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive,
        h = t !== E && (s === E || e);
      e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(t) {
      var _this$options$host, _this$options;
      "function" == typeof this._$AH ? this._$AH.call((_this$options$host = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.host) !== null && _this$options$host !== void 0 ? _this$options$host : this.element, t) : this._$AH.handleEvent(t);
    }
  }]);
}(k);
var z$1 = /*#__PURE__*/function () {
  function z(t, i, s) {
    _classCallCheck(this, z);
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  return _createClass(z, [{
    key: "_$AU",
    get: function get() {
      return this._$AM._$AU;
    }
  }, {
    key: "_$AI",
    value: function _$AI(t) {
      S(this, t);
    }
  }]);
}();
var j = t$2.litHtmlPolyfillSupport;
j !== null && j !== void 0 && j(N, R), ((_t$2$litHtmlVersions = t$2.litHtmlVersions) !== null && _t$2$litHtmlVersions !== void 0 ? _t$2$litHtmlVersions : t$2.litHtmlVersions = []).push("3.3.0");
var B = function B(t, i, s) {
  var _s$renderBefore;
  var e = (_s$renderBefore = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s$renderBefore !== void 0 ? _s$renderBefore : i;
  var h = e._$litPart$;
  if (void 0 === h) {
    var _s$renderBefore2;
    var _t12 = (_s$renderBefore2 = s === null || s === void 0 ? void 0 : s.renderBefore) !== null && _s$renderBefore2 !== void 0 ? _s$renderBefore2 : null;
    e._$litPart$ = h = new R(i.insertBefore(l(), _t12), _t12, void 0, s !== null && s !== void 0 ? s : {});
  }
  return h._$AI(t), h;
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var s = globalThis;
var i$2 = /*#__PURE__*/function (_y$) {
  function i() {
    var _this7;
    _classCallCheck(this, i);
    _this7 = _callSuper(this, i, arguments), _this7.renderOptions = {
      host: _assertThisInitialized(_this7)
    }, _this7._$Do = void 0;
    return _this7;
  }
  _inherits(i, _y$);
  return _createClass(i, [{
    key: "createRenderRoot",
    value: function createRenderRoot() {
      var _this$renderOptions, _this$renderOptions$r;
      var t = _superPropGet(i, "createRenderRoot", this, 3)([]);
      return (_this$renderOptions$r = (_this$renderOptions = this.renderOptions).renderBefore) !== null && _this$renderOptions$r !== void 0 ? _this$renderOptions$r : _this$renderOptions.renderBefore = t.firstChild, t;
    }
  }, {
    key: "update",
    value: function update(t) {
      var r = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), _superPropGet(i, "update", this, 3)([t]), this._$Do = B(r, this.renderRoot, this.renderOptions);
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$_$Do;
      _superPropGet(i, "connectedCallback", this, 3)([]), (_this$_$Do = this._$Do) === null || _this$_$Do === void 0 ? void 0 : _this$_$Do.setConnected(true);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this$_$Do2;
      _superPropGet(i, "disconnectedCallback", this, 3)([]), (_this$_$Do2 = this._$Do) === null || _this$_$Do2 === void 0 ? void 0 : _this$_$Do2.setConnected(false);
    }
  }, {
    key: "render",
    value: function render() {
      return T;
    }
  }]);
}(y$1);
i$2._$litElement$ = true, i$2["finalized"] = true, (_s$litElementHydrateS = s.litElementHydrateSupport) === null || _s$litElementHydrateS === void 0 ? void 0 : _s$litElementHydrateS.call(s, {
  LitElement: i$2
});
var o$2 = s.litElementPolyfillSupport;
o$2 === null || o$2 === void 0 || o$2({
  LitElement: i$2
});
((_s$litElementVersions = s.litElementVersions) !== null && _s$litElementVersions !== void 0 ? _s$litElementVersions : s.litElementVersions = []).push("4.2.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1 = function t$1(t) {
  return function (e, o) {
    void 0 !== o ? o.addInitializer(function () {
      customElements.define(t, e);
    }) : customElements.define(t, e);
  };
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var o$1 = {
    attribute: true,
    type: String,
    converter: u$1,
    reflect: false,
    hasChanged: f$1
  },
  r$1 = function r$1() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : o$1;
    var e = arguments.length > 1 ? arguments[1] : undefined;
    var r = arguments.length > 2 ? arguments[2] : undefined;
    var n = r.kind,
      i = r.metadata;
    var s = globalThis.litPropertyMetadata.get(i);
    if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = new Map()), "setter" === n && ((t = Object.create(t)).wrapped = true), s.set(r.name, t), "accessor" === n) {
      var _o3 = r.name;
      return {
        set: function set(r) {
          var n = e.get.call(this);
          e.set.call(this, r), this.requestUpdate(_o3, n, t);
        },
        init: function init(e) {
          return void 0 !== e && this.C(_o3, void 0, t, e), e;
        }
      };
    }
    if ("setter" === n) {
      var _o4 = r.name;
      return function (r) {
        var n = this[_o4];
        e.call(this, r), this.requestUpdate(_o4, n, t);
      };
    }
    throw Error("Unsupported decorator location: " + n);
  };
function n$1(t) {
  return function (e, o) {
    return "object" == _typeof2(o) ? r$1(t, e, o) : function (t, e, o) {
      var r = e.hasOwnProperty(o);
      return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
    }(t, e, o);
  };
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r) {
  return n$1(_objectSpread(_objectSpread({}, r), {}, {
    state: true,
    attribute: false
  }));
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t = {
    ATTRIBUTE: 1
  },
  e = function e(t) {
    return function () {
      for (var _len3 = arguments.length, e = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        e[_key3] = arguments[_key3];
      }
      return {
        _$litDirective$: t,
        values: e
      };
    };
  };
var i$1 = /*#__PURE__*/function () {
  function i(t) {
    _classCallCheck(this, i);
  }
  return _createClass(i, [{
    key: "_$AU",
    get: function get() {
      return this._$AM._$AU;
    }
  }, {
    key: "_$AT",
    value: function _$AT(t, e, _i11) {
      this._$Ct = t, this._$AM = e, this._$Ci = _i11;
    }
  }, {
    key: "_$AS",
    value: function _$AS(t, e) {
      return this.update(t, e);
    }
  }, {
    key: "update",
    value: function update(t, e) {
      return this.render.apply(this, _toConsumableArray(e));
    }
  }]);
}();

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var n = "important",
  i = " !" + n,
  o = e(/*#__PURE__*/function (_i$) {
    function _class(t$1) {
      var _t$1$strings;
      var _this8;
      _classCallCheck(this, _class);
      if (_this8 = _callSuper(this, _class, [t$1]), t$1.type !== t.ATTRIBUTE || "style" !== t$1.name || ((_t$1$strings = t$1.strings) === null || _t$1$strings === void 0 ? void 0 : _t$1$strings.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
      return _this8;
    }
    _inherits(_class, _i$);
    return _createClass(_class, [{
      key: "render",
      value: function render(t) {
        return Object.keys(t).reduce(function (e, r) {
          var s = t[r];
          return null == s ? e : e + "".concat(r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase(), ":").concat(s, ";");
        }, "");
      }
    }, {
      key: "update",
      value: function update(e, _ref9) {
        var _ref0 = _slicedToArray(_ref9, 1),
          r = _ref0[0];
        var s = e.element.style;
        if (void 0 === this.ft) return this.ft = new Set(Object.keys(r)), this.render(r);
        var _iterator11 = _createForOfIteratorHelper(this.ft),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var _t14 = _step11.value;
            null == r[_t14] && (this.ft.delete(_t14), _t14.includes("-") ? s.removeProperty(_t14) : s[_t14] = null);
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
        for (var _t13 in r) {
          var _e9 = r[_t13];
          if (null != _e9) {
            this.ft.add(_t13);
            var _r2 = "string" == typeof _e9 && _e9.endsWith(i);
            _t13.includes("-") || _r2 ? s.setProperty(_t13, _r2 ? _e9.slice(0, -11) : _e9, _r2 ? n : "") : s[_t13] = _e9;
          }
        }
        return T;
      }
    }]);
  }(i$1));
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var object_hash = {
  exports: {}
};
var hasRequiredObject_hash;
function requireObject_hash() {
  if (hasRequiredObject_hash) return object_hash.exports;
  hasRequiredObject_hash = 1;
  (function (module, exports) {
    !function (e) {
      module.exports = e();
    }(function () {
      return function r(o, i, u) {
        function s(n, e) {
          if (!i[n]) {
            if (!o[n]) {
              var t = "function" == typeof commonjsRequire && commonjsRequire;
              if (!e && t) return t(n, true);
              if (a) return a(n, true);
              throw new Error("Cannot find module '" + n + "'");
            }
            e = i[n] = {
              exports: {}
            };
            o[n][0].call(e.exports, function (e) {
              var t = o[n][1][e];
              return s(t || e);
            }, e, e.exports, r, o, i, u);
          }
          return i[n].exports;
        }
        for (var a = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < u.length; e++) s(u[e]);
        return s;
      }({
        1: [function (w, b, m) {
          !function (e, n, s, c, d, h, p, g, y) {
            var r = w("crypto");
            function t(e, t) {
              t = u(e, t);
              var n;
              return void 0 === (n = "passthrough" !== t.algorithm ? r.createHash(t.algorithm) : new l()).write && (n.write = n.update, n.end = n.update), f(t, n).dispatch(e), n.update || n.end(""), n.digest ? n.digest("buffer" === t.encoding ? void 0 : t.encoding) : (e = n.read(), "buffer" !== t.encoding ? e.toString(t.encoding) : e);
            }
            (m = b.exports = t).sha1 = function (e) {
              return t(e);
            }, m.keys = function (e) {
              return t(e, {
                excludeValues: true,
                algorithm: "sha1",
                encoding: "hex"
              });
            }, m.MD5 = function (e) {
              return t(e, {
                algorithm: "md5",
                encoding: "hex"
              });
            }, m.keysMD5 = function (e) {
              return t(e, {
                algorithm: "md5",
                encoding: "hex",
                excludeValues: true
              });
            };
            var o = r.getHashes ? r.getHashes().slice() : ["sha1", "md5"],
              i = (o.push("passthrough"), ["buffer", "hex", "binary", "base64"]);
            function u(e, t) {
              var n = {};
              if (n.algorithm = (t = t || {}).algorithm || "sha1", n.encoding = t.encoding || "hex", n.excludeValues = !!t.excludeValues, n.algorithm = n.algorithm.toLowerCase(), n.encoding = n.encoding.toLowerCase(), n.ignoreUnknown = true === t.ignoreUnknown, n.respectType = false !== t.respectType, n.respectFunctionNames = false !== t.respectFunctionNames, n.respectFunctionProperties = false !== t.respectFunctionProperties, n.unorderedArrays = true === t.unorderedArrays, n.unorderedSets = false !== t.unorderedSets, n.unorderedObjects = false !== t.unorderedObjects, n.replacer = t.replacer || void 0, n.excludeKeys = t.excludeKeys || void 0, void 0 === e) throw new Error("Object argument required.");
              for (var r = 0; r < o.length; ++r) o[r].toLowerCase() === n.algorithm.toLowerCase() && (n.algorithm = o[r]);
              if (-1 === o.indexOf(n.algorithm)) throw new Error('Algorithm "' + n.algorithm + '"  not supported. supported values: ' + o.join(", "));
              if (-1 === i.indexOf(n.encoding) && "passthrough" !== n.algorithm) throw new Error('Encoding "' + n.encoding + '"  not supported. supported values: ' + i.join(", "));
              return n;
            }
            function a(e) {
              if ("function" == typeof e) return null != /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e));
            }
            function f(o, t, i) {
              i = i || [];
              function u(e) {
                return t.update ? t.update(e, "utf8") : t.write(e, "utf8");
              }
              return {
                dispatch: function dispatch(e) {
                  return this["_" + (null === (e = o.replacer ? o.replacer(e) : e) ? "null" : _typeof2(e))](e);
                },
                _object: function _object(t) {
                  var n,
                    e = Object.prototype.toString.call(t),
                    r = /\[object (.*)\]/i.exec(e);
                  r = (r = r ? r[1] : "unknown:[" + e + "]").toLowerCase();
                  if (0 <= (e = i.indexOf(t))) return this.dispatch("[CIRCULAR:" + e + "]");
                  if (i.push(t), void 0 !== s && s.isBuffer && s.isBuffer(t)) return u("buffer:"), u(t);
                  if ("object" === r || "function" === r || "asyncfunction" === r) return e = Object.keys(t), o.unorderedObjects && (e = e.sort()), false === o.respectType || a(t) || e.splice(0, 0, "prototype", "__proto__", "constructor"), o.excludeKeys && (e = e.filter(function (e) {
                    return !o.excludeKeys(e);
                  })), u("object:" + e.length + ":"), n = this, e.forEach(function (e) {
                    n.dispatch(e), u(":"), o.excludeValues || n.dispatch(t[e]), u(",");
                  });
                  if (!this["_" + r]) {
                    if (o.ignoreUnknown) return u("[" + r + "]");
                    throw new Error('Unknown object type "' + r + '"');
                  }
                  this["_" + r](t);
                },
                _array: function _array(e, t) {
                  t = void 0 !== t ? t : false !== o.unorderedArrays;
                  var n = this;
                  if (u("array:" + e.length + ":"), !t || e.length <= 1) return e.forEach(function (e) {
                    return n.dispatch(e);
                  });
                  var r = [],
                    t = e.map(function (e) {
                      var t = new l(),
                        n = i.slice();
                      return f(o, t, n).dispatch(e), r = r.concat(n.slice(i.length)), t.read().toString();
                    });
                  return i = i.concat(r), t.sort(), this._array(t, false);
                },
                _date: function _date(e) {
                  return u("date:" + e.toJSON());
                },
                _symbol: function _symbol(e) {
                  return u("symbol:" + e.toString());
                },
                _error: function _error(e) {
                  return u("error:" + e.toString());
                },
                _boolean: function _boolean(e) {
                  return u("bool:" + e.toString());
                },
                _string: function _string(e) {
                  u("string:" + e.length + ":"), u(e.toString());
                },
                _function: function _function(e) {
                  u("fn:"), a(e) ? this.dispatch("[native]") : this.dispatch(e.toString()), false !== o.respectFunctionNames && this.dispatch("function-name:" + String(e.name)), o.respectFunctionProperties && this._object(e);
                },
                _number: function _number(e) {
                  return u("number:" + e.toString());
                },
                _xml: function _xml(e) {
                  return u("xml:" + e.toString());
                },
                _null: function _null() {
                  return u("Null");
                },
                _undefined: function _undefined() {
                  return u("Undefined");
                },
                _regexp: function _regexp(e) {
                  return u("regex:" + e.toString());
                },
                _uint8array: function _uint8array(e) {
                  return u("uint8array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _uint8clampedarray: function _uint8clampedarray(e) {
                  return u("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _int8array: function _int8array(e) {
                  return u("int8array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _uint16array: function _uint16array(e) {
                  return u("uint16array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _int16array: function _int16array(e) {
                  return u("int16array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _uint32array: function _uint32array(e) {
                  return u("uint32array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _int32array: function _int32array(e) {
                  return u("int32array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _float32array: function _float32array(e) {
                  return u("float32array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _float64array: function _float64array(e) {
                  return u("float64array:"), this.dispatch(Array.prototype.slice.call(e));
                },
                _arraybuffer: function _arraybuffer(e) {
                  return u("arraybuffer:"), this.dispatch(new Uint8Array(e));
                },
                _url: function _url(e) {
                  return u("url:" + e.toString());
                },
                _map: function _map(e) {
                  u("map:");
                  e = Array.from(e);
                  return this._array(e, false !== o.unorderedSets);
                },
                _set: function _set(e) {
                  u("set:");
                  e = Array.from(e);
                  return this._array(e, false !== o.unorderedSets);
                },
                _file: function _file(e) {
                  return u("file:"), this.dispatch([e.name, e.size, e.type, e.lastModfied]);
                },
                _blob: function _blob() {
                  if (o.ignoreUnknown) return u("[blob]");
                  throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n');
                },
                _domwindow: function _domwindow() {
                  return u("domwindow");
                },
                _bigint: function _bigint(e) {
                  return u("bigint:" + e.toString());
                },
                _process: function _process() {
                  return u("process");
                },
                _timer: function _timer() {
                  return u("timer");
                },
                _pipe: function _pipe() {
                  return u("pipe");
                },
                _tcp: function _tcp() {
                  return u("tcp");
                },
                _udp: function _udp() {
                  return u("udp");
                },
                _tty: function _tty() {
                  return u("tty");
                },
                _statwatcher: function _statwatcher() {
                  return u("statwatcher");
                },
                _securecontext: function _securecontext() {
                  return u("securecontext");
                },
                _connection: function _connection() {
                  return u("connection");
                },
                _zlib: function _zlib() {
                  return u("zlib");
                },
                _context: function _context() {
                  return u("context");
                },
                _nodescript: function _nodescript() {
                  return u("nodescript");
                },
                _httpparser: function _httpparser() {
                  return u("httpparser");
                },
                _dataview: function _dataview() {
                  return u("dataview");
                },
                _signal: function _signal() {
                  return u("signal");
                },
                _fsevent: function _fsevent() {
                  return u("fsevent");
                },
                _tlswrap: function _tlswrap() {
                  return u("tlswrap");
                }
              };
            }
            function l() {
              return {
                buf: "",
                write: function write(e) {
                  this.buf += e;
                },
                end: function end(e) {
                  this.buf += e;
                },
                read: function read() {
                  return this.buf;
                }
              };
            }
            m.writeToStream = function (e, t, n) {
              return void 0 === n && (n = t, t = {}), f(t = u(e, t), n).dispatch(e);
            };
          }.call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
        }, {
          buffer: 3,
          crypto: 5,
          lYpoI2: 11
        }],
        2: [function (e, t, f) {
          !function (e, t, n, r, o, i, u, s, a) {
            !function (e) {
              var a = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                t = "+".charCodeAt(0),
                n = "/".charCodeAt(0),
                r = "0".charCodeAt(0),
                o = "a".charCodeAt(0),
                i = "A".charCodeAt(0),
                u = "-".charCodeAt(0),
                s = "_".charCodeAt(0);
              function f(e) {
                e = e.charCodeAt(0);
                return e === t || e === u ? 62 : e === n || e === s ? 63 : e < r ? -1 : e < r + 10 ? e - r + 26 + 26 : e < i + 26 ? e - i : e < o + 26 ? e - o + 26 : void 0;
              }
              e.toByteArray = function (e) {
                var t, n;
                if (0 < e.length % 4) throw new Error("Invalid string. Length must be a multiple of 4");
                var r = e.length,
                  r = "=" === e.charAt(r - 2) ? 2 : "=" === e.charAt(r - 1) ? 1 : 0,
                  o = new a(3 * e.length / 4 - r),
                  i = 0 < r ? e.length - 4 : e.length,
                  u = 0;
                function s(e) {
                  o[u++] = e;
                }
                for (t = 0; t < i; t += 4, 0) s((16711680 & (n = f(e.charAt(t)) << 18 | f(e.charAt(t + 1)) << 12 | f(e.charAt(t + 2)) << 6 | f(e.charAt(t + 3)))) >> 16), s((65280 & n) >> 8), s(255 & n);
                return 2 == r ? s(255 & (n = f(e.charAt(t)) << 2 | f(e.charAt(t + 1)) >> 4)) : 1 == r && (s((n = f(e.charAt(t)) << 10 | f(e.charAt(t + 1)) << 4 | f(e.charAt(t + 2)) >> 2) >> 8 & 255), s(255 & n)), o;
              }, e.fromByteArray = function (e) {
                var t,
                  n,
                  r,
                  o,
                  i = e.length % 3,
                  u = "";
                function s(e) {
                  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e);
                }
                for (t = 0, r = e.length - i; t < r; t += 3) n = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2], u += s((o = n) >> 18 & 63) + s(o >> 12 & 63) + s(o >> 6 & 63) + s(63 & o);
                switch (i) {
                  case 1:
                    u = (u += s((n = e[e.length - 1]) >> 2)) + s(n << 4 & 63) + "==";
                    break;
                  case 2:
                    u = (u = (u += s((n = (e[e.length - 2] << 8) + e[e.length - 1]) >> 10)) + s(n >> 4 & 63)) + s(n << 2 & 63) + "=";
                }
                return u;
              };
            }(void 0 === f ? this.base64js = {} : f);
          }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
        }, {
          buffer: 3,
          lYpoI2: 11
        }],
        3: [function (O, e, H) {
          !function (e, n, f, r, h, p, g, y, w) {
            var a = O("base64-js"),
              i = O("ieee754");
            function f(e, t, n) {
              if (!(this instanceof f)) return new f(e, t, n);
              var r,
                o,
                i,
                u,
                s = _typeof2(e);
              if ("base64" === t && "string" == s) for (e = (u = e).trim ? u.trim() : u.replace(/^\s+|\s+$/g, ""); e.length % 4 != 0;) e += "=";
              if ("number" == s) r = j(e);else if ("string" == s) r = f.byteLength(e, t);else {
                if ("object" != s) throw new Error("First argument needs to be a number, array or string.");
                r = j(e.length);
              }
              if (f._useTypedArrays ? o = f._augment(new Uint8Array(r)) : ((o = this).length = r, o._isBuffer = true), f._useTypedArrays && "number" == typeof e.byteLength) o._set(e);else if (C(u = e) || f.isBuffer(u) || u && "object" == _typeof2(u) && "number" == typeof u.length) for (i = 0; i < r; i++) f.isBuffer(e) ? o[i] = e.readUInt8(i) : o[i] = e[i];else if ("string" == s) o.write(e, 0, t);else if ("number" == s && !f._useTypedArrays && !n) for (i = 0; i < r; i++) o[i] = 0;
              return o;
            }
            function b(e, t, n, r) {
              return f._charsWritten = c(function (e) {
                for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
                return t;
              }(t), e, n, r);
            }
            function m(e, t, n, r) {
              return f._charsWritten = c(function (e) {
                for (var t, n, r = [], o = 0; o < e.length; o++) n = e.charCodeAt(o), t = n >> 8, n = n % 256, r.push(n), r.push(t);
                return r;
              }(t), e, n, r);
            }
            function v(e, t, n) {
              var r = "";
              n = Math.min(e.length, n);
              for (var o = t; o < n; o++) r += String.fromCharCode(e[o]);
              return r;
            }
            function o(e, t, n, r) {
              r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 1 < e.length, "Trying to read beyond buffer length"));
              var o,
                r = e.length;
              if (!(r <= t)) return n ? (o = e[t], t + 1 < r && (o |= e[t + 1] << 8)) : (o = e[t] << 8, t + 1 < r && (o |= e[t + 1])), o;
            }
            function u(e, t, n, r) {
              r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 3 < e.length, "Trying to read beyond buffer length"));
              var o,
                r = e.length;
              if (!(r <= t)) return n ? (t + 2 < r && (o = e[t + 2] << 16), t + 1 < r && (o |= e[t + 1] << 8), o |= e[t], t + 3 < r && (o += e[t + 3] << 24 >>> 0)) : (t + 1 < r && (o = e[t + 1] << 16), t + 2 < r && (o |= e[t + 2] << 8), t + 3 < r && (o |= e[t + 3]), o += e[t] << 24 >>> 0), o;
            }
            function _(e, t, n, r) {
              if (r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 1 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = o(e, t, n, true), 32768 & r ? -1 * (65535 - r + 1) : r;
            }
            function E(e, t, n, r) {
              if (r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 3 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = u(e, t, n, true), 2147483648 & r ? -1 * (4294967295 - r + 1) : r;
            }
            function I(e, t, n, r) {
              return r || (d("boolean" == typeof n, "missing or invalid endian"), d(t + 3 < e.length, "Trying to read beyond buffer length")), i.read(e, t, n, 23, 4);
            }
            function A(e, t, n, r) {
              return r || (d("boolean" == typeof n, "missing or invalid endian"), d(t + 7 < e.length, "Trying to read beyond buffer length")), i.read(e, t, n, 52, 8);
            }
            function s(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 1 < e.length, "trying to write beyond buffer length"), Y(t, 65535));
              o = e.length;
              if (!(o <= n)) for (var i = 0, u = Math.min(o - n, 2); i < u; i++) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i);
            }
            function l(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "trying to write beyond buffer length"), Y(t, 4294967295));
              o = e.length;
              if (!(o <= n)) for (var i = 0, u = Math.min(o - n, 4); i < u; i++) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255;
            }
            function B(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 1 < e.length, "Trying to write beyond buffer length"), F(t, 32767, -32768)), e.length <= n || s(e, 0 <= t ? t : 65535 + t + 1, n, r, o);
            }
            function L(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "Trying to write beyond buffer length"), F(t, 2147483647, -2147483648)), e.length <= n || l(e, 0 <= t ? t : 4294967295 + t + 1, n, r, o);
            }
            function U(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "Trying to write beyond buffer length"), D(t, 34028234663852886e22, -34028234663852886e22)), e.length <= n || i.write(e, t, n, r, 23, 4);
            }
            function x(e, t, n, r, o) {
              o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 7 < e.length, "Trying to write beyond buffer length"), D(t, 17976931348623157e292, -17976931348623157e292)), e.length <= n || i.write(e, t, n, r, 52, 8);
            }
            H.Buffer = f, H.SlowBuffer = f, H.INSPECT_MAX_BYTES = 50, f.poolSize = 8192, f._useTypedArrays = function () {
              try {
                var e = new ArrayBuffer(0),
                  t = new Uint8Array(e);
                return t.foo = function () {
                  return 42;
                }, 42 === t.foo() && "function" == typeof t.subarray;
              } catch (e) {
                return false;
              }
            }(), f.isEncoding = function (e) {
              switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "raw":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return true;
                default:
                  return false;
              }
            }, f.isBuffer = function (e) {
              return !(null == e || !e._isBuffer);
            }, f.byteLength = function (e, t) {
              var n;
              switch (e += "", t || "utf8") {
                case "hex":
                  n = e.length / 2;
                  break;
                case "utf8":
                case "utf-8":
                  n = T(e).length;
                  break;
                case "ascii":
                case "binary":
                case "raw":
                  n = e.length;
                  break;
                case "base64":
                  n = M(e).length;
                  break;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  n = 2 * e.length;
                  break;
                default:
                  throw new Error("Unknown encoding");
              }
              return n;
            }, f.concat = function (e, t) {
              if (d(C(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new f(0);
              if (1 === e.length) return e[0];
              if ("number" != typeof t) for (o = t = 0; o < e.length; o++) t += e[o].length;
              for (var n = new f(t), r = 0, o = 0; o < e.length; o++) {
                var i = e[o];
                i.copy(n, r), r += i.length;
              }
              return n;
            }, f.prototype.write = function (e, t, n, r) {
              isFinite(t) ? isFinite(n) || (r = n, n = void 0) : (a = r, r = t, t = n, n = a), t = Number(t) || 0;
              var o,
                i,
                u,
                s,
                a = this.length - t;
              switch ((!n || a < (n = Number(n))) && (n = a), r = String(r || "utf8").toLowerCase()) {
                case "hex":
                  o = function (e, t, n, r) {
                    n = Number(n) || 0;
                    var o = e.length - n;
                    (!r || o < (r = Number(r))) && (r = o), d((o = t.length) % 2 == 0, "Invalid hex string"), o / 2 < r && (r = o / 2);
                    for (var i = 0; i < r; i++) {
                      var u = parseInt(t.substr(2 * i, 2), 16);
                      d(!isNaN(u), "Invalid hex string"), e[n + i] = u;
                    }
                    return f._charsWritten = 2 * i, i;
                  }(this, e, t, n);
                  break;
                case "utf8":
                case "utf-8":
                  i = this, u = t, s = n, o = f._charsWritten = c(T(e), i, u, s);
                  break;
                case "ascii":
                case "binary":
                  o = b(this, e, t, n);
                  break;
                case "base64":
                  i = this, u = t, s = n, o = f._charsWritten = c(M(e), i, u, s);
                  break;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  o = m(this, e, t, n);
                  break;
                default:
                  throw new Error("Unknown encoding");
              }
              return o;
            }, f.prototype.toString = function (e, t, n) {
              var r,
                o,
                i,
                u,
                s = this;
              if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, (n = void 0 !== n ? Number(n) : s.length) === t) return "";
              switch (e) {
                case "hex":
                  r = function (e, t, n) {
                    var r = e.length;
                    (!t || t < 0) && (t = 0);
                    (!n || n < 0 || r < n) && (n = r);
                    for (var o = "", i = t; i < n; i++) o += k(e[i]);
                    return o;
                  }(s, t, n);
                  break;
                case "utf8":
                case "utf-8":
                  r = function (e, t, n) {
                    var r = "",
                      o = "";
                    n = Math.min(e.length, n);
                    for (var i = t; i < n; i++) e[i] <= 127 ? (r += N(o) + String.fromCharCode(e[i]), o = "") : o += "%" + e[i].toString(16);
                    return r + N(o);
                  }(s, t, n);
                  break;
                case "ascii":
                case "binary":
                  r = v(s, t, n);
                  break;
                case "base64":
                  o = s, u = n, r = 0 === (i = t) && u === o.length ? a.fromByteArray(o) : a.fromByteArray(o.slice(i, u));
                  break;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  r = function (e, t, n) {
                    for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) o += String.fromCharCode(r[i] + 256 * r[i + 1]);
                    return o;
                  }(s, t, n);
                  break;
                default:
                  throw new Error("Unknown encoding");
              }
              return r;
            }, f.prototype.toJSON = function () {
              return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
              };
            }, f.prototype.copy = function (e, t, n, r) {
              if (t = t || 0, (r = r || 0 === r ? r : this.length) !== (n = n || 0) && 0 !== e.length && 0 !== this.length) {
                d(n <= r, "sourceEnd < sourceStart"), d(0 <= t && t < e.length, "targetStart out of bounds"), d(0 <= n && n < this.length, "sourceStart out of bounds"), d(0 <= r && r <= this.length, "sourceEnd out of bounds"), r > this.length && (r = this.length);
                var o = (r = e.length - t < r - n ? e.length - t + n : r) - n;
                if (o < 100 || !f._useTypedArrays) for (var i = 0; i < o; i++) e[i + t] = this[i + n];else e._set(this.subarray(n, n + o), t);
              }
            }, f.prototype.slice = function (e, t) {
              var n = this.length;
              if (e = S(e, n, 0), t = S(t, n, n), f._useTypedArrays) return f._augment(this.subarray(e, t));
              for (var r = t - e, o = new f(r, void 0, true), i = 0; i < r; i++) o[i] = this[i + e];
              return o;
            }, f.prototype.get = function (e) {
              return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e);
            }, f.prototype.set = function (e, t) {
              return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t);
            }, f.prototype.readUInt8 = function (e, t) {
              if (t || (d(null != e, "missing offset"), d(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return this[e];
            }, f.prototype.readUInt16LE = function (e, t) {
              return o(this, e, true, t);
            }, f.prototype.readUInt16BE = function (e, t) {
              return o(this, e, false, t);
            }, f.prototype.readUInt32LE = function (e, t) {
              return u(this, e, true, t);
            }, f.prototype.readUInt32BE = function (e, t) {
              return u(this, e, false, t);
            }, f.prototype.readInt8 = function (e, t) {
              if (t || (d(null != e, "missing offset"), d(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
            }, f.prototype.readInt16LE = function (e, t) {
              return _(this, e, true, t);
            }, f.prototype.readInt16BE = function (e, t) {
              return _(this, e, false, t);
            }, f.prototype.readInt32LE = function (e, t) {
              return E(this, e, true, t);
            }, f.prototype.readInt32BE = function (e, t) {
              return E(this, e, false, t);
            }, f.prototype.readFloatLE = function (e, t) {
              return I(this, e, true, t);
            }, f.prototype.readFloatBE = function (e, t) {
              return I(this, e, false, t);
            }, f.prototype.readDoubleLE = function (e, t) {
              return A(this, e, true, t);
            }, f.prototype.readDoubleBE = function (e, t) {
              return A(this, e, false, t);
            }, f.prototype.writeUInt8 = function (e, t, n) {
              n || (d(null != e, "missing value"), d(null != t, "missing offset"), d(t < this.length, "trying to write beyond buffer length"), Y(e, 255)), t >= this.length || (this[t] = e);
            }, f.prototype.writeUInt16LE = function (e, t, n) {
              s(this, e, t, true, n);
            }, f.prototype.writeUInt16BE = function (e, t, n) {
              s(this, e, t, false, n);
            }, f.prototype.writeUInt32LE = function (e, t, n) {
              l(this, e, t, true, n);
            }, f.prototype.writeUInt32BE = function (e, t, n) {
              l(this, e, t, false, n);
            }, f.prototype.writeInt8 = function (e, t, n) {
              n || (d(null != e, "missing value"), d(null != t, "missing offset"), d(t < this.length, "Trying to write beyond buffer length"), F(e, 127, -128)), t >= this.length || (0 <= e ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n));
            }, f.prototype.writeInt16LE = function (e, t, n) {
              B(this, e, t, true, n);
            }, f.prototype.writeInt16BE = function (e, t, n) {
              B(this, e, t, false, n);
            }, f.prototype.writeInt32LE = function (e, t, n) {
              L(this, e, t, true, n);
            }, f.prototype.writeInt32BE = function (e, t, n) {
              L(this, e, t, false, n);
            }, f.prototype.writeFloatLE = function (e, t, n) {
              U(this, e, t, true, n);
            }, f.prototype.writeFloatBE = function (e, t, n) {
              U(this, e, t, false, n);
            }, f.prototype.writeDoubleLE = function (e, t, n) {
              x(this, e, t, true, n);
            }, f.prototype.writeDoubleBE = function (e, t, n) {
              x(this, e, t, false, n);
            }, f.prototype.fill = function (e, t, n) {
              if (t = t || 0, n = n || this.length, d("number" == typeof (e = "string" == typeof (e = e || 0) ? e.charCodeAt(0) : e) && !isNaN(e), "value is not a number"), d(t <= n, "end < start"), n !== t && 0 !== this.length) {
                d(0 <= t && t < this.length, "start out of bounds"), d(0 <= n && n <= this.length, "end out of bounds");
                for (var r = t; r < n; r++) this[r] = e;
              }
            }, f.prototype.inspect = function () {
              for (var e = [], t = this.length, n = 0; n < t; n++) if (e[n] = k(this[n]), n === H.INSPECT_MAX_BYTES) {
                e[n + 1] = "...";
                break;
              }
              return "<Buffer " + e.join(" ") + ">";
            }, f.prototype.toArrayBuffer = function () {
              if ("undefined" == typeof Uint8Array) throw new Error("Buffer.toArrayBuffer not supported in this browser");
              if (f._useTypedArrays) return new f(this).buffer;
              for (var e = new Uint8Array(this.length), t = 0, n = e.length; t < n; t += 1) e[t] = this[t];
              return e.buffer;
            };
            var t = f.prototype;
            function S(e, t, n) {
              return "number" != typeof e ? n : t <= (e = ~~e) ? t : 0 <= e || 0 <= (e += t) ? e : 0;
            }
            function j(e) {
              return (e = ~~Math.ceil(+e)) < 0 ? 0 : e;
            }
            function C(e) {
              return (Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              })(e);
            }
            function k(e) {
              return e < 16 ? "0" + e.toString(16) : e.toString(16);
            }
            function T(e) {
              for (var t = [], n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r <= 127) t.push(e.charCodeAt(n));else for (var o = n, i = (55296 <= r && r <= 57343 && n++, encodeURIComponent(e.slice(o, n + 1)).substr(1).split("%")), u = 0; u < i.length; u++) t.push(parseInt(i[u], 16));
              }
              return t;
            }
            function M(e) {
              return a.toByteArray(e);
            }
            function c(e, t, n, r) {
              for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); o++) t[o + n] = e[o];
              return o;
            }
            function N(e) {
              try {
                return decodeURIComponent(e);
              } catch (e) {
                return String.fromCharCode(65533);
              }
            }
            function Y(e, t) {
              d("number" == typeof e, "cannot write a non-number as a number"), d(0 <= e, "specified a negative value for writing an unsigned value"), d(e <= t, "value is larger than maximum value for type"), d(Math.floor(e) === e, "value has a fractional component");
            }
            function F(e, t, n) {
              d("number" == typeof e, "cannot write a non-number as a number"), d(e <= t, "value larger than maximum allowed value"), d(n <= e, "value smaller than minimum allowed value"), d(Math.floor(e) === e, "value has a fractional component");
            }
            function D(e, t, n) {
              d("number" == typeof e, "cannot write a non-number as a number"), d(e <= t, "value larger than maximum allowed value"), d(n <= e, "value smaller than minimum allowed value");
            }
            function d(e, t) {
              if (!e) throw new Error(t || "Failed assertion");
            }
            f._augment = function (e) {
              return e._isBuffer = true, e._get = e.get, e._set = e.set, e.get = t.get, e.set = t.set, e.write = t.write, e.toString = t.toString, e.toLocaleString = t.toString, e.toJSON = t.toJSON, e.copy = t.copy, e.slice = t.slice, e.readUInt8 = t.readUInt8, e.readUInt16LE = t.readUInt16LE, e.readUInt16BE = t.readUInt16BE, e.readUInt32LE = t.readUInt32LE, e.readUInt32BE = t.readUInt32BE, e.readInt8 = t.readInt8, e.readInt16LE = t.readInt16LE, e.readInt16BE = t.readInt16BE, e.readInt32LE = t.readInt32LE, e.readInt32BE = t.readInt32BE, e.readFloatLE = t.readFloatLE, e.readFloatBE = t.readFloatBE, e.readDoubleLE = t.readDoubleLE, e.readDoubleBE = t.readDoubleBE, e.writeUInt8 = t.writeUInt8, e.writeUInt16LE = t.writeUInt16LE, e.writeUInt16BE = t.writeUInt16BE, e.writeUInt32LE = t.writeUInt32LE, e.writeUInt32BE = t.writeUInt32BE, e.writeInt8 = t.writeInt8, e.writeInt16LE = t.writeInt16LE, e.writeInt16BE = t.writeInt16BE, e.writeInt32LE = t.writeInt32LE, e.writeInt32BE = t.writeInt32BE, e.writeFloatLE = t.writeFloatLE, e.writeFloatBE = t.writeFloatBE, e.writeDoubleLE = t.writeDoubleLE, e.writeDoubleBE = t.writeDoubleBE, e.fill = t.fill, e.inspect = t.inspect, e.toArrayBuffer = t.toArrayBuffer, e;
            };
          }.call(this, O("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, O("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
        }, {
          "base64-js": 2,
          buffer: 3,
          ieee754: 10,
          lYpoI2: 11
        }],
        4: [function (c, d, e) {
          !function (e, t, a, n, r, o, i, u, s) {
            var a = c("buffer").Buffer,
              f = 4,
              l = new a(f);
            l.fill(0);
            d.exports = {
              hash: function hash(e, t, n, r) {
                for (var o = t(function (e, t) {
                    e.length % f != 0 && (n = e.length + (f - e.length % f), e = a.concat([e, l], n));
                    for (var n, r = [], o = t ? e.readInt32BE : e.readInt32LE, i = 0; i < e.length; i += f) r.push(o.call(e, i));
                    return r;
                  }(e = a.isBuffer(e) ? e : new a(e), r), 8 * e.length), t = r, i = new a(n), u = t ? i.writeInt32BE : i.writeInt32LE, s = 0; s < o.length; s++) u.call(i, o[s], 4 * s, true);
                return i;
              }
            };
          }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          buffer: 3,
          lYpoI2: 11
        }],
        5: [function (v, e, _) {
          !function (l, c, u, d, h, p, g, y, w) {
            var u = v("buffer").Buffer,
              e = v("./sha"),
              t = v("./sha256"),
              n = v("./rng"),
              b = {
                sha1: e,
                sha256: t,
                md5: v("./md5")
              },
              s = 64,
              a = new u(s);
            function r(e, n) {
              var r = b[e = e || "sha1"],
                o = [];
              return r || i("algorithm:", e, "is not yet supported"), {
                update: function update(e) {
                  return u.isBuffer(e) || (e = new u(e)), o.push(e), e.length, this;
                },
                digest: function digest(e) {
                  var t = u.concat(o),
                    t = n ? function (e, t, n) {
                      u.isBuffer(t) || (t = new u(t)), u.isBuffer(n) || (n = new u(n)), t.length > s ? t = e(t) : t.length < s && (t = u.concat([t, a], s));
                      for (var r = new u(s), o = new u(s), i = 0; i < s; i++) r[i] = 54 ^ t[i], o[i] = 92 ^ t[i];
                      return n = e(u.concat([r, n])), e(u.concat([o, n]));
                    }(r, n, t) : r(t);
                  return o = null, e ? t.toString(e) : t;
                }
              };
            }
            function i() {
              var e = [].slice.call(arguments).join(" ");
              throw new Error([e, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join("\n"));
            }
            a.fill(0), _.createHash = function (e) {
              return r(e);
            }, _.createHmac = r, _.randomBytes = function (e, t) {
              if (!t || !t.call) return new u(n(e));
              try {
                t.call(this, void 0, new u(n(e)));
              } catch (e) {
                t(e);
              }
            };
            var o,
              f = ["createCredentials", "createCipher", "createCipheriv", "createDecipher", "createDecipheriv", "createSign", "createVerify", "createDiffieHellman", "pbkdf2"],
              m = function m(e) {
                _[e] = function () {
                  i("sorry,", e, "is not implemented yet");
                };
              };
            for (o in f) m(f[o]);
          }.call(this, v("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, v("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          "./md5": 6,
          "./rng": 7,
          "./sha": 8,
          "./sha256": 9,
          buffer: 3,
          lYpoI2: 11
        }],
        6: [function (w, b, e) {
          !function (e, r, o, i, u, a, f, l, y) {
            var t = w("./helpers");
            function n(e, t) {
              e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
              for (var n = 1732584193, r = -271733879, o = -1732584194, i = 271733878, u = 0; u < e.length; u += 16) {
                var s = n,
                  a = r,
                  f = o,
                  l = i,
                  n = c(n, r, o, i, e[u + 0], 7, -680876936),
                  i = c(i, n, r, o, e[u + 1], 12, -389564586),
                  o = c(o, i, n, r, e[u + 2], 17, 606105819),
                  r = c(r, o, i, n, e[u + 3], 22, -1044525330);
                n = c(n, r, o, i, e[u + 4], 7, -176418897), i = c(i, n, r, o, e[u + 5], 12, 1200080426), o = c(o, i, n, r, e[u + 6], 17, -1473231341), r = c(r, o, i, n, e[u + 7], 22, -45705983), n = c(n, r, o, i, e[u + 8], 7, 1770035416), i = c(i, n, r, o, e[u + 9], 12, -1958414417), o = c(o, i, n, r, e[u + 10], 17, -42063), r = c(r, o, i, n, e[u + 11], 22, -1990404162), n = c(n, r, o, i, e[u + 12], 7, 1804603682), i = c(i, n, r, o, e[u + 13], 12, -40341101), o = c(o, i, n, r, e[u + 14], 17, -1502002290), n = d(n, r = c(r, o, i, n, e[u + 15], 22, 1236535329), o, i, e[u + 1], 5, -165796510), i = d(i, n, r, o, e[u + 6], 9, -1069501632), o = d(o, i, n, r, e[u + 11], 14, 643717713), r = d(r, o, i, n, e[u + 0], 20, -373897302), n = d(n, r, o, i, e[u + 5], 5, -701558691), i = d(i, n, r, o, e[u + 10], 9, 38016083), o = d(o, i, n, r, e[u + 15], 14, -660478335), r = d(r, o, i, n, e[u + 4], 20, -405537848), n = d(n, r, o, i, e[u + 9], 5, 568446438), i = d(i, n, r, o, e[u + 14], 9, -1019803690), o = d(o, i, n, r, e[u + 3], 14, -187363961), r = d(r, o, i, n, e[u + 8], 20, 1163531501), n = d(n, r, o, i, e[u + 13], 5, -1444681467), i = d(i, n, r, o, e[u + 2], 9, -51403784), o = d(o, i, n, r, e[u + 7], 14, 1735328473), n = h(n, r = d(r, o, i, n, e[u + 12], 20, -1926607734), o, i, e[u + 5], 4, -378558), i = h(i, n, r, o, e[u + 8], 11, -2022574463), o = h(o, i, n, r, e[u + 11], 16, 1839030562), r = h(r, o, i, n, e[u + 14], 23, -35309556), n = h(n, r, o, i, e[u + 1], 4, -1530992060), i = h(i, n, r, o, e[u + 4], 11, 1272893353), o = h(o, i, n, r, e[u + 7], 16, -155497632), r = h(r, o, i, n, e[u + 10], 23, -1094730640), n = h(n, r, o, i, e[u + 13], 4, 681279174), i = h(i, n, r, o, e[u + 0], 11, -358537222), o = h(o, i, n, r, e[u + 3], 16, -722521979), r = h(r, o, i, n, e[u + 6], 23, 76029189), n = h(n, r, o, i, e[u + 9], 4, -640364487), i = h(i, n, r, o, e[u + 12], 11, -421815835), o = h(o, i, n, r, e[u + 15], 16, 530742520), n = p(n, r = h(r, o, i, n, e[u + 2], 23, -995338651), o, i, e[u + 0], 6, -198630844), i = p(i, n, r, o, e[u + 7], 10, 1126891415), o = p(o, i, n, r, e[u + 14], 15, -1416354905), r = p(r, o, i, n, e[u + 5], 21, -57434055), n = p(n, r, o, i, e[u + 12], 6, 1700485571), i = p(i, n, r, o, e[u + 3], 10, -1894986606), o = p(o, i, n, r, e[u + 10], 15, -1051523), r = p(r, o, i, n, e[u + 1], 21, -2054922799), n = p(n, r, o, i, e[u + 8], 6, 1873313359), i = p(i, n, r, o, e[u + 15], 10, -30611744), o = p(o, i, n, r, e[u + 6], 15, -1560198380), r = p(r, o, i, n, e[u + 13], 21, 1309151649), n = p(n, r, o, i, e[u + 4], 6, -145523070), i = p(i, n, r, o, e[u + 11], 10, -1120210379), o = p(o, i, n, r, e[u + 2], 15, 718787259), r = p(r, o, i, n, e[u + 9], 21, -343485551), n = g(n, s), r = g(r, a), o = g(o, f), i = g(i, l);
              }
              return Array(n, r, o, i);
            }
            function s(e, t, n, r, o, i) {
              return g((t = g(g(t, e), g(r, i))) << o | t >>> 32 - o, n);
            }
            function c(e, t, n, r, o, i, u) {
              return s(t & n | ~t & r, e, t, o, i, u);
            }
            function d(e, t, n, r, o, i, u) {
              return s(t & r | n & ~r, e, t, o, i, u);
            }
            function h(e, t, n, r, o, i, u) {
              return s(t ^ n ^ r, e, t, o, i, u);
            }
            function p(e, t, n, r, o, i, u) {
              return s(n ^ (t | ~r), e, t, o, i, u);
            }
            function g(e, t) {
              var n = (65535 & e) + (65535 & t);
              return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
            }
            b.exports = function (e) {
              return t.hash(e, n, 16);
            };
          }.call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          "./helpers": 4,
          buffer: 3,
          lYpoI2: 11
        }],
        7: [function (e, l, t) {
          !function (e, t, n, r, o, i, u, s, f) {
            l.exports = function (e) {
              for (var t, n = new Array(e), r = 0; r < e; r++) 0 == (3 & r) && (t = 4294967296 * Math.random()), n[r] = t >>> ((3 & r) << 3) & 255;
              return n;
            };
          }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          buffer: 3,
          lYpoI2: 11
        }],
        8: [function (c, d, e) {
          !function (e, t, n, r, o, s, a, f, l) {
            var i = c("./helpers");
            function u(l, c) {
              l[c >> 5] |= 128 << 24 - c % 32, l[15 + (c + 64 >> 9 << 4)] = c;
              for (var e, t, n, r = Array(80), o = 1732584193, i = -271733879, u = -1732584194, s = 271733878, d = -1009589776, h = 0; h < l.length; h += 16) {
                for (var p = o, g = i, y = u, w = s, b = d, a = 0; a < 80; a++) {
                  r[a] = a < 16 ? l[h + a] : v(r[a - 3] ^ r[a - 8] ^ r[a - 14] ^ r[a - 16], 1);
                  var f = m(m(v(o, 5), (f = i, t = u, n = s, (e = a) < 20 ? f & t | ~f & n : !(e < 40) && e < 60 ? f & t | f & n | t & n : f ^ t ^ n)), m(m(d, r[a]), (e = a) < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514)),
                    d = s,
                    s = u,
                    u = v(i, 30),
                    i = o,
                    o = f;
                }
                o = m(o, p), i = m(i, g), u = m(u, y), s = m(s, w), d = m(d, b);
              }
              return Array(o, i, u, s, d);
            }
            function m(e, t) {
              var n = (65535 & e) + (65535 & t);
              return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
            }
            function v(e, t) {
              return e << t | e >>> 32 - t;
            }
            d.exports = function (e) {
              return i.hash(e, u, 20, true);
            };
          }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          "./helpers": 4,
          buffer: 3,
          lYpoI2: 11
        }],
        9: [function (c, d, e) {
          !function (e, t, n, r, u, s, a, f, l) {
            function b(e, t) {
              var n = (65535 & e) + (65535 & t);
              return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
            }
            function o(e, l) {
              var c,
                d = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
                t = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
                n = new Array(64);
              e[l >> 5] |= 128 << 24 - l % 32, e[15 + (l + 64 >> 9 << 4)] = l;
              for (var r, o, h = 0; h < e.length; h += 16) {
                for (var i = t[0], u = t[1], s = t[2], p = t[3], a = t[4], g = t[5], y = t[6], w = t[7], f = 0; f < 64; f++) n[f] = f < 16 ? e[f + h] : b(b(b((o = n[f - 2], m(o, 17) ^ m(o, 19) ^ v(o, 10)), n[f - 7]), (o = n[f - 15], m(o, 7) ^ m(o, 18) ^ v(o, 3))), n[f - 16]), c = b(b(b(b(w, m(o = a, 6) ^ m(o, 11) ^ m(o, 25)), a & g ^ ~a & y), d[f]), n[f]), r = b(m(r = i, 2) ^ m(r, 13) ^ m(r, 22), i & u ^ i & s ^ u & s), w = y, y = g, g = a, a = b(p, c), p = s, s = u, u = i, i = b(c, r);
                t[0] = b(i, t[0]), t[1] = b(u, t[1]), t[2] = b(s, t[2]), t[3] = b(p, t[3]), t[4] = b(a, t[4]), t[5] = b(g, t[5]), t[6] = b(y, t[6]), t[7] = b(w, t[7]);
              }
              return t;
            }
            var i = c("./helpers"),
              m = function m(e, t) {
                return e >>> t | e << 32 - t;
              },
              v = function v(e, t) {
                return e >>> t;
              };
            d.exports = function (e) {
              return i.hash(e, o, 32, true);
            };
          }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
        }, {
          "./helpers": 4,
          buffer: 3,
          lYpoI2: 11
        }],
        10: [function (e, t, f) {
          !function (e, t, n, r, o, i, u, s, a) {
            f.read = function (e, t, n, r, o) {
              var i,
                u,
                l = 8 * o - r - 1,
                c = (1 << l) - 1,
                d = c >> 1,
                s = -7,
                a = n ? o - 1 : 0,
                f = n ? -1 : 1,
                o = e[t + a];
              for (a += f, i = o & (1 << -s) - 1, o >>= -s, s += l; 0 < s; i = 256 * i + e[t + a], a += f, s -= 8);
              for (u = i & (1 << -s) - 1, i >>= -s, s += r; 0 < s; u = 256 * u + e[t + a], a += f, s -= 8);
              if (0 === i) i = 1 - d;else {
                if (i === c) return u ? NaN : 1 / 0 * (o ? -1 : 1);
                u += Math.pow(2, r), i -= d;
              }
              return (o ? -1 : 1) * u * Math.pow(2, i - r);
            }, f.write = function (e, t, l, n, r, c) {
              var o,
                i,
                u = 8 * c - r - 1,
                s = (1 << u) - 1,
                a = s >> 1,
                d = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                f = n ? 0 : c - 1,
                h = n ? 1 : -1,
                c = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
              for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (i = isNaN(t) ? 1 : 0, o = s) : (o = Math.floor(Math.log(t) / Math.LN2), t * (n = Math.pow(2, -o)) < 1 && (o--, n *= 2), 2 <= (t += 1 <= o + a ? d / n : d * Math.pow(2, 1 - a)) * n && (o++, n /= 2), s <= o + a ? (i = 0, o = s) : 1 <= o + a ? (i = (t * n - 1) * Math.pow(2, r), o += a) : (i = t * Math.pow(2, a - 1) * Math.pow(2, r), o = 0)); 8 <= r; e[l + f] = 255 & i, f += h, i /= 256, r -= 8);
              for (o = o << r | i, u += r; 0 < u; e[l + f] = 255 & o, f += h, o /= 256, u -= 8);
              e[l + f - h] |= 128 * c;
            };
          }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
        }, {
          buffer: 3,
          lYpoI2: 11
        }],
        11: [function (e, h, t) {
          !function (e, t, n, r, o, f, l, c, d) {
            var i, u, s;
            function a() {}
            (e = h.exports = {}).nextTick = (u = "undefined" != typeof window && window.setImmediate, s = "undefined" != typeof window && window.postMessage && window.addEventListener, u ? function (e) {
              return window.setImmediate(e);
            } : s ? (i = [], window.addEventListener("message", function (e) {
              var t = e.source;
              t !== window && null !== t || "process-tick" !== e.data || (e.stopPropagation(), 0 < i.length && i.shift()());
            }, true), function (e) {
              i.push(e), window.postMessage("process-tick", "*");
            }) : function (e) {
              setTimeout(e, 0);
            }), e.title = "browser", e.browser = true, e.env = {}, e.argv = [], e.on = a, e.addListener = a, e.once = a, e.off = a, e.removeListener = a, e.removeAllListeners = a, e.emit = a, e.binding = function (e) {
              throw new Error("process.binding is not supported");
            }, e.cwd = function () {
              return "/";
            }, e.chdir = function (e) {
              throw new Error("process.chdir is not supported");
            };
          }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
        }, {
          buffer: 3,
          lYpoI2: 11
        }]
      }, {}, [1])(1);
    });
  })(object_hash);
  return object_hash.exports;
}
var object_hashExports = requireObject_hash();
var hash = /*@__PURE__*/getDefaultExportFromCjs(object_hashExports);

// Polymer legacy event helpers used courtesy of the Polymer project.
//
// Copyright (c) 2017 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param {string} type Name of event type.
 * @param {*=} detail Detail value containing event-specific
 *   payload.
 * @param {{ bubbles: (boolean|undefined),
 *           cancelable: (boolean|undefined),
 *           composed: (boolean|undefined) }=}
 *  options Object specifying options.  These may include:
 *  `bubbles` (boolean, defaults to `true`),
 *  `cancelable` (boolean, defaults to false), and
 *  `node` on which to fire the event (HTMLElement, defaults to `this`).
 * @return {Event} The new event that was fired.
 */
var fireEvent = function fireEvent(node, type, detail, options) {
  options = options || {};
  // @ts-ignore
  detail = detail === null || detail === undefined ? {} : detail;
  var event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};
var NumberFormat;
(function (NumberFormat) {
  NumberFormat["language"] = "language";
  NumberFormat["system"] = "system";
  NumberFormat["comma_decimal"] = "comma_decimal";
  NumberFormat["decimal_comma"] = "decimal_comma";
  NumberFormat["space_comma"] = "space_comma";
  NumberFormat["none"] = "none";
})(NumberFormat || (NumberFormat = {}));
var TimeFormat;
(function (TimeFormat) {
  TimeFormat["language"] = "language";
  TimeFormat["system"] = "system";
  TimeFormat["am_pm"] = "12";
  TimeFormat["twenty_four"] = "24";
})(TimeFormat || (TimeFormat = {}));
var TimeZone;
(function (TimeZone) {
  TimeZone["local"] = "local";
  TimeZone["server"] = "server";
})(TimeZone || (TimeZone = {}));
var DateFormat;
(function (DateFormat) {
  DateFormat["language"] = "language";
  DateFormat["system"] = "system";
  DateFormat["DMY"] = "DMY";
  DateFormat["MDY"] = "MDY";
  DateFormat["YMD"] = "YMD";
})(DateFormat || (DateFormat = {}));
var FirstWeekday;
(function (FirstWeekday) {
  FirstWeekday["language"] = "language";
  FirstWeekday["monday"] = "monday";
  FirstWeekday["tuesday"] = "tuesday";
  FirstWeekday["wednesday"] = "wednesday";
  FirstWeekday["thursday"] = "thursday";
  FirstWeekday["friday"] = "friday";
  FirstWeekday["saturday"] = "saturday";
  FirstWeekday["sunday"] = "sunday";
})(FirstWeekday || (FirstWeekday = {}));
var round = function round(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
};
var numberFormatToLocale = function numberFormatToLocale(localeOptions) {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ["en-US", "en"];
    // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ["de", "es", "it"];
    // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ["fr", "sv", "cs"];
    // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
};
/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
var formatNumber = function formatNumber(num, localeOptions, options) {
  var locale = localeOptions ? numberFormatToLocale(localeOptions) : undefined;
  // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
  Number.isNaN = Number.isNaN || function isNaN(input) {
    return typeof input === "number" && isNaN(input);
  };
  if ((localeOptions === null || localeOptions === void 0 ? void 0 : localeOptions.number_format) !== NumberFormat.none && !Number.isNaN(Number(num)) && Intl) {
    try {
      return new Intl.NumberFormat(locale, getDefaultFormatOptions(num, options)).format(Number(num));
    } catch (err) {
      // Don't fail when using "TEST" language
      // eslint-disable-next-line no-console
      console.error(err);
      return new Intl.NumberFormat(undefined, getDefaultFormatOptions(num, options)).format(Number(num));
    }
  }
  if (typeof num === "string") {
    return num;
  }
  return "".concat(round(num, options === null || options === void 0 ? void 0 : options.maximumFractionDigits).toString()).concat((options === null || options === void 0 ? void 0 : options.style) === "currency" ? " ".concat(options.currency) : "");
};
/**
 * Checks if the current entity state should be formatted as an integer based on the `state` and `step` attribute and returns the appropriate `Intl.NumberFormatOptions` object with `maximumFractionDigits` set
 * @param entityState The state object of the entity
 * @returns An `Intl.NumberFormatOptions` object with `maximumFractionDigits` set to 0, or `undefined`
 */
var getNumberFormatOptions = function getNumberFormatOptions(entityState, entity) {
  var _a;
  var precision = entity === null || entity === void 0 ? void 0 : entity.display_precision;
  if (precision != null) {
    return {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision
    };
  }
  if (Number.isInteger(Number((_a = entityState.attributes) === null || _a === void 0 ? void 0 : _a.step)) && Number.isInteger(Number(entityState.state))) {
    return {
      maximumFractionDigits: 0
    };
  }
  if (entityState.attributes.step != null) {
    return {
      maximumFractionDigits: Math.ceil(Math.log10(1 / entityState.attributes.step))
    };
  }
  return undefined;
};
/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
var getDefaultFormatOptions = function getDefaultFormatOptions(num, options) {
  var defaultOptions = Object.assign({
    maximumFractionDigits: 2
  }, options);
  if (typeof num !== "string") {
    return defaultOptions;
  }
  // Keep decimal trailing zeros if they are present in a string numeric value
  if (!options || options.minimumFractionDigits === undefined && options.maximumFractionDigits === undefined) {
    var digits = num.indexOf(".") > -1 ? num.split(".")[1].length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }
  return defaultOptions;
};

/**
 * A `StructFailure` represents a single specific failure in validation.
 */
/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */
var StructError = /*#__PURE__*/function (_TypeError) {
  function StructError(failure, failures) {
    var _this9;
    _classCallCheck(this, StructError);
    var cached;
    var message = failure.message,
      explanation = failure.explanation,
      rest = _objectWithoutProperties(failure, _excluded);
    var path = failure.path;
    var msg = path.length === 0 ? message : "At path: ".concat(path.join('.'), " -- ").concat(message);
    _this9 = _callSuper(this, StructError, [explanation !== null && explanation !== void 0 ? explanation : msg]);
    if (explanation != null) _this9.cause = msg;
    Object.assign(_this9, rest);
    _this9.name = _this9.constructor.name;
    _this9.failures = function () {
      return cached !== null && cached !== void 0 ? cached : cached = [failure].concat(_toConsumableArray(failures()));
    };
    return _this9;
  }
  _inherits(StructError, _TypeError);
  return _createClass(StructError);
}(/*#__PURE__*/_wrapNativeSuper(TypeError));
/**
 * Check if a value is an iterator.
 */
function isIterable(x) {
  return isObject(x) && typeof x[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 */
function isObject(x) {
  return _typeof2(x) === 'object' && x != null;
}
/**
 * Check if a value is a non-array object.
 */
function isNonArrayObject(x) {
  return isObject(x) && !Array.isArray(x);
}
/**
 * Return a value as a printable string.
 */
function print(value) {
  if (_typeof2(value) === 'symbol') {
    return value.toString();
  }
  return typeof value === 'string' ? JSON.stringify(value) : "".concat(value);
}
/**
 * Shifts (removes and returns) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 */
function shiftIterator(input) {
  var _input$next = input.next(),
    done = _input$next.done,
    value = _input$next.value;
  return done ? undefined : value;
}
/**
 * Convert a single validation result to a failure.
 */
function toFailure(result, context, struct, value) {
  if (result === true) {
    return;
  } else if (result === false) {
    result = {};
  } else if (typeof result === 'string') {
    result = {
      message: result
    };
  }
  var path = context.path,
    branch = context.branch;
  var type = struct.type;
  var _result = result,
    refinement = _result.refinement,
    _result$message = _result.message,
    message = _result$message === void 0 ? "Expected a value of type `".concat(type, "`").concat(refinement ? " with refinement `".concat(refinement, "`") : '', ", but received: `").concat(print(value), "`") : _result$message;
  return _objectSpread(_objectSpread({
    value: value,
    type: type,
    refinement: refinement,
    key: path[path.length - 1],
    path: path,
    branch: branch
  }, result), {}, {
    message: message
  });
}
/**
 * Convert a validation result to an iterable of failures.
 */
function toFailures(result, context, struct, value) {
  var _iterator12, _step12, _r3, failure;
  return _regeneratorRuntime().wrap(function toFailures$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        if (!isIterable(result)) {
          result = [result];
        }
        _iterator12 = _createForOfIteratorHelper(result);
        _context2.prev = 2;
        _iterator12.s();
      case 4:
        if ((_step12 = _iterator12.n()).done) {
          _context2.next = 12;
          break;
        }
        _r3 = _step12.value;
        failure = toFailure(_r3, context, struct, value);
        if (!failure) {
          _context2.next = 10;
          break;
        }
        _context2.next = 10;
        return failure;
      case 10:
        _context2.next = 4;
        break;
      case 12:
        _context2.next = 17;
        break;
      case 14:
        _context2.prev = 14;
        _context2.t0 = _context2["catch"](2);
        _iterator12.e(_context2.t0);
      case 17:
        _context2.prev = 17;
        _iterator12.f();
        return _context2.finish(17);
      case 20:
      case "end":
        return _context2.stop();
    }
  }, _marked, null, [[2, 14, 17, 20]]);
}
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 */
function run(value, struct) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _options$path, path, _options$branch, branch, _options$coerce, coerce, _options$mask, mask, ctx, status, _iterator13, _step13, _failure, _iterator14, _step14, _step14$value, _k5, _v, _s11, ts, _iterator16, _step16, _t15, _iterator15, _step15, failure;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _options$path = options.path, path = _options$path === void 0 ? [] : _options$path, _options$branch = options.branch, branch = _options$branch === void 0 ? [value] : _options$branch, _options$coerce = options.coerce, coerce = _options$coerce === void 0 ? false : _options$coerce, _options$mask = options.mask, mask = _options$mask === void 0 ? false : _options$mask;
          ctx = {
            path: path,
            branch: branch,
            mask: mask
          };
          if (coerce) {
            value = struct.coercer(value, ctx);
          }
          status = 'valid';
          _iterator13 = _createForOfIteratorHelper(struct.validator(value, ctx));
          _context3.prev = 5;
          _iterator13.s();
        case 7:
          if ((_step13 = _iterator13.n()).done) {
            _context3.next = 15;
            break;
          }
          _failure = _step13.value;
          _failure.explanation = options.message;
          status = 'not_valid';
          _context3.next = 13;
          return [_failure, undefined];
        case 13:
          _context3.next = 7;
          break;
        case 15:
          _context3.next = 20;
          break;
        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](5);
          _iterator13.e(_context3.t0);
        case 20:
          _context3.prev = 20;
          _iterator13.f();
          return _context3.finish(20);
        case 23:
          _iterator14 = _createForOfIteratorHelper(struct.entries(value, ctx));
          _context3.prev = 24;
          _iterator14.s();
        case 26:
          if ((_step14 = _iterator14.n()).done) {
            _context3.next = 53;
            break;
          }
          _step14$value = _slicedToArray(_step14.value, 3), _k5 = _step14$value[0], _v = _step14$value[1], _s11 = _step14$value[2];
          ts = run(_v, _s11, {
            path: _k5 === undefined ? path : [].concat(_toConsumableArray(path), [_k5]),
            branch: _k5 === undefined ? branch : [].concat(_toConsumableArray(branch), [_v]),
            coerce: coerce,
            mask: mask,
            message: options.message
          });
          _iterator16 = _createForOfIteratorHelper(ts);
          _context3.prev = 30;
          _iterator16.s();
        case 32:
          if ((_step16 = _iterator16.n()).done) {
            _context3.next = 43;
            break;
          }
          _t15 = _step16.value;
          if (!_t15[0]) {
            _context3.next = 40;
            break;
          }
          status = _t15[0].refinement != null ? 'not_refined' : 'not_valid';
          _context3.next = 38;
          return [_t15[0], undefined];
        case 38:
          _context3.next = 41;
          break;
        case 40:
          if (coerce) {
            _v = _t15[1];
            if (_k5 === undefined) {
              value = _v;
            } else if (value instanceof Map) {
              value.set(_k5, _v);
            } else if (value instanceof Set) {
              value.add(_v);
            } else if (isObject(value)) {
              if (_v !== undefined || _k5 in value) value[_k5] = _v;
            }
          }
        case 41:
          _context3.next = 32;
          break;
        case 43:
          _context3.next = 48;
          break;
        case 45:
          _context3.prev = 45;
          _context3.t1 = _context3["catch"](30);
          _iterator16.e(_context3.t1);
        case 48:
          _context3.prev = 48;
          _iterator16.f();
          return _context3.finish(48);
        case 51:
          _context3.next = 26;
          break;
        case 53:
          _context3.next = 58;
          break;
        case 55:
          _context3.prev = 55;
          _context3.t2 = _context3["catch"](24);
          _iterator14.e(_context3.t2);
        case 58:
          _context3.prev = 58;
          _iterator14.f();
          return _context3.finish(58);
        case 61:
          if (!(status !== 'not_valid')) {
            _context3.next = 81;
            break;
          }
          _iterator15 = _createForOfIteratorHelper(struct.refiner(value, ctx));
          _context3.prev = 63;
          _iterator15.s();
        case 65:
          if ((_step15 = _iterator15.n()).done) {
            _context3.next = 73;
            break;
          }
          failure = _step15.value;
          failure.explanation = options.message;
          status = 'not_refined';
          _context3.next = 71;
          return [failure, undefined];
        case 71:
          _context3.next = 65;
          break;
        case 73:
          _context3.next = 78;
          break;
        case 75:
          _context3.prev = 75;
          _context3.t3 = _context3["catch"](63);
          _iterator15.e(_context3.t3);
        case 78:
          _context3.prev = 78;
          _iterator15.f();
          return _context3.finish(78);
        case 81:
          if (!(status === 'valid')) {
            _context3.next = 84;
            break;
          }
          _context3.next = 84;
          return [undefined, value];
        case 84:
        case "end":
          return _context3.stop();
      }
    }, _callee2, null, [[5, 17, 20, 23], [24, 55, 58, 61], [30, 45, 48, 51], [63, 75, 78, 81]]);
  })();
}

/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */
var Struct = /*#__PURE__*/function () {
  function Struct(props) {
    var _this0 = this;
    _classCallCheck(this, Struct);
    var type = props.type,
      schema = props.schema,
      validator = props.validator,
      refiner = props.refiner,
      _props$coercer = props.coercer,
      coercer = _props$coercer === void 0 ? function (value) {
        return value;
      } : _props$coercer,
      _props$entries = props.entries,
      entries = _props$entries === void 0 ? /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
            case "end":
              return _context4.stop();
          }
        }, _callee3);
      }) : _props$entries;
    this.type = type;
    this.schema = schema;
    this.entries = entries;
    this.coercer = coercer;
    if (validator) {
      this.validator = function (value, context) {
        var result = validator(value, context);
        return toFailures(result, context, _this0, value);
      };
    } else {
      this.validator = function () {
        return [];
      };
    }
    if (refiner) {
      this.refiner = function (value, context) {
        var result = refiner(value, context);
        return toFailures(result, context, _this0, value);
      };
    } else {
      this.refiner = function () {
        return [];
      };
    }
  }
  /**
   * Assert that a value passes the struct's validation, throwing if it doesn't.
   */
  return _createClass(Struct, [{
    key: "assert",
    value: function assert(value, message) {
      return _assert(value, this, message);
    }
    /**
     * Create a value with the struct's coercion logic, then validate it.
     */
  }, {
    key: "create",
    value: function create(value, message) {
      return _create(value, this, message);
    }
    /**
     * Check if a value passes the struct's validation.
     */
  }, {
    key: "is",
    value: function is(value) {
      return _is(value, this);
    }
    /**
     * Mask a value, coercing and validating it, but returning only the subset of
     * properties defined by the struct's schema. Masking applies recursively to
     * props of `object` structs only.
     */
  }, {
    key: "mask",
    value: function mask(value, message) {
      return _mask(value, this, message);
    }
    /**
     * Validate a value with the struct's validation logic, returning a tuple
     * representing the result.
     *
     * You may optionally pass `true` for the `coerce` argument to coerce
     * the value before attempting to validate it. If you do, the result will
     * contain the coerced result when successful. Also, `mask` will turn on
     * masking of the unknown `object` props recursively if passed.
     */
  }, {
    key: "validate",
    value: function validate(value) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _validate(value, this, options);
    }
  }]);
}();
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 */
function _assert(value, struct, message) {
  var result = _validate(value, struct, {
    message: message
  });
  if (result[0]) {
    throw result[0];
  }
}
/**
 * Create a value with the coercion logic of struct and validate it.
 */
function _create(value, struct, message) {
  var result = _validate(value, struct, {
    coerce: true,
    message: message
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 */
function _mask(value, struct, message) {
  var result = _validate(value, struct, {
    coerce: true,
    mask: true,
    message: message
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
}
/**
 * Check if a value passes a struct.
 */
function _is(value, struct) {
  var result = _validate(value, struct);
  return !result[0];
}
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 */
function _validate(value, struct) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var tuples = run(value, struct, options);
  var tuple = shiftIterator(tuples);
  if (tuple[0]) {
    var _error2 = new StructError(tuple[0], /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var _iterator17, _step17, _t16;
      return _regeneratorRuntime().wrap(function _callee4$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _iterator17 = _createForOfIteratorHelper(tuples);
            _context5.prev = 1;
            _iterator17.s();
          case 3:
            if ((_step17 = _iterator17.n()).done) {
              _context5.next = 10;
              break;
            }
            _t16 = _step17.value;
            if (!_t16[0]) {
              _context5.next = 8;
              break;
            }
            _context5.next = 8;
            return _t16[0];
          case 8:
            _context5.next = 3;
            break;
          case 10:
            _context5.next = 15;
            break;
          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](1);
            _iterator17.e(_context5.t0);
          case 15:
            _context5.prev = 15;
            _iterator17.f();
            return _context5.finish(15);
          case 18:
          case "end":
            return _context5.stop();
        }
      }, _callee4, null, [[1, 12, 15, 18]]);
    }));
    return [_error2, undefined];
  } else {
    var _v2 = tuple[1];
    return [undefined, _v2];
  }
}
function assign() {
  for (var _len4 = arguments.length, Structs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    Structs[_key4] = arguments[_key4];
  }
  var isType = Structs[0].type === 'type';
  var schemas = Structs.map(function (s) {
    return s.schema;
  });
  var schema = Object.assign.apply(Object, [{}].concat(_toConsumableArray(schemas)));
  return isType ? type(schema) : object(schema);
}
/**
 * Define a new struct type with a custom validation function.
 */
function define(name, validator) {
  return new Struct({
    type: name,
    schema: null,
    validator: validator
  });
}
/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 */
function dynamic(fn) {
  return new Struct({
    type: 'dynamic',
    schema: null,
    entries: /*#__PURE__*/_regeneratorRuntime().mark(function entries(value, ctx) {
      var struct;
      return _regeneratorRuntime().wrap(function entries$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            struct = fn(value, ctx);
            return _context6.delegateYield(struct.entries(value, ctx), "t0", 2);
          case 2:
          case "end":
            return _context6.stop();
        }
      }, entries);
    }),
    validator: function validator(value, ctx) {
      var struct = fn(value, ctx);
      return struct.validator(value, ctx);
    },
    coercer: function coercer(value, ctx) {
      var struct = fn(value, ctx);
      return struct.coercer(value, ctx);
    },
    refiner: function refiner(value, ctx) {
      var struct = fn(value, ctx);
      return struct.refiner(value, ctx);
    }
  });
}

/**
 * Ensure that any value passes validation.
 */
function any() {
  return define('any', function () {
    return true;
  });
}
function array(Element) {
  return new Struct({
    type: 'array',
    schema: Element,
    entries: /*#__PURE__*/_regeneratorRuntime().mark(function entries(value) {
      var _iterator18, _step18, _step18$value, _i12, _v3;
      return _regeneratorRuntime().wrap(function entries$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (!(Element && Array.isArray(value))) {
              _context7.next = 18;
              break;
            }
            _iterator18 = _createForOfIteratorHelper(value.entries());
            _context7.prev = 2;
            _iterator18.s();
          case 4:
            if ((_step18 = _iterator18.n()).done) {
              _context7.next = 10;
              break;
            }
            _step18$value = _slicedToArray(_step18.value, 2), _i12 = _step18$value[0], _v3 = _step18$value[1];
            _context7.next = 8;
            return [_i12, _v3, Element];
          case 8:
            _context7.next = 4;
            break;
          case 10:
            _context7.next = 15;
            break;
          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7["catch"](2);
            _iterator18.e(_context7.t0);
          case 15:
            _context7.prev = 15;
            _iterator18.f();
            return _context7.finish(15);
          case 18:
          case "end":
            return _context7.stop();
        }
      }, entries, null, [[2, 12, 15, 18]]);
    }),
    coercer: function coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },
    validator: function validator(value) {
      return Array.isArray(value) || "Expected an array value, but received: ".concat(print(value));
    }
  });
}
/**
 * Ensure that a value is a boolean.
 */
function boolean() {
  return define('boolean', function (value) {
    return typeof value === 'boolean';
  });
}
function enums(values) {
  var schema = {};
  var description = values.map(function (v) {
    return print(v);
  }).join();
  var _iterator19 = _createForOfIteratorHelper(values),
    _step19;
  try {
    for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
      var key = _step19.value;
      schema[key] = key;
    }
  } catch (err) {
    _iterator19.e(err);
  } finally {
    _iterator19.f();
  }
  return new Struct({
    type: 'enums',
    schema: schema,
    validator: function validator(value) {
      return values.includes(value) || "Expected one of `".concat(description, "`, but received: ").concat(print(value));
    }
  });
}
function literal(constant) {
  var description = print(constant);
  var t = _typeof2(constant);
  return new Struct({
    type: 'literal',
    schema: t === 'string' || t === 'number' || t === 'boolean' ? constant : null,
    validator: function validator(value) {
      return value === constant || "Expected the literal `".concat(description, "`, but received: ").concat(print(value));
    }
  });
}
/**
 * Ensure that no value ever passes validation.
 */
function never() {
  return define('never', function () {
    return false;
  });
}
/**
 * Ensure that a value is a number.
 */
function number() {
  return define('number', function (value) {
    return typeof value === 'number' && !isNaN(value) || "Expected a number, but received: ".concat(print(value));
  });
}
function object(schema) {
  var knowns = schema ? Object.keys(schema) : [];
  var Never = never();
  return new Struct({
    type: 'object',
    schema: schema ? schema : null,
    entries: /*#__PURE__*/_regeneratorRuntime().mark(function entries(value) {
      var unknowns, _iterator20, _step20, key, _iterator21, _step21, _key5;
      return _regeneratorRuntime().wrap(function entries$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (!(schema && isObject(value))) {
              _context8.next = 37;
              break;
            }
            unknowns = new Set(Object.keys(value));
            _iterator20 = _createForOfIteratorHelper(knowns);
            _context8.prev = 3;
            _iterator20.s();
          case 5:
            if ((_step20 = _iterator20.n()).done) {
              _context8.next = 12;
              break;
            }
            key = _step20.value;
            unknowns.delete(key);
            _context8.next = 10;
            return [key, value[key], schema[key]];
          case 10:
            _context8.next = 5;
            break;
          case 12:
            _context8.next = 17;
            break;
          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8["catch"](3);
            _iterator20.e(_context8.t0);
          case 17:
            _context8.prev = 17;
            _iterator20.f();
            return _context8.finish(17);
          case 20:
            _iterator21 = _createForOfIteratorHelper(unknowns);
            _context8.prev = 21;
            _iterator21.s();
          case 23:
            if ((_step21 = _iterator21.n()).done) {
              _context8.next = 29;
              break;
            }
            _key5 = _step21.value;
            _context8.next = 27;
            return [_key5, value[_key5], Never];
          case 27:
            _context8.next = 23;
            break;
          case 29:
            _context8.next = 34;
            break;
          case 31:
            _context8.prev = 31;
            _context8.t1 = _context8["catch"](21);
            _iterator21.e(_context8.t1);
          case 34:
            _context8.prev = 34;
            _iterator21.f();
            return _context8.finish(34);
          case 37:
          case "end":
            return _context8.stop();
        }
      }, entries, null, [[3, 14, 17, 20], [21, 31, 34, 37]]);
    }),
    validator: function validator(value) {
      return isNonArrayObject(value) || "Expected an object, but received: ".concat(print(value));
    },
    coercer: function coercer(value, ctx) {
      if (!isNonArrayObject(value)) {
        return value;
      }
      var coerced = _objectSpread({}, value);
      // The `object` struct has special behaviour enabled by the mask flag.
      // When masking, properties that are not in the schema are deleted from
      // the coerced object instead of eventually failing validaiton.
      if (ctx.mask && schema) {
        for (var key in coerced) {
          if (schema[key] === undefined) {
            delete coerced[key];
          }
        }
      }
      return coerced;
    }
  });
}
/**
 * Augment a struct to allow `undefined` values.
 */
function optional(struct) {
  return new Struct(_objectSpread(_objectSpread({}, struct), {}, {
    validator: function validator(value, ctx) {
      return value === undefined || struct.validator(value, ctx);
    },
    refiner: function refiner(value, ctx) {
      return value === undefined || struct.refiner(value, ctx);
    }
  }));
}
/**
 * Ensure that a value is a string.
 */
function string() {
  return define('string', function (value) {
    return typeof value === 'string' || "Expected a string, but received: ".concat(print(value));
  });
}
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 */
function type(schema) {
  var keys = Object.keys(schema);
  return new Struct({
    type: 'type',
    schema: schema,
    entries: /*#__PURE__*/_regeneratorRuntime().mark(function entries(value) {
      var _i13, _keys, _k6;
      return _regeneratorRuntime().wrap(function entries$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            if (!isObject(value)) {
              _context9.next = 9;
              break;
            }
            _i13 = 0, _keys = keys;
          case 2:
            if (!(_i13 < _keys.length)) {
              _context9.next = 9;
              break;
            }
            _k6 = _keys[_i13];
            _context9.next = 6;
            return [_k6, value[_k6], schema[_k6]];
          case 6:
            _i13++;
            _context9.next = 2;
            break;
          case 9:
          case "end":
            return _context9.stop();
        }
      }, entries);
    }),
    validator: function validator(value) {
      return isNonArrayObject(value) || "Expected an object, but received: ".concat(print(value));
    },
    coercer: function coercer(value) {
      return isNonArrayObject(value) ? _objectSpread({}, value) : value;
    }
  });
}
/**
 * Ensure that a value matches one of a set of types.
 */
function union(Structs) {
  var description = Structs.map(function (s) {
    return s.type;
  }).join(' | ');
  return new Struct({
    type: 'union',
    schema: null,
    coercer: function coercer(value, ctx) {
      var _iterator22 = _createForOfIteratorHelper(Structs),
        _step22;
      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var _S2 = _step22.value;
          var _S2$validate = _S2.validate(value, {
              coerce: true,
              mask: ctx.mask
            }),
            _S2$validate2 = _slicedToArray(_S2$validate, 2),
            _error3 = _S2$validate2[0],
            coerced = _S2$validate2[1];
          if (!_error3) {
            return coerced;
          }
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
      return value;
    },
    validator: function validator(value, ctx) {
      var failures = [];
      var _iterator23 = _createForOfIteratorHelper(Structs),
        _step23;
      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var _S3 = _step23.value;
          var _run = run(value, _S3, ctx),
            _run2 = _toArray(_run),
            tuples = _run2.slice(0);
          var _tuples = _slicedToArray(tuples, 1),
            first = _tuples[0];
          if (!first[0]) {
            return [];
          } else {
            var _iterator24 = _createForOfIteratorHelper(tuples),
              _step24;
            try {
              for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                var _step24$value = _slicedToArray(_step24.value, 1),
                  failure = _step24$value[0];
                if (failure) {
                  failures.push(failure);
                }
              }
            } catch (err) {
              _iterator24.e(err);
            } finally {
              _iterator24.f();
            }
          }
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
      return ["Expected the value to satisfy a union of `".concat(description, "`, but received: ").concat(print(value))].concat(failures);
    }
  });
}
var afterNextRender = function afterNextRender(cb) {
  requestAnimationFrame(function () {
    return setTimeout(cb, 0);
  });
};
var subscribeRenderTemplate = function subscribeRenderTemplate(conn, onChange, params) {
  return conn.subscribeMessage(function (msg) {
    return onChange(msg);
  }, Object.assign({
    type: "render_template"
  }, params));
};
var getActionHandler = function getActionHandler() {
  var body = document.body;
  if (body.querySelector("action-handler")) {
    return body.querySelector("action-handler");
  }
  var actionhandler = document.createElement("action-handler");
  body.appendChild(actionhandler);
  return actionhandler;
};
var actionHandlerBind = function actionHandlerBind(element, options) {
  var actionhandler = getActionHandler();
  if (!actionhandler) {
    return;
  }
  actionhandler.bind(element, options);
};
var actionHandler = e(/*#__PURE__*/function (_i$2) {
  function _class2() {
    _classCallCheck(this, _class2);
    return _callSuper(this, _class2, arguments);
  }
  _inherits(_class2, _i$2);
  return _createClass(_class2, [{
    key: "update",
    value: function update(part, _ref1) {
      var _ref10 = _slicedToArray(_ref1, 1),
        options = _ref10[0];
      actionHandlerBind(part.element, options);
      return T;
    }
  }, {
    key: "render",
    value: function render(_options) {}
  }]);
}(i$1));
var handleAction = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(node, _hass, config, action) {
    return _regeneratorRuntime().wrap(function _callee5$(_context0) {
      while (1) switch (_context0.prev = _context0.next) {
        case 0:
          fireEvent(node, "hass-action", {
            config: config,
            action: action
          });
        case 1:
        case "end":
          return _context0.stop();
      }
    }, _callee5);
  }));
  return function handleAction(_x3, _x4, _x5, _x6) {
    return _ref11.apply(this, arguments);
  };
}();
function hasAction(config) {
  return config !== undefined && config.action !== "none";
}
var actionConfigStructUser = object({
  user: string()
});
var actionConfigStructConfirmation = union([boolean(), object({
  text: optional(string()),
  excemptions: optional(array(actionConfigStructUser))
})]);
var actionConfigStructUrl = object({
  action: literal("url"),
  url_path: string(),
  confirmation: optional(actionConfigStructConfirmation)
});
var actionConfigStructService = object({
  action: enums(["call-service", "perform-action"]),
  service: optional(string()),
  perform_action: optional(string()),
  service_data: optional(object()),
  data: optional(object()),
  target: optional(object({
    entity_id: optional(union([string(), array(string())])),
    device_id: optional(union([string(), array(string())])),
    area_id: optional(union([string(), array(string())])),
    floor_id: optional(union([string(), array(string())])),
    label_id: optional(union([string(), array(string())]))
  })),
  confirmation: optional(actionConfigStructConfirmation)
});
var actionConfigStructNavigate = object({
  action: literal("navigate"),
  navigation_path: string(),
  confirmation: optional(actionConfigStructConfirmation)
});
var actionConfigStructAssist = type({
  action: literal("assist"),
  pipeline_id: optional(string()),
  start_listening: optional(boolean())
});
var actionConfigStructCustom = type({
  action: literal("fire-dom-event")
});
var actionConfigStructType = object({
  action: enums(["none", "toggle", "more-info", "call-service", "perform-action", "url", "navigate", "assist"]),
  confirmation: optional(actionConfigStructConfirmation)
});
var actionConfigStruct = dynamic(function (value) {
  if (value && _typeof2(value) === "object" && "action" in value) {
    switch (value.action) {
      case "call-service":
        {
          return actionConfigStructService;
        }
      case "perform-action":
        {
          return actionConfigStructService;
        }
      case "fire-dom-event":
        {
          return actionConfigStructCustom;
        }
      case "navigate":
        {
          return actionConfigStructNavigate;
        }
      case "url":
        {
          return actionConfigStructUrl;
        }
      case "assist":
        {
          return actionConfigStructAssist;
        }
    }
  }
  return actionConfigStructType;
});
var baseLovelaceCardConfig = object({
  type: string(),
  view_layout: any(),
  layout_options: any(),
  grid_options: any(),
  visibility: any()
});
i$5(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  #sortable a:nth-of-type(2n) paper-icon-item {\n    animation-name: keyframes1;\n    animation-iteration-count: infinite;\n    transform-origin: 50% 10%;\n    animation-delay: -0.75s;\n    animation-duration: 0.25s;\n  }\n\n  #sortable a:nth-of-type(2n-1) paper-icon-item {\n    animation-name: keyframes2;\n    animation-iteration-count: infinite;\n    animation-direction: alternate;\n    transform-origin: 30% 5%;\n    animation-delay: -0.5s;\n    animation-duration: 0.33s;\n  }\n\n  #sortable a {\n    height: 48px;\n    display: flex;\n  }\n\n  #sortable {\n    outline: none;\n    display: block !important;\n  }\n\n  .hidden-panel {\n    display: flex !important;\n  }\n\n  .sortable-fallback {\n    display: none;\n  }\n\n  .sortable-ghost {\n    opacity: 0.4;\n  }\n\n  .sortable-fallback {\n    opacity: 0;\n  }\n\n  @keyframes keyframes1 {\n    0% {\n      transform: rotate(-1deg);\n      animation-timing-function: ease-in;\n    }\n\n    50% {\n      transform: rotate(1.5deg);\n      animation-timing-function: ease-out;\n    }\n  }\n\n  @keyframes keyframes2 {\n    0% {\n      transform: rotate(1deg);\n      animation-timing-function: ease-in;\n    }\n\n    50% {\n      transform: rotate(-1.5deg);\n      animation-timing-function: ease-out;\n    }\n  }\n\n  .show-panel,\n  .hide-panel {\n    display: none;\n    position: absolute;\n    top: 0;\n    right: 4px;\n    --mdc-icon-button-size: 40px;\n  }\n\n  :host([rtl]) .show-panel {\n    right: initial;\n    left: 4px;\n  }\n\n  .hide-panel {\n    top: 4px;\n    right: 8px;\n  }\n\n  :host([rtl]) .hide-panel {\n    right: initial;\n    left: 8px;\n  }\n\n  :host([expanded]) .hide-panel {\n    display: block;\n  }\n\n  :host([expanded]) .show-panel {\n    display: inline-flex;\n  }\n\n  paper-icon-item.hidden-panel,\n  paper-icon-item.hidden-panel span,\n  paper-icon-item.hidden-panel ha-icon[slot=\"item-icon\"] {\n    color: var(--secondary-text-color);\n    cursor: pointer;\n  }\n"])));
var normalize = function normalize(value, min, max) {
  if (isNaN(value) || isNaN(min) || isNaN(max)) {
    // Not a number, return 0
    return 0;
  }
  if (value > max) return max;
  if (value < min) return min;
  return value;
};
var getValueInPercentage = function getValueInPercentage(value, min, max) {
  var newMax = max - min;
  var newVal = value - min;
  return 100 * newVal / newMax;
};

/**
 * Resolves a CSS custom-property reference to its computed value on <body>,
 * or returns the original input if it’s not a valid CSS variable.
 *
 * @param color - Either:
 *   • A CSS custom-property reference in the form `"var(--some-color)"`,
 *   • Any other string (e.g. `"#ff0000"`, `"red"`, `"rgb(255,0,0)"`),
 *   • Or a non-string value (which is returned unchanged).
 * @returns The resolved CSS value of the custom property (e.g. `"#ff0000"`),
 *          or the original input if it wasn’t a valid `var(...)` reference.
 */
function getComputedColor(color) {
  if (typeof color !== "string") return color;
  if (!(color.startsWith("var(") && color.endsWith(")"))) return color;
  return window.getComputedStyle(document.body).getPropertyValue(color.slice(4, -1));
}
var version = "1.0.0-rc1-dev";
var repository = {
  url: "https://github.com/benjamin-dcs/gauge-card-pro"
};
var VERSION = version;
var CARD_NAME = "gauge-card-pro";
var EDITOR_NAME = "".concat(CARD_NAME, "-editor");
getComputedColor("var(--error-color)") || "#db4437";
getComputedColor("var(--success-color") || "#43a047";
getComputedColor("var(--warning-color") || "#ffa600";
var INFO_COLOR = getComputedColor("var(--info-color)") || "#039be5";
// config defaults
var DEFAULT_GRADIENT_RESOLUTION = "low";
var DEFAULT_INNER_MODE = "severity";
var DEFAULT_MIN = 0;
var DEFAULT_MAX = 100;
var DEFAULT_NEEDLE_COLOR = "var(--primary-text-color)";
var DEFAULT_SETPOINT_NEELDLE_COLOR = "var(--error-color)";
var DEFAULT_SEVERITY_COLOR = INFO_COLOR;
var DEFAULT_TITLE_COLOR = "var(--primary-text-color)";
var DEFAULT_TITLE_FONT_SIZE_PRIMARY = "15px";
var DEFAULT_TITLE_FONT_SIZE_SECONDARY = "14px";
var DEFAULT_VALUE_TEXT_COLOR = "var(--primary-text-color)";
var GRADIENT_RESOLUTION_MAP = {
  low: {
    segments: 50,
    samples: 1
  },
  medium: {
    segments: 100,
    samples: 1
  },
  high: {
    segments: 200,
    samples: 1
  }
};
var MAIN_GAUGE_NEEDLE = "M -28 0 L -27.5 -2 L -47.5 0 L -27.5 2.25 z";
var MAIN_GAUGE_NEEDLE_WITH_INNER = "M -49 -2 L -40 0 L -49 2 z";
var MAIN_GAUGE_SETPOINT_NEEDLE = "M -49 -1 L -42 0 L -49 1 z";
var INNER_GAUGE_NEEDLE = "M -27.5 -1.5 L -32 0 L -27.5 1.5 z";
/**
 * Logging-related constants
 */
var LOGGING = {
  /**
   * Current log level
   * 0 = ERROR, 1 = WARN, 2 = INFO, 3 = DEBUG
   */
  CURRENT_LOG_LEVEL: 3,
  /** Standard prefix for log messages */
  PREFIX: "🌈 Gauge Card Pro"
};

/* eslint-disable import/order */
/**
 * Logging utilities for Calendar Card Pro
 * Provides consistent log formatting, level-based filtering, and error handling
 */
// Add a flag to ensure the banner only shows once per session
var BANNER_SHOWN = false;
// Different log levels - keeping enum in logger-utils.ts
var LogLevel;
(function (LogLevel) {
  LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
  LogLevel[LogLevel["WARN"] = 1] = "WARN";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
// Use the constant from constants.ts as the default value
var currentLogLevel = LOGGING.CURRENT_LOG_LEVEL;
// Styling for log messages - keeping in logger-utils.ts
var LOG_STYLES = {
  // Title pill (left side - dark grey with emoji)
  title: ["background: #424242", "color: white", "display: inline-block", "line-height: 20px", "text-align: center", "border-radius: 5px 0 0 5px", "font-size: 12px", "font-weight: bold", "padding: 4px 8px 4px 12px", "margin: 5px 0"].join(";"),
  // Version pill (right side - pale blue)
  version: ["background: #4fc3f7", "color: white", "display: inline-block", "line-height: 20px", "text-align: center", "border-radius: 0 5px 5px 0", "font-size: 12px", "font-weight: bold", "padding: 4px 12px 4px 8px", "margin: 5px 0"].join(";"),
  // Error styling
  error: ["color: #f44336", "font-weight: bold"].join(";")
};
//-----------------------------------------------------------------------------
// INITIALIZATION FUNCTIONS
//-----------------------------------------------------------------------------
/**
 * Initialize the logger with the component version
 * @param version Current component version
 */
function initializeLogger(version) {
  // Show version banner (always show this regardless of log level)
  printVersionBanner(version);
}
/**
 * Print the welcome banner with version info
 * @param version Component version
 */
function printVersionBanner(version) {
  // Only show banner once per browser session
  if (BANNER_SHOWN) return;
  console.groupCollapsed("%c".concat(LOGGING.PREFIX, "%cv").concat(version, " "), LOG_STYLES.title, LOG_STYLES.version);
  console.log("%c Description: %c Build beautiful Gauge cards using 🌈 gradients and 🛠️ templates.  ", "font-weight: bold", "font-weight: normal");
  console.log("%c GitHub: %c https://github.com/benjamin-dcs/gauge-card-pro ", "font-weight: bold", "font-weight: normal");
  console.groupEnd();
  // Mark banner as shown
  BANNER_SHOWN = true;
}
//-----------------------------------------------------------------------------
// PRIMARY PUBLIC API FUNCTIONS
//-----------------------------------------------------------------------------
/**
 * Enhanced error logging that handles different error types and contexts
 * Consolidates error, logError and handleApiError into a single flexible function
 *
 * @param messageOrError - Error object, message string, or other value
 * @param context - Optional context (string, object, or unknown)
 * @param data - Additional data to include in the log
 */
function error(messageOrError, context) {
  if (currentLogLevel < LogLevel.ERROR) return;
  // Convert unknown context to a safe format
  var safeContext = formatUnknownContext(context);
  // Process based on error type and context type
  for (var _len5 = arguments.length, data = new Array(_len5 > 2 ? _len5 - 2 : 0), _key6 = 2; _key6 < _len5; _key6++) {
    data[_key6 - 2] = arguments[_key6];
  }
  if (messageOrError instanceof Error) {
    // Case 1: Error object
    var errorMessage = messageOrError.message || "Unknown error";
    var contextInfo = typeof safeContext === "string" ? " during ".concat(safeContext) : "";
    var _formatLogMessage = formatLogMessage("Error".concat(contextInfo, ": ").concat(errorMessage), LOG_STYLES.error),
      _formatLogMessage2 = _slicedToArray(_formatLogMessage, 2),
      formattedMsg = _formatLogMessage2[0],
      style = _formatLogMessage2[1];
    console.error(formattedMsg, style);
    // Always log stack trace for Error objects
    if (messageOrError.stack) {
      console.error(messageOrError.stack);
    }
    // Add context object if provided
    if (safeContext && _typeof2(safeContext) === "object") {
      console.error("Context:", Object.assign(Object.assign({}, safeContext), {
        timestamp: new Date().toISOString()
      }));
    }
    // Include any additional data
    if (data.length > 0) {
      var _console;
      (_console = console).error.apply(_console, ["Additional data:"].concat(data));
    }
  } else if (typeof messageOrError === "string") {
    // Case 2: String message
    var _contextInfo = typeof safeContext === "string" ? " during ".concat(safeContext) : "";
    var _formatLogMessage3 = formatLogMessage("".concat(messageOrError).concat(_contextInfo), LOG_STYLES.error),
      _formatLogMessage4 = _slicedToArray(_formatLogMessage3, 2),
      _formattedMsg = _formatLogMessage4[0],
      _style = _formatLogMessage4[1];
    if (safeContext && _typeof2(safeContext) === "object") {
      // If context is an object, include it in the log
      console.error(_formattedMsg, _style, Object.assign({
        context: Object.assign(Object.assign({}, safeContext), {
          timestamp: new Date().toISOString()
        })
      }, data.length > 0 ? {
        additionalData: data
      } : {}));
    } else if (data.length > 0) {
      var _console2;
      // Just include additional data
      (_console2 = console).error.apply(_console2, [_formattedMsg, _style].concat(data));
    } else {
      // Simple error message
      console.error(_formattedMsg, _style);
    }
  } else {
    // Case 3: Unknown error type
    var _contextInfo2 = typeof safeContext === "string" ? " during ".concat(safeContext) : "";
    var _formatLogMessage5 = formatLogMessage("Unknown error".concat(_contextInfo2, ":"), LOG_STYLES.error),
      _formatLogMessage6 = _slicedToArray(_formatLogMessage5, 2),
      _formattedMsg2 = _formatLogMessage6[0],
      _style2 = _formatLogMessage6[1];
    console.error(_formattedMsg2, _style2, messageOrError);
    // Add context object if provided
    if (safeContext && _typeof2(safeContext) === "object") {
      console.error("Context:", Object.assign(Object.assign({}, safeContext), {
        timestamp: new Date().toISOString()
      }));
    }
    // Include any additional data
    if (data.length > 0) {
      var _console3;
      (_console3 = console).error.apply(_console3, ["Additional data:"].concat(data));
    }
  }
}
/**
 * Format a log message with consistent prefix and styling
 * @param message The message to format
 * @param style The style to apply
 * @returns Tuple of [formattedMessage, style] for console methods
 */
function formatLogMessage(message, style) {
  return ["%c[".concat(LOGGING.PREFIX, "] ").concat(message), style];
}
/**
 * Process unknown context into a usable format for logging
 * @param context - Any context value that might be provided
 * @returns A string, object, or undefined that can be safely used in logs
 */
function formatUnknownContext(context) {
  if (context === undefined || context === null) {
    return undefined;
  }
  if (typeof context === "string") {
    return context;
  }
  if (_typeof2(context) === "object") {
    try {
      // Try to safely convert to Record<string, unknown>
      return Object.assign({}, context);
    } catch (_a) {
      // If conversion fails, stringify it
      try {
        return {
          value: JSON.stringify(context)
        };
      } catch (_b) {
        return {
          value: String(context)
        };
      }
    }
  }
  // For primitive values, just convert to string
  return String(context);
}
object({
  tap_action: optional(actionConfigStruct),
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct)
});
var computeActionsFormSchema = function computeActionsFormSchema(actions) {
  return [{
    name: "tap_action",
    selector: {
      ui_action: {
        actions: actions
      }
    }
  }, {
    name: "hold_action",
    selector: {
      ui_action: {
        actions: actions
      }
    }
  }, {
    name: "double_tap_action",
    selector: {
      ui_action: {
        actions: actions
      }
    }
  }];
};
function computeDarkMode(hass) {
  if (!hass) return false;
  return hass.themes.darkMode;
}
var CacheManager = /*#__PURE__*/function () {
  function CacheManager(expiration) {
    _classCallCheck(this, CacheManager);
    this._cache = new Map();
    this._expiration = expiration;
  }
  return _createClass(CacheManager, [{
    key: "get",
    value: function get(key) {
      return this._cache.get(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      var _this1 = this;
      this._cache.set(key, value);
      if (this._expiration) {
        window.setTimeout(function () {
          return _this1._cache.delete(key);
        }, this._expiration);
      }
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._cache.has(key);
    }
  }]);
}();
function registerCustomCard(params) {
  var windowWithCards = window;
  windowWithCards.customCards = windowWithCards.customCards || [];
  windowWithCards.customCards.push(Object.assign(Object.assign({}, params), {
    preview: true,
    documentationURL: "".concat(repository.url, "/blob/main/README.md")
  }));
}

// Hack to load ha-components needed for editor
var loadHaComponents = function loadHaComponents() {
  var _a, _b, _c;
  if (!customElements.get("ha-form")) {
    (_a = customElements.get("hui-button-card")) === null || _a === void 0 ? void 0 : _a.getConfigElement();
  }
  if (!customElements.get("ha-entity-picker")) {
    (_b = customElements.get("hui-entities-card")) === null || _b === void 0 ? void 0 : _b.getConfigElement();
  }
  if (!customElements.get("ha-card-conditions-editor")) {
    (_c = customElements.get("hui-conditional-card")) === null || _c === void 0 ? void 0 : _c.getConfigElement();
  }
};

/**
 * Safely retrieves the value at a given dot-delimited path within an object.
 *
 * @template ObjectType
 * @param {ObjectType} object
 *   The object from which to retrieve the value.
 * @param {string} path
 *   A dot-notation string describing the nested property path
 *   (e.g. `"user.address.street"`).
 * @returns {*}
 *   The value found at the specified path, or `undefined` if:
 *   - the object is `null`/`undefined`
 *   - the path is an empty string
 *   - any intermediate property along the path does not exist.
 */
function getValueFromPath(object, path) {
  if (!object || !path) {
    return;
  }
  var keys = path.split(".");
  var result = object;
  var _iterator25 = _createForOfIteratorHelper(keys),
    _step25;
  try {
    for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
      var key = _step25.value;
      result = result === null || result === void 0 ? void 0 : result[key];
    }
  } catch (err) {
    _iterator25.e(err);
  } finally {
    _iterator25.f();
  }
  return result;
}

/**
 * Deletes a property from a nested object by following a dot-separated path.
 *
 * Given an object and a string path like `"a.b.c"`, this function will traverse
 * `obj.a.b` and attempt to delete the `c` property. If any segment of the path
 * doesn’t exist or isn’t an object, or if the final key is missing, it does nothing.
 *
 * @param {Object} obj - The object from which to delete the key.
 * @param {string} path - The dot-separated path to the key to delete (e.g. `"foo.bar.baz"`).
 * @returns {boolean} Returns `true` if the key was found and deleted; otherwise `false`.
 */
function deleteKey(obj, path) {
  var keys = path.split(".");
  var lastKey = keys.pop();
  if (!lastKey) return false;
  var current = obj;
  var _iterator26 = _createForOfIteratorHelper(keys),
    _step26;
  try {
    for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
      var key = _step26.value;
      if (_typeof2(current[key]) !== "object" || current[key] === null) {
        return false; // Path does not exist or is not an object
      }
      current = current[key];
    }
  } catch (err) {
    _iterator26.e(err);
  } finally {
    _iterator26.f();
  }
  if (current && lastKey in current) {
    delete current[lastKey];
    return true;
  }
  return false;
}

/**
 * Deep-clones the given source object and attempts to set a value at the specified
 * dot-delimited path. Returns the cloned object and whether the assignment succeeded.
 *
 * @param {T} source
 *   The original object or value to clone. This function will not mutate the input.
 * @param {string} key
 *   A dot-delimited path specifying where to set the value (e.g. `"user.profile.name"`).
 * @param {*} value
 *   The value to assign at the target path.
 * @param {boolean} [createMissingObjects=false]
 *   If `true`, any missing nested objects along the path will be created as empty objects.
 *   If `false`, the function will abort and return `success: false` if any part of the
 *   path is missing or not an object.
 * @param {boolean} [overwrite=false]
 *   If `true`, will overwrite an existing value at the target path. If `false`,
 *   and the property already exists (not `undefined`), the function will not modify it
 *   and will return `success: false`.
 *
 * @returns {{ result: T, success: boolean }}
 *   - `result`: A deep clone of `source` with the attempted assignment applied (if successful).
 *   - `success`: `true` if the value was set, `false` otherwise.
 */
function trySetValue(source, key, value) {
  var createMissingObjects = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var overwrite = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var clone = structuredClone(source); // deep clone so we don't mutate
  var keyParts = key.split(".");
  var newObj = clone;
  for (var _i14 = 0; _i14 < keyParts.length - 1; _i14++) {
    if (_typeof2(newObj[keyParts[_i14]]) !== "object" || newObj[keyParts[_i14]] === null || newObj[keyParts[_i14]] === undefined) {
      if (createMissingObjects) {
        newObj[keyParts[_i14]] = {};
      } else {
        return {
          result: clone,
          success: false
        };
      }
    }
    newObj = newObj[keyParts[_i14]];
  }
  var keyTo = keyParts[keyParts.length - 1];
  if (overwrite || newObj[keyTo] === undefined) {
    newObj[keyTo] = value;
    return {
      result: clone,
      success: true
    };
  }
  return {
    result: clone,
    success: false
  };
}

// General utilities
/**
 * Creates a deep clone of the given object and moves a property from one path to another.
 *
 * The function:
 * 1. Clones the `source` object using `structuredClone`, so the original remains unmodified.
 * 2. Reads the value at the nested path specified by `from` (dot-separated).
 * 3. If the value exists, attempts to set it at the `to` path (dot-separated),
 *    optionally allowing overwriting of existing values.
 * 4. If setting succeeds, deletes the original key at the `from` path in the clone.
 *
 * @param {any} source - The object (or value) to operate on. Can be any JSON-serializable value.
 * @param {string} from - Dot-separated path to the key in the source object to move (e.g. `"a.b.c"`).
 * @param {string} to - Dot-separated path where the key should be moved (e.g. `"x.y.z"`).
 * @param {boolean} [overwrite=false] - If `true`, existing values at the `to` path will be overwritten.
 *                                       If `false`, the move will not override existing values.
 * @returns {any} A new object (clone of `source`) with the key moved if possible; otherwise, the unchanged clone.
 */
function moveKey(source, from, to) {
  var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var clone = structuredClone(source);
  var fromParts = from.split(".");
  var fromObj = clone;
  for (var _i15 = 0; _i15 < fromParts.length - 1; _i15++) {
    fromObj = fromObj === null || fromObj === void 0 ? void 0 : fromObj[fromParts[_i15]];
    if (_typeof2(fromObj) !== "object" || fromObj === null) {
      return clone;
    }
  }
  var keyFrom = fromParts[fromParts.length - 1];
  var value = fromObj === null || fromObj === void 0 ? void 0 : fromObj[keyFrom];
  if (value === undefined) {
    return clone;
  }
  var _trySetValue = trySetValue(clone, to, value, true, overwrite),
    newClone = _trySetValue.result,
    success = _trySetValue.success;
  if (success) deleteKey(newClone, from);
  return newClone;
}

// Local utilities
function migrate_parameters(config) {
  if (config) {
    // v0.4.0
    config = moveKey(config, "gradientResolution", "gradient_resolution");
    config = moveKey(config, "name", "titles.primary");
    config = moveKey(config, "segmentsTemplate", "segments");
    config = moveKey(config, "severityTemplate", "severity");
    config = moveKey(config, "valueText", "value_text");
    // v0.8.0
    config = moveKey(config, "primary", "titles.primary");
    config = moveKey(config, "primary_color", "titles.primary_color");
    config = moveKey(config, "secondary", "titles.secondary");
    config = moveKey(config, "secondary_color", "titles.secondary_color");
    config = moveKey(config, "value_text", "value_texts.primary");
    config = moveKey(config, "value_text_color", "value_texts.primary_color");
    config = moveKey(config, "inner.value_text", "value_texts.secondary");
    config = moveKey(config, "inner.value_text_color", "value_texts.secondary_color");
    config = _moveSeverityToSegments(config);
  }
  return config;
}
function _moveSeverityToSegments(config) {
  var clone = structuredClone(config); // deep clone so we don't mutate
  if (config.severity === undefined) {
    return clone;
  }
  // templates are not converted
  if (typeof config.severity === "string") {
    return clone;
  }
  if (config.segments !== undefined) {
    return clone;
  }
  var green = config.severity.green;
  var yellow = config.severity.yellow;
  var red = config.severity.red;
  var segments = [];
  if (green !== undefined) {
    segments.push({
      from: green,
      color: "var(--success-color)"
    });
  }
  if (yellow !== undefined) {
    segments.push({
      from: yellow,
      color: "var(--warning-color)"
    });
  }
  if (red !== undefined) {
    segments.push({
      from: red,
      color: "var(--error-color)"
    });
  }
  segments.sort(function (a, b) {
    return a.from - b.from;
  });
  clone["segments"] = segments;
  delete clone.severity;
  return clone;
}
var formatEntityToLocal = function formatEntityToLocal(hass, entity) {
  if (!hass) return undefined;
  var stateObj = hass.states[entity];
  if (!stateObj || stateObj.state === "unavailable" || isNaN(Number(stateObj.state))) return "";
  var locale = hass.locale;
  var formatOptions = getNumberFormatOptions(stateObj, hass.entities[stateObj.entity_id]);
  return formatNumber(stateObj.state, locale, formatOptions);
};
var formatNumberToLocal = function formatNumberToLocal(hass, value) {
  if (!hass) return undefined;
  if (isNaN(Number(value))) return undefined;
  var locale = hass.locale;
  var formatOptions = undefined;
  return formatNumber(Number(value), locale, formatOptions);
};

/**
 * Safely converts an arbitrary value to a number, falling back to a default if conversion fails.
 *
 * @param value - The value to convert. Can be of any type.
 * @param defaultValue - The number to return if `value` cannot be converted to a valid number.
 * @returns The numeric conversion of `value`, or `defaultValue` if conversion produces NaN.
 */
function toNumberOrDefault(value, defaultValue) {
  if (value === undefined || value === null) return defaultValue;
  var num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Checks whether a given value is a valid CSS font-size.
 *
 * This function first ensures the input is a string, then uses the
 * browser’s native `CSS.supports()` API to verify that the string
 * is recognized as a valid value for the `font-size` property.
 *
 * @param font_size - The font-size value to validate (e.g. "16px", "1.2em", "small").
 * @returns `true` if `font_size` is a string and is supported by the browser’s CSS parser; otherwise `false`.
 */
function isValidFontSize(font_size) {
  if (typeof font_size !== "string") return false;
  return CSS.supports("font-size", font_size);
}
var cardCSS = i$5(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ha-card {\n    height: 100%;\n    overflow: hidden;\n    padding: 16px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-direction: column;\n    box-sizing: border-box;\n  }\n\n  ha-card.action {\n    cursor: pointer;\n  }\n\n  ha-card:focus {\n    outline: none;\n  }\n\n  gauge-card-pro-gauge {\n    width: 100%;\n    max-width: 250px;\n  }\n\n  .title {\n    text-align: center;\n    line-height: initial;\n    width: 100%;\n  }\n\n  .primary-title {\n    margin-top: 8px;\n  }\n"])));
var Sample = /*#__PURE__*/_createClass(function Sample(_ref) {
  _classCallCheck(this, Sample);
  var x = _ref.x,
    y = _ref.y,
    progress = _ref.progress,
    segment = _ref.segment;
  this.x = x;
  this.y = y;
  this.progress = progress;
  this.segment = segment;
}); // This file is autogenerated. It's used to publish ESM to npm.
function _typeof$1(obj) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof$1(obj);
} // https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License
var trimLeft$1 = /^\s+/;
var trimRight$1 = /\s+$/;
function tinycolor$1(color, opts) {
  color = color ? color : "";
  opts = opts || {}; // If input is already a tinycolor, return itself
  if (color instanceof tinycolor$1) {
    return color;
  } // If we are called as a function, call using new instead
  if (!(this instanceof tinycolor$1)) {
    return new tinycolor$1(color, opts);
  }
  var rgb = inputToRGB$1(color);
  this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
  this._gradientType = opts.gradientType; // Don't let the range of [0,255] come back in [0,1].
  // Potentially lose a little bit of precision here, but will fix issues where
  // .5 gets interpreted as half of the total, instead of half of 1
  // If it was supposed to be 128, this was already taken care of by `inputToRgb`
  if (this._r < 1) this._r = Math.round(this._r);
  if (this._g < 1) this._g = Math.round(this._g);
  if (this._b < 1) this._b = Math.round(this._b);
  this._ok = rgb.ok;
}
tinycolor$1.prototype = {
  isDark: function isDark() {
    return this.getBrightness() < 128;
  },
  isLight: function isLight() {
    return !this.isDark();
  },
  isValid: function isValid() {
    return this._ok;
  },
  getOriginalInput: function getOriginalInput() {
    return this._originalInput;
  },
  getFormat: function getFormat() {
    return this._format;
  },
  getAlpha: function getAlpha() {
    return this._a;
  },
  getBrightness: function getBrightness() {
    //http://www.w3.org/TR/AERT#color-contrast
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },
  getLuminance: function getLuminance() {
    //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    var rgb = this.toRgb();
    var RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r / 255;
    GsRGB = rgb.g / 255;
    BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) R = RsRGB / 12.92;else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    if (GsRGB <= 0.03928) G = GsRGB / 12.92;else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    if (BsRGB <= 0.03928) B = BsRGB / 12.92;else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  setAlpha: function setAlpha(value) {
    this._a = boundAlpha$1(value);
    this._roundA = Math.round(100 * this._a) / 100;
    return this;
  },
  toHsv: function toHsv() {
    var hsv = rgbToHsv$1(this._r, this._g, this._b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this._a
    };
  },
  toHsvString: function toHsvString() {
    var hsv = rgbToHsv$1(this._r, this._g, this._b);
    var h = Math.round(hsv.h * 360),
      s = Math.round(hsv.s * 100),
      v = Math.round(hsv.v * 100);
    return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
  },
  toHsl: function toHsl() {
    var hsl = rgbToHsl$1(this._r, this._g, this._b);
    return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this._a
    };
  },
  toHslString: function toHslString() {
    var hsl = rgbToHsl$1(this._r, this._g, this._b);
    var h = Math.round(hsl.h * 360),
      s = Math.round(hsl.s * 100),
      l = Math.round(hsl.l * 100);
    return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
  },
  toHex: function toHex(allow3Char) {
    return rgbToHex$1(this._r, this._g, this._b, allow3Char);
  },
  toHexString: function toHexString(allow3Char) {
    return "#" + this.toHex(allow3Char);
  },
  toHex8: function toHex8(allow4Char) {
    return rgbaToHex$1(this._r, this._g, this._b, this._a, allow4Char);
  },
  toHex8String: function toHex8String(allow4Char) {
    return "#" + this.toHex8(allow4Char);
  },
  toRgb: function toRgb() {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a
    };
  },
  toRgbString: function toRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
  },
  toPercentageRgb: function toPercentageRgb() {
    return {
      r: Math.round(bound01$1(this._r, 255) * 100) + "%",
      g: Math.round(bound01$1(this._g, 255) * 100) + "%",
      b: Math.round(bound01$1(this._b, 255) * 100) + "%",
      a: this._a
    };
  },
  toPercentageRgbString: function toPercentageRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(bound01$1(this._r, 255) * 100) + "%, " + Math.round(bound01$1(this._g, 255) * 100) + "%, " + Math.round(bound01$1(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01$1(this._r, 255) * 100) + "%, " + Math.round(bound01$1(this._g, 255) * 100) + "%, " + Math.round(bound01$1(this._b, 255) * 100) + "%, " + this._roundA + ")";
  },
  toName: function toName() {
    if (this._a === 0) {
      return "transparent";
    }
    if (this._a < 1) {
      return false;
    }
    return hexNames$1[rgbToHex$1(this._r, this._g, this._b, true)] || false;
  },
  toFilter: function toFilter(secondColor) {
    var hex8String = "#" + rgbaToArgbHex$1(this._r, this._g, this._b, this._a);
    var secondHex8String = hex8String;
    var gradientType = this._gradientType ? "GradientType = 1, " : "";
    if (secondColor) {
      var s = tinycolor$1(secondColor);
      secondHex8String = "#" + rgbaToArgbHex$1(s._r, s._g, s._b, s._a);
    }
    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
  },
  toString: function toString(format) {
    var formatSet = !!format;
    format = format || this._format;
    var formattedString = false;
    var hasAlpha = this._a < 1 && this._a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === "name" && this._a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  },
  clone: function clone() {
    return tinycolor$1(this.toString());
  },
  _applyModification: function _applyModification(fn, args) {
    var color = fn.apply(null, [this].concat([].slice.call(args)));
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this.setAlpha(color._a);
    return this;
  },
  lighten: function lighten() {
    return this._applyModification(_lighten$1, arguments);
  },
  brighten: function brighten() {
    return this._applyModification(_brighten$1, arguments);
  },
  darken: function darken() {
    return this._applyModification(_darken$1, arguments);
  },
  desaturate: function desaturate() {
    return this._applyModification(_desaturate$1, arguments);
  },
  saturate: function saturate() {
    return this._applyModification(_saturate$1, arguments);
  },
  greyscale: function greyscale() {
    return this._applyModification(_greyscale$1, arguments);
  },
  spin: function spin() {
    return this._applyModification(_spin$1, arguments);
  },
  _applyCombination: function _applyCombination(fn, args) {
    return fn.apply(null, [this].concat([].slice.call(args)));
  },
  analogous: function analogous() {
    return this._applyCombination(_analogous$1, arguments);
  },
  complement: function complement() {
    return this._applyCombination(_complement$1, arguments);
  },
  monochromatic: function monochromatic() {
    return this._applyCombination(_monochromatic$1, arguments);
  },
  splitcomplement: function splitcomplement() {
    return this._applyCombination(_splitcomplement$1, arguments);
  },
  // Disabled until https://github.com/bgrins/TinyColor/issues/254
  // polyad: function (number) {
  //   return this._applyCombination(polyad, [number]);
  // },
  triad: function triad() {
    return this._applyCombination(polyad$1, [3]);
  },
  tetrad: function tetrad() {
    return this._applyCombination(polyad$1, [4]);
  }
}; // If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor$1.fromRatio = function (color, opts) {
  if (_typeof$1(color) == "object") {
    var newColor = {};
    for (var i in color) {
      if (color.hasOwnProperty(i)) {
        if (i === "a") {
          newColor[i] = color[i];
        } else {
          newColor[i] = convertToPercentage$1(color[i]);
        }
      }
    }
    color = newColor;
  }
  return tinycolor$1(color, opts);
}; // Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB$1(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color == "string") {
    color = stringInputToObject$1(color);
  }
  if (_typeof$1(color) == "object") {
    if (isValidCSSUnit$1(color.r) && isValidCSSUnit$1(color.g) && isValidCSSUnit$1(color.b)) {
      rgb = rgbToRgb$1(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit$1(color.h) && isValidCSSUnit$1(color.s) && isValidCSSUnit$1(color.v)) {
      s = convertToPercentage$1(color.s);
      v = convertToPercentage$1(color.v);
      rgb = hsvToRgb$1(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit$1(color.h) && isValidCSSUnit$1(color.s) && isValidCSSUnit$1(color.l)) {
      s = convertToPercentage$1(color.s);
      l = convertToPercentage$1(color.l);
      rgb = hslToRgb$1(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (color.hasOwnProperty("a")) {
      a = color.a;
    }
  }
  a = boundAlpha$1(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
} // Conversion Functions
// --------------------
// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb$1(r, g, b) {
  return {
    r: bound01$1(r, 255) * 255,
    g: bound01$1(g, 255) * 255,
    b: bound01$1(b, 255) * 255
  };
} // `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl$1(r, g, b) {
  r = bound01$1(r, 255);
  g = bound01$1(g, 255);
  b = bound01$1(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
} // `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb$1(h, s, l) {
  var r, g, b;
  h = bound01$1(h, 360);
  s = bound01$1(s, 100);
  l = bound01$1(l, 100);
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
} // `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv$1(r, g, b) {
  r = bound01$1(r, 255);
  g = bound01$1(g, 255);
  b = bound01$1(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
} // `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hsvToRgb$1(h, s, v) {
  h = bound01$1(h, 360) * 6;
  s = bound01$1(s, 100);
  v = bound01$1(v, 100);
  var i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = [v, q, p, p, t, v][mod],
    g = [t, v, v, q, p, p][mod],
    b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
} // `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex$1(r, g, b, allow3Char) {
  var hex = [pad2$1(Math.round(r).toString(16)), pad2$1(Math.round(g).toString(16)), pad2$1(Math.round(b).toString(16))]; // Return a 3 character hex if possible
  if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
} // `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex$1(r, g, b, a, allow4Char) {
  var hex = [pad2$1(Math.round(r).toString(16)), pad2$1(Math.round(g).toString(16)), pad2$1(Math.round(b).toString(16)), pad2$1(convertDecimalToHex$1(a))]; // Return a 4 character hex if possible
  if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
} // `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex$1(r, g, b, a) {
  var hex = [pad2$1(convertDecimalToHex$1(a)), pad2$1(Math.round(r).toString(16)), pad2$1(Math.round(g).toString(16)), pad2$1(Math.round(b).toString(16))];
  return hex.join("");
} // `equals`
// Can be called with any tinycolor input
tinycolor$1.equals = function (color1, color2) {
  if (!color1 || !color2) return false;
  return tinycolor$1(color1).toRgbString() == tinycolor$1(color2).toRgbString();
};
tinycolor$1.random = function () {
  return tinycolor$1.fromRatio({
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  });
}; // Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
function _desaturate$1(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor$1(color).toHsl();
  hsl.s -= amount / 100;
  hsl.s = clamp01$1(hsl.s);
  return tinycolor$1(hsl);
}
function _saturate$1(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor$1(color).toHsl();
  hsl.s += amount / 100;
  hsl.s = clamp01$1(hsl.s);
  return tinycolor$1(hsl);
}
function _greyscale$1(color) {
  return tinycolor$1(color).desaturate(100);
}
function _lighten$1(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor$1(color).toHsl();
  hsl.l += amount / 100;
  hsl.l = clamp01$1(hsl.l);
  return tinycolor$1(hsl);
}
function _brighten$1(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var rgb = tinycolor$1(color).toRgb();
  rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
  rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
  rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
  return tinycolor$1(rgb);
}
function _darken$1(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor$1(color).toHsl();
  hsl.l -= amount / 100;
  hsl.l = clamp01$1(hsl.l);
  return tinycolor$1(hsl);
} // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function _spin$1(color, amount) {
  var hsl = tinycolor$1(color).toHsl();
  var hue = (hsl.h + amount) % 360;
  hsl.h = hue < 0 ? 360 + hue : hue;
  return tinycolor$1(hsl);
} // Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
function _complement$1(color) {
  var hsl = tinycolor$1(color).toHsl();
  hsl.h = (hsl.h + 180) % 360;
  return tinycolor$1(hsl);
}
function polyad$1(color, number) {
  if (isNaN(number) || number <= 0) {
    throw new Error("Argument to polyad must be a positive number");
  }
  var hsl = tinycolor$1(color).toHsl();
  var result = [tinycolor$1(color)];
  var step = 360 / number;
  for (var i = 1; i < number; i++) {
    result.push(tinycolor$1({
      h: (hsl.h + i * step) % 360,
      s: hsl.s,
      l: hsl.l
    }));
  }
  return result;
}
function _splitcomplement$1(color) {
  var hsl = tinycolor$1(color).toHsl();
  var h = hsl.h;
  return [tinycolor$1(color), tinycolor$1({
    h: (h + 72) % 360,
    s: hsl.s,
    l: hsl.l
  }), tinycolor$1({
    h: (h + 216) % 360,
    s: hsl.s,
    l: hsl.l
  })];
}
function _analogous$1(color, results, slices) {
  results = results || 6;
  slices = slices || 30;
  var hsl = tinycolor$1(color).toHsl();
  var part = 360 / slices;
  var ret = [tinycolor$1(color)];
  for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
    hsl.h = (hsl.h + part) % 360;
    ret.push(tinycolor$1(hsl));
  }
  return ret;
}
function _monochromatic$1(color, results) {
  results = results || 6;
  var hsv = tinycolor$1(color).toHsv();
  var h = hsv.h,
    s = hsv.s,
    v = hsv.v;
  var ret = [];
  var modification = 1 / results;
  while (results--) {
    ret.push(tinycolor$1({
      h: h,
      s: s,
      v: v
    }));
    v = (v + modification) % 1;
  }
  return ret;
} // Utility Functions
// ---------------------
tinycolor$1.mix = function (color1, color2, amount) {
  amount = amount === 0 ? 0 : amount || 50;
  var rgb1 = tinycolor$1(color1).toRgb();
  var rgb2 = tinycolor$1(color2).toRgb();
  var p = amount / 100;
  var rgba = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a
  };
  return tinycolor$1(rgba);
}; // Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor$1.readability = function (color1, color2) {
  var c1 = tinycolor$1(color1);
  var c2 = tinycolor$1(color2);
  return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
}; // `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor$1.isReadable = function (color1, color2, wcag2) {
  var readability = tinycolor$1.readability(color1, color2);
  var wcag2Parms, out;
  out = false;
  wcag2Parms = validateWCAG2Parms$1(wcag2);
  switch (wcag2Parms.level + wcag2Parms.size) {
    case "AAsmall":
    case "AAAlarge":
      out = readability >= 4.5;
      break;
    case "AAlarge":
      out = readability >= 3;
      break;
    case "AAAsmall":
      out = readability >= 7;
      break;
  }
  return out;
}; // `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor$1.mostReadable = function (baseColor, colorList, args) {
  var bestColor = null;
  var bestScore = 0;
  var readability;
  var includeFallbackColors, level, size;
  args = args || {};
  includeFallbackColors = args.includeFallbackColors;
  level = args.level;
  size = args.size;
  for (var i = 0; i < colorList.length; i++) {
    readability = tinycolor$1.readability(baseColor, colorList[i]);
    if (readability > bestScore) {
      bestScore = readability;
      bestColor = tinycolor$1(colorList[i]);
    }
  }
  if (tinycolor$1.isReadable(baseColor, bestColor, {
    level: level,
    size: size
  }) || !includeFallbackColors) {
    return bestColor;
  } else {
    args.includeFallbackColors = false;
    return tinycolor$1.mostReadable(baseColor, ["#fff", "#000"], args);
  }
}; // Big List of Colors
// ------------------
// <https://www.w3.org/TR/css-color-4/#named-colors>
var names$1 = tinycolor$1.names = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
}; // Make it easy to access colors via `hexNames[hex]`
var hexNames$1 = tinycolor$1.hexNames = flip$1(names$1); // Utilities
// ---------
// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip$1(o) {
  var flipped = {};
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      flipped[o[i]] = i;
    }
  }
  return flipped;
} // Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha$1(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
} // Take input from [0, n] and return it as [0, 1]
function bound01$1(n, max) {
  if (isOnePointZero$1(n)) n = "100%";
  var processPercent = isPercentage$1(n);
  n = Math.min(max, Math.max(0, parseFloat(n))); // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  } // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  } // Convert into [0, 1] range if it isn't already
  return n % max / parseFloat(max);
} // Force a number between 0 and 1
function clamp01$1(val) {
  return Math.min(1, Math.max(0, val));
} // Parse a base-16 hex value into a base-10 integer
function parseIntFromHex$1(val) {
  return parseInt(val, 16);
} // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero$1(n) {
  return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
} // Check to see if string passed in is a percentage
function isPercentage$1(n) {
  return typeof n === "string" && n.indexOf("%") != -1;
} // Force a hex value to have 2 characters
function pad2$1(c) {
  return c.length == 1 ? "0" + c : "" + c;
} // Replace a decimal with it's percentage value
function convertToPercentage$1(n) {
  if (n <= 1) {
    n = n * 100 + "%";
  }
  return n;
} // Converts a decimal to a hex value
function convertDecimalToHex$1(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
} // Converts a hex value to a decimal
function convertHexToDecimal$1(h) {
  return parseIntFromHex$1(h) / 255;
}
var matchers$1 = function () {
  // <http://www.w3.org/TR/css3-values/#integers>
  var CSS_INTEGER = "[-\\+]?\\d+%?"; // <http://www.w3.org/TR/css3-values/#number-value>
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?"; // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
  var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")"; // Actual matching.
  // Parentheses and commas are optional, but not required.
  // Whitespace can take the place of commas or opening paren
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  return {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
}(); // `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit$1(color) {
  return !!matchers$1.CSS_UNIT.exec(color);
} // `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject$1(color) {
  color = color.replace(trimLeft$1, "").replace(trimRight$1, "").toLowerCase();
  var named = false;
  if (names$1[color]) {
    color = names$1[color];
    named = true;
  } else if (color == "transparent") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: "name"
    };
  } // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  var match;
  if (match = matchers$1.rgb.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  if (match = matchers$1.rgba.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  if (match = matchers$1.hsl.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  if (match = matchers$1.hsla.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  if (match = matchers$1.hsv.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  if (match = matchers$1.hsva.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  if (match = matchers$1.hex8.exec(color)) {
    return {
      r: parseIntFromHex$1(match[1]),
      g: parseIntFromHex$1(match[2]),
      b: parseIntFromHex$1(match[3]),
      a: convertHexToDecimal$1(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers$1.hex6.exec(color)) {
    return {
      r: parseIntFromHex$1(match[1]),
      g: parseIntFromHex$1(match[2]),
      b: parseIntFromHex$1(match[3]),
      format: named ? "name" : "hex"
    };
  }
  if (match = matchers$1.hex4.exec(color)) {
    return {
      r: parseIntFromHex$1(match[1] + "" + match[1]),
      g: parseIntFromHex$1(match[2] + "" + match[2]),
      b: parseIntFromHex$1(match[3] + "" + match[3]),
      a: convertHexToDecimal$1(match[4] + "" + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers$1.hex3.exec(color)) {
    return {
      r: parseIntFromHex$1(match[1] + "" + match[1]),
      g: parseIntFromHex$1(match[2] + "" + match[2]),
      b: parseIntFromHex$1(match[3] + "" + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function validateWCAG2Parms$1(parms) {
  // return valid WCAG2 parms for isReadable.
  // If input parms are invalid, return {"level":"AA", "size":"small"}
  var level, size;
  parms = parms || {
    level: "AA",
    size: "small"
  };
  level = (parms.level || "AA").toUpperCase();
  size = (parms.size || "small").toLowerCase();
  if (level !== "AA" && level !== "AAA") {
    level = "AA";
  }
  if (size !== "small" && size !== "large") {
    size = "small";
  }
  return {
    level: level,
    size: size
  };
}
/**
 * @typedef {Object} TinyGradient.StopInput
 * @property {ColorInput} color
 * @property {number} pos
 */ /**
    * @typedef {Object} TinyGradient.StepValue
    * @type {number} [r]
    * @type {number} [g]
    * @type {number} [b]
    * @type {number} [h]
    * @type {number} [s]
    * @type {number} [v]
    * @type {number} [a]
    */ /**
       * @type {StepValue}
       */
var RGBA_MAX$1 = {
  r: 256,
  g: 256,
  b: 256,
  a: 1
};
/**
 * @type {StepValue}
 */
var HSVA_MAX$1 = {
  h: 360,
  s: 1,
  v: 1,
  a: 1
};
/**
 * Linearly compute the step size between start and end (not normalized)
 * @param {StepValue} start
 * @param {StepValue} end
 * @param {number} steps - number of desired steps
 * @return {StepValue}
 */
function stepize$1(start, end, steps) {
  var step = {};
  for (var _k7 in start) {
    if (start.hasOwnProperty(_k7)) {
      step[_k7] = steps === 0 ? 0 : (end[_k7] - start[_k7]) / steps;
    }
  }
  return step;
}
/**
 * Compute the final step color
 * @param {StepValue} step - from `stepize`
 * @param {StepValue} start
 * @param {number} i - color index
 * @param {StepValue} max - rgba or hsva of maximum values for each channel
 * @return {StepValue}
 */
function interpolate$1(step, start, i, max) {
  var color = {};
  for (var _k8 in start) {
    if (start.hasOwnProperty(_k8)) {
      color[_k8] = step[_k8] * i + start[_k8];
      color[_k8] = color[_k8] < 0 ? color[_k8] + max[_k8] : max[_k8] !== 1 ? color[_k8] % max[_k8] : color[_k8];
    }
  }
  return color;
}
/**
 * Generate gradient with RGBa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateRgb$1(stop1, stop2, steps) {
  var start = stop1.color.toRgb();
  var end = stop2.color.toRgb();
  var step = stepize$1(start, end, steps);
  var gradient = [stop1.color];
  for (var _i16 = 1; _i16 < steps; _i16++) {
    var color = interpolate$1(step, start, _i16, RGBA_MAX$1);
    gradient.push(tinycolor$1(color));
  }
  return gradient;
}
/**
 * Generate gradient with HSVa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @param {boolean|'long'|'short'} mode
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateHsv$1(stop1, stop2, steps, mode) {
  var start = stop1.color.toHsv();
  var end = stop2.color.toHsv(); // rgb interpolation if one of the steps in grayscale
  if (start.s === 0 || end.s === 0) {
    return interpolateRgb$1(stop1, stop2, steps);
  }
  var trigonometric;
  if (typeof mode === "boolean") {
    trigonometric = mode;
  } else {
    var trigShortest = start.h < end.h && end.h - start.h < 180 || start.h > end.h && start.h - end.h > 180;
    trigonometric = mode === "long" && trigShortest || mode === "short" && !trigShortest;
  }
  var step = stepize$1(start, end, steps);
  var gradient = [stop1.color]; // recompute hue
  var diff;
  if (start.h <= end.h && !trigonometric || start.h >= end.h && trigonometric) {
    diff = end.h - start.h;
  } else if (trigonometric) {
    diff = 360 - end.h + start.h;
  } else {
    diff = 360 - start.h + end.h;
  }
  step.h = Math.pow(-1, trigonometric ? 1 : 0) * Math.abs(diff) / steps;
  for (var _i17 = 1; _i17 < steps; _i17++) {
    var color = interpolate$1(step, start, _i17, HSVA_MAX$1);
    gradient.push(tinycolor$1(color));
  }
  return gradient;
}
/**
 * Compute substeps between each stops
 * @param {StopInput[]} stops
 * @param {number} steps
 * @return {number[]}
 */
function computeSubsteps$1(stops, steps) {
  var l = stops.length; // validation
  steps = parseInt(steps, 10);
  if (isNaN(steps) || steps < 2) {
    throw new Error("Invalid number of steps (< 2)");
  }
  if (steps < l) {
    throw new Error("Number of steps cannot be inferior to number of stops");
  } // compute substeps from stop positions
  var substeps = [];
  for (var _i18 = 1; _i18 < l; _i18++) {
    var step = (steps - 1) * (stops[_i18].pos - stops[_i18 - 1].pos);
    substeps.push(Math.max(1, Math.round(step)));
  } // adjust number of steps
  var totalSubsteps = 1;
  for (var _n3 = l - 1; _n3--;) totalSubsteps += substeps[_n3];
  while (totalSubsteps !== steps) {
    if (totalSubsteps < steps) {
      var min = Math.min.apply(null, substeps);
      substeps[substeps.indexOf(min)]++;
      totalSubsteps++;
    } else {
      var max = Math.max.apply(null, substeps);
      substeps[substeps.indexOf(max)]--;
      totalSubsteps--;
    }
  }
  return substeps;
}
/**
 * Compute the color at a specific position
 * @param {StopInput[]} stops
 * @param {number} pos
 * @param {string} method
 * @param {StepValue} max
 * @returns {tinycolor}
 */
function computeAt$1(stops, pos, method, max) {
  if (pos < 0 || pos > 1) {
    throw new Error("Position must be between 0 and 1");
  }
  var start, end;
  for (var _i19 = 0, _l3 = stops.length; _i19 < _l3 - 1; _i19++) {
    if (pos >= stops[_i19].pos && pos < stops[_i19 + 1].pos) {
      start = stops[_i19];
      end = stops[_i19 + 1];
      break;
    }
  }
  if (!start) {
    start = end = stops[stops.length - 1];
  }
  var step = stepize$1(start.color[method](), end.color[method](), (end.pos - start.pos) * 100);
  var color = interpolate$1(step, start.color[method](), (pos - start.pos) * 100, max);
  return tinycolor$1(color);
}
var TinyGradient$1 = /*#__PURE__*/function () {
  /**
   * @param {StopInput[]|ColorInput[]} stops
   * @returns {TinyGradient}
   */
  function TinyGradient(stops) {
    _classCallCheck(this, TinyGradient);
    // validation
    if (stops.length < 2) {
      throw new Error("Invalid number of stops (< 2)");
    }
    var havingPositions = stops[0].pos !== undefined;
    var l = stops.length;
    var p = -1;
    var lastColorLess = false; // create tinycolor objects and clean positions
    this.stops = stops.map(function (stop, i) {
      var hasPosition = stop.pos !== undefined;
      if (havingPositions ^ hasPosition) {
        throw new Error("Cannot mix positionned and not posionned color stops");
      }
      if (hasPosition) {
        var hasColor = stop.color !== undefined;
        if (!hasColor && (lastColorLess || i === 0 || i === l - 1)) {
          throw new Error("Cannot define two consecutive position-only stops");
        }
        lastColorLess = !hasColor;
        stop = {
          color: hasColor ? tinycolor$1(stop.color) : null,
          colorLess: !hasColor,
          pos: stop.pos
        };
        if (stop.pos < 0 || stop.pos > 1) {
          throw new Error("Color stops positions must be between 0 and 1");
        } else if (stop.pos < p) {
          throw new Error("Color stops positions are not ordered");
        }
        p = stop.pos;
      } else {
        stop = {
          color: tinycolor$1(stop.color !== undefined ? stop.color : stop),
          pos: i / (l - 1)
        };
      }
      return stop;
    });
    if (this.stops[0].pos !== 0) {
      this.stops.unshift({
        color: this.stops[0].color,
        pos: 0
      });
      l++;
    }
    if (this.stops[l - 1].pos !== 1) {
      this.stops.push({
        color: this.stops[l - 1].color,
        pos: 1
      });
    }
  }
  /**
   * Return new instance with reversed stops
   * @return {TinyGradient}
   */
  return _createClass(TinyGradient, [{
    key: "reverse",
    value: function reverse() {
      var stops = [];
      this.stops.forEach(function (stop) {
        stops.push({
          color: stop.color,
          pos: 1 - stop.pos
        });
      });
      return new TinyGradient(stops.reverse());
    }
    /**
     * Return new instance with looped stops
     * @return {TinyGradient}
     */
  }, {
    key: "loop",
    value: function loop() {
      var stops1 = [];
      var stops2 = [];
      this.stops.forEach(function (stop) {
        stops1.push({
          color: stop.color,
          pos: stop.pos / 2
        });
      });
      this.stops.slice(0, -1).forEach(function (stop) {
        stops2.push({
          color: stop.color,
          pos: 1 - stop.pos / 2
        });
      });
      return new TinyGradient(stops1.concat(stops2.reverse()));
    }
    /**
     * Generate gradient with RGBa interpolation
     * @param {number} steps
     * @return {tinycolor[]}
     */
  }, {
    key: "rgb",
    value: function rgb(steps) {
      var _this10 = this;
      var substeps = computeSubsteps$1(this.stops, steps);
      var gradient = [];
      this.stops.forEach(function (stop, i) {
        if (stop.colorLess) {
          stop.color = interpolateRgb$1(_this10.stops[i - 1], _this10.stops[i + 1], 2)[1];
        }
      });
      for (var _i20 = 0, _l4 = this.stops.length; _i20 < _l4 - 1; _i20++) {
        var _rgb = interpolateRgb$1(this.stops[_i20], this.stops[_i20 + 1], substeps[_i20]);
        gradient.splice.apply(gradient, [gradient.length, 0].concat(_toConsumableArray(_rgb)));
      }
      gradient.push(this.stops[this.stops.length - 1].color);
      return gradient;
    }
    /**
     * Generate gradient with HSVa interpolation
     * @param {number} steps
     * @param {boolean|'long'|'short'} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
  }, {
    key: "hsv",
    value: function hsv(steps, mode) {
      var _this11 = this;
      var substeps = computeSubsteps$1(this.stops, steps);
      var gradient = [];
      this.stops.forEach(function (stop, i) {
        if (stop.colorLess) {
          stop.color = interpolateHsv$1(_this11.stops[i - 1], _this11.stops[i + 1], 2, mode)[1];
        }
      });
      for (var _i21 = 0, _l5 = this.stops.length; _i21 < _l5 - 1; _i21++) {
        var _hsv = interpolateHsv$1(this.stops[_i21], this.stops[_i21 + 1], substeps[_i21], mode);
        gradient.splice.apply(gradient, [gradient.length, 0].concat(_toConsumableArray(_hsv)));
      }
      gradient.push(this.stops[this.stops.length - 1].color);
      return gradient;
    }
    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
  }, {
    key: "css",
    value: function css(mode, direction) {
      mode = mode || "linear";
      direction = direction || (mode === "linear" ? "to right" : "ellipse at center");
      var css = mode + "-gradient(" + direction;
      this.stops.forEach(function (stop) {
        css += ", " + (stop.colorLess ? "" : stop.color.toRgbString() + " ") + stop.pos * 100 + "%";
      });
      css += ")";
      return css;
    }
    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
  }, {
    key: "rgbAt",
    value: function rgbAt(pos) {
      return computeAt$1(this.stops, pos, "toRgb", RGBA_MAX$1);
    }
    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
  }, {
    key: "hsvAt",
    value: function hsvAt(pos) {
      return computeAt$1(this.stops, pos, "toHsv", HSVA_MAX$1);
    }
  }]);
}();
/**
 * @param {StopInput[]|ColorInput[]|StopInput...|ColorInput...} stops
 * @returns {TinyGradient}
 */
function tinygradient$1(stops) {
  // varargs
  if (arguments.length === 1) {
    if (!Array.isArray(arguments[0])) {
      throw new Error('"stops" is not an array');
    }
    stops = arguments[0];
  } else {
    stops = Array.prototype.slice.call(arguments);
  }
  return new TinyGradient$1(stops);
} // An internal function to help with easily creating SVG elements with an object of attributes
var svgElem = function svgElem(type, attrs) {
  var elem = document.createElementNS("http://www.w3.org/2000/svg", type),
    attributes = Object.keys(attrs);
  for (var _i22 = 0; _i22 < attributes.length; _i22++) {
    var attr = attributes[_i22];
    elem.setAttribute(attr, attrs[attr]);
  }
  return elem;
}; // An internal function to help with the repetition of adding fill, stroke, and stroke-width attributes
var styleAttrs = function styleAttrs(fill, stroke, strokeWidth, progress) {
  var determineColor = function determineColor(type, progress) {
    return typeof type === "string" ? type : tinygradient$1(type).rgbAt(progress);
  };
  var attrs = {};
  if (stroke) {
    attrs["stroke"] = determineColor(stroke, progress);
    attrs["stroke-width"] = strokeWidth;
  }
  if (fill) {
    attrs["fill"] = determineColor(fill, progress);
  }
  return attrs;
}; // An internal function to convert any array of samples into a "d" attribute to be passed to an SVG path
var segmentToD = function segmentToD(samples) {
  var d = "";
  for (var _i23 = 0; _i23 < samples.length; _i23++) {
    var _samples$_i = samples[_i23],
      _x7 = _samples$_i.x,
      _y2 = _samples$_i.y,
      prevSample = _i23 === 0 ? null : samples[_i23 - 1];
    if (_i23 === 0 && _i23 !== samples.length - 1) {
      d += "M".concat(_x7, ",").concat(_y2);
    } else if (_x7 !== prevSample.x && _y2 !== prevSample.y) {
      d += "L".concat(_x7, ",").concat(_y2);
    } else if (_x7 !== prevSample.x) {
      d += "H".concat(_x7);
    } else if (_y2 !== prevSample.y) {
      d += "V".concat(_y2);
    }
    if (_i23 === samples.length - 1) {
      d += "Z";
    }
  }
  return d;
}; // An internal function for getting the colors of a segment, we need to get middle most sample (sorted by progress along the path)
var getMiddleSample = function getMiddleSample(samples) {
  var sortedSamples = _toConsumableArray(samples).sort(function (a, b) {
    return a.progress - b.progress;
  });
  return sortedSamples[sortedSamples.length / 2 | 0];
}; // An internal function for converting any D3 selection or DOM-like element into a DOM node
var convertPathToNode = function convertPathToNode(path) {
  return path instanceof Element || path instanceof HTMLDocument ? path : path.node();
};
var Segment = /*#__PURE__*/_createClass(function Segment(_ref) {
  _classCallCheck(this, Segment);
  var samples = _ref.samples;
  this.samples = samples;
  this.progress = getMiddleSample(samples).progress;
});
var DEFAULT_PRECISION = 2; // The main function responsible for getting data
// This will take a path, number of samples, number of samples, and a precision value
// It will return an array of Segments, which in turn contains an array of Samples
// This can later be used to generate a stroked path, converted to outlines for a filled path, or flattened for plotting SVG circles
var getData = function getData(_ref) {
  var path = _ref.path,
    segments = _ref.segments,
    samples = _ref.samples,
    _ref$precision = _ref.precision,
    precision = _ref$precision === void 0 ? DEFAULT_PRECISION : _ref$precision; // Convert the given path to a DOM node if it isn't already one
  path = convertPathToNode(path); // We decrement the number of samples per segment because when we group them later we will add on the first sample of the following segment
  if (samples > 1) samples--; // Get total length of path, total number of samples we will be generating, and two blank arrays to hold samples and segments
  var pathLength = path.getTotalLength(),
    totalSamples = segments * samples,
    allSamples = [],
    allSegments = []; // For the number of total samples, get the x, y, and progress values for each sample along the path
  for (var sample = 0; sample <= totalSamples; sample++) {
    var progress = sample / totalSamples;
    var _path$getPointAtLengt = path.getPointAtLength(progress * pathLength),
      _x8 = _path$getPointAtLengt.x,
      _y3 = _path$getPointAtLengt.y; // If the user asks to round our x and y values, do so
    if (precision) {
      _x8 = +_x8.toFixed(precision);
      _y3 = +_y3.toFixed(precision);
    } // Create a new Sample and push it onto the allSamples array
    allSamples.push(new Sample({
      x: _x8,
      y: _y3,
      progress: progress
    }));
  } // Out of all the samples gathered previously, sort them into groups of segments
  // Each group includes the samples of the current segment, with the last sample being first sample from the next segment
  for (var segment = 0; segment < segments; segment++) {
    var currentStart = segment * samples,
      nextStart = currentStart + samples,
      segmentSamples = []; // Push all current samples onto segmentSamples
    for (var samInSeg = 0; samInSeg < samples; samInSeg++) {
      segmentSamples.push(allSamples[currentStart + samInSeg]);
    } // Push the first sample from the next segment onto segmentSamples
    segmentSamples.push(allSamples[nextStart]); // Create a new Segment with the samples from segmentSamples
    allSegments.push(new Segment({
      samples: segmentSamples
    }));
  } // Return our group of segments
  return allSegments;
}; // The function responsible for converting strokable data (from getData()) into fillable data
// This allows any SVG path to be filled instead of just stroked, allowing for the user to fill and stroke paths simultaneously
// We start by outlining the stroked data given a specified width and the we average together the edges where adjacent segments touch
var strokeToFill = function strokeToFill(data, width, precision, pathClosed) {
  var outlinedStrokes = outlineStrokes(data, width, precision),
    averagedSegmentJoins = averageSegmentJoins(outlinedStrokes, precision, pathClosed);
  return averagedSegmentJoins;
}; // An internal function for outlining stroked data
var outlineStrokes = function outlineStrokes(data, width, precision) {
  // We need to get the points perpendicular to a startPoint, given an angle, radius, and precision
  var getPerpSamples = function getPerpSamples(angle, radius, precision, startPoint) {
    var p0 = new Sample(_objectSpread(_objectSpread({}, startPoint), {}, {
        x: Math.sin(angle) * radius + startPoint.x,
        y: -Math.cos(angle) * radius + startPoint.y
      })),
      p1 = new Sample(_objectSpread(_objectSpread({}, startPoint), {}, {
        x: -Math.sin(angle) * radius + startPoint.x,
        y: Math.cos(angle) * radius + startPoint.y
      })); // If the user asks to round our x and y values, do so
    if (precision) {
      p0.x = +p0.x.toFixed(precision);
      p0.y = +p0.y.toFixed(precision);
      p1.x = +p1.x.toFixed(precision);
      p1.y = +p1.y.toFixed(precision);
    }
    return [p0, p1];
  }; // We need to set the radius (half of the width) and have a holding array for outlined Segments
  var radius = width / 2,
    outlinedData = [];
  for (var _i24 = 0; _i24 < data.length; _i24++) {
    var samples = data[_i24].samples,
      segmentSamples = []; // For each sample point and the following sample point (if there is one) compute the angle
    // Also compute the sample's various perpendicular points (with a distance of radius away from the sample point)
    for (var _j2 = 0; _j2 < samples.length; _j2++) {
      // If we're at the end of the segment and there are no further points, get outta here!
      if (samples[_j2 + 1] === undefined) break;
      var p0 = samples[_j2],
        // First point
        p1 = samples[_j2 + 1],
        // Second point
        angle = Math.atan2(p1.y - p0.y, p1.x - p0.x),
        // Perpendicular angle to p0 and p1
        p0Perps = getPerpSamples(angle, radius, precision, p0),
        // Get perpedicular points with a distance of radius away from p0
        p1Perps = getPerpSamples(angle, radius, precision, p1); // Get perpedicular points with a distance of radius away from p1
      // We only need the p0 perpendenciular points for the first sample
      // The p0 for j > 0 will always be the same as p1 anyhow, so let's not add redundant points
      if (_j2 === 0) {
        segmentSamples.push.apply(segmentSamples, _toConsumableArray(p0Perps));
      } // Always push the second sample point's perpendicular points
      segmentSamples.push.apply(segmentSamples, _toConsumableArray(p1Perps));
    } // segmentSamples is out of order...
    // Given a segmentSamples length of 8, the points need to be rearranged from: 0, 2, 4, 6, 7, 5, 3, 1
    outlinedData.push(new Segment({
      samples: [].concat(_toConsumableArray(segmentSamples.filter(function (s, i) {
        return i % 2 === 0;
      })), _toConsumableArray(segmentSamples.filter(function (s, i) {
        return i % 2 === 1;
      }).reverse()))
    }));
  }
  return outlinedData;
}; // An internal function taking outlinedData (from outlineStrokes()) and averaging adjacent edges
// If we didn't do this, our data would be fillable, but it would look stroked
// This function fixes where segments overlap and underlap each other
var averageSegmentJoins = function averageSegmentJoins(outlinedData, precision, pathClosed) {
  // Find the average x and y between two points (p0 and p1)
  var avg = function avg(p0, p1) {
    return {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2
    };
  }; // Recombine the new x and y positions with all the other keys in the object
  var combine = function combine(segment, pos, avg) {
    return _objectSpread(_objectSpread({}, segment[pos]), {}, {
      x: avg.x,
      y: avg.y
    });
  };
  var init_outlinedData = JSON.parse(JSON.stringify(outlinedData)); //clone initial outlinedData Object
  for (var _i25 = 0; _i25 < outlinedData.length; _i25++) {
    // If path is closed: the current segment's samples;
    // If path is open: the current segments' samples, as long as it's not the last segment; Otherwise, the current segments' sample of the initial outlinedData object
    var currentSamples = pathClosed ? outlinedData[_i25].samples : outlinedData[_i25 + 1] ? outlinedData[_i25].samples : init_outlinedData[_i25].samples,
      // If path is closed: the next segment's samples, otherwise, the first segment's samples
      // If path is open: the next segment's samples, otherwise, the first segment's samples of the initial outlinedData object
      nextSamples = pathClosed ? outlinedData[_i25 + 1] ? outlinedData[_i25 + 1].samples : outlinedData[0].samples : outlinedData[_i25 + 1] ? outlinedData[_i25 + 1].samples : init_outlinedData[0].samples,
      currentMiddle = currentSamples.length / 2,
      // The "middle" sample in the current segment's samples
      nextEnd = nextSamples.length - 1; // The last sample in the next segment's samples
    // Average two sets of outlined samples to create p0Average and p1Average
    var p0Average = avg(currentSamples[currentMiddle - 1], nextSamples[0]),
      p1Average = avg(currentSamples[currentMiddle], nextSamples[nextEnd]); // If the user asks to round our x and y values, do so
    if (precision) {
      p0Average.x = +p0Average.x.toFixed(precision);
      p0Average.y = +p0Average.y.toFixed(precision);
      p1Average.x = +p1Average.x.toFixed(precision);
      p1Average.y = +p1Average.y.toFixed(precision);
    } // Replace the previous values with new Samples
    currentSamples[currentMiddle - 1] = new Sample(_objectSpread({}, combine(currentSamples, currentMiddle - 1, p0Average)));
    currentSamples[currentMiddle] = new Sample(_objectSpread({}, combine(currentSamples, currentMiddle, p1Average)));
    nextSamples[0] = new Sample(_objectSpread({}, combine(nextSamples, 0, p0Average)));
    nextSamples[nextEnd] = new Sample(_objectSpread({}, combine(nextSamples, nextEnd, p1Average)));
  }
  return outlinedData;
};
var GradientPath = /*#__PURE__*/function () {
  function GradientPath(_ref) {
    _classCallCheck(this, GradientPath);
    var path = _ref.path,
      segments = _ref.segments,
      samples = _ref.samples,
      _ref$precision2 = _ref.precision,
      precision = _ref$precision2 === void 0 ? DEFAULT_PRECISION : _ref$precision2,
      _ref$removeChild = _ref.removeChild,
      removeChild = _ref$removeChild === void 0 ? false : _ref$removeChild; // If the path being passed isn't a DOM node already, make it one
    this.path = convertPathToNode(path);
    this.segments = segments;
    this.samples = samples;
    this.precision = precision; // Check if nodeName is path and that the path is closed, otherwise it's closed by default
    this.pathClosed = this.path.nodeName == "path" ? this.path.getAttribute("d").match(/z/gi) : true; // Store the render cycles that the user creates
    this.renders = []; // Append a group to the SVG to capture everything we render and ensure our paths and circles are properly encapsulated
    this.svg = path.closest("svg");
    this.group = svgElem("g", {
      class: "gradient-path",
      id: "gradient-path-container"
    }); // Get the data
    this.data = getData({
      path: path,
      segments: segments,
      samples: samples,
      precision: precision
    }); // Remove previously created children
    var kids = this.path.parentNode.childNodes;
    for (var _i26 = kids.length - 1; _i26 >= 0; _i26--) {
      if (kids[_i26].id === "gradient-path-container") {
        this.path.parentNode.removeChild(kids[_i26]);
      }
    } // Append the main group to the SVG
    this.svg.appendChild(this.group); // Remove the main path once we have the data values
    if (removeChild) {
      this.path.parentNode.removeChild(this.path);
    }
  }
  return _createClass(GradientPath, [{
    key: "render",
    value: function render(_ref2) {
      var type = _ref2.type,
        stroke = _ref2.stroke,
        strokeWidth = _ref2.strokeWidth,
        fill = _ref2.fill,
        width = _ref2.width; // Store information from this render cycle
      var renderCycle = {}; // Create a group for each element
      var elemGroup = svgElem("g", {
        class: "element-".concat(type)
      });
      this.group.appendChild(elemGroup);
      renderCycle.group = elemGroup;
      if (type === "path") {
        // If we specify a width and fill, then we need to outline the path and then average the join points of the segments
        // If we do not specify a width and fill, then we will be stroking and can leave the data "as is"
        renderCycle.data = width && fill ? strokeToFill(this.data, width, this.precision, this.pathClosed) : this.data;
        for (var _j3 = 0; _j3 < renderCycle.data.length; _j3++) {
          var _renderCycle$data$_j = renderCycle.data[_j3],
            samples = _renderCycle$data$_j.samples,
            progress = _renderCycle$data$_j.progress; // Create a path for each segment and append it to its elemGroup
          elemGroup.appendChild(svgElem("path", _objectSpread({
            class: "path-segment",
            d: segmentToD(samples)
          }, styleAttrs(fill, stroke, strokeWidth, progress))));
        }
      } else if (type === "circle") {
        renderCycle.data = this.data.flatMap(function (_ref3) {
          var samples = _ref3.samples;
          return samples;
        });
        for (var _j4 = 0; _j4 < renderCycle.data.length; _j4++) {
          var _renderCycle$data$_j2 = renderCycle.data[_j4],
            _x9 = _renderCycle$data$_j2.x,
            _y4 = _renderCycle$data$_j2.y,
            _progress = _renderCycle$data$_j2.progress; // Create a circle for each sample and append it to its elemGroup
          elemGroup.appendChild(svgElem("circle", _objectSpread({
            class: "circle-sample",
            cx: _x9,
            cy: _y4,
            r: width / 2
          }, styleAttrs(fill, stroke, strokeWidth, _progress))));
        }
      } // Save the information in the current renderCycle and pop it onto the renders array
      this.renders.push(renderCycle); // Return this for method chaining
      return this;
    }
  }]);
}();
var util;
(function (util) {
  util.assertEqual = function (val) {
    return val;
  };
  function assertIs(_arg) {}
  util.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util.assertNever = assertNever;
  util.arrayToEnum = function (items) {
    var obj = {};
    var _iterator27 = _createForOfIteratorHelper(items),
      _step27;
    try {
      for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
        var item = _step27.value;
        obj[item] = item;
      }
    } catch (err) {
      _iterator27.e(err);
    } finally {
      _iterator27.f();
    }
    return obj;
  };
  util.getValidEnumValues = function (obj) {
    var validKeys = util.objectKeys(obj).filter(function (k) {
      return typeof obj[obj[k]] !== "number";
    });
    var filtered = {};
    var _iterator28 = _createForOfIteratorHelper(validKeys),
      _step28;
    try {
      for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
        var _k9 = _step28.value;
        filtered[_k9] = obj[_k9];
      }
    } catch (err) {
      _iterator28.e(err);
    } finally {
      _iterator28.f();
    }
    return util.objectValues(filtered);
  };
  util.objectValues = function (obj) {
    return util.objectKeys(obj).map(function (e) {
      return obj[e];
    });
  };
  util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
  ? function (obj) {
    return Object.keys(obj);
  } // eslint-disable-line ban/ban
  : function (object) {
    var keys = [];
    for (var key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util.find = function (arr, checker) {
    var _iterator29 = _createForOfIteratorHelper(arr),
      _step29;
    try {
      for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
        var item = _step29.value;
        if (checker(item)) return item;
      }
    } catch (err) {
      _iterator29.e(err);
    } finally {
      _iterator29.f();
    }
    return undefined;
  };
  util.isInteger = typeof Number.isInteger === "function" ? function (val) {
    return Number.isInteger(val);
  } // eslint-disable-line ban/ban
  : function (val) {
    return typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  };
  function joinValues(array) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " | ";
    return array.map(function (val) {
      return typeof val === "string" ? "'".concat(val, "'") : val;
    }).join(separator);
  }
  util.joinValues = joinValues;
  util.jsonStringifyReplacer = function (_, value) {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function (objectUtil) {
  objectUtil.mergeShapes = function (first, second) {
    return _objectSpread(_objectSpread({}, first), second);
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]);
var getParsedType = function getParsedType(data) {
  var t = _typeof2(data);
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
var quotelessJson = function quotelessJson(obj) {
  var json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = /*#__PURE__*/function (_Error) {
  function ZodError(issues) {
    var _this12;
    _classCallCheck(this, ZodError);
    _this12 = _callSuper(this, ZodError);
    _this12.issues = [];
    _this12.addIssue = function (sub) {
      _this12.issues = [].concat(_toConsumableArray(_this12.issues), [sub]);
    };
    _this12.addIssues = function () {
      var subs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      _this12.issues = [].concat(_toConsumableArray(_this12.issues), _toConsumableArray(subs));
    };
    var actualProto = (this instanceof ZodError ? this.constructor : void 0).prototype;
    if (Object.setPrototypeOf) {
      // eslint-disable-next-line ban/ban
      Object.setPrototypeOf(_this12, actualProto);
    } else {
      _this12.__proto__ = actualProto;
    }
    _this12.name = "ZodError";
    _this12.issues = issues;
    return _this12;
  }
  _inherits(ZodError, _Error);
  return _createClass(ZodError, [{
    key: "errors",
    get: function get() {
      return this.issues;
    }
  }, {
    key: "format",
    value: function format(_mapper) {
      var mapper = _mapper || function (issue) {
        return issue.message;
      };
      var fieldErrors = {
        _errors: []
      };
      var _processError = function processError(error) {
        var _iterator30 = _createForOfIteratorHelper(error.issues),
          _step30;
        try {
          for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
            var issue = _step30.value;
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(_processError);
            } else if (issue.code === "invalid_return_type") {
              _processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              _processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              var curr = fieldErrors;
              var _i27 = 0;
              while (_i27 < issue.path.length) {
                var el = issue.path[_i27];
                var terminal = _i27 === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || {
                    _errors: []
                  };
                  // if (typeof el === "string") {
                  //   curr[el] = curr[el] || { _errors: [] };
                  // } else if (typeof el === "number") {
                  //   const errorArray: any = [];
                  //   errorArray._errors = [];
                  //   curr[el] = curr[el] || errorArray;
                  // }
                } else {
                  curr[el] = curr[el] || {
                    _errors: []
                  };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                _i27++;
              }
            }
          }
        } catch (err) {
          _iterator30.e(err);
        } finally {
          _iterator30.f();
        }
      };
      _processError(this);
      return fieldErrors;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.message;
    }
  }, {
    key: "message",
    get: function get() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
  }, {
    key: "isEmpty",
    get: function get() {
      return this.issues.length === 0;
    }
  }, {
    key: "flatten",
    value: function flatten() {
      var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (issue) {
        return issue.message;
      };
      var fieldErrors = {};
      var formErrors = [];
      var _iterator31 = _createForOfIteratorHelper(this.issues),
        _step31;
      try {
        for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
          var sub = _step31.value;
          if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
      } catch (err) {
        _iterator31.e(err);
      } finally {
        _iterator31.f();
      }
      return {
        formErrors: formErrors,
        fieldErrors: fieldErrors
      };
    }
  }, {
    key: "formErrors",
    get: function get() {
      return this.flatten();
    }
  }], [{
    key: "assert",
    value: function assert(value) {
      if (!(value instanceof ZodError)) {
        throw new Error("Not a ZodError: ".concat(value));
      }
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Error));
ZodError.create = function (issues) {
  var error = new ZodError(issues);
  return error;
};
var errorMap = function errorMap(issue, _ctx) {
  var message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = "Expected ".concat(issue.expected, ", received ").concat(issue.received);
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = "Invalid literal value, expected ".concat(JSON.stringify(issue.expected, util.jsonStringifyReplacer));
      break;
    case ZodIssueCode.unrecognized_keys:
      message = "Unrecognized key(s) in object: ".concat(util.joinValues(issue.keys, ", "));
      break;
    case ZodIssueCode.invalid_union:
      message = "Invalid input";
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = "Invalid discriminator value. Expected ".concat(util.joinValues(issue.options));
      break;
    case ZodIssueCode.invalid_enum_value:
      message = "Invalid enum value. Expected ".concat(util.joinValues(issue.options), ", received '").concat(issue.received, "'");
      break;
    case ZodIssueCode.invalid_arguments:
      message = "Invalid function arguments";
      break;
    case ZodIssueCode.invalid_return_type:
      message = "Invalid function return type";
      break;
    case ZodIssueCode.invalid_date:
      message = "Invalid date";
      break;
    case ZodIssueCode.invalid_string:
      if (_typeof2(issue.validation) === "object") {
        if ("includes" in issue.validation) {
          message = "Invalid input: must include \"".concat(issue.validation.includes, "\"");
          if (typeof issue.validation.position === "number") {
            message = "".concat(message, " at one or more positions greater than or equal to ").concat(issue.validation.position);
          }
        } else if ("startsWith" in issue.validation) {
          message = "Invalid input: must start with \"".concat(issue.validation.startsWith, "\"");
        } else if ("endsWith" in issue.validation) {
          message = "Invalid input: must end with \"".concat(issue.validation.endsWith, "\"");
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = "Invalid ".concat(issue.validation);
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array") message = "Array must contain ".concat(issue.exact ? "exactly" : issue.inclusive ? "at least" : "more than", " ").concat(issue.minimum, " element(s)");else if (issue.type === "string") message = "String must contain ".concat(issue.exact ? "exactly" : issue.inclusive ? "at least" : "over", " ").concat(issue.minimum, " character(s)");else if (issue.type === "number") message = "Number must be ".concat(issue.exact ? "exactly equal to " : issue.inclusive ? "greater than or equal to " : "greater than ").concat(issue.minimum);else if (issue.type === "date") message = "Date must be ".concat(issue.exact ? "exactly equal to " : issue.inclusive ? "greater than or equal to " : "greater than ").concat(new Date(Number(issue.minimum)));else message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array") message = "Array must contain ".concat(issue.exact ? "exactly" : issue.inclusive ? "at most" : "less than", " ").concat(issue.maximum, " element(s)");else if (issue.type === "string") message = "String must contain ".concat(issue.exact ? "exactly" : issue.inclusive ? "at most" : "under", " ").concat(issue.maximum, " character(s)");else if (issue.type === "number") message = "Number must be ".concat(issue.exact ? "exactly" : issue.inclusive ? "less than or equal to" : "less than", " ").concat(issue.maximum);else if (issue.type === "bigint") message = "BigInt must be ".concat(issue.exact ? "exactly" : issue.inclusive ? "less than or equal to" : "less than", " ").concat(issue.maximum);else if (issue.type === "date") message = "Date must be ".concat(issue.exact ? "exactly" : issue.inclusive ? "smaller than or equal to" : "smaller than", " ").concat(new Date(Number(issue.maximum)));else message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = "Invalid input";
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = "Intersection results could not be merged";
      break;
    case ZodIssueCode.not_multiple_of:
      message = "Number must be a multiple of ".concat(issue.multipleOf);
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return {
    message: message
  };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = function makeIssue(params) {
  var data = params.data,
    path = params.path,
    errorMaps = params.errorMaps,
    issueData = params.issueData;
  var fullPath = [].concat(_toConsumableArray(path), _toConsumableArray(issueData.path || []));
  var fullIssue = _objectSpread(_objectSpread({}, issueData), {}, {
    path: fullPath
  });
  if (issueData.message !== undefined) {
    return _objectSpread(_objectSpread({}, issueData), {}, {
      path: fullPath,
      message: issueData.message
    });
  }
  var errorMessage = "";
  var maps = errorMaps.filter(function (m) {
    return !!m;
  }).slice().reverse();
  var _iterator32 = _createForOfIteratorHelper(maps),
    _step32;
  try {
    for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
      var map = _step32.value;
      errorMessage = map(fullIssue, {
        data: data,
        defaultError: errorMessage
      }).message;
    }
  } catch (err) {
    _iterator32.e(err);
  } finally {
    _iterator32.f();
  }
  return _objectSpread(_objectSpread({}, issueData), {}, {
    path: fullPath,
    message: errorMessage
  });
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  var overrideMap = getErrorMap();
  var issue = makeIssue({
    issueData: issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [ctx.common.contextualErrorMap,
    // contextual error map is first priority
    ctx.schemaErrorMap,
    // then schema-bound map if available
    overrideMap,
    // then global override map
    overrideMap === errorMap ? undefined : errorMap // then global default map
    ].filter(function (x) {
      return !!x;
    })
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = /*#__PURE__*/function () {
  function ParseStatus() {
    _classCallCheck(this, ParseStatus);
    this.value = "valid";
  }
  return _createClass(ParseStatus, [{
    key: "dirty",
    value: function dirty() {
      if (this.value === "valid") this.value = "dirty";
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this.value !== "aborted") this.value = "aborted";
    }
  }], [{
    key: "mergeArray",
    value: function mergeArray(status, results) {
      var arrayValue = [];
      var _iterator33 = _createForOfIteratorHelper(results),
        _step33;
      try {
        for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
          var _s12 = _step33.value;
          if (_s12.status === "aborted") return INVALID;
          if (_s12.status === "dirty") status.dirty();
          arrayValue.push(_s12.value);
        }
      } catch (err) {
        _iterator33.e(err);
      } finally {
        _iterator33.f();
      }
      return {
        status: status.value,
        value: arrayValue
      };
    }
  }, {
    key: "mergeObjectAsync",
    value: function () {
      var _mergeObjectAsync = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(status, pairs) {
        var syncPairs, _iterator34, _step34, pair, key, value;
        return _regeneratorRuntime().wrap(function _callee6$(_context1) {
          while (1) switch (_context1.prev = _context1.next) {
            case 0:
              syncPairs = [];
              _iterator34 = _createForOfIteratorHelper(pairs);
              _context1.prev = 2;
              _iterator34.s();
            case 4:
              if ((_step34 = _iterator34.n()).done) {
                _context1.next = 15;
                break;
              }
              pair = _step34.value;
              _context1.next = 8;
              return pair.key;
            case 8:
              key = _context1.sent;
              _context1.next = 11;
              return pair.value;
            case 11:
              value = _context1.sent;
              syncPairs.push({
                key: key,
                value: value
              });
            case 13:
              _context1.next = 4;
              break;
            case 15:
              _context1.next = 20;
              break;
            case 17:
              _context1.prev = 17;
              _context1.t0 = _context1["catch"](2);
              _iterator34.e(_context1.t0);
            case 20:
              _context1.prev = 20;
              _iterator34.f();
              return _context1.finish(20);
            case 23:
              return _context1.abrupt("return", ParseStatus.mergeObjectSync(status, syncPairs));
            case 24:
            case "end":
              return _context1.stop();
          }
        }, _callee6, null, [[2, 17, 20, 23]]);
      }));
      function mergeObjectAsync(_x0, _x1) {
        return _mergeObjectAsync.apply(this, arguments);
      }
      return mergeObjectAsync;
    }()
  }, {
    key: "mergeObjectSync",
    value: function mergeObjectSync(status, pairs) {
      var finalObject = {};
      var _iterator35 = _createForOfIteratorHelper(pairs),
        _step35;
      try {
        for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
          var pair = _step35.value;
          var key = pair.key,
            value = pair.value;
          if (key.status === "aborted") return INVALID;
          if (value.status === "aborted") return INVALID;
          if (key.status === "dirty") status.dirty();
          if (value.status === "dirty") status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
      } catch (err) {
        _iterator35.e(err);
      } finally {
        _iterator35.f();
      }
      return {
        status: status.value,
        value: finalObject
      };
    }
  }]);
}();
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = function DIRTY(value) {
  return {
    status: "dirty",
    value: value
  };
};
var OK = function OK(value) {
  return {
    status: "valid",
    value: value
  };
};
var isAborted = function isAborted(x) {
  return x.status === "aborted";
};
var isDirty = function isDirty(x) {
  return x.status === "dirty";
};
var isValid = function isValid(x) {
  return x.status === "valid";
};
var isAsync = function isAsync(x) {
  return typeof Promise !== "undefined" && x instanceof Promise;
};

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

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return state.set(receiver, value), value;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var errorUtil;
(function (errorUtil) {
  errorUtil.errToObj = function (message) {
    return typeof message === "string" ? {
      message: message
    } : message || {};
  };
  errorUtil.toString = function (message) {
    return typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
  };
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache, _ZodNativeEnum_cache;
var ParseInputLazyPath = /*#__PURE__*/function () {
  function ParseInputLazyPath(parent, value, path, key) {
    _classCallCheck(this, ParseInputLazyPath);
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  return _createClass(ParseInputLazyPath, [{
    key: "path",
    get: function get() {
      if (!this._cachedPath.length) {
        if (this._key instanceof Array) {
          var _this$_cachedPath;
          (_this$_cachedPath = this._cachedPath).push.apply(_this$_cachedPath, _toConsumableArray(this._path).concat(_toConsumableArray(this._key)));
        } else {
          var _this$_cachedPath2;
          (_this$_cachedPath2 = this._cachedPath).push.apply(_this$_cachedPath2, _toConsumableArray(this._path).concat([this._key]));
        }
      }
      return this._cachedPath;
    }
  }]);
}();
var handleResult = function handleResult(ctx, result) {
  if (isValid(result)) {
    return {
      success: true,
      data: result.value
    };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error) return this._error;
        var error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params) return {};
  var errorMap = params.errorMap,
    invalid_type_error = params.invalid_type_error,
    required_error = params.required_error,
    description = params.description;
  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
  }
  if (errorMap) return {
    errorMap: errorMap,
    description: description
  };
  var customMap = function customMap(iss, ctx) {
    var _a, _b;
    var message = params.message;
    if (iss.code === "invalid_enum_value") {
      return {
        message: message !== null && message !== void 0 ? message : ctx.defaultError
      };
    }
    if (typeof ctx.data === "undefined") {
      return {
        message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError
      };
    }
    if (iss.code !== "invalid_type") return {
      message: ctx.defaultError
    };
    return {
      message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError
    };
  };
  return {
    errorMap: customMap,
    description: description
  };
}
var ZodType = /*#__PURE__*/function () {
  function ZodType(def) {
    var _this13 = this;
    _classCallCheck(this, ZodType);
    /** Alias of safeParseAsync */
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: function validate(data) {
        return _this13["~validate"](data);
      }
    };
  }
  return _createClass(ZodType, [{
    key: "description",
    get: function get() {
      return this._def.description;
    }
  }, {
    key: "_getType",
    value: function _getType(input) {
      return getParsedType(input.data);
    }
  }, {
    key: "_getOrReturnCtx",
    value: function _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
  }, {
    key: "_processInputParams",
    value: function _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
  }, {
    key: "_parseSync",
    value: function _parseSync(input) {
      var result = this._parse(input);
      if (isAsync(result)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result;
    }
  }, {
    key: "_parseAsync",
    value: function _parseAsync(input) {
      var result = this._parse(input);
      return Promise.resolve(result);
    }
  }, {
    key: "parse",
    value: function parse(data, params) {
      var result = this.safeParse(data, params);
      if (result.success) return result.data;
      throw result.error;
    }
  }, {
    key: "safeParse",
    value: function safeParse(data, params) {
      var _a;
      var ctx = {
        common: {
          issues: [],
          async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
          contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
        },
        path: (params === null || params === void 0 ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: data,
        parsedType: getParsedType(data)
      };
      var result = this._parseSync({
        data: data,
        path: ctx.path,
        parent: ctx
      });
      return handleResult(ctx, result);
    }
  }, {
    key: "~validate",
    value: function validate(data) {
      var _a, _b;
      var ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          var result = this._parseSync({
            data: data,
            path: [],
            parent: ctx
          });
          return isValid(result) ? {
            value: result.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({
        data: data,
        path: [],
        parent: ctx
      }).then(function (result) {
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      });
    }
  }, {
    key: "parseAsync",
    value: function () {
      var _parseAsync2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data, params) {
        var result;
        return _regeneratorRuntime().wrap(function _callee7$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.safeParseAsync(data, params);
            case 2:
              result = _context10.sent;
              if (!result.success) {
                _context10.next = 5;
                break;
              }
              return _context10.abrupt("return", result.data);
            case 5:
              throw result.error;
            case 6:
            case "end":
              return _context10.stop();
          }
        }, _callee7, this);
      }));
      function parseAsync(_x10, _x11) {
        return _parseAsync2.apply(this, arguments);
      }
      return parseAsync;
    }()
  }, {
    key: "safeParseAsync",
    value: function () {
      var _safeParseAsync = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data, params) {
        var ctx, maybeAsyncResult, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              ctx = {
                common: {
                  issues: [],
                  contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                  async: true
                },
                path: (params === null || params === void 0 ? void 0 : params.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: data,
                parsedType: getParsedType(data)
              };
              maybeAsyncResult = this._parse({
                data: data,
                path: ctx.path,
                parent: ctx
              });
              _context11.next = 4;
              return isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult);
            case 4:
              result = _context11.sent;
              return _context11.abrupt("return", handleResult(ctx, result));
            case 6:
            case "end":
              return _context11.stop();
          }
        }, _callee8, this);
      }));
      function safeParseAsync(_x12, _x13) {
        return _safeParseAsync.apply(this, arguments);
      }
      return safeParseAsync;
    }()
  }, {
    key: "refine",
    value: function refine(check, message) {
      var getIssueProperties = function getIssueProperties(val) {
        if (typeof message === "string" || typeof message === "undefined") {
          return {
            message: message
          };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement(function (val, ctx) {
        var result = check(val);
        var setError = function setError() {
          return ctx.addIssue(_objectSpread({
            code: ZodIssueCode.custom
          }, getIssueProperties(val)));
        };
        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then(function (data) {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
  }, {
    key: "refinement",
    value: function refinement(check, refinementData) {
      return this._refinement(function (val, ctx) {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
  }, {
    key: "_refinement",
    value: function _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: {
          type: "refinement",
          refinement: refinement
        }
      });
    }
  }, {
    key: "superRefine",
    value: function superRefine(refinement) {
      return this._refinement(refinement);
    }
  }, {
    key: "optional",
    value: function optional() {
      return ZodOptional.create(this, this._def);
    }
  }, {
    key: "nullable",
    value: function nullable() {
      return ZodNullable.create(this, this._def);
    }
  }, {
    key: "nullish",
    value: function nullish() {
      return this.nullable().optional();
    }
  }, {
    key: "array",
    value: function array() {
      return ZodArray.create(this);
    }
  }, {
    key: "promise",
    value: function promise() {
      return ZodPromise.create(this, this._def);
    }
  }, {
    key: "or",
    value: function or(option) {
      return ZodUnion.create([this, option], this._def);
    }
  }, {
    key: "and",
    value: function and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
  }, {
    key: "transform",
    value: function transform(_transform) {
      return new ZodEffects(_objectSpread(_objectSpread({}, processCreateParams(this._def)), {}, {
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: {
          type: "transform",
          transform: _transform
        }
      }));
    }
  }, {
    key: "default",
    value: function _default(def) {
      var defaultValueFunc = typeof def === "function" ? def : function () {
        return def;
      };
      return new ZodDefault(_objectSpread(_objectSpread({}, processCreateParams(this._def)), {}, {
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      }));
    }
  }, {
    key: "brand",
    value: function brand() {
      return new ZodBranded(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this
      }, processCreateParams(this._def)));
    }
  }, {
    key: "catch",
    value: function _catch(def) {
      var catchValueFunc = typeof def === "function" ? def : function () {
        return def;
      };
      return new ZodCatch(_objectSpread(_objectSpread({}, processCreateParams(this._def)), {}, {
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      }));
    }
  }, {
    key: "describe",
    value: function describe(description) {
      var This = this.constructor;
      return new This(_objectSpread(_objectSpread({}, this._def), {}, {
        description: description
      }));
    }
  }, {
    key: "pipe",
    value: function pipe(target) {
      return ZodPipeline.create(this, target);
    }
  }, {
    key: "readonly",
    value: function readonly() {
      return ZodReadonly.create(this);
    }
  }, {
    key: "isOptional",
    value: function isOptional() {
      return this.safeParse(undefined).success;
    }
  }, {
    key: "isNullable",
    value: function isNullable() {
      return this.safeParse(null).success;
    }
  }]);
}();
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
var _emojiRegex = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
var emojiRegex;
// faster, simpler, safer
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
// const ipv6Regex =
// /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// https://base64.guru/standards/base64url
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
var dateRegexSource = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))";
var dateRegex = new RegExp("^".concat(dateRegexSource, "$"));
function timeRegexSource(args) {
  var secondsRegexSource = "[0-5]\\d";
  if (args.precision) {
    secondsRegexSource = "".concat(secondsRegexSource, "\\.\\d{").concat(args.precision, "}");
  } else if (args.precision == null) {
    secondsRegexSource = "".concat(secondsRegexSource, "(\\.\\d+)?");
  }
  var secondsQuantifier = args.precision ? "+" : "?"; // require seconds if precision is nonzero
  return "([01]\\d|2[0-3]):[0-5]\\d(:".concat(secondsRegexSource, ")").concat(secondsQuantifier);
}
function timeRegex(args) {
  return new RegExp("^".concat(timeRegexSource(args), "$"));
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
  var regex = "".concat(dateRegexSource, "T").concat(timeRegexSource(args));
  var opts = [];
  opts.push(args.local ? "Z?" : "Z");
  if (args.offset) opts.push("([+-]\\d{2}:?\\d{2})");
  regex = "".concat(regex, "(").concat(opts.join("|"), ")");
  return new RegExp("^".concat(regex, "$"));
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt)) return false;
  try {
    var _jwt$split = jwt.split("."),
      _jwt$split2 = _slicedToArray(_jwt$split, 1),
      header = _jwt$split2[0];
    // Convert base64url to base64
    var base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    var decoded = JSON.parse(atob(base64));
    if (_typeof2(decoded) !== "object" || decoded === null) return false;
    if (!decoded.typ || !decoded.alg) return false;
    if (alg && decoded.alg !== alg) return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = /*#__PURE__*/function (_ZodType) {
  function ZodString() {
    _classCallCheck(this, ZodString);
    return _callSuper(this, ZodString, arguments);
  }
  _inherits(ZodString, _ZodType);
  return _createClass(ZodString, [{
    key: "_parse",
    value: function _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        var _ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(_ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: _ctx2.parsedType
        });
        return INVALID;
      }
      var status = new ParseStatus();
      var ctx = undefined;
      var _iterator36 = _createForOfIteratorHelper(this._def.checks),
        _step36;
      try {
        for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
          var check = _step36.value;
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            var tooBig = input.data.length > check.value;
            var tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch (_a) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            var testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: {
                  includes: check.value,
                  position: check.position
                },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: {
                  startsWith: check.value
                },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: {
                  endsWith: check.value
                },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            var regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            var _regex3 = dateRegex;
            if (!_regex3.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            var _regex4 = timeRegex(check);
            if (!_regex4.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
      } catch (err) {
        _iterator36.e(err);
      } finally {
        _iterator36.f();
      }
      return {
        status: status.value,
        value: input.data
      };
    }
  }, {
    key: "_regex",
    value: function _regex(regex, validation, message) {
      return this.refinement(function (data) {
        return regex.test(data);
      }, _objectSpread({
        validation: validation,
        code: ZodIssueCode.invalid_string
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "_addCheck",
    value: function _addCheck(check) {
      return new ZodString(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [check])
      }));
    }
  }, {
    key: "email",
    value: function email(message) {
      return this._addCheck(_objectSpread({
        kind: "email"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "url",
    value: function url(message) {
      return this._addCheck(_objectSpread({
        kind: "url"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "emoji",
    value: function emoji(message) {
      return this._addCheck(_objectSpread({
        kind: "emoji"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "uuid",
    value: function uuid(message) {
      return this._addCheck(_objectSpread({
        kind: "uuid"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "nanoid",
    value: function nanoid(message) {
      return this._addCheck(_objectSpread({
        kind: "nanoid"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "cuid",
    value: function cuid(message) {
      return this._addCheck(_objectSpread({
        kind: "cuid"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "cuid2",
    value: function cuid2(message) {
      return this._addCheck(_objectSpread({
        kind: "cuid2"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "ulid",
    value: function ulid(message) {
      return this._addCheck(_objectSpread({
        kind: "ulid"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "base64",
    value: function base64(message) {
      return this._addCheck(_objectSpread({
        kind: "base64"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "base64url",
    value: function base64url(message) {
      // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
      return this._addCheck(_objectSpread({
        kind: "base64url"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "jwt",
    value: function jwt(options) {
      return this._addCheck(_objectSpread({
        kind: "jwt"
      }, errorUtil.errToObj(options)));
    }
  }, {
    key: "ip",
    value: function ip(options) {
      return this._addCheck(_objectSpread({
        kind: "ip"
      }, errorUtil.errToObj(options)));
    }
  }, {
    key: "cidr",
    value: function cidr(options) {
      return this._addCheck(_objectSpread({
        kind: "cidr"
      }, errorUtil.errToObj(options)));
    }
  }, {
    key: "datetime",
    value: function datetime(options) {
      var _a, _b;
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck(_objectSpread({
        kind: "datetime",
        precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
        offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
        local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false
      }, errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
    }
  }, {
    key: "date",
    value: function date(message) {
      return this._addCheck({
        kind: "date",
        message: message
      });
    }
  }, {
    key: "time",
    value: function time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck(_objectSpread({
        kind: "time",
        precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision
      }, errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
    }
  }, {
    key: "duration",
    value: function duration(message) {
      return this._addCheck(_objectSpread({
        kind: "duration"
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "regex",
    value: function regex(_regex2, message) {
      return this._addCheck(_objectSpread({
        kind: "regex",
        regex: _regex2
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "includes",
    value: function includes(value, options) {
      return this._addCheck(_objectSpread({
        kind: "includes",
        value: value,
        position: options === null || options === void 0 ? void 0 : options.position
      }, errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)));
    }
  }, {
    key: "startsWith",
    value: function startsWith(value, message) {
      return this._addCheck(_objectSpread({
        kind: "startsWith",
        value: value
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "endsWith",
    value: function endsWith(value, message) {
      return this._addCheck(_objectSpread({
        kind: "endsWith",
        value: value
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "min",
    value: function min(minLength, message) {
      return this._addCheck(_objectSpread({
        kind: "min",
        value: minLength
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "max",
    value: function max(maxLength, message) {
      return this._addCheck(_objectSpread({
        kind: "max",
        value: maxLength
      }, errorUtil.errToObj(message)));
    }
  }, {
    key: "length",
    value: function length(len, message) {
      return this._addCheck(_objectSpread({
        kind: "length",
        value: len
      }, errorUtil.errToObj(message)));
    }
    /**
     * Equivalent to `.min(1)`
     */
  }, {
    key: "nonempty",
    value: function nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
  }, {
    key: "trim",
    value: function trim() {
      return new ZodString(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [{
          kind: "trim"
        }])
      }));
    }
  }, {
    key: "toLowerCase",
    value: function toLowerCase() {
      return new ZodString(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [{
          kind: "toLowerCase"
        }])
      }));
    }
  }, {
    key: "toUpperCase",
    value: function toUpperCase() {
      return new ZodString(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [{
          kind: "toUpperCase"
        }])
      }));
    }
  }, {
    key: "isDatetime",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "datetime";
      });
    }
  }, {
    key: "isDate",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "date";
      });
    }
  }, {
    key: "isTime",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "time";
      });
    }
  }, {
    key: "isDuration",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "duration";
      });
    }
  }, {
    key: "isEmail",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "email";
      });
    }
  }, {
    key: "isURL",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "url";
      });
    }
  }, {
    key: "isEmoji",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "emoji";
      });
    }
  }, {
    key: "isUUID",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "uuid";
      });
    }
  }, {
    key: "isNANOID",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "nanoid";
      });
    }
  }, {
    key: "isCUID",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "cuid";
      });
    }
  }, {
    key: "isCUID2",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "cuid2";
      });
    }
  }, {
    key: "isULID",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "ulid";
      });
    }
  }, {
    key: "isIP",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "ip";
      });
    }
  }, {
    key: "isCIDR",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "cidr";
      });
    }
  }, {
    key: "isBase64",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "base64";
      });
    }
  }, {
    key: "isBase64url",
    get: function get() {
      // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "base64url";
      });
    }
  }, {
    key: "minLength",
    get: function get() {
      var min = null;
      var _iterator37 = _createForOfIteratorHelper(this._def.checks),
        _step37;
      try {
        for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
          var ch = _step37.value;
          if (ch.kind === "min") {
            if (min === null || ch.value > min) min = ch.value;
          }
        }
      } catch (err) {
        _iterator37.e(err);
      } finally {
        _iterator37.f();
      }
      return min;
    }
  }, {
    key: "maxLength",
    get: function get() {
      var max = null;
      var _iterator38 = _createForOfIteratorHelper(this._def.checks),
        _step38;
      try {
        for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
          var ch = _step38.value;
          if (ch.kind === "max") {
            if (max === null || ch.value < max) max = ch.value;
          }
        }
      } catch (err) {
        _iterator38.e(err);
      } finally {
        _iterator38.f();
      }
      return max;
    }
  }]);
}(ZodType);
ZodString.create = function (params) {
  var _a;
  return new ZodString(_objectSpread({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false
  }, processCreateParams(params)));
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
  var valDecCount = (val.toString().split(".")[1] || "").length;
  var stepDecCount = (step.toString().split(".")[1] || "").length;
  var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  var valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  var stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = /*#__PURE__*/function (_ZodType2) {
  function ZodNumber() {
    var _this14;
    _classCallCheck(this, ZodNumber);
    _this14 = _callSuper(this, ZodNumber, arguments);
    _this14.min = _this14.gte;
    _this14.max = _this14.lte;
    _this14.step = _this14.multipleOf;
    return _this14;
  }
  _inherits(ZodNumber, _ZodType2);
  return _createClass(ZodNumber, [{
    key: "_parse",
    value: function _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        var _ctx3 = this._getOrReturnCtx(input);
        addIssueToContext(_ctx3, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: _ctx3.parsedType
        });
        return INVALID;
      }
      var ctx = undefined;
      var status = new ParseStatus();
      var _iterator39 = _createForOfIteratorHelper(this._def.checks),
        _step39;
      try {
        for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
          var check = _step39.value;
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            var tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            var tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
      } catch (err) {
        _iterator39.e(err);
      } finally {
        _iterator39.f();
      }
      return {
        status: status.value,
        value: input.data
      };
    }
  }, {
    key: "gte",
    value: function gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
  }, {
    key: "gt",
    value: function gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
  }, {
    key: "lte",
    value: function lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
  }, {
    key: "lt",
    value: function lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
  }, {
    key: "setLimit",
    value: function setLimit(kind, value, inclusive, message) {
      return new ZodNumber(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [{
          kind: kind,
          value: value,
          inclusive: inclusive,
          message: errorUtil.toString(message)
        }])
      }));
    }
  }, {
    key: "_addCheck",
    value: function _addCheck(check) {
      return new ZodNumber(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [check])
      }));
    }
  }, {
    key: "int",
    value: function int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "positive",
    value: function positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "negative",
    value: function negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "nonpositive",
    value: function nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "nonnegative",
    value: function nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "multipleOf",
    value: function multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value: value,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "finite",
    value: function finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "safe",
    value: function safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "minValue",
    get: function get() {
      var min = null;
      var _iterator40 = _createForOfIteratorHelper(this._def.checks),
        _step40;
      try {
        for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
          var ch = _step40.value;
          if (ch.kind === "min") {
            if (min === null || ch.value > min) min = ch.value;
          }
        }
      } catch (err) {
        _iterator40.e(err);
      } finally {
        _iterator40.f();
      }
      return min;
    }
  }, {
    key: "maxValue",
    get: function get() {
      var max = null;
      var _iterator41 = _createForOfIteratorHelper(this._def.checks),
        _step41;
      try {
        for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
          var ch = _step41.value;
          if (ch.kind === "max") {
            if (max === null || ch.value < max) max = ch.value;
          }
        }
      } catch (err) {
        _iterator41.e(err);
      } finally {
        _iterator41.f();
      }
      return max;
    }
  }, {
    key: "isInt",
    get: function get() {
      return !!this._def.checks.find(function (ch) {
        return ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value);
      });
    }
  }, {
    key: "isFinite",
    get: function get() {
      var max = null,
        min = null;
      var _iterator42 = _createForOfIteratorHelper(this._def.checks),
        _step42;
      try {
        for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {
          var ch = _step42.value;
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min) min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max) max = ch.value;
          }
        }
      } catch (err) {
        _iterator42.e(err);
      } finally {
        _iterator42.f();
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }]);
}(ZodType);
ZodNumber.create = function (params) {
  return new ZodNumber(_objectSpread({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
var ZodBigInt = /*#__PURE__*/function (_ZodType3) {
  function ZodBigInt() {
    var _this15;
    _classCallCheck(this, ZodBigInt);
    _this15 = _callSuper(this, ZodBigInt, arguments);
    _this15.min = _this15.gte;
    _this15.max = _this15.lte;
    return _this15;
  }
  _inherits(ZodBigInt, _ZodType3);
  return _createClass(ZodBigInt, [{
    key: "_parse",
    value: function _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch (_a) {
          return this._getInvalidInput(input);
        }
      }
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      var ctx = undefined;
      var status = new ParseStatus();
      var _iterator43 = _createForOfIteratorHelper(this._def.checks),
        _step43;
      try {
        for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
          var check = _step43.value;
          if (check.kind === "min") {
            var tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            var tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
      } catch (err) {
        _iterator43.e(err);
      } finally {
        _iterator43.f();
      }
      return {
        status: status.value,
        value: input.data
      };
    }
  }, {
    key: "_getInvalidInput",
    value: function _getInvalidInput(input) {
      var ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }, {
    key: "gte",
    value: function gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
  }, {
    key: "gt",
    value: function gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
  }, {
    key: "lte",
    value: function lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
  }, {
    key: "lt",
    value: function lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
  }, {
    key: "setLimit",
    value: function setLimit(kind, value, inclusive, message) {
      return new ZodBigInt(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [{
          kind: kind,
          value: value,
          inclusive: inclusive,
          message: errorUtil.toString(message)
        }])
      }));
    }
  }, {
    key: "_addCheck",
    value: function _addCheck(check) {
      return new ZodBigInt(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [check])
      }));
    }
  }, {
    key: "positive",
    value: function positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "negative",
    value: function negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "nonpositive",
    value: function nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "nonnegative",
    value: function nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "multipleOf",
    value: function multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value: value,
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "minValue",
    get: function get() {
      var min = null;
      var _iterator44 = _createForOfIteratorHelper(this._def.checks),
        _step44;
      try {
        for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {
          var ch = _step44.value;
          if (ch.kind === "min") {
            if (min === null || ch.value > min) min = ch.value;
          }
        }
      } catch (err) {
        _iterator44.e(err);
      } finally {
        _iterator44.f();
      }
      return min;
    }
  }, {
    key: "maxValue",
    get: function get() {
      var max = null;
      var _iterator45 = _createForOfIteratorHelper(this._def.checks),
        _step45;
      try {
        for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {
          var ch = _step45.value;
          if (ch.kind === "max") {
            if (max === null || ch.value < max) max = ch.value;
          }
        }
      } catch (err) {
        _iterator45.e(err);
      } finally {
        _iterator45.f();
      }
      return max;
    }
  }]);
}(ZodType);
ZodBigInt.create = function (params) {
  var _a;
  return new ZodBigInt(_objectSpread({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false
  }, processCreateParams(params)));
};
var ZodBoolean = /*#__PURE__*/function (_ZodType4) {
  function ZodBoolean() {
    _classCallCheck(this, ZodBoolean);
    return _callSuper(this, ZodBoolean, arguments);
  }
  _inherits(ZodBoolean, _ZodType4);
  return _createClass(ZodBoolean, [{
    key: "_parse",
    value: function _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodBoolean.create = function (params) {
  return new ZodBoolean(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
var ZodDate = /*#__PURE__*/function (_ZodType5) {
  function ZodDate() {
    _classCallCheck(this, ZodDate);
    return _callSuper(this, ZodDate, arguments);
  }
  _inherits(ZodDate, _ZodType5);
  return _createClass(ZodDate, [{
    key: "_parse",
    value: function _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        var _ctx4 = this._getOrReturnCtx(input);
        addIssueToContext(_ctx4, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: _ctx4.parsedType
        });
        return INVALID;
      }
      if (isNaN(input.data.getTime())) {
        var _ctx5 = this._getOrReturnCtx(input);
        addIssueToContext(_ctx5, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      var status = new ParseStatus();
      var ctx = undefined;
      var _iterator46 = _createForOfIteratorHelper(this._def.checks),
        _step46;
      try {
        for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {
          var check = _step46.value;
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
      } catch (err) {
        _iterator46.e(err);
      } finally {
        _iterator46.f();
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
  }, {
    key: "_addCheck",
    value: function _addCheck(check) {
      return new ZodDate(_objectSpread(_objectSpread({}, this._def), {}, {
        checks: [].concat(_toConsumableArray(this._def.checks), [check])
      }));
    }
  }, {
    key: "min",
    value: function min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "max",
    value: function max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
  }, {
    key: "minDate",
    get: function get() {
      var min = null;
      var _iterator47 = _createForOfIteratorHelper(this._def.checks),
        _step47;
      try {
        for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
          var ch = _step47.value;
          if (ch.kind === "min") {
            if (min === null || ch.value > min) min = ch.value;
          }
        }
      } catch (err) {
        _iterator47.e(err);
      } finally {
        _iterator47.f();
      }
      return min != null ? new Date(min) : null;
    }
  }, {
    key: "maxDate",
    get: function get() {
      var max = null;
      var _iterator48 = _createForOfIteratorHelper(this._def.checks),
        _step48;
      try {
        for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {
          var ch = _step48.value;
          if (ch.kind === "max") {
            if (max === null || ch.value < max) max = ch.value;
          }
        }
      } catch (err) {
        _iterator48.e(err);
      } finally {
        _iterator48.f();
      }
      return max != null ? new Date(max) : null;
    }
  }]);
}(ZodType);
ZodDate.create = function (params) {
  return new ZodDate(_objectSpread({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate
  }, processCreateParams(params)));
};
var ZodSymbol = /*#__PURE__*/function (_ZodType6) {
  function ZodSymbol() {
    _classCallCheck(this, ZodSymbol);
    return _callSuper(this, ZodSymbol, arguments);
  }
  _inherits(ZodSymbol, _ZodType6);
  return _createClass(ZodSymbol, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodSymbol.create = function (params) {
  return new ZodSymbol(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodSymbol
  }, processCreateParams(params)));
};
var ZodUndefined = /*#__PURE__*/function (_ZodType7) {
  function ZodUndefined() {
    _classCallCheck(this, ZodUndefined);
    return _callSuper(this, ZodUndefined, arguments);
  }
  _inherits(ZodUndefined, _ZodType7);
  return _createClass(ZodUndefined, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodUndefined.create = function (params) {
  return new ZodUndefined(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodUndefined
  }, processCreateParams(params)));
};
var ZodNull = /*#__PURE__*/function (_ZodType8) {
  function ZodNull() {
    _classCallCheck(this, ZodNull);
    return _callSuper(this, ZodNull, arguments);
  }
  _inherits(ZodNull, _ZodType8);
  return _createClass(ZodNull, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodNull.create = function (params) {
  return new ZodNull(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodNull
  }, processCreateParams(params)));
};
var ZodAny = /*#__PURE__*/function (_ZodType9) {
  function ZodAny() {
    var _this16;
    _classCallCheck(this, ZodAny);
    _this16 = _callSuper(this, ZodAny, arguments);
    // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
    _this16._any = true;
    return _this16;
  }
  _inherits(ZodAny, _ZodType9);
  return _createClass(ZodAny, [{
    key: "_parse",
    value: function _parse(input) {
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodAny.create = function (params) {
  return new ZodAny(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodAny
  }, processCreateParams(params)));
};
var ZodUnknown = /*#__PURE__*/function (_ZodType0) {
  function ZodUnknown() {
    var _this17;
    _classCallCheck(this, ZodUnknown);
    _this17 = _callSuper(this, ZodUnknown, arguments);
    // required
    _this17._unknown = true;
    return _this17;
  }
  _inherits(ZodUnknown, _ZodType0);
  return _createClass(ZodUnknown, [{
    key: "_parse",
    value: function _parse(input) {
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodUnknown.create = function (params) {
  return new ZodUnknown(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodUnknown
  }, processCreateParams(params)));
};
var ZodNever = /*#__PURE__*/function (_ZodType1) {
  function ZodNever() {
    _classCallCheck(this, ZodNever);
    return _callSuper(this, ZodNever, arguments);
  }
  _inherits(ZodNever, _ZodType1);
  return _createClass(ZodNever, [{
    key: "_parse",
    value: function _parse(input) {
      var ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }]);
}(ZodType);
ZodNever.create = function (params) {
  return new ZodNever(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodNever
  }, processCreateParams(params)));
};
var ZodVoid = /*#__PURE__*/function (_ZodType10) {
  function ZodVoid() {
    _classCallCheck(this, ZodVoid);
    return _callSuper(this, ZodVoid, arguments);
  }
  _inherits(ZodVoid, _ZodType10);
  return _createClass(ZodVoid, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }]);
}(ZodType);
ZodVoid.create = function (params) {
  return new ZodVoid(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodVoid
  }, processCreateParams(params)));
};
var ZodArray = /*#__PURE__*/function (_ZodType11) {
  function ZodArray() {
    _classCallCheck(this, ZodArray);
    return _callSuper(this, ZodArray, arguments);
  }
  _inherits(ZodArray, _ZodType11);
  return _createClass(ZodArray, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa = this._processInputParams(input),
        ctx = _this$_processInputPa.ctx,
        status = _this$_processInputPa.status;
      var def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        var tooBig = ctx.data.length > def.exactLength.value;
        var tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : undefined,
            maximum: tooBig ? def.exactLength.value : undefined,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all(_toConsumableArray(ctx.data).map(function (item, i) {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then(function (result) {
          return ParseStatus.mergeArray(status, result);
        });
      }
      var result = _toConsumableArray(ctx.data).map(function (item, i) {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result);
    }
  }, {
    key: "element",
    get: function get() {
      return this._def.type;
    }
  }, {
    key: "min",
    value: function min(minLength, message) {
      return new ZodArray(_objectSpread(_objectSpread({}, this._def), {}, {
        minLength: {
          value: minLength,
          message: errorUtil.toString(message)
        }
      }));
    }
  }, {
    key: "max",
    value: function max(maxLength, message) {
      return new ZodArray(_objectSpread(_objectSpread({}, this._def), {}, {
        maxLength: {
          value: maxLength,
          message: errorUtil.toString(message)
        }
      }));
    }
  }, {
    key: "length",
    value: function length(len, message) {
      return new ZodArray(_objectSpread(_objectSpread({}, this._def), {}, {
        exactLength: {
          value: len,
          message: errorUtil.toString(message)
        }
      }));
    }
  }, {
    key: "nonempty",
    value: function nonempty(message) {
      return this.min(1, message);
    }
  }]);
}(ZodType);
ZodArray.create = function (schema, params) {
  return new ZodArray(_objectSpread({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray
  }, processCreateParams(params)));
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    var newShape = {};
    for (var key in schema.shape) {
      var fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject(_objectSpread(_objectSpread({}, schema._def), {}, {
      shape: function shape() {
        return newShape;
      }
    }));
  } else if (schema instanceof ZodArray) {
    return new ZodArray(_objectSpread(_objectSpread({}, schema._def), {}, {
      type: deepPartialify(schema.element)
    }));
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map(function (item) {
      return deepPartialify(item);
    }));
  } else {
    return schema;
  }
}
var ZodObject = /*#__PURE__*/function (_ZodType12) {
  function ZodObject() {
    var _this18;
    _classCallCheck(this, ZodObject);
    _this18 = _callSuper(this, ZodObject, arguments);
    _this18._cached = null;
    /**
     * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
     * If you want to pass through unknown properties, use `.passthrough()` instead.
     */
    _this18.nonstrict = _this18.passthrough;
    // extend<
    //   Augmentation extends ZodRawShape,
    //   NewOutput extends util.flatten<{
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   }>,
    //   NewInput extends util.flatten<{
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }>
    // >(
    //   augmentation: Augmentation
    // ): ZodObject<
    //   extendShape<T, Augmentation>,
    //   UnknownKeys,
    //   Catchall,
    //   NewOutput,
    //   NewInput
    // > {
    //   return new ZodObject({
    //     ...this._def,
    //     shape: () => ({
    //       ...this._def.shape(),
    //       ...augmentation,
    //     }),
    //   }) as any;
    // }
    /**
     * @deprecated Use `.extend` instead
     *  */
    _this18.augment = _this18.extend;
    return _this18;
  }
  _inherits(ZodObject, _ZodType12);
  return _createClass(ZodObject, [{
    key: "_getCached",
    value: function _getCached() {
      if (this._cached !== null) return this._cached;
      var shape = this._def.shape();
      var keys = util.objectKeys(shape);
      return this._cached = {
        shape: shape,
        keys: keys
      };
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        var _ctx6 = this._getOrReturnCtx(input);
        addIssueToContext(_ctx6, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: _ctx6.parsedType
        });
        return INVALID;
      }
      var _this$_processInputPa2 = this._processInputParams(input),
        status = _this$_processInputPa2.status,
        ctx = _this$_processInputPa2.ctx;
      var _this$_getCached = this._getCached(),
        shape = _this$_getCached.shape,
        shapeKeys = _this$_getCached.keys;
      var extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (var key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      var pairs = [];
      var _iterator49 = _createForOfIteratorHelper(shapeKeys),
        _step49;
      try {
        for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {
          var _key0 = _step49.value;
          var keyValidator = shape[_key0];
          var _value2 = ctx.data[_key0];
          pairs.push({
            key: {
              status: "valid",
              value: _key0
            },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, _value2, ctx.path, _key0)),
            alwaysSet: _key0 in ctx.data
          });
        }
      } catch (err) {
        _iterator49.e(err);
      } finally {
        _iterator49.f();
      }
      if (this._def.catchall instanceof ZodNever) {
        var unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          var _iterator50 = _createForOfIteratorHelper(extraKeys),
            _step50;
          try {
            for (_iterator50.s(); !(_step50 = _iterator50.n()).done;) {
              var _key7 = _step50.value;
              pairs.push({
                key: {
                  status: "valid",
                  value: _key7
                },
                value: {
                  status: "valid",
                  value: ctx.data[_key7]
                }
              });
            }
          } catch (err) {
            _iterator50.e(err);
          } finally {
            _iterator50.f();
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") ;else {
          throw new Error("Internal ZodObject error: invalid unknownKeys value.");
        }
      } else {
        // run catchall validation
        var catchall = this._def.catchall;
        var _iterator51 = _createForOfIteratorHelper(extraKeys),
          _step51;
        try {
          for (_iterator51.s(); !(_step51 = _iterator51.n()).done;) {
            var _key8 = _step51.value;
            var value = ctx.data[_key8];
            pairs.push({
              key: {
                status: "valid",
                value: _key8
              },
              value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, _key8) //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: _key8 in ctx.data
            });
          }
        } catch (err) {
          _iterator51.e(err);
        } finally {
          _iterator51.f();
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
          var syncPairs, _iterator52, _step52, pair, _key9, _value;
          return _regeneratorRuntime().wrap(function _callee9$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                syncPairs = [];
                _iterator52 = _createForOfIteratorHelper(pairs);
                _context12.prev = 2;
                _iterator52.s();
              case 4:
                if ((_step52 = _iterator52.n()).done) {
                  _context12.next = 15;
                  break;
                }
                pair = _step52.value;
                _context12.next = 8;
                return pair.key;
              case 8:
                _key9 = _context12.sent;
                _context12.next = 11;
                return pair.value;
              case 11:
                _value = _context12.sent;
                syncPairs.push({
                  key: _key9,
                  value: _value,
                  alwaysSet: pair.alwaysSet
                });
              case 13:
                _context12.next = 4;
                break;
              case 15:
                _context12.next = 20;
                break;
              case 17:
                _context12.prev = 17;
                _context12.t0 = _context12["catch"](2);
                _iterator52.e(_context12.t0);
              case 20:
                _context12.prev = 20;
                _iterator52.f();
                return _context12.finish(20);
              case 23:
                return _context12.abrupt("return", syncPairs);
              case 24:
              case "end":
                return _context12.stop();
            }
          }, _callee9, null, [[2, 17, 20, 23]]);
        }))).then(function (syncPairs) {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
  }, {
    key: "shape",
    get: function get() {
      return this._def.shape();
    }
  }, {
    key: "strict",
    value: function strict(message) {
      var _this19 = this;
      errorUtil.errToObj;
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        unknownKeys: "strict"
      }, message !== undefined ? {
        errorMap: function errorMap(issue, ctx) {
          var _a, _b, _c, _d;
          var defaultError = (_c = (_b = (_a = _this19._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys") return {
            message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
          };
          return {
            message: defaultError
          };
        }
      } : {}));
    }
  }, {
    key: "strip",
    value: function strip() {
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        unknownKeys: "strip"
      }));
    }
  }, {
    key: "passthrough",
    value: function passthrough() {
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        unknownKeys: "passthrough"
      }));
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
  }, {
    key: "extend",
    value: function extend(augmentation) {
      var _this20 = this;
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        shape: function shape() {
          return _objectSpread(_objectSpread({}, _this20._def.shape()), augmentation);
        }
      }));
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
  }, {
    key: "merge",
    value: function merge(merging) {
      var _this21 = this;
      var merged = new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: function shape() {
          return _objectSpread(_objectSpread({}, _this21._def.shape()), merging._def.shape());
        },
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
  }, {
    key: "setKey",
    value: function setKey(key, schema) {
      return this.augment(_defineProperty({}, key, schema));
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
  }, {
    key: "catchall",
    value: function catchall(index) {
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        catchall: index
      }));
    }
  }, {
    key: "pick",
    value: function pick(mask) {
      var _this22 = this;
      var _shape = {};
      util.objectKeys(mask).forEach(function (key) {
        if (mask[key] && _this22.shape[key]) {
          _shape[key] = _this22.shape[key];
        }
      });
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        shape: function shape() {
          return _shape;
        }
      }));
    }
  }, {
    key: "omit",
    value: function omit(mask) {
      var _this23 = this;
      var _shape2 = {};
      util.objectKeys(this.shape).forEach(function (key) {
        if (!mask[key]) {
          _shape2[key] = _this23.shape[key];
        }
      });
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        shape: function shape() {
          return _shape2;
        }
      }));
    }
    /**
     * @deprecated
     */
  }, {
    key: "deepPartial",
    value: function deepPartial() {
      return deepPartialify(this);
    }
  }, {
    key: "partial",
    value: function partial(mask) {
      var _this24 = this;
      var newShape = {};
      util.objectKeys(this.shape).forEach(function (key) {
        var fieldSchema = _this24.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      });
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        shape: function shape() {
          return newShape;
        }
      }));
    }
  }, {
    key: "required",
    value: function required(mask) {
      var _this25 = this;
      var newShape = {};
      util.objectKeys(this.shape).forEach(function (key) {
        if (mask && !mask[key]) {
          newShape[key] = _this25.shape[key];
        } else {
          var fieldSchema = _this25.shape[key];
          var newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      });
      return new ZodObject(_objectSpread(_objectSpread({}, this._def), {}, {
        shape: function shape() {
          return newShape;
        }
      }));
    }
  }, {
    key: "keyof",
    value: function keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }]);
}(ZodType);
ZodObject.create = function (_shape3, params) {
  return new ZodObject(_objectSpread({
    shape: function shape() {
      return _shape3;
    },
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.strictCreate = function (_shape4, params) {
  return new ZodObject(_objectSpread({
    shape: function shape() {
      return _shape4;
    },
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.lazycreate = function (shape, params) {
  return new ZodObject(_objectSpread({
    shape: shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
var ZodUnion = /*#__PURE__*/function (_ZodType13) {
  function ZodUnion() {
    _classCallCheck(this, ZodUnion);
    return _callSuper(this, ZodUnion, arguments);
  }
  _inherits(ZodUnion, _ZodType13);
  return _createClass(ZodUnion, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa3 = this._processInputParams(input),
        ctx = _this$_processInputPa3.ctx;
      var options = this._def.options;
      function handleResults(results) {
        // return first issue-free validation if it exists
        var _iterator53 = _createForOfIteratorHelper(results),
          _step53;
        try {
          for (_iterator53.s(); !(_step53 = _iterator53.n()).done;) {
            var result = _step53.value;
            if (result.result.status === "valid") {
              return result.result;
            }
          }
        } catch (err) {
          _iterator53.e(err);
        } finally {
          _iterator53.f();
        }
        var _iterator54 = _createForOfIteratorHelper(results),
          _step54;
        try {
          for (_iterator54.s(); !(_step54 = _iterator54.n()).done;) {
            var _result2 = _step54.value;
            if (_result2.result.status === "dirty") {
              var _ctx$common$issues;
              // add issues from dirty option
              (_ctx$common$issues = ctx.common.issues).push.apply(_ctx$common$issues, _toConsumableArray(_result2.ctx.common.issues));
              return _result2.result;
            }
          }
          // return invalid
        } catch (err) {
          _iterator54.e(err);
        } finally {
          _iterator54.f();
        }
        var unionErrors = results.map(function (result) {
          return new ZodError(result.ctx.common.issues);
        });
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors: unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(/*#__PURE__*/function () {
          var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0(option) {
            var childCtx;
            return _regeneratorRuntime().wrap(function _callee0$(_context13) {
              while (1) switch (_context13.prev = _context13.next) {
                case 0:
                  childCtx = _objectSpread(_objectSpread({}, ctx), {}, {
                    common: _objectSpread(_objectSpread({}, ctx.common), {}, {
                      issues: []
                    }),
                    parent: null
                  });
                  _context13.next = 3;
                  return option._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx
                  });
                case 3:
                  _context13.t0 = _context13.sent;
                  _context13.t1 = childCtx;
                  return _context13.abrupt("return", {
                    result: _context13.t0,
                    ctx: _context13.t1
                  });
                case 6:
                case "end":
                  return _context13.stop();
              }
            }, _callee0);
          }));
          return function (_x14) {
            return _ref13.apply(this, arguments);
          };
        }())).then(handleResults);
      } else {
        var dirty = undefined;
        var issues = [];
        var _iterator55 = _createForOfIteratorHelper(options),
          _step55;
        try {
          for (_iterator55.s(); !(_step55 = _iterator55.n()).done;) {
            var option = _step55.value;
            var childCtx = _objectSpread(_objectSpread({}, ctx), {}, {
              common: _objectSpread(_objectSpread({}, ctx.common), {}, {
                issues: []
              }),
              parent: null
            });
            var result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = {
                result: result,
                ctx: childCtx
              };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
        } catch (err) {
          _iterator55.e(err);
        } finally {
          _iterator55.f();
        }
        if (dirty) {
          var _ctx$common$issues2;
          (_ctx$common$issues2 = ctx.common.issues).push.apply(_ctx$common$issues2, _toConsumableArray(dirty.ctx.common.issues));
          return dirty.result;
        }
        var unionErrors = issues.map(function (issues) {
          return new ZodError(issues);
        });
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors: unionErrors
        });
        return INVALID;
      }
    }
  }, {
    key: "options",
    get: function get() {
      return this._def.options;
    }
  }]);
}(ZodType);
ZodUnion.create = function (types, params) {
  return new ZodUnion(_objectSpread({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion
  }, processCreateParams(params)));
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
var _getDiscriminator = function getDiscriminator(type) {
  if (type instanceof ZodLazy) {
    return _getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return _getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    // eslint-disable-next-line ban/ban
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return _getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined].concat(_toConsumableArray(_getDiscriminator(type.unwrap())));
  } else if (type instanceof ZodNullable) {
    return [null].concat(_toConsumableArray(_getDiscriminator(type.unwrap())));
  } else if (type instanceof ZodBranded) {
    return _getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return _getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return _getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = /*#__PURE__*/function (_ZodType14) {
  function ZodDiscriminatedUnion() {
    _classCallCheck(this, ZodDiscriminatedUnion);
    return _callSuper(this, ZodDiscriminatedUnion, arguments);
  }
  _inherits(ZodDiscriminatedUnion, _ZodType14);
  return _createClass(ZodDiscriminatedUnion, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa4 = this._processInputParams(input),
        ctx = _this$_processInputPa4.ctx;
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      var discriminator = this.discriminator;
      var discriminatorValue = ctx.data[discriminator];
      var option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }, {
    key: "discriminator",
    get: function get() {
      return this._def.discriminator;
    }
  }, {
    key: "options",
    get: function get() {
      return this._def.options;
    }
  }, {
    key: "optionsMap",
    get: function get() {
      return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
  }], [{
    key: "create",
    value: function create(discriminator, options, params) {
      // Get all the valid discriminator values
      var optionsMap = new Map();
      // try {
      var _iterator56 = _createForOfIteratorHelper(options),
        _step56;
      try {
        for (_iterator56.s(); !(_step56 = _iterator56.n()).done;) {
          var _type = _step56.value;
          var discriminatorValues = _getDiscriminator(_type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error("A discriminator value for key `".concat(discriminator, "` could not be extracted from all schema options"));
          }
          var _iterator57 = _createForOfIteratorHelper(discriminatorValues),
            _step57;
          try {
            for (_iterator57.s(); !(_step57 = _iterator57.n()).done;) {
              var value = _step57.value;
              if (optionsMap.has(value)) {
                throw new Error("Discriminator property ".concat(String(discriminator), " has duplicate value ").concat(String(value)));
              }
              optionsMap.set(value, _type);
            }
          } catch (err) {
            _iterator57.e(err);
          } finally {
            _iterator57.f();
          }
        }
      } catch (err) {
        _iterator56.e(err);
      } finally {
        _iterator56.f();
      }
      return new ZodDiscriminatedUnion(_objectSpread({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator: discriminator,
        options: options,
        optionsMap: optionsMap
      }, processCreateParams(params)));
    }
  }]);
}(ZodType);
function mergeValues(a, b) {
  var aType = getParsedType(a);
  var bType = getParsedType(b);
  if (a === b) {
    return {
      valid: true,
      data: a
    };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    var bKeys = util.objectKeys(b);
    var sharedKeys = util.objectKeys(a).filter(function (key) {
      return bKeys.indexOf(key) !== -1;
    });
    var newObj = _objectSpread(_objectSpread({}, a), b);
    var _iterator58 = _createForOfIteratorHelper(sharedKeys),
      _step58;
    try {
      for (_iterator58.s(); !(_step58 = _iterator58.n()).done;) {
        var key = _step58.value;
        var sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return {
            valid: false
          };
        }
        newObj[key] = sharedValue.data;
      }
    } catch (err) {
      _iterator58.e(err);
    } finally {
      _iterator58.f();
    }
    return {
      valid: true,
      data: newObj
    };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return {
        valid: false
      };
    }
    var newArray = [];
    for (var index = 0; index < a.length; index++) {
      var itemA = a[index];
      var itemB = b[index];
      var _sharedValue = mergeValues(itemA, itemB);
      if (!_sharedValue.valid) {
        return {
          valid: false
        };
      }
      newArray.push(_sharedValue.data);
    }
    return {
      valid: true,
      data: newArray
    };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return {
      valid: true,
      data: a
    };
  } else {
    return {
      valid: false
    };
  }
}
var ZodIntersection = /*#__PURE__*/function (_ZodType15) {
  function ZodIntersection() {
    _classCallCheck(this, ZodIntersection);
    return _callSuper(this, ZodIntersection, arguments);
  }
  _inherits(ZodIntersection, _ZodType15);
  return _createClass(ZodIntersection, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa5 = this._processInputParams(input),
        status = _this$_processInputPa5.status,
        ctx = _this$_processInputPa5.ctx;
      var handleParsed = function handleParsed(parsedLeft, parsedRight) {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        var merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return {
          status: status.value,
          value: merged.data
        };
      };
      if (ctx.common.async) {
        return Promise.all([this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })]).then(function (_ref14) {
          var _ref15 = _slicedToArray(_ref14, 2),
            left = _ref15[0],
            right = _ref15[1];
          return handleParsed(left, right);
        });
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  }]);
}(ZodType);
ZodIntersection.create = function (left, right, params) {
  return new ZodIntersection(_objectSpread({
    left: left,
    right: right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection
  }, processCreateParams(params)));
};
var ZodTuple = /*#__PURE__*/function (_ZodType16) {
  function ZodTuple() {
    _classCallCheck(this, ZodTuple);
    return _callSuper(this, ZodTuple, arguments);
  }
  _inherits(ZodTuple, _ZodType16);
  return _createClass(ZodTuple, [{
    key: "_parse",
    value: function _parse(input) {
      var _this26 = this;
      var _this$_processInputPa6 = this._processInputParams(input),
        status = _this$_processInputPa6.status,
        ctx = _this$_processInputPa6.ctx;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      var rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      var items = _toConsumableArray(ctx.data).map(function (item, itemIndex) {
        var schema = _this26._def.items[itemIndex] || _this26._def.rest;
        if (!schema) return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter(function (x) {
        return !!x;
      }); // filter nulls
      if (ctx.common.async) {
        return Promise.all(items).then(function (results) {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
  }, {
    key: "items",
    get: function get() {
      return this._def.items;
    }
  }, {
    key: "rest",
    value: function rest(_rest) {
      return new ZodTuple(_objectSpread(_objectSpread({}, this._def), {}, {
        rest: _rest
      }));
    }
  }]);
}(ZodType);
ZodTuple.create = function (schemas, params) {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple(_objectSpread({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null
  }, processCreateParams(params)));
};
var ZodRecord = /*#__PURE__*/function (_ZodType17) {
  function ZodRecord() {
    _classCallCheck(this, ZodRecord);
    return _callSuper(this, ZodRecord, arguments);
  }
  _inherits(ZodRecord, _ZodType17);
  return _createClass(ZodRecord, [{
    key: "keySchema",
    get: function get() {
      return this._def.keyType;
    }
  }, {
    key: "valueSchema",
    get: function get() {
      return this._def.valueType;
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa7 = this._processInputParams(input),
        status = _this$_processInputPa7.status,
        ctx = _this$_processInputPa7.ctx;
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      var pairs = [];
      var keyType = this._def.keyType;
      var valueType = this._def.valueType;
      for (var key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
  }, {
    key: "element",
    get: function get() {
      return this._def.valueType;
    }
  }], [{
    key: "create",
    value: function create(first, second, third) {
      if (second instanceof ZodType) {
        return new ZodRecord(_objectSpread({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord
        }, processCreateParams(third)));
      }
      return new ZodRecord(_objectSpread({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord
      }, processCreateParams(second)));
    }
  }]);
}(ZodType);
var ZodMap = /*#__PURE__*/function (_ZodType18) {
  function ZodMap() {
    _classCallCheck(this, ZodMap);
    return _callSuper(this, ZodMap, arguments);
  }
  _inherits(ZodMap, _ZodType18);
  return _createClass(ZodMap, [{
    key: "keySchema",
    get: function get() {
      return this._def.keyType;
    }
  }, {
    key: "valueSchema",
    get: function get() {
      return this._def.valueType;
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa8 = this._processInputParams(input),
        status = _this$_processInputPa8.status,
        ctx = _this$_processInputPa8.ctx;
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      var keyType = this._def.keyType;
      var valueType = this._def.valueType;
      var pairs = _toConsumableArray(ctx.data.entries()).map(function (_ref16, index) {
        var _ref17 = _slicedToArray(_ref16, 2),
          key = _ref17[0],
          value = _ref17[1];
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        var finalMap = new Map();
        return Promise.resolve().then(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1() {
          var _iterator59, _step59, pair, key, value;
          return _regeneratorRuntime().wrap(function _callee1$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                _iterator59 = _createForOfIteratorHelper(pairs);
                _context14.prev = 1;
                _iterator59.s();
              case 3:
                if ((_step59 = _iterator59.n()).done) {
                  _context14.next = 17;
                  break;
                }
                pair = _step59.value;
                _context14.next = 7;
                return pair.key;
              case 7:
                key = _context14.sent;
                _context14.next = 10;
                return pair.value;
              case 10:
                value = _context14.sent;
                if (!(key.status === "aborted" || value.status === "aborted")) {
                  _context14.next = 13;
                  break;
                }
                return _context14.abrupt("return", INVALID);
              case 13:
                if (key.status === "dirty" || value.status === "dirty") {
                  status.dirty();
                }
                finalMap.set(key.value, value.value);
              case 15:
                _context14.next = 3;
                break;
              case 17:
                _context14.next = 22;
                break;
              case 19:
                _context14.prev = 19;
                _context14.t0 = _context14["catch"](1);
                _iterator59.e(_context14.t0);
              case 22:
                _context14.prev = 22;
                _iterator59.f();
                return _context14.finish(22);
              case 25:
                return _context14.abrupt("return", {
                  status: status.value,
                  value: finalMap
                });
              case 26:
              case "end":
                return _context14.stop();
            }
          }, _callee1, null, [[1, 19, 22, 25]]);
        })));
      } else {
        var _finalMap = new Map();
        var _iterator60 = _createForOfIteratorHelper(pairs),
          _step60;
        try {
          for (_iterator60.s(); !(_step60 = _iterator60.n()).done;) {
            var pair = _step60.value;
            var key = pair.key;
            var value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            _finalMap.set(key.value, value.value);
          }
        } catch (err) {
          _iterator60.e(err);
        } finally {
          _iterator60.f();
        }
        return {
          status: status.value,
          value: _finalMap
        };
      }
    }
  }]);
}(ZodType);
ZodMap.create = function (keyType, valueType, params) {
  return new ZodMap(_objectSpread({
    valueType: valueType,
    keyType: keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap
  }, processCreateParams(params)));
};
var ZodSet = /*#__PURE__*/function (_ZodType19) {
  function ZodSet() {
    _classCallCheck(this, ZodSet);
    return _callSuper(this, ZodSet, arguments);
  }
  _inherits(ZodSet, _ZodType19);
  return _createClass(ZodSet, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa9 = this._processInputParams(input),
        status = _this$_processInputPa9.status,
        ctx = _this$_processInputPa9.ctx;
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      var def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      var valueType = this._def.valueType;
      function finalizeSet(elements) {
        var parsedSet = new Set();
        var _iterator61 = _createForOfIteratorHelper(elements),
          _step61;
        try {
          for (_iterator61.s(); !(_step61 = _iterator61.n()).done;) {
            var element = _step61.value;
            if (element.status === "aborted") return INVALID;
            if (element.status === "dirty") status.dirty();
            parsedSet.add(element.value);
          }
        } catch (err) {
          _iterator61.e(err);
        } finally {
          _iterator61.f();
        }
        return {
          status: status.value,
          value: parsedSet
        };
      }
      var elements = _toConsumableArray(ctx.data.values()).map(function (item, i) {
        return valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      if (ctx.common.async) {
        return Promise.all(elements).then(function (elements) {
          return finalizeSet(elements);
        });
      } else {
        return finalizeSet(elements);
      }
    }
  }, {
    key: "min",
    value: function min(minSize, message) {
      return new ZodSet(_objectSpread(_objectSpread({}, this._def), {}, {
        minSize: {
          value: minSize,
          message: errorUtil.toString(message)
        }
      }));
    }
  }, {
    key: "max",
    value: function max(maxSize, message) {
      return new ZodSet(_objectSpread(_objectSpread({}, this._def), {}, {
        maxSize: {
          value: maxSize,
          message: errorUtil.toString(message)
        }
      }));
    }
  }, {
    key: "size",
    value: function size(_size, message) {
      return this.min(_size, message).max(_size, message);
    }
  }, {
    key: "nonempty",
    value: function nonempty(message) {
      return this.min(1, message);
    }
  }]);
}(ZodType);
ZodSet.create = function (valueType, params) {
  return new ZodSet(_objectSpread({
    valueType: valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet
  }, processCreateParams(params)));
};
var ZodFunction = /*#__PURE__*/function (_ZodType20) {
  function ZodFunction() {
    var _this27;
    _classCallCheck(this, ZodFunction);
    _this27 = _callSuper(this, ZodFunction, arguments);
    _this27.validate = _this27.implement;
    return _this27;
  }
  _inherits(ZodFunction, _ZodType20);
  return _createClass(ZodFunction, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa0 = this._processInputParams(input),
        ctx = _this$_processInputPa0.ctx;
      if (ctx.parsedType !== ZodParsedType.function) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.function,
          received: ctx.parsedType
        });
        return INVALID;
      }
      function makeArgsIssue(args, error) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), errorMap].filter(function (x) {
            return !!x;
          }),
          issueData: {
            code: ZodIssueCode.invalid_arguments,
            argumentsError: error
          }
        });
      }
      function makeReturnsIssue(returns, error) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), errorMap].filter(function (x) {
            return !!x;
          }),
          issueData: {
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: error
          }
        });
      }
      var params = {
        errorMap: ctx.common.contextualErrorMap
      };
      var fn = ctx.data;
      if (this._def.returns instanceof ZodPromise) {
        // Would love a way to avoid disabling this rule, but we need
        // an alias (using an arrow function was what caused 2651).
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var me = this;
        return OK(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
          var _len6,
            args,
            _key1,
            error,
            parsedArgs,
            result,
            parsedReturns,
            _args15 = arguments;
          return _regeneratorRuntime().wrap(function _callee10$(_context15) {
            while (1) switch (_context15.prev = _context15.next) {
              case 0:
                for (_len6 = _args15.length, args = new Array(_len6), _key1 = 0; _key1 < _len6; _key1++) {
                  args[_key1] = _args15[_key1];
                }
                error = new ZodError([]);
                _context15.next = 4;
                return me._def.args.parseAsync(args, params).catch(function (e) {
                  error.addIssue(makeArgsIssue(args, e));
                  throw error;
                });
              case 4:
                parsedArgs = _context15.sent;
                _context15.next = 7;
                return Reflect.apply(fn, this, parsedArgs);
              case 7:
                result = _context15.sent;
                _context15.next = 10;
                return me._def.returns._def.type.parseAsync(result, params).catch(function (e) {
                  error.addIssue(makeReturnsIssue(result, e));
                  throw error;
                });
              case 10:
                parsedReturns = _context15.sent;
                return _context15.abrupt("return", parsedReturns);
              case 12:
              case "end":
                return _context15.stop();
            }
          }, _callee10, this);
        })));
      } else {
        // Would love a way to avoid disabling this rule, but we need
        // an alias (using an arrow function was what caused 2651).
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var _me = this;
        return OK(function () {
          for (var _len7 = arguments.length, args = new Array(_len7), _key10 = 0; _key10 < _len7; _key10++) {
            args[_key10] = arguments[_key10];
          }
          var parsedArgs = _me._def.args.safeParse(args, params);
          if (!parsedArgs.success) {
            throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
          }
          var result = Reflect.apply(fn, this, parsedArgs.data);
          var parsedReturns = _me._def.returns.safeParse(result, params);
          if (!parsedReturns.success) {
            throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
          }
          return parsedReturns.data;
        });
      }
    }
  }, {
    key: "parameters",
    value: function parameters() {
      return this._def.args;
    }
  }, {
    key: "returnType",
    value: function returnType() {
      return this._def.returns;
    }
  }, {
    key: "args",
    value: function args() {
      for (var _len8 = arguments.length, items = new Array(_len8), _key11 = 0; _key11 < _len8; _key11++) {
        items[_key11] = arguments[_key11];
      }
      return new ZodFunction(_objectSpread(_objectSpread({}, this._def), {}, {
        args: ZodTuple.create(items).rest(ZodUnknown.create())
      }));
    }
  }, {
    key: "returns",
    value: function returns(returnType) {
      return new ZodFunction(_objectSpread(_objectSpread({}, this._def), {}, {
        returns: returnType
      }));
    }
  }, {
    key: "implement",
    value: function implement(func) {
      var validatedFunc = this.parse(func);
      return validatedFunc;
    }
  }, {
    key: "strictImplement",
    value: function strictImplement(func) {
      var validatedFunc = this.parse(func);
      return validatedFunc;
    }
  }], [{
    key: "create",
    value: function create(args, returns, params) {
      return new ZodFunction(_objectSpread({
        args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
        returns: returns || ZodUnknown.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction
      }, processCreateParams(params)));
    }
  }]);
}(ZodType);
var ZodLazy = /*#__PURE__*/function (_ZodType21) {
  function ZodLazy() {
    _classCallCheck(this, ZodLazy);
    return _callSuper(this, ZodLazy, arguments);
  }
  _inherits(ZodLazy, _ZodType21);
  return _createClass(ZodLazy, [{
    key: "schema",
    get: function get() {
      return this._def.getter();
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa1 = this._processInputParams(input),
        ctx = _this$_processInputPa1.ctx;
      var lazySchema = this._def.getter();
      return lazySchema._parse({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }]);
}(ZodType);
ZodLazy.create = function (getter, params) {
  return new ZodLazy(_objectSpread({
    getter: getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy
  }, processCreateParams(params)));
};
var ZodLiteral = /*#__PURE__*/function (_ZodType22) {
  function ZodLiteral() {
    _classCallCheck(this, ZodLiteral);
    return _callSuper(this, ZodLiteral, arguments);
  }
  _inherits(ZodLiteral, _ZodType22);
  return _createClass(ZodLiteral, [{
    key: "_parse",
    value: function _parse(input) {
      if (input.data !== this._def.value) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return {
        status: "valid",
        value: input.data
      };
    }
  }, {
    key: "value",
    get: function get() {
      return this._def.value;
    }
  }]);
}(ZodType);
ZodLiteral.create = function (value, params) {
  return new ZodLiteral(_objectSpread({
    value: value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral
  }, processCreateParams(params)));
};
function createZodEnum(values, params) {
  return new ZodEnum(_objectSpread({
    values: values,
    typeName: ZodFirstPartyTypeKind.ZodEnum
  }, processCreateParams(params)));
}
var ZodEnum = /*#__PURE__*/function (_ZodType23) {
  function ZodEnum() {
    var _this28;
    _classCallCheck(this, ZodEnum);
    _this28 = _callSuper(this, ZodEnum, arguments);
    _ZodEnum_cache.set(_this28, void 0);
    return _this28;
  }
  _inherits(ZodEnum, _ZodType23);
  return _createClass(ZodEnum, [{
    key: "_parse",
    value: function _parse(input) {
      if (typeof input.data !== "string") {
        var ctx = this._getOrReturnCtx(input);
        var expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!__classPrivateFieldGet(this, _ZodEnum_cache)) {
        __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values));
      }
      if (!__classPrivateFieldGet(this, _ZodEnum_cache).has(input.data)) {
        var _ctx7 = this._getOrReturnCtx(input);
        var _expectedValues = this._def.values;
        addIssueToContext(_ctx7, {
          received: _ctx7.data,
          code: ZodIssueCode.invalid_enum_value,
          options: _expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }, {
    key: "options",
    get: function get() {
      return this._def.values;
    }
  }, {
    key: "enum",
    get: function get() {
      var enumValues = {};
      var _iterator62 = _createForOfIteratorHelper(this._def.values),
        _step62;
      try {
        for (_iterator62.s(); !(_step62 = _iterator62.n()).done;) {
          var val = _step62.value;
          enumValues[val] = val;
        }
      } catch (err) {
        _iterator62.e(err);
      } finally {
        _iterator62.f();
      }
      return enumValues;
    }
  }, {
    key: "Values",
    get: function get() {
      var enumValues = {};
      var _iterator63 = _createForOfIteratorHelper(this._def.values),
        _step63;
      try {
        for (_iterator63.s(); !(_step63 = _iterator63.n()).done;) {
          var val = _step63.value;
          enumValues[val] = val;
        }
      } catch (err) {
        _iterator63.e(err);
      } finally {
        _iterator63.f();
      }
      return enumValues;
    }
  }, {
    key: "Enum",
    get: function get() {
      var enumValues = {};
      var _iterator64 = _createForOfIteratorHelper(this._def.values),
        _step64;
      try {
        for (_iterator64.s(); !(_step64 = _iterator64.n()).done;) {
          var val = _step64.value;
          enumValues[val] = val;
        }
      } catch (err) {
        _iterator64.e(err);
      } finally {
        _iterator64.f();
      }
      return enumValues;
    }
  }, {
    key: "extract",
    value: function extract(values) {
      var newDef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._def;
      return ZodEnum.create(values, _objectSpread(_objectSpread({}, this._def), newDef));
    }
  }, {
    key: "exclude",
    value: function exclude(values) {
      var newDef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._def;
      return ZodEnum.create(this.options.filter(function (opt) {
        return !values.includes(opt);
      }), _objectSpread(_objectSpread({}, this._def), newDef));
    }
  }]);
}(ZodType);
_ZodEnum_cache = new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = /*#__PURE__*/function (_ZodType24) {
  function ZodNativeEnum() {
    var _this29;
    _classCallCheck(this, ZodNativeEnum);
    _this29 = _callSuper(this, ZodNativeEnum, arguments);
    _ZodNativeEnum_cache.set(_this29, void 0);
    return _this29;
  }
  _inherits(ZodNativeEnum, _ZodType24);
  return _createClass(ZodNativeEnum, [{
    key: "_parse",
    value: function _parse(input) {
      var nativeEnumValues = util.getValidEnumValues(this._def.values);
      var ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        var expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache)) {
        __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)));
      }
      if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache).has(input.data)) {
        var _expectedValues2 = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: _expectedValues2
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }, {
    key: "enum",
    get: function get() {
      return this._def.values;
    }
  }]);
}(ZodType);
_ZodNativeEnum_cache = new WeakMap();
ZodNativeEnum.create = function (values, params) {
  return new ZodNativeEnum(_objectSpread({
    values: values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum
  }, processCreateParams(params)));
};
var ZodPromise = /*#__PURE__*/function (_ZodType25) {
  function ZodPromise() {
    _classCallCheck(this, ZodPromise);
    return _callSuper(this, ZodPromise, arguments);
  }
  _inherits(ZodPromise, _ZodType25);
  return _createClass(ZodPromise, [{
    key: "unwrap",
    value: function unwrap() {
      return this._def.type;
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var _this30 = this;
      var _this$_processInputPa10 = this._processInputParams(input),
        ctx = _this$_processInputPa10.ctx;
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      var promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then(function (data) {
        return _this30._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  }]);
}(ZodType);
ZodPromise.create = function (schema, params) {
  return new ZodPromise(_objectSpread({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise
  }, processCreateParams(params)));
};
var ZodEffects = /*#__PURE__*/function (_ZodType26) {
  function ZodEffects() {
    _classCallCheck(this, ZodEffects);
    return _callSuper(this, ZodEffects, arguments);
  }
  _inherits(ZodEffects, _ZodType26);
  return _createClass(ZodEffects, [{
    key: "innerType",
    value: function innerType() {
      return this._def.schema;
    }
  }, {
    key: "sourceType",
    value: function sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
  }, {
    key: "_parse",
    value: function _parse(input) {
      var _this31 = this;
      var _this$_processInputPa11 = this._processInputParams(input),
        status = _this$_processInputPa11.status,
        ctx = _this$_processInputPa11.ctx;
      var effect = this._def.effect || null;
      var checkCtx = {
        addIssue: function addIssue(arg) {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        var processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(/*#__PURE__*/function () {
            var _ref20 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(processed) {
              var result;
              return _regeneratorRuntime().wrap(function _callee11$(_context16) {
                while (1) switch (_context16.prev = _context16.next) {
                  case 0:
                    if (!(status.value === "aborted")) {
                      _context16.next = 2;
                      break;
                    }
                    return _context16.abrupt("return", INVALID);
                  case 2:
                    _context16.next = 4;
                    return _this31._def.schema._parseAsync({
                      data: processed,
                      path: ctx.path,
                      parent: ctx
                    });
                  case 4:
                    result = _context16.sent;
                    if (!(result.status === "aborted")) {
                      _context16.next = 7;
                      break;
                    }
                    return _context16.abrupt("return", INVALID);
                  case 7:
                    if (!(result.status === "dirty")) {
                      _context16.next = 9;
                      break;
                    }
                    return _context16.abrupt("return", DIRTY(result.value));
                  case 9:
                    if (!(status.value === "dirty")) {
                      _context16.next = 11;
                      break;
                    }
                    return _context16.abrupt("return", DIRTY(result.value));
                  case 11:
                    return _context16.abrupt("return", result);
                  case 12:
                  case "end":
                    return _context16.stop();
                }
              }, _callee11);
            }));
            return function (_x15) {
              return _ref20.apply(this, arguments);
            };
          }());
        } else {
          if (status.value === "aborted") return INVALID;
          var result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted") return INVALID;
          if (result.status === "dirty") return DIRTY(result.value);
          if (status.value === "dirty") return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        var executeRefinement = function executeRefinement(acc) {
          var result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result);
          }
          if (result instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          var inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted") return INVALID;
          if (inner.status === "dirty") status.dirty();
          // return value is ignored
          executeRefinement(inner.value);
          return {
            status: status.value,
            value: inner.value
          };
        } else {
          return this._def.schema._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }).then(function (inner) {
            if (inner.status === "aborted") return INVALID;
            if (inner.status === "dirty") status.dirty();
            return executeRefinement(inner.value).then(function () {
              return {
                status: status.value,
                value: inner.value
              };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          var base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base)) return base;
          var _result3 = effect.transform(base.value, checkCtx);
          if (_result3 instanceof Promise) {
            throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return {
            status: status.value,
            value: _result3
          };
        } else {
          return this._def.schema._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }).then(function (base) {
            if (!isValid(base)) return base;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then(function (result) {
              return {
                status: status.value,
                value: result
              };
            });
          });
        }
      }
      util.assertNever(effect);
    }
  }]);
}(ZodType);
ZodEffects.create = function (schema, effect, params) {
  return new ZodEffects(_objectSpread({
    schema: schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect: effect
  }, processCreateParams(params)));
};
ZodEffects.createWithPreprocess = function (preprocess, schema, params) {
  return new ZodEffects(_objectSpread({
    schema: schema,
    effect: {
      type: "preprocess",
      transform: preprocess
    },
    typeName: ZodFirstPartyTypeKind.ZodEffects
  }, processCreateParams(params)));
};
var ZodOptional = /*#__PURE__*/function (_ZodType27) {
  function ZodOptional() {
    _classCallCheck(this, ZodOptional);
    return _callSuper(this, ZodOptional, arguments);
  }
  _inherits(ZodOptional, _ZodType27);
  return _createClass(ZodOptional, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(undefined);
      }
      return this._def.innerType._parse(input);
    }
  }, {
    key: "unwrap",
    value: function unwrap() {
      return this._def.innerType;
    }
  }]);
}(ZodType);
ZodOptional.create = function (type, params) {
  return new ZodOptional(_objectSpread({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional
  }, processCreateParams(params)));
};
var ZodNullable = /*#__PURE__*/function (_ZodType28) {
  function ZodNullable() {
    _classCallCheck(this, ZodNullable);
    return _callSuper(this, ZodNullable, arguments);
  }
  _inherits(ZodNullable, _ZodType28);
  return _createClass(ZodNullable, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
  }, {
    key: "unwrap",
    value: function unwrap() {
      return this._def.innerType;
    }
  }]);
}(ZodType);
ZodNullable.create = function (type, params) {
  return new ZodNullable(_objectSpread({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable
  }, processCreateParams(params)));
};
var ZodDefault = /*#__PURE__*/function (_ZodType29) {
  function ZodDefault() {
    _classCallCheck(this, ZodDefault);
    return _callSuper(this, ZodDefault, arguments);
  }
  _inherits(ZodDefault, _ZodType29);
  return _createClass(ZodDefault, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa12 = this._processInputParams(input),
        ctx = _this$_processInputPa12.ctx;
      var data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data: data,
        path: ctx.path,
        parent: ctx
      });
    }
  }, {
    key: "removeDefault",
    value: function removeDefault() {
      return this._def.innerType;
    }
  }]);
}(ZodType);
ZodDefault.create = function (type, params) {
  return new ZodDefault(_objectSpread({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : function () {
      return params.default;
    }
  }, processCreateParams(params)));
};
var ZodCatch = /*#__PURE__*/function (_ZodType30) {
  function ZodCatch() {
    _classCallCheck(this, ZodCatch);
    return _callSuper(this, ZodCatch, arguments);
  }
  _inherits(ZodCatch, _ZodType30);
  return _createClass(ZodCatch, [{
    key: "_parse",
    value: function _parse(input) {
      var _this32 = this;
      var _this$_processInputPa13 = this._processInputParams(input),
        ctx = _this$_processInputPa13.ctx;
      // newCtx is used to not collect issues from inner types in ctx
      var newCtx = _objectSpread(_objectSpread({}, ctx), {}, {
        common: _objectSpread(_objectSpread({}, ctx.common), {}, {
          issues: []
        })
      });
      var result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: _objectSpread({}, newCtx)
      });
      if (isAsync(result)) {
        return result.then(function (result) {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : _this32._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
  }, {
    key: "removeCatch",
    value: function removeCatch() {
      return this._def.innerType;
    }
  }]);
}(ZodType);
ZodCatch.create = function (type, params) {
  return new ZodCatch(_objectSpread({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : function () {
      return params.catch;
    }
  }, processCreateParams(params)));
};
var ZodNaN = /*#__PURE__*/function (_ZodType31) {
  function ZodNaN() {
    _classCallCheck(this, ZodNaN);
    return _callSuper(this, ZodNaN, arguments);
  }
  _inherits(ZodNaN, _ZodType31);
  return _createClass(ZodNaN, [{
    key: "_parse",
    value: function _parse(input) {
      var parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        var ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return {
        status: "valid",
        value: input.data
      };
    }
  }]);
}(ZodType);
ZodNaN.create = function (params) {
  return new ZodNaN(_objectSpread({
    typeName: ZodFirstPartyTypeKind.ZodNaN
  }, processCreateParams(params)));
};
var BRAND = Symbol("zod_brand");
var ZodBranded = /*#__PURE__*/function (_ZodType32) {
  function ZodBranded() {
    _classCallCheck(this, ZodBranded);
    return _callSuper(this, ZodBranded, arguments);
  }
  _inherits(ZodBranded, _ZodType32);
  return _createClass(ZodBranded, [{
    key: "_parse",
    value: function _parse(input) {
      var _this$_processInputPa14 = this._processInputParams(input),
        ctx = _this$_processInputPa14.ctx;
      var data = ctx.data;
      return this._def.type._parse({
        data: data,
        path: ctx.path,
        parent: ctx
      });
    }
  }, {
    key: "unwrap",
    value: function unwrap() {
      return this._def.type;
    }
  }]);
}(ZodType);
var ZodPipeline = /*#__PURE__*/function (_ZodType33) {
  function ZodPipeline() {
    _classCallCheck(this, ZodPipeline);
    return _callSuper(this, ZodPipeline, arguments);
  }
  _inherits(ZodPipeline, _ZodType33);
  return _createClass(ZodPipeline, [{
    key: "_parse",
    value: function _parse(input) {
      var _this33 = this;
      var _this$_processInputPa15 = this._processInputParams(input),
        status = _this$_processInputPa15.status,
        ctx = _this$_processInputPa15.ctx;
      if (ctx.common.async) {
        var handleAsync = /*#__PURE__*/function () {
          var _ref21 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
            var inResult;
            return _regeneratorRuntime().wrap(function _callee12$(_context17) {
              while (1) switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return _this33._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                  });
                case 2:
                  inResult = _context17.sent;
                  if (!(inResult.status === "aborted")) {
                    _context17.next = 5;
                    break;
                  }
                  return _context17.abrupt("return", INVALID);
                case 5:
                  if (!(inResult.status === "dirty")) {
                    _context17.next = 10;
                    break;
                  }
                  status.dirty();
                  return _context17.abrupt("return", DIRTY(inResult.value));
                case 10:
                  return _context17.abrupt("return", _this33._def.out._parseAsync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx
                  }));
                case 11:
                case "end":
                  return _context17.stop();
              }
            }, _callee12);
          }));
          return function handleAsync() {
            return _ref21.apply(this, arguments);
          };
        }();
        return handleAsync();
      } else {
        var inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted") return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
  }], [{
    key: "create",
    value: function create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  }]);
}(ZodType);
var ZodReadonly = /*#__PURE__*/function (_ZodType34) {
  function ZodReadonly() {
    _classCallCheck(this, ZodReadonly);
    return _callSuper(this, ZodReadonly, arguments);
  }
  _inherits(ZodReadonly, _ZodType34);
  return _createClass(ZodReadonly, [{
    key: "_parse",
    value: function _parse(input) {
      var result = this._def.innerType._parse(input);
      var freeze = function freeze(data) {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result) ? result.then(function (data) {
        return freeze(data);
      }) : freeze(result);
    }
  }, {
    key: "unwrap",
    value: function unwrap() {
      return this._def.innerType;
    }
  }]);
}(ZodType);
ZodReadonly.create = function (type, params) {
  return new ZodReadonly(_objectSpread({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly
  }, processCreateParams(params)));
};
////////////////////////////////////////
////////////////////////////////////////
//////////                    //////////
//////////      z.custom      //////////
//////////                    //////////
////////////////////////////////////////
////////////////////////////////////////
function cleanParams(params, data) {
  var p = typeof params === "function" ? params(data) : typeof params === "string" ? {
    message: params
  } : params;
  var p2 = typeof p === "string" ? {
    message: p
  } : p;
  return p2;
}
function custom(check) {
  var _params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var
  /**
   * @deprecated
   *
   * Pass `fatal` into the params object instead:
   *
   * ```ts
   * z.string().custom((val) => val.length > 5, { fatal: false })
   * ```
   *
   */
  fatal = arguments.length > 2 ? arguments[2] : undefined;
  if (check) return ZodAny.create().superRefine(function (data, ctx) {
    var _a, _b;
    var r = check(data);
    if (r instanceof Promise) {
      return r.then(function (r) {
        var _a, _b;
        if (!r) {
          var params = cleanParams(_params, data);
          var _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
          ctx.addIssue(_objectSpread(_objectSpread({
            code: "custom"
          }, params), {}, {
            fatal: _fatal
          }));
        }
      });
    }
    if (!r) {
      var params = cleanParams(_params, data);
      var _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
      ctx.addIssue(_objectSpread(_objectSpread({
        code: "custom"
      }, params), {}, {
        fatal: _fatal
      }));
    }
    return;
  });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
  ZodFirstPartyTypeKind["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = function instanceOfType(
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    message: "Input not instance of ".concat(cls.name)
  };
  return custom(function (data) {
    return data instanceof cls;
  }, params);
};
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = function ostring() {
  return stringType().optional();
};
var onumber = function onumber() {
  return numberType().optional();
};
var oboolean = function oboolean() {
  return booleanType().optional();
};
var coerce = {
  string: function string(arg) {
    return ZodString.create(_objectSpread(_objectSpread({}, arg), {}, {
      coerce: true
    }));
  },
  number: function number(arg) {
    return ZodNumber.create(_objectSpread(_objectSpread({}, arg), {}, {
      coerce: true
    }));
  },
  boolean: function boolean(arg) {
    return ZodBoolean.create(_objectSpread(_objectSpread({}, arg), {}, {
      coerce: true
    }));
  },
  bigint: function bigint(arg) {
    return ZodBigInt.create(_objectSpread(_objectSpread({}, arg), {}, {
      coerce: true
    }));
  },
  date: function date(arg) {
    return ZodDate.create(_objectSpread(_objectSpread({}, arg), {}, {
      coerce: true
    }));
  }
};
var NEVER = INVALID;
var z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap: setErrorMap,
  getErrorMap: getErrorMap,
  makeIssue: makeIssue,
  EMPTY_PATH: EMPTY_PATH,
  addIssueToContext: addIssueToContext,
  ParseStatus: ParseStatus,
  INVALID: INVALID,
  DIRTY: DIRTY,
  OK: OK,
  isAborted: isAborted,
  isDirty: isDirty,
  isValid: isValid,
  isAsync: isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType: ZodParsedType,
  getParsedType: getParsedType,
  ZodType: ZodType,
  datetimeRegex: datetimeRegex,
  ZodString: ZodString,
  ZodNumber: ZodNumber,
  ZodBigInt: ZodBigInt,
  ZodBoolean: ZodBoolean,
  ZodDate: ZodDate,
  ZodSymbol: ZodSymbol,
  ZodUndefined: ZodUndefined,
  ZodNull: ZodNull,
  ZodAny: ZodAny,
  ZodUnknown: ZodUnknown,
  ZodNever: ZodNever,
  ZodVoid: ZodVoid,
  ZodArray: ZodArray,
  ZodObject: ZodObject,
  ZodUnion: ZodUnion,
  ZodDiscriminatedUnion: ZodDiscriminatedUnion,
  ZodIntersection: ZodIntersection,
  ZodTuple: ZodTuple,
  ZodRecord: ZodRecord,
  ZodMap: ZodMap,
  ZodSet: ZodSet,
  ZodFunction: ZodFunction,
  ZodLazy: ZodLazy,
  ZodLiteral: ZodLiteral,
  ZodEnum: ZodEnum,
  ZodNativeEnum: ZodNativeEnum,
  ZodPromise: ZodPromise,
  ZodEffects: ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional: ZodOptional,
  ZodNullable: ZodNullable,
  ZodDefault: ZodDefault,
  ZodCatch: ZodCatch,
  ZodNaN: ZodNaN,
  BRAND: BRAND,
  ZodBranded: ZodBranded,
  ZodPipeline: ZodPipeline,
  ZodReadonly: ZodReadonly,
  custom: custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late: late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce: coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  'enum': enumType,
  'function': functionType,
  'instanceof': instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  'null': nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean: oboolean,
  onumber: onumber,
  optional: optionalType,
  ostring: ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  'undefined': undefinedType,
  union: unionType,
  unknown: unknownType,
  'void': voidType,
  NEVER: NEVER,
  ZodIssueCode: ZodIssueCode,
  quotelessJson: quotelessJson,
  ZodError: ZodError
});

// This file is autogenerated. It's used to publish ESM to npm.
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

var trimLeft = /^\s+/;
var trimRight = /\s+$/;
function tinycolor(color, opts) {
  color = color ? color : "";
  opts = opts || {};

  // If input is already a tinycolor, return itself
  if (color instanceof tinycolor) {
    return color;
  }
  // If we are called as a function, call using new instead
  if (!(this instanceof tinycolor)) {
    return new tinycolor(color, opts);
  }
  var rgb = inputToRGB(color);
  this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
  this._gradientType = opts.gradientType;

  // Don't let the range of [0,255] come back in [0,1].
  // Potentially lose a little bit of precision here, but will fix issues where
  // .5 gets interpreted as half of the total, instead of half of 1
  // If it was supposed to be 128, this was already taken care of by `inputToRgb`
  if (this._r < 1) this._r = Math.round(this._r);
  if (this._g < 1) this._g = Math.round(this._g);
  if (this._b < 1) this._b = Math.round(this._b);
  this._ok = rgb.ok;
}
tinycolor.prototype = {
  isDark: function isDark() {
    return this.getBrightness() < 128;
  },
  isLight: function isLight() {
    return !this.isDark();
  },
  isValid: function isValid() {
    return this._ok;
  },
  getOriginalInput: function getOriginalInput() {
    return this._originalInput;
  },
  getFormat: function getFormat() {
    return this._format;
  },
  getAlpha: function getAlpha() {
    return this._a;
  },
  getBrightness: function getBrightness() {
    //http://www.w3.org/TR/AERT#color-contrast
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },
  getLuminance: function getLuminance() {
    //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    var rgb = this.toRgb();
    var RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r / 255;
    GsRGB = rgb.g / 255;
    BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) R = RsRGB / 12.92;else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    if (GsRGB <= 0.03928) G = GsRGB / 12.92;else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    if (BsRGB <= 0.03928) B = BsRGB / 12.92;else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  setAlpha: function setAlpha(value) {
    this._a = boundAlpha(value);
    this._roundA = Math.round(100 * this._a) / 100;
    return this;
  },
  toHsv: function toHsv() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this._a
    };
  },
  toHsvString: function toHsvString() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    var h = Math.round(hsv.h * 360),
      s = Math.round(hsv.s * 100),
      v = Math.round(hsv.v * 100);
    return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
  },
  toHsl: function toHsl() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this._a
    };
  },
  toHslString: function toHslString() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    var h = Math.round(hsl.h * 360),
      s = Math.round(hsl.s * 100),
      l = Math.round(hsl.l * 100);
    return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
  },
  toHex: function toHex(allow3Char) {
    return rgbToHex(this._r, this._g, this._b, allow3Char);
  },
  toHexString: function toHexString(allow3Char) {
    return "#" + this.toHex(allow3Char);
  },
  toHex8: function toHex8(allow4Char) {
    return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
  },
  toHex8String: function toHex8String(allow4Char) {
    return "#" + this.toHex8(allow4Char);
  },
  toRgb: function toRgb() {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a
    };
  },
  toRgbString: function toRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
  },
  toPercentageRgb: function toPercentageRgb() {
    return {
      r: Math.round(bound01(this._r, 255) * 100) + "%",
      g: Math.round(bound01(this._g, 255) * 100) + "%",
      b: Math.round(bound01(this._b, 255) * 100) + "%",
      a: this._a
    };
  },
  toPercentageRgbString: function toPercentageRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
  },
  toName: function toName() {
    if (this._a === 0) {
      return "transparent";
    }
    if (this._a < 1) {
      return false;
    }
    return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
  },
  toFilter: function toFilter(secondColor) {
    var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
    var secondHex8String = hex8String;
    var gradientType = this._gradientType ? "GradientType = 1, " : "";
    if (secondColor) {
      var s = tinycolor(secondColor);
      secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
    }
    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
  },
  toString: function toString(format) {
    var formatSet = !!format;
    format = format || this._format;
    var formattedString = false;
    var hasAlpha = this._a < 1 && this._a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === "name" && this._a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  },
  clone: function clone() {
    return tinycolor(this.toString());
  },
  _applyModification: function _applyModification(fn, args) {
    var color = fn.apply(null, [this].concat([].slice.call(args)));
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this.setAlpha(color._a);
    return this;
  },
  lighten: function lighten() {
    return this._applyModification(_lighten, arguments);
  },
  brighten: function brighten() {
    return this._applyModification(_brighten, arguments);
  },
  darken: function darken() {
    return this._applyModification(_darken, arguments);
  },
  desaturate: function desaturate() {
    return this._applyModification(_desaturate, arguments);
  },
  saturate: function saturate() {
    return this._applyModification(_saturate, arguments);
  },
  greyscale: function greyscale() {
    return this._applyModification(_greyscale, arguments);
  },
  spin: function spin() {
    return this._applyModification(_spin, arguments);
  },
  _applyCombination: function _applyCombination(fn, args) {
    return fn.apply(null, [this].concat([].slice.call(args)));
  },
  analogous: function analogous() {
    return this._applyCombination(_analogous, arguments);
  },
  complement: function complement() {
    return this._applyCombination(_complement, arguments);
  },
  monochromatic: function monochromatic() {
    return this._applyCombination(_monochromatic, arguments);
  },
  splitcomplement: function splitcomplement() {
    return this._applyCombination(_splitcomplement, arguments);
  },
  // Disabled until https://github.com/bgrins/TinyColor/issues/254
  // polyad: function (number) {
  //   return this._applyCombination(polyad, [number]);
  // },
  triad: function triad() {
    return this._applyCombination(polyad, [3]);
  },
  tetrad: function tetrad() {
    return this._applyCombination(polyad, [4]);
  }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function (color, opts) {
  if (_typeof(color) == "object") {
    var newColor = {};
    for (var i in color) {
      if (color.hasOwnProperty(i)) {
        if (i === "a") {
          newColor[i] = color[i];
        } else {
          newColor[i] = convertToPercentage(color[i]);
        }
      }
    }
    color = newColor;
  }
  return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color == "string") {
    color = stringInputToObject(color);
  }
  if (_typeof(color) == "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (color.hasOwnProperty("a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
}

// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
  var r, g, b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = [v, q, p, p, t, v][mod],
    g = [t, v, v, q, p, p][mod],
    b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];

  // Return a 3 character hex if possible
  if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];

  // Return a 4 character hex if possible
  if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
  if (!color1 || !color2) return false;
  return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};
tinycolor.random = function () {
  return tinycolor.fromRatio({
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  });
};

// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function _desaturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s -= amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _saturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s += amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _greyscale(color) {
  return tinycolor(color).desaturate(100);
}
function _lighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l += amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}
function _brighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var rgb = tinycolor(color).toRgb();
  rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
  rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
  rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
  return tinycolor(rgb);
}
function _darken(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l -= amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function _spin(color, amount) {
  var hsl = tinycolor(color).toHsl();
  var hue = (hsl.h + amount) % 360;
  hsl.h = hue < 0 ? 360 + hue : hue;
  return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function _complement(color) {
  var hsl = tinycolor(color).toHsl();
  hsl.h = (hsl.h + 180) % 360;
  return tinycolor(hsl);
}
function polyad(color, number) {
  if (isNaN(number) || number <= 0) {
    throw new Error("Argument to polyad must be a positive number");
  }
  var hsl = tinycolor(color).toHsl();
  var result = [tinycolor(color)];
  var step = 360 / number;
  for (var i = 1; i < number; i++) {
    result.push(tinycolor({
      h: (hsl.h + i * step) % 360,
      s: hsl.s,
      l: hsl.l
    }));
  }
  return result;
}
function _splitcomplement(color) {
  var hsl = tinycolor(color).toHsl();
  var h = hsl.h;
  return [tinycolor(color), tinycolor({
    h: (h + 72) % 360,
    s: hsl.s,
    l: hsl.l
  }), tinycolor({
    h: (h + 216) % 360,
    s: hsl.s,
    l: hsl.l
  })];
}
function _analogous(color, results, slices) {
  results = results || 6;
  slices = slices || 30;
  var hsl = tinycolor(color).toHsl();
  var part = 360 / slices;
  var ret = [tinycolor(color)];
  for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
    hsl.h = (hsl.h + part) % 360;
    ret.push(tinycolor(hsl));
  }
  return ret;
}
function _monochromatic(color, results) {
  results = results || 6;
  var hsv = tinycolor(color).toHsv();
  var h = hsv.h,
    s = hsv.s,
    v = hsv.v;
  var ret = [];
  var modification = 1 / results;
  while (results--) {
    ret.push(tinycolor({
      h: h,
      s: s,
      v: v
    }));
    v = (v + modification) % 1;
  }
  return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function (color1, color2, amount) {
  amount = amount === 0 ? 0 : amount || 50;
  var rgb1 = tinycolor(color1).toRgb();
  var rgb2 = tinycolor(color2).toRgb();
  var p = amount / 100;
  var rgba = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a
  };
  return tinycolor(rgba);
};

// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function (color1, color2) {
  var c1 = tinycolor(color1);
  var c2 = tinycolor(color2);
  return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function (color1, color2, wcag2) {
  var readability = tinycolor.readability(color1, color2);
  var wcag2Parms, out;
  out = false;
  wcag2Parms = validateWCAG2Parms(wcag2);
  switch (wcag2Parms.level + wcag2Parms.size) {
    case "AAsmall":
    case "AAAlarge":
      out = readability >= 4.5;
      break;
    case "AAlarge":
      out = readability >= 3;
      break;
    case "AAAsmall":
      out = readability >= 7;
      break;
  }
  return out;
};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function (baseColor, colorList, args) {
  var bestColor = null;
  var bestScore = 0;
  var readability;
  var includeFallbackColors, level, size;
  args = args || {};
  includeFallbackColors = args.includeFallbackColors;
  level = args.level;
  size = args.size;
  for (var i = 0; i < colorList.length; i++) {
    readability = tinycolor.readability(baseColor, colorList[i]);
    if (readability > bestScore) {
      bestScore = readability;
      bestColor = tinycolor(colorList[i]);
    }
  }
  if (tinycolor.isReadable(baseColor, bestColor, {
    level: level,
    size: size
  }) || !includeFallbackColors) {
    return bestColor;
  } else {
    args.includeFallbackColors = false;
    return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
  }
};

// Big List of Colors
// ------------------
// <https://www.w3.org/TR/css-color-4/#named-colors>
var names = tinycolor.names = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);

// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
  var flipped = {};
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      flipped[o[i]] = i;
    }
  }
  return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
  if (isOnePointZero(n)) n = "100%";
  var processPercent = isPercentage(n);
  n = Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return n % max / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
  return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
  return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
  return c.length == 1 ? "0" + c : "" + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
  if (n <= 1) {
    n = n * 100 + "%";
  }
  return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
var matchers = function () {
  // <http://www.w3.org/TR/css3-values/#integers>
  var CSS_INTEGER = "[-\\+]?\\d+%?";

  // <http://www.w3.org/TR/css3-values/#number-value>
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

  // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
  var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

  // Actual matching.
  // Parentheses and commas are optional, but not required.
  // Whitespace can take the place of commas or opening paren
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  return {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
}();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
  return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {
  color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color == "transparent") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: "name"
    };
  }

  // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  var match;
  if (match = matchers.rgb.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  if (match = matchers.rgba.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsl.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  if (match = matchers.hsla.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsv.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  if (match = matchers.hsva.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hex8.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex6.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  if (match = matchers.hex4.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      a: convertHexToDecimal(match[4] + "" + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex3.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function validateWCAG2Parms(parms) {
  // return valid WCAG2 parms for isReadable.
  // If input parms are invalid, return {"level":"AA", "size":"small"}
  var level, size;
  parms = parms || {
    level: "AA",
    size: "small"
  };
  level = (parms.level || "AA").toUpperCase();
  size = (parms.size || "small").toLowerCase();
  if (level !== "AA" && level !== "AAA") {
    level = "AA";
  }
  if (size !== "small" && size !== "large") {
    size = "small";
  }
  return {
    level: level,
    size: size
  };
}

/**
 * @typedef {Object} TinyGradient.StopInput
 * @property {ColorInput} color
 * @property {number} pos
 */

/**
 * @typedef {Object} TinyGradient.StepValue
 * @type {number} [r]
 * @type {number} [g]
 * @type {number} [b]
 * @type {number} [h]
 * @type {number} [s]
 * @type {number} [v]
 * @type {number} [a]
 */

/**
 * @type {StepValue}
 */
var RGBA_MAX = {
  r: 256,
  g: 256,
  b: 256,
  a: 1
};

/**
 * @type {StepValue}
 */
var HSVA_MAX = {
  h: 360,
  s: 1,
  v: 1,
  a: 1
};

/**
 * Linearly compute the step size between start and end (not normalized)
 * @param {StepValue} start
 * @param {StepValue} end
 * @param {number} steps - number of desired steps
 * @return {StepValue}
 */
function stepize(start, end, steps) {
  var step = {};
  for (var _k0 in start) {
    if (start.hasOwnProperty(_k0)) {
      step[_k0] = steps === 0 ? 0 : (end[_k0] - start[_k0]) / steps;
    }
  }
  return step;
}

/**
 * Compute the final step color
 * @param {StepValue} step - from `stepize`
 * @param {StepValue} start
 * @param {number} i - color index
 * @param {StepValue} max - rgba or hsva of maximum values for each channel
 * @return {StepValue}
 */
function interpolate(step, start, i, max) {
  var color = {};
  for (var _k1 in start) {
    if (start.hasOwnProperty(_k1)) {
      color[_k1] = step[_k1] * i + start[_k1];
      color[_k1] = color[_k1] < 0 ? color[_k1] + max[_k1] : max[_k1] !== 1 ? color[_k1] % max[_k1] : color[_k1];
    }
  }
  return color;
}

/**
 * Generate gradient with RGBa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateRgb(stop1, stop2, steps) {
  var start = stop1.color.toRgb();
  var end = stop2.color.toRgb();
  var step = stepize(start, end, steps);
  var gradient = [stop1.color];
  for (var _i28 = 1; _i28 < steps; _i28++) {
    var color = interpolate(step, start, _i28, RGBA_MAX);
    gradient.push(tinycolor(color));
  }
  return gradient;
}

/**
 * Generate gradient with HSVa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @param {boolean|'long'|'short'} mode
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateHsv(stop1, stop2, steps, mode) {
  var start = stop1.color.toHsv();
  var end = stop2.color.toHsv();

  // rgb interpolation if one of the steps in grayscale
  if (start.s === 0 || end.s === 0) {
    return interpolateRgb(stop1, stop2, steps);
  }
  var trigonometric;
  if (typeof mode === 'boolean') {
    trigonometric = mode;
  } else {
    var trigShortest = start.h < end.h && end.h - start.h < 180 || start.h > end.h && start.h - end.h > 180;
    trigonometric = mode === 'long' && trigShortest || mode === 'short' && !trigShortest;
  }
  var step = stepize(start, end, steps);
  var gradient = [stop1.color];

  // recompute hue
  var diff;
  if (start.h <= end.h && !trigonometric || start.h >= end.h && trigonometric) {
    diff = end.h - start.h;
  } else if (trigonometric) {
    diff = 360 - end.h + start.h;
  } else {
    diff = 360 - start.h + end.h;
  }
  step.h = Math.pow(-1, trigonometric ? 1 : 0) * Math.abs(diff) / steps;
  for (var _i29 = 1; _i29 < steps; _i29++) {
    var color = interpolate(step, start, _i29, HSVA_MAX);
    gradient.push(tinycolor(color));
  }
  return gradient;
}

/**
 * Compute substeps between each stops
 * @param {StopInput[]} stops
 * @param {number} steps
 * @return {number[]}
 */
function computeSubsteps(stops, steps) {
  var l = stops.length;

  // validation
  steps = parseInt(steps, 10);
  if (isNaN(steps) || steps < 2) {
    throw new Error('Invalid number of steps (< 2)');
  }
  if (steps < l) {
    throw new Error('Number of steps cannot be inferior to number of stops');
  }

  // compute substeps from stop positions
  var substeps = [];
  for (var _i30 = 1; _i30 < l; _i30++) {
    var step = (steps - 1) * (stops[_i30].pos - stops[_i30 - 1].pos);
    substeps.push(Math.max(1, Math.round(step)));
  }

  // adjust number of steps
  var totalSubsteps = 1;
  for (var _n4 = l - 1; _n4--;) totalSubsteps += substeps[_n4];
  while (totalSubsteps !== steps) {
    if (totalSubsteps < steps) {
      var min = Math.min.apply(null, substeps);
      substeps[substeps.indexOf(min)]++;
      totalSubsteps++;
    } else {
      var max = Math.max.apply(null, substeps);
      substeps[substeps.indexOf(max)]--;
      totalSubsteps--;
    }
  }
  return substeps;
}

/**
 * Compute the color at a specific position
 * @param {StopInput[]} stops
 * @param {number} pos
 * @param {string} method
 * @param {StepValue} max
 * @returns {tinycolor}
 */
function computeAt(stops, pos, method, max) {
  if (pos < 0 || pos > 1) {
    throw new Error('Position must be between 0 and 1');
  }
  var start, end;
  for (var _i31 = 0, _l6 = stops.length; _i31 < _l6 - 1; _i31++) {
    if (pos >= stops[_i31].pos && pos < stops[_i31 + 1].pos) {
      start = stops[_i31];
      end = stops[_i31 + 1];
      break;
    }
  }
  if (!start) {
    start = end = stops[stops.length - 1];
  }
  var step = stepize(start.color[method](), end.color[method](), (end.pos - start.pos) * 100);
  var color = interpolate(step, start.color[method](), (pos - start.pos) * 100, max);
  return tinycolor(color);
}
var TinyGradient = /*#__PURE__*/function () {
  /**
   * @param {StopInput[]|ColorInput[]} stops
   * @returns {TinyGradient}
   */
  function TinyGradient(stops) {
    _classCallCheck(this, TinyGradient);
    // validation
    if (stops.length < 2) {
      throw new Error('Invalid number of stops (< 2)');
    }
    var havingPositions = stops[0].pos !== undefined;
    var l = stops.length;
    var p = -1;
    var lastColorLess = false;
    // create tinycolor objects and clean positions
    this.stops = stops.map(function (stop, i) {
      var hasPosition = stop.pos !== undefined;
      if (havingPositions ^ hasPosition) {
        throw new Error('Cannot mix positionned and not posionned color stops');
      }
      if (hasPosition) {
        var hasColor = stop.color !== undefined;
        if (!hasColor && (lastColorLess || i === 0 || i === l - 1)) {
          throw new Error('Cannot define two consecutive position-only stops');
        }
        lastColorLess = !hasColor;
        stop = {
          color: hasColor ? tinycolor(stop.color) : null,
          colorLess: !hasColor,
          pos: stop.pos
        };
        if (stop.pos < 0 || stop.pos > 1) {
          throw new Error('Color stops positions must be between 0 and 1');
        } else if (stop.pos < p) {
          throw new Error('Color stops positions are not ordered');
        }
        p = stop.pos;
      } else {
        stop = {
          color: tinycolor(stop.color !== undefined ? stop.color : stop),
          pos: i / (l - 1)
        };
      }
      return stop;
    });
    if (this.stops[0].pos !== 0) {
      this.stops.unshift({
        color: this.stops[0].color,
        pos: 0
      });
      l++;
    }
    if (this.stops[l - 1].pos !== 1) {
      this.stops.push({
        color: this.stops[l - 1].color,
        pos: 1
      });
    }
  }

  /**
   * Return new instance with reversed stops
   * @return {TinyGradient}
   */
  return _createClass(TinyGradient, [{
    key: "reverse",
    value: function reverse() {
      var stops = [];
      this.stops.forEach(function (stop) {
        stops.push({
          color: stop.color,
          pos: 1 - stop.pos
        });
      });
      return new TinyGradient(stops.reverse());
    }

    /**
     * Return new instance with looped stops
     * @return {TinyGradient}
     */
  }, {
    key: "loop",
    value: function loop() {
      var stops1 = [];
      var stops2 = [];
      this.stops.forEach(function (stop) {
        stops1.push({
          color: stop.color,
          pos: stop.pos / 2
        });
      });
      this.stops.slice(0, -1).forEach(function (stop) {
        stops2.push({
          color: stop.color,
          pos: 1 - stop.pos / 2
        });
      });
      return new TinyGradient(stops1.concat(stops2.reverse()));
    }

    /**
     * Generate gradient with RGBa interpolation
     * @param {number} steps
     * @return {tinycolor[]}
     */
  }, {
    key: "rgb",
    value: function rgb(steps) {
      var _this34 = this;
      var substeps = computeSubsteps(this.stops, steps);
      var gradient = [];
      this.stops.forEach(function (stop, i) {
        if (stop.colorLess) {
          stop.color = interpolateRgb(_this34.stops[i - 1], _this34.stops[i + 1], 2)[1];
        }
      });
      for (var _i32 = 0, _l7 = this.stops.length; _i32 < _l7 - 1; _i32++) {
        var _rgb2 = interpolateRgb(this.stops[_i32], this.stops[_i32 + 1], substeps[_i32]);
        gradient.splice.apply(gradient, [gradient.length, 0].concat(_toConsumableArray(_rgb2)));
      }
      gradient.push(this.stops[this.stops.length - 1].color);
      return gradient;
    }

    /**
     * Generate gradient with HSVa interpolation
     * @param {number} steps
     * @param {boolean|'long'|'short'} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
  }, {
    key: "hsv",
    value: function hsv(steps, mode) {
      var _this35 = this;
      var substeps = computeSubsteps(this.stops, steps);
      var gradient = [];
      this.stops.forEach(function (stop, i) {
        if (stop.colorLess) {
          stop.color = interpolateHsv(_this35.stops[i - 1], _this35.stops[i + 1], 2, mode)[1];
        }
      });
      for (var _i33 = 0, _l8 = this.stops.length; _i33 < _l8 - 1; _i33++) {
        var _hsv2 = interpolateHsv(this.stops[_i33], this.stops[_i33 + 1], substeps[_i33], mode);
        gradient.splice.apply(gradient, [gradient.length, 0].concat(_toConsumableArray(_hsv2)));
      }
      gradient.push(this.stops[this.stops.length - 1].color);
      return gradient;
    }

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
  }, {
    key: "css",
    value: function css(mode, direction) {
      mode = mode || 'linear';
      direction = direction || (mode === 'linear' ? 'to right' : 'ellipse at center');
      var css = mode + '-gradient(' + direction;
      this.stops.forEach(function (stop) {
        css += ', ' + (stop.colorLess ? '' : stop.color.toRgbString() + ' ') + stop.pos * 100 + '%';
      });
      css += ')';
      return css;
    }

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
  }, {
    key: "rgbAt",
    value: function rgbAt(pos) {
      return computeAt(this.stops, pos, 'toRgb', RGBA_MAX);
    }

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
  }, {
    key: "hsvAt",
    value: function hsvAt(pos) {
      return computeAt(this.stops, pos, 'toHsv', HSVA_MAX);
    }
  }]);
}();
/**
 * @param {StopInput[]|ColorInput[]|StopInput...|ColorInput...} stops
 * @returns {TinyGradient}
 */
function tinygradient(stops) {
  // varargs
  if (arguments.length === 1) {
    if (!Array.isArray(arguments[0])) {
      throw new Error('"stops" is not an array');
    }
    stops = arguments[0];
  } else {
    stops = Array.prototype.slice.call(arguments);
  }
  return new TinyGradient(stops);
}

// External dependencies
function getInterpolatedColor(opts) {
  var gradientSegments = "gradientSegments" in opts ? opts.gradientSegments : [{
    pos: 0,
    color: opts.colorMin
  }, {
    pos: 1,
    color: opts.colorMax
  }];
  var min = opts.min;
  var max = opts.max;
  var value = opts.value;
  if (value < min || value > max) return;
  var _tinygradient = tinygradient(gradientSegments);
  var pos;
  pos = (value - min) / (max - min);
  pos = Math.round(pos * 100) / 100;
  return _tinygradient.rgbAt(pos).toHexString();
}

// External dependencies
var gradientResolutionStruct = enums(["low", "medium", "high"]);
var innerGaugeModes = enums(["severity", "static", "needle"]);
// Used to validate config `segments`
var GaugeSegmentSchema = z.object({
  from: z.number(),
  color: z.string()
});
//-----------------------------------------------------------------------------
// STRUCTS
//-----------------------------------------------------------------------------
var gaugeSegmentStruct = object({
  from: number(),
  color: string()
});
var lightDarkModeColorStruct = object({
  light_mode: string(),
  dark_mode: string()
});
var setpointStruct = object({
  color: optional(union([string(), lightDarkModeColorStruct])),
  value: union([number(), string()])
});
var titlesStruct = object({
  primary: optional(string()),
  primary_color: optional(string()),
  primary_font_size: optional(string()),
  secondary: optional(string()),
  secondary_color: optional(string()),
  secondary_font_size: optional(string())
});
var valueTextsStruct = object({
  primary: optional(string()),
  primary_color: optional(string()),
  primary_unit: optional(string()),
  secondary: optional(string()),
  secondary_color: optional(string()),
  secondary_unit: optional(string())
});
var innerGaugeStruct = object({
  color_interpolation: optional(boolean()),
  gradient: optional(boolean()),
  gradient_resolution: optional(gradientResolutionStruct),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  mode: optional(innerGaugeModes),
  needle_color: optional(union([string(), lightDarkModeColorStruct])),
  segments: optional(union([string(), array(gaugeSegmentStruct)])),
  value: optional(string())
});
assign(baseLovelaceCardConfig, object({
  color_interpolation: optional(boolean()),
  entity: optional(string()),
  entity2: optional(string()),
  gradient: optional(boolean()),
  gradient_resolution: optional(gradientResolutionStruct),
  hide_background: optional(boolean()),
  inner: optional(innerGaugeStruct),
  min: optional(union([number(), string()])),
  max: optional(union([number(), string()])),
  needle: optional(boolean()),
  needle_color: optional(union([string(), lightDarkModeColorStruct])),
  segments: optional(union([string(), array(gaugeSegmentStruct)])),
  setpoint: optional(setpointStruct),
  titles: optional(titlesStruct),
  value: optional(string()),
  value_texts: optional(valueTextsStruct),
  entity_id: optional(union([string(), array(string())])),
  // actions
  tap_action: optional(actionConfigStruct),
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct)
}));

// External dependencies
/**
 * Get the configured segments array (from & color).
 * Adds an extra first segment in case the first 'from' is larger than the 'min' of the gauge.
 * Each segment is validated. On error returns full red.
 * @param [solidifyFirstMissingSegment=false] - Adds an extra element before the first 'from' to create a solid range from 'min' to 'first from'
 */
function getSegments(card, gauge, min) {
  var solidifyFirstMissingSegment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var _gauge = gauge === "main" ? "" : "inner.";
  var segments = card.getValue("".concat(_gauge, "segments"));
  if (!segments) {
    return [{
      from: 0,
      color: DEFAULT_SEVERITY_COLOR
    }];
  }
  var GaugeSegmentArraySchema = z.array(GaugeSegmentSchema);
  var validatedSegments;
  try {
    validatedSegments = GaugeSegmentArraySchema.parse(segments);
  } catch (_a) {
    error("Invalid segments definition:", segments);
    return [{
      from: 0,
      color: "#FF0000"
    }];
  }
  validatedSegments.sort(function (a, b) {
    return a.from - b.from;
  });
  // In case the first 'from' is larger than the 'min' of the gauge, add a solid segment of INFO_COLOR
  if (validatedSegments[0].from > min) {
    if (solidifyFirstMissingSegment) {
      validatedSegments.unshift({
        from: validatedSegments[0].from,
        color: INFO_COLOR
      });
    }
    validatedSegments.unshift({
      from: min,
      color: INFO_COLOR
    });
  }
  return validatedSegments;
}
/**
 * Get the configured segments array formatted as a tinygradient array (pos & color; from 0 to 1).
 * Adds an extra first solid segment in case the first 'from' is larger than the 'min' of the gauge.
 * Interpolates in case the first and/or last segment are beyond min/max.
 * Each segment is validated. On error returns full red.
 */
function getGradientSegments(card, gauge, min, max) {
  var segments = getSegments(card, gauge, min, true);
  var numLevels = segments.length;
  // gradient-path expects at least 2 segments
  if (numLevels < 2) {
    return [{
      pos: 0,
      color: segments[0].color
    }, {
      pos: 1,
      color: segments[0].color
    }];
  }
  var gradientSegments = [];
  var diff = max - min;
  for (var _i34 = 0; _i34 < numLevels; _i34++) {
    var level = segments[_i34].from;
    var color = getComputedColor(segments[_i34].color);
    var pos = void 0;
    if (level < min) {
      var nextLevel = void 0;
      var nextColor = void 0;
      if (_i34 + 1 < numLevels) {
        nextLevel = segments[_i34 + 1].from;
        nextColor = getComputedColor(segments[_i34 + 1].color);
        if (nextLevel <= min) {
          // both current level and next level are invisible -> skip
          continue;
        }
      } else {
        // only current level is below minimum. The next iteration will determine what to do with this segment
        continue;
      }
      // segment is partly invisible, so we interpolate the minimum color to pos 0
      color = getInterpolatedColor({
        min: level,
        colorMin: color,
        max: nextLevel,
        colorMax: nextColor,
        value: min
      });
      pos = 0;
    } else if (level > max) {
      var prevLevel = void 0;
      var prevColor = void 0;
      if (_i34 > 0) {
        prevLevel = segments[_i34 - 1].from;
        prevColor = getComputedColor(segments[_i34 - 1].color);
        if (prevLevel >= max) {
          // both current level and previous level are invisible -> skip
          continue;
        }
      } else {
        // only current level is above maximum. The next iteration will determine what to do with this segment
        continue;
      }
      // segment is partly invisible, so we interpolate the maximum color to pos 1
      color = getInterpolatedColor({
        min: prevLevel,
        colorMin: prevColor,
        max: level,
        colorMax: color,
        value: max
      });
      pos = 1;
    } else {
      pos = (level - min) / diff;
    }
    gradientSegments.push({
      pos: pos,
      color: color
    });
  }
  if (gradientSegments.length < 2) {
    if (max <= segments[0].from) {
      // current range below lowest segment
      var _color = getComputedColor(segments[0].color);
      return [{
        pos: 0,
        color: _color
      }, {
        pos: 1,
        color: _color
      }];
    } else {
      // current range above highest segment
      var _color2 = getComputedColor(segments[numLevels - 1].color);
      return [{
        pos: 0,
        color: _color2
      }, {
        pos: 1,
        color: _color2
      }];
    }
  }
  return gradientSegments;
}
/**
 * Compute the segment color at a specific value
 */
function computeSeverity(card, gauge, min, max, value) {
  if (gauge === "main" && card._config.needle) return undefined;
  if (gauge === "inner" && ["static", "needle"].includes(card._config.inner.mode)) return undefined;
  var interpolation = gauge === "main" ? card._config.color_interpolation : card._config.inner.color_interpolation; // here we're sure to have an inner
  if (interpolation) {
    var gradienSegments = getGradientSegments(card, gauge, min, max);
    return getInterpolatedColor({
      gradientSegments: gradienSegments,
      min: min,
      max: max,
      value: Math.min(value, max) // beyond max, the gauge shows max. Also needed for getInterpolatedColor
    });
  } else {
    return getSegmentColor(card, gauge, min, value);
  }
}
/**
 * Get the configured segment color at a specific value
 */
function getSegmentColor(card, gauge, min, value) {
  var _a;
  var segments = getSegments(card, gauge, min);
  for (var _i35 = 0; _i35 < segments.length; _i35++) {
    var segment = segments[_i35];
    if (segment && value >= segment.from && (_i35 + 1 === segments.length || value < ((_a = segments[_i35 + 1]) === null || _a === void 0 ? void 0 : _a.from))) {
      return segment.color;
    }
  }
  return DEFAULT_SEVERITY_COLOR;
}

// External dependencies
var GradientRenderer = /*#__PURE__*/function () {
  function GradientRenderer(gauge) {
    _classCallCheck(this, GradientRenderer);
    this.gauge = gauge;
  }
  return _createClass(GradientRenderer, [{
    key: "setPrevs",
    value: function setPrevs() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var segments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      this._prevMin = min;
      this._prevMax = max;
      this._prevSegments = segments;
    }
  }, {
    key: "render",
    value: function render(card) {
      var _a, _b, _c, _d, _e, _f, _g;
      var config = card._config;
      var hasGradient = this.gauge === "main" ? config.gradient : (_a = config.inner) === null || _a === void 0 ? void 0 : _a.gradient;
      if (!hasGradient) {
        this.setPrevs();
        return;
      }
      var min = toNumberOrDefault(card.getValue("min"), DEFAULT_MIN);
      var max = toNumberOrDefault(card.getValue("max"), DEFAULT_MAX);
      if (this.gauge === "inner") {
        min = toNumberOrDefault(card.getValue("inner.min"), min);
        max = toNumberOrDefault(card.getValue("inner.max"), max);
      }
      var gradientPathContainer = (_d = (_c = (_b = card.renderRoot.querySelector("ha-card > gauge-card-pro-gauge")) === null || _b === void 0 ? void 0 : _b.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector("#".concat(this.gauge, "-gauge"))) === null || _d === void 0 ? void 0 : _d.querySelector("#gradient-path-container");
      var segments = getGradientSegments(card, this.gauge, min, max);
      // Check whether any significant parameters have changed
      if (gradientPathContainer !== null && min === this._prevMin && max === this._prevMax && JSON.stringify(segments) === JSON.stringify(this._prevSegments)) {
        this.setPrevs();
        return;
      }
      var levelPath = (_g = (_f = (_e = card.renderRoot.querySelector("ha-card > gauge-card-pro-gauge")) === null || _e === void 0 ? void 0 : _e.shadowRoot) === null || _f === void 0 ? void 0 : _f.querySelector("#".concat(this.gauge, "-gauge"))) === null || _g === void 0 ? void 0 : _g.querySelector("#gradient-path");
      if (!levelPath) {
        this.setPrevs();
        return;
      }
      var gaugeConfig = this.gauge === "main" ? config : config === null || config === void 0 ? void 0 : config.inner;
      var width = this.gauge === "main" ? 14 : 4;
      var gradientResolution = gaugeConfig && gaugeConfig.gradient_resolution !== undefined && Object.keys(GRADIENT_RESOLUTION_MAP).includes(gaugeConfig.gradient_resolution) ? gaugeConfig.gradient_resolution : DEFAULT_GRADIENT_RESOLUTION;
      try {
        var gp = new GradientPath({
          path: levelPath,
          segments: GRADIENT_RESOLUTION_MAP[gradientResolution].segments,
          samples: GRADIENT_RESOLUTION_MAP[gradientResolution].samples,
          removeChild: false
        });
        gp.render({
          type: "path",
          fill: segments,
          width: width,
          stroke: segments,
          strokeWidth: 1
        });
      } catch (e) {
        error("Error gradient:", e);
      }
      this.setPrevs(min, max, segments);
    }
  }]);
}(); // Internalized external dependencies
/**
 * Converts a numeric value within a specified range into an angle between 0° and 180°.
 *
 * This function first normalizes the input `value` relative to the provided `min` and `max` bounds,
 * then computes its percentage position within that range, and finally maps that percentage to
 * an angle on a semicircle (0–180 degrees).
 *
 * @param value - The current value to convert into an angle.
 * @param min   - The minimum possible value (corresponds to 0°).
 * @param max   - The maximum possible value (corresponds to 180°).
 * @returns A number in degrees (0–180) representing where `value` falls within the `[min, max]` range.
 */
var getAngle = function getAngle(value, min, max) {
  var percentage = getValueInPercentage(normalize(value, min, max), min, max);
  return percentage * 180 / 100;
};

/**
 * Determines whether a given value represents an icon function call in string form.
 *
 * This function checks if the provided value is a string that starts with
 * `"icon("` and ends with `")"`. It returns `true` if both conditions are met,
 * indicating that the string is formatted as an icon invocation, and `false`
 * otherwise.
 *
 * @param {*} value_text - The value to test. If it is not a string, the function
 *                         will immediately return `false`.
 * @returns {boolean} `true` if `value_text` is a string starting with `"icon("`
 *                    and ending with `")"`, otherwise `false`.
 */
var isIcon = function isIcon(value_text) {
  if (typeof value_text !== "string") return false;
  return value_text.startsWith("icon(") && value_text.endsWith(")");
};
/**
 * Extracts the inner icon name from a wrapped icon string, or returns the original value if it's not an icon.
 *
 * @param {*} value_text - The value to check. Expected to be a string in the form `"icon(name)"` or any other type.
 * @returns {string|*} If `value_text` is an icon (as determined by `isIcon`), returns the inner name (everything between `"icon("` and `")"`). Otherwise, returns `value_text` unchanged.
 */
var getIcon = function getIcon(value_text) {
  if (!isIcon(value_text)) return value_text;
  return value_text.slice(5, -1);
};
var gaugeCSS = i$5(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  :host {\n    position: relative;\n  }\n  .gauge {\n    display: block;\n  }\n  .dial {\n    fill: none;\n    stroke: var(--primary-background-color);\n    stroke-width: 15;\n  }\n  .inner-gauge {\n    position: absolute;\n    top: 0;\n  }\n  .value {\n    fill: none;\n    stroke-width: 15;\n    stroke: var(--gauge-color);\n    transition: all 1s ease 0s;\n  }\n  .inner-value {\n    fill: none;\n    stroke-width: 5;\n    stroke: var(--inner-gauge-color);\n    transition: all 1.5s ease 0s;\n  }\n  .inner-value-stroke {\n    fill: none;\n    stroke-width: 6;\n    stroke: var(--card-background-color);\n    transition: all 1.5s ease 0s;\n  }\n  .needles {\n    position: absolute;\n    top: 0;\n  }\n  .needle {\n    transition: all 1s ease 0s;\n  }\n  .segment {\n    fill: none;\n    stroke-width: 15;\n  }\n  .inner-segment {\n    fill: none;\n    stroke-width: 5;\n  }\n  .primary-value-text {\n    position: absolute;\n    max-height: 40%;\n    max-width: 55%;\n    left: 50%;\n    bottom: -6%;\n    transform: translate(-50%, 0%);\n  }\n  .primary-value-icon {\n    position: absolute;\n    height: 40%;\n    width: 100%;\n    bottom: -3%;\n  }\n  .primary-value-state-icon {\n    --mdc-icon-size: 19%;\n  }\n  .secondary-value-text {\n    position: absolute;\n    max-height: 22%;\n    max-width: 45%;\n    left: 50%;\n    bottom: 29%;\n    transform: translate(-50%, 0%);\n  }\n  .secondary-value-icon {\n    position: absolute;\n    height: 22%;\n    width: 100%;\n    bottom: 32%;\n  }\n  .secondary-value-state-icon {\n    --mdc-icon-size: 10%;\n  }\n  .value-text {\n    font-size: 50px;\n    text-anchor: middle;\n    direction: ltr;\n  }\n  .value-state-icon {\n    position: absolute;\n    bottom: 0%;\n    text-align: center;\n    line-height: 0;\n  }\n"])));
var GaugeCardProGauge = /*#__PURE__*/function (_i$3) {
  function GaugeCardProGauge() {
    var _this36;
    _classCallCheck(this, GaugeCardProGauge);
    _this36 = _callSuper(this, GaugeCardProGauge, arguments);
    // main gauge
    _this36.hasGradient = false;
    _this36.max = 100;
    _this36.min = 0;
    _this36.needle = false;
    _this36.needleColor = "";
    _this36.value = 0;
    _this36.primaryValueTextColor = "";
    _this36.secondaryValueTextColor = "";
    // inner gauge
    _this36.hasInnerGauge = false;
    _this36.innerHasGradient = false;
    _this36.innerMax = 100;
    _this36.innerMin = 0;
    _this36.innerMode = "severity";
    _this36.innerNeedleColor = "";
    _this36.innerValue = 0;
    // setpoint
    _this36.setpoint = false;
    _this36.setpointNeedleColor = "";
    _this36.setpointValue = 0;
    _this36._angle = 0;
    _this36._inner_angle = 0;
    _this36._setpoint_angle = 0;
    _this36._updated = false;
    return _this36;
  }
  _inherits(GaugeCardProGauge, _i$3);
  return _createClass(GaugeCardProGauge, [{
    key: "_calculate_angles",
    value: function _calculate_angles() {
      this._angle = getAngle(this.value, this.min, this.max);
      this._inner_angle = this.hasInnerGauge ? getAngle(this.innerValue, this.innerMin, this.innerMax) : 0;
      this._setpoint_angle = getAngle(this.setpointValue, this.min, this.max);
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated(changedProperties) {
      var _this37 = this;
      _superPropGet(GaugeCardProGauge, "firstUpdated", this, 3)([changedProperties]);
      // Wait for the first render for the initial animation to work
      afterNextRender(function () {
        _this37._updated = true;
        _this37._calculate_angles();
        _this37._rescaleValueTextSvg();
      });
    }
  }, {
    key: "updated",
    value: function updated(changedProperties) {
      _superPropGet(GaugeCardProGauge, "updated", this, 3)([changedProperties]);
      if (!this._updated) {
        return;
      }
      this._calculate_angles();
      if (changedProperties.has("primaryValueText")) {
        this._rescaleValueTextSvg("primary");
      }
      if (changedProperties.has("secondaryValueText")) {
        this._rescaleValueTextSvg("secondary");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this38 = this;
      return b(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n      <svg id=\"main-gauge\" viewBox=\"-50 -50 100 50\" class=\"gauge\">\n        ", "\n\n        ", "\n        \n        ", "\n      </svg>\n\n      ", "\n\n      ", "\n      \n      ", "\n\n      ", ""])), !this.needle ? b(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<path\n                class=\"dial\"\n                d=\"M -40 0 A 40 40 0 0 1 40 0\"\n              ></path>\n              <path\n                class=\"value\"\n                d=\"M -40 0 A 40 40 0 1 0 40 0\"\n                style=", "\n              > </path>"])), o({
        transform: "rotate(".concat(this._angle, "deg)")
      })) : "", this.needle && !this.hasGradient ? this.segments.sort(function (a, b) {
        return a.from - b.from;
      }).map(function (segment) {
        var angle = getAngle(segment.from, _this38.min, _this38.max);
        return b(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<path\n                      class=\"segment\"\n                      d=\"M\n                        ", "\n                        ", "\n                        A 40 40 0 0 1 40 0\"\n                      style=", "\n                    ></path>"])), 0 - 40 * Math.cos(angle * Math.PI / 180), 0 - 40 * Math.sin(angle * Math.PI / 180), o({
          stroke: segment.color
        }));
      }) : "", this.needle && this.hasGradient ? b(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["<path\n                id=\"gradient-path\"\n                class=\"dial\"\n                d=\"M -40 0 A 40 40 0 0 1 40 0\"\n                style=", "\n              ></path>"])), o({
        opacity: "0%"
      })) : "", this.hasInnerGauge ? b(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n            <svg id=\"inner-gauge\" viewBox=\"-50 -50 100 50\" class=\"inner-gauge\">\n      \n          ", "  \n\n          ", "\n\n          ", "\n\n          ", "\n        "])), this.innerMode == "severity" && this.innerValue > this.innerMin ? b(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n                  <path\n                    class=\"inner-value-stroke\"\n                    d=\"M -32.5 0 A 32.5 32.5 0 1 0 32.5 0\"\n                    style=", "\n                  ></path>\n                  <path\n                    class=\"inner-value\"\n                    d=\"M -32 0 A 32 32 0 1 0 32 0\"\n                    style=", "\n                  ></path>\n              "])), o({
        transform: "rotate(".concat(this._inner_angle + 1.5, "deg)")
      }), o({
        transform: "rotate(".concat(this._inner_angle, "deg)")
      })) : "", ["static", "needle"].includes(this.innerMode) ? b(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["\n                <path\n                    class=\"inner-value-stroke\"\n                    d=\"M -32.5 0 A 32.5 32.5 0 0 1 32.5 0\"\n                ></path>"]))) : "", ["static", "needle"].includes(this.innerMode) && this.innerHasGradient ? b(_templateObject1 || (_templateObject1 = _taggedTemplateLiteral(["<path\n                  id=\"gradient-path\"\n                  class=\"dial\"\n                  d=\"M -32 0 A 32 32 0 0 1 32 0\"\n                  style=", "\n                ></path>"])), o({
        opacity: "0%"
      })) : "", ["static", "needle"].includes(this.innerMode) && this.innerSegments && !this.innerHasGradient ? b(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n                  ", "\n                </svg>"])), this.innerSegments.sort(function (a, b) {
        return a.from - b.from;
      }).map(function (segment) {
        var angle = getAngle(segment.from, _this38.innerMin, _this38.innerMax);
        return b(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["<path\n                            class=\"inner-segment\"\n                            d=\"M\n                              ", "\n                              ", "\n                              A 32 32 0 0 1 32 0\"\n                            style=", "\n                          ></path>"])), 0 - 32 * Math.cos(angle * Math.PI / 180), 0 - 32 * Math.sin(angle * Math.PI / 180), o({
          stroke: segment.color
        }));
      })) : "") : "", this.needle || this.innerMode === "needle" || this.setpoint ? b(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n        <svg viewBox=\"-50 -50 100 50\" class=\"needles\">\n\n          ", "\n\n          ", " \n\n          ", " \n\n        </svg>"])), this.needle ? b(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n                <path\n                  class=\"needle\"\n                  d=", "\n                  style=", "\n                ></path>"])), this.innerMode === "needle" ? MAIN_GAUGE_NEEDLE_WITH_INNER : MAIN_GAUGE_NEEDLE, o({
        transform: "rotate(".concat(this._angle, "deg)"),
        fill: this.needleColor
      })) : "", this.setpoint ? b(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n                <path\n                  class=\"needle\"\n                  d=", "\n                  style=", "\n                ></path>"])), MAIN_GAUGE_SETPOINT_NEEDLE, o({
        transform: "rotate(".concat(this._setpoint_angle, "deg)"),
        fill: this.setpointNeedleColor
      })) : "", this.innerMode === "needle" ? b(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n                <path\n                  class=\"needle\"\n                  d=", "\n                  style=", "\n                ></path>"])), INNER_GAUGE_NEEDLE, o({
        transform: "rotate(".concat(this._inner_angle, "deg)"),
        fill: this.innerNeedleColor
      })) : "") : "", !isIcon(this.primaryValueText) ? b(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["\n            <svg class=\"primary-value-text\">\n              <text \n                class=\"value-text\"\n                style=", ">\n                ", "\n              </text>\n            </svg>"])), o({
        fill: this.primaryValueTextColor
      }), this.primaryValueText) : x(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["<div class=\"primary-value-icon\">\n              <ha-state-icon\n                .hass=", "\n                .icon=", "\n                class=\"value-state-icon primary-value-state-icon\"\n                style=", "\n              ></ha-state-icon>\n            </div>"])), this.hass, getIcon(this.primaryValueText), o({
        color: this.primaryValueTextColor
      })), !isIcon(this.secondaryValueText) ? b(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["\n            <svg class=\"secondary-value-text\">\n              <text \n                class=\"value-text\"\n                style=", ">\n                ", "\n              </text>\n            </svg>"])), o({
        fill: this.secondaryValueTextColor
      }), this.secondaryValueText) : x(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["<div class=\"secondary-value-icon\">\n              <ha-state-icon\n                .hass=", "\n                .icon=", "\n                class=\"value-state-icon secondary-value-state-icon\"\n                style=", "\n              ></ha-state-icon>\n            </div>"])), this.hass, getIcon(this.secondaryValueText), o({
        color: this.secondaryValueTextColor
      })));
    }
    /**
     * Set the viewbox of the SVG containing the value to perfectly fit the text.
     * That way it will auto-scale correctly.
     */
  }, {
    key: "_rescaleValueTextSvg",
    value: function _rescaleValueTextSvg() {
      var _this39 = this;
      var gauge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "both";
      var _setViewBox = function _setViewBox(element) {
        var svgRoot = _this39.shadowRoot.querySelector(element);
        var box = svgRoot.querySelector("text").getBBox();
        svgRoot.setAttribute("viewBox", "".concat(box.x, " ").concat(box.y, " ").concat(box.width, " ").concat(box.height));
      };
      if (["primary", "both"].includes(gauge) && !isIcon(this.primaryValueText)) {
        _setViewBox(".primary-value-text");
      }
      if (["secondary", "both"].includes(gauge) && !isIcon(this.secondaryValueText)) {
        _setViewBox(".secondary-value-text");
      }
    }
  }]);
}(i$2);
GaugeCardProGauge.styles = gaugeCSS;
__decorate([n$1({
  attribute: false
})], GaugeCardProGauge.prototype, "hass", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "hasGradient", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "max", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "min", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "needle", void 0);
__decorate([n$1({
  type: String
})], GaugeCardProGauge.prototype, "needleColor", void 0);
__decorate([n$1({
  type: Array
})], GaugeCardProGauge.prototype, "segments", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "value", void 0);
__decorate([n$1({
  attribute: false,
  type: String
})], GaugeCardProGauge.prototype, "primaryValueText", void 0);
__decorate([n$1({
  type: String
})], GaugeCardProGauge.prototype, "primaryValueTextColor", void 0);
__decorate([n$1({
  attribute: false,
  type: String
})], GaugeCardProGauge.prototype, "secondaryValueText", void 0);
__decorate([n$1({
  type: String
})], GaugeCardProGauge.prototype, "secondaryValueTextColor", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "hasInnerGauge", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "innerHasGradient", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "innerMax", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "innerMin", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "innerMode", void 0);
__decorate([n$1({
  type: String
})], GaugeCardProGauge.prototype, "innerNeedleColor", void 0);
__decorate([n$1({
  type: Array
})], GaugeCardProGauge.prototype, "innerSegments", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "innerValue", void 0);
__decorate([n$1({
  type: Boolean
})], GaugeCardProGauge.prototype, "setpoint", void 0);
__decorate([n$1({
  type: String
})], GaugeCardProGauge.prototype, "setpointNeedleColor", void 0);
__decorate([n$1({
  type: Number
})], GaugeCardProGauge.prototype, "setpointValue", void 0);
__decorate([r()], GaugeCardProGauge.prototype, "_angle", void 0);
__decorate([r()], GaugeCardProGauge.prototype, "_inner_angle", void 0);
__decorate([r()], GaugeCardProGauge.prototype, "_setpoint_angle", void 0);
__decorate([r()], GaugeCardProGauge.prototype, "_updated", void 0);
GaugeCardProGauge = __decorate([t$1("gauge-card-pro-gauge")], GaugeCardProGauge);
var templateCache = new CacheManager(1000);
registerCustomCard({
  type: CARD_NAME,
  name: "Gauge Card Pro",
  description: "Build beautiful Gauge cards using gradients and templates"
});
var TEMPLATE_KEYS = ["inner.max", "inner.min", "inner.needle_color", "inner.segments", "inner.value", "max", "min", "needle_color", "segments", "setpoint.color", "setpoint.value", "titles.primary", "titles.primary_color", "titles.primary_font_size", "titles.secondary", "titles.secondary_color", "titles.secondary_font_size", "value", "value_texts.primary", "value_texts.primary_color", "value_texts.primary_unit", "value_texts.secondary", "value_texts.secondary_color", "value_texts.secondary_unit"];
var GaugeCardProCard = /*#__PURE__*/function (_i$4) {
  function GaugeCardProCard() {
    var _this40;
    _classCallCheck(this, GaugeCardProCard);
    _this40 = _callSuper(this, GaugeCardProCard);
    _this40._unsubRenderTemplates = new Map();
    // gradient renderers
    _this40._mainGaugeGradient = new GradientRenderer("main");
    _this40._innerGaugeGradient = new GradientRenderer("inner");
    initializeLogger(VERSION);
    return _this40;
  }
  /**
   * Get the configured segments array (from & color).
   * Adds an extra first segment in case the first 'from' is larger than the 'min' of the gauge.
   * Each segment is validated. On error returns full red.
   */
  _inherits(GaugeCardProCard, _i$4);
  return _createClass(GaugeCardProCard, [{
    key: "_getSegments",
    value: function _getSegments(gauge, min) {
      return getSegments(this, gauge, min);
    }
    /**
     * Compute the segment color at a specific value
     */
  }, {
    key: "_computeSeverity",
    value: function _computeSeverity(gauge, min, max, value) {
      return computeSeverity(this, gauge, min, max, value);
    }
  }, {
    key: "getCardSize",
    value: function getCardSize() {
      return 4;
    }
  }, {
    key: "setConfig",
    value: function setConfig(config) {
      var _this41 = this;
      config = migrate_parameters(config);
      TEMPLATE_KEYS.forEach(function (key) {
        var _a, _b;
        var currentKeyValue = getValueFromPath(_this41._config, "key");
        var newKeyValue = getValueFromPath(config, "key");
        if (newKeyValue !== currentKeyValue || ((_a = _this41._config) === null || _a === void 0 ? void 0 : _a.entity) != config.entity || ((_b = _this41._config) === null || _b === void 0 ? void 0 : _b.entity2) != config.entity2) {
          _this41._tryDisconnectKey(key);
        }
      });
      config = trySetValue(config, "tap_action.action", "more-info", true, false).result;
      config = trySetValue(config, "inner.mode", DEFAULT_INNER_MODE, false, false).result;
      this._config = config;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      _superPropGet(GaugeCardProCard, "connectedCallback", this, 3)([]);
      this._tryConnect();
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _superPropGet(GaugeCardProCard, "disconnectedCallback", this, 3)([]);
      this._tryDisconnect();
      if (this._config && this._templateResults) {
        var key = this._computeCacheKey();
        templateCache.set(key, this._templateResults);
      }
    }
  }, {
    key: "_computeCacheKey",
    value: function _computeCacheKey() {
      return hash(this._config);
    }
  }, {
    key: "willUpdate",
    value: function willUpdate(_changedProperties) {
      _superPropGet(GaugeCardProCard, "willUpdate", this, 3)([_changedProperties]);
      if (!this._config) return;
      if (!this._templateResults) {
        var key = this._computeCacheKey();
        if (templateCache.has(key)) {
          this._templateResults = templateCache.get(key);
        } else {
          this._templateResults = {};
        }
      }
    }
  }, {
    key: "_handleAction",
    value: function _handleAction(ev) {
      handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }, {
    key: "isTemplate",
    value: function isTemplate(key) {
      var _a;
      if (key === undefined) return false;
      return (_a = String(getValueFromPath(this._config, key))) === null || _a === void 0 ? void 0 : _a.includes("{");
    }
  }, {
    key: "getValue",
    value: function getValue(key) {
      var _a, _b;
      return this.isTemplate(key) ? (_b = (_a = this._templateResults) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b.result : getValueFromPath(this._config, key);
    }
  }, {
    key: "getLightDarkModeColor",
    value: function getLightDarkModeColor(key, defaultColor) {
      var configColor = this.getValue(key);
      if (_typeof2(configColor) === "object") {
        var keys = Object.keys(configColor);
        if (keys.includes("light_mode") && keys.includes("dark_mode")) {
          return computeDarkMode(this.hass) ? configColor["dark_mode"] : configColor["light_mode"];
        }
        return defaultColor;
      }
      return configColor !== null && configColor !== void 0 ? configColor : defaultColor;
    }
  }, {
    key: "getValueAndValueText",
    value: function getValueAndValueText(gauge, defaultValue) {
      var _a, _b, _c;
      var valueKey = gauge === "main" ? "value" : "inner.value";
      var valueTextKey = gauge === "main" ? "value_texts.primary" : "value_texts.secondary";
      var unitKey = gauge === "main" ? "value_texts.primary_unit" : "value_texts.secondary_unit";
      var entity = gauge === "main" ? (_a = this._config) === null || _a === void 0 ? void 0 : _a.entity : (_b = this._config) === null || _b === void 0 ? void 0 : _b.entity2;
      var templateValue = this.getValue(valueKey);
      var templateValueText = this.getValue(valueTextKey);
      var unit = (_c = this.getValue(unitKey)) !== null && _c !== void 0 ? _c : "";
      var value = undefined;
      var valueText = undefined;
      if (!templateValue && entity !== undefined) {
        var stateObj = this.hass.states[entity];
        if (stateObj) {
          value = Number(stateObj.state);
        }
      } else {
        value = templateValue;
      }
      value = toNumberOrDefault(value, defaultValue);
      if (templateValueText) {
        if (!isNaN(Number(templateValueText))) {
          valueText = formatNumberToLocal(this.hass, templateValueText);
        } else {
          valueText = templateValueText;
        }
      } else {
        if (templateValue || entity === undefined) {
          valueText = formatNumberToLocal(this.hass, value);
        } else {
          valueText = formatEntityToLocal(this.hass, entity);
        }
      }
      valueText = valueText + unit;
      return {
        value: value,
        valueText: valueText
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _a, _b;
      if (!this._config || !this.hass) return E;
      // primary
      var hasGradient = this._config.gradient;
      var hasNeedle = this._config.needle;
      var needleColor = this.getLightDarkModeColor("needle_color", DEFAULT_NEEDLE_COLOR);
      var min = toNumberOrDefault(this.getValue("min"), DEFAULT_MIN);
      var max = toNumberOrDefault(this.getValue("max"), DEFAULT_MAX);
      var segments = hasNeedle && !hasGradient ? this._getSegments("main", min) : undefined;
      var primaryValueAndValueText = this.getValueAndValueText("main", min);
      var value = primaryValueAndValueText.value;
      var primaryValueText = primaryValueAndValueText.valueText;
      var primaryValueTextColor = this.getLightDarkModeColor("value_texts.primary_color", DEFAULT_VALUE_TEXT_COLOR);
      // secondary
      var secondaryValueText;
      var secondaryValueAndValueText;
      var secondaryValueTextColor = this.getLightDarkModeColor("value_texts.secondary_color", DEFAULT_VALUE_TEXT_COLOR);
      var hasInnerGauge = this._config.inner !== undefined;
      var innerHasGradient;
      var innerMax;
      var innerMin;
      var innerMode;
      var innerNeedleColor;
      var innerSegments;
      var innerValue;
      if (hasInnerGauge) {
        innerHasGradient = (_a = this._config.inner) === null || _a === void 0 ? void 0 : _a.gradient;
        innerMax = toNumberOrDefault(this.getValue("inner.max"), max);
        innerMin = toNumberOrDefault(this.getValue("inner.min"), min);
        innerMode = this._config.inner.mode;
        innerNeedleColor = this.getLightDarkModeColor("inner.needle_color", DEFAULT_NEEDLE_COLOR);
        if (!innerHasGradient && ["static", "needle"].includes(innerMode)) {
          innerSegments = this._getSegments("inner", innerMin);
        }
        var stateObj2 = this._config.entity2 ? this.hass.states[this._config.entity2] : undefined;
        var _innerValue = this.getValue("inner.value");
        if (!_innerValue && stateObj2) {
          _innerValue = stateObj2.state;
        }
        innerValue = toNumberOrDefault(_innerValue, min);
        secondaryValueAndValueText = this.getValueAndValueText("inner", innerMin);
        innerValue = secondaryValueAndValueText.value;
      } else {
        secondaryValueAndValueText = this.getValueAndValueText("inner", 0);
      }
      secondaryValueText = secondaryValueAndValueText.valueText;
      // setpoint needle
      var hasSetpoint = ((_b = this._config.setpoint) === null || _b === void 0 ? void 0 : _b.value) !== undefined;
      var setpointNeedleColor;
      var setpointValue;
      if (hasSetpoint) {
        setpointNeedleColor = this.getLightDarkModeColor("setpoint.color", DEFAULT_SETPOINT_NEELDLE_COLOR);
        setpointValue = toNumberOrDefault(this.getValue("setpoint.value"), 0);
      }
      // primary title
      var primaryTitle = this.getValue("titles.primary");
      var primaryTitleColor = this.getLightDarkModeColor("titles.primary_color", DEFAULT_TITLE_COLOR);
      var primaryTitleFontSize = this.getValue("titles.primary_font_size");
      if (!primaryTitleFontSize || !isValidFontSize(primaryTitleFontSize)) primaryTitleFontSize = DEFAULT_TITLE_FONT_SIZE_PRIMARY;
      // secondary title
      var secondaryTitle = this.getValue("titles.secondary");
      var secondaryTitleColor = this.getLightDarkModeColor("titles.secondary_color", DEFAULT_TITLE_COLOR);
      var secondary_title_font_size = this.getValue("titles.secondary_font_size");
      if (!secondary_title_font_size || !isValidFontSize(secondary_title_font_size)) secondary_title_font_size = DEFAULT_TITLE_FONT_SIZE_SECONDARY;
      // styles
      var gaugeColor = !this._config.needle ? this._computeSeverity("main", min, max, value) : undefined;
      var innerGaugeColor = hasInnerGauge && innerMode == "severity" && innerValue > innerMin ? this._computeSeverity("inner", innerMin, innerMax, innerValue) : undefined;
      // background
      var hideBackground = this._config.hide_background ? "background: none; border: none; box-shadow: none" : "";
      return x(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["\n      <ha-card\n        @action=", "\n        .actionHandler=", "\n        style=", "\n      >\n        <gauge-card-pro-gauge\n          .hass=", "\n          .hasGradient=", "\n          .max=", "\n          .min=", "\n          .needle=", "\n          .needleColor=", "\n          .primaryValueText=", "\n          .primaryValueTextColor=", "\n          .secondaryValueText=", "\n          .secondaryValueTextColor=", "\n          .segments=", "\n          .value=", "\n          .hasInnerGauge=", "\n          .innerHasGradient=", "\n          .innerMax=", "\n          .innerMin=", "\n          .innerMode=", "\n          .innerNeedleColor=", "\n          .innerSegments=", "\n          .innerValue=", "\n          .setpoint=", "\n          .setpointNeedleColor=", "\n          .setpointValue=", "\n          style=", "\n        ></gauge-card-pro-gauge>\n\n        ", "\n        ", "\n      </ha-card>\n    "])), this._handleAction, actionHandler({
        hasHold: hasAction(this._config.hold_action),
        hasDoubleClick: hasAction(this._config.double_tap_action)
      }), hideBackground, this.hass, hasGradient, max, min, hasNeedle, needleColor, primaryValueText, primaryValueTextColor, secondaryValueText, secondaryValueTextColor, segments, value, hasInnerGauge, innerHasGradient, innerMax, innerMin, innerMode, innerNeedleColor, innerSegments, innerValue, hasSetpoint, setpointNeedleColor, setpointValue, o({
        "--gauge-color": gaugeColor,
        "--inner-gauge-color": innerGaugeColor
      }), primaryTitle ? x(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral([" <div\n              class=\"title primary-title\"\n              style=", "\n              .title=", "\n            >\n              ", "\n            </div>"])), o({
        color: primaryTitleColor,
        "font-size": primaryTitleFontSize
      }), primaryTitle, primaryTitle) : "", secondaryTitle ? x(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral([" <div\n              class=\"title\"\n              style=", "\n              .title=", "\n            >\n              ", "\n            </div>"])), o({
        color: secondaryTitleColor,
        "font-size": secondary_title_font_size
      }), secondaryTitle, secondaryTitle) : "");
    }
  }, {
    key: "updated",
    value: function updated(changedProperties) {
      _superPropGet(GaugeCardProCard, "updated", this, 3)([changedProperties]);
      if (!this._config || !this.hass) return;
      this._mainGaugeGradient.render(this);
      this._innerGaugeGradient.render(this);
      this._tryConnect();
    }
  }, {
    key: "_tryConnect",
    value: function () {
      var _tryConnect2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
        var _this42 = this;
        return _regeneratorRuntime().wrap(function _callee13$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              TEMPLATE_KEYS.forEach(function (key) {
                _this42._tryConnectKey(key);
              });
            case 1:
            case "end":
              return _context18.stop();
          }
        }, _callee13);
      }));
      function _tryConnect() {
        return _tryConnect2.apply(this, arguments);
      }
      return _tryConnect;
    }()
  }, {
    key: "_tryConnectKey",
    value: function () {
      var _tryConnectKey2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(key) {
        var _this43 = this;
        var _a, key_value, sub, result;
        return _regeneratorRuntime().wrap(function _callee14$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              if (!(this._unsubRenderTemplates.get(key) !== undefined || !this.hass || !this._config || !this.isTemplate(key))) {
                _context19.next = 2;
                break;
              }
              return _context19.abrupt("return");
            case 2:
              key_value = getValueFromPath(this._config, key);
              _context19.prev = 3;
              sub = subscribeRenderTemplate(this.hass.connection, function (result) {
                _this43._templateResults = Object.assign(Object.assign({}, _this43._templateResults), _defineProperty({}, key, result));
              }, {
                template: (_a = String(key_value)) !== null && _a !== void 0 ? _a : "",
                entity_ids: this._config.entity_id,
                variables: {
                  config: this._config,
                  user: this.hass.user.name,
                  entity: this._config.entity,
                  entity2: this._config.entity2
                },
                strict: true
              });
              this._unsubRenderTemplates.set(key, sub);
              _context19.next = 8;
              return sub;
            case 8:
              _context19.next = 15;
              break;
            case 10:
              _context19.prev = 10;
              _context19.t0 = _context19["catch"](3);
              result = {
                result: key_value !== null && key_value !== void 0 ? key_value : "",
                listeners: {
                  all: false,
                  domains: [],
                  entities: [],
                  time: false
                }
              };
              this._templateResults = Object.assign(Object.assign({}, this._templateResults), _defineProperty({}, key, result));
              this._unsubRenderTemplates.delete(key);
            case 15:
            case "end":
              return _context19.stop();
          }
        }, _callee14, this, [[3, 10]]);
      }));
      function _tryConnectKey(_x16) {
        return _tryConnectKey2.apply(this, arguments);
      }
      return _tryConnectKey;
    }()
  }, {
    key: "_tryDisconnect",
    value: function () {
      var _tryDisconnect2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
        var _this44 = this;
        return _regeneratorRuntime().wrap(function _callee15$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              TEMPLATE_KEYS.forEach(function (key) {
                _this44._tryDisconnectKey(key);
              });
            case 1:
            case "end":
              return _context20.stop();
          }
        }, _callee15);
      }));
      function _tryDisconnect() {
        return _tryDisconnect2.apply(this, arguments);
      }
      return _tryDisconnect;
    }()
  }, {
    key: "_tryDisconnectKey",
    value: function () {
      var _tryDisconnectKey2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(key) {
        var unsubRenderTemplate, unsub;
        return _regeneratorRuntime().wrap(function _callee16$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              unsubRenderTemplate = this._unsubRenderTemplates.get(key);
              if (unsubRenderTemplate) {
                _context21.next = 3;
                break;
              }
              return _context21.abrupt("return");
            case 3:
              _context21.prev = 3;
              _context21.next = 6;
              return unsubRenderTemplate;
            case 6:
              unsub = _context21.sent;
              unsub();
              this._unsubRenderTemplates.delete(key);
              _context21.next = 18;
              break;
            case 11:
              _context21.prev = 11;
              _context21.t0 = _context21["catch"](3);
              if (!(_context21.t0.code === "not_found" || _context21.t0.code === "template_error")) {
                _context21.next = 17;
                break;
              }
              ;
              _context21.next = 18;
              break;
            case 17:
              throw _context21.t0;
            case 18:
            case "end":
              return _context21.stop();
          }
        }, _callee16, this, [[3, 11]]);
      }));
      function _tryDisconnectKey(_x17) {
        return _tryDisconnectKey2.apply(this, arguments);
      }
      return _tryDisconnectKey;
    }()
  }], [{
    key: "getConfigElement",
    value: function () {
      var _getConfigElement = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
        return _regeneratorRuntime().wrap(function _callee17$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return Promise.resolve().then(function () {
                return editor;
              });
            case 2:
              return _context22.abrupt("return", document.createElement(EDITOR_NAME));
            case 3:
            case "end":
              return _context22.stop();
          }
        }, _callee17);
      }));
      function getConfigElement() {
        return _getConfigElement.apply(this, arguments);
      }
      return getConfigElement;
    }()
  }, {
    key: "getStubConfig",
    value: function () {
      var _getStubConfig = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(hass) {
        var entities, numbers;
        return _regeneratorRuntime().wrap(function _callee18$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              entities = Object.keys(hass.states);
              numbers = entities.filter(function (e) {
                return ["counter", "input_number", "number", "sensor"].includes(e.split(".")[0]);
              });
              return _context23.abrupt("return", {
                type: "custom:".concat(CARD_NAME),
                entity: numbers[0],
                segments: [{
                  from: 0,
                  color: "red"
                }, {
                  from: 25,
                  color: "#FFA500"
                }, {
                  from: 50,
                  color: "rgb(255, 255, 0)"
                }, {
                  from: 100,
                  color: "var(--green-color)"
                }],
                needle: true,
                gradient: true,
                titles: {
                  primary: "{{ state_attr(entity, 'friendly_name') }}"
                }
              });
            case 3:
            case "end":
              return _context23.stop();
          }
        }, _callee18);
      }));
      function getStubConfig(_x18) {
        return _getStubConfig.apply(this, arguments);
      }
      return getStubConfig;
    }()
  }]);
}(i$2);
GaugeCardProCard.styles = cardCSS;
__decorate([n$1({
  attribute: false
})], GaugeCardProCard.prototype, "hass", void 0);
__decorate([r()], GaugeCardProCard.prototype, "_config", void 0);
__decorate([r()], GaugeCardProCard.prototype, "_templateResults", void 0);
__decorate([r()], GaugeCardProCard.prototype, "_unsubRenderTemplates", void 0);
GaugeCardProCard = __decorate([t$1(CARD_NAME)], GaugeCardProCard);
var safeIsNaN = Number.isNaN || function ponyfill(value) {
  return typeof value === 'number' && value !== value;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual) {
  if (isEqual === void 0) {
    isEqual = areInputsEqual;
  }
  var cache = null;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
      return cache.lastResult;
    }
    var lastResult = resultFn.apply(this, newArgs);
    cache = {
      lastResult: lastResult,
      lastArgs: newArgs,
      lastThis: this
    };
    return lastResult;
  }
  memoized.clear = function clear() {
    cache = null;
  };
  return memoized;
}
var editor$2 = {
  card: {
    actions: "🏃‍♀️ Actions",
    enable_inner: "Enable inner gauge",
    entities: "⚛️ Entites",
    entity: "Entity (used in templates in action)",
    entity2: "Entity2 (used in templates)",
    gradient: "Gradient",
    gradient_resolution: "Gradient resolution",
    gradient_resolution_options: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    hide_background: "Hide background",
    inner: "🌈 Inner gauge",
    inner_mode_options: {
      severity: "Severity",
      "static": "Static",
      needle: "Needle"
    },
    main_gauge: "🌈 Main gauge",
    mode: "Mode",
    needle: "Needle",
    primary: "📋 Primary",
    primary_color: "🎨 Primary color",
    primary_font_size: "↕️ Primary font-size",
    primary_unit: "📐 Primary unit of measurement",
    secondary: "📋 Secondary",
    secondary_color: "🎨 Secondary color",
    secondary_font_size: "↕️ Secondary font-size",
    secondary_unit: "📐 Secondary unit of measurement",
    setpoint: "🎯 Setpoint needle",
    titles: "🔠 Titles",
    severity: "Severity",
    value: "Value",
    value_texts: "🔢 Value texts"
  }
};
var card = {
  not_found: "Entity not found"
};
var en = {
  editor: editor$2,
  card: card
};
var en$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  card: card,
  default: en,
  editor: editor$2
});
var editor$1 = {
  card: {
    primary_color: "🎨 Primary colour",
    secondary_color: "🎨 Secondary colour"
  }
};
var enGb = {
  editor: editor$1
};
var en_GB = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: enGb,
  editor: editor$1
});
var languages = {
  en: en$1,
  "en-GB": en_GB
};
var DEFAULT_LANG = "en";
function getTranslatedString(key, lang) {
  try {
    return key.split(".").reduce(function (o, i) {
      return o[i];
    }, languages[lang]);
  } catch (_) {
    return undefined;
  }
}
function setupCustomlocalize(hass) {
  return function (key) {
    var _a;
    var lang = (_a = hass === null || hass === void 0 ? void 0 : hass.locale.language) !== null && _a !== void 0 ? _a : DEFAULT_LANG;
    var translated = getTranslatedString(key, lang);
    if (!translated) translated = getTranslatedString(key, DEFAULT_LANG);
    return translated !== null && translated !== void 0 ? translated : key;
  };
}
var GaugeCardProEditor = /*#__PURE__*/function (_i$5) {
  function GaugeCardProEditor() {
    var _this45;
    _classCallCheck(this, GaugeCardProEditor);
    _this45 = _callSuper(this, GaugeCardProEditor, arguments);
    _this45._schema = memoizeOne(function (showGradient, showGradientResolution, enableInner, showInnerGradient, showInnerGradientResolution) {
      return [{
        name: "entities",
        type: "expandable",
        expanded: true,
        flatten: true,
        schema: [{
          name: "entity",
          selector: {
            entity: {
              domain: ["counter", "input_number", "number", "sensor"]
            }
          }
        }, {
          name: "entity2",
          selector: {
            entity: {
              domain: ["counter", "input_number", "number", "sensor"]
            }
          }
        }]
      }, {
        name: "main_gauge",
        type: "expandable",
        expanded: true,
        flatten: true,
        schema: [{
          name: "value",
          selector: {
            template: {}
          }
        }, {
          name: "min",
          selector: {
            template: {}
          }
        }, {
          name: "max",
          selector: {
            template: {}
          }
        }, {
          name: "",
          type: "grid",
          schema: [{
            name: "needle",
            selector: {
              boolean: {}
            }
          }, {}]
        }].concat(_toConsumableArray(showGradient ? [{
          name: "",
          type: "grid",
          schema: [{
            name: "gradient",
            selector: {
              boolean: {}
            }
          }].concat(_toConsumableArray(showGradientResolution ? [{
            name: "gradient_resolution",
            selector: {
              select: {
                value: "gradient_resolution",
                options: [{
                  value: "low",
                  label: _this45._customLocalize("gradient_resolution_options.low")
                }, {
                  value: "medium",
                  label: _this45._customLocalize("gradient_resolution_options.medium")
                }, {
                  value: "high",
                  label: _this45._customLocalize("gradient_resolution_options.high")
                }],
                mode: "dropdown"
              }
            }
          }] : [{}]))
        }] : [{}]))
      }, {
        name: "enable_inner",
        selector: {
          boolean: {}
        }
      }].concat(_toConsumableArray(enableInner ? [{
        name: "inner",
        type: "expandable",
        flatten: false,
        expanded: true,
        schema: [{
          name: "value",
          selector: {
            template: {}
          }
        }, {
          name: "min",
          selector: {
            template: {}
          }
        }, {
          name: "max",
          selector: {
            template: {}
          }
        }, {
          name: "",
          type: "grid",
          schema: [{
            name: "mode",
            selector: {
              select: {
                value: "inner_mode",
                options: [{
                  value: "severity",
                  label: _this45._customLocalize("inner_mode_options.severity")
                }, {
                  value: "static",
                  label: _this45._customLocalize("inner_mode_options.static")
                }, {
                  value: "needle",
                  label: _this45._customLocalize("inner_mode_options.needle")
                }],
                mode: "dropdown"
              }
            }
          }, {}]
        }].concat(_toConsumableArray(showInnerGradient ? [{
          name: "",
          type: "grid",
          schema: [{
            name: "gradient",
            selector: {
              boolean: {}
            }
          }].concat(_toConsumableArray(showInnerGradientResolution ? [{
            name: "gradient_resolution",
            selector: {
              select: {
                value: "gradient_resolution",
                options: [{
                  value: "low",
                  label: _this45._customLocalize("gradient_resolution_options.low")
                }, {
                  value: "medium",
                  label: _this45._customLocalize("gradient_resolution_options.medium")
                }, {
                  value: "high",
                  label: _this45._customLocalize("gradient_resolution_options.high")
                }],
                mode: "dropdown"
              }
            }
          }] : [{}]))
        }] : [{}]))
      }] : [{}]), [{
        name: "setpoint",
        type: "expandable",
        flatten: false,
        schema: [{
          name: "value",
          selector: {
            template: {}
          }
        }, {
          name: "color",
          selector: {
            template: {}
          }
        }]
      }, {
        name: "titles",
        type: "expandable",
        flatten: false,
        schema: [{
          type: "grid",
          column_min_width: "100%",
          schema: [{
            name: "primary",
            selector: {
              template: {}
            }
          }, {
            name: "secondary",
            selector: {
              template: {}
            }
          }, {
            name: "primary_color",
            selector: {
              template: {}
            }
          }, {
            name: "secondary_color",
            selector: {
              template: {}
            }
          }, {
            name: "primary_font_size",
            selector: {
              template: {}
            }
          }, {
            name: "secondary_font_size",
            selector: {
              template: {}
            }
          }]
        }]
      }, {
        name: "value_texts",
        type: "expandable",
        flatten: false,
        schema: [{
          type: "grid",
          column_min_width: "100%",
          schema: [{
            name: "primary",
            selector: {
              template: {}
            }
          }, {
            name: "secondary",
            selector: {
              template: {}
            }
          }, {
            name: "primary_color",
            selector: {
              template: {}
            }
          }, {
            name: "secondary_color",
            selector: {
              template: {}
            }
          }, {
            name: "primary_unit",
            selector: {
              text: {}
            }
          }, {
            name: "secondary_unit",
            selector: {
              text: {}
            }
          }]
        }]
      }, {
        name: "actions",
        type: "expandable",
        flatten: true,
        schema: _toConsumableArray(computeActionsFormSchema())
      }, {
        name: "hide_background",
        selector: {
          boolean: {}
        }
      }]);
    });
    _this45._computeLabel = function (schema) {
      var customLocalize = setupCustomlocalize(_this45.hass);
      switch (schema.name) {
        case "color":
          return _this45.hass.localize("ui.panel.lovelace.editor.card.tile.color");
        case "max":
          return _this45.hass.localize("ui.panel.lovelace.editor.card.generic.maximum");
        case "min":
          return _this45.hass.localize("ui.panel.lovelace.editor.card.generic.minimum");
        default:
          return customLocalize("editor.card.".concat(schema.name));
      }
    };
    return _this45;
  }
  _inherits(GaugeCardProEditor, _i$5);
  return _createClass(GaugeCardProEditor, [{
    key: "_config",
    get: function get() {
      return this.config;
    },
    set: function set(value) {
      value = migrate_parameters(value);
      this.config = value;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this._config = migrate_parameters(this._config);
      _superPropGet(GaugeCardProEditor, "connectedCallback", this, 3)([]);
      void loadHaComponents();
    }
  }, {
    key: "setConfig",
    value: function setConfig(config) {
      config = migrate_parameters(config);
      // assert(config, gaugeCardProConfigStruct);
      this._config = config;
    }
  }, {
    key: "_customLocalize",
    value: function _customLocalize(value) {
      var customLocalize = setupCustomlocalize(this.hass);
      return customLocalize("editor.card.".concat(value));
    }
  }, {
    key: "render",
    value: function render() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
      if (!this.hass || !this._config) {
        return E;
      }
      var inner_mode = ((_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.inner) === null || _b === void 0 ? void 0 : _b.mode) !== undefined ? this._config.inner.mode : "";
      var inner_gradient = ((_c = this._config) === null || _c === void 0 ? void 0 : _c.inner) !== undefined ? (_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.inner) === null || _e === void 0 ? void 0 : _e.gradient) !== null && _f !== void 0 ? _f : false : false;
      var config = Object.assign({
        enable_inner: ((_g = this.config) === null || _g === void 0 ? void 0 : _g.inner) !== undefined
      }, this._config);
      var schema = this._schema((_j = (_h = this._config) === null || _h === void 0 ? void 0 : _h.needle) !== null && _j !== void 0 ? _j : false,
      // showGradient
      (_l = (_k = this._config) === null || _k === void 0 ? void 0 : _k.gradient) !== null && _l !== void 0 ? _l : false,
      // showGradientResolution
      ((_m = this._config) === null || _m === void 0 ? void 0 : _m.inner) !== undefined,
      // showInner
      (_o = ["static", "needle"].includes(inner_mode)) !== null && _o !== void 0 ? _o : false,
      // showInnerGradient
      inner_gradient // showInnerGradientResolution
      );
      return x(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["\n      <ha-form\n        .hass=", "\n        .data=", "\n        .schema=", "\n        .computeLabel=", "\n        @value-changed=", "\n      ></ha-form>\n    "])), this.hass, config, schema, this._computeLabel, this._valueChanged);
    }
  }, {
    key: "_valueChanged",
    value: function _valueChanged(ev) {
      var _a;
      var config = ev.detail.value;
      // Gradient
      if (config.gradient) {
        config = trySetValue(config, "gradient_resolution", "low").result;
      } else {
        deleteKey(config, "gradient_resolution");
      }
      // Inner
      if (config.enable_inner) {
        config = trySetValue(config, "inner", {
          mode: "severity"
        }, true).result;
      } else {
        deleteKey(config, "inner");
      }
      deleteKey(config, "enable_inner");
      // Inner gradient
      if ((_a = config.inner) === null || _a === void 0 ? void 0 : _a.gradient) {
        config = trySetValue(config, "inner.gradient_resolution", "low").result;
      } else {
        deleteKey(config, "inner.gradient_resolution");
      }
      fireEvent(this, "config-changed", {
        config: config
      });
    }
  }]);
}(i$2);
__decorate([n$1({
  attribute: false
})], GaugeCardProEditor.prototype, "hass", void 0);
__decorate([r()], GaugeCardProEditor.prototype, "config", void 0);
GaugeCardProEditor = __decorate([t$1(EDITOR_NAME)], GaugeCardProEditor);
var editor = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get GaugeCardProEditor() {
    return GaugeCardProEditor;
  }
});
export { GaugeCardProCard };
