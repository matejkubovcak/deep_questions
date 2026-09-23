/**
 * Topic decks. Question text lives in questions.txt; decks choose subsets.
 * Philosopher decks are original prompts in the spirit of those traditions,
 * not quotations.
 */
export const decks = [
  {
    id: 'introspection',
    name: 'Introspection',
    description: 'Memory, emotion, and the inner life of the original set.',
    questionIds: range(1, 75),
  },
  {
    id: 'reckoning',
    name: 'Reckoning',
    description: 'Judgment, responsibility, meaning, and what you owe.',
    questionIds: range(76, 90),
  },
  {
    id: 'spark',
    name: 'Spark',
    description: 'Questions meant to crack open something you already know.',
    questionIds: range(91, 102),
  },
  {
    id: 'creativity',
    name: 'Creativity',
    description: 'Prompts for making, playing, and taking an idea seriously.',
    questionIds: range(103, 114),
  },
  {
    id: 'new-worlds',
    name: 'New worlds',
    description: 'Imagine another way a life, a city, or a culture could be arranged.',
    questionIds: [72, ...range(115, 126)],
  },
  {
    id: 'your-work',
    name: 'Your work',
    description: 'What you might actually be doing, and the work that would fit.',
    questionIds: range(127, 138),
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Questions that do not let you off easily.',
    questionIds: [73, 76, 78, 81, 83, 84, 86, 88, 90, ...range(139, 150)],
  },
  {
    id: 'nietzsche',
    name: 'Nietzsche',
    description: 'Self-overcoming, resentment, taste, and whether you would repeat this life.',
    note: 'Original prompts in the spirit of Nietzsche, not quotations.',
    questionIds: range(151, 162),
  },
  {
    id: 'stoics',
    name: 'Stoics',
    description: 'What is yours to do, what is only preferred, and how to meet the day.',
    note: 'Original prompts in the spirit of Epictetus, Marcus Aurelius, and Seneca.',
    questionIds: range(163, 174),
  },
  {
    id: 'socrates',
    name: 'Socrates',
    description: 'Examine a belief you have been using without defining it.',
    note: 'Original prompts in the spirit of the Socratic elenchus.',
    questionIds: range(175, 186),
  },
  {
    id: 'zhuangzi',
    name: 'Zhuangzi',
    description: 'Usefulness, play, and what happens when you stop forcing it.',
    note: 'Original prompts in the spirit of the Zhuangzi.',
    questionIds: range(187, 198),
  },
]

export function range(start, end) {
  const ids = []
  for (let id = start; id <= end; id += 1) ids.push(id)
  return ids
}

export function findDeck(deckId) {
  return decks.find((deck) => deck.id === deckId) || null
}

/**
 * @param {Array<{id: number, text: string}>} questions
 * @param {string[]} topicIds empty means every question
 */
export function selectQuestions(questions, topicIds) {
  if (!topicIds || topicIds.length === 0) return questions

  if (topicIds.length === 1) {
    const deck = findDeck(topicIds[0])
    if (!deck?.questionIds) return questions
    const byId = new Map(questions.map((question) => [question.id, question]))
    return deck.questionIds.map((id) => byId.get(id)).filter(Boolean)
  }

  const union = new Set()
  for (const topicId of topicIds) {
    const deck = findDeck(topicId)
    if (!deck?.questionIds) return questions
    for (const id of deck.questionIds) union.add(id)
  }

  return questions.filter((question) => union.has(question.id))
}
