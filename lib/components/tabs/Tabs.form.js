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
    weight: 0,
    components: [{
      key: 'components',
      type: 'datagrid',
      input: true,
      label: 'Tabs',
      weight: 50,
      components: [{
        type: 'textfield',
        input: true,
        key: 'label',
        label: 'Label'
      }, {
        type: 'textfield',
        input: true,
        key: 'key',
        label: 'Key',
        calculateValue: { _camelCase: [{ var: 'row.label' }] }
      }]
    }]
  }]]));
};

var _NestedComponent = require('../NestedComponent.form');

var _NestedComponent2 = _interopRequireDefault(_NestedComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }