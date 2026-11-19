# React Exam

Typical questions with short answers.

---

## Basics

### What is React and what are its key features?

React is a library for building UIs from components.  
Features: declarative UI, Virtual DOM, unidirectional data flow, JSX, hooks, composition over inheritance, ecosystem (React DOM, React Native).

### What are SPA applications?

SPA (Single Page Application) loads one HTML page and then updates the UI without full reloads. Navigation and data are handled on the client (fetch + router). Pros: snappy UX. Cons: SEO/first paint without SSR, heavier initial load.

### Explain the concept of components in React

A component is a reusable UI piece with its own logic and markup. It takes `props`, may have `state`, and returns React elements. There are function components (main style) and class components. UIs are built by composing smaller components.

### What is JSX?

JSX is a JS syntax extension: HTML-like markup inside JavaScript. It is transpiled (Babel/SWC) into `React.createElement` / `jsx()` calls. It lets you describe UI declaratively next to logic.

### How does the browser read JSX?

Browsers do not understand JSX. The bundler/transpiler turns JSX into plain JS (`jsx("div", ...)` or `React.createElement`). At runtime React builds Virtual DOM objects and then updates the real DOM.

### What is the difference between props and state?

- `props` — inputs from the parent; read-only inside the child.
- `state` — internal component data updated via `setState`/`useState`.

Changing state/props triggers a re-render. Props are “config”; state is the component’s “memory”.

### How do you render a list of elements in React?

Use `.map()` and return an array of elements, each with a stable `key`.

