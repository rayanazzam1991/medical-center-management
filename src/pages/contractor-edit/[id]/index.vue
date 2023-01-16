<script setup  lang="ts">import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { z as zod } from 'zod';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateContractor } from '/@src/models/Contractor/contractor';
import { City, CitySearchFilter, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { Room, defaultRoomSearchFilter, RoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getContractor, updateContractor } from '/@src/services/Contractor/contractorService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { contractorEditvalidationSchema } from '/@src/rules/Contractor/contractorEditValidation';
import { useContractor } from '/@src/stores/Contractor/contractorStore';
import sleep from '/@src/utils/sleep';
import { defaultSpecialitySearchFilter, Speciality, SpecialitySearchFilter } from '/@src/models/Others/Speciality/speciality';
import { getSpecialitiesList } from '/@src/services/Others/Speciality/specialityService';
import { defaultDepartmentSearchFilter, Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department';
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService';
import {useI18n} from "vue-i18n";
import Notyf from 'notyf/notyf';



const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Edit Contractor Main Info')
const head = useHead({
    title: 'Contractor',
})
const contractorStore = useContractor()
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 1,
    canNavigate: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            contractorForm.reset()
            isLoading.value = true
            router.push({
                path: `/contractor/${contractorForm.dataUpdate.id}/`,
            })
            isLoading.value = false

        }
    },
})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const notif = useNotyf() as Notyf
const currentUser = ref(defaultCreateUpdateUser)
const currentContractor = ref(defaultCreateContractor)
const contractorId = ref(0)
const selectedDepartmentId = ref(0)

// @ts-ignore
contractorId.value = route.params.id
const fetchContractor = async () => {
    const { contractor } = await getContractor(contractorId.value)
    currentUser.value.first_name = contractor.user.first_name
    currentUser.value.last_name = contractor.user.last_name
    currentUser.value.gender = contractor.user.gender
    currentUser.value.birth_date = contractor.user.birth_date
    currentUser.value.phone_number = contractor.user.phone_number
    currentUser.value.address = contractor.user.address
    currentUser.value.city_id = contractor.user.city?.id
    currentUser.value.room_id = contractor.user.room?.id
    currentUser.value.user_status_id = contractor.user.status?.id
    currentContractor.value.starting_date = contractor.starting_date
    currentContractor.value.payment_percentage = contractor.payment_percentage
    currentContractor.value.id = contractor.id
    currentContractor.value.services = contractor.services
    currentContractor.value.user = contractor.user
    currentContractor.value.end_date = contractor.end_date
    currentContractor.value.speciality_id = contractor.speciality.id ?? 0

    contractorForm.userForm.id = contractor.user.id
    contractorForm.userForm.first_name = currentUser.value.first_name
    contractorForm.userForm.last_name = currentUser.value.last_name
    contractorForm.userForm.gender = currentUser.value.gender
    contractorForm.userForm.birth_date = currentUser.value.birth_date
    contractorForm.userForm.phone_number = currentUser.value.phone_number
    contractorForm.userForm.address = currentUser.value.address
    contractorForm.userForm.room_id = currentUser.value.room_id
    contractorForm.userForm.city_id = currentUser.value.city_id
    contractorForm.userForm.user_status_id = currentUser.value.user_status_id
    contractorForm.dataUpdate.starting_date = currentContractor.value.starting_date
    contractorForm.dataUpdate.end_date = currentContractor.value.end_date
    contractorForm.dataUpdate.speciality_id = currentContractor.value.speciality_id
    contractorForm.dataUpdate.payment_percentage = currentContractor.value.payment_percentage
    contractorForm.dataUpdate.id = currentContractor.value.id
    selectedDepartmentId.value = contractor.user.room.department?.id ?? 0


}

const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const specialitiesList = ref<Speciality[]>([])
const departmentsList = ref<Department[]>([])

