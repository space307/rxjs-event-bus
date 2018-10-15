'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// $FlowIgnore iif is in rxjs


var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bus = function () {
  function Bus(historySettings) {
    var _this = this;

    _classCallCheck(this, Bus);

    this._streams = new Map();

    this._getStreamWithSlicedHistory = function (evtType) {
      var sliceCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      // TODO: flow error
      // $FlowIgnore i don't know
      var historyLengthForStream = _this._historySettings.get(evtType);

      if (historyLengthForStream) {
        var eventsToSkip = historyLengthForStream - sliceCount;

        // TODO: flow error
        // $FlowIgnore i don't know
        return _this._selectStream(evtType).pipe((0, _operators.skip)(eventsToSkip)).asObservable();
      }

      return _this._selectStream(evtType).asObservable();
    };

    this._subjectsEmitter = new _rxjs.ReplaySubject();
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
      }, this._getStreamWithSlicedHistory(type, sliceCount), currentStream.asObservable());
    }
  }, {
    key: 'getMainStream',
    value: function getMainStream() {
      return this._subjectsEmitter.pipe((0, _operators.mergeAll)())
      // $FlowIgnore this is (Replay)Subject! not an Observable!
      .asObservable();
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

      // $FlowIgnore stream is exist
      return this._streams.get(type);
    }
  }, {
    key: '_updateMainStream',
    value: function _updateMainStream(type) {
      var stream = this._streams.get(type);
      if (stream) {
        this._subjectsEmitter.next(stream);
      }
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
      // TODO: flow error
      // $FlowIgnore i don't know
      this._streams.set(type, stream);
      this._updateMainStream(type);
    }
  }]);

  return Bus;
}();

