import { type ComponentType } from 'react';
import ReactMarkdown from 'react-markdown';
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { QuestionsPage } from './QuestionsPage';
import './markdown.css';

const taskModules = import.meta.glob('../tasks/*.tsx', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

const answerModules = import.meta.glob('../answers/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

type Task = {
  id: string;
  Component: ComponentType;
};

function getComponent(module: Record<string, unknown>): ComponentType | null {
  if (typeof module.default === 'function') {
    return module.default as ComponentType;
  }

  const exported = Object.values(module).find((value) => typeof value === 'function');
  return (exported as ComponentType | undefined) ?? null;
}

function fileIdFromPath(path: string) {
  return path.split('/').pop()?.replace(/\.(tsx|md)$/, '') ?? path;
}

const tasks: Task[] = Object.entries(taskModules)
  .map(([path, module]) => {
    const id = fileIdFromPath(path);
    const Component = getComponent(module);
    return Component ? { id, Component } : null;
  })
  .filter((task): task is Task => task !== null)
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const tasksById = Object.fromEntries(tasks.map((task) => [task.id, task]));

const answersById = Object.fromEntries(
  Object.entries(answerModules).map(([path, content]) => [fileIdFromPath(path), content]),
);

const linkStyle = {
  color: '#111',
  textDecoration: 'none',
} as const;

const buttonLinkStyle = {
  padding: '6px 12px',
  border: '1px solid #bbb',
  borderRadius: 6,
  background: '#fff',
  color: '#111',
  textDecoration: 'none',
} as const;

const examLinkStyle = {
  display: 'inline-block',
  padding: '10px 16px',
  border: '1px solid #bbb',
  borderRadius: 8,
  background: '#111',
  color: '#fff',
  textDecoration: 'none',
} as const;

const exams = [
  {
    title: 'JS Questions',
    description: 'Theory questions with expandable answers.',
    enPath: '/questions',
    ruPath: '/questions/ru',
  },
  {
    title: 'React Questions',
    description: 'React theory exam with expandable answers.',
    enPath: '/react-questions',
    ruPath: '/react-questions/ru',
  },
  {
    title: 'TypeScript Questions',
    description: 'TypeScript theory exam with expandable answers.',
    enPath: '/typescript-questions',
    ruPath: '/typescript-questions/ru',
  },
  {
    title: 'State Managers',
    description: 'Redux, Redux Toolkit, MobX and related patterns.',
    enPath: '/state-managers-questions',
    ruPath: '/state-managers-questions/ru',
  },
  {
    title: 'Frontend Questions',
    description: 'HTML, CSS, browser, performance, security, tooling.',
    enPath: '/frontend-questions',
    ruPath: '/frontend-questions/ru',
  },
] as const;

function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1 style={{ marginTop: 0 }}>React Interview</h1>

      {exams.map((exam) => (
        <section key={exam.enPath} style={{ marginBottom: 32 }}>
          <h2>{exam.title}</h2>
          <p style={{ color: '#444' }}>{exam.description}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={exam.enPath} style={examLinkStyle}>
              English
            </Link>
            <Link to={exam.ruPath} style={examLinkStyle}>
              Русский
            </Link>
          </div>
        </section>
      ))}

      <section>
        <h2>React Interview Tasks</h2>
        <p style={{ color: '#444' }}>Выберите задание:</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/${task.id}`}
              style={{
                padding: '10px 16px',
                border: '1px solid #bbb',
                borderRadius: 8,
                background: '#111',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {task.id}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function TaskPage() {
  const { taskId = '' } = useParams();
  const task = tasksById[taskId];

  if (!task) {
    return <Navigate to="/" replace />;
  }

  const ActiveComponent = task.Component;
  const hasSolution = task.id in answersById;

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid #ddd',
          background: '#f7f7f7',
        }}
      >
        <Link to="/" style={linkStyle}>
          ← Все задания
        </Link>
        <strong style={{ flex: 1 }}>{task.id}</strong>
        {hasSolution ? (
          <Link to={`/${task.id}/solution`} style={buttonLinkStyle}>
            Подсказка
          </Link>
        ) : null}
      </nav>
      <ActiveComponent />
    </div>
  );
}

function normalizeMarkdown(content: string) {
  return content
    .trim()
    .replace(/^•\s+/gm, '- ')
    .replace(/```\s*\n(tsx|ts|jsx|js|css|html|bash|json)\n/g, '```$1\n');
}

function SolutionPage() {
  const { taskId = '' } = useParams();
  const task = tasksById[taskId];
  const content = answersById[taskId];

  if (!task || content === undefined) {
    return <Navigate to={task ? `/${task.id}` : '/'} replace />;
  }

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid #ddd',
          background: '#f7f7f7',
        }}
      >
        <Link to={`/${task.id}`} style={linkStyle}>
          ← К заданию
        </Link>
        <strong>Подсказка: {task.id}</strong>
      </nav>
      <article className="markdown">
        <ReactMarkdown>{normalizeMarkdown(content)}</ReactMarkdown>
      </article>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={<QuestionsPage subject="js" locale="en" />} />
        <Route path="/questions/ru" element={<QuestionsPage subject="js" locale="ru" />} />
        <Route path="/react-questions" element={<QuestionsPage subject="react" locale="en" />} />
        <Route path="/react-questions/ru" element={<QuestionsPage subject="react" locale="ru" />} />
        <Route path="/typescript-questions" element={<QuestionsPage subject="typescript" locale="en" />} />
        <Route path="/typescript-questions/ru" element={<QuestionsPage subject="typescript" locale="ru" />} />
        <Route path="/state-managers-questions" element={<QuestionsPage subject="state-managers" locale="en" />} />
        <Route path="/state-managers-questions/ru" element={<QuestionsPage subject="state-managers" locale="ru" />} />
        <Route path="/frontend-questions" element={<QuestionsPage subject="frontend" locale="en" />} />
        <Route path="/frontend-questions/ru" element={<QuestionsPage subject="frontend" locale="ru" />} />
        <Route path="/:taskId/solution" element={<SolutionPage />} />
        <Route path="/:taskId" element={<TaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}
