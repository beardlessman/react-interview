# TypeScript Exam

Typical questions with short answers.

---

## Basics

### What is TypeScript?

TypeScript is a JavaScript superset with static typing. It adds types, interfaces, generics, enums, and compiles to plain JS. The compiler (`tsc`) checks code before runtime.

### Why use TypeScript?

- Catches errors at compile time.
- Improves DX: autocomplete, refactoring, documentation via types.
- Scales large codebases.
- Contracts between modules/teams with no runtime overhead (types are erased).

### What is the difference between transpile and typecheck?

- **Typecheck** — type verification (`tsc --noEmit` or `tsc` with checking): `TS####` errors.
- **Transpile (emit)** — turning TS/TSX into JS (and optionally `.d.ts`).

You can typecheck without emit, and emit without full strictness (e.g. Babel/SWC only transpile and do not check types).

### How does TypeScript differ from JavaScript?

TS = JS + a type system + some syntax extensions (`interface`, `enum`, access modifiers, `namespace`). At runtime it behaves like JS: types are erased. Not all TS syntax is valid in plain JS without transpilation.

### What are any, unknown, never, and void?

- `any` — disables type checking; avoid it.
- `unknown` — “any value,” but you must narrow before use.
- `never` — a value that never occurs (infinite loop, `throw`, exhaustive `switch`).
- `void` — a function returns nothing meaningful (often `undefined`).

### What are the primitive types in TypeScript?

`string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`. Also literal types (`'admin'`, `42`, `true`) and `object` (non-primitive; prefer concrete types/interfaces).

### How do you type arrays and tuples?

```ts
const nums: number[] = [1, 2];
const nums2: Array<number> = [1, 2];
const pair: [string, number] = ['age', 30]; // tuple: fixed length and position types
const readonlyTuple: readonly [string, number] = ['id', 1];
```

A tuple is a fixed-shape array; a regular array is a homogeneous list of variable length.

### What is the difference between enums and union types?

```ts
enum Color { Red, Green }
type ColorU = 'red' | 'green';
```

- **Union** — lightweight, erased, great for string/number literals.
- **Enum** — a runtime object (except `const enum`), can be numeric/string, sometimes worse for tree-shaking.

Modern practice: prefer string unions + `as const`; use enums when needed.

### What is a type assertion and how does it differ from casting?

TS has no runtime casting like C#/Java. An assertion (`as Type` or `<Type>value`) means “trust me, this is Type.” It does not convert the value at runtime. Dangerous if wrong. Common for DOM: `el as HTMLInputElement`. Double assertion (`as unknown as T`) bypasses checks — a sign of poor type design.

### What does the satisfies operator do?

`satisfies` checks that a value matches a type **without widening** inference to that type (keeps literals / `as const`-like precision).

```ts
const cfg = { theme: 'dark' } satisfies { theme: string };
// cfg.theme is 'dark', not string
```

### What are const assertions (`as const`)?

They make literals as narrow as possible and properties `readonly`:

```ts
const roles = ['admin', 'user'] as const; // readonly ['admin', 'user']
type Role = typeof roles[number]; // 'admin' | 'user'
```

Useful for discriminated unions, configs, and deriving a union from an array.

### What are important tsconfig options?

- `strict` — bundle of strict checks (`noImplicitAny`, `strictNullChecks`, …).
- `noImplicitAny` — bans implicit `any`.
- `strictNullChecks` — `null`/`undefined` are not in every type.
- `noUncheckedIndexedAccess` — index access → `T | undefined`.
- `exactOptionalPropertyTypes` — distinguishes `?` from `| undefined`.
- `target` / `module` / `moduleResolution` — emit and module resolution.
- `skipLibCheck`, `esModuleInterop`, `isolatedModules`, `noEmit`.

### What are declaration files (`.d.ts`)?

Type-only files (no runtime code). They describe JS library APIs, ambient globals, and output from `declaration: true`. Example: `@types/node`. Modules: `declare module 'pkg'`.

### How does module resolution work?

The algorithm for finding modules from `import`/`require`: `node16`/`nodenext`, `bundler`, legacy `node`. Considers `paths`, `baseUrl`, `exports` in `package.json`, file extensions. `moduleResolution` should match the target environment (Node vs bundler).

---

## Types and interfaces

### What is the difference between `type` and `interface`?

- `interface` — object shapes, can merge (declaration merging), `extends`.
- `type` — any type: unions, intersections, primitives, mapped, conditional; no merging.

For objects they are often interchangeable. Unions/mapped → `type` only. Public object APIs often use `interface`.

### What does extends mean for types and interfaces?

```ts
interface A { x: number }
interface B extends A { y: string }

type C = { a: number }
type D = C & { b: string } // “extension” via intersection
```

With generics: `T extends U` is a constraint. With conditionals: `T extends U ? X : Y`.