```jsx
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

### What are keys in React and why are they needed?

`key` is a stable identity for a list item. Reconciliation uses it to know what was added/removed/moved instead of recreating everything. Avoid index keys when list order/membership changes.

### What is conditional rendering in React?

Rendering different UI based on a condition: `&&`, ternary, early return, or a JSX variable.

```jsx
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage />}
```

### How does render work in React?

1. Component runs (function / class `render`) → new element tree.
2. Reconciliation compares it to the previous tree.
3. Commit applies minimal DOM updates.
4. Then effects (`useLayoutEffect` → paint → `useEffect`).

In Concurrent Mode, render can be interrupted and restarted.

### What are hooks in React and what problem do they solve?

Hooks (`useState`, `useEffect`, …) give function components state, side effects, and other capabilities without classes. They solve: reusable logic without HOC/render-props hell, clearer lifecycle in functions, less class boilerplate.

Rules: top level only; only in React functions / custom hooks.

### What lifecycles exist?

In classes: `constructor` → `render` → `componentDidMount` → `componentDidUpdate` → `componentWillUnmount` (+ `getDerivedStateFromProps`, `shouldComponentUpdate`, `getSnapshotBeforeUpdate`).

Hook equivalents:
- mount/update UI — function body;
- after commit — `useEffect` / `useLayoutEffect`;
- cleanup on unmount / before next effect — function returned from the effect.

### How does component unmounting work?

React removes the component from the tree (conditional render, `key` change, navigation). Effect cleanups run; classes get `componentWillUnmount`; listeners/subscriptions are torn down; DOM nodes are removed.

### What is the useState hook?

`const [state, setState] = useState(initial)` — local state for a function component. `setState` schedules a re-render. Updates may be batched. Update objects/arrays immutably (new reference).

### What is the difference between passing an initial value directly to useState vs using a callback?

- `useState(expensive())` — `expensive()` runs on **every** render (result ignored after the first).
- `useState(() => expensive())` — lazy init: callback runs **only** on first mount.

For the setter: `setX(v)` vs `setX(prev => prev + 1)` — use the callback when the next value depends on the previous one (especially with batching).

### What is the useEffect hook?

`useEffect(fn, deps)` — side effects after paint (subscriptions, fetch, syncing with the outside world).  
`fn` may return a cleanup. `[]` — mount/unmount only; no deps — every render; with deps — when dependencies change.

### What is children?

`props.children` — content between a component’s opening and closing tags. A composition tool: wrappers, layouts, slots.

```jsx
<Card><p>text</p></Card> // children = <p>text</p>
```

### What are refs and how are they used?

Refs store a mutable value that does not trigger re-renders, and provide access to DOM / imperative APIs. Created with `useRef` / `createRef`, passed as `ref={...}`. Typical uses: focus, measuring size, integrating non-React APIs.

### How do useRef and createRef differ?

- `useRef` — for function components: the same ref object across renders.
- `createRef` — usually in class components; in a function component it creates a **new** ref every render (previous value is lost).

In hooks, almost always use `useRef`.

### How do you handle events in React?

CamelCase props: `onClick`, `onChange`. Pass a function, not a string. The event is a SyntheticEvent. Handlers often call `setState`; forms often use controlled inputs.

```jsx
<button onClick={(e) => setCount(c => c + 1)}>Inc</button>
```

### What is React Fragment?

`<>...</>` or `<React.Fragment>` groups children without an extra DOM node. Useful when a component must return multiple sibling elements.

### What attributes can React Fragment accept?

Only `key` (on explicit `<React.Fragment key={...}>`). The shorthand `<>` cannot take keys. Fragment has no other props.

### What is prop drilling?

Passing props through many intermediate components that do not need the data, only to forward it down. Mitigate with Context, composition, a state manager, or restructuring / lifting state.

### How do you pass data between components?

- Parent → child: `props`.
- Child → parent: callback props.
- Across the tree: Context API.
- Globally: Redux, Zustand, Jotai, etc.
- URL: router search/params.
- Sometimes: event bus / URL / server state (React Query).

### How do controlled and uncontrolled components differ?

- Controlled: value comes from `state`/`props`, changes via `onChange` (`value={x}`).
- Uncontrolled: value lives in the DOM; read via `ref` (often `defaultValue`).

Controlled is more predictable for validation/sync; uncontrolled is simpler for basic forms/integrations.

### What is a portal in React?

`createPortal(children, domNode)` renders children into a different DOM node outside the parent hierarchy while keeping React context (events, context). Typical uses: modals, tooltips, dropdowns over `overflow`.

### How do you create global state with the Context API?

1. `const Ctx = createContext(defaultValue)`.
2. Provider: `<Ctx.Provider value={...}>`.
3. Consumers: `useContext(Ctx)`.

Memoize/split context values, or every consumer re-renders on any value change.

### What are the characteristics of useEffect and useLayoutEffect?

- `useEffect` — after paint (async relative to painting). For fetch, subscriptions, analytics.
- `useLayoutEffect` — after DOM mutations, **before** paint. For measuring DOM and sync layout fixes (avoid flicker).

On the server `useLayoutEffect` warns — for SSR prefer `useEffect` or an environment check.

### How do you create and use custom hooks?

A function named `use...` that calls other hooks and returns values/API. Extracts reusable logic (subscription, form, media query).

```js
function useToggle(init = false) {
  const [on, setOn] = useState(init);
  return [on, () => setOn(v => !v)];
}
```

### How do you manage focus with the useRef hook?

```jsx
const inputRef = useRef(null);
// ...
<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>Focus</button>
```

The ref holds the DOM node; call `.focus()` / `.blur()` imperatively after mount or on an event.

### Explain what useCallback is and why it is needed.

`useCallback(fn, deps)` memoizes a function: the same reference until deps change. Needed so new function identities do not break `memo` / effect dependencies. Without a consumer that needs a stable reference, it is often unnecessary.

### How does useMemo work?

`useMemo(() => compute(), deps)` caches a computation until deps change. For expensive work and stabilizing objects/arrays passed down. Not a hard guarantee of caching forever — React may discard memo; do not use for micro-optimizations without a reason.

### Can you explain the HOC (Higher-Order Components) concept in React?

An HOC is `Component => EnhancedComponent`, wrapping to add behavior (auth, logging, data). Pre-hooks pattern; custom hooks are preferred now. Downsides: wrapper hell, prop clashes, harder DevTools.

```js
const withAuth = (Comp) => (props) =>
  isAuth ? <Comp {...props} /> : <Login />;
