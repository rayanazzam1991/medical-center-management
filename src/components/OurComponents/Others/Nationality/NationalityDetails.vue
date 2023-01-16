<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { defaultNationality } from "/@src/models/Others/Nationality/nationality"
import { getNationality } from "/@src/services/Others/Nationality/nationalityService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { NationalityConsts } from "/@src/models/Others/Nationality/nationality"
import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore"
import sleep from "/@src/utils/sleep"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('nationality.details.title'))
const head = useHead({
    title: t('nationality.details.title'),
})
const nationalityStore = useNationality()
const nationalityId = ref(0)
// @ts-ignore
nationalityId.value = route.params?.id as number ?? 0
const currentNationality = ref(defaultNationality)
const getCurrentNationality = async () => {
    const { nationality } = await getNationality(nationalityId.value)
    await sleep(500)
    if (nationality != undefined)
        currentNationality.value = nationality
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentNationality.value.name

}
onMounted(async () => {
    await getCurrentNationality()
})

const toEdit = () => {
    router.push({ path: `/nationality/${nationalityId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/nationality'" @onSubmit="toEdit"
        :isLoading="nationalityStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} {{t('nationality.details.name')}}:</h4>
                            <span>{{ currentNationality.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} {{t('nationality.details.status')}}:</h4>
                            <span>
                                <VTag
                                    :color="currentNationality.status === NationalityConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ NationalityConsts.showStatusName(currentNationality.status) }}</VTag>
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