### What are intersection and union types?

- **Union** `A | B` — a value of one of the variants.
- **Intersection** `A & B` — a value must satisfy both.

```ts
type Id = string | number;
type Admin = User & { role: 'admin' };
```

### What are literal types?

A type from a concrete value: `'success'`, `42`, `true`. Common in unions and discriminated unions. Narrows APIs more than `string`/`number`.

### What is type narrowing?

Narrowing a type after checks: `typeof`, `===`, `in`, `instanceof`, truthiness, discriminant property, custom type guards. After an `if`, TS knows a narrower type in that branch.

### What are type guards?

A check after which TS narrows the type. Built-in: `typeof`, `instanceof`, `Array.isArray`. Custom:

```ts
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

`asserts x is T` — assertion function: after the call, `x` is treated as `T` or it throws.

### How do typeof, keyof, in, and instanceof work in types?

- `typeof` (in types) — type of a value: `type T = typeof value`.
- `keyof` — union of object keys: `keyof User`.
- `in` — mapped types / narrowing: `'x' in obj`.
- `instanceof` — runtime + narrowing via a class prototype chain.

### What are mapped types?

A type that builds new properties from keys:

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };
```

Modifiers: `readonly`, `?`, `-readonly`, `-?`.

### What are conditional types?

```ts
type IsString<T> = T extends string ? true : false;
```

“If T is assignable to U → X, else Y.” Distributive over naked type params on unions. The basis of many utility types.

### What does the infer keyword do?

It extracts a type inside a conditional:

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;
```

### What are discriminated unions?

A union of objects with a shared discriminant field (usually a literal):

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

An excellent pattern for safe narrowing.

### What are index signatures and Record?

```ts
type Dict = { [key: string]: number };
type Dict2 = Record<string, number>;
```

They describe objects with dynamic keys. With `noUncheckedIndexedAccess`, access yields `T | undefined`.

### Can an interface describe a function / callable?

Yes:

```ts
interface Fn {
  (x: number): string;
  description: string;
}
```

Also call/construct signatures in types. For simple functions, prefer `type Fn = (x: number) => string`.

---

## Generics and utility types

### What are generics and why use them?

Type parameters for reusable functions/classes/types without losing precision:

```ts
function identity<T>(x: T): T { return x; }
```

One implementation, many types; input–output relationships are preserved.

### What are generic constraints (`extends`)?

A bound on the parameter:

```ts
function keys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
```

Examples: `T extends keyof U`, `T extends (...args: any) => any`, etc.

### What do Partial, Required, and Readonly do?

- `Partial<T>` — all properties optional.
- `Required<T>` — all properties required.
- `Readonly<T>` — all properties `readonly`.

### What do Pick, Omit, and Record do?

- `Pick<T, K>` — keep keys `K` from `T`.
- `Omit<T, K>` — remove keys `K`.
- `Record<K, V>` — object with keys `K` and values `V`.

### What do Exclude, Extract, and NonNullable do?

- `Exclude<T, U>` — from union `T`, remove members assignable to `U`.
- `Extract<T, U>` — keep only members assignable to `U`.
- `NonNullable<T>` — remove `null | undefined`.

### What do ReturnType, Parameters, and Awaited do?

- `ReturnType<F>` — function return type.
- `Parameters<F>` — tuple of argument types.
- `Awaited<T>` — recursively unwraps `Promise` (like `await`).

Also: `ConstructorParameters`, `InstanceType`.

### How would you write a custom utility type, e.g. DeepReadonly?

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};
```

Handling functions/arrays makes it harder — in interviews the point is mapped + conditional + recursion.

### What are default type parameters?

```ts
type ApiResponse<T = unknown> = { data: T; ok: boolean };
function createPair<T = string>(a: T, b: T) { return [a, b] as const; }
```

If the argument is not inferred/specified, the default is used.

### What is the difference between a generic constraint and a conditional type?

- Constraint (`T extends U`) — rejects an unsuitable `T` at the input.
- Conditional (`T extends U ? X : Y`) — branches the result based on `T`.

Often combined: constraint on input + conditional inside the type.

### What is variance (co-/contra-/invariance) at an intuition level?

For function types: parameters are contravariant, returns are covariant (simplified). So `(x: Animal) => void` is not always compatible with `(x: Dog) => void`. In practice: be careful with callbacks and mutable structures (`Array` is invariant for writing).

### How do you type async functions?

```ts
async function load(): Promise<User> { ... }
type User = Awaited<ReturnType<typeof load>>;
```

An `async` return is always `Promise<...>`. In `catch`, type errors as `unknown` (strict).

### What are template literal types?

String types built from templates:

```ts
type EventName = `on${Capitalize<'click' | 'focus'>}`; // 'onClick' | 'onFocus'
```

Useful for typed routes, event names, CSS-in-TS.

---

## Classes and OOP

