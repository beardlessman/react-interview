# Экзамен по TypeScript

Типичные вопросы с краткими ответами.

---

## База

### Что такое TypeScript?

TypeScript — надмножество JavaScript со статической типизацией. Добавляет типы, интерфейсы, generics, enums и компилируется в обычный JS. Код проверяется компилятором (`tsc`) до runtime.

### Зачем использовать TypeScript?

- Ловит ошибки на этапе компиляции.
- Улучшает DX: автодополнение, рефакторинг, документация через типы.
- Масштабирует большие кодовые базы.
- Контракты между модулями и командами без runtime-overhead (типы стираются).

### В чём разница между transpile и typecheck?

- **Typecheck** — проверка типов (`tsc --noEmit` или `tsc` с проверкой): ошибки `TS####`.
- **Transpile (emit)** — превращение TS/TSX в JS (и при необходимости `.d.ts`).

Можно typecheck без emit и emit без полной строгости (например, Babel/SWC только транспилируют, типы не проверяют).

### Чем TypeScript отличается от JavaScript?

TS = JS + система типов + некоторые синтаксические расширения (`interface`, `enum`, модификаторы доступа, `namespace`). В runtime поведение как у JS: типы стираются. Не весь TS-синтаксис валиден в чистом JS без транспиляции.

### Что такое any, unknown, never и void?

- `any` — отключает проверку типов; избегать.
- `unknown` — «любое значение», но перед использованием нужно сузить тип.
- `never` — значение, которое никогда не возникает (бесконечный цикл, `throw`, исчерпывающий `switch`).
- `void` — функция ничего осмысленного не возвращает (часто `undefined`).

### Какие есть примитивные типы в TypeScript?

`string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`. Также литеральные типы (`'admin'`, `42`, `true`) и `object` (непримитив; обычно предпочтительнее конкретные типы/interfaces).

### Как типизировать массивы и кортежи (tuples)?

```ts
const nums: number[] = [1, 2];
const nums2: Array<number> = [1, 2];
const pair: [string, number] = ['age', 30]; // tuple: фиксированная длина и типы позиций
const readonlyTuple: readonly [string, number] = ['id', 1];
```

Tuple — массив фиксированной структуры; обычный массив — однородный список переменной длины.

### В чём разница между enum и union типами?

```ts
enum Color { Red, Green }
type ColorU = 'red' | 'green';
```

- **Union** — лёгкий, стирается, отлично для строковых/числовых литералов.
- **Enum** — runtime-объект (кроме `const enum`), может быть numeric/string, иногда хуже tree-shaking.

Современная практика: чаще string unions + `as const`, enums — по необходимости.

### Что такое type assertion и чем отличается от casting?

В TS нет runtime casting как в C#/Java. Assertion (`as Type` или `<Type>value`) — «поверь мне, это Type». Не преобразует значение в runtime. Опасно, если ошиблись. Для DOM часто: `el as HTMLInputElement`. Двойной assertion (`as unknown as T`) обходит проверки — сигнал плохого дизайна типов.

### Что делает оператор satisfies?

`satisfies` проверяет, что значение соответствует типу, **не расширяя** вывод до этого типа (сохраняет литералы/`as const`-подобную точность).

```ts
const cfg = { theme: 'dark' } satisfies { theme: string };
// cfg.theme — 'dark', не string
```

### Что такое const assertions (`as const`)?

Делает литералы максимально узкими и свойства `readonly`:

```ts
const roles = ['admin', 'user'] as const; // readonly ['admin', 'user']
type Role = typeof roles[number]; // 'admin' | 'user'
```

Полезно для discriminated unions, конфигов и вывода union из массива.

### Какие важные опции есть в tsconfig?

- `strict` — пакет строгих проверок (`noImplicitAny`, `strictNullChecks`, …).
- `noImplicitAny` — запрет неявного `any`.
- `strictNullChecks` — `null`/`undefined` не в каждом типе.
- `noUncheckedIndexedAccess` — индекс → `T | undefined`.
- `exactOptionalPropertyTypes` — различать `?` и `| undefined`.
- `target` / `module` / `moduleResolution` — emit и резолв модулей.
- `skipLibCheck`, `esModuleInterop`, `isolatedModules`, `noEmit`.

