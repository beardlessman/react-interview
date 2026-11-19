# Экзамен по React

Типичные вопросы с краткими ответами.

---

## База

### Что такое React и какие особенности он имеет?

React — библиотека для построения UI на основе компонентов.  
Особенности: декларативный подход, Virtual DOM, однонаправленный поток данных, JSX, хуки, композиция вместо наследования, экосистема (React DOM, React Native).

### Что такое SPA приложения?

SPA (Single Page Application) — приложение, которое загружает одну HTML-страницу и дальше обновляет UI без полной перезагрузки. Навигация и данные обрабатываются на клиенте (fetch + роутер). Плюсы: быстрый UX. Минусы: SEO/первый рендер без SSR, сложнее initial load.

### Объясните концепцию компонентов в React

Компонент — переиспользуемый кусок UI со своей логикой и разметкой. Принимает `props`, может иметь `state`, возвращает React-элементы. Бывают function components (основной стиль) и class components. UI собирается композицией мелких компонентов.

### Что такое JSX?

JSX — синтаксическое расширение JS: HTML-подобная разметка внутри JS. Транспилируется (Babel/SWC) в вызовы `React.createElement` / `jsx()`. Позволяет описывать UI декларативно рядом с логикой.

### Как браузер читает JSX?

Браузер JSX не понимает. Сборщик/транспайлер превращает JSX в обычный JS (`jsx("div", ...)` или `React.createElement`). В рантайме React создаёт объекты Virtual DOM и затем обновляет реальный DOM.

### В чем разница между props и state?

- `props` — входные данные от родителя, снаружи компонента read-only.
- `state` — внутреннее состояние компонента, меняется через `setState`/`useState`.

Изменение state/props → ре-рендер. Props можно считать «конфигом», state — «памятью» компонента.

### Как отрендерить список элементов в React?

Через `.map()`: вернуть массив элементов, каждому дать стабильный `key`.

