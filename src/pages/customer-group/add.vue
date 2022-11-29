<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Group')

const head =useHead({
  title: 'Add Customer Group',
})


</script>

<template>
  <CustomerGroupForm Form :formType="'Add'"/>
</template>
