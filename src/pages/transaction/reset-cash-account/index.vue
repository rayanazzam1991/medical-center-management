<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "cash_account_reset_list"
        ]
    }
}
</route>
        
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountConsts, AccountSearchFilter } from '/@src/models/Accounting/Account/account';
import { defaultResetCashAccountsListSearchFilter, ResetCashAccountsListSearchFilter, Transaction } from '/@src/models/Accounting/Transaction/record';
import { getResetCashAccountsList } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import { defaultEmployee, Employee } from '/@src/models/Employee/employee';
import { CurrencyConsts } from '/@src/models/Accounting/Currency/currency';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reset_cash_accounts.table.title'))
const route = useRoute()

const head = useHead({
    title: t('reset_cash_accounts.table.title'),
})


</script>
    
<template>
    <ResetCashAccountsTable />
</template>
    