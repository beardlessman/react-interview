# Экзамен по стейт-менеджерам

Типичные вопросы с краткими ответами.

---

## Общие концепции

### Что такое состояние (state) во фронтенд-приложении?

Данные, от которых зависит UI: пользовательский ввод, ответы API, UI-флаги (модалки, табы), кэш. Состояние меняется во времени; при изменении UI должен отражать новые данные.

### Чем локальный state отличается от глобального?

- Локальный — внутри компонента (`useState`, `useReducer`): форма, hover, открыт/закрыт dropdown.
- Глобальный — доступен многим компонентам через store/Context: сессия, корзина, тема, кэш сущностей.

Правило: держать state максимально близко к месту использования; поднимать/выносить в store только когда реально нужен нескольким веткам дерева.

### Когда нужен отдельный store, а когда хватит `useState` / Context?

Store нужен при: сложном общем состоянии, частых обновлениях из разных мест, предсказуемых переходах, middleware/devtools, нормализации сущностей.  
`useState` — локальный UI. Context — редко меняющиеся «конфиги» (тема, locale, auth user). Context как store для частого state → лишние ре-рендеры.

### Что такое Flux и однонаправленный поток данных?

Паттерн: View → Action → Dispatcher/Store → обновление Store → View. Данные текут в одну сторону; View не мутирует store напрямую. Redux — развитие Flux (один store, чистые reducers).

### Что такое иммутабельность и зачем она в state management?

Не изменять объекты/массивы на месте, а создавать новые ссылки. Плюсы: предсказуемые обновления, простое сравнение (`===`), time-travel/devtools, безопасный sharing. В Redux/RTK обязательна; в MobX допускаются мутации внутри `action`.

### Что такое селекторы?

Функции, которые достают/вычисляют данные из store: `state => state.user.name`. Мемоизированные (`reselect`, `createSelector`) пересчитывают результат только при изменении входных кусков state — меньше лишних ре-рендеров.

### Что такое middleware в контексте store?

Прослойка между `dispatch` и reducer: логирование, crash reporting, async (thunk), роутинг. В Redux: `(store) => (next) => (action) => ...`. RTK уже подключает `redux-thunk` и DevTools.

### Чем thunk отличается от saga (кратко)?

- Thunk — функция, которую middleware вызывает с `dispatch`/`getState`; удобен для простых async (fetch → dispatch).
- Saga — генераторы + эффекты (`call`, `put`, `take`), удобнее сложные потоки: отмена, debounce, гонки, фоновые сценарии. Для большинства приложений достаточно thunk / `createAsyncThunk` / RTK Query.

### Что такое нормализованный state?

Хранение коллекций в виде `{ ids: [], entities: { [id]: item } }` вместо вложенных деревьев. Плюсы: нет дублирования, O(1) обновление по id, проще селекторы. В RTK — `createEntityAdapter`.

### Какие стратегии side effects используют со store?

1. В компоненте (`useEffect`) — просто, но размазано.  
2. Thunk / `createAsyncThunk` — рядом с логикой store.  
3. Saga / listener middleware — сложные сценарии.  
4. RTK Query / React Query — кэш серверных данных и запросы «из коробки».  
Выбор зависит от сложности и того, server vs client state.

### Чем client state отличается от server state?

- Client: UI, черновики форм, выбранные фильтры — источник истины на клиенте.  
- Server: данные с API — кэш с stale/refetch, ошибки, пагинация.  
Для server state часто лучше RTK Query / TanStack Query, чем ручной Redux.

### Что такое single source of truth?

Один канонический источник данных для домена (store или query-кэш). Избегает рассинхрона копий в разных компонентах. Не значит «всё в одном гигантском объекте» — локальный UI-state может жить отдельно.

---

## Redux

### Что такое Redux и какие у него принципы?

Библиотека предсказуемого state container. Принципы: единый store; state read-only (меняем через `dispatch`); изменения через чистые reducers `(state, action) => newState`.

### Из каких частей состоит классический Redux?

Store, actions (plain objects с `type`), reducers, `dispatch`, `subscribe`, иногда `combineReducers`, middleware, `bindActionCreators`. UI подключается через `react-redux`.

### Что такое store? Как его создать в классическом Redux?

