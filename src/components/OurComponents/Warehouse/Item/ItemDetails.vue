<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultItem } from '/@src/models/Warehouse/Item/item'
import { getItem } from '/@src/services/Warehouse/Item/itemService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { ItemConsts } from '/@src/models/Warehouse/Item/item'
import { useItem } from '/@src/stores/Warehouse/Item/itemStore'
import sleep from '/@src/utils/sleep'
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Item')
const head = useHead({
    title: 'Item',
})


const itemStore = useItem()
const itemId = ref(0)
// @ts-ignore
itemId.value = route.params?.id as number ?? 0
const currentItem = ref(defaultItem)
const getCurrentItem = async () => {
    const { item } = await getItem(itemId.value)
    await sleep(500)
    if (item != undefined)
        currentItem.value = item
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentItem.value.name

}
onMounted(async () => {
    await getCurrentItem()
})

const toEdit = () => {
    router.push({ path: `/item/${itemId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/item'" @onSubmit="toEdit"
        :isLoading="itemStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentItem.name }}</span>
                        </div>
                        <div class="columns is-24 ml-1 mt-2">
                            <div class="column is-12">
                                <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Category:</h4>
                                <span>{{ currentItem.category.parent?.name }}</span>

                            </div>
                            <div class="column is-12">
                                <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Sub Category:</h4>
                                <span>{{ currentItem.category.name }}</span>
                            </div>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Price :</h4>
                            <span>{{ currentItem.price }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Cost :</h4>
                            <span>{{ currentItem.cost }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Description:</h4>
                            <span v-if="currentItem.description"> {{ currentItem.description }} </span>
                            <span v-else> Null </span>
                        </div>
                        <div class="columns is-24 ml-1 mt-2">
                            <div class="column is-12 ">
                                <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Quantity :</h4>
                                <span>{{ currentItem.quantity }}</span>
                            </div>
                            <div class="column is-12">
                                <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Min Quantity :</h4>
                                <span>{{ currentItem.min_quantity }}</span>
                            </div>

                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
                            <span>
                                <VTag :color="currentItem.status === ItemConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ ItemConsts.showStatusName(currentItem.status) }}</VTag>
                            </span>
                        </div>
                    </div>
                </div>
                <!--Fieldset-->
            </div>
        </div>
    </section>


</template>

<style scoped lang="scss">
@import '/@src/scss/styles/detailsPage.scss';
</style>
