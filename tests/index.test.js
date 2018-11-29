import Bus from '../src/index'
import { merge } from 'rxjs'

const getInstance = settings => new Bus(settings)

test('construct', () => {
  expect(getInstance).not.toThrow()
})

test('creates stream after select', () => {
  const bus = getInstance()

  bus.select('event:type_1')

  expect(bus._streams.get('event:type_1')).not.toBeUndefined()
})

test('creates stream after emit', () => {
  const bus = getInstance()

  bus.emit({type: 'event:type_1', payload: 1})

  expect(bus._streams.get('event:type_1'))
    .not.toBeUndefined()
})

test('is not emit without subscriber throuth \'select(...)\'', () => {
  const subscriber = jest.fn()
  const bus = getInstance()

  bus.emit({type: 'event:type_1', payload: 1})

  bus.select('event:type_1').subscribe(subscriber)

  expect(subscriber).not.toBeCalled()
})

test('is not emit without subscriber throuth \'getMainStream(...)\'', () => {
  const subscriber = jest.fn()
  const bus = getInstance()

  bus.emit({type: 'event:type_1', payload: 1})

  bus.getMainStream().subscribe(subscriber)

  expect(subscriber).not.toBeCalled()
})

test('emit without subscriber throuth \'getMainStream(...)\' and with history', () => {
  const subscriber = jest.fn()
  const bus = getInstance(new Map([['event', 1]]))

  bus.emit({type: 'event', payload: 1})
  bus.emit({type: 'event', payload: 2})

  bus.getMainStream().subscribe(subscriber)

  expect(subscriber).toHaveBeenCalledTimes(1)
})

test('can not emit throuth \'select(...)\'', () => {
  const bus = getInstance()
  const observable = bus.select('event')

  expect(() => observable.emit({type: 'event', payload: 1})).toThrow()
})

test('can not emit throuth \'getMainStream()\'', () => {
  const bus = getInstance()
  const observable = bus.getMainStream()

  expect(() => observable.emit({type: 'event', payload: 1})).toThrow()
})

test('receive data on subscribe', done => {
  const bus = getInstance()

  const event = {type: 'event:type_1', payload: 1}

  bus
    .select('event:type_1')
    .subscribe(e => {
      expect(e).toEqual(event)
      done()
    })

  bus.emit(event)
})

test('receives data from several streams throuth \'getMainStream()\'', () => {
  const bus = getInstance()
  const subscriber = jest.fn();

  bus.getMainStream()
    .subscribe(subscriber)

  bus.emit({type: 'event:type_1', payload: 1})
  bus.emit({type: 'event:type_2', payload: 1})

  expect(subscriber).toHaveBeenCalledTimes(2)
})

test('receives data from several streams throuth \'getMainStream()\' after creation of new stream', () => {
  const bus = getInstance()
  const firstSubscriber = jest.fn();
  const secondSubscriber = jest.fn();

  bus.getMainStream()
    .subscribe(firstSubscriber)

  bus.emit({type: 'event:type_1', payload: 1})

  bus.getMainStream()
    .subscribe(secondSubscriber)

  bus.emit({type: 'event:type_2', payload: 1})

  expect(firstSubscriber).toHaveBeenCalledTimes(2);
  expect(secondSubscriber).toHaveBeenCalledTimes(1);
})

test('historySettings setup streams', () => {
  const bus = getInstance(new Map([
    ['event:type_2', 1],
    ['event:type_1', 1000]
  ]))

  expect(bus._streams.size).toBe(2)
})

test('with historySettings receives data from past on subscribe to \'getMainStream()\'', () => {
  const bus = getInstance(new Map([
    ['event:type_2', 2],
    ['event:type_1', 1]
  ]))

  const subscriber = jest.fn();

  bus.emit({type: 'event:type_1', payload: 1})
  bus.emit({type: 'event:type_1', payload: 2})

  bus.emit({type: 'event:type_2', payload: 1})
  bus.emit({type: 'event:type_2', payload: 2})
  bus.emit({type: 'event:type_2', payload: 3})

  bus.emit({type: 'event', payload: 1})

  bus
    .getMainStream()
    .subscribe(subscriber)

  expect(subscriber).toHaveBeenCalledTimes(3)
})

test('with historySettings receives data from past on subscribe to \'select()\'', done => {
  const bus = getInstance(new Map([
    ['event:type_2', 1]
  ]))

  const event = {type: 'event:type_2', payload: 1}

  bus.emit({type: 'event:type_2', payload: 1})

  bus
    .select('event:type_2')
    .subscribe(e => {
      expect(e).toEqual(event)
      done()
    })
})

test('streams can be merged', () => {
  const subscriber = jest.fn()
  const bus = getInstance()
  const TSAddStream = bus.select('event:type_1')
  const TSRemoveStream = bus.select('event:type_2')

  merge(
    TSAddStream,
    TSRemoveStream
  ).subscribe(subscriber)

  bus.emit({type: 'event:type_1', payload: 1})
  bus.emit({type: 'event:type_2', payload: 1})

  expect(subscriber).toHaveBeenCalledTimes(2)
})

test('we can take from history what we want', () => {
  const subscriber = jest.fn()
  const bus = getInstance(new Map([
    ['event', 2]
  ]))

  bus.emit({type: 'event', payload: 1})
  bus.emit({type: 'event', payload: 2})

  bus
    .select('event', 1)
    .subscribe(subscriber)

  expect(subscriber).toHaveBeenCalledTimes(1)
})

test('slicing of all history of ReplayStream throught \'select(...)\'', () => {
  const subscriber = jest.fn()
  const bus = getInstance(new Map([
    ['event', 2]
  ]))

  bus.emit({type: 'event', payload: 1})
  bus.emit({type: 'event', payload: 2})

  bus
    .select('event', 0)
    .subscribe(subscriber)

  expect(subscriber).not.toBeCalled()
})
