<template>
  <div id="app" class="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">deep_questions.</h1>
        <p class="app-subtitle">deepen connections through introspection.</p>
      </div>
    </header>
    
    <main class="app-main">
      <QuestionDisplay />
    </main>
    
    <footer class="app-footer">
      <NavigationControls />
      <ModeToggle />
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuestionStore } from './stores/questionStore.js'
import QuestionDisplay from './components/QuestionDisplay.vue'
import NavigationControls from './components/NavigationControls.vue'
import ModeToggle from './components/ModeToggle.vue'

const store = useQuestionStore()

onMounted(() => {
  store.initializeQuestions()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #9bacd5 0%, #1e293b 50%, #334155 100%);
}

.app-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.app-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .app-main {
    padding: 1rem 0;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.75rem;
  }
  
  .app-subtitle {
    font-size: 0.9rem;
  }
}
</style> 