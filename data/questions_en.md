# JavaScript Exam

Typical questions with short answers.

---

## Syntax and basics

### Ways to create (declare) a variable? Difference between `var`, `let`, and `const`?

- `var` — function scope, hoisted, can be redeclared.
- `let` — block scope, TDZ until declaration, cannot be redeclared in the same scope.
- `const` — like `let`, but the binding cannot be reassigned (object contents can still be mutated).

`var` — before ES6.  
`var` variables can be declared without assigning a value (they will be `undefined`).  
They have function scope: available only within the current function, or on the global object if there is no function.  
Declaring `var` outside functions makes it a global variable.  
You can access it before the declaration line (variable hoisting).

Unlike `let`, `const` cannot be declared without a value.  
You cannot access `let` and `const` before their declaration in the code.  
Both have block scope and do not become part of the global object. Block scope prevents reading the variable outside the block where it was declared.  
More detail: https://doka.guide/js/var-let/

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

“Boxes” inside which variables are accessible.  
Global: variables are available from any part of the program.  
Module: a variable is available within an ES module.  
Block: `const`/`let` are available inside braces `{ }`, for example in `if` / `switch`.  
Function: within the function body.  

Scopes are implemented via the lexical environment: it tracks the visibility of variables and functions at a given point in the code. The lexical environment also stores a reference to the outer/parent lexical environment, so a function can access outer variables.  
Scopes help limit access to data and structure code. One of the most interesting uses of this mechanism is a closure.

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

### Event Loop

JS in the browser is single-threaded. The engine runs a loop:  
It executes synchronous code (call stack).  
When the stack is empty — first microtasks (`Promise.then`, `queueMicrotask`, the continuation after `async`/`await`).  
Then one macrotask from the queue (`setTimeout`, `setInterval`, DOM events, I/O).  
Between macrotasks the browser may paint a frame.  
Again microtasks → next macrotask → …  
Practical takeaway: `await` / `.then` continue before `setTimeout(fn, 0)`. Long synchronous code blocks both the UI and timers.  
In a project: wrap input handlers in a macrotask via `setTimeout` (e.g. `lodash.debounce`).

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

---

## Prototypes, inheritance

### Explain the concept of prototypal inheritance in JavaScript

Every object has a hidden link to another object — its prototype. If a property is missing on the object itself, the engine looks it up along the prototype chain (`[[Prototype]]`). Objects reuse behavior this way without copying methods onto every instance.

### What is a prototype for?

To share common methods and properties across many objects. Methods live once on the prototype; instances only reference it — less memory and a single place to update behavior.

### How do you assign a prototype to an object?

```js
const proto = { greet() { return "hi"; } };
const obj = Object.create(proto);           // preferred
Object.setPrototypeOf(obj, proto);          // change later
const obj2 = { __proto__: proto };          // object literal (legacy style)
```

### What is `__proto__`?

A getter/setter for an object’s internal `[[Prototype]]`. Handy for debugging; in real code prefer `Object.getPrototypeOf` / `Object.setPrototypeOf` / `Object.create`.

### What type can the value of `__proto__` be?

Only an object or `null`. Assigning a primitive is ignored; `null` means “end of the chain” (as with `Object.prototype`).

### What is the `prototype` property on functions in JavaScript?

Every function (except arrow functions) has a `prototype` property — the object that becomes `[[Prototype]]` of instances created with `new Fn()`. Shared methods usually go there: `Fn.prototype.method = …`.

### What is `Object.prototype` and which methods does it contain?

The root of almost all objects — the end of the prototype chain. Common methods:

- `toString`, `valueOf`
- `hasOwnProperty`
- `isPrototypeOf`
- `propertyIsEnumerable`
- `toLocaleString`

### How does `this` work with object prototypes?

`this` is set at call time, not by where the method is defined. With `obj.method()`, the method may be found on the prototype, but `this` is still `obj` (the receiver).

### How do you set a prototype for a constructor?

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

Or with `class Dog extends Animal`.

### Built-in prototypes on objects?

Yes. For example:

- arrays → `Array.prototype` → `Object.prototype`
- functions → `Function.prototype` → `Object.prototype`
- dates → `Date.prototype`
- string objects → `String.prototype`

Object literals `{}` have `Object.prototype` as their prototype.

### Prototypes for primitives? Example

