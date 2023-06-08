<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "service_create"
    ]
  }
}
</route>

<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useI18n } from "vue-i18n";
import { useViewWrapper } from "/@src/stores/viewWrapper"

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('national.form.add_national_title'))

const head = useHead({
  title: t('national.form.add_national_title'),
})


</script>

<template>
  <NationalForm :formType="'Add'" />
</template>
