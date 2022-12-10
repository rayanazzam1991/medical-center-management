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
  <NavbarLayout>
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" :key="route.fullPath"/>
      </Transition>
    </RouterView>
  </NavbarLayout>
</template>
