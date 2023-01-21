<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { getUserStatus } from "/@src/services/Others/UserStatus/userstatusService"
import { defaultUserStatus } from "/@src/models/Others/UserStatus/userStatus"
import { usePanels } from "/@src/stores/panels"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useUserStatus } from "/@src/stores/Others/UserStatus/userStatusStore"
import sleep from "/@src/utils/sleep"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const panels = usePanels()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('user_status.details.title'))
const head = useHead({
    title: t('user_status.details.title'),
})

const userStatusStore = useUserStatus()
const userstatusId = ref(0)
// @ts-ignore
userstatusId.value = route.params?.id as number ?? 0
const currentUserStatus = ref(defaultUserStatus)
const getCurrentUserStatus = async () => {
    const { userStatus } = await getUserStatus(userstatusId.value)
    await sleep(500)
    if (userStatus != undefined)
        currentUserStatus.value = userStatus
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentUserStatus.value.name

}
onMounted(async () => {
    await getCurrentUserStatus()
})

const toEdit = () => {
    router.push({ path: `/userstatus/${userstatusId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/userstatus'" @onSubmit="toEdit"
        :isLoading="userStatusStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{t('user_status.details.name')}}:</h4>
                            <span>{{ currentUserStatus.name }}</span>
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
