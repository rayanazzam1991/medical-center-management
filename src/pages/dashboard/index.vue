<script lang="ts" setup>
import {useHead} from '@vueuse/head'
import {useViewWrapper} from '/@src/stores/viewWrapper'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('main_dashboard'))


useHead({
  title: 'Main Dashboard - My app',
})
</script>

<template>
  <div class="page-content-inner">
    <!-- <AnalyticsDashboard /> -->
  </div>
</template>
