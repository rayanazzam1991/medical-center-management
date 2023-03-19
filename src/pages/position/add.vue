<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "position_create"
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
viewWrapper.setPageTitle(t('position.form.page_title'))

const head = useHead({
    title: t('position.form.add_position_title'),
})


</script>

<template>
    <PositionForm :formType="'Add'" />
</template>
