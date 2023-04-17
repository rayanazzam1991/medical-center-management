<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getEmployee, updateEmployee } from '/@src/services/Employee/employeeService';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
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
import { employeeEditvalidationSchema } from '/@src/rules/Employee/employeeEditValidation';
import { getPositionsList } from '/@src/services/Others/Position/positionService';
import { Position, defaultPositionSearchFilter, PositionSearchFilter } from '/@src/models/Others/Position/position';
import sleep from "/@src/utils/sleep"
import { Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department';
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { EmployeeConsts } from '/@src/models/Employee/employee';
import { getRolesList } from '/@src/services/Others/Role/roleService';
import { Role } from '/@src/utils/consts/rolesPermissions';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('employee.form.edit_step_1_title'))
const head = useHead({
    title: t('employee.form.page_title'),
})
const employeeForm = useEmployeeForm()
employeeForm.setStep({
    number: 1,
    canNavigate: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/employee/${employeeForm.dataUpdate.id}`,
            })

        }
    },
})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const currentUser = ref(defaultCreateUpdateUser)
const currentEmployee = ref(defaultCreateEmployee)
const employeeId = ref(0)
const selectedDepartmentId = ref(0)
const selectedType = ref<number>(0)

// @ts-ignore
employeeId.value = route.params.id
const fetchEmployee = async () => {
    const { employee } = await getEmployee(employeeId.value)
    currentUser.value.first_name = employee.user.first_name
    currentUser.value.last_name = employee.user.last_name
    currentUser.value.gender = employee.user.gender
    currentUser.value.birth_date = employee.user.birth_date
    currentUser.value.phone_number = employee.user.phone_number
    currentUser.value.address = employee.user.address
    currentUser.value.city_id = employee.user.city.id
    currentUser.value.room_id = employee.user.room.id
    currentUser.value.user_status_id = employee.user.status.id
    currentUser.value.roles = employee.user.roles?.map(function (element) { return element.name }) ?? []
    currentUser.value.default_role_id = employee.user.default_role?.id
    currentEmployee.value.nationality_id = employee.nationality.id
    currentEmployee.value.position_id = employee.position.id
    currentEmployee.value.starting_date = employee.starting_date
    currentEmployee.value.end_date = employee.end_date
    currentEmployee.value.basic_salary = employee.basic_salary
    currentEmployee.value.id = employee.id
    currentEmployee.value.payment_percentage = employee.payment_percentage
    currentEmployee.value.type = employee.payment_percentage
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
    employeeForm.userForm.default_role_id = currentUser.value.default_role_id
    employeeForm.dataUpdate.starting_date = currentEmployee.value.starting_date
    employeeForm.dataUpdate.end_date = currentEmployee.value.end_date
    employeeForm.dataUpdate.basic_salary = currentEmployee.value.basic_salary
    employeeForm.dataUpdate.nationality_id = currentEmployee.value.nationality_id
    employeeForm.dataUpdate.position_id = currentEmployee.value.position_id
    employeeForm.dataUpdate.id = currentEmployee.value.id

    currentEmployee.value.user = currentUser.value

    selectedDepartmentId.value = employee.user.room.department?.id ?? 0
    selectedType.value = employee.type

    setupSelectedRoles()

}

const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const nationalitiesList = ref<Nationality[]>([])
const positionsList = ref<Position[]>([])
const departmentsList = ref<Department[]>([])
const rolesList = ref<Role[]>([])
const selectedRolesList = ref<Role[]>([])


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
        let nationalitySearchFilter = {} as NationalitySearchFilter
        nationalitySearchFilter.per_page = 500
        const { nationalities } = await getNationalitiesList(nationalitySearchFilter)
        nationalitiesList.value = nationalities
        let positionSearchFilter = {} as PositionSearchFilter
        positionSearchFilter.per_page = 500
        const { positions } = await getPositionsList(positionSearchFilter)
        positionsList.value = positions
        let departmentSearchFilter = {} as DepartmentSearchFilter
        departmentSearchFilter.per_page = 500
        const { departments } = await getDepartmentsList(departmentSearchFilter)
        departmentsList.value = departments
        const { roles } = await getRolesList()
        rolesList.value = roles

        await fetchEmployee()
        let roomsFilter: RoomSearchFilter = defaultRoomSearchFilter
        roomsFilter.department_id = selectedDepartmentId.value
        roomsFilter.per_page = 500
        const { rooms } = await getRoomsList(roomsFilter)
        roomsList.value = rooms

        isLoading.value = false

    }

})
const getRoomsByDepartment = async () => {
    let roomsFilter: RoomSearchFilter = defaultRoomSearchFilter
    roomsFilter.department_id = selectedDepartmentId.value
    roomsFilter.per_page = 500
    const { rooms } = await getRoomsList(roomsFilter)
    roomsList.value = rooms
    currentUser.value.room_id = undefined

}

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
        nationality_id: currentEmployee.value.nationality_id,
        payment_percentage: currentEmployee.value.payment_percentage
    },
})


const onSubmitEdit = handleSubmit(async (values) => {

    var userData = currentUser.value
    var employeeData = currentEmployee.value
    let selectedType
    let rolesError = false

    if (employeeData.basic_salary == 0) {
        if (employeeData.payment_percentage == 0) {
            notif.error(t('toast.error.basic_salary_payment_percentage_required'))
            return
        } else {
            selectedType = EmployeeConsts.TYPE_COMMISSION_BASED_EMPLOYEE
        }
    } else {
        if (employeeData.payment_percentage == 0) {
            selectedType = EmployeeConsts.TYPE_SALARIED_EMPLOYEE
        } else {
            selectedType = EmployeeConsts.TYPE_HYBRID_EMPLOYEE
        }
    }
    userData.roles.forEach((role) => {
        if (role == 'No_Access' && userData.roles.length > 1) {
            notif.error({ message: t('toast.error.employee.cannot_combine_no_access'), duration: 4000 })
            rolesError = true
        }
    });
    if (rolesError) return

    employeeForm.dataUpdate.starting_date = employeeData.starting_date
    employeeForm.dataUpdate.end_date = employeeData.end_date
    employeeForm.dataUpdate.basic_salary = employeeData.basic_salary
    employeeForm.dataUpdate.nationality_id = employeeData.nationality_id
    employeeForm.dataUpdate.payment_percentage = employeeData.payment_percentage
    employeeForm.dataUpdate.type = selectedType
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
    if (userData.roles.length <= 0) {
        employeeForm.userForm.roles.push('No_Access')
        employeeForm.userForm.default_role_id = undefined

    } else {
        employeeForm.userForm.roles = userData.roles
        employeeForm.userForm.default_role_id = userData.default_role_id
    }

    const { employee, success, message } = await updateEmployee(employeeId.value, employeeForm.dataUpdate, employeeForm.userForm, [])
    if (success) {
        employeeForm.dataUpdate.id = employee.id
        // @ts-ignore
        await sleep(200);

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
const setupSelectedRoles = () => {
    if (currentUser.value.roles) {
        selectedRolesList.value = []
        rolesList.value.forEach(role => {
            const myRole = currentUser.value.roles.find((roleEl) => roleEl == role.name)
            if (myRole) {
                const roleVal = role
                selectedRolesList.value.push(roleVal)
            }
        });
    }

}

const updateSelectedRoles = () => {
    if (currentUser.value.roles) {
        selectedRolesList.value = []
        rolesList.value.forEach(role => {
            const myRole = currentUser.value.roles.find((roleEl) => roleEl == role.name)
            if (myRole) {
                const roleVal = role
                selectedRolesList.value.push(roleVal)
            }
        });
        currentUser.value.default_role_id = selectedRolesList.value[0].id
    }

}





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
                                        <VLabel class="required">{{ t('employee.form.first_name') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="first_name" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6 ">
                                    <VField id="last_name">
                                        <VLabel class="required">{{ t('employee.form.last_name') }}</VLabel>
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
                                        <VLabel class="required">{{ t('employee.form.phone_number') }} <span>(+964)</span>
                                        </VLabel>
                                        <VControl icon="feather:chevrons-right">

                                            <VInput disabled v-model="currentUser.phone_number" type="number" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="phone_number" />
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="birth_date">
                                        <VLabel class="required">{{ t('employee.form.birth_date') }} </VLabel>
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
                                        <VLabel class="required ml-3">{{ t('employee.form.gender') }}</VLabel>

                                        <VControl>
                                            <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                                color="success" />

                                            <VRadio v-model="currentUser.gender" value="Female" label="Female" name="gender"
                                                color="success" />
                                            <ErrorMessage class="help is-danger" name="gender" />
                                        </VControl>
                                    </VField>

                                </div>
                                <div class="column is-6">
                                    <VField id="city_id">
                                        <VLabel class="required">{{ t('employee.form.city') }}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                                <VOption value="">{{ t('employee.form.city') }}</VOption>
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
                                <div class="column is-6">
                                    <VField>
                                        <VLabel class="required">{{ t('employee.form.roles') }}</VLabel>
                                        <VControl>
                                            <VSelect @click="updateSelectedRoles" v-if="currentUser"
                                                v-model="currentUser.roles" multiple size="3">
                                                <VOption v-for="role in rolesList" :key="role.name" :value="role.name">
                                                    {{
                                                        role.display_name
                                                    }}
                                                </VOption>
                                            </VSelect>
                                            <p class="help is-info">{{ t('employee.form.roles_helper') }}</p>
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField>
                                        <VLabel>{{ t('employee.form.default_role') }}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.default_role_id">
                                                <VOption v-for="role in selectedRolesList" :key="role.id" :value="role.id">
                                                    {{
                                                        role.display_name
                                                    }}
                                                </VOption>
                                            </VSelect>
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-12">
                                    <VField id="address">
                                        <VLabel class="required">{{ t('employee.form.address') }} </VLabel>
                                        <VControl>
                                            <VTextarea v-model="currentUser.address" />
                                            <ErrorMessage class="help is-danger" name="address" />
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
                                    <VField>
                                        <VLabel class="required">{{ t('employee.form.department') }}</VLabel>
                                        <VControl>
                                            <div class="select">

                                                <select @change="getRoomsByDepartment" v-if="currentUser"
                                                    v-model="selectedDepartmentId">
                                                    <VOption :value="0">{{ t('employee.form.department') }}</VOption>
                                                    <VOption v-for="department in departmentsList" :key="department.id"
                                                        :value="department.id">{{
                                                            department.name
                                                        }}
                                                    </VOption>
                                                </select>
                                            </div>
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="room_id">
                                        <VLabel class="required">{{ t('employee.form.room') }}</VLabel>
                                        <VControl>
                                            <VSelect :disabled="roomsList.length <= 0" v-if="currentUser"
                                                v-model="currentUser.room_id">
                                                <VOption>{{ t('employee.form.room') }}</VOption>
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
                                        <VLabel class="required">{{ t('employee.form.starting_date') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.starting_date" type="date" placeholder=""
                                                autocomplete="given-starting_date" />
                                            <ErrorMessage class="help is-danger" name="starting_date" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="end_date">
                                        <VLabel class="optional">{{ t('employee.form.end_date') }}</VLabel>
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
                                        <VLabel class="required">{{ t('employee.form.basic_salary') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentEmployee.basic_salary" type="number" placeholder=""
                                                autocomplete="given-basic_salary" />
                                            <ErrorMessage class="help is-danger" name="basic_salary" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="payment_percentage">
                                        <VLabel class="required">{{ t('employee.form.payment_percentage') }}</VLabel>
                                        <VControl icon="feather:percent">
                                            <VInput v-model="currentEmployee.payment_percentage" type="number" />
                                            <ErrorMessage class="help is-danger" name="payment_percentage" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="nationality_id">
                                        <VLabel class="required">{{ t('employee.form.nationality') }}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentEmployee" v-model="currentEmployee.nationality_id">
                                                <VOption value="">{{ t('employee.form.nationality') }}</VOption>
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
                                        <VLabel class="required">{{ t('employee.form.position') }}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentEmployee" v-model="currentEmployee.position_id">
                                                <VOption value="">{{ t('employee.form.position') }}</VOption>
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
                                        <VLabel class="required">{{ t('employee.form.status') }}</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                                <VOption value="">{{ t('employee.form.status') }}</VOption>
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

.load {
    height: 400px;
    width: 500px;
}
</style>
