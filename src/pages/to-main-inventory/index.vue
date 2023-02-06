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
import { Contractor, ContractorSearchFilter, defaultContractorSearchFilter } from '/@src/models/Contractor/contractor';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { defaultCreateInventoryItem, InventoryItem } from '/@src/models/Warehouse/InventoryItem/inventoryItem';
import { useInventoryItemForm, useToInventoryItemForm } from '/@src/stores/Warehouse/InventoryItem/inventoryItemFormSteps';
import { fromMainInventory, toMainInventory } from '/@src/services/Warehouse/InventoryItem/inventoryItemService';
import { Inventory, InventorySearchFilter } from '/@src/models/Warehouse/Inventory/inventory';
import { getInventoriesList } from '/@src/services/Warehouse/Inventory/inventoryService';

const itemStore = useItem()
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('inventoryItem.toMainInventoryForm.title'))
const head = useHead({
    title: t('inventoryItem.toMainInventoryForm.title'),
})
const inventoryItemForm = useToInventoryItemForm()
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
const pageTitle = t('inventoryItem.toMainInventoryForm.title')
const currentsubInventoryMovement = ref(defaultCreateInventoryItem)
const selectedItem = ref()
const allItemsList = ref<Item[]>([])
const mainInventory = ref()
const subInventoriesList = ref<Inventory[]>([])
const inventoriesList = ref<Inventory[]>([])
const inventoryItemsList = ref<InventoryItem[]>([])
const selectrdInventoryId = ref()
const Quantity = ref()
onMounted(async () => {
    let subInventorySearchFilter = {} as InventorySearchFilter
    subInventorySearchFilter.status = BaseConsts.ACTIVE
    subInventorySearchFilter.per_page = 500
    const { inventories } = await getInventoriesList(subInventorySearchFilter)
    inventoriesList.value = inventories

    const MainInventory = inventoriesList.value.find((inventory) => inventory.contractor_id == null)
    mainInventory.value = MainInventory

    const SubInventory = inventoriesList.value.filter((inventory) => inventory.contractor_id != null)
    subInventoriesList.value = SubInventory





})

watch(selectrdInventoryId, (value) => {
    inventoryItemsList.value = inventoriesList.value.find((inventory) => inventory.id == value)?.inventory_items ?? []
})
watch(selectedItem, (value) => {

    const Item = inventoryItemsList.value.find((quantity) => quantity.item_id == selectedItem.value)
    Quantity.value = Item?.quantity
})

const getItemBySubCategroy = async () => {
    let itemSearchFilter = {} as ItemSearchFilter
    itemSearchFilter.status = BaseConsts.ACTIVE
    itemSearchFilter.is_for_sale = ItemConsts.IS_FORE_SALE
    itemSearchFilter.per_page = 500
    const { items } = await getItemsList(itemSearchFilter)
    allItemsList.value = items

}

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
    subInventoryMovementForm.quantity = Quantity.value
    subInventoryMovementForm.inventoryItemHistories.note = subInventoryMovementForm.inventoryItemHistories.note
    subInventoryMovementForm.inventoryItemHistories.to_inventory = mainInventory.value.id
    subInventoryMovementForm.inventoryItemHistories.from_inventory = selectrdInventoryId.value
    const { inventoryItem, success, message } = await toMainInventory(subInventoryMovementForm)
    if (success) {
        let formData = new FormData();
        notif.dismissAll();
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
                                <VField id="inventory_id">
                                    <VLabel class="required">{{ t('inventoryItem.toMainInventoryForm.from_inventory') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-model="selectrdInventoryId">
                                            <VOption>{{ t('inventoryItem.toMainInventoryForm.select_inventory') }}
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
                            <div class="column is-6">
                                <label
                                    class="lable required">{{ t('inventoryItem.toMainInventoryForm.to_inventory') }}</label>
                                <input class="input" disabled type="text" :placeholder="mainInventory?.name" />
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="item_id">
                                    <VLabel class="required" style="position:relative">
                                        {{ t('inventoryItem.toMainInventoryForm.item') }}
                                        <div v-if="itemStore.loading"
                                            class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <VSelect :disabled="!selectrdInventoryId" v-if="currentsubInventoryMovement"
                                            v-model="selectedItem">
                                            <VOption>{{ t('inventoryItem.toMainInventoryForm.select_item') }}</VOption>
                                            <VOption v-for="inventoryItem in inventoryItemsList" :key="inventoryItem.id"
                                                :value="inventoryItem.item_id">
                                                {{ inventoryItem.item }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="item_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="quantity">
                                    <VLabel class="required"> {{ t('inventoryItem.toMainInventoryForm.quantity') }}
                                    </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="Quantity" type="number" placeholder=""
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
                                    <VLabel class="optinal">{{ t('inventoryItem.toMainInventoryForm.note') }}</VLabel>
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
