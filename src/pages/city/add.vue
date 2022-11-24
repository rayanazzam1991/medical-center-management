<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue'
import { addCity } from '/@src/composable/Others/City/addCity'
import { City } from '/@src/utils/api/Others/City'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import { CityConsts } from '/@src/utils/consts/city';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')

const head =useHead({
  title: 'Add City',
})


</script>

<template>
  <CityForm :formType="'Add'"/>
</template>
