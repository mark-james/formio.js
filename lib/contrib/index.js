'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Formio = require('../Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _Stripe = require('./stripe/stripe/Stripe');

var _Stripe2 = _interopRequireDefault(_Stripe);

var _StripeCheckout = require('./stripe/checkout/StripeCheckout');

var _StripeCheckout2 = _interopRequireDefault(_StripeCheckout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Formio2.default.contrib = {
  stripe: {
    stripe: _Stripe2.default,
    checkout: _StripeCheckout2.default
  }
};

exports.default = _Formio2.default.contrib;