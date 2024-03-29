<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { addEmployee } from '/@src/services/Employee/employeeService';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateEmployee } from '/@src/models/Employee/employee';
import { City, CitySearchFilter, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { Nationality, defaultNationalitySearchFilter, NationalitySearchFilter } from '/@src/models/Others/Nationality/nationality';
import { Room, defaultRoomSearchFilter, RoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { getNationalitiesList } from '/@src/services/Others/Nationality/nationalityService';
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { employeeAddvalidationSchema } from '/@src/rules/Employee/employeeAddValidation';
import sleep from "/@src/utils/sleep"
import { Position, defaultPositionSearchFilter, PositionSearchFilter } from '/@src/models/Others/Position/position';
import { getPositionsList } from '/@src/services/Others/Position/positionService';
import { defaultDepartmentSearchFilter, Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department';
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService';
import { BaseConsts } from '/@src/utils/consts/base';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('employee.form.step_1_title'))
const head = useHead({
    title: t('employee.form.page_title'),
})
const employeeForm = useEmployeeForm()
employeeForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            employeeForm.reset()
            router.push({
                path: `/employee/${employeeForm.data.id}`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const selectedDepartmentId = ref(0)

const pageTitle = t('employee.form.step_1_subtitle')
const phoneCheck = ref<string>('false')
// const selectDepartment = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentEmployee = ref(defaultCreateEmployee)
const getCurrentEmployee = () => {
    currentUser.value = employeeForm.userForm
    currentEmployee.value = employeeForm.data
}
const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const nationalitiesList = ref<Nationality[]>([])
const positionsList = ref<Position[]>([])
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

    let nationalitySearchFilter = {} as NationalitySearchFilter
    nationalitySearchFilter.status = BaseConsts.ACTIVE
    nationalitySearchFilter.per_page = 500
    const { nationalities } = await getNationalitiesList(nationalitySearchFilter)
    nationalitiesList.value = nationalities

    let positionSearchFilter = {} as PositionSearchFilter 
    positionSearchFilter.per_page = 500
    positionSearchFilter.status = BaseConsts.ACTIVE
    const { positions } = await getPositionsList(positionSearchFilter)
    positionsList.value = positions

    let departmentSearchFilter = {} as DepartmentSearchFilter 
    departmentSearchFilter.status = BaseConsts.ACTIVE
    departmentSearchFilter.per_page = 500
    const { departments } = await getDepartmentsList(departmentSearchFilter)
    departmentsList.value = departments


})
onMounted(() => {
    getCurrentEmployee()
}
)
const getRoomsByDepartment = async () => {
    let RoomsFilter: RoomSearchFilter = defaultRoomSearchFilter
    RoomsFilter.department_id = selectedDepartmentId.value
    RoomsFilter.per_page = 500
    const { rooms } = await getRoomsList(RoomsFilter)
    roomsList.value = rooms

}

const validationSchema = employeeAddvalidationSchema

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
        end_date: "",
        basic_salary: undefined,
        nationality_id: "",
        position_id: ""
    },
})


