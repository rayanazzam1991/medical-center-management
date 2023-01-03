<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { addQuantity, defaultAddQuantityItem, ItemHsitoryConsts } from '/@src/models/Warehouse/ItemHistory/itemHistory';
import { addQuantityService } from '/@src/services/Warehouse/ItemHistory/itemHistoryService';
import { useItemHistoryForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { addQuantityvalidationSchema } from '/@src/rules/Warehouse/ItemHistory/addQuantityValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { defaultItemSearchFilter, Item } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add Quantity')
const head = useHead({
    title: 'Add Quantity',
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
                path: `/item`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Add Quantity'
const phoneCheck = ref<string>('false')
const currentaddQuantity = ref(defaultAddQuantityItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const getCurrentAddQuantity = async () => {
    currentaddQuantity.value = itemHistoryForm.data


}
const mainCategoriesList = ref<Category[]>([])
onMounted(async () => {
    const allCategories = await getFilterCategoriesList(defaultCategorySearchFilter)
    allCategoriesList.value = allCategories.categories
    mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
    await getCurrentAddQuantity();
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
    getCurrentAddQuantity()
})

const validationSchema = addQuantityvalidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        item_id: undefined,
        item_quantity: "",
        add_item_cost: "",
        note: "",
        invoice_number: "",
        status: 1,
    },
})

const onSubmitAdd = handleSubmit(async (values) => {

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
                                    <VLabel class="required">Level 1</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentaddQuantity"
                                                v-model="selectedCategoryId">
                                                <VOption :value="0">Level 1</VOption>
                                                <VOption v-for="category in mainCategoriesList" :key="category.id"
                                                    :value="category.id">{{ category.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel class="required">Level 2</VLabel>
                                    <VControl>
                                        <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                                            v-if="currentaddQuantity" v-model="selectedSubCategoryId">
                                            <VOption>Level 2</VOption>
                                            <VOption v-for="subCategory in subcategoeisList" :key="subCategory.id"
                                                :value="subCategory.id">
                                                {{ subCategory.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>

                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField>
                                    <VLabel class="required">Item</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select :disabled="itemsList.length <= 0" v-if="currentaddQuantity"
                                                v-model="currentaddQuantity.item_id">
                                                <VOption :value="0">Item</VOption>
                                                <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                                    {{ item.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="item_quantity">
                                    <VLabel class="required">Item Quantity</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.item_quantity" type="text" placeholder=""
                                            autocomplete="given-item_quantity" />
                                        <ErrorMessage class="help is-danger" name="item_quantity" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="item_cost">
                                    <VLabel class="required">Item Cost</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.add_item_cost" type="text" placeholder=""
                                            autocomplete="given-item_cost" />
                                        <ErrorMessage class="help is-danger" name="item_cost" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="note">
                                    <VLabel class="required">Item Note</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.note" type="text" placeholder=""
                                            autocomplete="given-note" />
                                        <ErrorMessage class="help is-danger" name="note" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="invoice_number">
                                    <VLabel class="required">Item Invoice Number</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.invoice_number" type="text" placeholder=""
                                            autocomplete="given-invoice_number" />
                                        <ErrorMessage class="help is-danger" name="invoice_number" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.ACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(1)" name="status"
                                            color="success" />
                                        <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.INACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(0)" name="status"
                                            color="warning" />
                                        <ErrorMessage name="status" class="help is-danger" />
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
    max-width: 40%;
}
</style>
