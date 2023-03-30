<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "item_show"
        ]
    }
}
</route>
  
<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { Item, defaultItem, defaultChangeItemStatus } from "/@src/models/Warehouse/Item/item"
import { changeItemStatus, getItem } from "/@src/services/Warehouse/Item/itemService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useItem } from "/@src/stores/Warehouse/Item/itemStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { ItemConsts } from '/@src/models/Warehouse/Item/item'
import { defaultChangeItemHistoryStatus, defaultInventoryItemHistory, defaultInventoryItemHistorySearchFilter, inventoryItemHistory, InventoryItemHistoryConsts, InventoryItemHistorySearchFilter } from "../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { changeItemHistoryStatus, getFromName, getInventoryMovementsList, getItemHistory, getToName } from "../../../services/Warehouse/ItemHistory/inventoryItemHistoryService"
import { defaultPagination } from "/@src/utils/response"
import { useinventoryItemHistory } from "/@src/stores/Warehouse/ItemHistory/inventoryItemHistoryStore"
import { Notyf } from "notyf"
import { useI18n } from "vue-i18n"
import IconButton from "/@src/components/OurComponents/Warehouse/InventoryItemHistory/IconButton.vue"
import { BaseConsts } from "/@src/utils/consts/base"
import { addParenthesisToString, stringTrim } from "/@src/composable/helpers/stringHelpers"
import { Currency, defaultCurrency } from "/@src/models/Accounting/Currency/currency"
import { getCurrenciesFromStorage } from "/@src/services/Accounting/Currency/currencyService"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { checkPermission } from "/@src/composable/checkPermission"
import PrintDropDown from "/@src/components/OurComponents/PrintComponents/PrintDropDown.vue"
import usePrint from "/@src/composable/usePrint"


const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const currentItem = ref<Item>(defaultItem)
const currentItemModel = ref<Item>(defaultItem)
const itemId = ref(0)
const changeStatusPopup = ref(false)
const currentChangeStatusItem = ref(defaultChangeItemStatus)
const keyIncrement = ref(1)
const loading = ref(false)
const itemHistoriesList = ref<inventoryItemHistory[]>([])
const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
const paginationVar = ref(defaultPagination)
const default_per_page = ref(1)
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency
const selectedMovementForPrint = ref(defaultInventoryItemHistory)


const { t } = useI18n()
const notif = useNotyf() as Notyf
viewWrapper.setPageTitle(t('item.details.title'))
useHead({
    title: t('item.details.title'),
})
const itemStore = useItem()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'History' | 'Inventories' | 'Suppliers'
    }>(),
    {
        activeTab: 'Details',
    }
)
const tab = ref(props.activeTab)
// @ts-ignore
itemId.value = route.params?.id as number ?? 0

const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}

onMounted(async () => {
    loading.value = true
    await getCurrentItem()
    loading.value = false

    searchFilter.value = {} as InventoryItemHistorySearchFilter
    searchFilter.value.status = BaseConsts.ACTIVE
    searchFilter.value.item_id = itemId.value
    const { itemHistories, pagination } = await getInventoryMovementsList(searchFilter.value)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

})



const getCurrentItem = async () => {
    const { item } = await getItem(itemId.value)
    currentItem.value = item

}
const changestatusItem = async () => {
    const itemData = currentItemModel.value
    var itemForm = currentChangeStatusItem.value
    itemForm.id = currentItem.value.id
    itemForm.status = itemData.status
    const { message, success } = await changeItemStatus(itemForm)
    if (success) {
        getCurrentItem()
        notif.dismissAll()
        await sleep(200);
        changeStatusPopup.value = false

    } else {
        notif.error(message)
    }
}
const onClickEditMainInfo = () => {
    router.push({
        path: `/item/${itemId.value}/edit`
    })
}


const permissionCheck = async () => {
    if (tab.value == 'History' && !checkPermission(Permissions.INVENTORY_ITEM_HISTORY_LIST)) {
        notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
    }
    if (tab.value == 'Inventories' && !checkPermission(Permissions.INVENTORY_ITEM_LIST)) {
        notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
    }
    if (tab.value == 'Details' && !checkPermission(Permissions.CUSTOMER_SHOW)) {
        notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
    }
    if (tab.value == 'Suppliers' && !checkPermission(Permissions.INVENTORY_ITEM_HISTORY_LIST)) {
        notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
    }

}


