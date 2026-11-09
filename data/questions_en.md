# JavaScript Exam

Typical questions with short answers.

---

## Syntax and basics

### Ways to create (declare) a variable? Difference between `var`, `let`, and `const`?

- `var` — function scope, hoisted, can be redeclared.
- `let` — block scope, TDZ until declaration, cannot be redeclared in the same scope.
- `const` — like `let`, but the binding cannot be reassigned (object contents can still be mutated).

```js
var a = 1;
let b = 2;
const c = 3;
```

### Explain the concept of “hoisting”

Declarations are “lifted” to the top of the scope. For `var`, the declaration is hoisted with the value `undefined`. `let`/`const` are also hoisted, but TDZ applies until the declaration line — accessing them throws an error. A function declaration is hoisted entirely.

### List all data types in JavaScript

Primitives: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.  
Non-primitive: `object` (including arrays, functions, dates, etc.).

### How do you find out a variable’s type? What does `typeof` return?

`typeof value` returns a string: `"string"`, `"number"`, `"boolean"`, `"undefined"`, `"object"`, `"function"`, `"symbol"`, `"bigint"`.

### What does `typeof null` return?

`"object"` — a historical language quirk. Check with: `value === null`.

### What is `NaN`? What type is it? How do you check equality with `NaN`?

`NaN` — “not a number”, type `number`. `NaN === NaN` → `false`. Checks: `Number.isNaN(x)` or `Object.is(x, NaN)`.

### Which unary operators do you know?

`+`, `-`, `!`, `typeof`, `void`, `delete`, `++`, `--`, `~`, `await`.

### Which binary operators do you know?

Arithmetic: `+ - * / % **`  
Assignment: `= += -= *= ...`  
Comparison: `== === != !== < > <= >=`  
Logic: `&& || ??`  
Bitwise: `& | ^ << >> >>>`  
Other: `in`, `instanceof`.

### Ternary operator, syntax?

```js
condition ? valueIfTrue : valueIfFalse
```

### Type conversion. Strings!

`String(x)`, `x.toString()`, concatenation `"" + x`, template `` `${x}` ``.

### Type conversion. Numbers!

`Number(x)`, `+x`, `parseInt(x, 10)`, `parseFloat(x)`, `x * 1`. Empty string → `0`, non-numeric → `NaN`.

### Type conversion. Boolean!

`Boolean(x)`, `!!x`. Falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy.

### Which comparison operators do you know?

`==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`.

### What do comparison operators return?

Always a `boolean`: `true` or `false`.

### Comparing different types?

With `==`, types are coerced (often to a number). With `<`/`>`, ToPrimitive/ToNumber may also apply. It’s more reliable to compare the same types with `===`.

### What’s the difference between `==` and `===`?

`==` — loose equality, with type coercion. `===` — strict equality, without coercion (plus `Object.is` distinguishes `-0` and `NaN`).

### How do you avoid comparison problems?

Use `===` / `!==`, coerce types explicitly, for `NaN` use `Number.isNaN`, for objects compare by value separately.

### `if else` statement?

```js
if (condition) {
  // ...
} else if (another) {
  // ...
} else {
  // ...
}
```

The condition is coerced to boolean.

### Which logical operators do you know?

`&&`, `||`, `!`, `??` (nullish coalescing).

### What’s special about each logical operator?

- `&&` — returns the first falsy or the last operand.
- `||` — returns the first truthy or the last operand.
- `!` — logical negation, always boolean.
- `??` — takes the right operand only if the left is `null` or `undefined`.

### What do logical operators return?

`&&` and `||` / `??` return **one of the operands**, not necessarily a boolean. `!` returns a boolean.

### What is the nullish coalescing operator?

`??` — `a ?? b`: if `a` is `null`/`undefined`, the result is `b`, otherwise `a`. Unlike `||`, it does not trigger on `0`, `""`, `false`.

### What is `switch` for?

Choosing a branch by an expression’s value instead of a long `if/else` chain.

### Keywords in `switch`

- `switch` — the expression to compare
- `case` — a variant
- `break` — exit (without it — fall-through)
- `default` — the default branch

### How does comparison work in `switch`?

Strict comparison (`===`) of the `switch` value with the `case` values.

---

## Functions

### What are functions for?