### Что такое declaration files (`.d.ts`)?

Файлы только с типами (без runtime-кода). Описывают API JS-библиотек, ambient-глобалы, результаты `declaration: true`. Пример: `@types/node`. Модули: `declare module 'pkg'`.

### Как работает module resolution?

Алгоритм поиска модулей по `import`/`require`: `node16`/`nodenext`, `bundler`, устаревший `node`. Учитывает `paths`, `baseUrl`, `exports` в `package.json`, расширения файлов. `moduleResolution` должен соответствовать целевой среде (Node vs bundler).

---

## Типы и интерфейсы

### В чём разница между `type` и `interface`?

- `interface` — объектные формы, можно merge (declaration merging), `extends`.
- `type` — любой тип: unions, intersections, primitives, mapped, conditional; не merge.

Для объектов часто взаимозаменяемы. Unions/mapped → только `type`. Публичные API объектов — часто `interface`.

### Что такое extends для типов и интерфейсов?

```ts
interface A { x: number }
interface B extends A { y: string }

type C = { a: number }
type D = C & { b: string } // «расширение» через intersection
```

У generics: `T extends U` — ограничение (constraint). У conditional: `T extends U ? X : Y`.

### Что такое intersection и union типы?

- **Union** `A | B` — значение одного из вариантов.
- **Intersection** `A & B` — значение должно удовлетворять обоим.

```ts
type Id = string | number;
type Admin = User & { role: 'admin' };
```

### Что такое literal types?

Тип из конкретного значения: `'success'`, `42`, `true`. Часто в unions и discriminated unions. Сужают API сильнее, чем `string`/`number`.

### Что такое type narrowing?

Сужение типа после проверок: `typeof`, `===`, `in`, `instanceof`, truthiness, discriminant property, custom type guards. После `if` TS знает более узкий тип в ветке.

### Что такое type guards?

Проверка, после которой TS сужает тип. Встроенные: `typeof`, `instanceof`, `Array.isArray`. Пользовательские:

```ts
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

`asserts x is T` — assertion function: после вызова `x` считается `T` или throw.

### Как работают typeof, keyof, in и instanceof в типах?

- `typeof` (в типах) — тип значения: `type T = typeof value`.
- `keyof` — union ключей объекта: `keyof User`.
- `in` — mapped types / narrowing: `'x' in obj`.
- `instanceof` — runtime + narrowing по prototype chain класса.

### Что такое mapped types?

Тип, строящий новые свойства из ключей:

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
```

Модификаторы: `readonly`, `?`, `-readonly`, `-?`.

### Что такое conditional types?

```ts
type IsString<T> = T extends string ? true : false;
```

«Если T совместим с U → X, иначе Y». Дистрибутивны по naked type params на unions. Основа многих utility types.

### Что делает ключевое слово infer?

Выводит тип внутри conditional:

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;
```

### Что такое discriminated unions?

Union объектов с общим discriminant-полем (обычно literal):

```ts
type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; size: number };

