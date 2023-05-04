<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "transaction_create"
    ]
  }
}
</route>

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
import { defaultCreditAccountDetail, defaultDebitAccountDetail, RecordAccountDetail, RecordAccountAmountDetail, defaultAccountSearchFilter, AccountSearchFilter, Account, AccountConsts, defaultAccount } from '/@src/models/Accounting/Account/account';
import { getAllAccounts } from '/@src/services/Accounting/Account/accountService';
import { createFinancialRecordsValidation } from '/@src/rules/Accounting/Transaction/createFinancialRecordsValidation';
import debounce from 'lodash.debounce';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { Currency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const transactionStore = useTransaction()

viewWrapper.setPageTitle(t('financial_record.title'))
const head = useHead({
  title: t('financial_record.title'),
});

const notif = useNotyf() as Notyf

const pageTitle = t('financial_record.add_new')
const formType = ref("");
formType.value = "Add";
const formTypeName = "Add"
const backRoute = "";

const tempAccountRecords = ref<RecordAccountAmountDetail[]>([]);
const currenciesList = ref<Currency[]>([])
const currencyId = ref<number>(0);
const currencyRate = ref<number>(1);
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
const enableCurrencyRate = ref(false)
const totalCreditCurrenciesDifferenceAmount = ref(0)
const totalDebitCurrenciesDifferenceAmount = ref(0)
const totalCurrenciesDifferenceAmount = ref(0)
const confirmationPopup = ref(false)

const accountsListDropDown = ref<Account[]>([]);

onMounted(async () => {

  addRecord({ has_remove_btn: false, difference_amount: 0 } as RecordAccountAmountDetail)
  addRecord({ has_remove_btn: false, difference_amount: 0 } as RecordAccountAmountDetail)

  let accountSearchFilter = {
    per_page: 500,
    status: AccountConsts.ACTIVE
  } as AccountSearchFilter
  const { accounts } = await getAllAccounts(accountSearchFilter)
  accountsListDropDown.value = accounts
  const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
  currenciesList.value = currencies

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
    updateCredit()
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
watch(currencyId, (value) => {
  let selectedCurreny = currenciesList.value.find((currency) => currency.id === value);
  if (selectedCurreny?.is_main) {
    enableCurrencyRate.value = false
    currencyRate.value = 1
  } else {
    enableCurrencyRate.value = true
  }
})
watch(currencyRate, (value) => {
  calcCurrencyDifferences()
})


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
  calcCurrencyDifferences()
};

const updateDebit = () => {
  debouncedDebit();
  calcCurrencyDifferences()
};

const setAccountValue = () => {
  tempAccountRecords.value.forEach((element, index) => {
    setFieldValue(`account_id_${index}`, element.account_id)
  });
}

const onSubmitConfirmation = handleSubmit(() => {
  calcCurrencyDifferences()
  confirmationPopup.value = true

})

const onSubmitAdd = handleSubmit(async () => {
  if (currencyId.value == 0) {
    notif.error(t('financial_record.currency_is_required'))
    return;

  }
  if (currencyRate.value < 1) {
    notif.error(t('financial_record.currency_rate_error'))
    return;

  }

  if (tempAccountRecords.value.length === 0) {
    notif.error(t('financial_record.must_add_record'))
    return;
  }
  if (totalDifference.value != 0 ||
    (totalDifference.value === 0 && (totalCredit.value == 0 || totalDebit.value == 0))) {
    notif.error(t('financial_record.records_are_note_balanced_error_msg'))
    return;
  }
  const selectedCurrency = currenciesList.value.find((currency) => currency.id == currencyId.value)
  let index = 1;
  tempAccountRecords.value.forEach(entry => {
    const account = accountsListDropDown.value.find((account) => account.id == entry.account_id) ?? defaultAccount
    if (!account?.currency?.is_main && selectedCurrency?.is_main) {
      if (index == 1) {
        index++
      }

    }

  });
  if (index > 1) {
    notif.error(t('financial_record.currency_must_be_dollar'))
    return;
  }
  const data = getRecordsData(tempAccountRecords.value, recordTitle.value, recordNote.value, totalCredit.value, currencyId.value, currencyRate.value, accountsListDropDown.value, currenciesList.value)
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

const calcCurrencyDifferences = debounce(() => {
  totalCreditCurrenciesDifferenceAmount.value = 0
  totalDebitCurrenciesDifferenceAmount.value = 0
  totalCurrenciesDifferenceAmount.value = 0
  tempAccountRecords.value.forEach((entry) => {
    const account = accountsListDropDown.value.find((account) => account.id == entry.account_id) ?? defaultAccount
    if (!account?.currency?.is_main) {
      if (entry.credit_amount) {
        if (account.chart_account?.account_type == AccountConsts.DEBIT_TYPE) {
          entry.difference_amount = entry.credit_amount - (entry.credit_amount * account.currency_rate / currencyRate.value)
          totalCreditCurrenciesDifferenceAmount.value += entry.difference_amount
        } else {
          entry.difference_amount = 0
        }


      } else if (entry.debit_amount) {
        if (account.chart_account?.account_type == AccountConsts.CREDIT_TYPE) {
          entry.difference_amount = entry.debit_amount - (entry.debit_amount * account.currency_rate / currencyRate.value)
          totalDebitCurrenciesDifferenceAmount.value += entry.difference_amount
        } else {
          entry.difference_amount = 0
        }

      }
    } else {
      entry.difference_amount = 0
    }
  });
  totalCurrenciesDifferenceAmount.value = totalCreditCurrenciesDifferenceAmount.value - totalDebitCurrenciesDifferenceAmount.value
}, 1000)
</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
      @onSubmit="onSubmitConfirmation" :isLoading="transactionStore?.loading" />
    <form class="form-layout" @submit.prevent="onSubmitConfirmation">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-fieldset">
            <!--Fieldset-->
            <div class="columns">
              <div class="column is-6">
                <div>
                  <VField>
                    <VLabel>
                      {{ t('financial_record.record_title') }}</VLabel>
                    <VControl icon="feather:chevron-right">
                      <VInput type="text" placeholder="" autocomplete="" v-model="recordTitle" />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <div>
                  <VField>
                    <VLabel class="required">
                      {{ t('financial_record.currency') }}</VLabel>
                    <VSelect v-model="currencyId">
                      <VOption :value="0"> {{ t('financial_record.select_currency')
                      }}</VOption>
                      <VOption v-for="currency in currenciesList" :value="currency.id">
                        {{ currency.code }} - {{ currency.name }}
                      </VOption>
                    </VSelect>
                  </VField>
                </div>
              </div>
              <div class="column is-3">
                <VField>
                  <VLabel class="required">{{ t('financial_record.currency_rate') }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder="" type="number" />
                  </VControl>
                </VField>
              </div>

            </div>
            <div class="columns mb-0" v-for="(record, mainIndex) in tempAccountRecords" :key="mainIndex">
              <div class="column is-6">
                <div class="mb-3">
                  <VField :id="`account_id_${mainIndex}`">
                    <VLabel v-if="mainIndex == 0" class="required">
                      {{ t('financial_record.select_account') }}</VLabel>
                    <VControl>
                      <Multiselect v-model="tempAccountRecords[mainIndex].account_id" mode="single"
                        :placeholder="t('financial_record.select_account')" :close-on-select="true"
                        ref="accountMultiselect" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                        :infinite="true" :limit="20" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                        :searchable="true" :canClear="false" @select="setAccountValue()" :options="async (query: any) => {
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

                    </VControl>
                    <ErrorMessage class="help is-danger" :name="`account_id_${mainIndex}`" />
                  </VField>
                </div>

              </div>
              <div class="column is-3">
                <div class="mb-3">
                  <VField>
                    <VLabel v-if="mainIndex == 0">
                      {{ t('financial_record.debit') }}</VLabel>
                    <VControl>
                      <VInput @input="() => updateDebit()"
                        :class="[tempAccountRecords[mainIndex].credit_amount! > 0 && 'disabled-input']"
                        :disabled="tempAccountRecords[mainIndex].credit_amount! > 0" type="number"
                        v-model.number="tempAccountRecords[mainIndex].debit_amount" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="column is-3">
                <div class="mb-3">
                  <VField>
                    <VLabel v-if="mainIndex == 0">
                      {{ t('financial_record.credit') }}</VLabel>
                    <VControl>
                      <VInput @input="() => updateCredit()"
                        :class="[tempAccountRecords[mainIndex].debit_amount! > 0 && 'disabled-input']"
                        :disabled="tempAccountRecords[mainIndex].debit_amount! > 0" type="number"
                        v-model.number="tempAccountRecords[mainIndex].credit_amount" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="column is-1 columns is-flex is-align-items-center">
                <div class="mb-3 column is-6">
                  <VField v-if="tempAccountRecords[mainIndex].has_remove_btn">
                    <VControl>
                      <VIconButton icon="feather:trash-2" class="remove_btn" @click="removeRecord(record, mainIndex)"
                        color="danger">
                      </VIconButton>
                    </VControl>
                  </VField>
                </div>
                <p v-if="tempAccountRecords[mainIndex].difference_amount != 0" class="mb-3 column is-6 help is-danger">
                  {{ t('financial_record.currency_difference') }} {{
                    tempAccountRecords[mainIndex].difference_amount }}
                </p>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <div>
                  <VField>
                    <VLabel>
                      {{ t('financial_record.total') }}</VLabel>
                  </VField>
                </div>
              </div>
              <div class="column is-3">
                <div>
                  <VField>
                    <VLabel :class="totalCreditColor">
                      {{ totalCreditText }}</VLabel>
                  </VField>
                </div>
              </div>
              <div class="column is-3">
                <div>
                  <VField>
                    <VLabel :class="totalDebitColor">
                      {{ totalDebitText }}</VLabel>
                  </VField>
                </div>
              </div>
              <div class="column is-3">
                <div>
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
            <div class="columns px-3 py-2">

              <VButton @click.prevent="addRecord({
                account_id: undefined,
                credit_amount: undefined,
                debit_amount: undefined,
                type: undefined,
                has_remove_btn: true,
                difference_amount: 0
              })" color="primary">
                {{ t('financial_record.add_new_row') }}
              </VButton>
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
                  </VField>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  </div>
  <VModal :title="t('financial_record.confirm_popup.title')" :open="confirmationPopup" actions="center"
    @close="confirmationPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('financial_record.confirm_popup.confirmation')"
        :subtitle="t('financial_record.confirm_popup.currency_difference', { currency_difference: totalCurrenciesDifferenceAmount })" />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="transactionStore.loading">
        <VButton color="primary" raised @click="onSubmitAdd">{{ t('modal.buttons.confirm') }}
        </VButton>
      </VLoader>
    </template>
  </VModal>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.disabled-input {
  background-color: #f5f5f5;
}

.red-number {
  color: rgba(255, 0, 0, 0.836) !important;
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



.form-layout .form-outer .form-body {
  padding: 20px 40px 40px;
}

.layout {
  min-width: 50%;
}

.form-fieldset {
  max-width: 60%;
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
  margin-top: 0;
}

.control.has-icon {
  .input {
    height: 2.6em;
  }
}
</style>
