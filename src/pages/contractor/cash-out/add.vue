<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import CashOutForm from '/@src/components/OurComponents/Contractor/WalletMovement/CashOutForm.vue';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('walletMovement.form.page_title'))
const route = useRoute()

const head = useHead({
    title: t('walletMovement.add_walletMovement_title'),
})


</script>

<template>
    <CashOutForm :formType="'Add'" />
</template>