To reuse code, split a program into parts, accept arguments and return a result.

### Ways to declare a function? What’s special about each?

1. **Function declaration** — hoisted entirely.  
2. **Function expression** — `const f = function() {}` — cannot be called before assignment.  
3. **Arrow function** — `() => {}` — no own `this`/`arguments`.  
4. **Method in object** — `obj.method()`.  
5. **Constructor / class method**.

### How do you pass parameters to a function?

In parentheses at declaration and at the call: `function f(a, b) {}` → `f(1, 2)`. There are default params and rest `...args`.

### What can be passed as a parameter?

Any value: primitives, objects, arrays, functions, `undefined`.

### How do you return a value from a function?

`return value;`. Without `return`, `undefined` is returned.

### What are arrow functions and how do they differ?

Short syntax, lexical `this`, no own `arguments`, cannot be used as a `constructor`, no `prototype`.

### What is recursion? When is it used? Example structure?

A function calls itself. Needed for trees, factorial, traversing nested objects. Example structures: DOM, file tree, nested JSON.

### Variable scope?

Where a variable is visible: global, function (`var`), block (`let`/`const`). An inner scope sees the outer one (scope chain).

### What are closures? Why are they important? Example?

A function “remembers” outer-scope variables after that scope has finished. Important for callbacks, modules, currying, `once`/`memoize`.

```js
function makeCounter() {
  let n = 0;
  return () => ++n;
}
```

### What is an IIFE? When is it used?

Immediately Invoked Function Expression: `(function(){ ... })()`. Previously — its own scope / a module without polluting global.

### What data type is a function?

`typeof fn === "function"` (a subtype of objects).

### Can you assign properties to a function? `name`? `length`?

Yes, a function is an object. `name` — the name, `length` — the number of declared parameters (before rest/defaults in the typical case). You can also attach your own properties.

### What is `setTimeout`? What is it for?

Schedules a callback once after N ms (in the event loop). `const id = setTimeout(fn, 1000)`.

### What is `setInterval`? What is it for?

Repeats a callback every N ms. `setInterval(fn, 1000)`, stopped with `clearInterval`.

### OOP principles

Encapsulation, inheritance, polymorphism (sometimes abstraction). In JS — prototypes / `class`.

### Functional programming principles

Pure functions, immutability, higher-order functions, composition, avoid side effects.

### Tell me about `this` and context

`this` depends on how it’s called: object method → the object; regular call → `undefined`/global; `new` → new instance; `call`/`apply`/`bind` — explicitly; arrow — lexical `this`.

### `call`, `apply`, `bind` — what for?

To set `this` explicitly.  
`call(thisArg, a, b)` — arguments as a list.  
`apply(thisArg, [a, b])` — as an array.  
`bind(thisArg, ...)` — a new function with bound `this` (and partially bound arguments).

### Arrow function specifics (`this`, `arguments`)? How do you change the context?

They don’t create their own `this`/`arguments` — they take them from the outer function. `call`/`apply`/`bind` **do not change** an arrow’s `this`. To “change the context” — wrap in a regular function or don’t use an arrow.

---

## Numbers, strings

### Number types in JS?

`number` (IEEE-754 double) and `bigint`.

### Specifics of each type?

`number` — up to `Number.MAX_SAFE_INTEGER`, has `NaN`/`Infinity`, imprecise fractions (`0.1+0.2`). `bigint` — integers of arbitrary length, suffix `n`, cannot be mixed with `number` in arithmetic without conversion.

### What is `NaN`? What data type?

“Not a Number”, type `number`.

### How do you get `NaN`?

`Number("abc")`, `0/0`, `Math.sqrt(-1)`, `parseInt("x")`.

### What is `Infinity`? What type?

Infinity, type `number`. Example: `1/0`.

### Checking for `NaN` and `Infinity`?

`Number.isNaN(x)`, `Number.isFinite(x)`, there is no `Number.isInfinity` — use `x === Infinity` or `!Number.isFinite(x) && typeof x === "number"`.

### How does `parseInt()` work?

Reads an integer from the start of a string, stops at the first unsuitable character. The second argument is the radix (`parseInt("10", 10)`).

### How does `parseFloat()` work?

Reads a floating-point number from the start of a string.

### What is `Math`?

