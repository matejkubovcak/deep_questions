<template>
  <div class="deck-picker">
    <div class="deck-label-row">
      <span class="deck-label">Topics</span>
      <span class="deck-count">{{ totalQuestions }} in this selection</span>
    </div>

    <div class="deck-scroller" role="group" aria-label="Question topics">
      <button
        type="button"
        class="deck-chip"
        :class="{ active: selectedTopicIds.length === 0 }"
        :aria-pressed="selectedTopicIds.length === 0"
        @click="selectAllTopics"
      >
        All
        <span class="chip-count">{{ allCount }}</span>
      </button>

      <button
        v-for="deck in deckOptions"
        :key="deck.id"
        type="button"
        class="deck-chip"
        :class="{ active: selectedTopicIds.includes(deck.id) }"
        :aria-pressed="selectedTopicIds.includes(deck.id)"
        :title="deck.note ? `${deck.description} ${deck.note}` : deck.description"
        @click="toggleTopic(deck.id)"
      >
        {{ deck.name }}
        <span class="chip-count">{{ deck.count }}</span>
      </button>
    </div>

    <p class="deck-summary">{{ summary }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'
import { findDeck } from '../data/decks.js'

const store = useQuestionStore()

const deckOptions = computed(() => store.deckOptions)
const selectedTopicIds = computed(() => store.selectedTopicIds)
const totalQuestions = computed(() => store.totalQuestions)
const allCount = computed(() => store.questions.length)

const summary = computed(() => {
  const ids = selectedTopicIds.value
  if (ids.length === 0) {
    return 'Every question in the library. Choose a topic to narrow it.'
  }

  if (ids.length === 1) {
    const deck = findDeck(ids[0])
    if (!deck) return ''
    return deck.note ? `${deck.description} ${deck.note}` : deck.description
  }

  const names = ids
    .map((id) => findDeck(id)?.name)
    .filter(Boolean)
  return `${names.join(' + ')}. Showing questions from any selected topic.`
})

const toggleTopic = (topicId) => {
  store.toggleTopic(topicId)
}

const selectAllTopics = () => {
  store.selectAllTopics()
}
</script>

<style scoped>
.deck-picker {
  width: min(1100px, 100%);
  margin: 1.25rem auto 0;
  text-align: left;
}

.deck-label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.6rem;
}

.deck-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
}

.deck-count {
  font-size: 0.8rem;
  color: #64748b;
}

.deck-scroller {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: thin;
}

.deck-chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.deck-chip:hover {
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.28);
}

.deck-chip.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
}

.chip-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.deck-summary {
  margin: 0.55rem 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.45;
  min-height: 1.45em;
}

@media (max-width: 640px) {
  .deck-label-row {
    padding: 0 0.15rem;
  }

  .deck-chip {
    padding: 0.55rem 0.85rem;
  }
}
</style>
