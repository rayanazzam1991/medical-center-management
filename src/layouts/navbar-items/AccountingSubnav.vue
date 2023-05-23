<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions'

type TabId = 'accounting'
const activeTab = ref<TabId>('accounting')
const emits = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18n()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">
    <div class="container">
      <div class="tab-content" :class="[activeTab === 'accounting' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4" v-if="checkPermission(Permissions.SALARY_LIST) ||
                checkPermission(Permissions.DELIVER_SALARY_LIST) ||
                checkPermission(Permissions.ONHOLD_SALARY_LIST) ||
                checkPermission(Permissions.CLIENT_CASH_RECEIPT_CREATE) ||
                checkPermission(Permissions.CLIENT_CASH_RECEIPT_LIST) ||
                checkPermission(Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_CREATE) ||
                checkPermission(Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_LIST)">
                <h4 v-if="checkPermission(Permissions.SALARY_LIST) ||
                  checkPermission(Permissions.DELIVER_SALARY_LIST) ||
                  checkPermission(Permissions.ONHOLD_SALARY_LIST)" class="column-heading">{{
    t('accounting_subnav.salary.salaries') }}</h4>
                <ul>
                  <li v-permission="Permissions.SALARY_LIST">
                    <RouterLink to="/salary">
                      <i class="fas fa-money-bill-wave mx-3" aria-hidden="true"></i> <span>{{
                        t('accounting_subnav.salary.salaries_history')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.DELIVER_SALARY_LIST">
                    <RouterLink to="/deliver-salaries">
                      <i class="fas fa-money-bill-alt mx-3" aria-hidden="true"></i> <span>{{
                        t('accounting_subnav.salary.deliver_salaries')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ONHOLD_SALARY_LIST">
                    <RouterLink to="/onhold-salaries">
                      <i class="fas fa-boxes mx-3" aria-hidden="true"></i>
                      <span>{{ t('accounting_subnav.salary.onhold_salaries') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <br v-if="checkPermission(Permissions.SALARY_LIST) ||
                  checkPermission(Permissions.DELIVER_SALARY_LIST) ||
                  checkPermission(Permissions.ONHOLD_SALARY_LIST)" />

                <h4 v-if="checkPermission(Permissions.CLIENT_CASH_RECEIPT_CREATE) ||
                  checkPermission(Permissions.CLIENT_CASH_RECEIPT_LIST) ||
                  checkPermission(Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_CREATE) ||
                  checkPermission(Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_LIST)" class="column-heading">{{
    t('accounting_subnav.cash_receipts') }}</h4>
                <ul>
                  <li v-permission="Permissions.CLIENT_CASH_RECEIPT_CREATE">
                    <RouterLink to="/transaction/customer-cash-receipt/add">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.create_customer_cash_receipt')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CLIENT_CASH_RECEIPT_LIST">
                    <RouterLink to="/transaction/customer-cash-receipt">
                      <i class="lnir lnir-ticket-alt-2" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.customer_cash_receipts')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_CREATE">
                    <RouterLink to="/transaction/supplier-employee-cash-receipt/add">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.create_supplier_employee_cash_receipt')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_LIST">
                    <RouterLink to="/transaction/supplier-employee-cash-receipt">
                      <i class="lnir lnir-ticket-alt-1" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.supplier_employee_cash_receipts')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4" v-if="checkPermission(Permissions.TRIAL_BALANCE_GENERATE) ||
                  checkPermission(Permissions.BALANCE_SHEET_GENERATE) ||
                  checkPermission(Permissions.INCOME_STATEMENT_GENERATE) ||
                  checkPermission(Permissions.ACCOUNT_CREATE) ||
                  checkPermission(Permissions.ACCOUNT_LIST)">
                <h4 v-if="checkPermission(Permissions.TRIAL_BALANCE_GENERATE) ||
                  checkPermission(Permissions.BALANCE_SHEET_GENERATE) ||
                  checkPermission(Permissions.INCOME_STATEMENT_GENERATE)" class="column-heading">{{
    t('accounting_subnav.reports.reports') }}</h4>
                <ul>
                  <li v-permission="Permissions.TRIAL_BALANCE_GENERATE">
                    <RouterLink to="/trial-balance-report">
                      <i class="lnir lnir-sales-report" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.reports.trial_balance_report')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.BALANCE_SHEET_GENERATE">
                    <RouterLink to="/balance-sheet-report">
                      <i class="lnir lnir-pie-chart-dollar" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.reports.balance_sheet_report')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.INCOME_STATEMENT_GENERATE">
                    <RouterLink to="/income-statment-report">
                      <i class="lnir lnir-invest-monitor" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.reports.income_statment_report')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <br v-if="checkPermission(Permissions.TRIAL_BALANCE_GENERATE) ||
                    checkPermission(Permissions.BALANCE_SHEET_GENERATE) ||
                    checkPermission(Permissions.INCOME_STATEMENT_GENERATE)" />
                <h4 v-if="checkPermission(Permissions.ACCOUNT_CREATE) ||
                  checkPermission(Permissions.ACCOUNT_LIST)" class="column-heading">
                  {{ t('account.sun_navbar_heading') }}</h4>
                <ul>
                  <li v-permission="Permissions.ACCOUNT_CREATE">
                    <RouterLink to="/account/add-cash-account">

                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('accounting_subnav.account.add_cash_account') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ACCOUNT_CREATE">
                    <RouterLink to="/account/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('accounting_subnav.account.add_account') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ACCOUNT_LIST">
                    <RouterLink to="/account">
                      <i class="lnir lnir-money-protection" aria-hidden="true"></i>
                      <span>{{ t('account.accounts') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4" v-if="checkPermission(Permissions.TRANSACTION_CREATE) ||
                checkPermission(Permissions.TRANSACTION_LIST) ||
                checkPermission(Permissions.PENDING_TICKET_LIST) ||
                checkPermission(Permissions.CUSTOM_EXPENSE_CREATE) ||
                checkPermission(Permissions.CASH_MONEY_TRANSFER) ||
                checkPermission(Permissions.CASH_ACCOUNT_RESET_LIST) ||
                checkPermission(Permissions.CUSTOM_REVENUE_CREATE)">
                <h4 v-if="checkPermission(Permissions.TRANSACTION_CREATE) ||
                  checkPermission(Permissions.TRANSACTION_LIST) ||
                  checkPermission(Permissions.CUSTOM_REVENUE_CREATE) ||
                  checkPermission(Permissions.CUSTOM_EXPENSE_CREATE) ||
                  checkPermission(Permissions.CASH_MONEY_TRANSFER)" class="column-heading">{{
    t('accounting_subnav.records.records') }}</h4>
                <ul>
                  <li v-permission="Permissions.TRANSACTION_CREATE">
                    <RouterLink to="/add-record">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.add_record')
                      }}</span>

                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.TRANSACTION_LIST">
                    <RouterLink to="/transaction">
                      <i class="lnir lnir-money-protection" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.transactions')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CUSTOM_REVENUE_CREATE">
                    <RouterLink to="/add-custom-revenue">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.add_custom_revenue')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CUSTOM_EXPENSE_CREATE">
                    <RouterLink to="/add-custom-expense">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.add_custom_expense')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CASH_MONEY_TRANSFER">
                    <RouterLink to="/transfer-cash-money">
                      <i class="lnir lnir-investment" aria-hidden="true"></i>
                      <span>{{
                        t('accounting_subnav.records.transfer_cash_money')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <br v-if="checkPermission(Permissions.TRANSACTION_CREATE) ||
                    checkPermission(Permissions.TRANSACTION_LIST) ||
                    checkPermission(Permissions.CUSTOM_REVENUE_CREATE) ||
                    checkPermission(Permissions.CUSTOM_EXPENSE_CREATE) ||
                    checkPermission(Permissions.CASH_MONEY_TRANSFER)" />
                <h4 v-permission="Permissions.PENDING_TICKET_LIST" class="column-heading">{{
                  t('accounting_subnav.confirm_payment_for_tickets.confirm_payment_for_tickets') }}</h4>
                <ul>
                  <li v-permission="Permissions.PENDING_TICKET_LIST">
                    <RouterLink to="/pending-ticket">
                      <i class="lnir lnir-ticket-alt" aria-hidden="true"></i> <span>{{
                        t('accounting_subnav.confirm_payment_for_tickets.pending_tickets')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <br v-if="checkPermission(Permissions.PENDING_TICKET_LIST)" />
                <h4 v-permission="Permissions.CASH_ACCOUNT_RESET_LIST" class="column-heading">{{
                  t('accounting_subnav.reset_cash_account.reset_cash_account') }}</h4>
                <ul>
                  <li v-permission="Permissions.CASH_ACCOUNT_RESET_LIST">
                    <RouterLink to="/transaction/reset-cash-account/">
                      <i aria-hidden="true" class="fas fa-cash-register mx-3"></i>
                      <span>{{
                        t('accounting_subnav.reset_cash_account.reset_cash_account_list')
                      }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
