<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStores.ts'
import { healthUsingGet} from '@/api/mainController.ts'

// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()

healthUsingGet().then(response => {
  console.log(response)
})
</script>

<style scoped></style>
