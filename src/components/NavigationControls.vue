<template>
  <div class="navigation-controls">
    <div class="controls-container">
      <button 
        @click="goToPreviousQuestion"
        :disabled="totalQuestions === 0"
        class="btn-secondary control-btn"
        title="Previous question"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Previous
      </button>
      
      <button 
        @click="goToRandomQuestion"
        :disabled="totalQuestions === 0"
        class="btn-outline control-btn"
        title="Random question"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Random
      </button>
      
      <button 
        @click="goToNextQuestion"
        :disabled="totalQuestions === 0"
        class="btn-primary control-btn"
        title="Next question"
      >
        Next
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <div class="secondary-controls">
      <button 
        @click="showResetConfirm = true"
        class="btn-outline reset-btn"
        title="Reset progress"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Reset Progress
      </button>
    </div>
    
    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirm" class="modal-overlay" @click="showResetConfirm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Reset Progress?</h3>
        <p class="modal-message">
          This will clear all your progress and start over. This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button @click="showResetConfirm = false" class="btn-outline">
            Cancel
          </button>
          <button @click="confirmReset" class="btn-primary">
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'

const store = useQuestionStore()
const showResetConfirm = ref(false)

const totalQuestions = computed(() => store.totalQuestions)

const goToNextQuestion = () => {
  store.goToNextQuestion()
}

const goToPreviousQuestion = () => {
  store.goToPreviousQuestion()
}

const goToRandomQuestion = () => {
  store.goToRandomQuestion()
}

const confirmReset = () => {
  store.resetProgress()
  showResetConfirm.value = false
}
</script>

<style scoped>
.navigation-controls {
  padding: 2rem;
}

.controls-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
}

.secondary-controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.modal-message {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 640px) {
  .controls-container {
    flex-direction: column;
    align-items: center;
  }
  
  .control-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .modal-content {
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* Disabled state */
.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 