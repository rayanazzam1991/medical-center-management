<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { changeUserStatus, getUser } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { defaultChangeStatusUser, defaultUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"

const notif = useNotyf()
const route = useRoute()
const router = useRouter()
const changeStatus = ref()
const changeStatusPopup = ref(false)
const pageTitle = ref('')
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('User')
const head = useHead({
    title: 'User',
})
const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}
const changestatusUser = async () => {
    const userData = currentUser.value
    var userForm = currentChangeStatusUser.value
    userForm.id = userData.id
    userForm.user_status_id = userData.status?.id
    console.log(userForm)
    await changeUserStatus(userForm)
    getCurrentUser()
    // @ts-ignore
    notif.dismissAll()
    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} ${userData.first_name} was edited successfully`)
    router.push({ path: `/user/${userData.id}` })
    changeStatusPopup.value = false
}

const userId = ref(0)
// @ts-ignore
userId.value = route.params?.id as number ?? 0
const currentUser = ref(defaultUser)
const getCurrentUser = async () => {
    const user = await getUser(userId.value)
    if (user != undefined)
        currentUser.value = user
    pageTitle.value = viewWrapper.pageTitle + ':' + currentUser.value.first_name + ' ' + currentUser.value.last_name

}
const statuses2 = ref<UserStatus[]>([])
onMounted(async () => {
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statuses2.value = userstatuses
})
onMounted(async () => {
    await getCurrentUser()
})

const toEdit = () => {
    router.push({ path: `/user/${userId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/user'" @onSubmit="toEdit" />

    <div class="buttons">
        <VButton @click.prevent="onOpen" color="warning"> Change User Status
        </VButton>
    </div>
    <section class="form-layout">
        <div class="form-body">
            <!--Fieldset-->
            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} first name:</h4>
                        <span>{{ currentUser.first_name }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} last name:</h4>
                        <span>{{ currentUser.last_name }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} gender:</h4>
                        <span>{{ currentUser.gender }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} birth date:</h4>
                        <span>{{ currentUser.birth_date }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} phone number:</h4>
                        <span>{{ currentUser.phone_number }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} address:</h4>
                        <span>{{ currentUser.address }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} city:</h4>
                        <span>{{ currentUser.city?.name }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} room:</h4>
                        <span>{{ currentUser.room?.number }}</span>
                    </div>
                    <div class="column is-12">
                        <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} status:</h4>
                        <span>{{ currentUser.status?.name }}</span>
                    </div>
                </div>
            </div>
            <!--Fieldset-->
        </div>
    </section>
    <VModal title="Change User Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VSelect v-if="currentUser.status" v-model="currentUser.status.id">
                                        <VOption value="">User Status</VOption>
                                        <VOption v-for="status in statuses2" :key="status.id" :value="status.id">{{
                                                status.name
                                        }}
                                        </VOption>
                                    </VSelect>
                                    <ErrorMessage name="user_status_id" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusUser(changeStatus)">Confirm</VButton>
        </template>
    </VModal>

</template>

<style scoped lang="scss">
@import '/@src/scss/styles/detailsPage.scss';

</style>
