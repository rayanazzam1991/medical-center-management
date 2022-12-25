<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { getEmployee, getPersonalId } from "/@src/services/Employee/employeeService"
import { changeUserStatus } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { Employee, defaultEmployee, defaultEmployeePersonalId } from "/@src/models/Employee/employee"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useEmployee } from "/@src/stores/Employee/employeeStore"
import sleep from "/@src/utils/sleep"
const route = useRoute()
const router = useRouter()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const viewWrapper = useViewWrapper()
const currentEmployee = ref<Employee>(defaultEmployee)
const employeeId = ref(0)
const notif = useNotyf()
const employeePersonalId = ref(defaultEmployeePersonalId)

// @ts-ignore
employeeId.value = route.params.id
viewWrapper.setPageTitle(`Employee`)
useHead({
    title: 'Employee',
})
const employeeStore = useEmployee()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | '' | ''
    }>(),
    {
        activeTab: 'Details',
    }
)
const tab = ref(props.activeTab)
const statuses2 = ref<UserStatus[]>([])
onMounted(async () => {
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statuses2.value = userstatuses
})
onMounted(async () => {
    await getCurrentEmployee()
    await getCurrentPersonalId()

})
const getCurrentEmployee = async () => {
    const { employee } = await getEmployee(employeeId.value)
    currentEmployee.value = employee

}
const getCurrentPersonalId = async () => {
    var personal_id = await getPersonalId(employeeId.value)
    await sleep(500)
    if (personal_id.media.length != 0)
        employeePersonalId.value = personal_id.media[personal_id.media.length - 1]
}

const onClickEditMainInfo = () => {
    router.push({
        path: `/employee-edit/${employeeId.value}/`
    })
}
const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}
const changestatusUser = async () => {
    const userData = currentEmployee.value
    var userForm = currentChangeStatusUser.value
    userForm.id = userData.user.id
    userForm.user_status_id = userData.user.status?.id
    const { message, success } = await changeUserStatus(userForm)
    if (success) {

        getCurrentEmployee()
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);

        // @ts-ignore
        notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} was edited successfully`)
    } else {
        // @ts-ignore
        await sleep(200);

        notif.error(message)
    }
    // router.push({ path: `/employee/${userData.id}` })
    changeStatusPopup.value = false
}
</script>
<template>
    <div class="profile-wrapper">
        <div class="profile-header has-text-centered">
            <VLoader size="large" class="v-avatar" :active="employeeStore.loading">
                <VAvatar size="xl" :picture="employeePersonalId?.relative_path" squared />
            </VLoader>

            <h3 class="title is-4 is-narrow is-thin">{{ currentEmployee.user.first_name }}
                {{ currentEmployee.user.last_name }}</h3>
            <div class="profile-stats">
                <div class="profile-stat">
                    <i aria-hidden="true" class="lnil lnil-p"></i>
                    <span>{{ currentEmployee.user.city.name }}</span>
                </div>
                <div class="separator"></div>
                <div class="profile-stat">
                    <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                    <span>Status: <span
                            :class="currentEmployee.user.status.name == 'Pending' ? 'has-text-warning' : 'has-color-primary'">{{
                                    currentEmployee.user.status.name
                            }}</span></span>
                </div>
                <div class="separator"></div>
            </div>
        </div>
        <div class="project-details">
            <div class="tabs-wrapper is-triple-slider">
                <div v-if="tab === 'Details'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Main Details</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton @click.prevent="onOpen" color="dark"> Change User Status
                                        </VButton>
                                        <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                            @click="onClickEditMainInfo" />
                                    </div>

                                </div>

                                <div class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-user"></i>
                                        <h4>Employee Name</h4>
                                        <p>
                                            {{ currentEmployee.user.first_name }} {{ currentEmployee.user.last_name }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true"
                                            :class="currentEmployee.user.gender == 'Male' ? 'lnir lnir-male' : 'lnir lnir-female'"></i>
                                        <h4>Gender</h4>
                                        <p>
                                            {{ currentEmployee.user.gender }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-calendar"></i>
                                        <h4>Birth Date</h4>
                                        <p>
                                            {{ currentEmployee.user.birth_date }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-phone"></i>
                                        <h4>Phone Number</h4>
                                        <p> {{ currentEmployee.user.phone_number }}.
                                        </p>
                                    </div>
                                </div>

                                <div class="project-files">
                                    <h4>More Info</h4>
                                    <div class="columns is-multiline">
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Start Date</span>
                                                    <span>
                                                        {{ currentEmployee.starting_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>End Date</span>
                                                    <span>
                                                        {{ currentEmployee.end_date }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Basic Salary</span>
                                                    <span>
                                                        {{ currentEmployee.basic_salary }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Ntionality</span>
                                                    <span>
                                                        {{ currentEmployee.nationality.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Room Number</span>
                                                    <span>
                                                        {{ currentEmployee.user?.room?.number }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Address</span>
                                                    <span>
                                                        {{ currentEmployee?.user?.address }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
                                    <VSelect v-if="currentEmployee.user.status"
                                        v-model="currentEmployee.user.status.id">
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
            <VButton color="primary" raised @click="changestatusUser()">Confirm</VButton>
        </template>
    </VModal>
</template>
  
<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';
</style>