</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">
            <div class="loader-size profile-header has-text-centered">
                <h3 class="title is-4 is-narrow is-thin">{{ currentItem.name }}</h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>{{ t('item.details.status') }} :
                            <span
                                :class="currentItem.status === ItemConsts.INACTIVE ? 'has-text-danger' : 'has-text-success'">
                                {{ ItemConsts.showStatusName(currentItem.status) }} </span>
                        </span>
                    </div>&nbsp;|
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil "></i>
                        <span>{{ t('item.table.columns.for_sale') }} :
                            <span
                                :class="currentItem.is_for_sale === ItemConsts.IS_FORE_SALE ? 'has-text-success' : 'has-text-warning'">
                                {{ ItemConsts.showForSale(currentItem.is_for_sale) }} </span>
                        </span>
                    </div>
                </div>
            </div>
        </VLoader>
        <div class="project-details">
            <div class="tabs-wrapper is-quad-slider">
                <div :hidden="loading" class="tabs-inner">
                    <div class="tabs tabs-width">
                        <ul>
                            <li @click="permissionCheck()" :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'" @click="tab = 'Details'"><span>{{
                                    t('item.details.tabs.details') }}</span></a>
                            </li>
                            <li @click="permissionCheck()" :class="[tab === 'History' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'History'" @click="tab = 'History'">
                                    <span>{{ t('item.details.tabs.item_history') }}</span></a>
                            </li>
                            <li @click="permissionCheck()" :class="[tab === 'Inventories' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Inventories'" @click="tab = 'Inventories'">
                                    <span>{{ t('item.details.tabs.inventories') }}</span></a>
                            </li>
                            <li @click="permissionCheck()" :class="[tab === 'Suppliers' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Suppliers'" @click="tab = 'Suppliers'">
                                    <span>{{ t('item.details.tabs.suppliers') }}</span></a>
                            </li>
                            <li class="tab-naver"></li>

                        </ul>
                    </div>
                </div>
                <div v-if="tab === 'Details'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>{{ t('item.details.main_details') }}</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton v-permission="Permissions.ITEM_EDIT" @click.prevent="onOpen" color="dark">
                                            {{ t('item.table.modal_title.item') }}
                                        </VButton>
                                        <VIconButton v-permission="Permissions.ITEM_EDIT" size="small" icon="feather:edit-3"
                                            tabindex="0" @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-files">
                                    <div class="columns is-multiline">
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.leve_1') }}</span>
                                                    <span>
                                                        {{ currentItem.category.parent?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.leve_2') }}</span>
                                                    <span>
                                                        {{ currentItem.category.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.price') }} {{
                                                        addParenthesisToString(mainCurrency.name) }}</span>
                                                    <span>
                                                        {{ currentItem.price }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.cost') }}{{
                                                        addParenthesisToString(mainCurrency.name) }}</span>
                                                    <span>
                                                        {{ currentItem.cost }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.description') }}</span>
                                                    <span>
                                                        {{ currentItem.description ?? t('place_holder.none') }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="tab === 'History'" class="tab-content is-active mb-8">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <InventoryMovementsTable is-for-item :item-id="itemId" />
                            </div>
                        </div>
                    </div>

                </div>
                <div v-if="tab === 'Inventories'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <InventoryByItemTable :item-id="itemId" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="tab === 'Suppliers'" class="tab-content is-active mb-8">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <InventoryMovementsTable is-for-item :item-id="itemId" suppliers-only />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
    <VModal :title="t('item.table.modal_title.item')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="status">
                                <VLabel class="required">{{ t('item.details.status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="currentItemModel.status" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="currentItemModel.status" :value="ItemConsts.ACTIVE"
                                        :label="ItemConsts.showStatusName(1)" name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusItem()">{{ t('modal.buttons.confirm') }}</VButton>
        </template>
    </VModal>
    <InventoryMovementPrint :key="keyIncrement" :inventory-item-movement="selectedMovementForPrint" />
</template>

<style lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
    min-width: 600px;
    min-height: 40px;

    .is-active {
        min-height: 40px;

    }
}

.tabs-wrapper.is-quad-slider .tabs li a,
.tabs-wrapper-alt.is-quad-slider .tabs li a {
    height: 40px;

}

.tabs li {
    min-height: 38px !important;

}


.full-width {
    width: 100%;
    margin-right: 12px;
}

.loader-size {
    min-height: 100px;
}

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 150px;
    background-color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    word-break: keep-all;
    white-space: normal;


    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;


}

.is-dark {
    .tooltip .tooltiptext {
        background-color: rgb(43, 41, 41);
    }
}
</style>
