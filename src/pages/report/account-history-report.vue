<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "account_history_report"
        ]
    }
}
</route>        
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { useReport } from '/@src/stores/Others/Report/reportStore'
import { getAccountHistoryReport, resetAccountHistoryReportFilter } from '/@src/services/Others/Report/reportService'
import { ChartOfAccountWithChildren } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount'
import { getChartOfAccountsTreeList } from '/@src/services/Accounting/ChartOfAccount/chartOfAccountService'
import { Account } from '/@src/models/Accounting/Account/account'
import { Notyf } from 'notyf'
import { useNotyf } from '/@src/composable/useNotyf'

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reports.account_history.title'))
useHead({
    title: t('reports.account_history.title'),
})
const reportStore = useReport()
const notif = useNotyf() as Notyf

const reportFilter = ref(resetAccountHistoryReportFilter());
const pageTitle = t('reports.account_history.title');
const chartOfAccountsTreeList = ref<ChartOfAccountWithChildren[]>([])
const chartOfAccountsLvl2List = ref<ChartOfAccountWithChildren[]>([])
const accountsList = ref<Account[]>([])
const selectedParentChart = ref<number>()
const selectedLvl2Chart = ref<number>()
onMounted(async () => {

    const { chartOfAccounts } = await getChartOfAccountsTreeList()
    chartOfAccountsTreeList.value = chartOfAccounts

});

const onSubmit = async () => {
    if (reportFilter.value.account_id == 0) {
        notif.error({ message: t('toast.error.report.account_required'), duration: 3000 })
        return
    }

    const { report, success } = await getAccountHistoryReport(reportFilter.value);
    if (success && report) {
        const blob = new Blob([report], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = t('reports.account_history.title') + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx';
        link.click();
    }
};
watch(selectedParentChart, (value) => {
    chartOfAccountsLvl2List.value = []
    if (value && value != 0) {
        chartOfAccountsLvl2List.value = []
        const lvl1Chart = chartOfAccountsTreeList.value.find((parent) => parent.id == value)
        if (lvl1Chart && lvl1Chart.children) {
            lvl1Chart.children.forEach(element => {
                chartOfAccountsLvl2List.value.push(element)
            });
        }
    }
}
)
watch(selectedLvl2Chart, (value) => {
    accountsList.value = []
    if (value && value != 0) {
        accountsList.value = []
        const lvl1Chart = chartOfAccountsTreeList.value.find((parent) => parent.id == selectedParentChart.value)
        if (lvl1Chart && lvl1Chart.children) {
            const lvl2Chart = lvl1Chart?.children.find((child) => child.id == value)
            if (lvl2Chart && lvl2Chart.accounts) {
                lvl2Chart.accounts.forEach(element => {
                    accountsList.value.push(element)
                });
            }
        }

    }
}
)


</script>
        
<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="'Export'" type="submit" @onSubmit="onSubmit"
            :isLoading="reportStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit">
            <div class="form-outer">
                <div class="form-body">
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.account_history.date_from') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_from" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.account_history.date_to') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_to" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.account_history.parent_chart') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="selectedParentChart">
                                            <VOption value="">{{ t('reports.account_history.parent_chart') }}</VOption>
                                            <VOption v-for="chartOfAccount in chartOfAccountsTreeList"
                                                :key="chartOfAccount.id" :value="chartOfAccount.id">{{ chartOfAccount.code
                                                }} - {{ chartOfAccount.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.account_history.lvl2_chart') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="selectedLvl2Chart">
                                            <VOption value="">{{ t('reports.account_history.lvl2_chart') }}</VOption>
                                            <VOption v-for="chartOfAccount in chartOfAccountsLvl2List"
                                                :key="chartOfAccount.id" :value="chartOfAccount.id">{{ chartOfAccount.code
                                                }} - {{ chartOfAccount.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel class="required">{{ t('reports.account_history.account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.account_id">
                                            <VOption value="">{{ t('reports.account_history.account') }}</VOption>
                                            <VOption v-for="account in accountsList" :key="account.id" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>


    </div>
</template>
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
      