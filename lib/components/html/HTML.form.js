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
      type: 'textfield',
      input: true,
      key: 'tag',
      weight: 50,
      label: 'HTML Tag',
      placeholder: 'HTML Element Tag',
      tooltip: 'The tag of this HTML element.'
    }, {
      type: 'textfield',
      input: true,
      key: 'className',
      weight: 60,
      label: 'CSS Class',
      placeholder: 'CSS Class',
      tooltip: 'The CSS class for this HTML element.'
    }, {
      type: 'datagrid',
      input: true,
      label: 'Attributes',
      key: 'attrs',
      tooltip: 'The attributes for this HTML element. Only safe attributes are allowed, such as src, href, and title.',
      weight: 70,
      components: [{
        label: 'Attribute',
        key: 'attr',
        input: true,
        type: 'textfield'
      }, {
        label: 'Value',
        key: 'value',
        input: true,
        type: 'textfield'
      }]
    }, {
      type: 'textarea',
      input: true,
      editor: 'ace',
      rows: 10,
      as: 'html',
      label: 'Content',
      tooltip: 'The content of this HTML element.',
      defaultValue: '<div class="well">Content</div>',
      key: 'content',
      weight: 80
    }]
  }]]));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }