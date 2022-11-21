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
    <FormLayoutSplit />

  </div>
</template>
