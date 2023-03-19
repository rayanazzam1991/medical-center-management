<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { getSupplier } from "/@src/services/Others/Supplier/supplierService"
import { defaultSupplier } from "/@src/models/Others/Supplier/supplier"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { SupplierConsts } from "/@src/models/Others/Supplier/supplier"
import { useSupplier } from "/@src/stores/Others/Supplier/supplierStore"
import { useI18n } from "vue-i18n"
import { Permissions } from "/@src/utils/consts/rolesPermissions"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('supplier.details.title'))
const head = useHead({
    title: t('supplier.details.title'),
})


const supplierStore = useSupplier()
const supplierId = ref(0)

supplierId.value = route.params?.id as number ?? 0
const currentSupplier = ref(defaultSupplier)


const getCurrentSupplier = async () => {
    const { supplier } = await getSupplier(supplierId.value)

    if (supplier != undefined)
        currentSupplier.value = supplier
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentSupplier.value.name

}
onMounted(async () => {
    await getCurrentSupplier()
})

const toEdit = () => {
    router.push({ path: `/supplier/${supplierId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/supplier'" @onSubmit="toEdit"
        :permission="Permissions.SPECIALITY_EDIT" :isLoading="supplierStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.name') }}:</h4>
                            <span>{{ currentSupplier.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.phone_number') }}:</h4>
                            <span>{{ currentSupplier.phone_number }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.address') }}:</h4>
                            <span>{{ currentSupplier.address }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.city') }}:</h4>
                            <span>{{ currentSupplier.city?.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.notes') }}:</h4>
                            <span>{{ currentSupplier.notes }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.created_at') }}:</h4>
                            <span>{{ currentSupplier.created_at }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.status') }}:</h4>
                            <span>
                                <VTag
                                    :color="currentSupplier.status === SupplierConsts.INACTIVE ? 'danger' : currentSupplier.status === SupplierConsts.ACTIVE ? 'success' : 'info'">
                                    {{ SupplierConsts.getSupplierStatusName(currentSupplier.status) }}</VTag>
                            </span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('supplier.details.created_by') }}:</h4>
                            <span>{{ currentSupplier.created_by?.first_name }}</span>
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
