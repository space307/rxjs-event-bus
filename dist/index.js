'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bus = function () {
  function Bus(historySettings) {
    var _this = this;

    _classCallCheck(this, Bus);

    this._streams = new Map();

    this._getStreamWithSlicedHistory = function (type, sliceCount) {
      var historyLengthForStream = _this._historySettings.get(type);
      var eventsToSkip = historyLengthForStream - sliceCount;

      return _this._selectStream(type).pipe((0, _operators.skip)(eventsToSkip)).asObservable();
    };

    this._subjectsEmitter = new _rxjs.ReplaySubject().pipe((0, _operators.mergeAll)());
    this._historySettings = historySettings || new Map();

    if (historySettings) {
      this._initReplaySubjects(historySettings);
    }
  }

  _createClass(Bus, [{
    key: 'select',
    value: function select(type, sliceCount) {
      var _this2 = this;

      var currentStream = this._selectStream(type);

      return (0, _rxjs.iif)(function () {
        return Number.isInteger(sliceCount) && _this2._historySettings.has(type);
      }, this._getStreamWithSlicedHistory(type, sliceCount), currentStream);
    }
  }, {
    key: 'getMainStream',
    value: function getMainStream() {
      return this._subjectsEmitter.asObservable();
    }
  }, {
    key: 'emit',
    value: function emit(_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      var currentStream = this._selectStream(type);

      currentStream.next({ type: type, payload: payload });
    }
  }, {
    key: '_selectStream',
    value: function _selectStream(type) {
      if (!this._streams.has(type)) {
        this._addNewStream(type, new _rxjs.Subject());
      }

      return this._streams.get(type);
    }
  }, {
    key: '_updateMainStream',
    value: function _updateMainStream(type) {
      this._subjectsEmitter.next(this._streams.get(type));
    }
  }, {
    key: '_initReplaySubjects',
    value: function _initReplaySubjects(historySettings) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = historySettings.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              type = _step$value[0],
              value = _step$value[1];

          this._addNewStream(type, new _rxjs.ReplaySubject(value));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_addNewStream',
    value: function _addNewStream(type, stream) {
      this._streams.set(type, stream);
      this._updateMainStream(type);
    }
  }]);

  return Bus;
}();

exports.default = Bus;
//# sourceMappingURL=index.js.map