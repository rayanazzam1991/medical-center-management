<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "client_cash_receipt_list"
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
viewWrapper.setPageTitle(t('customer_cash_receipt.table.title'))
const route = useRoute()

const head = useHead({
    title: t('customer_cash_receipt.table.title'),
})


</script>
  
<template>
    <ClientsCashReceiptsTable />
</template>
  