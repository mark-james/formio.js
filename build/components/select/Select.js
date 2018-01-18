'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = require('../base/Base');

var _choices = require('choices.js');

var _choices2 = _interopRequireDefault(_choices);

var _formio = require('../../formio');

var _formio2 = _interopRequireDefault(_formio);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _get3 = require('lodash/get');

var _get4 = _interopRequireDefault(_get3);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Fix performance issues in Choices by adding a debounce around render method.
_choices2.default.prototype._render = _choices2.default.prototype.render;
_choices2.default.prototype.render = function () {
  var _this = this;

  if (this.renderDebounce) {
    clearTimeout(this.renderDebounce);
  }

  this.renderDebounce = setTimeout(function () {
    return _this._render();
  }, 100);
};

var SelectComponent = exports.SelectComponent = function (_BaseComponent) {
  _inherits(SelectComponent, _BaseComponent);

  function SelectComponent(component, options, data) {
    _classCallCheck(this, SelectComponent);

    // Trigger an update.
    var _this2 = _possibleConstructorReturn(this, (SelectComponent.__proto__ || Object.getPrototypeOf(SelectComponent)).call(this, component, options, data));

    _this2.triggerUpdate = (0, _debounce3.default)(_this2.updateItems.bind(_this2), 100);

    // Keep track of the select options.
    _this2.selectOptions = [];

    // If they wish to refresh on a value, then add that here.
    if (_this2.component.refreshOn) {
      _this2.on('change', function (event) {
        if (_this2.component.refreshOn === 'data') {
          _this2.refreshItems();
        } else if (event.changed && event.changed.component.key === _this2.component.refreshOn) {
          _this2.refreshItems();
        }
      });
    }
    return _this2;
  }

  _createClass(SelectComponent, [{
    key: 'refreshItems',
    value: function refreshItems() {
      this.triggerUpdate();
      if (this.component.clearOnRefresh) {
        this.setValue(null);
      }
    }
  }, {
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get2(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'select';
      info.changeEvent = 'change';
      return info;
    }
  }, {
    key: 'createWrapper',
    value: function createWrapper() {
      return false;
    }
  }, {
    key: 'itemTemplate',
    value: function itemTemplate(data) {
      var template = this.component.template ? this.interpolate(this.component.template, { item: data }) : data.label;
      var label = template.replace(/<\/?[^>]+(>|$)/g, "");
      return template.replace(label, this.t(label));
    }
  }, {
    key: 'itemValue',
    value: function itemValue(data) {
      return this.component.valueProperty ? (0, _get4.default)(data, this.component.valueProperty) : data;
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      this.selectContainer = container;
      this.selectInput = _get2(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'createInput', this).call(this, container);
    }

    /**
     * Adds an option to the select dropdown.
     *
     * @param value
     * @param label
     */

  }, {
    key: 'addOption',
    value: function addOption(value, label, attr) {
      var option = {
        value: value,
        label: label
      };

      this.selectOptions.push(option);
      if (this.choices) {
        return;
      }

      option.element = document.createElement('option');
      if (this.value === option.value) {
        option.element.setAttribute('selected', 'selected');
        option.element.selected = 'selected';
      }
      option.element.innerHTML = label;
      if (attr) {
        (0, _each3.default)(attr, function (value, key) {
          option.element.setAttribute(key, value);
        });
      }
      this.selectInput.appendChild(option.element);
    }
  }, {
    key: 'setItems',
    value: function setItems(items) {
      var _this3 = this;

      // If the items is a string, then parse as JSON.
      if (typeof items == 'string') {
        try {
          items = JSON.parse(items);
        } catch (err) {
          console.warn(err.message);
          items = [];
        }
      }

      if (!this.choices && this.selectInput) {
        // Detach from DOM and clear input.
        this.selectContainer.removeChild(this.selectInput);
        this.selectInput.innerHTML = '';
      }

      this.selectOptions = [];

      // If they provided select values, then we need to get them instead.
      if (this.component.selectValues) {
        items = (0, _get4.default)(items, this.component.selectValues);
      }

      if (this.choices) {
        // Add the currently selected choices if they don't already exist.
        var currentChoices = (0, _isArray3.default)(this.value) ? this.value : [this.value];
        (0, _each3.default)(currentChoices, function (choice) {
          _this3.addCurrentChoices(choice, items);
        });
      } else if (!this.component.multiple) {
        this.addPlaceholder(this.selectInput);
      }

      // Iterate through each of the items.
      (0, _each3.default)(items, function (item, index) {
        _this3.addOption(_this3.itemValue(item), _this3.itemTemplate(item));
      });

      if (this.choices) {
        this.choices.setChoices(this.selectOptions, 'value', 'label', true);
      } else {
        // Re-attach select input.
        this.selectContainer.appendChild(this.selectInput);
      }

      // If a value is provided, then select it.
      if (this.value) {
        this.setValue(this.value, true);
      } else {
        // If a default value is provided then select it.
        var defaultValue = this.defaultValue;
        if (defaultValue) {
          this.setValue(defaultValue);
        }
      }
    }
  }, {
    key: 'loadItems',
    value: function loadItems(url, search, headers, options, method, body) {
      var _this4 = this;

      options = options || {};

      // Ensure we have a method and remove any body if method is get
      method = method || 'GET';
      if (method.toUpperCase() === 'GET') {
        body = null;
      }

      var query = this.component.dataSrc === 'url' ? {} : {
        limit: 100,
        skip: 0
      };

      // Allow for url interpolation.
      url = this.interpolate(url, {
        data: this.data,
        formioBase: _formio2.default.getBaseUrl(),
        formioOptions: _formio2.default.getOptions(),
        rootData: this.root.data
      });

      console.log('Data From Options: ' + JSON.stringify(_formio2.default.getOptions()));
      // Allow for post body interpolation
      body = JSON.parse(this.interpolate(JSON.stringify(body), {
        data: this.data, formioOptions: _formio2.default.getOptions(), rootData: this.root.data
      }));

      // Add search capability.
      if (this.component.searchField && search) {
        query[this.component.searchField] = search;
      }

      // Add filter capability
      if (this.component.filter) {
        var filter = this.interpolate(this.component.filter, { data: this.data, formioOptions: _formio2.default.getOptions() });
        url += (!(url.indexOf('?') !== -1) ? '?' : '&') + filter;
      }

      // If they wish to return only some fields.
      if (this.component.selectFields) {
        query.select = this.component.selectFields;
      }

      if (!(0, _isEmpty3.default)(query)) {
        // Add the query string.
        url += '?' + _formio2.default.serialize(query);
      }

      // Make the request 
      options.header = headers;
      _formio2.default.makeRequest(this.options.formio, 'select', url, method, body, options).then(function (response) {
        return _this4.setItems(response);
      }).catch(function (err) {
        _this4.events.emit('formio.error', err);
        console.warn('Unable to load resources for ' + _this4.component.key);
      });
    }

    /**
     * Get the request headers for this select dropdown.
     */

  }, {
    key: 'updateCustomItems',
    value: function updateCustomItems() {
      var data = (0, _cloneDeep3.default)(this.data);
      var row = (0, _cloneDeep3.default)(this.row);
      try {
        this.setItems(eval('(function(data, row) { var values = [];' + this.component.data.custom.toString() + '; return values; })(data, row)'));
      } catch (error) {
        this.setItems([]);
      }
    }
  }, {
    key: 'updateItems',
    value: function updateItems(searchInput) {
      if (!this.component.data) {
        console.warn('Select component ' + this.component.key + ' does not have data configuration.');
        return;
      }

      switch (this.component.dataSrc) {
        case 'values':
          this.component.valueProperty = 'value';
          this.setItems(this.component.data.values);
          break;
        case 'json':
          this.setItems(this.component.data.json);
          break;
        case 'custom':
          this.updateCustomItems();
          break;
        case 'resource':
          var resourceUrl = this.options.formio ? this.options.formio.formsUrl : _formio2.default.getProjectUrl() + '/form';
          resourceUrl += '/' + this.component.data.resource + '/submission';

          try {
            this.loadItems(resourceUrl, searchInput, this.requestHeaders);
          } catch (err) {
            console.warn('Unable to load resources for ' + this.component.key);
          }
          break;
        case 'url':
          var url = this.component.data.url;
          var method = void 0;
          var body = void 0;

          if (url.substr(0, 1) === '/') {
            url = _formio2.default.getBaseUrl() + this.component.data.url;
          }

          if (!this.component.data.method) {
            method = 'GET';
          } else {
            method = this.component.data.method;
            if (method.toUpperCase() === 'POST') {
              body = this.component.data.body;
            } else {
              body = null;
            }
          }
          if (!this._disabled) {
            this.loadItems(url, searchInput, this.requestHeaders, { noToken: true }, method, body);
          }
          break;
      }
    }
  }, {
    key: 'addPlaceholder',
    value: function addPlaceholder(input) {
      if (!this.component.placeholder) {
        return;
      }
      var placeholder = document.createElement('option');
      placeholder.setAttribute('placeholder', true);
      placeholder.appendChild(this.text(this.component.placeholder));
      input.appendChild(placeholder);
    }
  }, {
    key: 'addInput',
    value: function addInput(input, container) {
      var _this5 = this;

      _get2(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'addInput', this).call(this, input, container);
      if (this.component.multiple) {
        input.setAttribute('multiple', true);
      }

      if (this.component.widget === 'html5') {
        this.triggerUpdate();
        return;
      }

      var placeholderValue = this.t(this.component.placeholder);
      var choicesOptions = {
        removeItemButton: true,
        itemSelectText: '',
        classNames: {
          containerOuter: 'choices form-group formio-choices',
          containerInner: 'form-control'
        },
        placeholder: !!this.component.placeholder,
        placeholderValue: placeholderValue,
        searchPlaceholderValue: placeholderValue,
        shouldSort: false,
        position: this.component.dropdown || 'auto'
      };

      var tabIndex = input.tabIndex;
      this.addPlaceholder(input);
      this.choices = new _choices2.default(input, choicesOptions);
      this.choices.itemList.tabIndex = tabIndex;
      this.setInputStyles(this.choices.containerOuter);

      // If a search field is provided, then add an event listener to update items on search.
      if (this.component.searchField) {
        input.addEventListener('search', function (event) {
          return _this5.triggerUpdate(event.detail.value);
        });
      }

      input.addEventListener('showDropdown', function () {
        if (_this5.component.dataSrc === 'custom') {
          _this5.updateCustomItems();
        }
      });

      // Force the disabled state with getters and setters.
      this.disabled = this.disabled;
      this.triggerUpdate();
    }
  }, {
    key: 'addCurrentChoices',
    value: function addCurrentChoices(value, items) {
      if (value && items.length) {
        var found = false;

        // Iterate through all elements and remove the ones that are found.
        (0, _remove3.default)(items, function (choice) {
          // For resources we may have two different instances of the same resource
          // Unify them so we don't have two copies of the same thing in the dropdown
          // and so the correct resource gets selected in the first place
          if (choice._id && value._id && choice._id === value._id) {
            return true;
          }
          found = (0, _isEqual3.default)(choice, value);
          return found;
        });

        // If it is not found, then add it.
        if (!found) {
          this.addOption(this.itemValue(value), this.itemTemplate(value));
        }
      }
    }
  }, {
    key: 'getValue',
    value: function getValue(flags) {
      flags = flags || {};
      if (!flags.changed && this.value) {
        return this.value;
      }
      if (this.choices) {
        this.value = this.choices.getValue(true);

        // Make sure we don't get the placeholder
        if (!this.component.multiple && this.component.placeholder && this.value === this.t(this.component.placeholder)) {
          this.value = '';
        }
      } else {
        var values = [];
        (0, _each3.default)(this.selectOptions, function (selectOption) {
          if (selectOption.element.selected) {
            values.push(selectOption.value);
          }
        });
        this.value = this.component.multiple ? values : values.shift();
      }
      return this.value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      flags = this.getFlags.apply(this, arguments);
      var hasPreviousValue = (0, _isArray3.default)(this.value) ? this.value.length : this.value;
      var hasValue = (0, _isArray3.default)(value) ? value.length : value;
      this.value = value;
      if (this.choices) {
        // Now set the value.
        if (hasValue) {
          this.choices.setValueByChoice((0, _isArray3.default)(value) ? value : [value]);
        } else if (hasPreviousValue) {
          this.choices.removeActiveItems();
        }
      } else {
        if (hasValue) {
          var values = (0, _isArray3.default)(value) ? value : [value];
          (0, _each3.default)(this.selectOptions, function (selectOption) {
            if (values.indexOf(selectOption.value) !== -1) {
              selectOption.element.selected = true;
              selectOption.element.setAttribute('selected', 'selected');
            }
          });
        } else {
          (0, _each3.default)(this.selectOptions, function (selectOption) {
            selectOption.element.selected = false;
            selectOption.element.removeAttribute('selected');
          });
        }
      }
      this.updateValue(flags);
    }

    /**
     * Check if a component is eligible for multiple validation
     *
     * @return {boolean}
     */

  }, {
    key: 'validateMultiple',
    value: function validateMultiple(value) {
      // Select component will contain one input when flagged as multiple.
      return false;
    }

    /**
     * Ouput this select dropdown as a string value.
     * @return {*}
     */

  }, {
    key: 'asString',
    value: function asString(value) {
      value = value || this.getValue();
      value = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' ? { label: value } : value;
      return this.itemTemplate(value);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.choices) {
        this.choices.destroy();
      }
    }
  }, {
    key: 'requestHeaders',
    get: function get() {
      var _this6 = this;

      // Create the headers object.
      var headers = new Headers();

      // Add custom headers to the url.
      if (this.component.data && this.component.data.headers) {
        try {
          (0, _each3.default)(this.component.data.headers, function (header) {
            if (header.key) {
              headers.set(header.key, _this6.interpolate(header.value, {
                data: _this6.data,
                formioOptions: _formio2.default.getOptions()
              }));
            }
          });
        } catch (err) {
          console.warn(err.message);
        }
      }

      return headers;
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      _set(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'disabled', disabled, this);
      if (!this.choices) {
        return;
      }
      if (disabled) {
        this.choices.disable();
      } else {
        this.choices.enable();
      }
    }
  }]);

  return SelectComponent;
}(_Base.BaseComponent);