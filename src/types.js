// @flow

import { ReplaySubject, Subject } from 'rxjs'

export type EventType<INC> = $Keys<INC>;

export type BusEvent<INC, T: EventType<INC>> = {|
  type: T,
  payload: $ElementType<INC, T>,
|};

export type HistorySettingsType<INC> = Map<EventType<INC>, number>;

export type StreamType<T> = ReplaySubject<T> | Subject<T>
