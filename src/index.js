// @flow

// $FlowIgnore iif is in rxjs
import { Subject, Observable, ReplaySubject, iif } from 'rxjs'
import { mergeAll, skip } from 'rxjs/operators'

import type {
  EventType,
  BusEvent,
  HistorySettingsType,
  StreamType,
} from './types.js'

export const NEW_BUS_STREAM_CREATED = 'event-bus/new-stream';

export default class Bus<INC: { [string]: * }> {
  _subjectsEmitter: ReplaySubject<*>
  _streams: Map<EventType<INC>, StreamType<BusEvent<INC, EventType<INC>>>> = new Map()
  _historySettings: Map<EventType<INC>, number>

  constructor(historySettings?: HistorySettingsType<INC>) {
    this._subjectsEmitter = new ReplaySubject()
    this._historySettings = historySettings || new Map()
  }

  select<T: EventType<INC>>(type: T, sliceCount?: number): Observable<BusEvent<INC, T>> {
    const currentStream = this._selectStream(type)

    return iif(
      () => Number.isInteger(sliceCount) && this._historySettings.has(type),
      this._getStreamWithSlicedHistory(type, sliceCount),
      currentStream.asObservable(),
    )
  }

  getMainStream(): Observable<$Values<INC>> {
    return this._subjectsEmitter
      .pipe(mergeAll())
      // $FlowIgnore this is (Replay)Subject! not an Observable!
      .asObservable();
  }

  emit<T: EventType<INC>>({ type, payload }: BusEvent<INC, T>): void {
    const currentStream = this._selectStream(type)

    currentStream.next({ type, payload })
  }

  _getStreamWithSlicedHistory = <T: *>(evtType: T, sliceCount: number = 0): Observable<BusEvent<INC, T>> => {
    // TODO: flow error
    // $FlowIgnore i don't know
    const historyLengthForStream = this._historySettings.get(evtType)

    if (historyLengthForStream) {
      const eventsToSkip = historyLengthForStream - sliceCount

      // TODO: flow error
      // $FlowIgnore i don't know
      return this._selectStream(evtType)
        .pipe(skip(eventsToSkip))
        .asObservable()
    }

    return this._selectStream(evtType).asObservable();
  }

  _selectStream<T: EventType<INC>>(type: T): StreamType<BusEvent<INC, T>> {
    if (!this._streams.has(type)) {
      this._addNewStream(type, new Subject())
    }

    // $FlowIgnore stream is exist
    return this._streams.get(type)
  }

  _updateMainStream<T: EventType<INC>>(type: T): void {
    const stream = this._streams.get(type)
    if (stream) {
      this._subjectsEmitter.next(stream)
    }
  }

  _pushNewStream<T: EventType<INC>>(type: T, stream: StreamType<BusEvent<INC, T>>) {
    // TODO: flow error
    // $FlowIgnore i don't know
    this._streams.set(type, stream)
    this._updateMainStream(type)
    if(type !== NEW_BUS_STREAM_CREATED) {
      this.emit({
        type: NEW_BUS_STREAM_CREATED,
        payload: type,
      })
    }
  }

  _addNewStream<T: EventType<INC>>(type: T) {
    const historyLength = this._historySettings.get(type)
    let stream = historyLength
      ? new ReplaySubject(historyLength)
      : new Subject();
    this._pushNewStream(type, stream)
  }
}