A built-in object with mathematical constants and functions (`PI`, `sqrt`, `abs`…).

### What are `Math.max` / `Math.min` for?

Maximum / minimum of the arguments. For an array: `Math.max(...arr)`.

### What is `Math.pow` for?

Exponentiation: `Math.pow(2, 10)` ≡ `2 ** 10`.

### `Math.floor`, `ceil`, `round`, `trunc`?

- `floor` — down  
- `ceil` — up  
- `round` — to nearest  
- `trunc` — drop the fractional part  

### How do you declare a `BigInt`?

```js
const x = 10n;
const y = BigInt(10);
```

### How do you create a string?

`'...'`, `"..."`, `` `...` ``, `String(x)`, `new String(x)` (object — better not to use).

### What’s special about backticks?

Template strings: interpolation `${expr}`, multiline support.

### How do you get a string’s length?

`str.length` (in UTF-16 code units).

### How do you access a character in a string?

`str[i]` or `str.charAt(i)`. Strings are immutable.

### What are `.toLowerCase()` / `.toUpperCase()` for?

Character case. They return a **new** string.

### `slice()` — what for? Parameters? What does it return?

Cuts out a substring. `slice(start, end?)` — `end` is exclusive. Returns a new string. Supports negative indexes.

### `substring`, `substr`, `indexOf`, `lastIndexOf`, `includes`, `startsWith`, `endsWith`, `trim`

| Method | Purpose | Return |
| --- | --- | --- |
| `substring(a, b)` | substring between indexes (negatives → 0) | string |
| `substr(start, length)` | deprecated; start + length | string |
| `indexOf(sub, from?)` | index of first occurrence | number / -1 |
| `lastIndexOf(sub)` | index of last occurrence | number / -1 |
| `includes(sub)` | whether substring exists | boolean |
| `startsWith` / `endsWith` | starts / ends with | boolean |
| `trim()` | strip whitespace from edges | new string |

### `repeat()`, `split()`

- `repeat(n)` — repeat the string n times.  
- `split(separator?, limit?)` — split into an array of strings.

### How are strings compared?

By Unicode code units (lexicographically). `"a" < "b"`. For locale — `localeCompare`.

---

## Loops

### What are loops for?

To repeat code while a condition is true / until elements have been traversed.

### What kinds of loops are there in JavaScript?

`for`, `while`, `do...while`, `for...of`, `for...in`. Plus array methods (`forEach`, `map`…).

### `for` syntax? What's in the parentheses?

```js
for (initialization; condition; step) { body }
```

Initialization once, condition before each iteration, step after the body.

### Can you omit parts of `for`? What if you don't specify a condition?

Yes: `for (;;)` — an infinite loop (the condition is treated as `true`).

### `while` syntax? How does it differ from `for`?

```js
while (condition) { body }
```

No built-in initialization/step — you manage those yourself.

### `do...while` syntax? How does it differ from `while`?

```js
do { body } while (condition);
```

First the body, then the condition check.

### In what case will `do...while` execute the body at least once?

Always — even if the condition is immediately false.

### What is an infinite loop? How do you get one? How do you stop it?

A loop with no exit: `while(true)`, a forgotten increment. Stop it: `break`, change the condition, `return`, in the browser — kill the tab; in Node — interrupt the process.

### What is `break` for?

Immediately exit a loop / `switch`.

### What is `continue` for? How does it differ from `break`?

Skip the rest of the current iteration and go to the next one. `break` terminates the entire loop.

### Labels? `break label` / `continue label`?

A name before a loop: `outer: for (...)`. `break outer` exits the outer loop, `continue outer` goes to the next iteration of the outer one.

### How do you iterate over an array with a `for` loop?

