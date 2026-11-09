import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import questionsEn from '../data/questions_en.md?raw';
import questionsRu from '../data/questions_ru.md?raw';
import { parseQuestionsMarkdown, type QuestionItem } from './parseQuestions';
import './questions.css';
import './markdown.css';

type QuestionsLocale = 'en' | 'ru';

type QuizQuestion = {
  key: string;
  sectionIndex: number;
  itemIndex: number;
  sectionTitle: string;
  item: QuestionItem;
  translation?: QuestionItem;
};

const questionsByLocale = {
  en: parseQuestionsMarkdown(questionsEn),
  ru: parseQuestionsMarkdown(questionsRu),
} as const;

const uiByLocale = {
  en: {
    home: '← Home',
    contents: 'Contents',
    contentsAria: 'Categories',
    randomQuestion: 'Random question',
    anotherQuestion: 'Ещё вопрос',
    close: 'Закрыть',
    category: 'Category',
  },
  ru: {
    home: '← На главную',
    contents: 'Оглавление',
    contentsAria: 'Категории',
    randomQuestion: 'Случайный вопрос',
    anotherQuestion: 'Ещё вопрос',
    close: 'Закрыть',
    category: 'Категория',
  },
} as const;

function normalizeMarkdown(content: string) {
  return content
    .trim()
    .replace(/^•\s+/gm, '- ')
    .replace(/```\s*\n(tsx|ts|jsx|js|css|html|bash|json)\n/g, '```$1\n');
}

function pickRandomQuestion(pool: QuizQuestion[], excludeKey?: string) {
  const candidates = excludeKey ? pool.filter((item) => item.key !== excludeKey) : pool;
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)] ?? null;
}

function QuestionCard({
  item,
  translation,
  canTranslate,
}: {
  item: QuestionItem;
  translation?: QuestionItem;
  canTranslate: boolean;
}) {
  const [showRussian, setShowRussian] = useState(false);
  const active = canTranslate && showRussian && translation ? translation : item;

  const toggleTranslation = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowRussian((value) => !value);
  };

  return (
    <details className="question-item">
      <summary>
        <span className="question-summary-text">{active.question}</span>
        {canTranslate && translation ? (
          <button
            type="button"
            className="question-translate-btn"
            onClick={toggleTranslation}
            aria-pressed={showRussian}
            title={showRussian ? 'Show English' : 'Show Russian translation'}
          >
            {showRussian ? 'EN' : 'RU'}
          </button>
        ) : null}
      </summary>
      <div className="question-answer">
        <div className="markdown">
          <ReactMarkdown>{normalizeMarkdown(active.answer)}</ReactMarkdown>
        </div>
      </div>
    </details>
  );
}

function RandomQuestionModal({
  question,
  canTranslate,
  labels,
  onClose,
  onAnother,
}: {
  question: QuizQuestion;
  canTranslate: boolean;
  labels: (typeof uiByLocale)[QuestionsLocale];
  onClose: () => void;
  onAnother: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="random-question-backdrop" onClick={onClose} role="presentation">
      <div
        className="random-question-modal"
        role="dialog"
        aria-modal="true"
        aria-label={labels.randomQuestion}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="random-question-header">
          <div>
            <p className="random-question-kicker">{labels.randomQuestion}</p>
            <p className="random-question-category">
              {labels.category}: {question.sectionTitle}
            </p>
          </div>
          <button type="button" className="random-question-close" onClick={onClose}>
            ×
          </button>
        </div>

        <QuestionCard
          key={question.key}
          item={question.item}
          canTranslate={canTranslate}
          translation={question.translation}
        />

        <div className="random-question-actions">
          <button type="button" className="random-question-secondary" onClick={onClose}>
            {labels.close}
          </button>
          <button type="button" className="random-question-primary" onClick={onAnother}>
            {labels.anotherQuestion}
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuestionsPage({ locale }: { locale: QuestionsLocale }) {
  const { title, description, sections } = questionsByLocale[locale];
  const ui = uiByLocale[locale];
  const canTranslate = locale === 'en';
  const russianSections = questionsByLocale.ru.sections;
  const [randomQuestion, setRandomQuestion] = useState<QuizQuestion | null>(null);
  const [randomPool, setRandomPool] = useState<QuizQuestion[]>([]);

  const quizPool = useMemo<QuizQuestion[]>(() => {
    return sections.flatMap((section, sectionIndex) =>
      section.items.map((item, itemIndex) => ({
        key: `${sectionIndex}-${itemIndex}-${item.id}`,
        sectionIndex,
        itemIndex,
        sectionTitle: section.title,
        item,
        translation: russianSections[sectionIndex]?.items[itemIndex],
      })),
    );
  }, [sections, russianSections]);

  const sectionPools = useMemo(() => {
    const pools = new Map<number, QuizQuestion[]>();
    for (const question of quizPool) {
      const current = pools.get(question.sectionIndex) ?? [];
      current.push(question);
      pools.set(question.sectionIndex, current);
    }
    return pools;
  }, [quizPool]);

  const openRandomQuestion = (pool: QuizQuestion[]) => {
    const next = pickRandomQuestion(pool);
    if (!next) return;
    setRandomPool(pool);
    setRandomQuestion(next);
  };

  const openAnotherQuestion = () => {
    setRandomQuestion((current) => pickRandomQuestion(randomPool, current?.key));
  };

  return (
    <div>
      <nav className="questions-topnav">
        <Link to="/" style={{ color: '#111', textDecoration: 'none' }}>
          {ui.home}
        </Link>
        <strong className="questions-topnav-title">{title}</strong>
      </nav>

      <main className="questions-page">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}

        <div className="random-question-bar">
          <button
            type="button"
            className="random-question-launch"
            onClick={() => openRandomQuestion(quizPool)}
          >
            {ui.randomQuestion}
          </button>
        </div>

        <nav className="questions-toc" aria-label={ui.contentsAria}>
          <h2>{ui.contents}</h2>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  {section.title}
                  <span className="questions-toc-count">{section.items.length}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, sectionIndex) => (
          <section key={section.id} id={section.id} className="questions-section">
            <div className="questions-section-header">
              <h2>{section.title}</h2>
              <button
                type="button"
                className="random-question-launch random-question-launch-section"
                onClick={() => openRandomQuestion(sectionPools.get(sectionIndex) ?? [])}
              >
                {ui.randomQuestion}
              </button>
            </div>
            <div className="questions-list">
              {section.items.map((item, itemIndex) => (
                <QuestionCard
                  key={item.id}
                  item={item}
                  canTranslate={canTranslate}
                  translation={russianSections[sectionIndex]?.items[itemIndex]}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {randomQuestion ? (
        <RandomQuestionModal
          question={randomQuestion}
          canTranslate={canTranslate}
          labels={ui}
          onClose={() => setRandomQuestion(null)}
          onAnother={openAnotherQuestion}
        />
      ) : null}
    </div>
  );
}
