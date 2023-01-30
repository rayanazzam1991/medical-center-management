<script setup lang="ts">
import { usePanels } from '/@src/stores/panels'
import { useHead } from '@vueuse/head'
import { defaultSpeciality } from '/@src/models/Others/Speciality/speciality'
import { getSpeciality } from '/@src/services/Others/Speciality/specialityService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { SpecialityConsts } from '/@src/models/Others/Speciality/speciality'
import { useSpeciality } from '/@src/stores/Others/Speciality/specialityStore'
import sleep from '/@src/utils/sleep'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('speciality.details.title'))
const head = useHead({
    title: t('speciality.details.title'),
})


const specialityStore = useSpeciality()
const specialityId = ref(0)
// @ts-ignore
specialityId.value = route.params?.id as number ?? 0
const currentSpeciality = ref(defaultSpeciality)
const getCurrentSpeciality = async () => {
    const { speciality } = await getSpeciality(specialityId.value)

    if (speciality != undefined)
        currentSpeciality.value = speciality
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentSpeciality.value.name

}
onMounted(async () => {
    await getCurrentSpeciality()
})

const toEdit = () => {
    router.push({ path: `/speciality/${specialityId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/speciality'" @onSubmit="toEdit"
        :isLoading="specialityStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('speciality.details.name')}}:</h4>
                            <span>{{ currentSpeciality.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('speciality.details.status')}}:</h4>
                            <span>
                                <VTag
                                    :color="currentSpeciality.status === SpecialityConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ SpecialityConsts.showStatusName(currentSpeciality.status) }}</VTag>
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