Primitives are not objects and have no prototype of their own, but calling a method temporarily wraps them:

```js
"hi".toUpperCase(); // temporary new String("hi"), method from String.prototype
(1.5).toFixed(1);   // Number.prototype
true.toString();    // Boolean.prototype
```

### Where do primitives get their methods and properties from?

Autoboxing: the engine briefly wraps the primitive in an object (`String`/`Number`/`Boolean`) and reads methods from the matching `.prototype`. The wrapper is discarded afterward — so assigning a property on a primitive does not stick.

### How do you create inheritance in JavaScript using prototypes?

1. Call the parent constructor with `Parent.call(this, …)`.
2. Link prototypes: `Child.prototype = Object.create(Parent.prototype)`.
3. Restore `Child.prototype.constructor = Child`.

The modern form is `class Child extends Parent`.

### How do you check whether an object is an instance of a given class (constructor function)?

```js
obj instanceof Constructor;                 // true/false via the prototype chain
Constructor.prototype.isPrototypeOf(obj);
Object.getPrototypeOf(obj) === Constructor.prototype; // direct prototype only
```

### How do you change an object’s prototype in JavaScript?

```js
Object.setPrototypeOf(obj, newProto); // works, but slow on hot paths
const obj2 = Object.create(newProto); // better: create with the right prototype
```

`obj.__proto__ = newProto` is the legacy approach.

### How do you check whether a property exists on an object or its prototype?

```js
"key" in obj;                    // own or inherited
obj.hasOwnProperty("key");       // own only
Object.hasOwn(obj, "key");       // modern replacement for hasOwnProperty
obj.key !== undefined;           // weak: cannot tell missing from undefined
```

---

## Classes

### How do you declare a class? What are the main building blocks?

```js
class User {
  field = 1;              // instance fields
  constructor(name) { … } // constructor
  method() { … }          // prototype methods
  get x() { … }           // getter
  set x(v) { … }          // setter
  static create() { … }   // statics
  #private = 0;           // private fields
}
```

### What is `constructor` for?

Instance initialization on `new`: accept arguments, set fields, call `super` in a subclass. Runs automatically once per created object.

### How do classes work under the hood? What happens when a class is created and methods are declared?

`class` is sugar over constructor functions. The class becomes the `User` function; methods are placed on `User.prototype` (non-enumerable); `constructor` is that function itself. Class fields (`field = …`) are initialized on the instance during `new`. Classes are not hoisted like `function declaration` (TDZ applies).

### How do you invoke a created class?

Only with `new`:

```js
const user = new User("Ann");
```

Calling without `new` throws `TypeError`.

### What does invoking a class return?

`new User(…)` returns the created instance. If `constructor` explicitly returns an object, that object is returned; a primitive `return` is ignored.

### Getters and setters. What are they for?

```js
class Box {
  get size() { return this._size; }
  set size(v) { if (v >= 0) this._size = v; }
}
```

Controlled property access: validation, computed values, hiding internals. From the outside they look like a normal field: `box.size = 10`.

### How do you create a property in a class?

- In `constructor`: `this.name = name`
- Class fields: `name = "default"` / `name;`
- Private: `#name = …`
- Static: `static count = 0`
- Via getter/setter

### Which keyword is used for class inheritance?

`extends`:

```js
class Dog extends Animal { … }
```

### Method overriding?

Declare a method with the same name in the child class. To call the parent version — `super.method(…)`.

### The `super` keyword?

A reference to the parent: `super.method()` in methods, `super(…)` in the constructor to call the parent `constructor`.

### Constructor overriding?

Yes — declare your own `constructor` in the subclass. You must call `super(…)` before touching `this`.

### What default constructor does a child class get?

If none is declared:

```js
constructor(...args) {
  super(...args);
}
```

It simply forwards arguments to the parent.

### `super` in the constructor

In a subclass you cannot use `this` / `return` before `super(…)`. `super(…)` runs the parent constructor and prepares the instance. A base class does not need `super` in its constructor.

### Static methods and properties?

They belong to the class itself, not instances: `User.create()`, `User.count`. Inherited via `extends`, available as `Child.create()`. Calling them on an instance is not the normal path. Inside a static, `this` is the class.

### Protected properties. What for, and how do you make a property protected?

“Protected” (by convention) means for the class and subclasses, not for outside code. JS has no `protected` modifier; common patterns:

