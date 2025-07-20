import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadQuestions, validateQuestions } from '../utils/questionLoader.js'

const STORAGE_KEY = 'deep-questions-state'

export const useQuestionStore = defineStore('questions', () => {
  // State
  const questions = ref([])
  const currentQuestionIndex = ref(0)
  const viewedQuestions = ref(new Set())
  const navigationMode = ref('sequential')
  const isLoading = ref(true)
  const error = ref(null)

  // Computed
  const totalQuestions = computed(() => questions.value.length)
  const currentQuestion = computed(() => {
    if (questions.value.length === 0) return null
    return questions.value[currentQuestionIndex.value]
  })
  
  const progressPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((viewedQuestions.value.size / totalQuestions.value) * 100)
  })
  
  const isAllQuestionsViewed = computed(() => {
    return viewedQuestions.value.size === totalQuestions.value
  })
  
  const unviewedQuestions = computed(() => {
    return questions.value
      .map((q, index) => ({ ...q, index }))
      .filter(q => !viewedQuestions.value.has(q.index))
  })

  // Actions
  const loadPersistedState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const state = JSON.parse(stored)
        
        // Validate and restore state
        if (state.currentQuestionIndex !== undefined) {
          currentQuestionIndex.value = state.currentQuestionIndex
        }
        if (state.viewedQuestions && Array.isArray(state.viewedQuestions)) {
          viewedQuestions.value = new Set(state.viewedQuestions)
        }
        if (state.navigationMode && ['sequential', 'random'].includes(state.navigationMode)) {
          navigationMode.value = state.navigationMode
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error)
    }
  }

  const saveState = () => {
    try {
      const state = {
        currentQuestionIndex: currentQuestionIndex.value,
        viewedQuestions: Array.from(viewedQuestions.value),
        navigationMode: navigationMode.value,
        lastViewedDate: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to save state:', error)
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
    if (questions.value.length === 0) return
    
    // Mark current question as viewed
    viewedQuestions.value.add(currentQuestionIndex.value)
    
    if (navigationMode.value === 'sequential') {
      currentQuestionIndex.value = (currentQuestionIndex.value + 1) % questions.value.length
    } else {
      // Random mode - get next unviewed question
      const unviewed = unviewedQuestions.value
      if (unviewed.length > 0) {
        const randomIndex = Math.floor(Math.random() * unviewed.length)
        currentQuestionIndex.value = unviewed[randomIndex].index
      } else {
        // All questions viewed, reset and go random
        viewedQuestions.value.clear()
        currentQuestionIndex.value = Math.floor(Math.random() * questions.value.length)
      }
    }
  }

  const goToPreviousQuestion = () => {
    if (questions.value.length === 0) return
    
    currentQuestionIndex.value = currentQuestionIndex.value > 0 
      ? currentQuestionIndex.value - 1 
      : questions.value.length - 1
  }

  const goToRandomQuestion = () => {
    if (questions.value.length === 0) return
    
    const randomIndex = Math.floor(Math.random() * questions.value.length)
    currentQuestionIndex.value = randomIndex
    viewedQuestions.value.add(randomIndex)
  }

  const setNavigationMode = (mode) => {
    if (['sequential', 'random'].includes(mode)) {
      navigationMode.value = mode
    }
  }

  const resetProgress = () => {
    currentQuestionIndex.value = 0
    viewedQuestions.value.clear()
    navigationMode.value = 'sequential'
  }

  // Watch for state changes and auto-save
  watch([currentQuestionIndex, viewedQuestions, navigationMode], saveState, { deep: true })

  return {
    // State
    questions,
    currentQuestionIndex,
    viewedQuestions,
    navigationMode,
    isLoading,
    error,
    
    // Computed
    totalQuestions,
    currentQuestion,
    progressPercentage,
    isAllQuestionsViewed,
    unviewedQuestions,
    
    // Actions
    initializeQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    goToRandomQuestion,
    setNavigationMode,
    resetProgress
  }
}) 