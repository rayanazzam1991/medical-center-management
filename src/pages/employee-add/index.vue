<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { addEmployee } from '/@src/services/Employee/employeeService';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
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
import { employeeAddvalidationSchema } from '/@src/rules/Employee/employeeAddValidation';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Employee Info')
const head = useHead({
    title: 'Employee',
})
const employeeForm = useEmployeeForm()
employeeForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                path: `/employee-add/${employeeForm.data.id}/profile-picture`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Employee Info'
const phoneCheck = ref<string>('false')
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

onMounted(async () => {
    const { cities } = await getCitiesList(defaultCitySearchFilter)
    citiesList.value = cities
    const { rooms } = await getRoomsList(defaultRoomSearchFilter)
    roomsList.value = rooms
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses
    const { nationalities } = await getNationalitiesList(defaultNationalitySearchFilter)
    nationalitiesList.value = nationalities

})
onMounted(() => {
    getCurrentEmployee()
}
)


const validationSchema = employeeAddvalidationSchema

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


const onSubmitAdd = handleSubmit(async (values) => {

    var userData = currentUser.value
    console.log(userData)
    const { result } = await phoneExistsCheck(userData.phone_number)
    phoneCheck.value = result as string
    if (phoneCheck.value === 'false') {
        var employeeData = currentEmployee.value
        employeeForm.data.starting_date = employeeData.starting_date
        employeeForm.data.end_date = employeeData.end_date
        employeeForm.data.nationality_id = employeeData.nationality_id
        employeeForm.userForm.first_name = userData.first_name
        employeeForm.userForm.last_name = userData.last_name
        employeeForm.userForm.password = userData.password
        employeeForm.userForm.gender = userData.gender
        employeeForm.userForm.birth_date = userData.birth_date
        employeeForm.userForm.phone_number = '964' + userData.phone_number
        employeeForm.userForm.address = userData.address
        employeeForm.userForm.room_id = userData.room_id
        employeeForm.userForm.city_id = userData.city_id
        employeeForm.userForm.user_status_id = userData.user_status_id
        console.log(employeeForm.userForm)

        const employee = await addEmployee(employeeForm.data, employeeForm.userForm)
        console.log(employee)

        if (employee.success) {
            employeeForm.data.id = employee.employee.id
            // @ts-ignore
            notif.success(`${employeeForm.userForm.first_name} ${employeeForm.userForm.last_name} was added successfully`)

            return true
        }
        else {
            // @ts-ignore

            notif.error(employee.success)
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
                        <div class="columns is-multiline ">
                            <label class="lab">phone number </label>
                            <div class="columns column is-12">
                                <div class="column is-2 ">
                                    <input class="input" type="text" placeholder="+964" readonly />
                                </div>
                                <VField class="column is-10 " id="phone_number">
                                    <VControl class="Vi"
                                        :class="phoneCheck != 'false' ? 'has-validation has-error' : ''"
                                        icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.phone_number" type="number" />

                                        <ErrorMessage class="help is-danger" name="phone_number" />
                                        <p v-if="phoneCheck != 'false'" class="help is-danger">{{ phoneCheck }}</p>
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
                            <div class="column is-12">
                                <VField id="gender">
                                    <VLabel>gender</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                            color="success" />

                                        <VRadio v-model="currentUser.gender" value="Female" label="Female" name="gender"
                                            color="success" />
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
                                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">
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
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="end_date">
                                    <VLabel>End Date</VLabel>
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
        </form>
    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.Vi {
    width: 28.5em;
}

.lab {
    margin-left: .77em;
    margin-bottom: .27em;
    display: block;
}

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}
</style>