const onSubmitAdd = handleSubmit(async (values) => {

    var userData = currentUser.value
    const { result } = await phoneExistsCheck('964' + userData.phone_number)
    phoneCheck.value = result as string
    if (phoneCheck.value === 'false') {
        var employeeData = currentEmployee.value
        employeeForm.data.starting_date = employeeData.starting_date
        employeeForm.data.end_date = employeeData.end_date
        employeeForm.data.nationality_id = employeeData.nationality_id
        employeeForm.data.position_id = employeeData.position_id
        employeeForm.userForm.first_name = userData.first_name
        employeeForm.userForm.last_name = userData.last_name
        employeeForm.userForm.password = userData.password
        employeeForm.userForm.gender = userData.gender
        employeeForm.userForm.birth_date = userData.birth_date
        employeeForm.userForm.phone_number = userData.phone_number
        employeeForm.userForm.address = userData.address
        if (currentUser.value.room_id != undefined)
            employeeForm.userForm.room_id = userData.room_id
        employeeForm.userForm.city_id = userData.city_id
        employeeForm.userForm.user_status_id = userData.user_status_id

        const { employee, success, message } = await addEmployee(employeeForm.data, employeeForm.userForm)

        if (success) {
            employeeForm.data.id = employee.id
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
        <form class="form-layout" @submit.prevent="onSubmitAdd()">
            <div class="form-outer">
                <div class="form-body">
                    <div class="layout">

                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="fieldset-heading">
                                <h4>{{ pageTitle }}</h4>
                            </div>
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="first_name">
                                        <VLabel class="required">{{t('employee.form.first_name')}}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="first_name" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6 ">
                                    <VField id="last_name">
                                        <VLabel class="required">{{t('employee.form.last_name')}}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.last_name" type="text" placeholder=""
                                                autocomplete="given-last_name" />
                                            <ErrorMessage class="help is-danger" name="last_name" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="phone_number">
                                        <VLabel class="required">{{t('employee.form.phone_number')}} <span>(+964)</span></VLabel>
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
                                        <VLabel class="required">{{t('employee.form.birth_date')}} </VLabel>
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
                        <div class="form-fieldset">
                            <div class="columns is-multiline ">
                                <div class="column is-half">
                                    <VField id="gender">
                                        <VLabel class="required ml-3">{{t('employee.form.gender')}}</VLabel>
                                        <VControl>
                                            <VRadio v-model="currentUser.gender" value="Male" :label="t('gender.male')" name="gender"
                                                color="success" />

                                            <VRadio v-model="currentUser.gender" value="Female" :label="t('gender.female')"
                                                name="gender" color="success" />
                                            <ErrorMessage class="help is-danger" name="gender" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="city_id">
                                        <VLabel class="required">{{t('employee.form.city')}}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                                <VOption value="">{{t('employee.form.city')}}</VOption>
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
                                        <VLabel class="required">{{t('employee.form.address')}} </VLabel>
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
                                        <VLabel class="required">{{t('employee.form.department')}}</VLabel>
                                        <VControl>
                                            <div class="select">

                                                <select @change="getRoomsByDepartment" v-if="currentUser"
                                                    v-model="selectedDepartmentId">
                                                    <VOption :value="0">{{t('employee.form.department')}}</VOption>
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
                                        <VLabel class="required">{{t('employee.form.room')}}</VLabel>
                                        <VControl>
                                            <VSelect :disabled="roomsList.length <= 0" v-if="currentUser"
                                                v-model="currentUser.room_id">
                                                <VOption>{{t('employee.form.room')}}</VOption>
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
                                        <VLabel class="required">{{t('employee.form.starting_date')}}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.starting_date" type="date" placeholder=""
                                                autocomplete="given-starting_date" />
                                            <ErrorMessage class="help is-danger" name="starting_date" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="end_date">
                                        <VLabel class="optional">{{t('employee.form.end_date')}}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.end_date" type="date" placeholder=""
                                                autocomplete="given-end_date" />
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
                                    <VField id="basic_salary">
                                        <VLabel class="required">{{t('employee.form.basic_salary')}}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.basic_salary" type="number" placeholder=""
                                                autocomplete="given-basic_salary" />
                                            <ErrorMessage class="help is-danger" name="basic_salary" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="nationality_id">
                                        <VLabel class="required">{{t('employee.form.nationality')}}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentEmployee" v-model="currentEmployee.nationality_id">
                                                <VOption value="">{{t('employee.form.nationality')}}</VOption>
                                                <VOption v-for="nationality in nationalitiesList" :key="nationality.id"
                                                    :value="nationality.id">{{ nationality.name }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="nationality_id" />
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="position_id">
                                        <VLabel class="required">{{t('employee.form.position')}}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentEmployee" v-model="currentEmployee.position_id">
                                                <VOption value="">{{t('employee.form.position')}}</VOption>
                                                <VOption v-for="position in positionsList" :key="position.id"
                                                    :value="position.id">{{ position.name }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="position_id" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="user_status_id">
                                        <VLabel class="required">{{t('employee.form.status')}}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                                <VOption value="">{{t('employee.form.status')}}</VOption>
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

                            </div>
                        </div>
                        <!--Fieldset-->
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

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
    padding-bottom: 72px;



}
</style>
