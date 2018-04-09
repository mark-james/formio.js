'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditGridComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _Components = require('../Components');

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditGridComponent = exports.EditGridComponent = function (_FormioComponents) {
  _inherits(EditGridComponent, _FormioComponents);

  function EditGridComponent(component, options, data) {
    _classCallCheck(this, EditGridComponent);

    var _this = _possibleConstructorReturn(this, (EditGridComponent.__proto__ || Object.getPrototypeOf(EditGridComponent)).call(this, component, options, data));

    _this.type = 'datagrid';
    _this.editRows = [];
    return _this;
  }

  _createClass(EditGridComponent, [{
    key: 'build',
    value: function build() {
      this.createElement();
      this.createLabel(this.element);
      this.buildTable();
      this.createDescription(this.element);
      this.createAddButton();
      this.element.appendChild(this.errorContainer = this.ce('div', { class: 'has-error' }));
    }
  }, {
    key: 'buildTable',
    value: function buildTable() {
      var _this2 = this;

      if (this.tableElement) {
        this.tableElement.innerHTML = '';
      }

      var tableClass = 'editgrid-listgroup list-group ';
      (0, _each3.default)(['striped', 'bordered', 'hover', 'condensed'], function (prop) {
        if (_this2.component[prop]) {
          tableClass += 'table-' + prop + ' ';
        }
      });
      this.tableElement = this.ce('ul', { class: tableClass }, [this.headerElement = this.createHeader(), this.rowElements = (0, _map3.default)(this.rows, this.createRow.bind(this)), this.footerElement = this.createFooter()]);

      this.element.appendChild(this.tableElement);
    }
  }, {
    key: 'createHeader',
    value: function createHeader() {
      var templateHeader = (0, _get3.default)(this.component, 'templates.header');
      if (!templateHeader) {
        return this.text('');
      }
      return this.ce('li', { class: 'list-group-item list-group-header' }, this.renderTemplate(templateHeader, {
        components: this.component.components,
        util: _utils2.default,
        value: this.dataValue
      }));
    }
  }, {
    key: 'createRow',
    value: function createRow(row, rowIndex) {
      var _this3 = this;

      var wrapper = this.ce('li', { class: 'list-group-item' });

      // Store info so we can detect changes later.
      wrapper.rowData = row;
      wrapper.rowIndex = rowIndex;
      wrapper.rowOpen = this.editRows[rowIndex].isOpen;
      this.editRows[rowIndex].components = [];

      if (wrapper.rowOpen) {
        wrapper.appendChild(this.ce('div', { class: 'editgrid-edit' }, this.ce('div', { class: 'editgrid-body' }, [this.component.components.map(function (comp) {
          var component = (0, _cloneDeep3.default)(comp);
          component.row = _this3.row + '-' + rowIndex;
          var options = (0, _clone3.default)(_this3.options);
          options.name += '[' + rowIndex + ']';
          var instance = _this3.createComponent(component, options, _this3.editRows[rowIndex].data);
          _this3.editRows[rowIndex].components.push(instance);
          return instance.element;
        }), this.ce('div', { class: 'editgrid-actions' }, [this.ce('div', {
          class: 'btn btn-primary',
          onClick: this.saveRow.bind(this, rowIndex)
        }, this.component.saveRow || 'Save'), ' ', this.component.removeRow ? this.ce('div', {
          class: 'btn btn-danger',
          onClick: this.cancelRow.bind(this, rowIndex)
        }, this.component.removeRow || 'Cancel') : null])])));
      } else {
        wrapper.appendChild(this.renderTemplate(this.component.templates.row, {
          row: row,
          rowIndex: rowIndex,
          components: this.component.components,
          util: _utils2.default
        }, [{
          class: 'removeRow',
          event: 'click',
          action: this.removeRow.bind(this, rowIndex)
        }, {
          class: 'editRow',
          event: 'click',
          action: this.editRow.bind(this, rowIndex)
        }]));
      }
      wrapper.appendChild(this.editRows[rowIndex].errorContainer = this.ce('div', { class: 'has-error' }));
      this.checkData(this.data, { noValidate: true }, rowIndex);
      return wrapper;
    }
  }, {
    key: 'createFooter',
    value: function createFooter() {
      var footerTemplate = (0, _get3.default)(this.component, 'templates.footer');
      if (!footerTemplate) {
        return this.text('');
      }
      return this.ce('li', { class: 'list-group-item list-group-footer' }, this.renderTemplate(footerTemplate, {
        components: this.component.components,
        util: _utils2.default,
        value: this.dataValue
      }));
    }
  }, {
    key: 'checkData',
    value: function checkData(data) {
      var _this4 = this;

      var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var index = arguments[2];

      var valid = true;
      if (flags.noCheck) {
        return;
      }

      // Update the value.
      var changed = this.updateValue({
        noUpdateEvent: true
      });

      // Iterate through all components and check conditions, and calculate values.
      this.editRows[index].components.forEach(function (comp) {
        changed |= comp.calculateValue(data, {
          noUpdateEvent: true
        });
        comp.checkConditions(_this4.editRows[index].data);
        if (!flags.noValidate) {
          valid &= comp.checkValidity(_this4.editRows[index].data, !_this4.editRows[index].isOpen);
        }
      });

      valid &= this.validateRow(index, false);

      // Trigger the change if the values changed.
      if (changed) {
        this.triggerChange(flags);
      }

      // Return if the value is valid.
      return valid;
    }
  }, {
    key: 'createAddButton',
    value: function createAddButton() {
      this.element.appendChild(this.ce('div', { class: 'editgrid-add' }, this.ce('a', {
        class: 'btn btn-primary',
        onClick: this.addRow.bind(this)
      }, [this.ce('span', { class: 'glyphicon glyphicon-plus', 'aria-hidden': true }), ' ', this.t(this.component.addAnother ? this.component.addAnother : 'Add Another', {})])));
    }
  }, {
    key: 'refreshDOM',
    value: function refreshDOM() {
      var _this5 = this;

      var newHeader = this.createHeader();
      this.tableElement.replaceChild(newHeader, this.headerElement);
      this.headerElement = newHeader;

      var newFooter = this.createFooter();
      this.tableElement.replaceChild(newFooter, this.footerElement);
      this.footerElement = newFooter;

      this.editRows.forEach(function (editRow, rowIndex) {
        if (!editRow.element) {
          // New row
          editRow.element = _this5.createRow(editRow.data, rowIndex);
          _this5.tableElement.insertBefore(editRow.element, _this5.tableElement.children[rowIndex + 1]);
        } else if (editRow.element.rowData !== editRow.data || editRow.element.rowIndex !== rowIndex || editRow.element.rowOpen !== editRow.isOpen) {
          // Row has changed due to an edit or delete.
          _this5.removeRowComponents(rowIndex);
          var newRow = _this5.createRow(editRow.data, rowIndex);
          _this5.tableElement.replaceChild(newRow, editRow.element);
          editRow.element = newRow;
        }
      });
    }
  }, {
    key: 'addRow',
    value: function addRow() {
      if (this.options.readOnly) {
        return;
      }
      this.editRows.push({
        isOpen: true,
        data: {}
      });
      this.updateValue();
      this.refreshDOM();
    }
  }, {
    key: 'editRow',
    value: function editRow(rowIndex) {
      this.editRows[rowIndex].isOpen = true;
      this.editRows[rowIndex].data = (0, _cloneDeep3.default)(this.rows[rowIndex]);
      this.refreshDOM();
    }
  }, {
    key: 'cancelRow',
    value: function cancelRow(rowIndex) {
      if (this.options.readOnly) {
        this.editRows[rowIndex].isOpen = false;
        this.removeRowComponents(rowIndex);
        this.refreshDOM();
        return;
      }
      this.removeRowComponents(rowIndex);
      // Remove if new.
      if (!this.rows[rowIndex]) {
        this.tableElement.removeChild(this.editRows[rowIndex].element);
        this.editRows.splice(rowIndex, 1);
        this.splice(rowIndex);
      } else {
        this.editRows[rowIndex].isOpen = false;
        this.editRows[rowIndex].data = this.dataValue[rowIndex];
      }
      this.refreshDOM();
    }
  }, {
    key: 'saveRow',
    value: function saveRow(rowIndex) {
      if (this.options.readOnly) {
        this.editRows[rowIndex].isOpen = false;
        this.removeRowComponents(rowIndex);
        this.refreshDOM();
        return;
      }
      if (!this.validateRow(rowIndex, true)) {
        return;
      }
      this.removeRowComponents(rowIndex);
      this.dataValue[rowIndex] = this.editRows[rowIndex].data;
      this.editRows[rowIndex].isOpen = false;
      this.checkValidity(this.data, true);
      this.updateValue();
      this.refreshDOM();
    }
  }, {
    key: 'removeRow',
    value: function removeRow(rowIndex) {
      if (this.options.readOnly) {
        return;
      }
      this.removeRowComponents(rowIndex);
      this.rows.splice(rowIndex, 1);
      this.tableElement.removeChild(this.editRows[rowIndex].element);
      this.editRows.splice(rowIndex, 1);
      this.updateValue();
      this.refreshDOM();
    }
  }, {
    key: 'removeRowComponents',
    value: function removeRowComponents(rowIndex) {
      var _this6 = this;

      // Clean up components list.
      this.editRows[rowIndex].components.forEach(function (comp) {
        _this6.removeComponent(comp, _this6.components);
      });
      this.editRows[rowIndex].components = [];
    }
  }, {
    key: 'validateRow',
    value: function validateRow(rowIndex, dirty) {
      var _this7 = this;

      var check = true;
      this.editRows[rowIndex].components.forEach(function (comp) {
        comp.setPristine(!dirty);
        check &= comp.checkValidity(_this7.editRows[rowIndex].data, dirty);
      });

      if (this.component.validate && this.component.validate.row) {
        var custom = this.component.validate.row;
        custom = custom.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
          return this.editRows[rowIndex].data[$2];
        }.bind(this));
        var valid = void 0;
        try {
          var row = this.editRows[rowIndex].data;
          var data = this.data;
          valid = new Function('row', 'data', custom + '; return valid;')(row, data);
        } catch (e) {
          /* eslint-disable no-console, no-undef */
          console.warn('A syntax error occurred while computing custom values in ' + this.component.key, e);
          /* eslint-enable no-console */
        }
        this.editRows[rowIndex].errorContainer.innerHTML = '';
        if (valid !== true) {
          this.editRows[rowIndex].errorContainer.appendChild(this.ce('div', { class: 'editgrid-row-error help-block' }, valid));
          return false;
        }
      }

      return check;
    }
  }, {
    key: 'checkValidity',
    value: function checkValidity(data, dirty) {
      var _this8 = this;

      if (!_utils2.default.checkCondition(this.component, data, this.data)) {
        return true;
      }

      var rowsValid = true;
      var rowsClosed = true;
      this.editRows.forEach(function (editRow, rowIndex) {
        // Trigger all errors on the row.
        var rowValid = _this8.validateRow(rowIndex, false);
        // Add has-error class to row.
        if (!rowValid) {
          _this8.addClass(_this8.editRows[rowIndex].element, 'has-error');
        } else {
          _this8.removeClass(_this8.editRows[rowIndex].element, 'has-error');
        }
        rowsValid &= rowValid;

        // Any open rows causes validation to fail.
        rowsClosed &= !editRow.isOpen;
      });

      if (!rowsValid) {
        this.setCustomValidity('Please correct rows before proceeding.', dirty);
        return false;
      } else if (!rowsClosed) {
        this.setCustomValidity('Please save all rows before proceeding.', dirty);
        return false;
      }

      this.setCustomValidity();
      return true;
    }
  }, {
    key: 'setCustomValidity',
    value: function setCustomValidity(message, dirty) {
      if (this.errorElement && this.errorContainer) {
        this.errorElement.innerHTML = '';
        try {
          this.errorContainer.removeChild(this.errorElement);
        } catch (err) {}
      }
      if (message) {
        this.emit('componentError', this.error);
        this.createErrorElement();
        var errorMessage = this.ce('p', {
          class: 'help-block'
        });
        errorMessage.appendChild(this.text(message));
        this.errorElement.appendChild(errorMessage);
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this9 = this;

      flags = this.getFlags.apply(this, arguments);
      if (!value) {
        return;
      }
      if (!(0, _isArray3.default)(value)) {
        return;
      }

      this.dataValue = value;
      // Refresh editRow data when data changes.
      this.dataValue.forEach(function (row, rowIndex) {
        if (_this9.editRows[rowIndex]) {
          _this9.editRows[rowIndex].data = row;
        } else {
          _this9.editRows[rowIndex] = {
            isOpen: false,
            data: row
          };
        }
      });
      // Remove any extra edit rows.
      if (this.dataValue.length < this.editRows.length) {
        for (var rowIndex = this.editRows.length - 1; rowIndex >= this.dataValue.length; rowIndex--) {
          this.removeRowComponents(rowIndex);
          this.tableElement.removeChild(this.editRows[rowIndex].element);
          this.editRows.splice(rowIndex, 1);
        }
      }
      this.refreshDOM();
    }

    /**
     * Get the value of this component.
     *
     * @returns {*}
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.dataValue;
    }
  }, {
    key: 'defaultRowTemplate',
    get: function get() {
      return '<div class="row">\n      {% util.eachComponent(components, function(component) { %}\n        <div class="col-sm-2">\n          {{ row[component.key] }}\n        </div>\n      {% }) %}\n      <div class="col-sm-2">\n        <div class="btn-group pull-right">\n          <div class="btn btn-default editRow">Edit</div>\n          <div class="btn btn-danger removeRow">Delete</div>\n        </div>\n      </div>\n    </div>';
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      return [];
    }
  }]);

  return EditGridComponent;
}(_Components.FormioComponents);