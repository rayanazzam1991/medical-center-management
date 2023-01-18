<route lang="json">
  {
  "meta": {
  "requiresAuth": true
  }
  }
  </route>
  <script setup lang="ts">
  const route = useRoute()
  const renderKey = ref(0)
  onBeforeMount(() => {
    renderKey.value++
  })
  onMounted(() => {
    renderKey.value++
  })
  
  
  </script>
  
  <template>

  </template>
  