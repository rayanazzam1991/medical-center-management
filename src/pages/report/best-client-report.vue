<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "best_client_report"
        ]
    }
}
</route>        
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { useReport } from '/@src/stores/Others/Report/reportStore'
import { resetBestClientFilter, getBestClientReport } from '/@src/services/Others/Report/reportService'
import { CustomerGroup, CustomerGroupConsts, CustomerGroupSearchFilter } from '/@src/models/Others/CustomerGroup/customerGroup'
import { getCustomerGroupsList } from '/@src/services/Others/CustomerGroup/customerGroupService'
import { Service, ServiceSearchFilter } from '/@src/models/Others/Service/service'
import { getServicesList } from '/@src/services/Others/Service/serviceService'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reports.best_client.title'))
useHead({
    title: t('reports.best_client.title'),
})
const notif = useNotyf() as Notyf
const reportStore = useReport()
const reportFilter = ref(resetBestClientFilter());
const pageTitle = t('reports.best_client.title');
const customerGroupsList = ref<CustomerGroup[]>([])
const servicesList = ref<Service[]>([])
const isAllResults = ref(false)
onMounted(async () => {

    let customerGroupSearchFilter = {} as CustomerGroupSearchFilter
    customerGroupSearchFilter.per_page = 500
    const { customerGroups } = await getCustomerGroupsList(customerGroupSearchFilter)
    customerGroupsList.value = customerGroups

    let serviceSearchFilter = {} as ServiceSearchFilter
    serviceSearchFilter.per_page = 500
    const { services } = await getServicesList(serviceSearchFilter)
    servicesList.value = services
});

const onSubmit = async () => {
    if (reportFilter.value.count && (reportFilter.value.count < 0 || !Number.isInteger(reportFilter.value.count))) {
        notif.error({ message: t('toast.error.report.count_must_be_integer_positive'), duration: 3000 })
        return
    }
    const { report, success } = await getBestClientReport(reportFilter.value);
    if (success && report) {
        const blob = new Blob([report], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = t('reports.best_client.title') + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx';
        link.click();
    }
};

watch(isAllResults, (value) => {
    if (value) {
        reportFilter.value.count = undefined
    } else {
        reportFilter.value.count = 0
    }
})

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
                                    <VLabel>{{ t('reports.best_client.date_from') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_from" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.best_client.date_to') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_to" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.best_client.customer_group') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.customer_group_id">
                                            <VOption value="">{{ t('reports.best_client.customer_group') }}</VOption>
                                            <VOption v-for="customerGroup in customerGroupsList" :key="customerGroup.id"
                                                :value="customerGroup.id">{{ customerGroup.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.best_client.service') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.service_id">
                                            <VOption value="">{{ t('reports.best_client.service') }}</VOption>
                                            <VOption v-for="service in servicesList" :key="service.id" :value="service.id">
                                                {{ service.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="p-0 m-0 is-flex is-align-items-end column is-12 columns">
                                <div class="column is-9">
                                    <VField>
                                        <VLabel>{{ t('reports.best_client.count') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput :disabled="isAllResults" v-model="reportFilter.count" placeholder=""
                                                type="number" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-3">
                                    <VField>
                                        <VControl>
                                            <VCheckbox class="is-flex-row" v-model="isAllResults"
                                                :label="t('reports.best_client.all')" paddingless bigger color="primary" />
                                        </VControl>
                                    </VField>
                                </div>
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
  