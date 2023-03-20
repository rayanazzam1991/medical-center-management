<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "category_create"
        ]
    }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('category.form.page_title'))
const route = useRoute()

const head = useHead({
    title: t('category.add_category_title'),
})


</script>

<template>
    <CategoryForm :formType="'Add'" />
</template>