- `_` prefix: `this._token` (convention)
- or `#private` — truly inaccessible outside (and not directly in subclasses)
- alternatively: a `WeakMap` keyed by the instance

Used to hide internal API while still letting subclasses reach it (via `_` or shared methods).

### Why were mixins invented? How do you implement them?

To mix in behavior from several sources when a single `extends` is not enough:

```js
const sayHi = (Base) => class extends Base {
  hi() { return "hi"; }
};
class User extends sayHi(Object) {}
```

Or `Object.assign(Target.prototype, mixin)`. A mixin is a reusable set of methods without a rigid hierarchy.

### Multiple inheritance in JavaScript?

No native `extends A, B`. One prototype / one `extends`. Workarounds: mixins, composition, delegating to another object.

### Encapsulation?

Hiding internal implementation. In classes: private fields `#x`, closures in factories, not exporting module internals. Outside — only the public API.

### `instanceof`

```js
obj instanceof Class; // true if Class.prototype is in obj’s prototype chain
```

Works with `class` and function constructors. Across iframes/realms it may be `false` for a “same” class. Narrower checks: `Object.hasOwn` / duck typing.

---

## DOM and events

### Can you explain the Document Object Model (DOM)?

DOM is the browser’s in-memory object representation of an HTML/XML document. A tree of nodes you can query, mutate, and listen to from JS.

### DOM structure?

A tree of nodes: `document` → `html` → `head`/`body` → elements, text, comments. Nodes link via parent/children/siblings. Types: `Element`, `Text`, `Comment`, `Document`, etc.

### DOM navigation?

- `parentNode` / `parentElement`
- `childNodes` / `children`
- `firstChild` / `firstElementChild`
- `lastChild` / `lastElementChild`
- `nextSibling` / `nextElementSibling`
- `previousSibling` / `previousElementSibling`

`*Element*` — elements only; without `Element` — any nodes (including text).

### What is `childNodes`, and what does it contain?

A live collection (`NodeList`) of all child nodes: elements, text nodes (spaces/newlines), comments. For elements only, prefer `children` (`HTMLCollection`).

### What is a live collection?

A collection that automatically reflects DOM changes (`HTMLCollection` from `getElementsBy*`, also `childNodes`). `querySelectorAll` returns a static `NodeList` — a snapshot at query time.

### Which DOM methods do you know for finding elements?

- `getElementById`
- `getElementsByClassName`, `getElementsByTagName`, `getElementsByName`
- `querySelector`, `querySelectorAll`
- `closest` (walk up ancestors)
- `matches` (test a selector)

### How does `querySelector` differ from `querySelectorAll`?

`querySelector` — the first match or `null`.  
`querySelectorAll` — all matches (static `NodeList`).

### Difference between `getElements*` and `querySelectorAll`?

- `getElements*` — live `HTMLCollection`, simple criteria only (class/tag/name).
- `querySelectorAll` — full CSS selectors, static snapshot.
- `getElementById` — a single element by id, not a collection.

### How do you change the text content of an HTML element?

```js
el.textContent = "Hello"; // safe, text only
el.innerText = "Hello";   // respects styles/visibility, slower
el.innerHTML = "<b>Hi</b>"; // HTML, XSS risk
```

### How do you add a new element to the DOM?

```js
const li = document.createElement("li");
li.textContent = "item";
parent.append(li);        // or appendChild, prepend, before, after
```

### What’s the difference between `element.append()` and `element.appendChild()`?

- `append` — multiple arguments, accepts nodes and strings, returns `undefined`.
- `appendChild` — a single node only, returns the inserted node.
- `append` is newer and more convenient.

### How do you remove an element from the DOM?

```js
el.remove();
parent.removeChild(el);
```

### Which method creates a new DOM element?

`document.createElement("div")`. For text — `document.createTextNode("…")`. From an HTML string — `template` / `insertAdjacentHTML` (watch for XSS).

### How do you insert an element before another element in the DOM?

```js
parent.insertBefore(newNode, referenceNode);
referenceNode.before(newNode);
referenceNode.insertAdjacentElement("beforebegin", newNode);
```

### What’s the difference between `innerHTML` and `innerText`?

- `innerHTML` — HTML markup as a string (parses tags).
- `innerText` — visible text respecting CSS (skips `display:none`), triggers reflow.
- For plain text, prefer `textContent`.

