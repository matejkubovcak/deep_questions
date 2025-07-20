<template>
  <div 
    class="question-display"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading questions...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Failed to load questions</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="retryLoad" class="btn-primary">
        Try Again
      </button>
    </div>
    
    <div v-else-if="currentQuestion" class="question-container">
      <Transition name="fade" mode="out-in">
        <div 
          :key="currentQuestion.id" 
          class="question-content"
          :class="{ 'swiping': isSwiping }"
          :style="cardTransform"
        >
          <div class="question-header">
            <span class="question-number">
              Question {{ currentQuestion.id }} of {{ totalQuestions }}
            </span>
            <span class="progress-indicator">
              {{ viewedQuestions.size }} of {{ totalQuestions }} viewed
            </span>
          </div>
          
          <div class="question-text-container">
            <p class="question-text">
              {{ currentQuestion.text }}
            </p>
          </div>
          
          <div class="question-footer">
            <div class="completion-status">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ progressPercentage }}% complete</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    
    <div v-else class="no-questions">
      <h2>No questions available</h2>
      <p>Please check the questions.txt file</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'

const store = useQuestionStore()

const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)
const currentQuestion = computed(() => store.currentQuestion)
const totalQuestions = computed(() => store.totalQuestions)
const viewedQuestions = computed(() => store.viewedQuestions)
const progressPercentage = computed(() => store.progressPercentage)

// Touch/swipe state
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const currentTouchX = ref(0)
const isSwiping = ref(false)
const minSwipeDistance = 50 // Minimum distance for a swipe to be recognized

// Computed transform for real-time card movement
const cardTransform = computed(() => {
  if (!isSwiping.value) return {}
  
  const deltaX = currentTouchX.value - touchStartX.value
  const translateX = Math.max(-100, Math.min(100, deltaX * 0.3)) // Limit movement and scale it down
  
  return {
    transform: `translateX(${translateX}px)`,
    transition: 'none' // Disable transition during active swipe
  }
})

const retryLoad = () => {
  store.initializeQuestions()
}

const handleTouchStart = (event) => {
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  currentTouchX.value = touch.clientX
  isSwiping.value = true
}

const handleTouchMove = (event) => {
  const touch = event.touches[0]
  currentTouchX.value = touch.clientX
  
  // Prevent default to avoid scrolling while swiping
  event.preventDefault()
}

const handleTouchEnd = (event) => {
  const touch = event.changedTouches[0]
  touchEndX.value = touch.clientX
  touchEndY.value = touch.clientY
  
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  
  // Reset swipe state
  isSwiping.value = false
  
  // Check if the swipe is more horizontal than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // Swipe right - go to previous question
      store.goToPreviousQuestion()
    } else {
      // Swipe left - go to next question
      store.goToNextQuestion()
    }
  }
}
</script>

<style scoped>
.question-display {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-container {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #94a3b8;
  font-size: 1.1rem;
}

.error-container {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ef4444;
}

.error-message {
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.question-container {
  width: 100%;
  max-width: 800px;
}

.question-content {
  text-align: center;
  transition: transform 0.3s ease;
  will-change: transform;
}

.question-content.swiping {
  transition: none;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.question-number {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.progress-indicator {
  font-size: 0.9rem;
  color: #64748b;
}

.question-text-container {
  margin-bottom: 3rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.question-text {
  font-size: 1.75rem;
  line-height: 1.7;
  font-weight: 300;
  color: #f8fafc;
  margin: 0;
}

.question-footer {
  margin-top: 2rem;
}

.completion-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #64748b;
}

.no-questions {
  text-align: center;
  color: #94a3b8;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .question-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .question-text {
    font-size: 1.5rem;
  }
  
  .question-text-container {
    padding: 2rem;
    max-width: 95%;
  }
  
  .progress-bar {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .question-text-container {
    padding: 1.5rem;
  }
  
  .question-text {
    font-size: 1.25rem;
  }
}
</style> 