onMounted(async () => {
    if (!isLoading.value) {
        isLoading.value = true
        let citySearchFilter = {} as CitySearchFilter 
        citySearchFilter.per_page = 500
        const { cities } = await getCitiesList(citySearchFilter)
        citiesList.value = cities
        let userStatusSearchFilter = {} as UserStatusSearchFilter
        userStatusSearchFilter.per_page = 500
        const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
        statusesList.value = userstatuses
        let specialitySearchFilter = {} as SpecialitySearchFilter
        specialitySearchFilter.per_page  = 500
        const { specialities } = await getSpecialitiesList(specialitySearchFilter)
        specialitiesList.value = specialities
        let departmentSearchFilter = {} as DepartmentSearchFilter
        departmentSearchFilter.per_page = 500
        const { departments } = await getDepartmentsList(departmentSearchFilter)
        departmentsList.value = departments
        await fetchContractor()
        let roomsFilter = {} as RoomSearchFilter 
        roomsFilter.department_id = selectedDepartmentId.value
        roomsFilter.per_page = 500
        const { rooms } = await getRoomsList(roomsFilter)
        roomsList.value = rooms
        isLoading.value = false
    }
})
const getRoomsByDepartment = async () => {
    let roomsFilter = {} as RoomSearchFilter 
    roomsFilter.department_id = selectedDepartmentId.value
    roomsFilter.per_page = 500
    const { rooms } = await getRoomsList(roomsFilter)
    roomsList.value = rooms
    currentUser.value.room_id = undefined

}



const validationSchema = contractorEditvalidationSchema

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        first_name: currentUser.value.first_name,
        last_name: currentUser.value.last_name,
        gender: currentUser.value.gender,
        birth_date: currentUser.value.birth_date,
        phone_number: currentUser.value.phone_number,
        address: currentUser.value.address,
        room_id: currentUser.value.room_id,
        city_id: currentUser.value.city_id,
        user_status_id: currentUser.value.user_status_id,
        starting_date: currentContractor.value.starting_date,
        end_date: currentContractor.value.end_date,
        speciality_id: currentContractor.value.speciality_id,
        payment_percentage: currentContractor.value.payment_percentage,
    },
})


const onSubmitEdit = handleSubmit(async (values) => {

    var userData = currentUser.value
    var contractorData = currentContractor.value
    console.log(contractorData)
    contractorForm.dataUpdate.starting_date = contractorData.starting_date
    contractorForm.dataUpdate.payment_percentage = contractorData.payment_percentage
    contractorForm.dataUpdate.speciality_id = contractorData.speciality_id
    if(contractorData.end_date != ''){
            contractorForm.data.end_date = contractorData.end_date 

        }else {
            contractorForm.data.end_date = undefined 
        }
    contractorForm.userForm.first_name = userData.first_name
    contractorForm.userForm.last_name = userData.last_name
    contractorForm.userForm.password = userData.password
    contractorForm.userForm.gender = userData.gender
    contractorForm.userForm.birth_date = userData.birth_date
    contractorForm.userForm.phone_number = userData.phone_number
    contractorForm.userForm.address = userData.address
    contractorForm.userForm.room_id = userData.room_id
    contractorForm.userForm.city_id = userData.city_id
    contractorForm.userForm.user_status_id = userData.user_status_id
    const { success, message, contractor } = await updateContractor(contractorId.value, contractorForm.dataUpdate, contractorForm.userForm, contractorForm.contractorServicesForm)
    if (success) {
        contractorForm.dataUpdate.id = contractor.id
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.edit'))

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

        notif.error(message)
        return false


    }


})





