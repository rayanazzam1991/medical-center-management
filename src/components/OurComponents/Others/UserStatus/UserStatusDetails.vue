<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { getUserStatus } from "/@src/services/Others/UserStatus/userstatusService"
import { defaultUserStatus } from "/@src/models/Others/UserStatus/userStatus"
import { usePanels } from "/@src/stores/panels"
import { useViewWrapper } from "/@src/stores/viewWrapper"


const panels = usePanels()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('UserStatus')
const head = useHead({
    title: 'UserStatus',
})


const userstatusId = ref(0)
// @ts-ignore
userstatusId.value = route.params?.id as number ?? 0
const currentUserStatus = ref(defaultUserStatus)
const getCurrentUserStatus = async () => {
    const { userStatus } = await getUserStatus(userstatusId.value)
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
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/userstatus'" @onSubmit="toEdit" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">UserStatus Name:</h4>
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
