/**
 * Loads and parses questions from the questions.txt file
 * @returns {Promise<Array<{id: number, text: string}>>}
 */
export async function loadQuestions() {
  try {
    const response = await fetch('/questions.txt')
    const text = await response.text()
    
    return parseQuestions(text)
  } catch (error) {
    console.error('Failed to load questions:', error)
    return []
  }
}

/**
 * Parses the questions text into structured data
 * @param {string} text - Raw text from questions.txt
 * @returns {Array<{id: number, text: string}>}
 */
export function parseQuestions(text) {
  const lines = text.split('\n').filter(line => line.trim())
  const questions = []
  
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/)
    if (match) {
      const [, id, text] = match
      questions.push({
        id: parseInt(id),
        text: text.trim()
      })
    }
  }
  
  return questions
}

/**
 * Validates question data structure
 * @param {Array} questions - Array of question objects
 * @returns {boolean}
 */
export function validateQuestions(questions) {
  if (!Array.isArray(questions)) return false
  
  return questions.every(q => 
    typeof q === 'object' && 
    typeof q.id === 'number' && 
    typeof q.text === 'string' &&
    q.text.length > 0
  )
} 