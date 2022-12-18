<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getEmployee, updateEmployee } from '/@src/services/Employee/employeeService';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateEmployee } from '/@src/models/Employee/employee';
import { City, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { Nationality, defaultNationalitySearchFilter } from '/@src/models/Others/Nationality/nationality';
import { Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { getNationalitiesList } from '/@src/services/Others/Nationality/nationalityService';
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { employeeEditvalidationSchema } from '/@src/rules/Employee/employeeEditValidation';



const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Employee Main Info')
const head = useHead({
    title: 'Employee',
})
const employeeForm = useEmployeeForm()
employeeForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/employee-edit/${employeeForm.dataUpdate.id}/profile-picture`,
            })

        }
    },
    skipStepFn: async () => {
        router.push({
            path: `/employee-edit/${employeeForm.dataUpdate.id}/profile-picture`,
        })

    }
})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Employee Main Info'
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentEmployee = ref(defaultCreateEmployee)
const employeeId = ref(0)
// @ts-ignore
employeeId.value = route.params.id
const fetchEmployee = async () => {
    const { employee } = await getEmployee(employeeId.value)
    currentUser.value.first_name = employee.user.first_name
    currentUser.value.last_name = employee.user.last_name
    currentUser.value.gender = employee.user.gender
    currentUser.value.birth_date = employee.user.birth_date
    currentUser.value.phone_number = employee.user.phone_number
    console.log(employee.user.phone_number)
    currentUser.value.address = employee.user.address
    currentUser.value.city_id = employee.user.city.id
    currentUser.value.room_id = employee.user.room.id
    currentUser.value.user_status_id = employee.user.status.id
    currentEmployee.value.nationality_id = employee.nationality.id
    currentEmployee.value.starting_date = employee.starting_date
    currentEmployee.value.end_date = employee.end_date
    currentEmployee.value.basic_salary = employee.basic_salary
    currentEmployee.value.id = employee.id
    currentEmployee.value.user = employee.user

    employeeForm.userForm.id = employee.user.id
    employeeForm.userForm.first_name = currentUser.value.first_name
    employeeForm.userForm.last_name = currentUser.value.last_name
    employeeForm.userForm.gender = currentUser.value.gender
    employeeForm.userForm.birth_date = currentUser.value.birth_date
    employeeForm.userForm.phone_number = currentUser.value.phone_number
    employeeForm.userForm.address = currentUser.value.address
    employeeForm.userForm.room_id = currentUser.value.room_id
    employeeForm.userForm.city_id = currentUser.value.city_id
    employeeForm.userForm.user_status_id = currentUser.value.user_status_id
    employeeForm.dataUpdate.starting_date = currentEmployee.value.starting_date
    employeeForm.dataUpdate.end_date = currentEmployee.value.end_date
    employeeForm.dataUpdate.basic_salary = currentEmployee.value.basic_salary
    employeeForm.dataUpdate.nationality_id = currentEmployee.value.nationality_id
    employeeForm.dataUpdate.id = currentEmployee.value.id


}

const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const nationalitiesList = ref<Nationality[]>([])

onMounted(async () => {
    if (!isLoading.value) {
        isLoading.value = true
        const { cities } = await getCitiesList(defaultCitySearchFilter)
        citiesList.value = cities
        const { rooms } = await getRoomsList(defaultRoomSearchFilter)
        roomsList.value = rooms
        const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
        statusesList.value = userstatuses
        const { nationalities } = await getNationalitiesList(defaultNationalitySearchFilter)
        nationalitiesList.value = nationalities
        await fetchEmployee()
        isLoading.value = false

    }

})



const validationSchema = employeeEditvalidationSchema

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
        starting_date: currentEmployee.value.starting_date,
        end_date: currentEmployee.value.end_date,
        basic_salary: currentEmployee.value.basic_salary,
        nationality_id: currentEmployee.value.nationality_id
    },
})


const onSubmitEdit = handleSubmit(async (values) => {

    var userData = currentUser.value
    var employeeData = currentEmployee.value
    employeeForm.dataUpdate.starting_date = employeeData.starting_date
    employeeForm.dataUpdate.end_date = employeeData.end_date
    employeeForm.dataUpdate.basic_salary = employeeData.basic_salary
    employeeForm.dataUpdate.nationality_id = employeeData.nationality_id
    employeeForm.userForm.first_name = userData.first_name
    employeeForm.userForm.last_name = userData.last_name
    employeeForm.userForm.password = userData.password
    employeeForm.userForm.gender = userData.gender
    employeeForm.userForm.birth_date = userData.birth_date
    employeeForm.userForm.phone_number = userData.phone_number
    employeeForm.userForm.address = userData.address
    employeeForm.userForm.room_id = userData.room_id
    employeeForm.userForm.city_id = userData.city_id
    employeeForm.userForm.user_status_id = userData.user_status_id
    const employee = await updateEmployee(employeeId.value, employeeForm.dataUpdate, employeeForm.userForm)
    if (employee.success) {
        employeeForm.dataUpdate.id = employee.employee.id
        // @ts-ignore
        notif.success(`${employeeForm.userForm.first_name} ${employeeForm.userForm.last_name} was updated successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(employee.success)
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
                            <div class="fieldset-heading">
                                <h4>{{ pageTitle }}</h4>
                            </div>
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="first_name">
                                        <VLabel>first name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="first_name" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="last_name">
                                        <VLabel>last name</VLabel>
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
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="birth_date">
                                        <VLabel>birth date </VLabel>
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
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="phone_number">
                                        <VLabel>phone number </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput disabled v-model="currentUser.phone_number" type="number"
                                                placeholder="" autocomplete="given-phone_number" />
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
                                        <VLabel>address </VLabel>
                                        <VControl icon="feather:chevrons-right">
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
                                <div class="column is-12">
                                    <VField id="gender">
                                        <VLabel>gender</VLabel>

                                        <VControl>
                                            <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                                color="success" />

                                            <VRadio v-model="currentUser.gender" value="Female" label="Female"
                                                name="gender" color="success" />
                                            <ErrorMessage class="help is-danger" name="gender" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="room_id">
                                        <VLabel>room</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.room_id">
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
                                <div class="column is-12">
                                    <VField id="city_id">
                                        <VLabel>city</VLabel>
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
                                    <VField id="user_status_id">
                                        <VLabel>status</VLabel>
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
                            </div>
                        </div>
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="starting_date">
                                        <VLabel>Starting Date</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.starting_date" type="date" placeholder=""
                                                autocomplete="given-starting_date" />
                                            <ErrorMessage class="help is-danger" name="starting_date" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="end_date">
                                        <VLabel>end Date</VLabel>
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
                                <div class="column is-12">
                                    <VField id="basic_salary">
                                        <VLabel>Basic Salary</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.basic_salary" type="number" placeholder=""
                                                autocomplete="given-basic_salary" />
                                            <ErrorMessage class="help is-danger" name="basic_salary" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="nationality_id">
                                        <VLabel>Nationality</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentEmployee" v-model="currentEmployee.nationality_id">
                                                <VOption value="">Nationality</VOption>
                                                <VOption v-for="nationality in nationalitiesList" :key="nationality.id"
                                                    :value="nationality.id">{{ nationality.name }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="nationality_id" />
                                        </VControl>
                                    </VField>
                                </div>
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

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}

.load {
    height: 400px;
    width: 500px;
}
</style>