Объект с `getState`, `dispatch`, `subscribe`, `replaceReducer`.  
`createStore(reducer, preloadedState?, enhancer?)` — в современном коде предпочитают RTK `configureStore`.

### Что такое action?

Plain object, описывающий «что произошло»: минимум `{ type: 'todos/add' }`, часто с `payload`. Action creators — функции, возвращающие action. В RTK типы генерируются в `createSlice`.

### Что такое reducer?

Чистая функция `(state, action) => nextState`. Без side effects, без мутаций (в classic Redux), детерминированная. На неизвестный action возвращает прежний `state`.

### Что делает `dispatch`?

Единственный способ инициировать изменение: `store.dispatch(action)`. Action проходит middleware → root reducer → новый state → уведомление подписчиков → ре-рендер.

### Для чего `subscribe`?

Подписка на любое изменение store: `const unsub = store.subscribe(listener)`. В React обычно не вызывают вручную — это делает `react-redux`.

### Как связаны `combineReducers` и структура state?

`combineReducers({ users, posts })` даёт state вида `{ users, posts }`. Каждый slice-reducer отвечает за свой ключ. Root reducer делегирует action всем дочерним.

### Чем `connect` отличается от хуков `useSelector` / `useDispatch`?

- `connect(mapState, mapDispatch)(Component)` — HOC, классовый/старый стиль.  
- Хуки — в function components: `useSelector` читает slice, `useDispatch` даёт `dispatch`.  
Современный стандарт — хуки; `connect` встречается в legacy.

### Как `useSelector` решает, нужно ли ре-рендерить?

По умолчанию строгое `===` сравнение результата селектора. Если вернуть новый объект/массив каждый раз — лишние рендеры. Решение: выбирать примитивы/ссылки стабильно или мемоизировать селектор; при необходимости свой `equalityFn`.

### Что такое action creator и зачем payload convention?

Функция `addTodo(text) => ({ type: 'ADD', payload: text })`. FSA-подобная конвенция (`payload`, `error`, `meta`) упрощает middleware и RTK. В `createSlice` action creators создаются автоматически.

### Можно ли в reducer делать async / API-вызовы?

Нет — reducer должен быть чистым и синхронным. Async — в middleware (thunk), listeners, RTK Query или в UI-эффектах с последующим `dispatch` sync-actions.

### Что такое Redux DevTools и зачем time-travel?

Расширение: лог actions, diff state, «отмотка» к прошлым состояниям. Работает благодаря иммутабельности и чистым reducers. В RTK включается через `configureStore` по умолчанию в dev.

### Как типизировать Redux на TypeScript (кратко)?

Типы `RootState` и `AppDispatch` из store; хуки `useAppSelector` / `useAppDispatch`; в RTK — inferred types из `createSlice` / `createAsyncThunk`. Избегать `any` у `payload`.

---

## Redux Toolkit

### Что такое Redux Toolkit (RTK) и какую проблему решает?

Официальный способ писать Redux: меньше boilerplate, Immer из коробки, хорошие defaults (`configureStore`), встроенный thunk, упрощённые slices и async. Рекомендация Redux-команды вместо «ручного» classic setup.

### Что делает `configureStore`?

Создаёт store с разумными defaults: объединяет reducers, подключает thunk и DevTools, проверяет сериализуемость/иммутабельность в dev. Замена `createStore` + ручной `applyMiddleware`.

### Что такое `createSlice`?

API: имя slice, `initialState`, объект `reducers` (и опционально `extraReducers`). Генерирует action creators и action types. Внутри reducers можно «мутировать» draft — Immer делает иммутабельный результат.

### Как работает Immer в RTK?

Reducers получают Proxy-draft. Можно писать `state.value = 1` или `state.list.push(x)`. Immer фиксирует изменения и возвращает новый state. Нельзя смешивать мутацию draft и `return` нового объекта в одном reducer без понимания правил Immer.

### Что такое `createAsyncThunk`?

Фабрика async action creators: pending / fulfilled / rejected. В `payloadCreator` — запрос; результаты обрабатывают в `extraReducers` или `builder.addCase`. Упрощает типичный fetch-цикл без ручных трёх action types.

### Как обрабатывать результат thunk в slice?

Через `extraReducers: (builder) => { builder.addCase(fetchUser.pending, ...).addCase(fetchUser.fulfilled, ...) }` или map-notation. Обновляют `status`, `error`, данные в state.

