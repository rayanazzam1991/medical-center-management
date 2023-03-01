<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { addQuantity, defaultAddQuantityItem, ItemHsitoryConsts } from '../../models/Warehouse/ItemHistory/inventoryItemHistory';
import { addQuantityService, addItemHistoryFile } from '../../services/Warehouse/ItemHistory/inventoryItemHistoryService';
import { useItemHistoryForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { addQuantityvalidationSchema } from '/@src/rules/Warehouse/ItemHistory/addQuantityValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, CategorySearchFilter, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { defaultItemSearchFilter, Item, ItemSearchFilter } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { Media } from '/@src/models/Others/Media/media';
import { error } from 'node:console';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { Currency, defaultCurrency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { getCurrenciesFromStorage, getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Account, AccountConsts, AccountSearchFilter, defaultAccount } from '/@src/models/Accounting/Account/account';
import { CreateRecords, createRecordsWithDefault } from '/@src/models/Accounting/Transaction/record';
const itemStore = useItem()
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('add_quantity.form.title'))
const head = useHead({
  title: t('add_quantity.form.title'),
})
const itemHistoryForm = useItemHistoryForm()
itemHistoryForm.setStep({
  number: 1,
  canNavigate: true,
  skipable: false,
  validateStepFn: async () => {
    var isValid = await onSubmitAdd()
    if (isValid) {
      router.push({
        path: `/item/${currentaddQuantity.value.item_id}`,
      })
    }
  },

})
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('add_quantity.form.title')
const phoneCheck = ref<string>('false')
const currentaddQuantity = ref(defaultAddQuantityItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const itemHistoryFiles = ref<Array<Media>>([])
const filesToUpload = ref<File>()
const itemHistoryId = ref(0)
const allItemsList = ref<Item[]>([])
const cashAccountsList = ref<Account[]>([])
const suppliersAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const supplierAccountId = ref<number>(0)
const cashAccountId = ref<number>(0)
const inventoryAccountId = ref<number>(0)
const currencyId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableCurrencyRate = ref(false)
const cashAmount = ref(0)
const totalAmount = ref(0)
const remainAmount = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const itemsList = ref<Item[]>([])
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency
const itemQuantity = ref<number>(0)
const itemCost = ref<number>(0)
const differencesAmount = ref(0)
const differenceAccountId = ref(0)

const getCurrentAddQuantity = async () => {
  currentaddQuantity.value = itemHistoryForm.data
}
const mainCategoriesList = ref<Category[]>([])
onMounted(async () => {
  let categorySearchFilter = {} as CategorySearchFilter
  categorySearchFilter.status = BaseConsts.ACTIVE
  categorySearchFilter.per_page = 500
  const allCategories = await getFilterCategoriesList(categorySearchFilter)
  allCategoriesList.value = allCategories.categories
  mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
  await getCurrentAddQuantity();
  let accountSearchFilter = {
    per_page: 500
  } as AccountSearchFilter
  const { accounts } = await getAccountsList(accountSearchFilter)
  accounts.forEach((account) => {
    if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {

      cashAccountsList.value.push(account)

    } else
      if (account.chart_account?.code == ChartOfAccountConsts.SUPPLIER_CODE) {
        suppliersAccountsList.value.push(account)
      } else if (account.chart_account?.code == ChartOfAccountConsts.INVENTORY_CODE) {
        inventoryAccountId.value = account.id ?? 0
      } else if (account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE) {
        differenceAccountId.value = account.id ?? 0
      }
  });
  const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
  currenciesList.value = currencies
  availableCurrenciesList.value = currencies
})
const getSubCategoryByCategroy = () => {
  let categoriesFilter = {} as CategorySearchFilter
  categoriesFilter.status = BaseConsts.ACTIVE
  categoriesFilter.parent_id = selectedCategoryId.value
  const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
  subcategoeisList.value = SubCategory
  itemsList.value = []
  selectedSubCategoryId.value = undefined
  currentaddQuantity.value.item_id = 0
}
const getItemBySubCategroy = async () => {
  let itemSearchFilter = {} as ItemSearchFilter
  itemSearchFilter.status = BaseConsts.ACTIVE
  itemSearchFilter.per_page = 500
  const { items } = await getItemsList(itemSearchFilter)
  allItemsList.value = items
  let ItemFilter = {} as ItemSearchFilter
  ItemFilter.category_id = selectedSubCategoryId.value
  const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
  itemsList.value = Item
}
onMounted(() => {
  getCurrentAddQuantity()
})

const validationSchema = addQuantityvalidationSchema
const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    sub_category_id: undefined,
    item_id: undefined,
    item_quantity: "",
    add_item_cost: "",
    note: "",
    invoice_number: "",
    status: 1,
    cash_account: 0,
    cash_amount: 0,
    total_amount: 0,
    remain_amount: 0,
    currency_id: 0,
    currency_rate: 1,
    date: "",
    supplier_account: 0
  },
})
const onAddFile = async (event: any) => {
  const _file = event.target.files[0] as File
  let _message = ''
  if (_file) {

    if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
      _message = t('toast.file.type')
      await sleep(500);
      notif.error(_message)

    } else if (_file.size > (2 * 1024 * 1024)) {
      _message = t('toast.file.size')
      await sleep(500);
      notif.error(_message)

    } else {

      filesToUpload.value = _file
    }
  }
}