```js
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### How do you iterate over an array / object / string with `for...of`?

```js
for (const item of arr) {}
for (const ch of str) {}
for (const value of Object.values(obj)) {}
```

### What does `for...of` iterate over? Can it be used with a plain object?

Iterable values (`Array`, `String`, `Map`, `Set`…). A plain object is **not** iterable — you'll get a TypeError (need `Object.keys` / `entries`).

### How do you iterate over object keys with `for...in`?

```js
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}
```

### Difference between `for...of` and `for...in`?

`for...of` — values of an iterable. `for...in` — enumerable keys of an object (including inherited ones).

### Pitfalls of `for...in` with arrays and objects?

For arrays it gives string indices and may pick up extra properties. For objects — inherited keys. Better not to use `for...in` for arrays.

### How does `for...in` behave with inherited properties?

It enumerates those too (enumerable ones in the prototype chain). Filter with `Object.hasOwn` / `hasOwnProperty`.

### What are iterators? Connection to `for...of`?

An object with `next()` → `{ value, done }`. `for...of` invokes the iterator via `Symbol.iterator`.

### Can you change the loop variable inside the body?

Yes, but it's easy to skip elements, get an infinite loop, or create confusion. Better to change it only in the `for` header.

### How do you correctly exit nested loops?

A label + `break label`, a flag, `return` from a function, extract into a function and exit with `return`.

### How does a loop differ from recursion? When is each preferable?

A loop — explicit iteration, usually O(1) extra memory. Recursion — natural for trees/graphs, but risk of stack overflow. For linear tasks, a loop is more often preferred.

### How does a loop work with a sparse array (holes)?

Index-based `for` will see `undefined` in the holes. `for...of` will also yield `undefined`. `forEach`/`map` **skip** holes.

### How do you iterate over `Map` and `Set` with loops?

```js
for (const [k, v] of map) {}
for (const v of set) {}
map.forEach((v, k) => {});
```

---

## Objects

### What is an object? Why do you need it?

A collection of properties “key → value”. For describing entities, dictionaries, settings, modules.

### What can be a key / value?

Key: a string or `symbol` (numbers are coerced to string). Value: anything.

### How do you access a property?

`obj.key` or `obj["key"]`. For computed names — bracket notation.

### How do you change a property value?

`obj.key = value` or `obj["key"] = value`.

### Peculiarity of a constant and an object?

`const obj` cannot be reassigned, but properties can be changed. “Freezing” — `Object.freeze`.

### Peculiarity of how objects are stored?

Stored and copied **by reference**, not by value.

### How are objects copied?

Assignment copies the reference: `const b = a` — the same object.

### How are objects compared?

`===` compares references. Two different objects with the same contents are not equal.

### Ways to clone an object

Shallow: `{...obj}`, `Object.assign({}, obj)`.  
Deep: `structuredClone(obj)`, a careful custom traversal; `JSON.parse(JSON.stringify(obj))` — with limitations.

### What is `Object.assign` for?

Copies enumerable own properties into a target object. Often used for shallow merge/clone.

### What is an object method? Ways to create one?

A function that is a property of an object. Creation: in a literal `method() {}`, `obj.fn = function(){}`, via `class`.

### What are methods for?

Behavior associated with the object's data.

### What is `this` for in methods and how does it work?

`this` — the object before the dot when calling `obj.method()`.

### What is `delete` for with objects?

Removes an own property: `delete obj.key`.

### What is an object constructor for?

A template for creating same-type objects via `new Constructor()`.

### 2 rules for working with a constructor?

1. Call with `new`.  
2. Inside, write to `this` (no need to necessarily `return` an object).

### How does `return` work in a constructor?

If you return an object — it becomes the result of `new`. If a primitive / nothing — the created `this` is returned.

### `Object.keys`, `values`, `entries`?

- `keys` — array of keys  
- `values` — array of values  
- `entries` — array of `[key, value]` pairs  
Only own enumerable string keys.

---

## Arrays

### What is an array?

An ordered collection of elements with indices starting from 0 and a `length` property.

### What data type is an array?

`typeof [] === "object"`. Check: `Array.isArray(arr)`.

### Ways to create an array?

`[]`, `new Array(n)`, `Array.from(...)`, `Array.of(...)`, `split`, etc.

### How do you find out the number of elements?

`arr.length`.

### How do you access an element?

`arr[index]`, `arr.at(index)` (supports negative).

### How do you modify an array?

Assignment by index, `push`/`pop`/`splice`/`fill`, and others (mutating and not).

### What can be stored? `pop`/`push`, `shift`/`unshift`, `toString`

Anything: numbers, objects, functions, holes.  

| Method | Action | Returns |
| --- | --- | --- |
| `push(...items)` | to the end | new length |
| `pop()` | remove from the end | element |
| `unshift(...items)` | to the beginning | new length |
| `shift()` | remove from the beginning | element |
| `toString()` | comma-separated string | string |

### How do you iterate over an array?

`for`, `for...of`, `forEach`, `map`, `while`, etc.

### How does `.length` work?

Number of elements / last index + 1. You can shorten an array by assigning a smaller `length`.

### `delete` in arrays?

Removes an element, leaving a **hole**; `length` does not decrease. Better to use `splice`.

### `splice` vs `toSpliced`, `slice`

- `splice(start, deleteCount, ...items)` — **mutates**, returns the removed items.  
- `toSpliced(...)` — same logically, but a **new** array.  
- `slice(start?, end?)` — a copy of a range, without mutation.

### `concat()`

Concatenates arrays/values into a **new** array.

### `forEach`, `map`

- `forEach(cb)` — iteration for side effects, returns `undefined`.  
- `map(cb)` — a new array from the callback results.  
Callback: `(item, index, array)`.

### `indexOf`, `includes`

Search by strict equality. `indexOf` → index/-1, `includes` → boolean (finds `NaN`).

### `find`, `findIndex`, `filter`, `flat`, `flatMap`

- `find` — first element matching the condition / `undefined`  
- `findIndex` — index / -1  
- `filter` — new array of those that passed the check  
- `flat(depth?)` — “flatten” nesting  
- `flatMap` — `map` + `flat(1)`

### `sort` vs `toSorted`, `reverse`, `join`, `reduce`, `fill`, `at`

- `sort` — mutates, by default as strings; comparator `(a,b) => a-b`  
- `toSorted` — sorted copy  
- `reverse` — mutates, reverses  
- `join(sep)` — string  
- `reduce(fn, init?)` — fold to a single value  
- `fill(value, start?, end?)` — fill  
- `at(i)` — element by index (including -1)

### `reverse` vs `toReversed`

`reverse` changes the original array, `toReversed` returns a new reversed one.

### What is `Array.isArray()` for?

Reliably distinguish an array from an object.

### What is `thisArg` for in methods?

The second argument to `forEach`/`map`/`filter`/`find`… — the `this` value inside the callback (for non-arrow functions).

---

## Other data structures

### What is destructuring assignment? Example? Where is it used?

Unpacking an object/array into variables.

```js
const { name, age } = user;
const [first, second] = arr;
```

Convenient in function parameters, imports, and working with APIs.

### How do you assign a default value?

```js
const { role = "guest" } = user;
const [x = 0] = arr;
```

### What is spread? Where is it used?

`...` expands an iterable/properties: copying, merging, passing arguments `fn(...arr)`.

### Difference between spread and `Object.assign`?

For objects both do a shallow copy/merge. Spread in a `{}` literal is more expressive; `assign` can write into an existing target.

### Array copy via spread?

```js
const copy = [...arr];
```

### Advantages of spread vs `concat` / `Object.assign`?

Shorter, consistent for arrays and objects, convenient in literals, easy to insert elements “in the middle” of an expression’s logic.

### Can you use spread with strings?

Yes: `[..."hi"]` → `["h","i"]`.

### What is rest? Where is it used?

Collecting the “remainder” into an array/object: `const [a, ...rest] = arr`, `const {x, ...rest} = obj`, `function f(...args)`.

### Rest with function arguments?

`function f(a, b, ...rest)` — `rest` is an array of all remaining arguments.

### `Map` — features, methods, iteration

Keys of any type, preserves insertion order.  
Methods: `set`, `get`, `has`, `delete`, `clear`, `size`.  
Iteration: `for...of`, `forEach`, `keys/values/entries`.

### `Set` — features, methods, iteration

Unique values.  
`add`, `has`, `delete`, `clear`, `size`.  
Iteration: `for...of`, `forEach`.

### `WeakMap` — features

Keys must be objects only; weak references → GC can remove the entry. No `size`, no iteration. Methods: `get/set/has/delete`.

### `WeakSet` — features

Objects only, weak references, no iteration. `add/has/delete`.

### `Set` vs `WeakSet`

`Set` — any values, iterable, has `size`. `WeakSet` — objects only, no iteration, weak references.

### `Map` vs `WeakMap`

Similarly: `Map` is iterable and accepts any keys; `WeakMap` — object keys only and no enumeration.

### What is JSON?

A text format for data interchange (a subset of JS literals): objects, arrays, strings, numbers, boolean, `null`.

### `JSON.stringify()` — when?

Serialize to a string: sending to a server, `localStorage`.

### `JSON.parse()` — when?

Parse a JSON string back into a value.

### What is `try...catch` for?

Catch exceptions in synchronous code (and in `async` with `await`) without crashing execution.

### What does an error object contain?

Usually `name`, `message`, sometimes `stack`.

### What is an error object for? `throw`?

Pass information about a failure. `throw` raises an exception (`throw new Error("...")`).

### The `finally` block?

Always runs after `try/catch` — on success, on error, and on `return` (before the actual exit). For cleaning up resources.

---

## Promise, async/await

### What does an asynchronous action mean?

Does not block the main thread: the result arrives later (network, timers, I/O).

### What are callbacks for?

A function that will be called after an operation completes.

### Callback hell. What is it?

Deep nesting of callbacks → hard to read and handle errors.

### Callback example

```js
setTimeout(() => {
  console.log("done");
}, 1000);
```

### Promises. What are they for?

An object representing the result of an async operation: convenient `.then/.catch`, chaining, less callback hell.

### How do you create a promise?

```js
const p = new Promise((resolve, reject) => {
  // resolve(value) or reject(error)
});
```

### Parameters? What does it return?

Executor `(resolve, reject)`. The constructor returns a Promise.

### Promise properties and methods?

States: pending → fulfilled / rejected.  
Instance methods: `then`, `catch`, `finally`.  
Static: `resolve`, `reject`, `all`, `race`, `allSettled`, `any`.

### Promise chaining?

`then` returns a new promise — you can build a sequence of async steps and propagate errors down the chain.

### What is promisification?

Wrap a callback-based API in a function that returns a Promise.

### `Promise.all`

Waits for all; if one rejects — the whole thing rejects. Result — an array of values.

### `Promise.race`

Result of the first one to settle (fulfill or reject).

### `Promise.allSettled`

Waits for all; always fulfills with an array of `{status, value|reason}`.

### `Promise.any`

First successful fulfill; if all reject — `AggregateError`.

### Async/await?

Syntactic sugar over promises: write async code linearly.

### What is `async` for?

Makes a function automatically return a Promise; allows using `await` inside.

### What is `await` for?

Pauses inside an `async` function until the promise resolves/rejects; returns the value or throws an error.

### What should be on the right-hand side of `await`?

A thenable/Promise (any other value becomes a resolved promise).

### `try...catch` / error object / `throw` / `finally` (in async)

Same ideas: catch `await` errors, inspect `message`/`name`, rethrow with `throw`, clean up resources in `finally`.

---

## HTTP / HTTPS

### What is an HTTP request and how does it work?

The client sends a request (method, URL, headers, body) to the server; the server responds with a status, headers, and body. HTTPS is the same over TLS.

### What is `fetch` and why is it useful?

Modern browser/Node API for network requests based on promises: simpler than `XMLHttpRequest`.

### What HTTP methods are there and when to use them?

- `GET` — retrieve  
- `POST` — create / send data  
- `PUT` / `PATCH` — replace / partially update  
- `DELETE` — delete  
- `HEAD` / `OPTIONS` — metadata / CORS preflight  

### How do you make a simple GET with `fetch`?

```js
const res = await fetch("https://api.example.com/items");
const data = await res.json();
```

### How do you send a POST with JSON?

```js
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ann" }),
});
```

### How do you handle errors with `fetch`?

`fetch` does not reject on 404/500 — only on network/CORS failures. Check `res.ok` / `res.status`, plus `try/catch` around `await`.

```js
if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

### How does `fetch` differ from `XMLHttpRequest`?

Promises instead of callbacks, simpler API, no built-in upload progress as conveniently (there are nuances), by default does not send cookies cross-site the same way (credentials are configurable).

### What is CORS and how does it affect things?

Cross-Origin Resource Sharing — the browser blocks responses from another origin without allowing server headers (`Access-Control-Allow-Origin` and others).

### How do you use auth tokens in `fetch`?

```js
fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Can you use `fetch` with `async/await`?

Yes — it is a regular promise: `const res = await fetch(...)`.