function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'square': return s.size ** 2;
  }
}
```

Отличный паттерн для безопасного narrowing.

### Что такое index signatures и Record?

```ts
type Dict = { [key: string]: number };
type Dict2 = Record<string, number>;
```

Описывают объекты с динамическими ключами. С `noUncheckedIndexedAccess` доступ даёт `T | undefined`.

### Можно ли использовать interface для функции и callable?

Да:

```ts
interface Fn {
  (x: number): string;
  description: string;
}
```

Также call/construct signatures в types. Для простых функций чаще `type Fn = (x: number) => string`.

---

## Generics и утилиты

### Что такое generics и зачем они нужны?

Параметры типов для переиспользуемых функций/классов/типов без потери точности:

```ts
function identity<T>(x: T): T { return x; }
```

Один код — много типов; связь входа и выхода сохраняется.

### Что такое constraints у generics (`extends`)?

Ограничение параметра:

```ts
function keys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
```

`T extends keyof U`, `T extends (...args: any) => any` и т.д.

### Что делают Partial, Required и Readonly?

- `Partial<T>` — все свойства optional.
- `Required<T>` — все свойства обязательны.
- `Readonly<T>` — все свойства `readonly`.

### Что делают Pick, Omit и Record?

- `Pick<T, K>` — взять ключи `K` из `T`.
- `Omit<T, K>` — исключить ключи `K`.
- `Record<K, V>` — объект с ключами `K` и значениями `V`.

### Что делают Exclude, Extract и NonNullable?

- `Exclude<T, U>` — из union `T` убрать то, что assignable к `U`.
- `Extract<T, U>` — оставить только assignable к `U`.
- `NonNullable<T>` — убрать `null | undefined`.

### Что делают ReturnType, Parameters и Awaited?

- `ReturnType<F>` — тип возврата функции.
- `Parameters<F>` — tuple типов аргументов.
- `Awaited<T>` — рекурсивно разворачивает `Promise` (как `await`).

Также: `ConstructorParameters`, `InstanceType`.

### Как написать свой utility type на примере DeepReadonly?

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};
```

Учёт функций/массивов усложняет реализацию — на интервью важен принцип mapped + conditional + recursion.

### Что такое default type parameters?

```ts
type ApiResponse<T = unknown> = { data: T; ok: boolean };
function createPair<T = string>(a: T, b: T) { return [a, b] as const; }
```

Если аргумент не выведен/не указан — берётся default.

### В чём разница между generic constraint и conditional type?

- Constraint (`T extends U`) — запрещает «неподходящий» `T` на входе.
- Conditional (`T extends U ? X : Y`) — ветвление результата в зависимости от `T`.

Часто комбинируют: constraint на входе + conditional внутри типа.

### Что такое variance (ко-/контра-/инвариантность) на уровне интуиции?

Для function types: параметры контравариантны, возврат ковариантен (упрощённо). Поэтому `(x: Animal) => void` не всегда совместим с `(x: Dog) => void`. На практике: осторожно с колбэками и mutable структурами (`Array` инвариантен относительно записи).

### Как типизировать асинхронные функции?

```ts
async function load(): Promise<User> { ... }
type User = Awaited<ReturnType<typeof load>>;
```

Возврат `async` всегда `Promise<...>`. Ошибки через `unknown` в `catch` (strict).

### Что такое template literal types?

Строковые типы из шаблонов:

```ts
type EventName = `on${Capitalize<'click' | 'focus'>}`; // 'onClick' | 'onFocus'
```

Полезны для typed routes, event names, CSS-in-TS.

---

## Классы и ООП

### Как объявить класс с типами полей и конструктором?

```ts
class User {
  constructor(
    public readonly id: number,
    private name: string,
  ) {}
  greet(): string {
    return `Hi, ${this.name}`;
  }
}
```

Parameter properties (`public`/`private`/`protected`/`readonly` в конструкторе) создают и инициализируют поля.

### Какие есть access modifiers?

- `public` — доступно везде (по умолчанию).
- `private` — только внутри класса (compile-time; в emit всё равно доступно).
- `protected` — класс + наследники.
- `#field` — настоящая JS private field (runtime-инкапсуляция).

### Что такое abstract classes?

Класс, который нельзя инстанцировать; может иметь abstract-методы без реализации. Наследники обязаны реализовать abstract-члены. Альтернатива — интерфейсы + композиция, если не нужна общая реализация.

### Что делает implements?

Класс обещает соответствовать типу/интерфейсу:

```ts
interface Printable { print(): void }
class Doc implements Printable {
  print() { console.log('doc'); }
}
```

Проверяет публичную форму; не копирует типы private-полей интерфейса (у interface их и нет).

### В чём разница между implements и extends?

- `extends` — наследование реализации (класс/abstract class).
- `implements` — контракт формы (interface/type), без наследования кода.

Класс может `extends` один класс и `implements` несколько интерфейсов.

### Что такое this-типы в методах?

```ts
class Builder {
  setName(this: Builder, name: string) { ... }
}
```

Аннотация `this` проверяет контекст вызова. Также polymorphic `this` для fluent API:

