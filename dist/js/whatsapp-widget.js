/*!
  * WhatsApp Widget v1.2.0 (c) 2020 - Fajar Setya Budi
  * Contributors (https://github.com/agraris/whatsapp-widget/graphs/contributors)
  * Licensed under MIT (https://github.com/agraris/whatsapp-widget/blob/master/LICENSE)
  * WhatsApp Widget does not affiliate with WhatsApp Inc. in any way.
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WhatsAppWidget = factory());
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var CLASS_NAME_WIDGET_TOGGLE = 'wa-widget-toggle';
  var CLASS_NAME_WIDGET_CONTENT = 'wa-widget-content';
  var CLASS_NAME_WIDGET_EXPANDED = 'expanded';
  var CLASS_NAME_WIDGET_FORM_REQUIRED = 'required';
  var SELECTOR_VALUE_TOGGLE_CHAT = 'wa-chat';
  var SELECTOR_VALUE_TOGGLE_SEND = 'wa-send';
  var SELECTOR_CHAT_WIDGET = '[data-chat]';
  var SELECTOR_DATA_TOGGLE_CHAT = "[data-toggle=\"".concat(SELECTOR_VALUE_TOGGLE_CHAT, "\"]");
  var SELECTOR_DATA_TOGGLE_SEND = "[data-toggle=\"".concat(SELECTOR_VALUE_TOGGLE_SEND, "\"]");
  var SELECTOR_DATA_MESSAGE = "[data-message]";
  var DefaultConfig = {
    name: '',
    division: '',
    photo: '',
    introduction: ''
  };
  var DefaultConfigType = {
    name: 'string',
    division: 'string',
    photo: 'string',
    introduction: 'string'
  };
  var DefaultForm = [{
    data: 'name',
    type: 'text',
    required: true
  }, {
    data: 'message',
    type: 'text',
    required: true
  }];
  var DefaultFormType = {
    data: 'string',
    type: 'string',
    required: 'boolean'
  };
  var ChatData = {};
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Chat = /*#__PURE__*/function () {
    function Chat(element, config, input) {
      _classCallCheck(this, Chat);

      if (ChatData[element.id]) return;
      this._element = element;
      this._config = this._getConfig(config);
      this._inputs = this._getInput(input);
      this._phoneNumber = this._element.getAttribute('action');
      this._isShown = false;
      this._toggleChat = '';
      this._contentElement = '';
      this._toggleSend = '';

      this._buildHTML();

      this._setEventListener();

      ChatData[element.id] = this;
    } // PUBLIC


    _createClass(Chat, [{
      key: "toggle",
      value: function toggle() {
        var _this = this;

        Object.keys(ChatData).forEach(function (key) {
          if (key !== _this._element.id && ChatData[key]._isShown) ChatData[key].toggle();
        });
        this._isShown ? this._hide() : this._show();
      } // PRIVATE

    }, {
      key: "_sendMessage",
      value: function _sendMessage() {
        if (!/^\d+$/.test(this._phoneNumber)) {
          throw new Error('Phone number (' + this._phoneNumber + ') is invalid.');
        }

        var send_url = 'https://wa.me/';

        var inputs = this._element.querySelectorAll(SELECTOR_DATA_MESSAGE);

        var parameters = send_url + this._phoneNumber + '?text=';
        var valid = true;

        for (var i = 0; i < inputs.length; i++) {
          var item = inputs[i];
          if (!this._formValidation(item)) valid = false;
          var title = item.getAttribute('data-message');
          parameters += title.replace(/^./, title[0].toUpperCase()) + ': ' + item.value + '%0A';
        }

        if (valid) window.open(parameters, '_blank');
      }
    }, {
      key: "_buildHTML",
      value: function _buildHTML() {
        if (this._element.innerHTML) return false;

        this._verifyInput(this._inputs);

        var TOGGLE = document.createElement('a');
        var ids = '#' + this._element.id;
        TOGGLE.href = ids;
        TOGGLE.classList.add(CLASS_NAME_WIDGET_TOGGLE);
        TOGGLE.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_CHAT);
        TOGGLE.setAttribute('data-target', ids);
        TOGGLE.innerHTML = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"0 0 800 800\" width=\"800\" height=\"800\"><defs><clipPath id=\"_clipPath_A3g8G5hPEGG2L0B6hFCxamU4cc8rfqzQ\"><rect width=\"800\" height=\"800\"/></clipPath></defs><g clip-path=\"url(#_clipPath_A3g8G5hPEGG2L0B6hFCxamU4cc8rfqzQ)\"><g><path d=\" M 787.59 800 L 12.41 800 C 5.556 800 0 793.332 0 785.108 L 0 14.892 C 0 6.667 5.556 0 12.41 0 L 787.59 0 C 794.444 0 800 6.667 800 14.892 L 800 785.108 C 800 793.332 794.444 800 787.59 800 Z \" fill=\"rgb(37,211,102)\"/></g><g><path d=\" M 508.558 450.429 C 502.67 447.483 473.723 433.24 468.325 431.273 C 462.929 429.308 459.003 428.328 455.078 434.22 C 451.153 440.114 439.869 453.377 436.434 457.307 C 433 461.236 429.565 461.729 423.677 458.78 C 417.79 455.834 398.818 449.617 376.328 429.556 C 358.825 413.943 347.008 394.663 343.574 388.768 C 340.139 382.873 343.207 379.687 346.155 376.752 C 348.804 374.113 352.044 369.874 354.987 366.436 C 357.931 362.999 358.912 360.541 360.875 356.614 C 362.837 352.683 361.857 349.246 360.383 346.299 C 358.912 343.352 347.136 314.369 342.231 302.579 C 337.451 291.099 332.597 292.654 328.983 292.472 C 325.552 292.301 321.622 292.265 317.698 292.265 C 313.773 292.265 307.394 293.739 301.996 299.632 C 296.6 305.527 281.389 319.772 281.389 348.752 C 281.389 377.735 302.487 405.731 305.431 409.661 C 308.376 413.592 346.949 473.062 406.015 498.566 C 420.062 504.634 431.03 508.256 439.581 510.969 C 453.685 515.451 466.521 514.818 476.666 513.302 C 487.978 511.613 511.502 499.06 516.409 485.307 C 521.315 471.55 521.315 459.762 519.842 457.307 C 518.371 454.851 514.446 453.377 508.558 450.429 Z  M 401.126 597.117 L 401.047 597.117 C 365.902 597.104 331.431 587.661 301.36 569.817 L 294.208 565.572 L 220.08 585.017 L 239.866 512.743 L 235.21 505.332 C 215.604 474.149 205.248 438.108 205.264 401.1 C 205.307 293.113 293.17 205.257 401.204 205.257 C 453.518 205.275 502.693 225.674 539.673 262.696 C 576.651 299.716 597.004 348.925 596.983 401.258 C 596.939 509.254 509.078 597.117 401.126 597.117 Z  M 567.816 234.565 C 523.327 190.024 464.161 165.484 401.124 165.458 C 271.24 165.458 165.529 271.161 165.477 401.085 C 165.46 442.617 176.311 483.154 196.932 518.892 L 163.502 641 L 288.421 608.232 C 322.839 627.005 361.591 636.901 401.03 636.913 L 401.126 636.913 L 401.127 636.913 C 530.998 636.913 636.717 531.2 636.77 401.274 C 636.794 338.309 612.306 279.105 567.816 234.565\" fill-rule=\"evenodd\" fill=\"rgb(255,255,255)\"/></g></g></svg>";
        var HTML_ELEMENT_WIDGET_MAIN = "".concat(TOGGLE.outerHTML, "\n            <div class=\"").concat(CLASS_NAME_WIDGET_CONTENT, " chat-tab\">\n                <header class=\"chat-header\">\n                    <div class=\"chat-admin-picture\">\n                        <img src=\"").concat(this._config.photo, "\" alt=\"").concat(this._config.name, "'s Photos\">\n                    </div>\n                    <div class=\"chat-admin-details\">\n                        <h4>").concat(this._config.name, "</h4>\n                        <p><small>").concat(this._config.division, "</small></p>\n                    </div>\n                </header>\n                <div class=\"chat-content\">\n                    <div class=\"chat-item\">\n                        <p>").concat(this._config.introduction, "</p>\n                    </div>\n                </div>\n                ").concat(this._buildInputs(this._inputs).outerHTML, "\n            </div>");
        this._element.innerHTML = HTML_ELEMENT_WIDGET_MAIN;
      }
    }, {
      key: "_buildInputs",
      value: function _buildInputs(inputs) {
        var form = document.createElement('div');
        form.classList.add('chat-form');
        inputs.forEach(function (input) {
          var newInput = document.createElement('input');
          newInput.type = input.type;
          newInput.setAttribute('data-message', input.data);
          newInput.placeholder = input.data.replace(/^./, input.data[0].toUpperCase());
          newInput.required = input.required;
          form.appendChild(newInput);
        });
        var button = document.createElement('button');
        button.classList.add('chat-send');
        button.type = 'submit';
        button.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_SEND);
        button.innerHTML = '<strong>Send</strong>';
        form.appendChild(button);
        return form;
      }
    }, {
      key: "_setEventListener",
      value: function _setEventListener() {
        var _this2 = this;

        this._toggleChat = document.querySelector(SELECTOR_DATA_TOGGLE_CHAT + '[data-target="#' + this._element.id + '"]');
        this._contentElement = this._element.getElementsByClassName(CLASS_NAME_WIDGET_CONTENT).item(0);
        this._toggleSend = this._element.querySelector(SELECTOR_DATA_TOGGLE_SEND);

        if (this._toggleChat) {
          this._toggleChat.addEventListener("click", function (e) {
            e.preventDefault();

            _this2.toggle();
          });
        }

        if (this._toggleSend) {
          this._toggleSend.addEventListener('click', function (e) {
            e.preventDefault();

            _this2._sendMessage();
          });
        }
      }
    }, {
      key: "_show",
      value: function _show() {
        this._element.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._toggleChat.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._contentElement.classList.add(CLASS_NAME_WIDGET_EXPANDED);

        this._isShown = true;
      }
    }, {
      key: "_hide",
      value: function _hide() {
        this._element.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._toggleChat.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._contentElement.classList.remove(CLASS_NAME_WIDGET_EXPANDED);

        this._isShown = false;
      }
    }, {
      key: "_formValidation",
      value: function _formValidation(formElement) {
        if (!formElement.required) return true;
        formElement.classList.remove(CLASS_NAME_WIDGET_FORM_REQUIRED);

        switch (formElement.type) {
          case 'email':
            if (!/^\S+@\S+$/.test(formElement.value)) {
              formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED);
              return false;
            }

            break;

          default:
            if (formElement.value == '' || formElement.value == null) {
              formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED);
              return false;
            }

            break;
        }

        return true;
      }
    }, {
      key: "_getConfig",
      value: function _getConfig(config) {
        config = _objectSpread2(_objectSpread2({}, DefaultConfig), config);

        this._typeCheck(config, DefaultConfigType);

        return config;
      }
    }, {
      key: "_getInput",
      value: function _getInput(inputs) {
        if (typeof inputs === 'undefined' || inputs.length === 0) return DefaultForm;
        return inputs;
      }
    }, {
      key: "_verifyInput",
      value: function _verifyInput(inputs) {
        var _this3 = this;

        inputs.forEach(function (input) {
          _this3._typeCheck(input, DefaultFormType);
        });
      }
    }, {
      key: "_typeCheck",
      value: function _typeCheck(config, configTypes) {
        var _this4 = this;

        Object.keys(configTypes).forEach(function (property) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && _this4._isElement(value) ? 'element' : _this4._toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error("WhatsApp Widget: " + "Option \"".concat(property, "\" provided type \"").concat(valueType, "\" ") + "but expected type \"".concat(expectedTypes, "\"."));
          }
        });
      }
    }, {
      key: "_isElement",
      value: function _isElement(obj) {
        (obj[0] || obj).nodeType;
      } // AngusCroll (https://goo.gl/pxwQGp)

    }, {
      key: "_toType",
      value: function _toType(obj) {
        if (obj === null || obj === undefined) {
          return "".concat(obj);
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
      }
    }]);

    return Chat;
  }();

  document.body.onload = function () {
    var chatSelector = document.querySelectorAll(SELECTOR_CHAT_WIDGET);

    for (var i = 0; i < chatSelector.length; i++) {
      var element = chatSelector[i];
      new Chat(element, {}, []); // eslint-disable-line no-unused-vars
    }
  };

  return Chat;

})));