</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div class="form-outer">
                <div class="form-body">
                    <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
                        <div class="load">
                        </div>
                    </VLoader>
                    <div :hidden="isLoading">
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="first_name">
                                        <VLabel class="required">First name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="first_name" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="last_name">
                                        <VLabel class="required">Last name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.last_name" type="text" placeholder=""
                                                autocomplete="given-last_name" />
                                            <ErrorMessage class="help is-danger" name="last_name" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="phone_number">
                                        <VLabel class="required">Phone number <span>(+964)</span></VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.phone_number" type="number" placeholder=""
                                                disabled autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="phone_number" />
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="birth_date">
                                        <VLabel class="required">Birth date </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.birth_date" type="date" placeholder=""
                                                autocomplete="given-birth_date" />
                                            <ErrorMessage class="help is-danger" name="birth_date" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="gender">
                                        <VLabel class="required">Gender</VLabel>

                                        <VControl>
                                            <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                                color="success" />

                                            <VRadio v-model="currentUser.gender" value="Female" label="Female"
                                                name="gender" color="success" />
                                            <ErrorMessage class="help is-danger" name="gender" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="city_id">
                                        <VLabel class="required">City</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                                <VOption value="">City</VOption>
                                                <VOption v-for="city in citiesList" :key="city.id" :value="city.id">{{
        city.name
}}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="city_id" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="address">
                                        <VLabel class="required">Address </VLabel>
                                        <VControl>
                                            <VTextarea v-model="currentUser.address" />
                                            <ErrorMessage class="help is-danger" name="address" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField>
                                        <VLabel class="required">Department</VLabel>
                                        <VControl>
                                            <div class="select">

                                                <select @change="getRoomsByDepartment" v-if="currentUser"
                                                    v-model="selectedDepartmentId">
                                                    <VOption :value="0">Department</VOption>
                                                    <VOption v-for="department in departmentsList" :key="department.id"
                                                        :value="department.id">{{ department.name }}
                                                    </VOption>
                                                </select>
                                            </div>
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="room_id">
                                        <VLabel class="required">Room</VLabel>
                                        <VControl>
                                            <VSelect :disabled="roomsList.length <= 0" v-if="currentUser"
                                                v-model="currentUser.room_id">
                                                <VOption>Room</VOption>
                                                <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{
        room.number
}}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="room_id" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="starting_date">
                                        <VLabel class="required">Starting date </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentContractor.starting_date" type="date" />
                                            <ErrorMessage class="help is-danger" name="starting_date" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="end_date">
                                        <VLabel >End date </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentContractor.end_date" type="date" />
                                            <ErrorMessage class="help is-danger" name="end_date" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="payment_percentage">
                                        <VLabel class="required">Payment Percentage</VLabel>
                                        <VControl icon="feather:percent">
                                            <VInput v-model="currentContractor.payment_percentage" type="number" />
                                            <ErrorMessage class="help is-danger" name="payment_percentage" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="speciality_id">
                                        <VLabel class="required">Speciality</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentContractor.speciality_id">
                                                <VOption value="">Speciality</VOption>
                                                <VOption v-for="speciality in specialitiesList" :key="speciality.id"
                                                    :value="speciality.id">
                                                    {{
        speciality.name
}}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="speciality_id" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="user_status_id">
                                        <VLabel class="required">Status</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                                <VOption value="">Status</VOption>
                                                <VOption v-for="status in statusesList" :key="status.id"
                                                    :value="status.id">
                                                    {{
        status.name
}}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="user_status_id" />
                                        </VControl>
                                    </VField>
                                </div>

                                <form class="" @submit.prevent="() => contractorForm?.validateStepFn?.()">

                                    <!--Wizard Navigation Buttons-->
                                    <div class="wizard-buttons" :class="[(contractorForm.canNavigate && 'is-active')]">
                                        <div class="columns">
                                            <div class="column is-one-quarter"></div>
                                            <div class="wizard-buttons-inner">
                                                <VLoader size="small" :active="contractorStore.loading">
                                                    <VButton type="submit" class="wizard-button-previous"
                                                        :color="'primary'" bold elevated>
                                                        {{ 'Submit' }}
                                                    </VButton>
                                                </VLoader>
                                                <!-- <VButton class="wizard-button-previous" :disabled="contractorForm.skipable === false"
                :color="contractorForm.skipable === true ? 'dark' : 'dark'"
                @click="() => contractorForm?.skipStepFn?.()">
                {{ contractorForm.getStep() == 3 ? 'Skip & Finish' : 'Skip'
                }}
            </VButton> -->
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>



    </div>
</template>
<style   lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';


.Vi {
    width: 28.5em;
}

.required::after {
    content: " *";
    color: var(--danger);
}

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
    padding-bottom: 72px;

}


.lab {
    margin-left: .77em;
    margin-bottom: .27em;
    display: block;
}

.load {
    height: 400px;
    width: 500px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
