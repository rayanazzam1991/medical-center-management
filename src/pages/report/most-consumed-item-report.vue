<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "most_consumed_item_report"
        ]
    }
}
</route>        
                
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { useReport } from '/@src/stores/Others/Report/reportStore'
import { getMostConsumedItemReport, resetMostConsumedItemFilter } from '/@src/services/Others/Report/reportService'
import { Category, CategorySearchFilter } from '/@src/models/Warehouse/Category/category'
import { getCategoriesList } from '/@src/services/Warehouse/Category/CategoryService'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reports.most_consumed_item.title'))
useHead({
    title: t('reports.most_consumed_item.title'),
})
const notif = useNotyf() as Notyf
const reportStore = useReport()
const reportFilter = ref(resetMostConsumedItemFilter());
const pageTitle = t('reports.most_consumed_item.title');
const mainCategoriesList = ref<Category[]>([])
const subCategoriesList = ref<Category[]>([])
const categoriesList = ref<Category[]>([])
const isAllResults = ref(false)
onMounted(async () => {

    let categorySearchFilter = {} as CategorySearchFilter
    categorySearchFilter.per_page = 500
    const { categories } = await getCategoriesList(categorySearchFilter)
    categoriesList.value = categories
    categories.forEach((category) => {
        if (!category.parent) {
            mainCategoriesList.value.push(category)
        }
    });
});

const onSubmit = async () => {
    if (reportFilter.value.count && (reportFilter.value.count < 0 || !Number.isInteger(reportFilter.value.count))) {
        notif.error({ message: t('toast.error.report.count_must_be_integer_positive'), duration: 3000 })
        return
    }
    const { report, success } = await getMostConsumedItemReport(reportFilter.value);
    if (success && report) {
        const blob = new Blob([report], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = t('reports.most_consumed_item.title') + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx';
        link.click();
    }
};

const updateCategories = () => {
    if (reportFilter.value.parent_category_id) {
        subCategoriesList.value = []
        categoriesList.value.forEach(category => {
            if (category.parent?.id == reportFilter.value.parent_category_id)
                subCategoriesList.value.push(category)
        });
    }

}
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
                                    <VLabel>{{ t('reports.most_consumed_item.date_from') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_from" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.most_consumed_item.date_to') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_to" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.most_consumed_item.parent_category_id') }}</VLabel>
                                    <VControl>
                                        <VSelect @click="updateCategories" v-model="reportFilter.parent_category_id">
                                            <VOption value="">{{ t('reports.most_consumed_item.parent_category_id') }}
                                            </VOption>
                                            <VOption v-for="mainCategory in mainCategoriesList" :key="mainCategory.id"
                                                :value="mainCategory.id">{{ mainCategory.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.most_consumed_item.item_category_id') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.item_category_id">
                                            <VOption value="">{{ t('reports.most_consumed_item.item_category_id') }}
                                            </VOption>
                                            <VOption v-for="subCategory in subCategoriesList" :key="subCategory.id"
                                                :value="subCategory.id">{{ subCategory.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="p-0 m-0 is-flex is-align-items-end column is-12 columns">
                                <div class="column is-9">
                                    <VField>
                                        <VLabel>{{ t('reports.most_consumed_item.count') }}</VLabel>
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
                                                :label="t('reports.most_consumed_item.all')" paddingless bigger
                                                color="primary" />
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
          