```

### What is memo used for in React?

`memo(Component)` shallow-compares props and skips re-render when they are the same. Helps when a parent re-renders often and the child is expensive. Does not help if props are new every time (inline objects/functions without memoization).

### What is the useReducer hook for?

`useReducer(reducer, init)` manages state via `(state, action) => newState`. Useful for complex update logic, related fields, and predictable transitions (mini-Redux in a component).

### What is the useImperativeHandle hook for?

Together with `forwardRef`, customizes what the parent gets through `ref` (not the whole DOM, but a chosen imperative API: `focus()`, `reset()`). Use sparingly — prefer declarative props.

### What is lifting state up?

Moving state to the nearest common ancestor so several children share one source of truth via props/callbacks, instead of duplicating state.

### What is forwardRef?

`forwardRef((props, ref) => ...)` lets a parent pass a `ref` into a child function component (and onward to a DOM/child node). Needed for reusable UI primitives (Input, Button).

### What is PureComponent?

A class component with `shouldComponentUpdate` via shallow compare of `props` and `state`. The class analogue of `memo`. Function components use `memo` + hooks.

### What are Error Boundaries in React and how do they help with error handling?

An Error Boundary is a class component with `getDerivedStateFromError` / `componentDidCatch`. It catches render errors below it and shows fallback UI instead of a blank screen. Does not catch errors in event handlers, async, SSR, or the boundary itself. No hook equivalent yet (need a class or library).

### What is react-router-dom? Why is it needed?

A client-side routing library for React DOM: URL ↔ UI, nested routes, `Link`/`NavLink`, loaders/actions (data APIs), protected routes — without full page reloads.

### What is the role of render props in React?

Pattern: a component takes a function as `props.children` or `render` and calls it with data.

```jsx
<Mouse>{(pos) => <Cursor x={pos.x} y={pos.y} />}</Mouse>
```

A pre-hooks way to share logic; custom hooks are more common now.

### Synthetic Events: what are they and why are they needed?

React’s wrapper over native events: consistent cross-browser API and event delegation (at the root). Same interface (`preventDefault`, `stopPropagation`). In React 17+ delegation is on the root container; event pooling is gone — you can read the event asynchronously.

---

## Optimizations

### Why is Strict Mode needed?

`<StrictMode>` in development double-invokes some logic (render, effect mount/unmount) and flags deprecated APIs. Goal: find impure renders, missing cleanups, legacy lifecycles. No double-invoking in production.

### Explain code splitting and lazy loading.

Code splitting breaks the bundle into chunks. Lazy loading fetches a chunk on demand (`React.lazy`, dynamic `import()`). Reduces initial load; routes/modals load when opened. Usually paired with a `Suspense` fallback.

### What is Suspense in React?

`<Suspense fallback={...}>` shows a fallback while children are “waiting” (lazy components; in modern stacks — data/RSC). Coordinates async UI without manual `isLoading` at every level.

### What is the React developer tool?

React DevTools — a browser extension: component tree, props/state/hooks, Profiler (render timing), highlight updates. Helps debug re-renders and UI structure.

### What is the Profiler API and how do you use it?

`<Profiler id="..." onRender={callback}>` (and the DevTools Profiler tab) measures commit durations for a subtree. The callback gets `id`, `phase`, `actualDuration`, `baseDuration`, etc. For finding hot spots — not everyday prod monitoring without need.

### What kinds of optimizations exist in React?

- Avoid extra re-renders: `memo`, stable props, split state/context.
- Memoization: `useMemo` / `useCallback` when justified.
- List virtualization.
- Code splitting / lazy.
- Concurrent: `startTransition`, `useDeferredValue`.
- Keys and good tree structure.
- SSR/streaming for TTFB.

### How do you optimize working with large data lists?

Virtualization (render only visible rows), pagination/infinite scroll, stable `key`s, avoid huge unused state, memoize row components, web workers for heavy processing, windowing via `react-window` / `@tanstack/virtual`.

### How do you work with react-window and react-virtualized?

Windowing libraries: render only the viewport + overscan. You provide `height`/`width`, `itemCount`, `itemSize`, and a `Row` renderer. `react-window` is lighter/modern; `react-virtualized` is older/heavier. Often replaced by `@tanstack/react-virtual`.

### Explain debouncing and throttling in a React context.

- Debounce — run after a pause in events (search-as-you-type).
- Throttle — at most once every N ms (scroll/resize).

In React: wrap handlers/effects and clear timers in cleanup. Alternative: `useDeferredValue` for deferred UI.

### What is Batching in React?

Grouping multiple `setState` calls into one re-render. React 18 batches almost everywhere (events, promises, timeouts). Earlier, there was no batching outside React events. `flushSync` forces a flush.

### What is Reactivity?

UI updates automatically when data changes. In React it is more explicit: change state → schedule re-renders of dependent components. Not arbitrary read-tracking like Vue/Solid — updates go through setState and subscriptions (context/store).

### How does Reactivity work under the hood? How would you implement it?

Under the hood: Fiber tree, update queue, scheduling, reconciliation, commit to DOM.  
Minimal custom reactivity: a store + `subscribe`/`notify`, consumed via `useSyncExternalStore` or `useState` + subscription; or Proxy/signals (Solid-like). React itself does not track object field reads.

### What is React Reconciliation (the reconciliation phase)?

The algorithm that compares the new element tree to the previous one and computes a minimal set of DOM operations. Relies on element type and `key`. Part of the render phase; can be interrupted in concurrent mode.

### How do you force a component to fully remount, resetting all of its internal state, without changing its position in the parent tree?

Change the component’s `key` — React unmounts the old instance and mounts a new one in the same place in the parent tree.

```jsx
<Editor key={docId} />
```

### What are Diffing and Patching?

- Diffing — comparing old vs new Virtual DOM / Fiber (what changed).
- Patching — applying those changes to the real DOM (insert/update/remove) during commit.

Together they are the basis of efficient UI updates.

---

## New features

### What is new in React 18?

`createRoot`, Automatic Batching, Transitions (`startTransition` / `useTransition`), `useDeferredValue`, improved Suspense, Streaming SSR, `useId`, Strict Mode double-invoking effects, Concurrent features opted into via these APIs.

### What is new in React 19?

Actions / form integration, `useActionState` (formerly `useFormState`), `useFormStatus`, `useOptimistic`, stable `use`, Server Components / Actions improvements, simpler refs (`ref` as a prop), document metadata, less async UI boilerplate.

### What is Fiber in React?

Fiber is the unit of work and the reconciler architecture since React 16: a tree of nodes with priorities, able to pause/resume/cancel work. Replaced the old stack reconciler; foundation of concurrent rendering.

### How do the render phase and commit phase differ in React Fiber?

- Render (reconcile) — compute what to change; pure, can be interrupted/retried; DOM not touched yet.
- Commit — synchronously apply DOM changes, run layout effects, then passive effects. Not interruptible.

### How does Fiber affect Concurrent Rendering (Concurrent Mode)?

Fiber splits work into prioritized units: urgent updates (input) can interrupt low-priority work (heavy list render). Concurrent is not a permanent separate “mode”, but capabilities built on interruptible render.

### What are React Server Components (RSC)?

Components rendered on the server that do not ship as executable client JS. They can talk to DB/files directly. Client components are marked `"use client"`. Data flows as a serialized payload. Needs an RSC-compatible framework (Next.js App Router, etc.).

### What is startTransition and why is it needed?

`startTransition(() => setState(...))` marks an update as a non-urgent transition: UI stays responsive; urgent updates (typing) take priority. While a transition is pending, show pending UI via `useTransition`.

### What does the useId hook do and when should you use it?

Generates a stable unique id consistent between SSR and the client (avoids hydration mismatch). For `label htmlFor` / `input id` and a11y. Not for list keys.

### What does useTransition do and why is it needed?

`const [isPending, startTransition] = useTransition()` — like `startTransition`, plus an `isPending` flag for loading indicators during non-urgent updates (filters, UI navigation).

### What does useDeferredValue do and how does it work?

`useDeferredValue(value)` returns a “deferred” version of value: urgent UI updates immediately; a heavy consumer updates later / at lower priority. Similar to debounce, but built into the concurrent scheduler.

### What does the useFormState / useActionState hook do in React 19?

`useActionState(action, initialState)` (in 19; previously experimental `useFormState`) — form state tied to a server/client action: returns `[state, formAction, isPending]`. Handy for validation errors and action results after submit.

### What is use for?

`use(promise)` / `use(context)` — read a Promise (with Suspense) or Context conditionally (unlike `useContext`, allowed inside `if`). For data/RSC flows and more flexible context reads. Not a replacement for all hooks.

---

## Extra

### What is SSR and how do you implement it with React?

SSR — HTML on the server → faster First Paint and SEO, then client hydration. Implement with `renderToString` / `renderToPipeableStream` (React DOM Server) or frameworks (Next.js, Remix). Markup must match (hydration); often streaming + Suspense.

### How does the Event Loop work in the context of React (especially with useEffect and useLayoutEffect)?

Render and commit run as synchronous JS work. After DOM mutations: `useLayoutEffect` (sync, before browser paint). Then the browser paints. `useEffect` is scheduled as a passive effect — after paint. So layout effects see DOM before paint; effects run after.

### Why can state updates in React be asynchronous?

`setState` does not change state immediately: it schedules an update (batching + scheduling). In concurrent mode updates can be deferred/interrupted. Read the new value from the setter callback or the next render — not from the variable right after `setState`.

### What happens if you pass an async function directly to useEffect?

`useEffect` expects `undefined` or a cleanup function. `async` always returns a Promise → React treats it incorrectly (warning, broken cleanup). Correct pattern:

```js
useEffect(() => {
  let cancelled = false;
  (async () => { ... })();
  return () => { cancelled = true; };
}, [deps]);
```

### Difference between Shadow DOM and Virtual DOM

- Shadow DOM — browser encapsulation of DOM/CSS for Web Components.
- Virtual DOM — an in-memory JS representation of UI (React elements/Fiber), with diff → patch of the real DOM.

Different layers: Shadow is platform; Virtual is a library pattern.

### What is the difference between ReactElement, JSX.Element, and ReactNode?

- `ReactElement` — an element object (`type`, `props`, `key`), result of `createElement`/JSX.
- `JSX.Element` — in `@types/react` often an alias of `ReactElement` (narrower in older typedefs).
- `ReactNode` — anything renderable: element, string, number, `null`, `boolean`, arrays, portals, etc.

`children` is usually typed as `ReactNode`.

### How do you use SOLID in React?

- **S**: one component — one responsibility (UI / data / layout).
- **O**: extend via composition/props, not by editing internals.
- **L**: interchangeable variants behind a shared props interface.
- **I**: narrow props/contexts instead of a “god” API.
- **D**: depend on abstractions (hooks, ports), not concrete fetch/store deep in UI.

### What React patterns do you know?

Composition, Container/Presentational, Custom Hooks, Controlled/Uncontrolled, Lifting state, Provider/Context, Compound components, Render props, HOC, State reducer, Slots/`children`, Portal, Error Boundary, Suspense boundaries, Atomic/Feature-Sliced module structure.
