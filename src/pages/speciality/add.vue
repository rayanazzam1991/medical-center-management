<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "speciality_create"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useI18n } from "vue-i18n";
import { useViewWrapper } from "/@src/stores/viewWrapper"

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('speciality.form.page_title'))

const head = useHead({
    title: t('speciality.form.add_speciality_title'),
})


</script>

<template>
    <SpecialityForm :formType="'Add'" />
</template>
