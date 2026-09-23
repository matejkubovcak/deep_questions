import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadQuestions, validateQuestions } from '../utils/questionLoader.js'
import { decks, findDeck, selectQuestions } from '../data/decks.js'

const STORAGE_KEY = 'deep-questions-state'

export const useQuestionStore = defineStore('questions', () => {
  const questions = ref([])
  const currentQuestionId = ref(null)
  const viewedQuestionIds = ref(new Set())
  const selectedTopicIds = ref([])
  const navigationMode = ref('sequential')
  const isLoading = ref(true)
  const error = ref(null)

  const activeQuestions = computed(() =>
    selectQuestions(questions.value, selectedTopicIds.value)
  )

  const totalQuestions = computed(() => activeQuestions.value.length)

  const currentQuestion = computed(() => {
    if (activeQuestions.value.length === 0) return null
    return (
      activeQuestions.value.find((question) => question.id === currentQuestionId.value) ||
      activeQuestions.value[0]
    )
  })

  const deckPosition = computed(() => {
    const index = activeQuestions.value.findIndex(
      (question) => question.id === currentQuestion.value?.id
    )
    return index >= 0 ? index + 1 : 0
  })

  const activeDeckLabel = computed(() => {
    if (selectedTopicIds.value.length === 0) return 'All'
    if (selectedTopicIds.value.length === 1) {
      return findDeck(selectedTopicIds.value[0])?.name || 'Topic'
    }
    return 'Mixed'
  })

  const viewedQuestions = computed(() => {
    const activeIds = new Set(activeQuestions.value.map((question) => question.id))
    return new Set([...viewedQuestionIds.value].filter((id) => activeIds.has(id)))
  })

  const progressPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((viewedQuestions.value.size / totalQuestions.value) * 100)
  })

  const deckOptions = computed(() => {
    const knownIds = new Set(questions.value.map((question) => question.id))
    return decks.map((deck) => ({
      ...deck,
      count: deck.questionIds.filter((id) => knownIds.has(id)).length,
    }))
  })

  const replaceViewed = (next) => {
    viewedQuestionIds.value = next
  }

  const markViewed = (id) => {
    if (id == null) return
    const next = new Set(viewedQuestionIds.value)
    next.add(id)
    replaceViewed(next)
  }

  const ensureCurrentVisible = () => {
    const list = activeQuestions.value
    if (list.length === 0) return
    if (!list.some((question) => question.id === currentQuestionId.value)) {
      currentQuestionId.value = list[0].id
    }
  }

  const loadPersistedState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const state = JSON.parse(stored)
      const byIndex = questions.value

      if (state.version === 2) {
        if (state.currentQuestionId != null) {
          currentQuestionId.value = state.currentQuestionId
        }
        if (Array.isArray(state.viewedQuestionIds)) {
          replaceViewed(new Set(state.viewedQuestionIds))
        }
        if (Array.isArray(state.selectedTopicIds)) {
          selectedTopicIds.value = state.selectedTopicIds.filter((id) => findDeck(id))
        }
      } else {
        if (
          state.currentQuestionIndex !== undefined &&
          byIndex[state.currentQuestionIndex]
        ) {
          currentQuestionId.value = byIndex[state.currentQuestionIndex].id
        }
        if (Array.isArray(state.viewedQuestions)) {
          replaceViewed(
            new Set(
              state.viewedQuestions
                .map((index) => byIndex[index]?.id)
                .filter((id) => id != null)
            )
          )
        }
      }

      if (
        state.navigationMode &&
        ['sequential', 'random'].includes(state.navigationMode)
      ) {
        navigationMode.value = state.navigationMode
      }

      ensureCurrentVisible()
    } catch (loadError) {
      console.warn('Failed to load persisted state:', loadError)
    }
  }

  const saveState = () => {
    try {
      const state = {
        version: 2,
        currentQuestionId: currentQuestionId.value,
        viewedQuestionIds: Array.from(viewedQuestionIds.value),
        selectedTopicIds: selectedTopicIds.value,
        navigationMode: navigationMode.value,
        lastViewedDate: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (saveError) {
      console.warn('Failed to save state:', saveError)
    }
  }

  const initializeQuestions = async () => {
    isLoading.value = true
    error.value = null

    try {
      const loadedQuestions = await loadQuestions()

      if (validateQuestions(loadedQuestions)) {
        questions.value = loadedQuestions
        loadPersistedState()
        if (currentQuestionId.value == null && loadedQuestions[0]) {
          currentQuestionId.value = loadedQuestions[0].id
        }
        ensureCurrentVisible()
      } else {
        throw new Error('Invalid question data format')
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to initialize questions:', err)
    } finally {
      isLoading.value = false
    }
  }

  const goToNextQuestion = () => {
    const list = activeQuestions.value
    if (list.length === 0) return

    const currentId = currentQuestion.value?.id
    markViewed(currentId)

    if (navigationMode.value === 'sequential') {
      const index = list.findIndex((question) => question.id === currentId)
      const nextIndex = index < 0 ? 0 : (index + 1) % list.length
      currentQuestionId.value = list[nextIndex].id
      return
    }

    const unviewed = list.filter((question) => !viewedQuestionIds.value.has(question.id))
    if (unviewed.length > 0) {
      const pick = unviewed[Math.floor(Math.random() * unviewed.length)]
      currentQuestionId.value = pick.id
      return
    }

    const cleared = new Set(viewedQuestionIds.value)
    for (const question of list) cleared.delete(question.id)
    const pick = list[Math.floor(Math.random() * list.length)]
    cleared.add(pick.id)
    replaceViewed(cleared)
    currentQuestionId.value = pick.id
  }

  const goToPreviousQuestion = () => {
    const list = activeQuestions.value
    if (list.length === 0) return

    const index = list.findIndex((question) => question.id === currentQuestion.value?.id)
    const previousIndex = index <= 0 ? list.length - 1 : index - 1
    currentQuestionId.value = list[previousIndex].id
  }

  const goToRandomQuestion = () => {
    const list = activeQuestions.value
    if (list.length === 0) return

    const pick = list[Math.floor(Math.random() * list.length)]
    currentQuestionId.value = pick.id
    markViewed(pick.id)
  }

  const setNavigationMode = (mode) => {
    if (['sequential', 'random'].includes(mode)) {
      navigationMode.value = mode
    }
  }

  const toggleTopic = (topicId) => {
    if (!findDeck(topicId)) return

    const current = selectedTopicIds.value
    selectedTopicIds.value = current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId]
    ensureCurrentVisible()
  }

  const selectAllTopics = () => {
    selectedTopicIds.value = []
    ensureCurrentVisible()
  }

  const resetProgress = () => {
    currentQuestionId.value = activeQuestions.value[0]?.id ?? questions.value[0]?.id ?? null
    replaceViewed(new Set())
    navigationMode.value = 'sequential'
  }

  watch(
    [currentQuestionId, viewedQuestionIds, selectedTopicIds, navigationMode],
    saveState,
    { deep: true }
  )

  return {
    questions,
    currentQuestionId,
    viewedQuestionIds,
    selectedTopicIds,
    navigationMode,
    isLoading,
    error,
    decks,
    deckOptions,
    activeQuestions,
    totalQuestions,
    currentQuestion,
    deckPosition,
    activeDeckLabel,
    viewedQuestions,
    progressPercentage,
    initializeQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    goToRandomQuestion,
    setNavigationMode,
    toggleTopic,
    selectAllTopics,
    resetProgress,
  }
})
