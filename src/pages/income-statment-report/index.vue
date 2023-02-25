<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { IncomeStatment, defaultIncomeStatment } from '/@src/models/Accounting/Account/account';
import { generateIncomeStatmentReport } from '/@src/services/Accounting/Account/accountService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('income_statment_report.title'))

useHead({ title: t('income_statment_report.title'), })
const notif = useNotyf() as Notyf
const accountStore = useAccount()
const incomeStatment = ref<IncomeStatment>(defaultIncomeStatment)
const keyIncrement = ref(0)
const router = useRouter()
const isExpanded = ref(false)
onMounted(async () => {
  const { income_statment } = await generateIncomeStatmentReport()
  incomeStatment.value = income_statment
  keyIncrement.value++


});
const toggle = () => {
  isExpanded.value = !isExpanded.value
  keyIncrement.value++
}
</script>

<template>
  <div class="header is-flex is-justify-content-space-between is-align-items-center">
    <h1>{{ t('income_statment_report.title') }}</h1>
    <VButton :loading="accountStore.loading" color="primary" @click="toggle">{{
      t('income_statment_report.expand_collapse_button') }} </VButton>
  </div>

  <div class="income-statment-report-layout">

    <div v-if="accountStore.loading" class="columns is-multiline">
      <div ref="markdownContainer" class="column doc-column is-12">
        <VPlaceholderPage :title="t('income_statment_report.place_holder.title')"
          :subtitle="t('income_statment_report.place_holder.subtitle')" larger>
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
              {{ t('income_statment_report.total_balances') }}
            </div>
          </div>
        </div>
      </div>

      <div class="column is-12 pb-0">
        <IncomeStatmentCollapse :items="incomeStatment.revenues" with-chevron :key="keyIncrement"
          :is_expanded="isExpanded" />
      </div>
      <div class="column is-12 pb-0">
        <IncomeStatmentRevenuesExpensesCollapse :items="incomeStatment.costs" with-chevron :key="keyIncrement"
          :is_expanded="isExpanded" />
      </div>
      <div
        class="account-details test columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mt-4 mb-0">
        <div class="is-flex">
          <div class="chart-row">
            <div class="accounts-cell has-bold">
              {{ incomeStatment.gross_profit }}
            </div>
          </div>
        </div>
        <div class="chart-row total"> {{ t('income_statment_report.gross_profit') }} </div>
      </div>

      <div class="column is-12 pb-0">
        <IncomeStatmentCollapse :items="incomeStatment.other_expenses" with-chevron :key="keyIncrement"
          :is_expanded="isExpanded" />
      </div>
      <div
        class="account-details  columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mt-4 mb-0">
        <div class="is-flex">
          <div class="chart-row">
            <div class="accounts-cell has-bold">
              {{ incomeStatment.net_income }}
            </div>
          </div>
        </div>
        <div class="chart-row total"> {{ t('income_statment_report.net_income') }} </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/Styles/IncomeStatment/incomeStatment.scss';
</style>
