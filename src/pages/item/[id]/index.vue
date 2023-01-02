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



const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const currentItem = ref<Item>(defaultItem)
const itemId = ref(0)
const changeStatusPopup = ref(false)
const itemChangeStatus = ref<Item>(defaultItem)
const currentChangeStatusItem = ref(defaultChangeItemStatus)
const keyIncrement = ref(1)
const loading = ref(false)
const notif = useNotyf()

// @ts-ignore
itemId.value = route.params.id
viewWrapper.setPageTitle(`Item`)
useHead({
    title: 'Item',
})
const itemStore = useItem()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'History'
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

})
const getCurrentItem = async () => {
    const { item } = await getItem(itemId.value)
    currentItem.value = item

}
const changestatusItem = async () => {
    const itemData = currentItem.value
    var itemForm = currentChangeStatusItem.value
    itemForm.id = itemData.id
    itemForm.status = itemData.status
    console.log(itemForm)
    const { message, success } = await changeItemStatus(itemForm)
    getCurrentItem()
    console.log("daf")
    // @ts-ignore
    notif.dismissAll()
    await sleep(200);
    console.log(currentItem.value.id)
    changeStatusPopup.value = false
}

const onClickEditMainInfo = () => {
    router.push({
        path: `/item/${itemId.value}/edit`
    })
}

</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">
            <div class="profile-header has-text-centered">
                <h3 class="title is-4 is-narrow is-thin">{{ currentItem.name }}</h3>
                <div class="profile-stats">

                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>Status: <span>
                                <VTag :color="currentItem.status === ItemConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ ItemConsts.showStatusName(currentItem.status) }}</VTag>
                            </span></span>
                    </div>
                </div>
            </div>
        </VLoader>
        <div class="project-details">
            <div class="tabs-wrapper is-slider">
                <div :hidden="loading" class="tabs-inner">
                    <div class="tabs tabs-width">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>Details</span></a>
                            </li>
                            <li :class="[tab === 'History' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'History'"
                                    @click="tab = 'History'"><span>Item History </span></a>
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
                                        <h3>Main Details</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton @click.prevent="onOpen" color="dark"> Change Item Status
                                        </VButton>
                                        <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                            @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-files">
                                    <div class="columns is-multiline">
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Level 1</span>
                                                    <span>
                                                        {{ currentItem.category.parent?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Level 2</span>
                                                    <span>
                                                        {{ currentItem.category.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item
                                                        Quantity</span>
                                                    <span
                                                        :class="currentItem.min_quantity >= currentItem.quantity ? 'has-text-danger' : ''">
                                                        {{ currentItem.quantity }} Items left
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Min Quantity</span>
                                                    <span>
                                                        {{ currentItem.min_quantity }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Price</span>
                                                    <span>
                                                        {{ currentItem.price }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Cost</span>
                                                    <span>
                                                        {{ currentItem.cost }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Description</span>
                                                    <span>
                                                        {{ currentItem.description }}
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
            </div>
        </div>
    </div>
    <VModal title="Change User Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentItem.status" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="warning" />
                                    <VRadio v-model="currentItem.status" :value="ItemConsts.ACTIVE"
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
            <VButton color="primary" raised @click="changestatusItem()">Confirm</VButton>
        </template>
    </VModal>
</template>
  
<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
    min-width: 50px;
    min-height: 40px;

    .is-active {
        min-height: 40px;

    }
}

.tabs-wrapper .tabs li a,
.tabs-wrapper-alt .tabs li a {
    height: 40px;
}

.tabs li {
    min-height: 40px !important;

}
</style>
  