<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Social Media')

const head =useHead({
  title: 'Add Social Media',
})


</script>

<template>
  <SocialMediaForm Form :formType="'Add'"/>
</template>
