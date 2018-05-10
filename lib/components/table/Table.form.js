'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _NestedComponent2.default.apply(undefined, extend.concat([[{
    label: 'Display',
    key: 'display',
    components: _TableEditOptions2.default
  }]]));
};

var _TableEditOptions = require('./TableEditOptions');

var _TableEditOptions2 = _interopRequireDefault(_TableEditOptions);

var _NestedComponent = require('../NestedComponent.form');

var _NestedComponent2 = _interopRequireDefault(_NestedComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }