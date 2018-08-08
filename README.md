# rxjs-event-bus

## Что это такое?

Это шина событий, написанная на [rxjs](https://github.com/ReactiveX/rxjs)

## Зачем это?

Чтобы организовать связь между разными приложениями с помощью удобных в использовании потоков.
Также с этим подходом удобно поддерживать версионность и типы событий.

## Что внутри?

Внутри потоки, реализованные через [Subject](https://rxjs-dev.firebaseapp.com/api/index/class/Subject) и [ReplaySubject](https://rxjs-dev.firebaseapp.com/api/index/class/ReplaySubject), которые позволяют подписываться на события (`Subject`) и даже получать события из прошлого (`ReplaySubject`)!

## Как это работает?

Всё просто, смотри:

### Это просто подписчик, он не имеет к потокам никакого отношения. Тут должен быть твой код.
```javascript
const log = (() => {
  let counter = 0;
  return event =>
    console.log(`${++counter}: type: ${event.type}, payload: ${event.payload}`)
})()
```

### Вот так выглядит обычный pub/sub
```javascript
const bus = new Bus()

// ещё не подписались, это событие мы не получим
bus.emit({ type: 'first_event_name', payload: 1 })

bus
  .select('first_event_name')
  .subscribe(log)

bus
  .select('second_event_name')
  .subscribe(log)

// вот теперь мы готовы получать события 'first_event_name' и 'second_event_name'
bus.emit({ type: 'first_event_name', payload: 2 })
bus.emit({ type: 'second_event_name', payload: 1 })
bus.emit({ type: 'second_event_name', payload: 2 })

/*
console output:

1. type: first_event_name, payload: 2
2. type: second_event_name, payload: 1
3. type: second_event_name, payload: 2
*/
```

### Как работает главный поток (`mainStream`)
```javascript
const bus = new Bus()

// ещё не подписались, это событие мы не получим
bus.emit({ type: 'first_event_name', payload: 1 })

bus
  .getMainStream()
  .subscribe(log)

// вот теперь мы готовы получать события. ВСЕ события
bus.emit({ type: 'first_event_name', payload: 2 })
bus.emit({ type: 'second_event_name', payload: 1 })
bus.emit({ type: 'third_event_name', payload: 1 })

/*
console output:

1. type: first_event_name, payload: 2
2. type: second_event_name, payload: 1
3. type: third_event_name, payload: 1
*/
```

### А если я хочу получить события из прошлого? Сначала эмит, потом сабскрайб!
Для запоминания истории шину нужно сконфигурировать. Параметр конструктора - это `Map`, где ключи - имена событий, значения - глубина истории для этих событий.

```javascript
const historySettings = new Map([
  ['first_event_name', 2],
  ['second_event_name', 1]
])

const bus = new Bus(historySettings)

// ещё не подписались, но некоторые из этих событий останутся в истории
bus.emit({ type: 'first_event_name', payload: 1 })
bus.emit({ type: 'first_event_name', payload: 2 })
bus.emit({ type: 'first_event_name', payload: 3 })

bus.emit({ type: 'second_event_name', payload: 1 })
bus.emit({ type: 'second_event_name', payload: 2 })
bus.emit({ type: 'second_event_name', payload: 3 })


bus
  .select('first_event_name')
  .subscribe(log)

bus
  .select('second_event_name')
  .subscribe(log)

// вот теперь мы готовы получать события 'first_event_name' и 'second_event_name', но получим только после обработки событий "из прошлого"
bus.emit({ type: 'first_event_name', payload: 4 })
bus.emit({ type: 'second_event_name', payload: 4 })

/*
console output:

1. type: first_event_name, payload: 2
2. type: first_event_name, payload: 3
3. type: second_event_name, payload: 3
4. type: first_event_name, payload: 4
5. type: second_event_name, payload: 4
*/

```

### Так же работает и `mainStream`
```javascript
const historySettings = new Map([
  ['first_event_name', 2],
  ['second_event_name', 1]
])

const bus = new Bus(historySettings)

bus.emit({ type: 'first_event_name', payload: 1 })
bus.emit({ type: 'first_event_name', payload: 2 })
bus.emit({ type: 'first_event_name', payload: 3 })

bus.emit({ type: 'second_event_name', payload: 1 })
bus.emit({ type: 'second_event_name', payload: 2 })
bus.emit({ type: 'second_event_name', payload: 3 })


bus
  .getMainStream()
  .subscribe(log)

bus.emit({ type: 'first_event_name', payload: 4 })
bus.emit({ type: 'second_event_name', payload: 4 })

/*
console output:

1: type: first_event_name, payload: 2
2: type: first_event_name, payload: 3
3: type: second_event_name, payload: 3
4: type: first_event_name, payload: 4
5: type: second_event_name, payload: 4
*/

```

### Погоди, а если мне не нужны все события из прошлого?
Просто передавай в `select()` вторым аргументом, сколько именно событий из прошлого тебе нужно

```javascript
const historySettings = new Map([
  ['first_event_name', 2],
  ['second_event_name', 1],
])

const bus = new Bus(historySettings)

bus.emit({ type: 'first_event_name', payload: 1 })
bus.emit({ type: 'first_event_name', payload: 2 })
bus.emit({ type: 'first_event_name', payload: 3 })

bus.emit({ type: 'second_event_name', payload: 1 })

bus
  .select('first_event_name', 1)
  .subscribe(log)

bus
  .select('second_event_name', 0)
  .subscribe(log)

bus.emit({ type: 'first_event_name', payload: 4 })
bus.emit({ type: 'second_event_name', payload: 2 })

/*
console output:

1. type: first_event_name, payload: 3
2. type: first_event_name, payload: 4
3. type: second_event_name, payload: 2
*/

```

## Окей, а что мне делать, если я хочу поиграться с этим своими руками?

Клонируй и запускай тесты
```sh
$ npm i
$ npm t
```
