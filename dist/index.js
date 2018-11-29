'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NEW_BUS_STREAM_CREATED = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// $FlowIgnore iif is in rxjs


var _rxjs = require('rxjs');

var _operators = require('rxjs/operators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEW_BUS_STREAM_CREATED = exports.NEW_BUS_STREAM_CREATED = 'event-bus/new-stream';

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
    key: '_pushNewStream',
    value: function _pushNewStream(type, stream) {
      // TODO: flow error
      // $FlowIgnore i don't know
      this._streams.set(type, stream);
      this._updateMainStream(type);
      if (type !== NEW_BUS_STREAM_CREATED) {
        this.emit({
          type: NEW_BUS_STREAM_CREATED,
          payload: type
        });
      }
    }
  }, {
    key: '_addNewStream',
    value: function _addNewStream(type) {
      var historyLength = this._historySettings.get(type);
      var stream = historyLength ? new _rxjs.ReplaySubject(historyLength) : new _rxjs.Subject();
      this._pushNewStream(type, stream);
    }
  }]);

  return Bus;
}();

exports.default = Bus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJORVdfQlVTX1NUUkVBTV9DUkVBVEVEIiwiQnVzIiwiaGlzdG9yeVNldHRpbmdzIiwiX3N0cmVhbXMiLCJNYXAiLCJfZ2V0U3RyZWFtV2l0aFNsaWNlZEhpc3RvcnkiLCJldnRUeXBlIiwic2xpY2VDb3VudCIsImhpc3RvcnlMZW5ndGhGb3JTdHJlYW0iLCJfaGlzdG9yeVNldHRpbmdzIiwiZ2V0IiwiZXZlbnRzVG9Ta2lwIiwiX3NlbGVjdFN0cmVhbSIsInBpcGUiLCJhc09ic2VydmFibGUiLCJfc3ViamVjdHNFbWl0dGVyIiwiUmVwbGF5U3ViamVjdCIsInR5cGUiLCJjdXJyZW50U3RyZWFtIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaGFzIiwicGF5bG9hZCIsIm5leHQiLCJfYWRkTmV3U3RyZWFtIiwiU3ViamVjdCIsInN0cmVhbSIsInNldCIsIl91cGRhdGVNYWluU3RyZWFtIiwiZW1pdCIsImhpc3RvcnlMZW5ndGgiLCJfcHVzaE5ld1N0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7OztBQUNBOztBQUNBOzs7O0FBU08sSUFBTUEsMERBQXlCLHNCQUEvQjs7SUFFY0MsRztBQUtuQixlQUFZQyxlQUFaLEVBQXdEO0FBQUE7O0FBQUE7O0FBQUEsU0FIeERDLFFBR3dELEdBSG1CLElBQUlDLEdBQUosRUFHbkI7O0FBQUEsU0E0QnhEQywyQkE1QndELEdBNEIxQixVQUFPQyxPQUFQLEVBQTRFO0FBQUEsVUFBekRDLFVBQXlELHVFQUFwQyxDQUFvQzs7QUFDeEc7QUFDQTtBQUNBLFVBQU1DLHlCQUF5QixNQUFLQyxnQkFBTCxDQUFzQkMsR0FBdEIsQ0FBMEJKLE9BQTFCLENBQS9COztBQUVBLFVBQUlFLHNCQUFKLEVBQTRCO0FBQzFCLFlBQU1HLGVBQWVILHlCQUF5QkQsVUFBOUM7O0FBRUE7QUFDQTtBQUNBLGVBQU8sTUFBS0ssYUFBTCxDQUFtQk4sT0FBbkIsRUFDSk8sSUFESSxDQUNDLHFCQUFLRixZQUFMLENBREQsRUFFSkcsWUFGSSxFQUFQO0FBR0Q7O0FBRUQsYUFBTyxNQUFLRixhQUFMLENBQW1CTixPQUFuQixFQUE0QlEsWUFBNUIsRUFBUDtBQUNELEtBNUN1RDs7QUFDdEQsU0FBS0MsZ0JBQUwsR0FBd0IsSUFBSUMsbUJBQUosRUFBeEI7QUFDQSxTQUFLUCxnQkFBTCxHQUF3QlAsbUJBQW1CLElBQUlFLEdBQUosRUFBM0M7QUFDRDs7OzsyQkFFeUJhLEksRUFBU1YsVSxFQUFtRDtBQUFBOztBQUNwRixVQUFNVyxnQkFBZ0IsS0FBS04sYUFBTCxDQUFtQkssSUFBbkIsQ0FBdEI7O0FBRUEsYUFBTyxlQUNMO0FBQUEsZUFBTUUsT0FBT0MsU0FBUCxDQUFpQmIsVUFBakIsS0FBZ0MsT0FBS0UsZ0JBQUwsQ0FBc0JZLEdBQXRCLENBQTBCSixJQUExQixDQUF0QztBQUFBLE9BREssRUFFTCxLQUFLWiwyQkFBTCxDQUFpQ1ksSUFBakMsRUFBdUNWLFVBQXZDLENBRkssRUFHTFcsY0FBY0osWUFBZCxFQUhLLENBQVA7QUFLRDs7O29DQUV5QztBQUN4QyxhQUFPLEtBQUtDLGdCQUFMLENBQ0pGLElBREksQ0FDQywwQkFERDtBQUVMO0FBRkssT0FHSkMsWUFISSxFQUFQO0FBSUQ7OzsrQkFFa0U7QUFBQSxVQUF6Q0csSUFBeUMsUUFBekNBLElBQXlDO0FBQUEsVUFBbkNLLE9BQW1DLFFBQW5DQSxPQUFtQzs7QUFDakUsVUFBTUosZ0JBQWdCLEtBQUtOLGFBQUwsQ0FBbUJLLElBQW5CLENBQXRCOztBQUVBQyxvQkFBY0ssSUFBZCxDQUFtQixFQUFFTixVQUFGLEVBQVFLLGdCQUFSLEVBQW5CO0FBQ0Q7OztrQ0FvQmdDTCxJLEVBQXVDO0FBQ3RFLFVBQUksQ0FBQyxLQUFLZCxRQUFMLENBQWNrQixHQUFkLENBQWtCSixJQUFsQixDQUFMLEVBQThCO0FBQzVCLGFBQUtPLGFBQUwsQ0FBbUJQLElBQW5CLEVBQXlCLElBQUlRLGFBQUosRUFBekI7QUFDRDs7QUFFRDtBQUNBLGFBQU8sS0FBS3RCLFFBQUwsQ0FBY08sR0FBZCxDQUFrQk8sSUFBbEIsQ0FBUDtBQUNEOzs7c0NBRW9DQSxJLEVBQWU7QUFDbEQsVUFBTVMsU0FBUyxLQUFLdkIsUUFBTCxDQUFjTyxHQUFkLENBQWtCTyxJQUFsQixDQUFmO0FBQ0EsVUFBSVMsTUFBSixFQUFZO0FBQ1YsYUFBS1gsZ0JBQUwsQ0FBc0JRLElBQXRCLENBQTJCRyxNQUEzQjtBQUNEO0FBQ0Y7OzttQ0FFaUNULEksRUFBU1MsTSxFQUFzQztBQUMvRTtBQUNBO0FBQ0EsV0FBS3ZCLFFBQUwsQ0FBY3dCLEdBQWQsQ0FBa0JWLElBQWxCLEVBQXdCUyxNQUF4QjtBQUNBLFdBQUtFLGlCQUFMLENBQXVCWCxJQUF2QjtBQUNBLFVBQUdBLFNBQVNqQixzQkFBWixFQUFvQztBQUNsQyxhQUFLNkIsSUFBTCxDQUFVO0FBQ1JaLGdCQUFNakIsc0JBREU7QUFFUnNCLG1CQUFTTDtBQUZELFNBQVY7QUFJRDtBQUNGOzs7a0NBRWdDQSxJLEVBQVM7QUFDeEMsVUFBTWEsZ0JBQWdCLEtBQUtyQixnQkFBTCxDQUFzQkMsR0FBdEIsQ0FBMEJPLElBQTFCLENBQXRCO0FBQ0EsVUFBSVMsU0FBU0ksZ0JBQ1QsSUFBSWQsbUJBQUosQ0FBa0JjLGFBQWxCLENBRFMsR0FFVCxJQUFJTCxhQUFKLEVBRko7QUFHQSxXQUFLTSxjQUFMLENBQW9CZCxJQUFwQixFQUEwQlMsTUFBMUI7QUFDRDs7Ozs7O2tCQXRGa0J6QixHIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuLy8gJEZsb3dJZ25vcmUgaWlmIGlzIGluIHJ4anNcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QsIGlpZiB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBtZXJnZUFsbCwgc2tpcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQgdHlwZSB7XG4gIEV2ZW50VHlwZSxcbiAgQnVzRXZlbnQsXG4gIEhpc3RvcnlTZXR0aW5nc1R5cGUsXG4gIFN0cmVhbVR5cGUsXG59IGZyb20gJy4vdHlwZXMuanMnXG5cbmV4cG9ydCBjb25zdCBORVdfQlVTX1NUUkVBTV9DUkVBVEVEID0gJ2V2ZW50LWJ1cy9uZXctc3RyZWFtJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVzPElOQzogeyBbc3RyaW5nXTogKiB9PiB7XG4gIF9zdWJqZWN0c0VtaXR0ZXI6IFJlcGxheVN1YmplY3Q8Kj5cbiAgX3N0cmVhbXM6IE1hcDxFdmVudFR5cGU8SU5DPiwgU3RyZWFtVHlwZTxCdXNFdmVudDxJTkMsIEV2ZW50VHlwZTxJTkM+Pj4+ID0gbmV3IE1hcCgpXG4gIF9oaXN0b3J5U2V0dGluZ3M6IE1hcDxFdmVudFR5cGU8SU5DPiwgbnVtYmVyPlxuXG4gIGNvbnN0cnVjdG9yKGhpc3RvcnlTZXR0aW5ncz86IEhpc3RvcnlTZXR0aW5nc1R5cGU8SU5DPikge1xuICAgIHRoaXMuX3N1YmplY3RzRW1pdHRlciA9IG5ldyBSZXBsYXlTdWJqZWN0KClcbiAgICB0aGlzLl9oaXN0b3J5U2V0dGluZ3MgPSBoaXN0b3J5U2V0dGluZ3MgfHwgbmV3IE1hcCgpXG4gIH1cblxuICBzZWxlY3Q8VDogRXZlbnRUeXBlPElOQz4+KHR5cGU6IFQsIHNsaWNlQ291bnQ/OiBudW1iZXIpOiBPYnNlcnZhYmxlPEJ1c0V2ZW50PElOQywgVD4+IHtcbiAgICBjb25zdCBjdXJyZW50U3RyZWFtID0gdGhpcy5fc2VsZWN0U3RyZWFtKHR5cGUpXG5cbiAgICByZXR1cm4gaWlmKFxuICAgICAgKCkgPT4gTnVtYmVyLmlzSW50ZWdlcihzbGljZUNvdW50KSAmJiB0aGlzLl9oaXN0b3J5U2V0dGluZ3MuaGFzKHR5cGUpLFxuICAgICAgdGhpcy5fZ2V0U3RyZWFtV2l0aFNsaWNlZEhpc3RvcnkodHlwZSwgc2xpY2VDb3VudCksXG4gICAgICBjdXJyZW50U3RyZWFtLmFzT2JzZXJ2YWJsZSgpLFxuICAgIClcbiAgfVxuXG4gIGdldE1haW5TdHJlYW0oKTogT2JzZXJ2YWJsZTwkVmFsdWVzPElOQz4+IHtcbiAgICByZXR1cm4gdGhpcy5fc3ViamVjdHNFbWl0dGVyXG4gICAgICAucGlwZShtZXJnZUFsbCgpKVxuICAgICAgLy8gJEZsb3dJZ25vcmUgdGhpcyBpcyAoUmVwbGF5KVN1YmplY3QhIG5vdCBhbiBPYnNlcnZhYmxlIVxuICAgICAgLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZW1pdDxUOiBFdmVudFR5cGU8SU5DPj4oeyB0eXBlLCBwYXlsb2FkIH06IEJ1c0V2ZW50PElOQywgVD4pOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50U3RyZWFtID0gdGhpcy5fc2VsZWN0U3RyZWFtKHR5cGUpXG5cbiAgICBjdXJyZW50U3RyZWFtLm5leHQoeyB0eXBlLCBwYXlsb2FkIH0pXG4gIH1cblxuICBfZ2V0U3RyZWFtV2l0aFNsaWNlZEhpc3RvcnkgPSA8VDogKj4oZXZ0VHlwZTogVCwgc2xpY2VDb3VudDogbnVtYmVyID0gMCk6IE9ic2VydmFibGU8QnVzRXZlbnQ8SU5DLCBUPj4gPT4ge1xuICAgIC8vIFRPRE86IGZsb3cgZXJyb3JcbiAgICAvLyAkRmxvd0lnbm9yZSBpIGRvbid0IGtub3dcbiAgICBjb25zdCBoaXN0b3J5TGVuZ3RoRm9yU3RyZWFtID0gdGhpcy5faGlzdG9yeVNldHRpbmdzLmdldChldnRUeXBlKVxuXG4gICAgaWYgKGhpc3RvcnlMZW5ndGhGb3JTdHJlYW0pIHtcbiAgICAgIGNvbnN0IGV2ZW50c1RvU2tpcCA9IGhpc3RvcnlMZW5ndGhGb3JTdHJlYW0gLSBzbGljZUNvdW50XG5cbiAgICAgIC8vIFRPRE86IGZsb3cgZXJyb3JcbiAgICAgIC8vICRGbG93SWdub3JlIGkgZG9uJ3Qga25vd1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdFN0cmVhbShldnRUeXBlKVxuICAgICAgICAucGlwZShza2lwKGV2ZW50c1RvU2tpcCkpXG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RTdHJlYW0oZXZ0VHlwZSkuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBfc2VsZWN0U3RyZWFtPFQ6IEV2ZW50VHlwZTxJTkM+Pih0eXBlOiBUKTogU3RyZWFtVHlwZTxCdXNFdmVudDxJTkMsIFQ+PiB7XG4gICAgaWYgKCF0aGlzLl9zdHJlYW1zLmhhcyh0eXBlKSkge1xuICAgICAgdGhpcy5fYWRkTmV3U3RyZWFtKHR5cGUsIG5ldyBTdWJqZWN0KCkpXG4gICAgfVxuXG4gICAgLy8gJEZsb3dJZ25vcmUgc3RyZWFtIGlzIGV4aXN0XG4gICAgcmV0dXJuIHRoaXMuX3N0cmVhbXMuZ2V0KHR5cGUpXG4gIH1cblxuICBfdXBkYXRlTWFpblN0cmVhbTxUOiBFdmVudFR5cGU8SU5DPj4odHlwZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX3N0cmVhbXMuZ2V0KHR5cGUpXG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fc3ViamVjdHNFbWl0dGVyLm5leHQoc3RyZWFtKVxuICAgIH1cbiAgfVxuXG4gIF9wdXNoTmV3U3RyZWFtPFQ6IEV2ZW50VHlwZTxJTkM+Pih0eXBlOiBULCBzdHJlYW06IFN0cmVhbVR5cGU8QnVzRXZlbnQ8SU5DLCBUPj4pIHtcbiAgICAvLyBUT0RPOiBmbG93IGVycm9yXG4gICAgLy8gJEZsb3dJZ25vcmUgaSBkb24ndCBrbm93XG4gICAgdGhpcy5fc3RyZWFtcy5zZXQodHlwZSwgc3RyZWFtKVxuICAgIHRoaXMuX3VwZGF0ZU1haW5TdHJlYW0odHlwZSlcbiAgICBpZih0eXBlICE9PSBORVdfQlVTX1NUUkVBTV9DUkVBVEVEKSB7XG4gICAgICB0aGlzLmVtaXQoe1xuICAgICAgICB0eXBlOiBORVdfQlVTX1NUUkVBTV9DUkVBVEVELFxuICAgICAgICBwYXlsb2FkOiB0eXBlLFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBfYWRkTmV3U3RyZWFtPFQ6IEV2ZW50VHlwZTxJTkM+Pih0eXBlOiBUKSB7XG4gICAgY29uc3QgaGlzdG9yeUxlbmd0aCA9IHRoaXMuX2hpc3RvcnlTZXR0aW5ncy5nZXQodHlwZSlcbiAgICBsZXQgc3RyZWFtID0gaGlzdG9yeUxlbmd0aFxuICAgICAgPyBuZXcgUmVwbGF5U3ViamVjdChoaXN0b3J5TGVuZ3RoKVxuICAgICAgOiBuZXcgU3ViamVjdCgpO1xuICAgIHRoaXMuX3B1c2hOZXdTdHJlYW0odHlwZSwgc3RyZWFtKVxuICB9XG59XG4iXX0=