```ts
clone(): this { return Object.assign(Object.create(Object.getPrototypeOf(this)), this); }
```

### Как работают overload signatures у методов/функций?

Сначала overload-сигнатуры, затем одна реализация:

```ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number): string | number {
  return typeof x === 'string' ? Number(x) : String(x);
}
```

Вызывающий видит только overloads; реализация должна покрывать все случаи.

### Можно ли использовать generics в классах?

Да:

```ts
class Box<T> {
  constructor(public value: T) {}
}
const b = new Box<number>(1);
```

Static-члены класса не могут ссылаться на `T` экземпляра.

---

## Продвинутые темы

### Namespace vs module — в чём разница?

- **ES modules** (`import`/`export`) — современный стандарт, один файл = модуль.
- **`namespace`** — устаревший/legacy способ группировки (раньше `internal modules`); всё ещё встречается в `.d.ts` и старом коде.

Предпочтение: ES modules. `namespace` + merging иногда для типов библиотек.

### Что такое ambient declarations и `declare`?

`declare` говорит компилятору: «символ существует в runtime, не emit’и его». Используется в `.d.ts`, для глобалов (`declare const ENV: string`), модулей без типов, `declare global { ... }`.

### Assertion functions — что это?

```ts
function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg);
}
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== 'string') throw new Error();
}
```

После вызова TS сужает типы в последующем коде.

### Как типизировать React-компоненты (кратко)?

```tsx
type Props = { title: string; onClose?: () => void };
function Modal({ title, onClose }: Props) { ... }

// события
function onChange(e: React.ChangeEvent<HTMLInputElement>) { ... }
function onClick(e: React.MouseEvent<HTMLButtonElement>) { ... }
```

`React.FC` опционален; явные `Props` предпочтительнее. Children: `children?: React.ReactNode`.

### Что такое structural typing (duck typing) в TS?

Совместимость по структуре, не по имени. Если объект имеет нужные поля — он assignable, даже без явного `implements`. Отличие от nominal typing (Java/C#).

### Что такое excess property checks?

При присвоении **object literal** напрямую типу лишние свойства запрещены. После записи в переменную проверка слабее (structural). Частая «ловушка» новичков.

### Частые pitfalls TypeScript?

- Злоупотребление `any` / двойным `as`.
- Забыть `strictNullChecks`.
- Enum vs union путаница.
- Мутация `readonly` через aliases.
- Неверные `key`/`index` типы.
- Путать type erasure: типы не защищают в runtime (нужна валидация Zod и т.п. на границах).
- `interface` merging неожиданно меняет тип.
- `enum` numeric pitfalls (обратный mapping).

### Как работает declaration merging?

Одноимённые `interface` (и некоторые `namespace`) объединяются:

```ts
interface User { id: number }
interface User { name: string }
// User = { id: number; name: string }
```

У `type` aliases merging нет. Полезно для расширения библиотечных типов, опасно при случайном дублировании имён.

### Что такое branded / opaque types?

Техника nominal-подобной типизации через пересечение с уникальным brand:

```ts
type UserId = string & { readonly __brand: 'UserId' };
```

Нельзя случайно передать обычный `string` туда, где нужен `UserId`, без явного brand.

### Как типизировать rest/spread и деструктуризацию?

```ts
function f({ a, ...rest }: { a: number; b: string; c: boolean }) {
  // rest: { b: string; c: boolean }
}
const arr = [1, 2, 3] as const;
const [head, ...tail] = arr;
```

Generics + `Omit` часто нужны для точных props с `...rest` в React.

### Что такое `isolatedModules` и зачем он?

Опция для транспиляторов «файл за файлом» (Babel/SWC/esbuild): запрещает конструкции, требующие кросс-файлового анализа (например, `export { type T }` без `type`, re-export type-only в старых схемах). Важно в современных бандлерах; пишите `import type` / `export type`.

### Как отличить type-only import?

```ts
import type { User } from './user';
import { type User, createUser } from './user';
```

Гарантирует erase на emit, помогает `verbatimModuleSyntax` / `isolatedModules`, не тянет runtime-зависимость только ради типов.
