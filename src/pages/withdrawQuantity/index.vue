<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { withdrawQuantity, defaultWithdrawQuantityItem, ItemHsitoryConsts } from '/@src/models/Warehouse/ItemHistory/itemHistory';
import { withdrawQuantityService } from '/@src/services/Warehouse/ItemHistory/itemHistoryService';
import { useWithdrawItemForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { withdrawQuantityvalidationSchema } from '/@src/rules/Warehouse/ItemHistory/withdrawQuantityValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { defaultItemSearchFilter, Item } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { Contractor, defaultContractorSearchFilter } from '/@src/models/Contractor/contractor';
import { defaultEmployeeSearchFilter, Employee } from '/@src/models/Employee/employee';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
const itemStore = useItem()

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Withdraw Quantity')
const head = useHead({
    title: 'Withdraw Quantity',
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

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Withdraw Quantity'
const phoneCheck = ref<string>('false')
const currentwithdrawQuantity = ref(defaultWithdrawQuantityItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const itemHistoryId = ref(0)
const isType = ref(false)
const employeesList = ref<Employee[]>([])
const contractorsList = ref<Contractor[]>([])
const requesterId = ref()

const getCurrentWithdrawQuantity = async () => {
    currentwithdrawQuantity.value = withdarwQuantityForm.dataWithdraw
}
const mainCategoriesList = ref<Category[]>([])
onMounted(async () => {
    const allCategories = await getFilterCategoriesList(defaultCategorySearchFilter)
    allCategoriesList.value = allCategories.categories
    mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
    await getCurrentWithdrawQuantity();
    const { employees } = await getEmployeesList(defaultEmployeeSearchFilter)
    employeesList.value = employees
    const { contractors } = await getContractorsList(defaultContractorSearchFilter)
    contractorsList.value = contractors
})

const getSubCategoryByCategroy = () => {
    let categoriesFilter = defaultCategorySearchFilter
    categoriesFilter.parent_id = selectedCategoryId.value
    const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
    subcategoeisList.value = SubCategory
}
const allItemsList = ref<Item[]>([])
const itemsList = ref<Item[]>([])
const getItemBySubCategroy = async () => {
    const { items } = await getItemsList(defaultItemSearchFilter)
    allItemsList.value = items
    let ItemFilter = defaultItemSearchFilter
    ItemFilter.category_id = selectedSubCategoryId.value
    const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
    itemsList.value = Item
}
onMounted(() => {
    getCurrentWithdrawQuantity()
})

const validationSchema = withdrawQuantityvalidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        item_id: undefined,
        user_id: undefined,
        item_quantity: "",
        withdraw_item_price: "",
        note: "",
        status: 1,
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    let withdrawQuantityForm = currentwithdrawQuantity.value
    withdrawQuantityForm.item_id = withdrawQuantityForm.item_id
    withdrawQuantityForm.item_quantity = withdrawQuantityForm.item_quantity
    withdrawQuantityForm.withdraw_item_price = withdrawQuantityForm.withdraw_item_price
    withdrawQuantityForm.status = withdrawQuantityForm.status
    withdrawQuantityForm.note = withdrawQuantityForm.note
    if (isType.value == true && requesterId != undefined) {
        const employee = employeesList.value.find((employee) => employee.id == requesterId.value)
        withdrawQuantityForm.user_id = employee?.user.id ?? 0
        withdrawQuantityForm.requester_name = employee?.user.first_name + ' ' + employee?.user.last_name ?? ''
        withdrawQuantityForm.requester_type = 'Employee'
    } else if (isType.value == false && requesterId != undefined) {
        const contractor = contractorsList.value.find((contractor) => contractor.id == requesterId.value)
        withdrawQuantityForm.user_id = contractor?.user.id ?? 0
        withdrawQuantityForm.requester_name = contractor?.user.first_name + ' ' + contractor?.user.last_name ?? ''
        withdrawQuantityForm.requester_type = 'Contractor'
    }
    else {
        return false
    }
    const { withdrawQuantity, success, message } = await withdrawQuantityService(withdrawQuantityForm)
    if (success) {
        let formData = new FormData();
        // @ts-ignore
        notif.dismissAll();
        // @ts-ignore
        await sleep(500)
        notif.success(`${withdrawQuantity.item.name} ${viewWrapper.pageTitle} was withdrawed successfully`);

        router.push({ path: `/item/${withdrawQuantity.item.id}` });
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
                                <VField id="item_id">
                                    <VLabel class="required">Level 1</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentwithdrawQuantity"
                                                v-model="selectedCategoryId">
                                                <VOption :value="0">Select Level 1</VOption>
                                                <VOption v-for="category in mainCategoriesList" :key="category.id"
                                                    :value="category.id">{{ category.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="item_id">
                                    <VLabel class="required">Level 2</VLabel>
                                    <VControl>
                                        <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                                            v-if="currentwithdrawQuantity" v-model="selectedSubCategoryId">
                                            <VOption>Select Level 2</VOption>
                                            <VOption v-for="subCategory in subcategoeisList" :key="subCategory.id"
                                                :value="subCategory.id">
                                                {{ subCategory.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="item_id">
                                    <VLabel class="required" style="position:relative">
                                        {{ viewWrapper.pageTitle }} Item
                                        <div v-if="itemStore.loading"
                                            class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select :disabled="itemsList.length <= 0" v-if="currentwithdrawQuantity"
                                                v-model="currentwithdrawQuantity.item_id">
                                                <VOption :value="0">
                                                    Select Item
                                                </VOption>
                                                <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                                    {{ item.name }}
                                                </VOption>
                                            </select>
                                            <ErrorMessage class="help is-danger" name="item_id" />

                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="item_quantity">
                                    <VLabel class="required"> Item Quantity</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentwithdrawQuantity.item_quantity" type="number"
                                            placeholder="" autocomplete="given-item_quantity" />
                                        <ErrorMessage class="help is-danger" name="item_quantity" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="withdraw_item_price">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Item Price</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentwithdrawQuantity.withdraw_item_price" type="number"
                                            placeholder="" autocomplete="given-withdraw_item_price" />
                                        <ErrorMessage class="help is-danger" name="withdraw_item_price" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="status">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentwithdrawQuantity.status"
                                            :value="ItemHsitoryConsts.ACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(1)" name="status"
                                            color="success" />
                                        <VRadio v-model="currentwithdrawQuantity.status"
                                            :value="ItemHsitoryConsts.INACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(0)" name="status"
                                            color="warning" />
                                        <ErrorMessage name="status" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6 is-flex is-justify-content">
                                <VField>
                                    <VLabel class="required">Requester Type</VLabel>
                                    <VControl>
                                        <VSwitchSegment v-model="isType" label-true="Employee" label-false="Contractor"
                                            color="success" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6" v-if="employeesList">
                                <VField>
                                    <VLabel class="required">Requester Name</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select v-if="isType" v-model="requesterId">
                                                <VOption value="0">Employee</VOption>
                                                <VOption v-for="employee in employeesList" :key="employee.id"
                                                    :value="employee.id">
                                                    {{ employee.user.first_name }}
                                                </VOption>
                                            </select>
                                            <select v-else v-model="requesterId">
                                                <VOption :value="0">Contractor</VOption>
                                                <VOption v-for="contractor in contractorsList" :key="contractor.user.id"
                                                    :value="contractor.id">
                                                    {{ contractor.user.first_name }}
                                                </VOption>
                                            </select>
                                            <!-- <ErrorMessage class="help is-danger" name="user_id" /> -->
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel class="optinal">{{ viewWrapper.pageTitle }} Note</VLabel>
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

.custom-loader {
    position: absolute;
    right: 0;
    top: 0;
    width: 16px;
    height: 16px;
}

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