### Что такое `createEntityAdapter`?

Хелпер нормализованных коллекций: `ids` + `entities`, CRUD-редьюсеры (`addOne`, `setAll`, `updateOne`, `removeOne`), селекторы (`selectAll`, `selectById`). Удобно для списков с частыми точечными обновлениями.

### Что такое RTK Query?

Модуль data fetching/кэширования в RTK: описываете `createApi` + endpoints (`query`/`mutation`), получаете хуки (`useGetPostsQuery`). Кэш, дедуп запросов, инвалидация тегами, refetch — без ручных thunks для CRUD API.

### Чем `query` отличается от `mutation` в RTK Query?

- `query` — чтение (GET-подобные), кэшируется по аргументам.  
- `mutation` — запись (POST/PUT/DELETE); после успеха обычно `invalidateTags` для обновления кэша queries.

### Что такое tag-based инвалидация в RTK Query?

Endpoints помечают данные тегами (`providesTags` / `invalidatesTags`). Mutation инвалидирует тег → связанные queries refetch. Проще, чем вручную синхронизировать кэш.

### Нужен ли ещё redux-thunk отдельно при RTK?

Обычно нет: `configureStore` уже добавляет thunk middleware. Отдельно подключают другие middleware (saga, custom) через `middleware: (getDefault) => getDefault().concat(...)`.

### Что такое listener middleware в RTK?

`createListenerMiddleware` — реакция на actions (как лёгкая альтернатива части сценариев saga): side effects, debounce, синхронизация, без генераторов. Удобно для «когда action X — сделай Y».

### Как организовать slices в большом приложении?

По доменам/фичам: `userSlice`, `cartSlice`, feature-folders. Root — `configureStore({ reducer: { user, cart, api: api.reducer } })`. Избегать god-slice «на всё».

### Чем RTK паттерны отличаются от «классического» Redux-кода?

Меньше ручных constants/action creators; Immer вместо ручного spread; `configureStore` вместо самосборки; async через `createAsyncThunk`/RTK Query; меньше файлов на feature. Семантика (actions → reducers → store) та же.

---

## MobX

### Что такое MobX?

Библиотека реактивного state: помечаете данные как `observable`, реакции/компоненты автоматически отслеживают чтения и обновляются при изменениях. Мутации обычно через `action`. Меньше boilerplate, чем у Redux.

### Что такое `observable`?

Данные, за изменениями которых следит runtime MobX. Чтение внутри `observer`/`computed`/`reaction` регистрирует зависимость; запись планирует пересчёт зависимых реакций.

### Что такое `action` в MobX?

Функция, которая изменяет observable. Группирует мутации в одну транзакцию (меньше промежуточных ре-рендеров). В strict mode менять state вне `action` нельзя.

### Что такое `computed`?

Производное значение из observable (как мемоизированный селектор). Кэшируется и пересчитывается только при изменении зависимостей. Пример: `get fullName() { return this.first + ' ' + this.last }`.

### Чем `reaction` / `autorun` / `when` отличаются?

- `autorun` — сразу запускается и при каждой релевантной смене зависимостей.  
- `reaction` — отдельно tracking-функция и эффект; эффект только при смене выбранного значения.  
- `when` — разово, когда предикат станет true.  
Для UI чаще хватает `observer`; reactions — для side effects вне React.

### Что делает `observer` (mobx-react)?

HOC/обёртка компонента: при рендере трекает читаемые observable и подписывает компонент. Меняется зависимость → ре-рендер только этого `observer`-компонента (при правильной гранулярности).

### Что такое `makeAutoObservable` / `makeObservable`?

- `makeObservable` — явное перечисление полей (`observable`, `action`, `computed`).  
- `makeAutoObservable` — выводит аннотации автоматически (поля → observable, геттеры → computed, методы → action). Быстрый старт; исключения — через overrides.

### Что такое strict mode (`enforceActions`) в MobX?

Режим, при котором state можно менять только внутри `action` (часто `enforceActions: 'observed'` или `'always'`). Ловит случайные мутации вне транзакций, делает поток изменений явным.

### Как MobX отслеживает зависимости (reactivity tracking)?

При выполнении реакции/рендера `observer` MobX собирает прочитанные observable-поля. Подписка точечная: изменили непрочитанное поле — компонент не обновится. Важно не деструктурировать observables «до» трекинга бездумно.

