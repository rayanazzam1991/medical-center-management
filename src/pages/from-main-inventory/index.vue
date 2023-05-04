<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "inventory_item_create"
        ]
    }
}
</route>
    
<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { subInventoryMovementSchema } from '/@src/rules/Warehouse/InventoryItem/subInventoryMovementValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, CategorySearchFilter, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { Item, ItemConsts, ItemSearchFilter } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { defaultCreateInventoryItem } from '/@src/models/Warehouse/InventoryItem/inventoryItem';
import { useInventoryItemForm } from '/@src/stores/Warehouse/InventoryItem/inventoryItemFormSteps';
import { fromMainInventory } from '/@src/services/Warehouse/InventoryItem/inventoryItemService';
import { Inventory, InventorySearchFilter } from '/@src/models/Warehouse/Inventory/inventory';
import { getInventoriesList } from '/@src/services/Warehouse/Inventory/inventoryService';

const itemStore = useItem()
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('inventoryItem.fromMainInventoryForm.title'))
const head = useHead({
    title: t('inventoryItem.fromMainInventoryForm.title'),
})
const inventoryItemForm = useInventoryItemForm()
inventoryItemForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        await onSubmitAdd()
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('inventoryItem.fromMainInventoryForm.title')
const currentsubInventoryMovement = ref(defaultCreateInventoryItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const selectedItem = ref()
const allItemsList = ref<Item[]>([])
const itemsList = ref<Item[]>([])
const mainInventory = ref()
const subInventoriesList = ref<Inventory[]>([])
const inventoriesList = ref<Inventory[]>([])
const mainCategoriesList = ref<Category[]>([])
const selectrdInventoryId = ref()
onMounted(async () => {
    let subInventorySearchFilter = {} as InventorySearchFilter
    subInventorySearchFilter.status = BaseConsts.ACTIVE
    subInventorySearchFilter.per_page = 500
    const { inventories } = await getInventoriesList(subInventorySearchFilter)
    inventoriesList.value = inventories

    const MainInventory = inventoriesList.value.find((inventory) => inventory.employee_id == null)
    mainInventory.value = MainInventory

    const SubInventory = inventoriesList.value.filter((inventory) => inventory.employee_id != null)
    subInventoriesList.value = SubInventory

    let categorySearchFilter = {} as CategorySearchFilter
    categorySearchFilter.status = BaseConsts.ACTIVE
    categorySearchFilter.per_page = 500
    const allCategories = await getFilterCategoriesList(categorySearchFilter)
    allCategoriesList.value = allCategories.categories
    mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)


})
const getSubCategoryByCategroy = () => {
    let categoriesFilter = {} as CategorySearchFilter
    categoriesFilter.parent_id = selectedCategoryId.value
    const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
    subcategoeisList.value = SubCategory
    itemsList.value = []
    selectedSubCategoryId.value = undefined
    selectedItem.value = undefined
    currentsubInventoryMovement.value.item_id = 0
}
const getItemBySubCategroy = async () => {
    let itemSearchFilter = {} as ItemSearchFilter
    itemSearchFilter.status = BaseConsts.ACTIVE
    itemSearchFilter.is_for_sale = ItemConsts.IS_FORE_SALE
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
})

const validationSchema = subInventoryMovementSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        inventory_id: undefined,
        item_id: undefined,
        quantity: "",
        note: "",
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    let subInventoryMovementForm = currentsubInventoryMovement.value
    subInventoryMovementForm.item_id = selectedItem.value
    subInventoryMovementForm.inventory_id = selectrdInventoryId.value
    subInventoryMovementForm.quantity = subInventoryMovementForm.quantity
    subInventoryMovementForm.inventoryItemHistories.note = subInventoryMovementForm.inventoryItemHistories.note
    subInventoryMovementForm.inventoryItemHistories.from_inventory = mainInventory.value.id
    subInventoryMovementForm.inventoryItemHistories.to_inventory = selectrdInventoryId.value
    const { inventoryItem, success, message } = await fromMainInventory(subInventoryMovementForm)
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
                                <label class="lable required">{{ t('inventoryItem.fromMainInventoryForm.from_inventory')
                                }}</label>
                                <input class="input" disabled type="text" :placeholder="mainInventory?.name" />
                            </div>
                            <div class="column is-6">
                                <VField id="inventory_id">
                                    <VLabel class="required">{{ t('inventoryItem.fromMainInventoryForm.to_inventory') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-model="selectrdInventoryId">
                                            <VOption>{{ t('inventoryItem.fromMainInventoryForm.select_inventory') }}
                                            </VOption>
                                            <VOption v-for="subInventory in subInventoriesList" :key="subInventory.id"
                                                :value="subInventory.id">
                                                {{ subInventory.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="inventory_id" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <div class="columns is-multiline">

                            <div class="column is-6">
                                <VField>
                                    <VLabel class="required">{{ t('inventoryItem.fromMainInventoryForm.level_1') }}</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentsubInventoryMovement"
                                                v-model="selectedCategoryId">
                                                <VOption :value="0">
                                                    {{ t('inventoryItem.fromMainInventoryForm.select_level_1') }}</VOption>
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
                                    <VLabel class="required">{{ t('inventoryItem.fromMainInventoryForm.level_2') }}</VLabel>
                                    <VControl>
                                        <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                                            v-if="currentsubInventoryMovement" v-model="selectedSubCategoryId">
                                            <VOption>{{ t('inventoryItem.fromMainInventoryForm.select_level_1') }}</VOption>
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
                                        {{ t('inventoryItem.fromMainInventoryForm.item') }}
                                        <div v-if="itemStore.loading"
                                            class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <VSelect :disabled="itemsList.length <= 0" v-if="currentsubInventoryMovement"
                                            v-model="selectedItem">
                                            <VOption>{{ t('inventoryItem.fromMainInventoryForm.select_item') }}</VOption>
                                            <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                                {{ item.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="item_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="quantity">
                                    <VLabel class="required"> {{ t('inventoryItem.fromMainInventoryForm.quantity') }}
                                    </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentsubInventoryMovement.quantity" type="number" placeholder=""
                                            autocomplete="given-quantity" />
                                        <ErrorMessage class="help is-danger" name="quantity" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel class="optinal">{{ t('inventoryItem.fromMainInventoryForm.note') }}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentsubInventoryMovement.inventoryItemHistories.note" />
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
}</style>