```jsx
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

### Что такое keys в React и зачем они нужны?

`key` — стабильный идентификатор элемента в списке. Нужен reconciliation: React понимает, какой элемент добавили/удалили/переместили, а не пересоздаёт всё подряд. Нельзя использовать индекс, если порядок/состав списка меняется.

### Что такое условный рендеринг в React?

Показ разного UI в зависимости от условия: `&&`, тернарный оператор, early return, отдельная переменная с JSX.

```jsx
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage />}
```

### Как происходит render в React?

1. Вызов компонента (функция/render класса) → новое дерево элементов.
2. Reconciliation сравнивает с предыдущим деревом.
3. Commit применяет минимальные изменения в DOM.
4. Затем эффекты (`useLayoutEffect` → paint → `useEffect`).

В Concurrent Mode render может прерываться и перезапускаться.

### Что такое хуки в React и какую проблему они решают?

Хуки (`useState`, `useEffect`, …) дают function components state, side effects и другую логику без классов. Решают: переиспользование логики без HOC/render props hell, понятный lifecycle в функциях, меньше boilerplate классов.

Правила: только на верхнем уровне, только в React-функциях/кастомных хуках.

### Какие есть жизненные циклы?

В классах: `constructor` → `render` → `componentDidMount` → `componentDidUpdate` → `componentWillUnmount` (+ `getDerivedStateFromProps`, `shouldComponentUpdate`, `getSnapshotBeforeUpdate`).

В хуках аналоги:
- mount/update UI — тело функции;
- после commit — `useEffect` / `useLayoutEffect`;
- cleanup при unmount/перед следующим эффектом — функция из effect.

### Как происходит размонтирование компонента?

React удаляет компонент из дерева (условный рендер, смена `key`, уход со страницы). Вызываются cleanup-функции эффектов, у классов — `componentWillUnmount`, отвязываются слушатели/подписки, убираются DOM-узлы.

### Что такое useState хук?

`const [state, setState] = useState(initial)` — локальный state function component. `setState` планирует ре-рендер. Обновления могут батчиться. Для объекта/массива обновляют иммутабельно (новый reference).

### В чем разница между установкой стейта в useState при прямой передаче начального значения и при использовании колбэка?

- `useState(expensive())` — `expensive()` вызывается на **каждом** рендере (результат игнорируется после первого).
- `useState(() => expensive())` — lazy init: колбэк вызывается **только** при первом монтировании.

Для setter: `setX(v)` vs `setX(prev => prev + 1)` — колбэк нужен, когда новое значение зависит от предыдущего (особенно при батчинге).

### Что такое useEffect хук?

`useEffect(fn, deps)` — side effects после отрисовки (подписки, fetch, sync с внешним миром).  
`fn` может вернуть cleanup. Пустой `[]` — только mount/unmount; без deps — каждый рендер; с deps — при изменении зависимостей.

### Что такое children?

`props.children` — содержимое между открывающим и закрывающим тегом компонента. Способ композиции: обёртки, layouts, слоты.

```jsx
<Card><p>text</p></Card> // children = <p>text</p>
```

### Что такое refs и как они используются?

Refs — способ хранить мутабельное значение, которое не вызывает ре-рендер, и получать доступ к DOM/императивному API. Создают через `useRef` / `createRef`, передают в `ref={...}`. Типично: фокус, измерение размеров, интеграция с non-React API.

### Чем отличаются useRef и createRef?

- `useRef` — для function components: один и тот же объект ref между рендерами.
- `createRef` — обычно в class components; в function component на каждом рендере создаёт **новый** ref (теряется предыдущий).

В хуках почти всегда `useRef`.

### Как обрабатывать события в React?

CamelCase-пропсы: `onClick`, `onChange`. Передают функцию, не строку. Событие — SyntheticEvent. В обработчике часто вызывают `setState`; для форм — controlled inputs.

```jsx
<button onClick={(e) => setCount(c => c + 1)}>Inc</button>
```

### Что такое React Fragment?

`<>...</>` или `<React.Fragment>` — группировка детей без лишнего DOM-узла. Удобно, когда компонент должен вернуть несколько соседних элементов.

### Какие атрибуты может принимать React Fragment?

Только `key` (у явного `<React.Fragment key={...}>`). Короткая форма `<>` ключи не принимает. Других props у Fragment нет.

### Что такое prop drilling?

Передача props через много промежуточных компонентов, которым эти данные не нужны, только «протянуть» вниз. Лечится Context, composition, state manager, или подъёмом/перестройкой дерева.

### Как передавать данные между компонентами?

- Родитель → ребёнок: `props`.
- Ребёнок → родитель: колбэк в props.
- Через дерево: Context API.
- Глобально: Redux, Zustand, Jotai и т.п.
- URL: router search/params.
- Иногда: event bus / URL / server state (React Query).

### Чем отличается controlled от uncontrolled компонентов?

- Controlled: значение из `state`/`props`, изменения через `onChange` (`value={x}`).
- Uncontrolled: значение живёт в DOM, читают через `ref` (часто `defaultValue`).

Controlled — предсказуемее для валидации/синхронизации; uncontrolled — проще для «простых» форм/интеграций.

### Что такое portal в React?

`createPortal(children, domNode)` — рендер детей в другой DOM-узел вне иерархии родителя, сохраняя React-контекст (events, context). Типично: модалки, тултипы, dropdown поверх `overflow`.

### Как создать глобальное состояние с помощью Context API?

1. `const Ctx = createContext(defaultValue)`.
2. Провайдер: `<Ctx.Provider value={...}>`.
3. Потребители: `useContext(Ctx)`.

Value лучше мемоизировать/делить контексты, иначе все потребители ре-рендарятся при любом изменении value.

### Какие особенности имеют хуки useEffect и useLayoutEffect?

- `useEffect` — после paint (асинхронно относительно отрисовки). Для fetch, подписок, аналитики.
- `useLayoutEffect` — после DOM-мутаций, **до** paint. Для измерений DOM и синхронной правки layout (избежать мерцания).

На сервере `useLayoutEffect` предупреждает — для SSR обычно `useEffect` или проверка окружения.

### Как создать и использовать кастомные хуки?

Функция с именем `use...`, внутри вызывает другие хуки, возвращает нужные значения/API. Выносит переиспользуемую логику (подписка, форма, media query).

```js
function useToggle(init = false) {
  const [on, setOn] = useState(init);
  return [on, () => setOn(v => !v)];
}
```

### Как управлять фокусом с помощью хука useRef?

```jsx
const inputRef = useRef(null);
// ...
<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>Focus</button>
```

Ref хранит DOM-узел; `.focus()` / `.blur()` вызывают императивно после монтирования или по событию.

### Объясните, что такое useCallback и зачем он нужен.

`useCallback(fn, deps)` мемоизирует функцию: тот же reference, пока deps не изменились. Нужен, чтобы не ломать `memo`/зависимости эффектов из-за новой функции каждый рендер. Без потребителя стабильности reference часто избыточен.

### Как работает useMemo?

`useMemo(() => compute(), deps)` кэширует результат вычисления до смены deps. Для дорогих вычислений и стабилизации объектов/массивов, передаваемых вниз. Не гарантия «всегда кэш» — React может сбросить memo в будущем; не использовать ради микрооптимизаций без причины.

### Можете объяснить концепцию HOC (Higher-Order Components) в React?

HOC — функция `Component => EnhancedComponent`, добавляет поведение через обёртку (auth, logging, data). Паттерн до хуков; сейчас чаще custom hooks. Минусы: wrapper hell, конфликты props, сложнее DevTools.

```js
const withAuth = (Comp) => (props) =>
  isAuth ? <Comp {...props} /> : <Login />;
