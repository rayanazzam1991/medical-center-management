<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "supplier_create"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('supplier.form.page_title'))

const head = useHead({
    title: t('supplier.form.add_supplier_title'),
})


</script>

<template>
    <SupplierForm :formType="'Add'" />
</template>
