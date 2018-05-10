'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TextField = require('../textfield/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextAreaComponent = function (_TextFieldComponent) {
  _inherits(TextAreaComponent, _TextFieldComponent);

  _createClass(TextAreaComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _TextField2.default.schema.apply(_TextField2.default, [{
        type: 'textarea',
        label: 'Text Area',
        key: 'textArea',
        rows: 3,
        wysiwyg: false,
        editor: ''
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Text Area',
        group: 'basic',
        icon: 'fa fa-font',
        documentation: 'http://help.form.io/userguide/#textarea',
        weight: 40,
        schema: TextAreaComponent.schema()
      };
    }
  }]);

  function TextAreaComponent(component, options, data) {
    _classCallCheck(this, TextAreaComponent);

    // Never submit on enter for text areas.
    var _this = _possibleConstructorReturn(this, (TextAreaComponent.__proto__ || Object.getPrototypeOf(TextAreaComponent)).call(this, component, options, data));

    _this.options.submitOnEnter = false;
    return _this;
  }

  _createClass(TextAreaComponent, [{
    key: 'acePlaceholder',
    value: function acePlaceholder() {
      if (!this.component.placeholder || !this.editor) {
        return;
      }
      var shouldShow = !this.editor.session.getValue().length;
      var node = this.editor.renderer.emptyMessageNode;
      if (!shouldShow && node) {
        this.editor.renderer.scroller.removeChild(this.editor.renderer.emptyMessageNode);
        this.editor.renderer.emptyMessageNode = null;
      } else if (shouldShow && !node) {
        node = this.editor.renderer.emptyMessageNode = this.ce('div');
        node.textContent = this.t(this.component.placeholder);
        node.className = 'ace_invisible ace_emptyMessage';
        node.style.padding = '0 9px';
        this.editor.renderer.scroller.appendChild(node);
      }
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      var _this2 = this;

      if (!this.component.wysiwyg && !this.component.editor) {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'createInput', this).call(this, container);
      }

      // Add the input.
      this.input = this.ce('div', {
        class: 'formio-wysiwyg-editor'
      });
      container.appendChild(this.input);

      if (this.component.editor === 'ace') {
        this.editorReady = _Base2.default.requireLibrary('ace', 'ace', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.0/ace.js', true).then(function () {
          var mode = _this2.component.as || 'javascript';
          _this2.editor = ace.edit(_this2.input);
          _this2.editor.on('change', function () {
            _this2.updateValue(null, _this2.getConvertedValue(_this2.editor.getValue()));
          });
          _this2.editor.getSession().setTabSize(2);
          _this2.editor.getSession().setMode('ace/mode/' + mode);
          _this2.editor.on('input', function () {
            return _this2.acePlaceholder();
          });
          setTimeout(function () {
            return _this2.acePlaceholder();
          }, 100);
          return _this2.editor;
        });
        return this.input;
      }

      // Normalize the configurations.
      if (this.component.wysiwyg && this.component.wysiwyg.toolbarGroups) {
        console.warn('The WYSIWYG settings are configured for CKEditor. For this renderer, you will need to use configurations for the Quill Editor. See https://quilljs.com/docs/configuration for more information.');
        this.component.wysiwyg = this.wysiwygDefault;
        this.emit('componentEdit', this);
      }
      if (!this.component.wysiwyg || typeof this.component.wysiwyg === 'boolean') {
        this.component.wysiwyg = this.wysiwygDefault;
        this.emit('componentEdit', this);
      }

      // Add the quill editor.
      this.editorReady = this.addQuill(this.input, this.component.wysiwyg, function () {
        _this2.updateValue(null, _this2.getConvertedValue(_this2.quill.root.innerHTML));
      }).then(function (quill) {
        quill.root.spellcheck = _this2.component.spellcheck;
        if (_this2.options.readOnly || _this2.component.disabled) {
          quill.disable();
        }

        return quill;
      });

      return this.input;
    }
  }, {
    key: 'setConvertedValue',
    value: function setConvertedValue(value) {
      if (this.component.as && this.component.as === 'json' && value) {
        try {
          value = JSON.stringify(value);
        } catch (err) {
          console.warn(err);
        }
      }
      return value;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty(value) {
      if (this.quill) {
        return !value || value === '<p><br></p>';
      } else {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'isEmpty', this).call(this, value);
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this3 = this;

      value = value || '';
      if (!this.component.wysiwyg && !this.component.editor) {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'setValue', this).call(this, this.setConvertedValue(value), flags);
      }

      // Set the value when the editor is ready.
      this.dataValue = value;
      this.editorReady.then(function (editor) {
        if (_this3.component.editor === 'ace') {
          editor.setValue(_this3.setConvertedValue(value));
        } else {
          editor.setContents(editor.clipboard.convert(_this3.setConvertedValue(value)));
          _this3.updateValue(flags);
        }
      });
    }
  }, {
    key: 'getConvertedValue',
    value: function getConvertedValue(value) {
      if (this.component.as && this.component.as === 'json' && value) {
        try {
          value = JSON.parse(value);
        } catch (err) {
          console.warn(err);
        }
      }
      return value;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.viewOnly) {
        return this.dataValue;
      }

      if (!this.component.wysiwyg && !this.component.editor) {
        return this.getConvertedValue(_get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'getValue', this).call(this));
      }

      if (this.editor || this.quill) {
        return this.dataValue;
      }

      return this.component.multiple ? [''] : '';
    }
  }, {
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'textarea';
      if (this.component.rows) {
        info.attr.rows = this.component.rows;
      }
      return info;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return TextAreaComponent.schema();
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      var defaultValue = _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'defaultValue', this);
      if (this.component.wysiwyg && !defaultValue) {
        defaultValue = '<p><br></p>';
      }
      return defaultValue;
    }
  }]);

  return TextAreaComponent;
}(_TextField2.default);

exports.default = TextAreaComponent;