'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _round2 = require('lodash/round');

var _round3 = _interopRequireDefault(_round2);

var _pad2 = require('lodash/pad');

var _pad3 = _interopRequireDefault(_pad2);

var _chunk2 = require('lodash/chunk');

var _chunk3 = _interopRequireDefault(_chunk2);

var _isNaN2 = require('lodash/isNaN');

var _isNaN3 = _interopRequireDefault(_isNaN2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

var _isBoolean2 = require('lodash/isBoolean');

var _isBoolean3 = _interopRequireDefault(_isBoolean2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _isDate2 = require('lodash/isDate');

var _isDate3 = _interopRequireDefault(_isDate2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _forOwn2 = require('lodash/forOwn');

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _template = require('lodash/template');

var _template2 = _interopRequireDefault(_template);

var _jsonLogicJs = require('json-logic-js');

var _jsonLogicJs2 = _interopRequireDefault(_jsonLogicJs);

var _operators = require('./jsonlogic/operators');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure JsonLogic
_operators.lodashOperators.forEach(function (name) {
  return _jsonLogicJs2.default.add_operation('_' + name, _lodash2.default[name]);
});

var FormioUtils = {
  jsonLogic: _jsonLogicJs2.default, // Share

  /**
   * Determines the boolean value of a setting.
   *
   * @param value
   * @return {boolean}
   */
  boolValue: function boolValue(value) {
    if ((0, _isBoolean3.default)(value)) {
      return value;
    } else if ((0, _isString3.default)(value)) {
      return value.toLowerCase() === 'true';
    } else {
      return !!value;
    }
  },


  /**
   * Check to see if an ID is a mongoID.
   * @param text
   * @return {Array|{index: number, input: string}|Boolean|*}
   */
  isMongoId: function isMongoId(text) {
    return text.toString().match(/^[0-9a-fA-F]{24}$/);
  },


  /**
   * Determine if a component is a layout component or not.
   *
   * @param {Object} component
   *   The component to check.
   *
   * @returns {Boolean}
   *   Whether or not the component is a layout component.
   */
  isLayoutComponent: function isLayoutComponent(component) {
    return Boolean(component.columns && Array.isArray(component.columns) || component.rows && Array.isArray(component.rows) || component.components && Array.isArray(component.components));
  },


  /**
   * Iterate through each component within a form.
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Function} fn
   *   The iteration function to invoke for each component.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   * @param {String} path
   *   The current data path of the element. Example: data.user.firstName
   * @param {Object} parent
   *   The parent object.
   */
  eachComponent: function eachComponent(components, fn, includeAll, path, parent) {
    if (!components) return;
    path = path || '';
    components.forEach(function (component) {
      var hasColumns = component.columns && Array.isArray(component.columns);
      var hasRows = component.rows && Array.isArray(component.rows);
      var hasComps = component.components && Array.isArray(component.components);
      var noRecurse = false;
      var newPath = component.key ? path ? path + '.' + component.key : component.key : '';

      // Keep track of parent references.
      if (parent) {
        // Ensure we don't create infinite JSON structures.
        component.parent = (0, _clone3.default)(parent);
        delete component.parent.components;
        delete component.parent.componentMap;
        delete component.parent.columns;
        delete component.parent.rows;
      }

      if (includeAll || component.tree || !hasColumns && !hasRows && !hasComps) {
        noRecurse = fn(component, newPath);
      }

      var subPath = function subPath() {
        if (component.key && (component.type === 'datagrid' || component.type === 'container' || component.type === 'editgrid' || component.tree)) {
          return newPath;
        } else if (component.key && component.type === 'form') {
          return newPath + '.data';
        }
        return path;
      };

      if (!noRecurse) {
        if (hasColumns) {
          component.columns.forEach(function (column) {
            return FormioUtils.eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
          });
        } else if (hasRows) {
          component.rows.forEach(function (row) {
            return row.forEach(function (column) {
              return FormioUtils.eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
            });
          });
        } else if (hasComps) {
          FormioUtils.eachComponent(component.components, fn, includeAll, subPath(), parent ? component : null);
        }
      }
    });
  },


  /**
   * Matches if a component matches the query.
   *
   * @param component
   * @param query
   * @return {boolean}
   */
  matchComponent: function matchComponent(component, query) {
    if ((0, _isString3.default)(query)) {
      return component.key === query;
    } else {
      var matches = false;
      (0, _forOwn3.default)(query, function (value, key) {
        matches = (0, _get3.default)(component, key) === value;
        if (!matches) {
          return false;
        }
      });
      return matches;
    }
  },


  /**
   * Get a component by its key
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {String|Object} key
   *   The key of the component to get, or a query of the component to search.
   *
   * @returns {Object}
   *   The component that matches the given key, or undefined if not found.
   */
  getComponent: function getComponent(components, key) {
    var result = void 0;
    FormioUtils.eachComponent(components, function (component, path) {
      if (FormioUtils.matchComponent(component, key)) {
        component.path = path;
        result = component;
        return true;
      }
    });
    return result;
  },


  /**
   * Finds a component provided a query of properties of that component.
   *
   * @param components
   * @param query
   * @return {*}
   */
  findComponents: function findComponents(components, query) {
    var results = [];
    FormioUtils.eachComponent(components, function (component, path) {
      if (FormioUtils.matchComponent(component, query)) {
        component.path = path;
        results.push(component);
      }
    }, true);
    return results;
  },


  /**
   * Flatten the form components for data manipulation.
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   *
   * @returns {Object}
   *   The flattened components map.
   */
  flattenComponents: function flattenComponents(components, includeAll) {
    var flattened = {};
    FormioUtils.eachComponent(components, function (component, path) {
      flattened[path] = component;
    }, includeAll);
    return flattened;
  },


  /**
   * Returns if this component has a conditional statement.
   *
   * @param component - The component JSON schema.
   *
   * @returns {boolean} - TRUE - This component has a conditional, FALSE - No conditional provided.
   */
  hasCondition: function hasCondition(component) {
    return Boolean(component.customConditional || component.conditional && component.conditional.when || component.conditional && component.conditional.json);
  },


  /**
   * Extension of standard #parseFloat(value) function, that also clears input string.
   *
   * @param {any} value
   *   The value to parse.
   *
   * @returns {Number}
   *   Parsed value.
   */
  parseFloat: function (_parseFloat) {
    function parseFloat(_x) {
      return _parseFloat.apply(this, arguments);
    }

    parseFloat.toString = function () {
      return _parseFloat.toString();
    };

    return parseFloat;
  }(function (value) {
    return parseFloat((0, _isString3.default)(value) ? value.replace(/[^\de.+-]/gi, '') : value);
  }),


  /**
   * Formats provided value in way how Currency component uses it.
   *
   * @param {any} value
   *   The value to format.
   *
   * @returns {String}
   *   Value formatted for Currency component.
   */
  formatAsCurrency: function formatAsCurrency(value) {
    var parsedValue = this.parseFloat(value);

    if ((0, _isNaN3.default)(parsedValue)) {
      return '';
    }

    var parts = (0, _round3.default)(parsedValue, 2).toString().split('.');
    parts[0] = (0, _chunk3.default)(Array.from(parts[0]).reverse(), 3).reverse().map(function (part) {
      return part.reverse().join('');
    }).join(',');
    parts[1] = (0, _pad3.default)(parts[1], 2, '0');
    return parts.join('.');
  },


  /**
   * Escapes RegEx characters in provided String value.
   *
   * @param {String} value
   *   String for escaping RegEx characters.
   * @returns {string}
   *   String with escaped RegEx characters.
   */
  escapeRegExCharacters: function escapeRegExCharacters(value) {
    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },


  /**
   * Checks the calculated value for a provided component and data.
   *
   * @param {Object} component
   *   The component to check for the calculated value.
   * @param {Object} submission
   *   A submission object.
   * @param data
   *   The full submission data.
   */
  checkCalculated: function checkCalculated(component, submission, data) {
    // Process calculated value stuff if present.
    if (component.calculateValue) {
      if ((0, _isString3.default)(component.calculateValue)) {
        try {
          var util = this;
          data[component.key] = eval('(function(data, util) { var value = [];' + component.calculateValue.toString() + '; return value; })(data, util)');
        } catch (e) {
          console.warn('An error occurred calculating a value for ' + component.key, e);
        }
      } else {
        try {
          data[component.key] = this.jsonLogic.apply(component.calculateValue, {
            data: submission ? submission.data : data,
            row: data,
            _: _lodash2.default
          });
        } catch (e) {
          console.warn('An error occurred calculating a value for ' + component.key, e);
        }
      }
    }
  },


  /**
   * Checks the conditions for a provided component and data.
   *
   * @param component
   *   The component to check for the condition.
   * @param row
   *   The data within a row
   * @param data
   *   The full submission data.
   *
   * @returns {boolean}
   */
  checkCondition: function checkCondition(component, row, data) {
    if (component.customConditional) {
      try {
        var script = '(function() { var show = true;' + component.customConditional.toString() + '; return show; })()';
        var result = eval(script);
        return result.toString() === 'true';
      } catch (e) {
        console.warn('An error occurred in a custom conditional statement for component ' + component.key, e);
        return true;
      }
    } else if (component.conditional && component.conditional.when) {
      var cond = component.conditional;
      var value = null;
      if (row) {
        value = this.getValue({ data: row }, cond.when);
      }
      if (data && (0, _isNil3.default)(value)) {
        value = this.getValue({ data: data }, cond.when);
      }
      // FOR-400 - Fix issue where falsey values were being evaluated as show=true
      if ((0, _isNil3.default)(value)) {
        return false;
      }
      // Special check for selectboxes component.
      if ((0, _isObject3.default)(value) && (0, _has3.default)(value, cond.eq)) {
        return value[cond.eq].toString() === cond.show.toString();
      }
      // FOR-179 - Check for multiple values.
      if ((0, _isArray3.default)(value) && value.indexOf(cond.eq) !== -1) {
        return cond.show.toString() === 'true';
      }

      return value.toString() === cond.eq.toString() === (cond.show.toString() === 'true');
    } else if (component.conditional && component.conditional.json) {
      return _jsonLogicJs2.default.apply(component.conditional.json, {
        data: data,
        row: row,
        _: _lodash2.default
      });
    }

    // Default to show.
    return true;
  },


  /**
   * Get the value for a component key, in the given submission.
   *
   * @param {Object} submission
   *   A submission object to search.
   * @param {String} key
   *   A for components API key to search for.
   */
  getValue: function getValue(submission, key) {
    var search = function search(data) {
      if ((0, _isPlainObject3.default)(data)) {
        if ((0, _has3.default)(data, key)) {
          return data[key];
        }

        var value = null;

        (0, _forOwn3.default)(data, function (prop) {
          var result = search(prop);
          if (!(0, _isNil3.default)(result)) {
            value = result;
            return false;
          }
        });

        return value;
      } else {
        return null;
      }
    };

    return search(submission.data);
  },


  /**
   * Interpolate a string and add data replacements.
   *
   * @param string
   * @param data
   * @returns {XML|string|*|void}
   */
  interpolate: function interpolate(string, data) {
    var templateSettings = {
      evaluate: /\{\%(.+?)\%\}/g,
      interpolate: /\{\{(.+?)\}\}/g,
      escape: /\{\{\{(.+?)\}\}\}/g
    };
    try {
      return (0, _template2.default)(string, templateSettings)(data);
    } catch (err) {
      console.warn('Error interpolating template', err, string, data);
    }
  },


  /**
   * Make a filename guaranteed to be unique.
   * @param name
   * @returns {string}
   */
  uniqueName: function uniqueName(name) {
    var parts = name.toLowerCase().replace(/[^0-9a-z\.]/g, '').split('.');
    var fileName = parts[0];
    var ext = parts.length > 1 ? '.' + (0, _last3.default)(parts) : '';
    return fileName.substr(0, 10) + '-' + this.guid() + ext;
  },
  guid: function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },


  /**
   * Return a translated date setting.
   *
   * @param date
   * @return {*}
   */
  getDateSetting: function getDateSetting(date) {
    if ((0, _isNil3.default)(date) || (0, _isNaN3.default)(date) || date === '') {
      return null;
    }

    var dateSetting = new Date(date);
    if (FormioUtils.isValidDate(dateSetting)) {
      return dateSetting;
    }

    try {
      // Moment constant might be used in eval.
      var moment = _moment2.default;
      dateSetting = new Date(eval(date));
    } catch (e) {
      return null;
    }

    // Ensure this is a date.
    if (!FormioUtils.isValidDate(dateSetting)) {
      dateSetting = null;
    }

    return dateSetting;
  },
  isValidDate: function isValidDate(date) {
    return (0, _isDate3.default)(date) && !(0, _isNaN3.default)(date.getDate());
  }
};

module.exports = global.FormioUtils = FormioUtils;