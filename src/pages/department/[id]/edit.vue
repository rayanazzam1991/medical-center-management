<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "department_edit"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('department.form.page_title'))
useHead({
    title: t('department.form.edit_department_title'),
})
</script>

<template>
    <DepartmentForm :formType="'Edit'" />
</template>