exports.default = Bus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJCdXMiLCJoaXN0b3J5U2V0dGluZ3MiLCJfc3RyZWFtcyIsIk1hcCIsIl9nZXRTdHJlYW1XaXRoU2xpY2VkSGlzdG9yeSIsImV2dFR5cGUiLCJzbGljZUNvdW50IiwiaGlzdG9yeUxlbmd0aEZvclN0cmVhbSIsIl9oaXN0b3J5U2V0dGluZ3MiLCJnZXQiLCJldmVudHNUb1NraXAiLCJfc2VsZWN0U3RyZWFtIiwicGlwZSIsImFzT2JzZXJ2YWJsZSIsIl9zdWJqZWN0c0VtaXR0ZXIiLCJSZXBsYXlTdWJqZWN0IiwiX2luaXRSZXBsYXlTdWJqZWN0cyIsInR5cGUiLCJjdXJyZW50U3RyZWFtIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaGFzIiwicGF5bG9hZCIsIm5leHQiLCJfYWRkTmV3U3RyZWFtIiwiU3ViamVjdCIsInN0cmVhbSIsImVudHJpZXMiLCJ2YWx1ZSIsInNldCIsIl91cGRhdGVNYWluU3RyZWFtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7OztBQUNBOztBQUNBOzs7O0lBVXFCQSxHO0FBS25CLGVBQVlDLGVBQVosRUFBd0Q7QUFBQTs7QUFBQTs7QUFBQSxTQUh4REMsUUFHd0QsR0FIbUIsSUFBSUMsR0FBSixFQUduQjs7QUFBQSxTQWdDeERDLDJCQWhDd0QsR0FnQzFCLFVBQU9DLE9BQVAsRUFBNEU7QUFBQSxVQUF6REMsVUFBeUQsdUVBQXBDLENBQW9DOztBQUN4RztBQUNBO0FBQ0EsVUFBTUMseUJBQXlCLE1BQUtDLGdCQUFMLENBQXNCQyxHQUF0QixDQUEwQkosT0FBMUIsQ0FBL0I7O0FBRUEsVUFBSUUsc0JBQUosRUFBNEI7QUFDMUIsWUFBTUcsZUFBZUgseUJBQXlCRCxVQUE5Qzs7QUFFQTtBQUNBO0FBQ0EsZUFBTyxNQUFLSyxhQUFMLENBQW1CTixPQUFuQixFQUNKTyxJQURJLENBQ0MscUJBQUtGLFlBQUwsQ0FERCxFQUVKRyxZQUZJLEVBQVA7QUFHRDs7QUFFRCxhQUFPLE1BQUtGLGFBQUwsQ0FBbUJOLE9BQW5CLEVBQTRCUSxZQUE1QixFQUFQO0FBQ0QsS0FoRHVEOztBQUN0RCxTQUFLQyxnQkFBTCxHQUF3QixJQUFJQyxtQkFBSixFQUF4QjtBQUNBLFNBQUtQLGdCQUFMLEdBQXdCUCxtQkFBbUIsSUFBSUUsR0FBSixFQUEzQzs7QUFFQSxRQUFJRixlQUFKLEVBQXFCO0FBQ25CLFdBQUtlLG1CQUFMLENBQXlCZixlQUF6QjtBQUNEO0FBQ0Y7Ozs7MkJBRXlCZ0IsSSxFQUFTWCxVLEVBQW1EO0FBQUE7O0FBQ3BGLFVBQU1ZLGdCQUFnQixLQUFLUCxhQUFMLENBQW1CTSxJQUFuQixDQUF0Qjs7QUFFQSxhQUFPLGVBQ0w7QUFBQSxlQUFNRSxPQUFPQyxTQUFQLENBQWlCZCxVQUFqQixLQUFnQyxPQUFLRSxnQkFBTCxDQUFzQmEsR0FBdEIsQ0FBMEJKLElBQTFCLENBQXRDO0FBQUEsT0FESyxFQUVMLEtBQUtiLDJCQUFMLENBQWlDYSxJQUFqQyxFQUF1Q1gsVUFBdkMsQ0FGSyxFQUdMWSxjQUFjTCxZQUFkLEVBSEssQ0FBUDtBQUtEOzs7b0NBRXlDO0FBQ3hDLGFBQU8sS0FBS0MsZ0JBQUwsQ0FDSkYsSUFESSxDQUNDLDBCQUREO0FBRUw7QUFGSyxPQUdKQyxZQUhJLEVBQVA7QUFJRDs7OytCQUVrRTtBQUFBLFVBQXpDSSxJQUF5QyxRQUF6Q0EsSUFBeUM7QUFBQSxVQUFuQ0ssT0FBbUMsUUFBbkNBLE9BQW1DOztBQUNqRSxVQUFNSixnQkFBZ0IsS0FBS1AsYUFBTCxDQUFtQk0sSUFBbkIsQ0FBdEI7O0FBRUFDLG9CQUFjSyxJQUFkLENBQW1CLEVBQUVOLFVBQUYsRUFBUUssZ0JBQVIsRUFBbkI7QUFDRDs7O2tDQW9CZ0NMLEksRUFBdUM7QUFDdEUsVUFBSSxDQUFDLEtBQUtmLFFBQUwsQ0FBY21CLEdBQWQsQ0FBa0JKLElBQWxCLENBQUwsRUFBOEI7QUFDNUIsYUFBS08sYUFBTCxDQUFtQlAsSUFBbkIsRUFBeUIsSUFBSVEsYUFBSixFQUF6QjtBQUNEOztBQUVEO0FBQ0EsYUFBTyxLQUFLdkIsUUFBTCxDQUFjTyxHQUFkLENBQWtCUSxJQUFsQixDQUFQO0FBQ0Q7OztzQ0FFb0NBLEksRUFBZTtBQUNsRCxVQUFNUyxTQUFTLEtBQUt4QixRQUFMLENBQWNPLEdBQWQsQ0FBa0JRLElBQWxCLENBQWY7QUFDQSxVQUFJUyxNQUFKLEVBQVk7QUFDVixhQUFLWixnQkFBTCxDQUFzQlMsSUFBdEIsQ0FBMkJHLE1BQTNCO0FBQ0Q7QUFDRjs7O3dDQUVtQnpCLGUsRUFBMkM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDN0QsNkJBQTBCQSxnQkFBZ0IwQixPQUFoQixFQUExQiw4SEFBcUQ7QUFBQTtBQUFBLGNBQTNDVixJQUEyQztBQUFBLGNBQXJDVyxLQUFxQzs7QUFDbkQsZUFBS0osYUFBTCxDQUFtQlAsSUFBbkIsRUFBeUIsSUFBSUYsbUJBQUosQ0FBa0JhLEtBQWxCLENBQXpCO0FBQ0Q7QUFINEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUk5RDs7O2tDQUVnQ1gsSSxFQUFTUyxNLEVBQXNDO0FBQzlFO0FBQ0E7QUFDQSxXQUFLeEIsUUFBTCxDQUFjMkIsR0FBZCxDQUFrQlosSUFBbEIsRUFBd0JTLE1BQXhCO0FBQ0EsV0FBS0ksaUJBQUwsQ0FBdUJiLElBQXZCO0FBQ0Q7Ozs7OztrQkFsRmtCakIsRyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8vICRGbG93SWdub3JlIGlpZiBpcyBpbiByeGpzXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBpaWYgfSBmcm9tICdyeGpzJ1xuaW1wb3J0IHsgbWVyZ2VBbGwsIHNraXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcblxuaW1wb3J0IHR5cGUge1xuICBFdmVudFR5cGUsXG4gIEJ1c0V2ZW50LFxuICBIaXN0b3J5U2V0dGluZ3NUeXBlLFxuICBTdHJlYW1UeXBlLFxufSBmcm9tICcuL3R5cGVzLmpzJ1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1czxJTkM6IHsgW3N0cmluZ106ICogfT4ge1xuICBfc3ViamVjdHNFbWl0dGVyOiBSZXBsYXlTdWJqZWN0PCo+XG4gIF9zdHJlYW1zOiBNYXA8RXZlbnRUeXBlPElOQz4sIFN0cmVhbVR5cGU8QnVzRXZlbnQ8SU5DLCBFdmVudFR5cGU8SU5DPj4+PiA9IG5ldyBNYXAoKVxuICBfaGlzdG9yeVNldHRpbmdzOiBNYXA8RXZlbnRUeXBlPElOQz4sIG51bWJlcj5cblxuICBjb25zdHJ1Y3RvcihoaXN0b3J5U2V0dGluZ3M/OiBIaXN0b3J5U2V0dGluZ3NUeXBlPElOQz4pIHtcbiAgICB0aGlzLl9zdWJqZWN0c0VtaXR0ZXIgPSBuZXcgUmVwbGF5U3ViamVjdCgpXG4gICAgdGhpcy5faGlzdG9yeVNldHRpbmdzID0gaGlzdG9yeVNldHRpbmdzIHx8IG5ldyBNYXAoKVxuXG4gICAgaWYgKGhpc3RvcnlTZXR0aW5ncykge1xuICAgICAgdGhpcy5faW5pdFJlcGxheVN1YmplY3RzKGhpc3RvcnlTZXR0aW5ncylcbiAgICB9XG4gIH1cblxuICBzZWxlY3Q8VDogRXZlbnRUeXBlPElOQz4+KHR5cGU6IFQsIHNsaWNlQ291bnQ/OiBudW1iZXIpOiBPYnNlcnZhYmxlPEJ1c0V2ZW50PElOQywgVD4+IHtcbiAgICBjb25zdCBjdXJyZW50U3RyZWFtID0gdGhpcy5fc2VsZWN0U3RyZWFtKHR5cGUpXG5cbiAgICByZXR1cm4gaWlmKFxuICAgICAgKCkgPT4gTnVtYmVyLmlzSW50ZWdlcihzbGljZUNvdW50KSAmJiB0aGlzLl9oaXN0b3J5U2V0dGluZ3MuaGFzKHR5cGUpLFxuICAgICAgdGhpcy5fZ2V0U3RyZWFtV2l0aFNsaWNlZEhpc3RvcnkodHlwZSwgc2xpY2VDb3VudCksXG4gICAgICBjdXJyZW50U3RyZWFtLmFzT2JzZXJ2YWJsZSgpLFxuICAgIClcbiAgfVxuXG4gIGdldE1haW5TdHJlYW0oKTogT2JzZXJ2YWJsZTwkVmFsdWVzPElOQz4+IHtcbiAgICByZXR1cm4gdGhpcy5fc3ViamVjdHNFbWl0dGVyXG4gICAgICAucGlwZShtZXJnZUFsbCgpKVxuICAgICAgLy8gJEZsb3dJZ25vcmUgdGhpcyBpcyAoUmVwbGF5KVN1YmplY3QhIG5vdCBhbiBPYnNlcnZhYmxlIVxuICAgICAgLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZW1pdDxUOiBFdmVudFR5cGU8SU5DPj4oeyB0eXBlLCBwYXlsb2FkIH06IEJ1c0V2ZW50PElOQywgVD4pOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50U3RyZWFtID0gdGhpcy5fc2VsZWN0U3RyZWFtKHR5cGUpXG5cbiAgICBjdXJyZW50U3RyZWFtLm5leHQoeyB0eXBlLCBwYXlsb2FkIH0pXG4gIH1cblxuICBfZ2V0U3RyZWFtV2l0aFNsaWNlZEhpc3RvcnkgPSA8VDogKj4oZXZ0VHlwZTogVCwgc2xpY2VDb3VudDogbnVtYmVyID0gMCk6IE9ic2VydmFibGU8QnVzRXZlbnQ8SU5DLCBUPj4gPT4ge1xuICAgIC8vIFRPRE86IGZsb3cgZXJyb3JcbiAgICAvLyAkRmxvd0lnbm9yZSBpIGRvbid0IGtub3dcbiAgICBjb25zdCBoaXN0b3J5TGVuZ3RoRm9yU3RyZWFtID0gdGhpcy5faGlzdG9yeVNldHRpbmdzLmdldChldnRUeXBlKVxuXG4gICAgaWYgKGhpc3RvcnlMZW5ndGhGb3JTdHJlYW0pIHtcbiAgICAgIGNvbnN0IGV2ZW50c1RvU2tpcCA9IGhpc3RvcnlMZW5ndGhGb3JTdHJlYW0gLSBzbGljZUNvdW50XG5cbiAgICAgIC8vIFRPRE86IGZsb3cgZXJyb3JcbiAgICAgIC8vICRGbG93SWdub3JlIGkgZG9uJ3Qga25vd1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdFN0cmVhbShldnRUeXBlKVxuICAgICAgICAucGlwZShza2lwKGV2ZW50c1RvU2tpcCkpXG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RTdHJlYW0oZXZ0VHlwZSkuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBfc2VsZWN0U3RyZWFtPFQ6IEV2ZW50VHlwZTxJTkM+Pih0eXBlOiBUKTogU3RyZWFtVHlwZTxCdXNFdmVudDxJTkMsIFQ+PiB7XG4gICAgaWYgKCF0aGlzLl9zdHJlYW1zLmhhcyh0eXBlKSkge1xuICAgICAgdGhpcy5fYWRkTmV3U3RyZWFtKHR5cGUsIG5ldyBTdWJqZWN0KCkpXG4gICAgfVxuXG4gICAgLy8gJEZsb3dJZ25vcmUgc3RyZWFtIGlzIGV4aXN0XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbXMuZ2V0KHR5cGUpXG4gIH1cblxuICBfdXBkYXRlTWFpblN0cmVhbTxUOiBFdmVudFR5cGU8SU5DPj4odHlwZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX3N0cmVhbXMuZ2V0KHR5cGUpXG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fc3ViamVjdHNFbWl0dGVyLm5leHQoc3RyZWFtKVxuICAgIH1cbiAgfVxuXG4gIF9pbml0UmVwbGF5U3ViamVjdHMoaGlzdG9yeVNldHRpbmdzOiBIaXN0b3J5U2V0dGluZ3NUeXBlPElOQz4pIHtcbiAgICBmb3IgKHZhciBbdHlwZSwgdmFsdWVdIG9mIGhpc3RvcnlTZXR0aW5ncy5lbnRyaWVzKCkpIHtcbiAgICAgIHRoaXMuX2FkZE5ld1N0cmVhbSh0eXBlLCBuZXcgUmVwbGF5U3ViamVjdCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgX2FkZE5ld1N0cmVhbTxUOiBFdmVudFR5cGU8SU5DPj4odHlwZTogVCwgc3RyZWFtOiBTdHJlYW1UeXBlPEJ1c0V2ZW50PElOQywgVD4+KSB7XG4gICAgLy8gVE9ETzogZmxvdyBlcnJvclxuICAgIC8vICRGbG93SWdub3JlIGkgZG9uJ3Qga25vd1xuICAgIHRoaXMuX3N0cmVhbXMuc2V0KHR5cGUsIHN0cmVhbSlcbiAgICB0aGlzLl91cGRhdGVNYWluU3RyZWFtKHR5cGUpXG4gIH1cbn1cbiJdfQ==