export type QuestionItem = {
  id: string;
  question: string;
  answer: string;
};

export type QuestionSection = {
  id: string;
  title: string;
  items: QuestionItem[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

export function parseQuestionsMarkdown(markdown: string): {
  title: string;
  description: string;
  sections: QuestionSection[];
} {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let title = 'Questions';
  const descriptionParts: string[] = [];
  const sections: QuestionSection[] = [];

  let currentSection: QuestionSection | null = null;
  let currentItem: QuestionItem | null = null;
  const answerLines: string[] = [];

  const flushAnswer = () => {
    if (!currentItem || !currentSection) return;
    currentItem.answer = answerLines.join('\n').trim();
    answerLines.length = 0;
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith('## ')) {
      flushAnswer();
      currentItem = null;
      currentSection = {
        id: slugify(line.slice(3)),
        title: line.slice(3).trim(),
        items: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (line.startsWith('### ')) {
      flushAnswer();
      if (!currentSection) {
        currentSection = {
          id: 'general',
          title: 'General',
          items: [],
        };
        sections.push(currentSection);
      }

      const question = line.slice(4).trim();
      currentItem = {
        id: `${currentSection.id}-${slugify(question)}`,
        question,
        answer: '',
      };
      currentSection.items.push(currentItem);
      continue;
    }

    if (line.trim() === '---') {
      continue;
    }

    if (currentItem) {
      answerLines.push(line);
      continue;
    }

    if (!currentSection && line.trim()) {
      descriptionParts.push(line.trim());
    }
  }

  flushAnswer();

  return {
    title,
    description: descriptionParts.join(' '),
    sections,
  };
}
