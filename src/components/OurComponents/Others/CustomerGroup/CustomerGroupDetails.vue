<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { defaultCustomerGroup } from "/@src/models/Others/CustomerGroup/customerGroup"
import { getCustomerGroup } from "/@src/services/Others/CustomerGroup/customerGroupService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { CustomerGroupConsts } from "/@src/models/Others/CustomerGroup/customerGroup"
import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import sleep from "/@src/utils/sleep"
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Group')
const head = useHead({
    title: 'Customer Group',
})


const customerGroupStore = useCustomerGroup()
const customerGroupId = ref(0)
// @ts-ignore
customerGroupId.value = route.params?.id as number ?? 0
const currentCustomerGroup = ref(defaultCustomerGroup)
const getCurrentCustomerGroup = async () => {
    const customerGroup = await getCustomerGroup(customerGroupId.value)
    sleep(500)
    if (customerGroup != undefined)
        currentCustomerGroup.value = customerGroup
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentCustomerGroup.value.name

}
onMounted(async () => {
    await getCurrentCustomerGroup()
})

const toEdit = () => {
    router.push({ path: `/customer-group/${customerGroupId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/customer-group'" @onSubmit="toEdit"
        :isLoading="customerGroupStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentCustomerGroup.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
                            <span>
                                <VTag
                                    :color="currentCustomerGroup.status === CustomerGroupConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ CustomerGroupConsts.showStatusName(currentCustomerGroup.status) }}</VTag>
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
