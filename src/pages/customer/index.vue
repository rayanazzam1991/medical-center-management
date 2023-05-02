<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "customer_list"
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
viewWrapper.setPageTitle(t('customer.table.title'))
const route = useRoute()

const head = useHead({
    title: t('customer.table.title'),
})


</script>  
<template>
    <CustomerTable />
</template>
    