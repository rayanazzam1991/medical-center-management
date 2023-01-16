<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultService } from '/@src/models/Others/Service/service'
import { getService } from '/@src/services/Others/Service/serviceService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { ServiceConsts } from '/@src/models/Others/Service/service'
import { useService } from '/@src/stores/Others/Service/serviceStore'
import sleep from '/@src/utils/sleep'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('service.details.title'))
const head = useHead({
    title: t('service.details.title'),
})


const serviceStore = useService()
const serviceId = ref(0)
// @ts-ignore
serviceId.value = route.params?.id as number ?? 0
const currentService = ref(defaultService)
const getCurrentService = async () => {
    const { service } = await getService(serviceId.value)
    await sleep(500)
    if (service != undefined)
        currentService.value = service
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentService.value.name

}
onMounted(async () => {
    await getCurrentService()
})

const toEdit = () => {
    router.push({ path: `/service/${serviceId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/service'" @onSubmit="toEdit"
        :isLoading="serviceStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('service.details.name')}}:</h4>
                            <span>{{ currentService.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('service.details.description')}}:</h4>
                            <span v-if="currentService.description"> {{ currentService.description }} </span>
                            <span v-else> Null </span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('service.details.estimated')}}:</h4>
                            <span>{{ currentService.duration_minutes }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('service.details.price')}} ({{ ServiceConsts.PRICE_DOLLAR }}):</h4>
                            <span>{{ currentService.service_price }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('service.details.status')}}:</h4>
                            <span>
                                <VTag :color="currentService.status === ServiceConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ ServiceConsts.showStatusName(currentService.status) }}</VTag>
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