### How do you declare a class with typed fields and a constructor?

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

Parameter properties (`public`/`private`/`protected`/`readonly` in the constructor) create and initialize fields.

### What access modifiers exist?

- `public` — accessible everywhere (default).
- `private` — only inside the class (compile-time; still accessible in emit).
- `protected` — class + subclasses.
- `#field` — real JS private field (runtime encapsulation).

### What are abstract classes?

A class that cannot be instantiated; may have abstract methods without a body. Subclasses must implement abstract members. Alternative: interfaces + composition when shared implementation is not needed.

### What does implements do?

The class promises to match a type/interface:

```ts
interface Printable { print(): void }
class Doc implements Printable {
  print() { console.log('doc'); }
}
```

It checks the public shape; it does not inherit implementation.

### What is the difference between implements and extends?

- `extends` — inherit implementation (class/abstract class).
- `implements` — shape contract (interface/type), no code inheritance.

A class can `extends` one class and `implements` multiple interfaces.

### What are this types in methods?

```ts
class Builder {
  setName(this: Builder, name: string) { ... }
}
```

A `this` annotation checks the call context. Also polymorphic `this` for fluent APIs:

```ts
clone(): this { return Object.assign(Object.create(Object.getPrototypeOf(this)), this); }
```

### How do overload signatures work for methods/functions?

List overload signatures first, then one implementation:

```ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number): string | number {
  return typeof x === 'string' ? Number(x) : String(x);
}
```

Callers see only the overloads; the implementation must cover all cases.

### Can classes use generics?

Yes:

```ts
class Box<T> {
  constructor(public value: T) {}
}
const b = new Box<number>(1);
```

Static class members cannot refer to the instance type parameter `T`.

---

## Advanced topics

### Namespace vs module — what is the difference?

- **ES modules** (`import`/`export`) — modern standard; one file = one module.
- **`namespace`** — legacy grouping (formerly “internal modules”); still seen in `.d.ts` and old code.

Prefer ES modules. `namespace` + merging sometimes for library typing.

### What are ambient declarations and `declare`?

`declare` tells the compiler: “this symbol exists at runtime; do not emit it.” Used in `.d.ts`, for globals (`declare const ENV: string`), untyped modules, `declare global { ... }`.

### What are assertion functions?

```ts
function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg);
}
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== 'string') throw new Error();
}
```

After the call, TS narrows types in the following code.

### How do you type React components (briefly)?

```tsx
type Props = { title: string; onClose?: () => void };
function Modal({ title, onClose }: Props) { ... }

// events
function onChange(e: React.ChangeEvent<HTMLInputElement>) { ... }
function onClick(e: React.MouseEvent<HTMLButtonElement>) { ... }
```

`React.FC` is optional; explicit `Props` is preferred. Children: `children?: React.ReactNode`.

### What is structural typing (duck typing) in TS?

Compatibility by shape, not by name. If an object has the required fields, it is assignable even without explicit `implements`. Differs from nominal typing (Java/C#).

### What are excess property checks?

When an **object literal** is assigned directly to a type, extra properties are rejected. After assigning to a variable first, checking is weaker (structural). A common beginner trap.

### Common TypeScript pitfalls?

- Overusing `any` / double `as`.
- Forgetting `strictNullChecks`.
- Enum vs union confusion.
- Mutating `readonly` via aliases.
- Wrong `key`/`index` types.
- Confusing type erasure: types do not protect at runtime (validate with Zod etc. at boundaries).
- Unexpected `interface` merging changing a type.
- Numeric `enum` pitfalls (reverse mapping).

### How does declaration merging work?

Same-named `interface`s (and some `namespace`s) merge:

```ts
interface User { id: number }
interface User { name: string }
// User = { id: number; name: string }
```

`type` aliases do not merge. Useful for extending library types; risky with accidental name clashes.

### What are branded / opaque types?

A nominal-like typing technique via intersection with a unique brand:

```ts
type UserId = string & { readonly __brand: 'UserId' };
```

You cannot accidentally pass a plain `string` where `UserId` is required without an explicit brand.

### How do you type rest/spread and destructuring?

```ts
function f({ a, ...rest }: { a: number; b: string; c: boolean }) {
  // rest: { b: string; c: boolean }
}
const arr = [1, 2, 3] as const;
const [head, ...tail] = arr;
```

Generics + `Omit` are often needed for precise props with `...rest` in React.

### What is `isolatedModules` and why does it matter?

An option for per-file transpilers (Babel/SWC/esbuild): forbids constructs that need cross-file analysis. Important with modern bundlers; write `import type` / `export type`.

### How do you distinguish a type-only import?

```ts
import type { User } from './user';
import { type User, createUser } from './user';
```

Guarantees erase on emit, helps `verbatimModuleSyntax` / `isolatedModules`, and avoids pulling a runtime dependency only for types.
