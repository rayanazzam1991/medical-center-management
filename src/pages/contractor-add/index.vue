<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateContractor } from '/@src/models/Contractor/contractor';
import { City, CitySearchFilter, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { Room, defaultRoomSearchFilter, RoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { addContractor } from '/@src/services/Contractor/contractorService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { contractorAddvalidationSchema } from '/@src/rules/Contractor/contractorAddValidation';
import sleep from '/@src/utils/sleep';
import { defaultSpecialitySearchFilter, Speciality, SpecialitySearchFilter } from '/@src/models/Others/Speciality/speciality';
import { getSpecialitiesList } from '/@src/services/Others/Speciality/specialityService';
import { defaultDepartmentSearchFilter, Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department';
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService';
import { BaseConsts } from '/@src/utils/consts/base';
import {useI18n} from "vue-i18n";
import Notyf from 'notyf/notyf';

const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('contractor.form.step_1_title'))
const head = useHead({
    title: t('contractor.form.page_title'),
})
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                path: `/contractor-add/${contractorForm.data.id}/services`,
            })

        }
    },
})
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('contractor.form.step_1_subtitle')
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentContractor = ref(defaultCreateContractor)
const selectedDepartmentId = ref(0)
const getCurrentContractor = () => {

    currentUser.value = contractorForm.userForm
    currentContractor.value = contractorForm.data
    currentUser.value.gender = 'Male'


}
const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const specialitiesList = ref<Speciality[]>([])
const departmentsList = ref<Department[]>([])

onMounted(async () => {

    let citySearchFilter = {} as CitySearchFilter
    citySearchFilter.status = BaseConsts.ACTIVE
    citySearchFilter.per_page = 500
    const { cities } = await getCitiesList(citySearchFilter)
    citiesList.value = cities

    let userStatusSearchFilter = {} as UserStatusSearchFilter
    userStatusSearchFilter.per_page = 500
    const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
    statusesList.value = userstatuses

    let specialitySearchFilter = {} as SpecialitySearchFilter 
    specialitySearchFilter.status = BaseConsts.ACTIVE
    specialitySearchFilter.per_page = 500 
    const { specialities } = await getSpecialitiesList(specialitySearchFilter)
    specialitiesList.value = specialities

    let departmentSearchFilter = {} as DepartmentSearchFilter 
    departmentSearchFilter.per_page = 500
    departmentSearchFilter.status = BaseConsts.ACTIVE
    const { departments } = await getDepartmentsList(departmentSearchFilter)
    departmentsList.value = departments


})
onMounted(() => {
    getCurrentContractor()
})

const getRoomsByDepartment = async () => {
    let RoomsFilter: RoomSearchFilter = defaultRoomSearchFilter
    RoomsFilter.department_id = selectedDepartmentId.value
    RoomsFilter.status = BaseConsts.ACTIVE
    const { rooms } = await getRoomsList(RoomsFilter)
    roomsList.value = rooms

}
const validationSchema = contractorAddvalidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        address: "",
        room_id: undefined,
        city_id: "",
        user_status_id: "",
        starting_date: "",
        payment_percentage: "",
        end_date: undefined,
        speciality_id: ""
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    var userData = currentUser.value
    const { result } = await phoneExistsCheck('964' + userData.phone_number)
    phoneCheck.value = result as string
    if (phoneCheck.value === 'false') {
        var customerData = currentContractor.value
        contractorForm.data.starting_date = customerData.starting_date
        if(customerData.end_date != ''){
            contractorForm.data.end_date = customerData.end_date 

        }else {
            contractorForm.data.end_date = undefined 

        }
        contractorForm.data.speciality_id = customerData.speciality_id
        contractorForm.data.payment_percentage = customerData.payment_percentage
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
        const { success, message, contractor } = await addContractor(contractorForm.data, contractorForm.userForm)
        if (success) {
            contractorForm.data.id = contractor.id
            await sleep(200);

            // @ts-ignore
            notif.success(t('toast.success.add'))
            return true
        }
        else {
            await sleep(200);
            // @ts-ignore
            notif.error(message)
            return false
        }
    }
    else {
        return false
    }
})
</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="first_name">
                                    <VLabel class="required">{{t('contractor.form.first_name')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage class="help is-danger" name="first_name" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="last_name">
                                    <VLabel class="required">{{t('contractor.form.last_name')}}</VLabel>
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
                                    <VLabel class="required">{{t('contractor.form.phone_number')}} <span>(+964)</span></VLabel>
                                    <VControl icon="feather:chevrons-right"
                                        :class="phoneCheck != 'false' ? 'has-validation has-error' : ''">
                                        <VInput v-model="currentUser.phone_number" type="number" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage class="help is-danger" name="phone_number" />
                                        <p v-if="phoneCheck != 'false'" class="help is-danger">{{ phoneCheck }}</p>

                                    </VControl>
                                </VField>
                            </div>

                            <div class="column is-6">
                                <VField id="birth_date">
                                    <VLabel class="required">{{t('contractor.form.birth_date')}}</VLabel>
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
                                    <VLabel class="required">{{t('contractor.form.gender')}}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" :label="t('gender.male')" name="gender"
                                            color="success" />

                                        <VRadio v-model="currentUser.gender" value="Female" :label="t('gender.female')" name="gender"
                                            color="success" />
                                        <ErrorMessage class="help is-danger" name="gender" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="city_id">
                                    <VLabel class="required">{{t('contractor.form.city')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                            <VOption value="">{{t('contractor.form.city')}}</VOption>
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
                                    <VLabel class="required">{{t('contractor.form.address')}} </VLabel>
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
                                    <VLabel class="required">{{t('contractor.form.department')}}</VLabel>
                                    <VControl>
                                        <div class="select">

                                            <select @change="getRoomsByDepartment" v-if="currentUser"
                                                v-model="selectedDepartmentId">
                                                <VOption :value="0">{{t('contractor.form.department')}}</VOption>
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
                                    <VLabel class="required">{{t('contractor.form.room')}}</VLabel>
                                    <VControl>
                                        <VSelect :disabled="roomsList.length <= 0" v-if="currentUser"
                                            v-model="currentUser.room_id">
                                            <VOption>{{t('contractor.form.room')}}</VOption>
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
                                    <VLabel class="required">{{t('contractor.form.starting_date')}} </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentContractor.starting_date" type="date" />
                                        <ErrorMessage class="help is-danger" name="starting_date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="end_date">
                                    <VLabel >{{t('contractor.form.end_date')}} </VLabel>
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
                                    <VLabel class="required">{{t('contractor.form.payment_percentage')}}</VLabel>
                                    <VControl icon="feather:percent">
                                        <VInput v-model="currentContractor.payment_percentage" type="number" />
                                        <ErrorMessage class="help is-danger" name="payment_percentage" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="speciality_id">
                                    <VLabel class="required">{{t('contractor.form.speciality')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentContractor.speciality_id">
                                            <VOption value="">{{t('contractor.form.speciality')}}</VOption>
                                            <VOption v-for="speciality in specialitiesList" :key="speciality.id"
                                                :value="speciality.id">
                                                {{ speciality.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="speciality_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="user_status_id">
                                    <VLabel class="required">{{t('contractor.form.status')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                            <VOption value="">{{t('contractor.form.status')}}</VOption>
                                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">
                                                {{ status.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="user_status_id" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </form>
    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
    content: " *";
    color: var(--danger);
}


.Vi {
    width: 28.5em;
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

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
