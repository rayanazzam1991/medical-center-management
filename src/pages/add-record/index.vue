<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"
import { z as zod } from 'zod';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { useTransaction } from "/@src/stores/Accounting/Transaction/transactionStore"
import { createRecords, getRecordsData } from '/@src/services/Accounting/Transaction/transactionService';
import { createRecordsWithDefault } from '/@src/models/Accounting/Transaction/record'
import { defaultCreditAccountDetail, defaultDebitAccountDetail, RecordAccountDetail, RecordAccountAmountDetail } from '/@src/models/Accounting/Account/account';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const transactionStore = useTransaction()

viewWrapper.setPageTitle(t('financial_record.title'))

const notif = useNotyf() as Notyf

const pageTitle = t('financial_record.add_new')
const formType = ref("");
formType.value = "Add";
const formTypeName = "Add"
const backRoute = "";

const accountRecords = ref<RecordAccountDetail[]>([])



const tempAccountRecords = ref<RecordAccountAmountDetail[]>([]);
const initialRecordAccountAmountDetail: RecordAccountAmountDetail = {} satisfies RecordAccountAmountDetail
tempAccountRecords.value.push(initialRecordAccountAmountDetail)

interface Account {
    id?: number,
    code?: string,
    name?: string
}


onMounted(async () => {


})

const validationSchema = null

const { handleSubmit } = useForm({
    validationSchema
});



const addRecord = (record: RecordAccountAmountDetail) => {
    tempAccountRecords.value?.push(record)
}

const removeRecord = (record: RecordAccountDetail) => {
    const index = tempAccountRecords.value.indexOf(record);
    if (index !== -1) {
        tempAccountRecords.value.splice(index, 1);
    }
}

const accountsList = ref<Account[]>([]);


accountsList.value?.push({ id: 1, code: "123", name: "Cash" })
accountsList.value?.push({ id: 2, code: "456", name: "Inventory" })

const clearAccountValue = () => {

}

const setAccountValue = () => {

}


const onSubmitAdd = handleSubmit(async () => {


    const data = getRecordsData(tempAccountRecords.value)
    console.log("values", data)

    const { success, message, response } = await createRecords(data)
    // if (success) {
    //     // @ts-ignore
    //     await sleep(200);

    //     notif.success(t('toast.success.add'))

    //     return true
    // }
    // else {
    //     // @ts-ignore
    //     await sleep(200);

    //     notif.error(message)

    // }



})
</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmitAdd()" :isLoading="transactionStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmitAdd()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <!-- <div class="fieldset-heading">
                                                                                                        <h4>{{ pageTitle }}</h4>
                                                                                                    </div> -->
                        <div class="columns mb-5">
                            <VButton class="mt-5" @click.prevent="addRecord({
                                account_id: undefined,
                                credit_amount: undefined,
                                debit_amount: undefined,
                                type: 1
                            })" color="primary">
                                {{ t('financial_record.add_new_row') }}
                            </VButton>
                        </div>
                        <!--Fieldset-->
                        <div class="columns" v-for="(record, mainIndex) in tempAccountRecords" :key="mainIndex">
                            <div class="column is-5">
                                <div class="mb-3">
                                    <VField :id="`account_id_${mainIndex}`">
                                        <VLabel class="required">
                                            {{ t('financial_record.select_account') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <!-- <VSelect v-model="tempAccountRecords[mainIndex].account_id">
                                                    <VOption v-for="(account, index) in accountsList" :key="index"
                                                        :value="account.id">
                                                        {{ account.name }}
                                                    </VOption>
                                                </VSelect> -->
                                            <Multiselect mode="single" :placeholder="t('financial_record.select_account')"
                                                :close-on-select="false" :filter-results="false" :min-chars="0"
                                                :resolve-on-load="false" :infinite="true" :limit="10" :rtl="true" :max="1"
                                                :clear-on-search="true" :delay="0" :searchable="true"
                                                @clear="clearAccountValue()" @select="setAccountValue()" :options="(query: any) => {
                                                    // let citySearchFilter = {} as CitySearchFilter
                                                    // citySearchFilter.name = query
                                                    // const data = await getAccountsList()
                                                    return accountsList
                                                    // return data.cities.map((item: any) => {
                                                    //     return { value: item.id, label: item.name }
                                                    // })
                                                }" @open="(select$: any) => {
    if (select$.noOptions) {
        select$.resolveOptions()
    }
}" />

                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField :id="`credit_amount_${mainIndex}`">
                                        <VLabel class="required">
                                            {{ t('financial_record.credit') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput :disabled="tempAccountRecords[mainIndex].debit_amount > 0" type="number"
                                                placeholder="" autocomplete=""
                                                v-model="tempAccountRecords[mainIndex].credit_amount" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField :id="`debit_amount_${mainIndex}`">
                                        <VLabel class="required">
                                            {{ t('financial_record.debit') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput :disabled="tempAccountRecords[mainIndex].credit_amount > 0"
                                                type="number" placeholder="" autocomplete=""
                                                v-model="tempAccountRecords[mainIndex].debit_amount" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-1">
                                <div class="mb-3">
                                    <VField>
                                        <VControl>
                                            <VButton class="remove_btn" @click="removeRecord(record)" color="danger">
                                                {{ t('financial_record.remove_row') }}
                                            </VButton>
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
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
    content: " *";
    color: var(--danger);
}


.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}


.field {

    .custom-label {
        font-family: var(--font);
        font-size: 0.9rem;
        color: var(--light-text) !important;
        font-weight: 400;
    }
}

.remove_btn {
    margin-top: 1.8rem;
}

.control.has-icon {
    .input {
        height: 2.6em;
    }
}
</style>