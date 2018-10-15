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
        return _this._selectStream(evtType).pipe((0, _operators.skip)(eventsToSkip))
        // $FlowIgnore
        .asObservable();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJCdXMiLCJoaXN0b3J5U2V0dGluZ3MiLCJfc3RyZWFtcyIsIk1hcCIsIl9nZXRTdHJlYW1XaXRoU2xpY2VkSGlzdG9yeSIsImV2dFR5cGUiLCJzbGljZUNvdW50IiwiaGlzdG9yeUxlbmd0aEZvclN0cmVhbSIsIl9oaXN0b3J5U2V0dGluZ3MiLCJnZXQiLCJldmVudHNUb1NraXAiLCJfc2VsZWN0U3RyZWFtIiwicGlwZSIsImFzT2JzZXJ2YWJsZSIsIl9zdWJqZWN0c0VtaXR0ZXIiLCJSZXBsYXlTdWJqZWN0IiwiX2luaXRSZXBsYXlTdWJqZWN0cyIsInR5cGUiLCJjdXJyZW50U3RyZWFtIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaGFzIiwicGF5bG9hZCIsIm5leHQiLCJfYWRkTmV3U3RyZWFtIiwiU3ViamVjdCIsInN0cmVhbSIsImVudHJpZXMiLCJ2YWx1ZSIsInNldCIsIl91cGRhdGVNYWluU3RyZWFtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7OztBQUNBOztBQUNBOzs7O0lBVXFCQSxHO0FBS25CLGVBQVlDLGVBQVosRUFBd0Q7QUFBQTs7QUFBQTs7QUFBQSxTQUh4REMsUUFHd0QsR0FIbUIsSUFBSUMsR0FBSixFQUduQjs7QUFBQSxTQWdDeERDLDJCQWhDd0QsR0FnQzFCLFVBQU9DLE9BQVAsRUFBNEU7QUFBQSxVQUF6REMsVUFBeUQsdUVBQXBDLENBQW9DOztBQUN4RztBQUNBO0FBQ0EsVUFBTUMseUJBQXlCLE1BQUtDLGdCQUFMLENBQXNCQyxHQUF0QixDQUEwQkosT0FBMUIsQ0FBL0I7O0FBRUEsVUFBSUUsc0JBQUosRUFBNEI7QUFDMUIsWUFBTUcsZUFBZUgseUJBQXlCRCxVQUE5Qzs7QUFFQTtBQUNBO0FBQ0EsZUFBTyxNQUFLSyxhQUFMLENBQW1CTixPQUFuQixFQUNKTyxJQURJLENBQ0MscUJBQUtGLFlBQUwsQ0FERDtBQUVMO0FBRkssU0FHSkcsWUFISSxFQUFQO0FBSUQ7O0FBRUQsYUFBTyxNQUFLRixhQUFMLENBQW1CTixPQUFuQixFQUE0QlEsWUFBNUIsRUFBUDtBQUNELEtBakR1RDs7QUFDdEQsU0FBS0MsZ0JBQUwsR0FBd0IsSUFBSUMsbUJBQUosRUFBeEI7QUFDQSxTQUFLUCxnQkFBTCxHQUF3QlAsbUJBQW1CLElBQUlFLEdBQUosRUFBM0M7O0FBRUEsUUFBSUYsZUFBSixFQUFxQjtBQUNuQixXQUFLZSxtQkFBTCxDQUF5QmYsZUFBekI7QUFDRDtBQUNGOzs7OzJCQUV5QmdCLEksRUFBU1gsVSxFQUFtRDtBQUFBOztBQUNwRixVQUFNWSxnQkFBZ0IsS0FBS1AsYUFBTCxDQUFtQk0sSUFBbkIsQ0FBdEI7O0FBRUEsYUFBTyxlQUNMO0FBQUEsZUFBTUUsT0FBT0MsU0FBUCxDQUFpQmQsVUFBakIsS0FBZ0MsT0FBS0UsZ0JBQUwsQ0FBc0JhLEdBQXRCLENBQTBCSixJQUExQixDQUF0QztBQUFBLE9BREssRUFFTCxLQUFLYiwyQkFBTCxDQUFpQ2EsSUFBakMsRUFBdUNYLFVBQXZDLENBRkssRUFHTFksY0FBY0wsWUFBZCxFQUhLLENBQVA7QUFLRDs7O29DQUV5QztBQUN4QyxhQUFPLEtBQUtDLGdCQUFMLENBQ0pGLElBREksQ0FDQywwQkFERDtBQUVMO0FBRkssT0FHSkMsWUFISSxFQUFQO0FBSUQ7OzsrQkFFa0U7QUFBQSxVQUF6Q0ksSUFBeUMsUUFBekNBLElBQXlDO0FBQUEsVUFBbkNLLE9BQW1DLFFBQW5DQSxPQUFtQzs7QUFDakUsVUFBTUosZ0JBQWdCLEtBQUtQLGFBQUwsQ0FBbUJNLElBQW5CLENBQXRCOztBQUVBQyxvQkFBY0ssSUFBZCxDQUFtQixFQUFFTixVQUFGLEVBQVFLLGdCQUFSLEVBQW5CO0FBQ0Q7OztrQ0FxQmdDTCxJLEVBQXVDO0FBQ3RFLFVBQUksQ0FBQyxLQUFLZixRQUFMLENBQWNtQixHQUFkLENBQWtCSixJQUFsQixDQUFMLEVBQThCO0FBQzVCLGFBQUtPLGFBQUwsQ0FBbUJQLElBQW5CLEVBQXlCLElBQUlRLGFBQUosRUFBekI7QUFDRDs7QUFFRDtBQUNBLGFBQU8sS0FBS3ZCLFFBQUwsQ0FBY08sR0FBZCxDQUFrQlEsSUFBbEIsQ0FBUDtBQUNEOzs7c0NBRW9DQSxJLEVBQWU7QUFDbEQsVUFBTVMsU0FBUyxLQUFLeEIsUUFBTCxDQUFjTyxHQUFkLENBQWtCUSxJQUFsQixDQUFmO0FBQ0EsVUFBSVMsTUFBSixFQUFZO0FBQ1YsYUFBS1osZ0JBQUwsQ0FBc0JTLElBQXRCLENBQTJCRyxNQUEzQjtBQUNEO0FBQ0Y7Ozt3Q0FFbUJ6QixlLEVBQTJDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzdELDZCQUEwQkEsZ0JBQWdCMEIsT0FBaEIsRUFBMUIsOEhBQXFEO0FBQUE7QUFBQSxjQUEzQ1YsSUFBMkM7QUFBQSxjQUFyQ1csS0FBcUM7O0FBQ25ELGVBQUtKLGFBQUwsQ0FBbUJQLElBQW5CLEVBQXlCLElBQUlGLG1CQUFKLENBQWtCYSxLQUFsQixDQUF6QjtBQUNEO0FBSDREO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJOUQ7OztrQ0FFZ0NYLEksRUFBU1MsTSxFQUFzQztBQUM5RTtBQUNBO0FBQ0EsV0FBS3hCLFFBQUwsQ0FBYzJCLEdBQWQsQ0FBa0JaLElBQWxCLEVBQXdCUyxNQUF4QjtBQUNBLFdBQUtJLGlCQUFMLENBQXVCYixJQUF2QjtBQUNEOzs7Ozs7a0JBbkZrQmpCLEciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4vLyAkRmxvd0lnbm9yZSBpaWYgaXMgaW4gcnhqc1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCwgaWlmIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IG1lcmdlQWxsLCBza2lwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmltcG9ydCB0eXBlIHtcbiAgRXZlbnRUeXBlLFxuICBCdXNFdmVudCxcbiAgSGlzdG9yeVNldHRpbmdzVHlwZSxcbiAgU3RyZWFtVHlwZSxcbn0gZnJvbSAnLi90eXBlcy5qcydcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXM8SU5DOiB7IFtzdHJpbmddOiAqIH0+IHtcbiAgX3N1YmplY3RzRW1pdHRlcjogUmVwbGF5U3ViamVjdDwqPlxuICBfc3RyZWFtczogTWFwPEV2ZW50VHlwZTxJTkM+LCBTdHJlYW1UeXBlPEJ1c0V2ZW50PElOQywgRXZlbnRUeXBlPElOQz4+Pj4gPSBuZXcgTWFwKClcbiAgX2hpc3RvcnlTZXR0aW5nczogTWFwPEV2ZW50VHlwZTxJTkM+LCBudW1iZXI+XG5cbiAgY29uc3RydWN0b3IoaGlzdG9yeVNldHRpbmdzPzogSGlzdG9yeVNldHRpbmdzVHlwZTxJTkM+KSB7XG4gICAgdGhpcy5fc3ViamVjdHNFbWl0dGVyID0gbmV3IFJlcGxheVN1YmplY3QoKVxuICAgIHRoaXMuX2hpc3RvcnlTZXR0aW5ncyA9IGhpc3RvcnlTZXR0aW5ncyB8fCBuZXcgTWFwKClcblxuICAgIGlmIChoaXN0b3J5U2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuX2luaXRSZXBsYXlTdWJqZWN0cyhoaXN0b3J5U2V0dGluZ3MpXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0PFQ6IEV2ZW50VHlwZTxJTkM+Pih0eXBlOiBULCBzbGljZUNvdW50PzogbnVtYmVyKTogT2JzZXJ2YWJsZTxCdXNFdmVudDxJTkMsIFQ+PiB7XG4gICAgY29uc3QgY3VycmVudFN0cmVhbSA9IHRoaXMuX3NlbGVjdFN0cmVhbSh0eXBlKVxuXG4gICAgcmV0dXJuIGlpZihcbiAgICAgICgpID0+IE51bWJlci5pc0ludGVnZXIoc2xpY2VDb3VudCkgJiYgdGhpcy5faGlzdG9yeVNldHRpbmdzLmhhcyh0eXBlKSxcbiAgICAgIHRoaXMuX2dldFN0cmVhbVdpdGhTbGljZWRIaXN0b3J5KHR5cGUsIHNsaWNlQ291bnQpLFxuICAgICAgY3VycmVudFN0cmVhbS5hc09ic2VydmFibGUoKSxcbiAgICApXG4gIH1cblxuICBnZXRNYWluU3RyZWFtKCk6IE9ic2VydmFibGU8JFZhbHVlczxJTkM+PiB7XG4gICAgcmV0dXJuIHRoaXMuX3N1YmplY3RzRW1pdHRlclxuICAgICAgLnBpcGUobWVyZ2VBbGwoKSlcbiAgICAgIC8vICRGbG93SWdub3JlIHRoaXMgaXMgKFJlcGxheSlTdWJqZWN0ISBub3QgYW4gT2JzZXJ2YWJsZSFcbiAgICAgIC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGVtaXQ8VDogRXZlbnRUeXBlPElOQz4+KHsgdHlwZSwgcGF5bG9hZCB9OiBCdXNFdmVudDxJTkMsIFQ+KTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFN0cmVhbSA9IHRoaXMuX3NlbGVjdFN0cmVhbSh0eXBlKVxuXG4gICAgY3VycmVudFN0cmVhbS5uZXh0KHsgdHlwZSwgcGF5bG9hZCB9KVxuICB9XG5cbiAgX2dldFN0cmVhbVdpdGhTbGljZWRIaXN0b3J5ID0gPFQ6ICo+KGV2dFR5cGU6IFQsIHNsaWNlQ291bnQ6IG51bWJlciA9IDApOiBPYnNlcnZhYmxlPEJ1c0V2ZW50PElOQywgVD4+ID0+IHtcbiAgICAvLyBUT0RPOiBmbG93IGVycm9yXG4gICAgLy8gJEZsb3dJZ25vcmUgaSBkb24ndCBrbm93XG4gICAgY29uc3QgaGlzdG9yeUxlbmd0aEZvclN0cmVhbSA9IHRoaXMuX2hpc3RvcnlTZXR0aW5ncy5nZXQoZXZ0VHlwZSlcblxuICAgIGlmIChoaXN0b3J5TGVuZ3RoRm9yU3RyZWFtKSB7XG4gICAgICBjb25zdCBldmVudHNUb1NraXAgPSBoaXN0b3J5TGVuZ3RoRm9yU3RyZWFtIC0gc2xpY2VDb3VudFxuXG4gICAgICAvLyBUT0RPOiBmbG93IGVycm9yXG4gICAgICAvLyAkRmxvd0lnbm9yZSBpIGRvbid0IGtub3dcbiAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RTdHJlYW0oZXZ0VHlwZSlcbiAgICAgICAgLnBpcGUoc2tpcChldmVudHNUb1NraXApKVxuICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAuYXNPYnNlcnZhYmxlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0U3RyZWFtKGV2dFR5cGUpLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgX3NlbGVjdFN0cmVhbTxUOiBFdmVudFR5cGU8SU5DPj4odHlwZTogVCk6IFN0cmVhbVR5cGU8QnVzRXZlbnQ8SU5DLCBUPj4ge1xuICAgIGlmICghdGhpcy5fc3RyZWFtcy5oYXModHlwZSkpIHtcbiAgICAgIHRoaXMuX2FkZE5ld1N0cmVhbSh0eXBlLCBuZXcgU3ViamVjdCgpKVxuICAgIH1cblxuICAgIC8vICRGbG93SWdub3JlIHN0cmVhbSBpcyBleGlzdFxuICAgIHJldHVybiB0aGlzLl9zdHJlYW1zLmdldCh0eXBlKVxuICB9XG5cbiAgX3VwZGF0ZU1haW5TdHJlYW08VDogRXZlbnRUeXBlPElOQz4+KHR5cGU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9zdHJlYW1zLmdldCh0eXBlKVxuICAgIGlmIChzdHJlYW0pIHtcbiAgICAgIHRoaXMuX3N1YmplY3RzRW1pdHRlci5uZXh0KHN0cmVhbSlcbiAgICB9XG4gIH1cblxuICBfaW5pdFJlcGxheVN1YmplY3RzKGhpc3RvcnlTZXR0aW5nczogSGlzdG9yeVNldHRpbmdzVHlwZTxJTkM+KSB7XG4gICAgZm9yICh2YXIgW3R5cGUsIHZhbHVlXSBvZiBoaXN0b3J5U2V0dGluZ3MuZW50cmllcygpKSB7XG4gICAgICB0aGlzLl9hZGROZXdTdHJlYW0odHlwZSwgbmV3IFJlcGxheVN1YmplY3QodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIF9hZGROZXdTdHJlYW08VDogRXZlbnRUeXBlPElOQz4+KHR5cGU6IFQsIHN0cmVhbTogU3RyZWFtVHlwZTxCdXNFdmVudDxJTkMsIFQ+Pikge1xuICAgIC8vIFRPRE86IGZsb3cgZXJyb3JcbiAgICAvLyAkRmxvd0lnbm9yZSBpIGRvbid0IGtub3dcbiAgICB0aGlzLl9zdHJlYW1zLnNldCh0eXBlLCBzdHJlYW0pXG4gICAgdGhpcy5fdXBkYXRlTWFpblN0cmVhbSh0eXBlKVxuICB9XG59XG4iXX0=