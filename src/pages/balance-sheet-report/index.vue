<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { BalanceSheet, defaultBalanceSheet } from '/@src/models/Accounting/Account/account';
import { generateBalanceSheetReport } from '/@src/services/Accounting/Account/accountService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';





const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('balance_sheet_report.title'))

useHead({ title: t('balance_sheet_report.title'), })
const notif = useNotyf() as Notyf
const accountStore = useAccount()
const balanceSheet = ref<BalanceSheet>(defaultBalanceSheet)
const keyIncrement = ref(0)
const router = useRouter()
const isExpanded = ref(false)
onMounted(async () => {
  const { balance_sheet } = await generateBalanceSheetReport()
  balanceSheet.value = balance_sheet
  keyIncrement.value++


});
const toggle = () => {
  isExpanded.value = !isExpanded.value
  keyIncrement.value++
}
</script>

<template>
  <div class="header is-flex is-justify-content-space-between is-align-items-center">
    <h1>{{ t('balance_sheet_report.title') }}</h1>
    <VButton :loading="accountStore.loading" color="primary" @click="toggle">{{
      t('balance_sheet_report.expand_collapse_button') }} </VButton>
  </div>

  <div class="balance-sheet-report-layout">

    <div v-if="accountStore.loading" class="columns is-multiline">
      <div ref="markdownContainer" class="column doc-column is-12">
        <VPlaceholderPage :title="t('balance_sheet_report.place_holder.title')"
          :subtitle="t('balance_sheet_report.place_holder.subtitle')" larger>
          <template #image>
            <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
            <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg" alt="" />
          </template>
        </VPlaceholderPage>
      </div>
    </div>
    <div v-else>
      <div
        class="account-details table-header columns is-flex-direction-row-reverse is-justify-content-end account-details-padding my-0">
        <div class="is-flex">
          <div class="chart-row">
            <div class="accounts-cell has-bold">
              {{ t('balance_sheet_report.total_balances') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Assets Section -->
      <div class="column is-12 pb-3 assets-liabilites">
        <div class="is-flex">
          <div class="chart-row">
            <div class="has-text-weight-semibold">
              {{ balanceSheet.assets.code }}
            </div>
          </div>
          <div class="chart-row">
            <div class="has-text-weight-semibold mr-3">
              {{ balanceSheet.assets.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="column is-12 pb-0">
        <BalanceSheetAssetsLiabilitesCollapse :items="balanceSheet.assets.children" with-chevron :key="keyIncrement"
          :is_expanded="isExpanded" />
      </div>
      <div
        class="account-details accounts-footer columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mt-4 mb-0">
        <div class="is-flex">
          <div class="chart-row">
            <div class="accounts-cell has-bold">
              {{ balanceSheet.total_assets_balances }}
            </div>

          </div>
        </div>
        <div class="chart-row total"> {{ t('balance_sheet_report.total_assets_balances') }} </div>
      </div>


      <!-- Liabilites Section -->
      <div class="column is-12 pb-3 assets-liabilites">
        <div class="is-flex">
          <div class="chart-row">
            <div class="has-text-weight-semibold">
              {{ balanceSheet.liabilities.code }}
            </div>
          </div>
          <div class="chart-row">
            <div class="has-text-weight-semibold mr-3">
              {{ balanceSheet.liabilities.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="column is-12 pb-0">
        <BalanceSheetAssetsLiabilitesCollapse :items="balanceSheet.liabilities.children" with-chevron :key="keyIncrement"
          :is_expanded="isExpanded" />
      </div>
      <div
        class="account-details accounts-footer columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mt-4 mb-0">
        <div class="is-flex">
          <div class="chart-row">
            <div class="accounts-cell has-bold">
              {{ balanceSheet.total_liabilities_balances }}
            </div>
          </div>
        </div>
        <div class="chart-row total"> {{ t('balance_sheet_report.total_liabilites_balances') }} </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/Styles/BalanceSheetReport/balanceSheet.scss';
</style>
