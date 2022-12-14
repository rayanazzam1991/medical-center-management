<script setup  lang="ts">

import VRadio from '/@src/components/base/form/VRadio.vue';
import { custom, z as zod } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { useForm } from 'vee-validate';
import { getEmployee } from '/@src/composable/Employee/getEmployee';
import { updateEmployee } from '/@src/composable/Employee/updateEmployee';
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList';
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList';
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

const cities2 = ref<City[]>([])
const rooms2 = ref<Room[]>([])
const statuses2 = ref<UserStatus[]>([])
const nationalities2 = ref<Nationality[]>([])

onMounted(async () => {
    const { cities } = await getCitiesList(defaultCitySearchFilter)
    cities2.value = cities
    const { rooms } = await getRoomsList(defaultRoomSearchFilter)
    rooms2.value = rooms
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statuses2.value = userstatuses
    const { nationalities } = await getNationalitiesList(defaultNationalitySearchFilter)
    nationalities2.value = nationalities
    await fetchEmployee()

})



const validationSchema = toFormValidator(zod
    .object({
        first_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        last_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        birth_date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date must be a vaild date format YYYY-MM-DD')
                        .optional()),
        gender: zod.string(),
        phone_number:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                        .min(9, "Please enter a valid number"),
                ),
        address:
            zod
                .string({})
                .optional(),

        city_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
        room_id:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                        .optional()),
        user_status_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
        starting_date:
            zod
                .preprocess(
                    (input) => {
                        if (typeof input == "string" || input instanceof Date) return new Date(input)

                    },
                    zod.date({
                        required_error: "Please select a date and time",
                        invalid_type_error: "That's not a date!",
                    }),
                ),
        end_date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date must be a vaild date format YYYY-MM-DD')
                        .optional()),
        basic_salary:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid salary number" })
                    .min(0, "Please enter a valid salary number"),
            ),
        nationality_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
                    .optional(),
            ),

    }));

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
                                        <VInput disabled v-model="currentUser.phone_number" type="number" placeholder=""
                                            autocomplete="given-phone_number" />
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
                                            <VOption v-for="room in rooms2" :key="room.id" :value="room.id">{{
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
                                            <VOption v-for="city in cities2" :key="city.id" :value="city.id">{{
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
                                            <VOption v-for="status in statuses2" :key="status.id" :value="status.id">{{
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
                                            <VOption v-for="nationality in nationalities2" :key="nationality.id"
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

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }


                    .left {
                        width: 20%;
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }


                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