const onSubmitAdd = handleSubmit(async (values) => {
  const selectedCashAccount = cashAccountsList.value.find((account) => account.id == cashAccountId.value) ?? defaultAccount
  if (!selectedCashAccount.currency?.is_main) {
    differencesAmount.value = cashAmount.value - (cashAmount.value * selectedCashAccount.currency_rate / currencyRate.value)

  } else {
    differencesAmount.value = 0

  }
  let addQuantityForm = currentaddQuantity.value
  addQuantityForm.item_quantity = itemQuantity.value
  addQuantityForm.add_item_cost = itemCost.value
  addQuantityForm.record.amount = totalAmount.value
  addQuantityForm.record.currency_id = currencyId.value
  addQuantityForm.record.currency_rate = currencyRate.value
  addQuantityForm.record.transaction_type_id = 1
  addQuantityForm.record.recordType = undefined
  addQuantityForm.record.date = createRecord.value.date

  addQuantityForm.record.accounts = []
  addQuantityForm.record.accounts.push(
    { account_id: inventoryAccountId.value, amount: totalAmount.value, type: AccountConsts.DEBIT_TYPE },
    { account_id: cashAccountId.value, amount: cashAmount.value - differencesAmount.value, type: AccountConsts.CREDIT_TYPE })
  if (remainAmount.value > 0) {
    createRecord.value.accounts.push(
      { account_id: supplierAccountId.value, amount: remainAmount.value, type: AccountConsts.CREDIT_TYPE },
    )
  }
  if (differencesAmount.value != 0) {
    createRecord.value.accounts.push(
      { account_id: differenceAccountId.value, amount: differencesAmount.value, type: differencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
    )
  }

  const { addQuantity, success, message } = await addQuantityService(addQuantityForm)
  if (success) {
    let formData = new FormData();
    if (filesToUpload.value != undefined) {

      formData.append('images[]', filesToUpload.value);
      const { success, message, media } = await addItemHistoryFile(addQuantity.id, formData)
      if (success) {
        await sleep(500);
        media[0].file_name = media[0].relative_path
        media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path
        itemHistoryFiles.value.push(media[0])
        filesToUpload.value = undefined
        notif.dismissAll();
        await sleep(500)
        notif.success(t('toast.success.add'));
        router.push({ path: `/item` });

      } else {
        notif.error(message)

      }
    } else {
      await sleep(500)
      notif.success(t('toast.success.add'));
      router.push({ path: `/list-inventory-movement` });

    }
  }
  else {
    await sleep(500);
    notif.error(message)
  }
})
watch(itemQuantity, (value) => {
  totalAmount.value = value * itemCost.value
}
)
watch(itemCost, (value) => {
  totalAmount.value = itemQuantity.value * value
}
)
watch(totalAmount, (value) => {
  remainAmount.value = value - cashAmount.value
}
)
watch(cashAmount, (value) => {
  remainAmount.value = totalAmount.value - value
}
)
watch(currencyId, (value) => {
  let selectedCurreny = currenciesList.value.find((currency) => currency.id === value);
  if (selectedCurreny?.is_main) {
    enableCurrencyRate.value = false
    currencyRate.value = 1
  } else {
    enableCurrencyRate.value = true
  }
})
watch(cashAccountId, (value) => {
  if (value) {

    let selectedCashAccount = cashAccountsList.value.find((account) => account.id === value);
    availableCurrenciesList.value = []
    currenciesList.value.forEach((currency) => {
      if (currency.is_main == selectedCashAccount?.currency?.is_main) {
        availableCurrenciesList.value.push(currency)
      }
    });
    currencyId.value = 0
  } else {
    availableCurrenciesList.value = currenciesList.value
  }
})

</script>

<template>
  <div class="page-content-inner">
    <form class="form-layout" @submit.prevent="">
      <div class="form-outer">
        <div class="form-body">
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ pageTitle }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-6">
                <VField>
                  <VLabel class="required">{{ t('add_quantity.form.level_1') }}</VLabel>
                  <VControl>
                    <div class="select">
                      <select @change="getSubCategoryByCategroy" v-if="currentaddQuantity" v-model="selectedCategoryId">
                        <VOption value="">{{ t('add_quantity.form.select_level_1') }}</VOption>
                        <VOption v-for="category in mainCategoriesList" :key="category.id" :value="category.id">{{
                          category.name }}
                        </VOption>
                      </select>
                    </div>
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="sub_category_id">
                  <VLabel class="required">
                    {{ t('add_quantity.form.level_2') }}
                  </VLabel>
                  <VControl>
                    <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                      v-if="currentaddQuantity" v-model="selectedSubCategoryId">
                      <VOption>{{ t('add_quantity.form.select_level_2') }}</VOption>
                      <VOption v-for="subCategory in subcategoeisList" :key="subCategory.id" :value="subCategory.id">
                        {{ subCategory.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="sub_category_id" />

                  </VControl>
                </VField>
              </div>
            </div>
            <!--Fieldset-->
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="item_id">
                  <VLabel class="required" style="position:relative">
                    {{ t('add_quantity.form.item') }}
                    <div v-if="itemStore.loading" class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                    </div>
                  </VLabel>
                  <VControl>
                    <!-- <div class="select"> -->
                    <VSelect :disabled="itemsList.length <= 0" v-if="currentaddQuantity"
                      v-model="currentaddQuantity.item_id">
                      <VOption value=""> {{ t('add_quantity.form.select_item') }}</VOption>
                      <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="item_id" />
                    <!-- </div> -->
                  </VControl>
                </VField>
              </div>

            </div>
            <!--Fieldset-->
            <div class="columns is-multiline mt-5">
              <div class="column is-6 ">
                <VField id="add_item_cost">
                  <VLabel class="required">{{ t('add_quantity.form.item_cost') }}{{
                    addParenthesisToString(mainCurrency.name) }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="itemCost" type="number" placeholder="" autocomplete="given-add_item_cost" />
                    <ErrorMessage class="help is-danger" name="add_item_cost" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="item_quantity">
                  <VLabel class="required"> {{ t('add_quantity.form.item_quantity') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="itemQuantity" type="number" placeholder="" autocomplete="given-item_quantity" />
                    <ErrorMessage class="help is-danger" name="item_quantity" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="total_amount">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.total_amount') }}</VLabel>
                  <VControl >
                    <VInput disabled v-model="totalAmount" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="total_amount" />
                  </VControl>
                </VField>
              </div>
            </div>
            <div class="columns is-multiline mt-5">
              <div class="column is-6">
                <VField id="supplier_account">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.supplier_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="supplierAccountId">
                      <VOption :value="0"> {{
                        t('supplier_cash_receipt.form.select_account') }}</VOption>
                      <VOption v-for="account in suppliersAccountsList" :value="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="supplier_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="cash_account">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.cash_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="cashAccountId">
                      <VOption :value="0"> {{ t('supplier_cash_receipt.form.select_account')
                      }}</VOption>
                      <VOption v-for="account in cashAccountsList" :value="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="cash_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="currency_id">
                  <VLabel class="required">{{ t('add_custom_revenue.form.currency') }}</VLabel>
                  <VControl>
                    <VSelect v-model="currencyId">
                      <VOption :value="0"> {{ t('add_custom_revenue.form.select_currency')
                      }}</VOption>
                      <VOption v-for="currency in availableCurrenciesList" :value="currency.id">
                        {{ currency.code }} - {{ currency.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="currency_id" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="currency_rate">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.currency_rate') }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="cash_amount">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.cash_amount') }}</VLabel>
                  <VControl>
                    <VInput v-model="cashAmount" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="cash_amount" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="remain_amount">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.remaining_amount') }}</VLabel>
                  <VControl>
                    <VInput disabled v-model="remainAmount" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="remain_amount" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="date">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.date') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="createRecord.date" placeholder="" type="date" />
                    <ErrorMessage class="help is-danger" name="date" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="status" v-slot="{ field }">
                  <VLabel class="required">{{ t('add_quantity.form.status') }}</VLabel>
                  <VControl>
                    <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.ACTIVE"
                      :label="ItemHsitoryConsts.showStatusName(1)" name="status" color="success" />
                    <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.INACTIVE"
                      :label="ItemHsitoryConsts.showStatusName(0)" name="status" color="danger" />
                    <ErrorMessage name="status" class="help is-danger" />
                  </VControl>
                </VField>
              </div>
            </div>
            <!--Fieldset-->
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="note">
                  <VLabel class="optinal">{{ t('add_quantity.form.item_note') }}</VLabel>
                  <VControl>
                    <VTextarea v-model="currentaddQuantity.note" />
                    <ErrorMessage class="help is-danger" name="note" />
                  </VControl>
                </VField>
              </div>
            </div>
            <div class="columns is-multiline">
              <div class="column is-6">
                <VField id="invoice_number">
                  <VLabel class="optinal">{{ t('add_quantity.form.invoice_number') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="currentaddQuantity.invoice_number" type="text" placeholder=""
                      autocomplete="given-invoice_number" />
                    <ErrorMessage class="help is-danger" name="invoice_number" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField>
                  <VLabel class="optinal">{{ t('add_quantity.form.invoice_image') }}</VLabel>
                  <VControl>
                    <div class="file has-name">
                      <label class="file-label">
                        <input class="file-input" type="file" v-on:change="onAddFile" />
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                          </span>
                          <span class="file-label"> {{ t('images.image_name_placeholder') }}
                          </span>
                        </span>
                        <span class="file-name light-text">
                          {{ filesToUpload?.name ?? t('images.image_select_file') }}
                        </span>
                      </label>
                    </div>
                  </VControl>
                </VField>
                <h6 class="font ml-2 mt-2 help">{{ t('images.accepted_image_file') }}
                </h6>
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

.font {
  font-size: xx-small;
}

.Vi {
  width: 28.5em;
}

.form-layout .form-outer .form-body {
  padding: 20px 40px 40px;
  padding-bottom: 72px;

}


.lab {
  margin-left: .77em;
  margin-bottom: .27em;
  display: block;
}

.layout {
  min-width: 50%;
}

.form-fieldset {
  max-width: 45%;
}
</style>
