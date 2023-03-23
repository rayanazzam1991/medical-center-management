<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "balance_sheet_generate"
    ]
  }
}
</route>

<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import usePrint from '/@src/composable/usePrint';
import { BalanceSheet, defaultBalanceSheet } from '/@src/models/Accounting/Account/account';
import { generateBalanceSheetReport } from '/@src/services/Accounting/Account/accountService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { trialBalancePrintStyle } from '/@src/utils/PrintStyles/printStyles';




const { printDiv } = usePrint('');
const print = () => printDiv('printerable')

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
    <div class="is-flex is-align-items-center">

      <VButton class="mr-2" :loading="accountStore.loading" color="primary" @click="toggle">{{
        t('balance_sheet_report.expand_collapse_button') }} </VButton>
      <VIconButton icon="lnir lnir-printer" :loading="accountStore.loading" outlined color="primary" @click="print" />
    </div>

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
  <div class="is-hidden" id="printerable">
    <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px;">{{ t('print.date') }} {{ new
      Date().toLocaleDateString() }}
    </h1>
    <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px; font-size: 24px;">{{
      t('balance_sheet_report.title') }}
    </h1>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <thead>
        <tr>

          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
            t('print.balance_sheet.balance') }}</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
            t('print.balance_sheet.account_name') }}</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
            t('print.balance_sheet.account_code') }}</th>



        </tr>
      </thead>
      <tbody>
        <td colspan="3" style="text-align: center; padding: 16px;text-decoration: underline; border: 2px solid #333;">
          <strong>{{ balanceSheet.assets.name }}</strong>
        </td>

        <tr v-for="lvl2 in balanceSheet.assets.children">
        <tr v-for="account in lvl2.accounts">
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.balance }}</td>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.name }}</td>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.code }}</td>

        </tr>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ balanceSheet.assets.total_balances }}
          </td>

          <td colspan="2" style="text-align: left; padding: 8px; border: 1px solid #ddd;">
            <strong>{{ t('print.balance_sheet.total_assets') }}</strong>
          </td>
        </tr>
        <td colspan="3" style="text-align: center; padding: 16px;text-decoration: underline; border: 2px solid #333;">
          <strong>{{ balanceSheet.liabilities.name }}</strong>
        </td>

        <tr v-for="lvl2 in balanceSheet.liabilities.children">
        <tr v-for="account in lvl2.accounts">
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.balance }}</td>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.name }}</td>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ account.code }}</td>


        </tr>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;text-align: right;">{{ balanceSheet.liabilities.total_balances
          }}</td>

          <td colspan="2" style="text-align: left; padding: 8px; border: 1px solid #ddd;">
            <strong>{{ t('print.balance_sheet.total_liabilities') }}</strong>
          </td>
        </tr>

      </tbody>

    </table>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/Styles/BalanceSheetReport/balanceSheet.scss';
</style>
