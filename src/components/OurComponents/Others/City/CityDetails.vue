<script setup lang="ts">
import { usePanels } from '/@src/stores/panels'
import { useHead } from '@vueuse/head'
import { defaultCity } from '/@src/models/Others/City/city'
import { getCity } from '/@src/services/Others/City/cityService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { CityConsts } from '/@src/models/Others/City/city'
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
const head = useHead({
    title: 'City',
})



const cityId = ref(0)
// @ts-ignore
cityId.value = route.params?.id as number ?? 0
const currentCity = ref(defaultCity)
const getCurrentCity = async () => {
    const city = await getCity(cityId.value)
    if (city != undefined)
        currentCity.value = city
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentCity.value.name

}
onMounted(async () => {
    await getCurrentCity()
})

const toEdit = () => {
    router.push({ path: `/city/${cityId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/city'" @onSubmit="toEdit" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentCity.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
                            <span>
                                <VTag :color="currentCity.status === CityConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ CityConsts.showStatusName(currentCity.status) }}</VTag>
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
