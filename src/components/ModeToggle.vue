<template>
  <div class="mode-toggle">
    <div class="toggle-container">
      <span class="toggle-label">Navigation Mode:</span>
      <div class="toggle-buttons">
        <button 
          @click="setMode('sequential')"
          :class="[
            'toggle-btn',
            { 'active': navigationMode === 'sequential' }
          ]"
          title="Show questions in order"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          Sequential
        </button>
        
        <button 
          @click="setMode('random')"
          :class="[
            'toggle-btn',
            { 'active': navigationMode === 'random' }
          ]"
          title="Show questions randomly"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Random
        </button>
      </div>
    </div>
    
    <div class="mode-info">
      <p v-if="navigationMode === 'sequential'" class="info-text">
        Questions will be shown in order (1, 2, 3...)
      </p>
      <p v-else class="info-text">
        Questions will be shown randomly, ensuring no repeats until all viewed
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'

const store = useQuestionStore()

const navigationMode = computed(() => store.navigationMode)

const setMode = (mode) => {
  store.setNavigationMode(mode)
}
</script>

<style scoped>
.mode-toggle {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.toggle-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.toggle-buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.05);
}

.toggle-btn.active {
  background: #0ea5e9;
  color: white;
}

.mode-info {
  text-align: center;
}

.info-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 640px) {
  .toggle-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .toggle-buttons {
    width: 100%;
    max-width: 300px;
  }
  
  .toggle-btn {
    flex: 1;
    justify-content: center;
  }
}
</style> 