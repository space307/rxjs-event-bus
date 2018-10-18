import { Observable } from 'rxjs';

type MappedType<INC> = {
  [EventType in keyof INC]: number;
};

type EventType<INC> = keyof INC;

type EventTypeMap<INC, T extends EventType<INC>> = INC[T];

interface IBusEvent<INC, T extends EventType<INC>> {
  type: T;
  payload: EventTypeMap<INC, T>;
}

type HistorySettingsType<INC> = MappedType<INC>;

export default class Bus<INC> {
  constructor(settings?: HistorySettingsType<INC>);

  select<T extends EventType<INC>>(name: T): Observable<IBusEvent<INC, T>>
  getMainStream(): Observable<INC[keyof INC]>;
  emit<T extends EventType<INC>>(event: IBusEvent<INC, T>): void;
}