```

### Для чего используется memo в React?

`memo(Component)` — shallow compare props; пропускает ре-рендер, если props те же. Помогает при частых ре-рендерах родителя и «тяжёлом» ребёнке. Не помогает, если props каждый раз новые (inline objects/functions без мемоизации).

### Для чего нужен хук useReducer?

`useReducer(reducer, init)` — state через `(state, action) => newState`. Удобен для сложной логики обновлений, нескольких связанных полей, предсказуемых переходов (как мини-Redux в компоненте).

### Для чего нужен хук useImperativeHandle?

Вместе с `forwardRef` кастомизирует значение, которое родитель получит через `ref` (не весь DOM, а выбранный imperative API: `focus()`, `reset()`). Использовать редко — обычно достаточно declarative props.

### Что такое поднятие состояния?

Lifting state up — state переносят в ближайшего общего предка, чтобы несколько детей читали/меняли одни данные через props/колбэки. Единый источник правды вместо дублирования.

### Что такое forwardRef?

`forwardRef((props, ref) => ...)` позволяет родителю передать `ref` в дочерний function component (и дальше на DOM/дочерний узел). Нужен для переиспользуемых UI-примитивов (Input, Button).

### PureComponent — что это?

Классовый компонент с `shouldComponentUpdate` через shallow compare `props` и `state`. Аналог `memo` для классов. Function components используют `memo` + хуки.

### Что такое Error Boundaries в React и как они помогают в обработке ошибок?

Error Boundary — class component с `getDerivedStateFromError` / `componentDidCatch`. Ловит ошибки рендера в дереве ниже, показывает fallback UI вместо белого экрана. Не ловит ошибки в event handlers, async, SSR, самих boundaries. Хуков-аналога пока нет (нужен класс или библиотека).

### Что такое react-router-dom? Зачем он нужен?

Библиотека клиентского роутинга для React DOM: URL ↔ UI, вложенные маршруты, `Link`/`NavLink`, loaders/actions (data APIs), protected routes. Без полной перезагрузки страницы.

### Какова роль render props в React?

Паттерн: компонент принимает функцию как `props.children` или `render` и вызывает её с данными.

```jsx
<Mouse>{(pos) => <Cursor x={pos.x} y={pos.y} />}</Mouse>
```

Способ шаринга логики до хуков; сейчас чаще custom hooks.

### Synthetic Events: что такое и зачем нужны?

Обёртка React над нативными событиями: единый API кросс-браузерно, делегирование (root). Имеет тот же интерфейс (`preventDefault`, `stopPropagation`). В React 17+ делегирование на root контейнере; pooling устарел — event можно читать асинхронно.

---

## Оптимизации

### Зачем нужен Strict Mode?

`<StrictMode>` в dev дважды вызывает часть логики (render, effects mount/unmount) и помечает устаревшие API. Цель — выявить нечистые рендеры, недостающие cleanup, legacy lifecycle. В production двойных вызовов нет.

### Объясните концепцию code splitting и lazy loading.

Code splitting — разбиение бандла на чанки. Lazy loading — подгрузка чанка по требованию (`React.lazy`, dynamic `import()`). Уменьшает initial load; маршрут/модалка грузятся при открытии. Обычно с `Suspense` fallback.

### Что такое Suspense в React?

`<Suspense fallback={...}>` показывает fallback, пока дети «ждут» (lazy-компоненты, в современных стеках — data/RSC). Координирует асинхронный UI без ручного `isLoading` на каждом уровне.

### Что такое инструмент разработчика React?

React DevTools — расширение браузера: дерево компонентов, props/state/hooks, Profiler (время рендера), highlight updates. Помогает дебажить ре-рендеры и структуру UI.

### Что такое Profiler API и как его использовать?

`<Profiler id="..." onRender={callback}>` (и вкладка Profiler в DevTools) измеряет длительность commit’ов поддерева. Callback получает `id`, `phase`, `actualDuration`, `baseDuration` и т.д. Для поиска «тяжёлых» мест, не для прод-мониторинга без нужды.

### Какие виды оптимизации есть в React?

- Избегать лишних ре-рендеров: `memo`, стабильные props, разбиение state/context.
- Мемоизация: `useMemo` / `useCallback` по делу.
- Виртуализация списков.
- Code splitting / lazy.
- Concurrent: `startTransition`, `useDeferredValue`.
- Ключи и правильная структура дерева.
- SSR/streaming для TTFB.

### Как оптимизировать работу с большими списками данных?

Виртуализация (рисовать только видимые строки), пагинация/infinite scroll, стабильные `key`, не держать огромный state без нужды, мемоизация row-компонентов, web workers для тяжёлой обработки, windowing через `react-window` / `@tanstack/virtual`.

### Как работать с react-window и react-virtualized?

Библиотеки windowing: рендерят только видимый viewport + overscan. Задают `height`/`width`, `itemCount`, `itemSize`, `Row` renderer. `react-window` — легче и современнее; `react-virtualized` — старше и тяжелее. Часто заменяют на `@tanstack/react-virtual`.

### Объясните концепцию дебаунсинга и троттлинга в контексте React.

- Debounce — вызвать функцию после паузы в событиях (поиск по вводу).
- Throttle — не чаще N мс (scroll/resize).

В React: оборачивают handlers/effects, чистят таймеры в cleanup. Альтернатива — `useDeferredValue` для отложенного UI.

### Что такое Batching в React?

Группировка нескольких `setState` в один ре-рендер. В React 18 автоматический batching почти везде (events, promises, timeouts). Раньше вне React-событий батчинга не было. `flushSync` принудительно сбрасывает батч.

### Что такое Реактивность?

UI автоматически обновляется при изменении данных. В React «реактивность» явнее: меняешь state → планируется ре-рендер зависимых компонентов. Не отслеживание произвольных чтений как в Vue/Solid, а обновления через setState и подписки (context/store).

### Как работает Реактивность под капотом? Как реализовать ее?

Под капотом React: Fiber-дерево, очередь обновлений, scheduling, reconciliation, commit в DOM.  
Минимальная «своя» реактивность: хранилище + `subscribe`/`notify`, в компоненте `useSyncExternalStore` или `useState`+подписка; либо Proxy/сигналы (Solid-подобно). React сам не трекает чтение полей объекта.

### Что такое React Reconciliation (Этап согласования)?

Алгоритм сравнения нового дерева элементов с предыдущим и вычисления минимального набора DOM-операций. Опирается на тип элемента и `key`. Часть render phase; может прерываться в concurrent.

### Как заставить компонент полностью перемонтироваться, сбросив всё своё внутреннее состояние, без изменения его позиции в дереве родителя?

Сменить `key` у компонента — React размонтирует старый экземпляр и смонтирует новый на том же месте в дереве родителя.

```jsx
<Editor key={docId} />
```

### Что такое Сравнение (Diffing) и Патчинг?

- Diffing — сравнение старого и нового Virtual DOM / Fiber (что изменилось).
- Patching — применение найденных изменений к реальному DOM (insert/update/remove) на commit phase.

Вместе составляют основу эффективного обновления UI.

---

## Новинки

### Что нового в React 18?

`createRoot`, Automatic Batching, Transitions (`startTransition` / `useTransition`), `useDeferredValue`, улучшенный Suspense, Streaming SSR, `useId`, Strict Mode double-invoke effects, Concurrent features как opt-in через эти API.

### Что нового в React 19?

Actions / форм-интеграция, `useActionState` (ранее `useFormState`), `useFormStatus`, `useOptimistic`, стабильный `use`, улучшения Server Components / Actions, упрощения ref (`ref` как prop), document metadata, меньше boilerplate для async UI.

### Что такое Fiber в React?

Fiber — единица работы и архитектура reconcilera с React 16: дерево узлов с приоритетами, возможность прерывать/возобновлять/отменять работу. Заменяет старый стековый reconciler; основа concurrent rendering.

### Чем отличаются render phase и commit phase в React Fiber?

- Render (reconcile) — вычислить, что изменить; чистая, может прерываться/повторяться; DOM ещё не трогают.
- Commit — синхронно применить изменения к DOM, запустить layout effects, потом passive effects. Не прерывается.

### Как Fiber влияет на Concurrent Rendering (Concurrent Mode)?

Fiber позволяет дробить работу на единицы с приоритетами: срочные обновления (ввод) прерывают низкоприоритетные (тяжёлый рендер списка). Concurrent — не отдельный «режим» навсегда, а набор возможностей на базе interruptible render.

### Что такое React Server Components (RSC)?

Компоненты, которые рендерятся на сервере и не попадают в клиентский JS-бандл как исполняемый код. Могут напрямую ходить в БД/файлы. Клиентские компоненты помечены `"use client"`. Данные «просачиваются» как сериализованный payload. Нужен RSC-совместимый фреймворк (Next.js App Router и др.).

### Что такое startTransition и зачем он нужен?

`startTransition(() => setState(...))` помечает обновление как несрочный transition: UI остаётся отзывчивым, срочные обновления (ввод) приоритетнее. Пока transition в процессе, можно показать pending-состояние через `useTransition`.

### Что делает хук useId и когда его использовать?

Генерирует стабильный уникальный id, согласованный между SSR и клиентом (избегает hydration mismatch). Для связки `label htmlFor` / `input id`, a11y. Не для list keys.

### Что делает useTransition и зачем он нужен?

`const [isPending, startTransition] = useTransition()` — как `startTransition`, плюс флаг `isPending` для индикатора загрузки при несрочном обновлении (фильтры, навигация UI).

### Что делает useDeferredValue и как он работает?

`useDeferredValue(value)` возвращает «отложенную» версию value: срочный UI обновляется сразу, тяжёлый потребитель — с задержкой/низким приоритетом. Похоже на debounce, но встроено в concurrent scheduler.

### Что делает хук useFormState / useActionState в React 19?

`useActionState(action, initialState)` (в 19; ранее экспериментально `useFormState`) — state формы, связанный с server/client action: возвращает `[state, formAction, isPending]`. Удобно для ошибок валидации и результата action после submit.

### Для чего предназначен use?

`use(promise)` / `use(context)` — читать Promise (с Suspense) или Context условно (в отличие от `useContext`, можно внутри `if`). Для data/RSC-потоков и более гибкого чтения контекста. Не замена всем хукам.

---

## Дополнительно

### Что такое SSR и как его реализовать с React?

SSR — HTML на сервере → быстрый First Paint и SEO, затем hydration на клиенте. Реализация: `renderToString` / `renderToPipeableStream` (React DOM Server) или фреймворки (Next.js, Remix). Нужна согласованность разметки (hydration), часто streaming + Suspense.

### Как работает Event Loop в контексте React (особенно при работе с хуками useEffect и useLayoutEffect)?

Рендер и commit идут в синхронных задачах JS. После мутаций DOM: `useLayoutEffect` (синхронно, до paint браузера). Затем браузер рисует кадр. `useEffect` планируется как passive effect — после paint (почти microtask/task scheduling React). Поэтому layout-effect видит DOM до отрисовки, effect — после.

### Почему обновление стейта в React может быть асинхронным?

`setState` не меняет state сразу: планирует обновление (batching + scheduling). В concurrent обновление могут отложить/прервать. Читать новое значение нужно из колбэка setter или следующего рендера, не из переменной сразу после `setState`.

### Что произойдёт, если в useEffect использовать async-функцию напрямую?

`useEffect` ожидает либо `undefined`, либо cleanup-функцию. `async` всегда возвращает Promise → React воспримет это неверно (предупреждение, cleanup сломан). Правильно:

```js
useEffect(() => {
  let cancelled = false;
  (async () => { ... })();
  return () => { cancelled = true; };
}, [deps]);
```

### Разница между Shadow DOM и Virtual DOM

- Shadow DOM — браузерная инкапсуляция DOM/CSS для Web Components.
- Virtual DOM — JS-представление UI в памяти (React-элементы/Fiber), с diff → патч реального DOM.

Это разные уровни: Shadow — платформа; Virtual — паттерн библиотеки.

### В чем разница между ReactElement, JSX.Element, ReactNode?

- `ReactElement` — объект элемента (`type`, `props`, `key`), результат `createElement`/JSX.
- `JSX.Element` — в `@types/react` часто alias на `ReactElement` (чуть уже в старых typedef).
- `ReactNode` — всё, что можно отрендерить: element, string, number, `null`, `boolean`, массивы, portals и т.д.

`children` обычно типизируют как `ReactNode`.

### Как ты используешь SOLID в React?

- **S**: один компонент — одна ответственность (UI / data / layout).
- **O**: расширение через composition/props, не правка internals.
- **L**: взаимозаменяемые варианты через общий интерфейс props.
- **I**: узкие props/контексты вместо «божественного» API.
- **D**: зависеть от абстракций (hooks, ports), не от конкретных fetch/store в глубине UI.

### Какие паттерны в React знаешь?

Composition, Container/Presentational, Custom Hooks, Controlled/Uncontrolled, Lifting state, Provider/Context, Compound components, Render props, HOC, State reducer, Slots/`children`, Portal, Error Boundary, Suspense boundaries, Atomic/Feature-Sliced структура модулей.
