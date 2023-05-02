<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "inventory_item_history_create"
        ]
    }
}
</route>
    
<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultWithdrawQuantityItem, InventoryItemHistoryConsts } from '../../models/Warehouse/ItemHistory/inventoryItemHistory';
import { withdrawQuantityService } from '../../services/Warehouse/ItemHistory/inventoryItemHistoryService';
import { useWithdrawItemForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { withdrawQuantityvalidationSchema } from '/@src/rules/Warehouse/ItemHistory/withdrawQuantityValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, CategorySearchFilter, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { defaultItem, defaultItemSearchFilter, Item, ItemConsts, ItemSearchFilter } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { Contractor } from '/@src/models/Contractor/contractor';
import { defaultEmployeeSearchFilter, Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';
import { Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency';
import { getCurrenciesFromStorage } from '/@src/services/Accounting/Currency/currencyService';
const itemStore = useItem()
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('withdraw_quantity.form.title'))
const head = useHead({
    title: t('withdraw_quantity.form.title'),
})
const withdarwQuantityForm = useWithdrawItemForm()
withdarwQuantityForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        await onSubmitAdd()
    },
})

const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('withdraw_quantity.form.title')
const currentwithdrawQuantity = ref(defaultWithdrawQuantityItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const employeesList = ref<Employee[]>([])
const requesterId = ref()
const selectedItem = ref()
const allItemsList = ref<Item[]>([])
const itemsList = ref<Item[]>([])
const itemCostPriceQuantity = ref({ cost: 0, price: 0, quantity: 0 })
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency

const getCurrentWithdrawQuantity = async () => {
    currentwithdrawQuantity.value = withdarwQuantityForm.dataWithdraw
}
const mainCategoriesList = ref<Category[]>([])
onMounted(async () => {
    let categorySearchFilter = {} as CategorySearchFilter
    categorySearchFilter.status = BaseConsts.ACTIVE
    categorySearchFilter.per_page = 500
    const allCategories = await getFilterCategoriesList(categorySearchFilter)
    allCategoriesList.value = allCategories.categories
    mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
    await getCurrentWithdrawQuantity();
    let employeeSearchFilter = {} as EmployeeSearchFilter
    employeeSearchFilter.per_page = 500
    employeeSearchFilter.user_status_id = UserStatusConsts.ACTIVE

    const { employees } = await getEmployeesList(employeeSearchFilter)
    employeesList.value = employees
})
const getSubCategoryByCategroy = () => {
    let categoriesFilter = {} as CategorySearchFilter
    categoriesFilter.parent_id = selectedCategoryId.value
    const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
    subcategoeisList.value = SubCategory
    itemsList.value = []
    selectedSubCategoryId.value = undefined
    selectedItem.value = undefined
    currentwithdrawQuantity.value.item_id = 0
}
const getItemBySubCategroy = async () => {
    let itemSearchFilter = {} as ItemSearchFilter
    itemSearchFilter.status = BaseConsts.ACTIVE
    itemSearchFilter.is_for_sale = ItemConsts.IS_NOT_FORE_SALE
    itemSearchFilter.per_page = 500
    const { items } = await getItemsList(itemSearchFilter)
    allItemsList.value = items
    let ItemFilter = {} as ItemSearchFilter
    ItemFilter.category_id = selectedSubCategoryId.value
    const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
    itemsList.value = Item
}

watch(selectedItem, (value) => {
    const Item = allItemsList.value.find((item) => item.id == value)
    itemCostPriceQuantity.value.cost = Item?.cost ?? 0
    itemCostPriceQuantity.value.price = Item?.price ?? 0
    itemCostPriceQuantity.value.quantity = Item?.quantity_in_main_inventory ?? 0
})

const validationSchema = withdrawQuantityvalidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        sub_category_id: undefined,
        item_id: undefined,
        user_id: undefined,
        item_quantity: "",
        note: "",
        status: 1,
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    let withdrawQuantityData = currentwithdrawQuantity.value
    withdrawQuantityData.item_id = selectedItem.value
    withdrawQuantityData.item_quantity = itemCostPriceQuantity.value.quantity
    withdrawQuantityData.causerable_id = requesterId.value
    const { withdrawQuantity, success, message } = await withdrawQuantityService(withdrawQuantityData)
    if (success) {
        let formData = new FormData();
        // @ts-ignore
        notif.dismissAll();
        // @ts-ignore
        await sleep(500)
        notif.success(t('toast.success.withdraw'));

        router.push({ path: `/list-inventory-movement` });
    }
    else {
        await sleep(500);
        notif.error(message)
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
                                    <VLabel class="required">{{ t('withdraw_quantity.form.level_1') }}</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentwithdrawQuantity"
                                                v-model="selectedCategoryId">
                                                <VOption :value="0">{{ t('withdraw_quantity.form.select_level_1') }}
                                                </VOption>
                                                <VOption v-for="category in mainCategoriesList" :key="category.id"
                                                    :value="category.id">{{ category.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="sub_category_id">
                                    <VLabel class="required">{{ t('withdraw_quantity.form.level_2') }}</VLabel>
                                    <VControl>
                                        <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                                            v-if="currentwithdrawQuantity" v-model="selectedSubCategoryId">
                                            <VOption>{{ t('withdraw_quantity.form.select_level_1') }}</VOption>
                                            <VOption v-for="subCategory in subcategoeisList" :key="subCategory.id"
                                                :value="subCategory.id">
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
                            <div class="column is-6">
                                <VField id="item_id">
                                    <VLabel class="required" style="position:relative">
                                        {{ t('withdraw_quantity.form.item') }}
                                        <div v-if="itemStore.loading"
                                            class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <VSelect :disabled="itemsList.length <= 0" v-if="currentwithdrawQuantity"
                                            v-model="selectedItem">
                                            <VOption>{{ t('withdraw_quantity.form.select_item') }}</VOption>
                                            <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                                {{ item.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="item_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="item_quantity">
                                    <VLabel class="required"> {{ t('withdraw_quantity.form.item_quantity') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="itemCostPriceQuantity.quantity" type="number" placeholder=""
                                            autocomplete="given-item_quantity" />
                                        <ErrorMessage class="help is-danger" name="item_quantity" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-3">
                                <VField id="withdraw_item_price">
                                    <VLabel class="required">{{ t('withdraw_quantity.form.item_price') }}{{
                                        addParenthesisToString(mainCurrency.name) }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput disabled v-model="itemCostPriceQuantity.price" type="number" placeholder=""
                                            autocomplete="given-withdraw_item_price" />
                                        <ErrorMessage class="help is-danger" name="withdraw_item_price" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-3">
                                <VField id="withdraw_item_price">
                                    <VLabel class="required">{{ t('withdraw_quantity.form.item_cost') }}{{
                                        addParenthesisToString(mainCurrency.name) }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput disabled v-model="itemCostPriceQuantity.cost" type="number" placeholder=""
                                            autocomplete="given-withdraw_item_price" />
                                        <ErrorMessage class="help is-danger" name="withdraw_item_price" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="status">
                                    <VLabel class="required">{{ t('withdraw_quantity.form.status') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentwithdrawQuantity.status"
                                            :value="InventoryItemHistoryConsts.ACTIVE_ITEM_HISTORY"
                                            :label="InventoryItemHistoryConsts.getStatusName(InventoryItemHistoryConsts.ACTIVE_ITEM_HISTORY)"
                                            name="status" color="success" />
                                        <VRadio v-model="currentwithdrawQuantity.status"
                                            :value="InventoryItemHistoryConsts.INACTIVE_ITEM_HISTORY"
                                            :label="InventoryItemHistoryConsts.getStatusName(InventoryItemHistoryConsts.INACTIVE_ITEM_HISTORY)"
                                            name="status" color="danger" />
                                        <ErrorMessage name="status" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6" v-if="employeesList">
                                <VField id="user_id">
                                    <VLabel class="required">{{ t('withdraw_quantity.form.requester_name') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="requesterId">
                                            <VOption value="0">{{ t('withdraw_quantity.form.employee') }}</VOption>
                                            <VOption v-for="employee in employeesList" :key="employee.id"
                                                :value="employee.id">
                                                {{ employee.user.first_name }} {{ employee.user.last_name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="user_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel class="optinal">{{ t('withdraw_quantity.form.item_note') }}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentwithdrawQuantity.note" />
                                        <ErrorMessage class="help is-danger" name="note" />
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