### Можно ли мутировать state в MobX?

Да — это идиоматично внутри `action` (в отличие от Redux). MobX сам уведомляет подписчиков. Снаружи React всё равно лучше не плодить скрытые мутации без actions.

### Как структурируют stores в MobX?

Часто class-stores или object-stores по доменам + root store / React Context для DI. Не обязательно один глобальный объект; важны явные границы и `observer` на листьях UI.

### MobX 6 — что важно помнить относительно старых версий?

Декораторы не обязательны: `makeObservable` / `makeAutoObservable`. Нужна конфигурация proxy (по умолчанию). API стабильнее для TypeScript без experimental decorators. Паттерн «class + makeAutoObservable» — типичный современный стиль.

---

## Сравнение и практика

### Redux vs MobX: в чём главная разница подходов?

Redux — явный unidirectional поток, иммутабельный state, все изменения через actions/reducers (легко аудитить).  
MobX — реактивные мутации, меньше церемоний, автоматические зависимости.  
Redux предсказуемее в больших командах; MobX быстрее писать для сложных объектных графов.

### Когда выбрать Redux/RTK, когда MobX?

- RTK: нужен строгий audit trail, DevTools/time-travel, большая команда, много async/server cache (RTK Query).  
- MobX: богатая доменная модель, частые локальные мутации, хочется меньше boilerplate.  
- Zustand: простой глобальный state без «религии» Redux — хороший лёгкий вариант.

### Что такое Zustand и чем он близок к Redux/RTK?

Минималистичный store на хуках: `create((set, get) => ({ ... }))`. Нет обязательных actions/reducers; можно писать иммутабельно или с Immer middleware. Паттерны selectors и slices похожи на упрощённый Redux без Provider (есть optional context).

### Какие performance-ловушки у Redux?

Слишком широкие `useSelector` / возврат новых объектов; огромный state без нормализации; тяжёлые вычисления без мемоизации; частый dispatch мелочей; злоупотребление Context вместо селекторов. Лечится: точечные селекторы, `createSelector`, entity adapter, RTK Query для серверных данных.

### Какие performance-ловушки у MobX?

Крупные `observer`-компоненты, читающие слишком много; деструктуризация observables с потерей трекинга; реакции без dispose; избыточные `autorun`. Лучше мелкие `observer`-компоненты и computed для производных данных.

### Как тестировать Redux store / slices?

Чистые reducers — unit-тесты `(state, action) => next`. Thunks — с mock API и проверкой последовательности dispatch. Интеграционно — `configureStore` + `render` с Provider, проверка UI. RTK упрощает: меньше boilerplate в тестах.

### Как тестировать MobX stores?

Создать store, вызвать actions, проверить поля и `computed`. Для React — рендер под `observer`, менять store, ждать обновления UI. Reactions — проверять вызов эффекта и обязательно dispose в afterEach.

### Как правильно смешивать локальный UI-state и глобальный store?

В store — домен и то, чем делятся маршруты/фичи. В компоненте — эфемерный UI (открыта ли модалка, значение инпута до submit). Не тащить каждый keystroke в Redux «на всякий случай».

### Как организовать side effects: что выбрать на практике?

CRUD API → RTK Query / TanStack Query. Простой запрос + запись в client store → `createAsyncThunk`. Цепочки/отмена/фоновые процессы → listener middleware или saga. UI-only эффекты → `useEffect`. Не дублировать один и тот же fetch в трёх местах.

### Нужен ли Redux, если уже есть React Query / RTK Query?

Не всегда. Server state закрывает query-библиотека; Redux/Zustand/MobX — для сложного client state. Часто гибрид: RTK Query + тонкий client slice (или Zustand) для UI/workflow.

### Как избежать prop drilling без «тяжёлого» store?

Composition, component colocation, Context для редких данных, лёгкий Zustand/MobX store на фичу. Глобальный Redux не обязан решать каждую передачу props на 2 уровня.

### Какие критерии «перезрелого» store (когда упростить)?

Дублирование server cache вручную; actions только чтобы прокинуть props; половина state никогда не шарится; тесты/онбординг больнее фич. Тогда вынести server state в Query, локальное — в компоненты, оставить store для реально общего домена.