### Which method clones a node?

```js
const copy = el.cloneNode(true); // true — deep clone with children
```

Listeners added via `addEventListener` are not copied.

### Working with classes on DOM elements?

```js
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");
el.classList.contains("active");
el.classList.replace("old", "new");
```

`className` is the whole class string (less convenient).

### What is an event in the DOM context, and how do you handle it?

A signal about a user or browser action (`click`, `input`, `submit`, …). Handle with `el.addEventListener("click", handler)` or `el.onclick = handler`. The handler receives an `event` object.

### What is event delegation in JavaScript?

Attach one listener to a common ancestor and handle child events via bubbling:

```js
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item || !list.contains(item)) return;
  // handle item
});
```

Benefits: fewer listeners; works for dynamically added elements.

### What is the process of listening for events in JavaScript called?

Event listening / subscribing to events: registering listeners that run when an event occurs.

### How can you add an event handler to an element in JavaScript?

```js
el.addEventListener("click", handler);           // preferred
el.addEventListener("click", handler, true);     // capture phase
el.addEventListener("click", handler, { once: true, passive: true });
el.onclick = handler;                            // single property handler
```

### Which ways do you know to remove an event handler from an element?

```js
el.removeEventListener("click", handler); // same function reference and capture flags
el.onclick = null;                        // for property handlers
AbortController: signal → abort()         // if the listener was created with { signal }
```

You cannot remove an anonymous function — keep a reference.

### What is the event object in JavaScript? Which properties does it contain?

An object with event data passed to the handler. Commonly used:

- `type`, `target`, `currentTarget`
- `clientX` / `clientY`, `key`, `code`
- `preventDefault()`, `stopPropagation()`, `stopImmediatePropagation()`
- `bubbles`, `defaultPrevented`, `eventPhase`
- `timestamp`

### Event phases? What are they for?

Three phases: capturing → target → bubbling. They decide at which tree level and in which order you catch the event. Capture (`addEventListener(…, true)`) runs toward the target; bubble runs afterward. Delegation usually relies on bubbling.

### How do you stop event bubbling in JavaScript?

```js
e.stopPropagation();          // do not continue through the tree
e.stopImmediatePropagation(); // also skip other listeners on the same element
```

`stopPropagation` does not undo listeners already run on the current node.

### How can you cancel the default action when an event occurs? Where is it used?

```js
e.preventDefault();
```

Cancels browser behavior: link navigation, form submit, context menu, drag-and-drop, etc. Does not affect phases. Some events need a non-`passive` listener (e.g. `touchmove`).

### How can you create and dispatch a custom event in JavaScript?

```js
const ev = new CustomEvent("user:save", {
  detail: { id: 1 },
  bubbles: true,
  cancelable: true,
});
el.dispatchEvent(ev);
```

Or `new Event("open")` without `detail`. Listen with normal `addEventListener("user:save", …)`.

### Event capturing and bubbling

On click, the event travels the DOM in three stages:

1. **Capture** — top-down: `window` → … → parent → target.
2. **Target** — on the element itself.
3. **Bubble** — bottom-up: target → parents → `document`.

- `e.stopPropagation()` — stop further propagation through the tree.
- `e.preventDefault()` — cancel the browser action (link navigation, submit, etc.); does not affect phases.

In projects we mostly work with bubbling and stop it when needed. Example: closing an edit modal by clicking the overlay so the click does not hit handlers underneath. Typical case: a row click opens an edit popup; a delete control opens a delete dialog (`stopPropagation` on the button so both do not fire).

### How can browser tabs exchange information?

1. If the tabs are open on the same site (same origin)
- BroadcastChannel API — one tab sends a message, and the others receive it immediately.
- localStorage — one tab writes to storage, and the others get a `window.addEventListener("storage", ...)` event. Example: logging out in one tab logs you out in all of them.
- Shared Workers — a special kind of web worker (scripts that run in the background).
- Service Workers — can also intercept requests and broadcast messages (`postMessage`) to every open tab (client).

2. If one tab opened another (direct connection)

If a tab was opened via `window.open()` or a link with `target="_blank"`, the two tabs hold a direct reference to each other:
- The parent tab gets a reference to the child window.
- The child tab can reach the parent via `window.opener`.
- Same origin — they can call each other’s functions and read each other’s variables directly.
- Different origins — they can talk via `window.postMessage()`.
