// @flow

import { Subject, Observable, ReplaySubject, iif } from 'rxjs'
import { mergeAll, skip } from 'rxjs/operators';

type EventType = 'event:type_1' | 'event:type_2'

type Event = {
  type: EventType,
  payload: *,
}

type BusHistorySettings = Map<EventType, number>

export class Bus {
  _subjectsEmitter: Subject
  _streams: Map<EventType, Subject> = new Map()
  _historySettings: BusHistorySettings

  constructor(historySettings?: BusHistorySettings) {
    this._subjectsEmitter = (new ReplaySubject()).pipe(mergeAll())
    this._historySettings = historySettings || new Map()

    if (historySettings) {
      this._initReplaySubjects(historySettings)
    }
  }

  select(type: EventType, sliceCount?: number): Observable {
    const currentStream = this._selectStream(type)

    return iif(
      () => Number.isInteger(sliceCount) && this._historySettings.has(type),
      this._getStreamWithSlicedHistory(type, sliceCount),
      currentStream,
    )
  }

  getMainStream() {
    return this._subjectsEmitter.asObservable();
  }

  emit({ type, payload }: Event): void {
    const currentStream = this._selectStream(type)

    currentStream.next({ type, payload })
  }

  _getStreamWithSlicedHistory = (type: EventType, sliceCount: number): Observable => {
    const historyLengthForStream = this._historySettings.get(type)
    const eventsToSkip = historyLengthForStream - sliceCount

    return this._selectStream(type)
      .pipe(skip(eventsToSkip))
      .asObservable()
  }

  _selectStream(type: EventType) {
    if (!this._streams.has(type)) {
      this._addNewStream(type, new Subject())
    }

    return this._streams.get(type)
  }

  _updateMainStream(type: EventType) {
    this._subjectsEmitter.next(this._streams.get(type));
  }

  _initReplaySubjects(historySettings: BusHistorySettings) {
    for (var [type, value] of historySettings.entries()) {
      this._addNewStream(type, new ReplaySubject(value))
    }
  }

  _addNewStream(type: EventType, stream: Subject | ReplaySubject) {
    this._streams.set(type, stream)
    this._updateMainStream(type)
  }
}
