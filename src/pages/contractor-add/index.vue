<script setup  lang="ts">import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { addContractor } from '/@src/composable/Contractor/addContractor';
import { getCitiesList } from '/@src/composable/Others/City/getCitiesList';
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList';
import { phoneExistsCheck } from '/@src/composable/Others/User/phoneExistsCheck';
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList';
import { useNotyf } from '/@src/composable/useNotyf';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { defaultCreateContractor } from '/@src/stores/Contractor/contractorStore';
import { defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore';
import { defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore';
import { defaultCreateUpdateUser } from '/@src/stores/Others/User/userStore';
import { defaultUserStatusSearchFilter } from '/@src/stores/Others/UserStatus/userStatusStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { City } from '/@src/utils/api/Others/City';
import { Room } from '/@src/utils/api/Others/Room';
import { UserStatus } from '/@src/utils/api/Others/UserStatus';
import { z as zod } from 'zod';






const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor Main Info')
const head = useHead({
    title: 'Contractor',
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
                path: `/contractor-add/${contractorForm.data.id}/profile-picture`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Contractor Main Info'
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentContractor = ref(defaultCreateContractor)
const getCurrentContractor = () => {

    currentUser.value = contractorForm.userForm
    currentContractor.value = contractorForm.data


}
const cities2 = ref<City[]>([])
const rooms2 = ref<Room[]>([])
const statuses2 = ref<UserStatus[]>([])

onMounted(async () => {
    const { cities } = await getCitiesList(defaultCitySearchFilter)
    cities2.value = cities
    const { rooms } = await getRoomsList(defaultRoomSearchFilter)
    rooms2.value = rooms
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statuses2.value = userstatuses

})
onMounted(() => {
    getCurrentContractor()
}
)


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
                .optional(),
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
                .string({
                    required_error: "This field is required",
                })
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
                        invalid_type_error: "That's not a date!",
                    }).optional(),
                ),
        payment_percentage:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ invalid_type_error: "Please enter a valid number" })
                        .min(0, 'Please enter a number from 0-100').max(100, 'Please enter a number from 0-100'),
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
        starting_date: currentContractor.value.starting_date,
        payment_percentage: currentContractor.value.payment_percentage,
    },
})


const onSubmitAdd = handleSubmit(async (values) => {

    var userData = currentUser.value
    const { result } = await phoneExistsCheck(userData.phone_number)
    phoneCheck.value = result as string
    if (phoneCheck.value === 'false') {
        
        var customerData = currentContractor.value
        contractorForm.data.starting_date = customerData.starting_date
        contractorForm.data.payment_percentage = customerData.payment_percentage
        contractorForm.userForm.first_name = userData.first_name
        contractorForm.userForm.last_name = userData.last_name
        contractorForm.userForm.password = userData.password
        contractorForm.userForm.gender = userData.gender
        contractorForm.userForm.birth_date = userData.birth_date
        contractorForm.userForm.phone_number = '964' + userData.phone_number
        contractorForm.userForm.address = userData.address
        contractorForm.userForm.room_id = userData.room_id
        contractorForm.userForm.city_id = userData.city_id
        contractorForm.userForm.user_status_id = userData.user_status_id

        const contractor = await addContractor(contractorForm.data, contractorForm.userForm)

        if (contractor.success) {
            contractorForm.data.id = contractor.contractor.id
            // @ts-ignore
            notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} was added successfully`)

            return true
        }
        else {
            // @ts-ignore

            notif.error(contractor.success)
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
                            <div class="column is-12">
                                <VField id="first_name">
                                    <VLabel>First name</VLabel>
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
                                    <VLabel>Last name</VLabel>
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
                                    <VLabel>Birth date </VLabel>
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
                        <div class="columns column is-multiline ">
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
                                    <VLabel>Address </VLabel>
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
                                    <VLabel>Gender</VLabel>

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
                                    <VLabel>Room</VLabel>
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
                                    <VLabel>City</VLabel>
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
                                    <VLabel>Status</VLabel>
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
                                    <VLabel>Starting date </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentContractor.starting_date" type="date" />
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
                                <VField v-slot="{ id }" class="has-curved-tooltip" id="payment_percentage">
                                    <VLabel>Payment Percentage</VLabel>

                                    <VControl>
                                        <Slider :id="id" v-model="currentContractor.payment_percentage" />
                                        <ErrorMessage class="help is-danger" name="payment_percentage" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
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
