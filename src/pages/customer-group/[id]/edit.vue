<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Group')
useHead({
  title: 'Edit Customer Group',
})
</script>

<template>
  <CustomerGroupForm :formType="'Edit'"/>
  
</template>
