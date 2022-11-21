<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add City')

useHead({
  title: 'Add City',
})
</script>

<template>
  <div class="page-content-inner">
    <NavbarLayout>
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <FormLayoutSplit />
  </NavbarLayout>

  </div>
</template>
