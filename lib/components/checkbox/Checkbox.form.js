'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _Base2.default.apply(undefined, extend.concat([[{
    label: 'Display',
    key: 'display',
    weight: 0,
    components: [{
      type: 'select',
      input: true,
      label: 'Label Position',
      key: 'labelPosition',
      tooltip: 'Position for the label for this field.',
      defaultValue: 'right',
      dataSrc: 'values',
      weight: 20,
      data: {
        values: [{ label: 'Top', value: 'top' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }, { label: 'Bottom', value: 'bottom' }]
      }
    }, {
      type: 'select',
      input: true,
      weight: 350,
      label: 'Shortcut',
      key: 'shortcut',
      tooltip: 'Shortcut for this component.',
      dataSrc: 'custom',
      data: {
        custom: function custom(values, component, data, row, utils, instance, form) {
          return _builder2.default.getAvailableShortcuts(form, component);
        }
      }
    }, {
      type: 'select',
      input: true,
      key: 'inputType',
      label: 'Input Type',
      tooltip: 'This is the input type used for this checkbox.',
      dataSrc: 'values',
      weight: 410,
      data: {
        values: [{ label: 'Checkbox', value: 'checkbox' }, { label: 'Radio', value: 'radio' }]
      }
    }, {
      type: 'textfield',
      input: true,
      key: 'name',
      label: 'Radio Key',
      tooltip: 'The key used to trigger the radio button toggle.',
      weight: 420,
      conditional: {
        json: { '===': [{ var: 'data.inputType' }, 'radio'] }
      }
    }, {
      type: 'textfield',
      input: true,
      label: 'Radio Value',
      key: 'value',
      tooltip: 'The value used with this radio button.',
      weight: 430,
      conditional: {
        json: { '===': [{ var: 'data.inputType' }, 'radio'] }
      }
    }, {
      type: 'checkbox',
      input: true,
      weight: 440,
      label: 'Datagrid Label',
      key: 'datagridLabel',
      tooltip: 'Show the label when in a datagrid.'
    }]
  }]]));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _builder = require('../../utils/builder');

var _builder2 = _interopRequireDefault(_builder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }