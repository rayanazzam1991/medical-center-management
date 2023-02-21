<script setup lang="ts">
import { getCurrentInstance } from 'vue'
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
import { defaultCreditAccountDetail, defaultDebitAccountDetail, RecordAccountDetail, RecordAccountAmountDetail, defaultAccountSearchFilter, AccountSearchFilter } from '/@src/models/Accounting/Account/account';
import { getAllAccounts } from '/@src/services/Accounting/Account/accountService';
import { createFinancialRecordsValidation } from '/@src/rules/Accounting/Transaction/createFinancialRecordsValidation';
import debounce from 'lodash.debounce';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const transactionStore = useTransaction()

viewWrapper.setPageTitle(t('financial_record.title'))

const notif = useNotyf() as Notyf

const pageTitle = t('financial_record.add_new')
const formType = ref("");
formType.value = "Add";
const formTypeName = "Add"
const backRoute = "";

const tempAccountRecords = ref<RecordAccountAmountDetail[]>([]);
const recordTitle = ref('')
const recordNote = ref('')
const totalCredit = ref(0)
const totalDebit = ref(0)
const totalCreditText = ref('')
const totalDebitText = ref('')
const totalCreditColor = ref('')
const totalDebitColor = ref('')
const totalColor = ref('')
const totalDifference = ref(0)
// const accountMultiselect = ref(null)
// const accountMultiselect = ref<InstanceType<typeof MultiSelect>>(null);

interface Account {
    id?: number,
    code?: string,
    name?: string
}


const accountsListDropDown = ref<Account[]>([]);

const accountSearchFilter = ref(defaultAccountSearchFilter)
onMounted(async () => {

    addRecord({ has_remove_btn: false } as RecordAccountAmountDetail)
    addRecord({ has_remove_btn: false } as RecordAccountAmountDetail)

    const { success, error_code, message, accounts } = await getAllAccounts(accountSearchFilter.value)
    accountsListDropDown.value = accounts
})

const validationSchema = createFinancialRecordsValidation
// const validationSchema = null

const { handleSubmit, setFieldValue } = useForm({
    validationSchema
});



const addRecord = (record: RecordAccountAmountDetail) => {
    tempAccountRecords.value?.push(record)
}

const removeRecord = (record: RecordAccountDetail, index: number) => {
    if (index !== -1) {
        tempAccountRecords.value.splice(index, 1);
        // if (tempAccountRecords.value[index].credit_amount === undefined)
        updateCredit()
        // if (tempAccountRecords.value[index].debit_amount === undefined)
        updateDebit()
    }
}

const initAccountRecord = () => {


    // Call the update method to force the component to re-render


    totalCredit.value = 0
    totalDebit.value = 0
    tempAccountRecords.value = [] as RecordAccountAmountDetail[]
    // accountMultiselect.value.clear()
    addRecord({} as RecordAccountAmountDetail)
    addRecord({} as RecordAccountAmountDetail)
}

watch([totalCredit, totalDebit], () => {

    totalDifference.value = totalCredit.value - totalDebit.value
    if (totalDifference.value != 0) {
        totalColor.value = 'red-number'
    } else {
        totalColor.value = ''
    }
    if (totalCredit.value > totalDebit.value) {
        totalDebitColor.value = 'red-number'
        totalCreditText.value = ''
        totalDebitText.value = `+ ${Math.abs(totalDifference.value)}`
    } else if (totalCredit.value == totalDebit.value) {
        totalCreditColor.value = ''
        totalDebitColor.value = ''
        totalCreditText.value = ''
        totalDebitText.value = ''
    } else {
        totalCreditColor.value = 'red-number';
        totalDebitText.value = ''
        totalCreditText.value = `+ ${Math.abs(totalDifference.value)}`
    }
})

// watch(tempAccountRecords, () => {
//     console.log("sdf")
//     tempAccountRecords.value.forEach((element) => {
//         element.credit_amount = element?.credit_amount?.replace(/[^0-9]/g, '')
//     })
// }, { deep: true })

const emit = defineEmits(['input-finished']);

const debouncedCredit = debounce(() => {
    // Do something with the input value here, like emit an event
    totalCredit.value = 0
    tempAccountRecords.value.forEach((element, index) => {
        if (typeof element.credit_amount === 'string') element.credit_amount = undefined
        if (typeof element.credit_amount === 'number')
            totalCredit.value += element.credit_amount ?? 0
    })
    emit('input-finished', totalCredit);
}, 500);

const debouncedDebit = debounce(() => {
    // Do something with the input value here, like emit an event
    totalDebit.value = 0
    tempAccountRecords.value.forEach((element) => {
        if (typeof element.debit_amount === 'string') element.debit_amount = undefined
        if (typeof element.debit_amount === 'number')
            totalDebit.value += element.debit_amount ?? 0
    })
    emit('input-finished', totalDebit);
}, 500);

const updateCredit = (value?: number) => {
    debouncedCredit();
};

const updateDebit = () => {
    debouncedDebit();
};



const clearAccountValue = () => {

}

const setAccountValue = () => {
    tempAccountRecords.value.forEach((element, index) => {
        setFieldValue(`account_id_${index}`, element.account_id)
    });
}


