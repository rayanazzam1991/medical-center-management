<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nationality')

const head =useHead({
  title: 'Add Nationality',
})


</script>

<template>
  <NationalityForm :formType="'Add'"/>
</template>
