<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultService } from '/@src/models/Others/Service/service'
import { getService } from '/@src/services/Others/Service/serviceService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { ServiceConsts } from '/@src/models/Others/Service/service'
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Service')
const head = useHead({
    title: 'Service',
})



const serviceId = ref(0)
// @ts-ignore
serviceId.value = route.params?.id as number ?? 0
const currentService = ref(defaultService)
const getCurrentService = async () => {
    const { service } = await getService(serviceId.value)
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
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/service'" @onSubmit="toEdit" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentService.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">Description:</h4>
                            <span v-if="currentService.description"> {{ currentService.description }} </span>
                            <span v-else> Null </span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">Estimated Duration:</h4>
                            <span>{{ currentService.duration_minutes }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">Price ({{ ServiceConsts.PRICE_DOLLAR }}):</h4>
                            <span>{{ currentService.service_price }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
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