const onSubmitAdd = handleSubmit(async () => {


    if (tempAccountRecords.value.length === 0) {
        notif.error(t('financial_record.must_add_record'))
        return;
    }
    if (totalDifference.value != 0 ||
        (totalDifference.value === 0 && (totalCredit.value == 0 || totalDebit.value == 0))) {
        notif.error(t('financial_record.records_are_note_balanced_error_msg'))
        return;
    }

    const data = getRecordsData(tempAccountRecords.value, recordTitle.value, recordNote.value, totalCredit.value)
    const { success, message, response } = await createRecords(data)
    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.add'))

        initAccountRecord()

        window.location.reload()

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

        notif.error(message)

    }



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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   </div> -->
                        <div class="columns mb-5">
                            <VButton class="mt-5" @click.prevent="addRecord({
                                account_id: undefined,
                                credit_amount: undefined,
                                debit_amount: undefined,
                                type: undefined,
                                has_remove_btn: true
                            })" color="primary">
                                {{ t('financial_record.add_new_row') }}
                            </VButton>
                        </div>
                        <!--Fieldset-->
                        <div class="columns">
                            <div class="column is-6">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel>
                                            {{ t('financial_record.record_title') }}</VLabel>
                                        <VControl icon="feather:chevron-right">
                                            <VInput type="text" placeholder="" autocomplete="" v-model="recordTitle" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <div class="columns" v-for="(record, mainIndex) in tempAccountRecords" :key="mainIndex">
                            <div class="column is-5">
                                <div class="mb-3">
                                    <VField :id="`account_id_${mainIndex}`">
                                        <VLabel class="required">
                                            {{ t('financial_record.select_account') }}</VLabel>
                                        <VControl>
                                            <Multiselect v-model="tempAccountRecords[mainIndex].account_id" mode="single"
                                                :placeholder="t('financial_record.select_account')" :close-on-select="true"
                                                ref="accountMultiselect" :filter-results="false" :min-chars="0"
                                                :resolve-on-load="false" :infinite="true" :limit="10" :rtl="true" :max="1"
                                                :clear-on-search="true" :delay="0" :searchable="true" :canClear="false"
                                                @select="setAccountValue()" :options="async (query: any) => {
                                                    let accountSearchFilter = {} as AccountSearchFilter
                                                    accountSearchFilter.name = query
                                                    const data = await getAllAccounts(accountSearchFilter)
                                                    //@ts-ignore
                                                    return data.accounts.map((item: any) => {
                                                        return { value: item.id, label: `${item.code} - ${item.name}` }
                                                    })
                                                }" @open="(select$: any) => {
    if (select$.noOptions) {
        select$.resolveOptions()
    }
}" />

                                        </VControl>zz
                                        <ErrorMessage class="help is-danger" :name="`account_id_${mainIndex}`" />
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField>
                                        <!-- <VField :id="`credit_amount_${mainIndex}`"> -->
                                        <VLabel>
                                            {{ t('financial_record.credit') }}</VLabel>
                                        <VControl icon="feather:dollar-sign">
                                            <VInput @input="() => updateCredit()"
                                                :class="[tempAccountRecords[mainIndex].debit_amount! > 0 && 'disabled-input']"
                                                :disabled="tempAccountRecords[mainIndex].debit_amount! > 0" type="number"
                                                v-model.number="tempAccountRecords[mainIndex].credit_amount" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField>
                                        <!-- <VField :id="`debit_amount_${mainIndex}`"> -->
                                        <VLabel>
                                            {{ t('financial_record.debit') }}</VLabel>
                                        <VControl icon="feather:dollar-sign">
                                            <VInput @input="() => updateDebit()"
                                                :class="[tempAccountRecords[mainIndex].credit_amount! > 0 && 'disabled-input']"
                                                :disabled="tempAccountRecords[mainIndex].credit_amount! > 0" type="number"
                                                v-model.number="tempAccountRecords[mainIndex].debit_amount" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-1">
                                <div class="mb-3">
                                    <VField v-if="tempAccountRecords[mainIndex].has_remove_btn">
                                        <VControl>
                                            <VButton class="remove_btn" @click="removeRecord(record, mainIndex)"
                                                color="danger">
                                                {{ t('financial_record.remove_row') }}
                                            </VButton>
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <div class="columns">
                            <div class="column is-5">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel>
                                            {{ t('financial_record.total') }}</VLabel>
                                    </VField>
                                </div>
                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel :class="totalCreditColor">
                                            {{ totalCreditText }}</VLabel>
                                    </VField>
                                </div>
                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel :class="totalDebitColor">
                                            {{ totalDebitText }}</VLabel>
                                    </VField>
                                </div>
                            </div>
                            <div class="column is-5">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel :class="totalColor">
                                            {{ (totalDifference != 0) ?
                                                t('financial_record.records_are_not_balanced')
                                                : (totalCredit > 0 ? t('financial_record.records_are_balanced') : '') }}
                                        </VLabel>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column is-12">
                                <div class="mb-3">
                                    <VField>
                                        <VLabel>
                                            {{ t('financial_record.record_note') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VTextarea rows=3 placeholder="" autocomplete="" v-model="recordNote" />
                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                :name="`service_price_${service.service.id}`" /> -->
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

.disabled-input {
    background-color: #f5f5f5;
}

.red-number {
    color: red !important;
}

.orange-number {
    color: orangered !important
}

.blue-number {
    color: blue !important;
}

.green-number {
    color: green !important;
}

.is-dark .disabled-input {
    background-color: #444444;
}

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