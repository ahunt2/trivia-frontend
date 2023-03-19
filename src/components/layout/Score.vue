<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/users'
import { useLeaderboard } from '../../stores/leaderboard'

const userStore = useUserStore()
const leaderboard = useLeaderboard()
const score = computed(() => userStore.score)
const fadeIn = ref(true)

const place = computed(() => {
  const index = leaderboard.rank.findIndex((leader) => leader.username === userStore.username)
  return index + 1
})
const color = computed(() => {
  if (place.value === 1) return 'text-yellow-300'
  else if (place.value === 2) return 'text-stone-300'
  else if (place.value === 3) return 'text-yellow-600'
  else return ''
})
const showTrophy = computed(() => (place.value === 1 || place.value === 2 || place.value === 3))

</script>

<template>
  <div class="score">
    <h2>Score: <span :class="{ 'fade-in': fadeIn, 'fade-out': !fadeIn }">{{ score }}</span></h2>
    <font-awesome-icon v-if="showTrophy" :class="color" class="my-auto" icon="fa-solid fa-trophy" />
  </div>
</template>

<style scoped>
.score {
  @apply flex space-x-4 w-full py-2 px-3;
}

.fade-in {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s linear;
}

.fade-out {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}
</style>