<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "supplier_edit"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('supplier.form.page_title'))
useHead({
    title: t('supplier.form.edit_supplier_title'),
})
</script>

<template>
    <SupplierForm :formType="'Edit'" />
</template>
