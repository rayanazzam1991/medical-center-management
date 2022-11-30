<script  lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { addUser } from '/@src/composable/Others/User/addUser'
import { editUser } from '/@src/composable/Others/User/editUser'
import { User } from '/@src/utils/api/Others/User'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'
import { defaultUser } from '/@src/stores/Others/User/UserStore'
import { getUser } from '/@src/composable/Others/User/getUser'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useNotyf } from '/@src/composable/useNotyf';
import { toFormValidator } from '@vee-validate/zod';
import { useForm, ErrorMessage } from 'vee-validate';
import { z as zod } from 'zod'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartment, defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
import { defaultCreateUpdateUser } from '/@src/stores/Others/User/userStore';
import { defaultCity, defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore';
import { defaultRoom, defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore';
import { defaultUserStatus, defaultUserStatusSearchFilter } from '/@src/stores/Others/UserStatus/userStatusStore';
import { UserStatus } from '/@src/utils/api/Others/UserStatus';
import { getCitiesList } from '/@src/composable/Others/City/getCitiesList';
import { City } from '/@src/utils/api/Others/City';
import { Room } from '/@src/utils/api/Others/Room';
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList';
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList';


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: '',
        },
    },
    components: { ErrorMessage },

    emits: ['onSubmit'],
    setup(props, context) {
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle('User')
        const head = useHead({
            title: 'User',
        })
        const notif = useNotyf()

        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/user'
        const currentUser = ref(defaultUser)
        const currentCreateUpdateUser = ref(defaultCreateUpdateUser)
        const userId = ref(0)
        // @ts-ignore
        userId.value = route.params?.id as number ?? 0
        const getCurrentUser = async () => {
            if (userId.value === 0) {
                currentUser.value.first_name = ''
                currentUser.value.last_name = ''
                currentUser.value.gender = ''
                currentUser.value.birth_date = ''
                currentUser.value.phone_number = ''
                currentUser.value.address = ''
                currentUser.value.room = defaultRoom
                currentUser.value.city = defaultCity
                currentUser.value.status = defaultUserStatus
                return
            }
            const user = await getUser(userId.value)
            currentUser.value = user != undefined ? user : defaultUser

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
            getCurrentUser()
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
                        .min(1, "This field is required"),
                // birth_date:
                //     zod
                //         .date({
                //             required_error: "This field is required",
                //         }),
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
                        .min(1, "This field is required"),

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
                room_id: zod
                    .preprocess(
                        (input) => {
                            const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                            return processed.success ? processed.data : input;
                        },
                        zod
                            .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                            .min(1, "This field is required"),
                    ),
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
            }));

        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: {
                first_name: '',
                last_name: '',
                gender: 'Female',
                birth_date: '',
                phone_number: '',
                address: '',
                room_id: 0,
                city_id: 0,
                user_status_id: 0,
            },
        })

        const onSubmit = async (method: String) => {
            if (method == 'Add') {
                await onSubmitAdd()
            }
            else if (method == 'Edit') {
                await onSubmitEdit()
            }
            else return
        }
        const onSubmitAdd = handleSubmit(async (values) => {

            var userData = currentUser.value
            console.log(userData)
            var userForm = currentCreateUpdateUser.value
            userForm.first_name = userData.first_name
            userForm.last_name = userData.last_name
            userForm.gender = userData.gender
            userForm.birth_date = userData.birth_date
            userForm.phone_number = userData.phone_number
            userForm.address = userData.address
            userForm.room_id = userData.room?.id
            userForm.city_id = userData.city?.id
            userForm.user_status_id = userData.status?.id
            userData = await addUser(userForm) as User
            // @ts-ignore
            notif.dismissAll()
            // @ts-ignore

            notif.success(` ${viewWrapper.pageTitle} ${userData.number} was added successfully`)


            router.push({ path: `/user/${userData.id}` })

        })
        const onSubmitEdit = async () => {
            const userData = currentUser.value
            var userForm = currentCreateUpdateUser.value
            userForm.id = userData.id
            userForm.first_name = userData.first_name
            userForm.last_name = userData.last_name
            userForm.gender = userData.gender
            userForm.birth_date = userData.birth_date
            userForm.phone_number = userData.phone_number
            userForm.address = userData.address
            userForm.room_id = userData.room?.id
            userForm.city_id = userData.city?.id
            userForm.user_status_id = userData.status?.id
            console.log(userForm)
            await editUser(userForm)
            // @ts-ignore

            notif.dismissAll()
            // @ts-ignore

            notif.success(`${viewWrapper.pageTitle} ${userData.number} was edited successfully`)

            router.push({ path: `/user/${userData.id}` })


        }

        return { pageTitle, onSubmit, currentUser, viewWrapper, backRoute, cities2, rooms2, statuses2 }
    },


})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
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
                                    <VLabel>{{ viewWrapper.pageTitle }} first name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage name="first_name" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} last name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.last_name" type="text" placeholder=""
                                            autocomplete="given-last_name" />
                                        <ErrorMessage name="last_name" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} birth date </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.birth_date" type="date" placeholder=""
                                            autocomplete="given-birth_date" />
                                        <ErrorMessage name="birth_date" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} phone number </VLabel>
                                    <VControl icon="feather:chevrons-right">

                                        <VInput v-model="currentUser.phone_number" type="number" placeholder=""
                                            autocomplete="given-phone_number" />
                                        <ErrorMessage name="phone_number" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} address </VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VTextarea v-model="currentUser.address" />
                                        <ErrorMessage name="address" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} gender</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                            color="warning" />

                                        <VRadio v-model="currentUser.gender" value="Female" label="Female" name="gender"
                                            color="success" />
                                        <ErrorMessage name="gender" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField class="column " id="room_id">
                                    <VLabel>{{ viewWrapper.pageTitle }} room</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.room" v-model="currentUser.room.id">
                                            <VOption value="">Department</VOption>
                                            <VOption v-for="room in rooms2" :key="room.id" :value="room.id">{{
                                                    room.number
                                            }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage name="room_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField class="column " id="city_id">
                                    <VLabel>{{ viewWrapper.pageTitle }} city</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.city" v-model="currentUser.city.id">
                                            <VOption value="">Department</VOption>
                                            <VOption v-for="city in cities2" :key="city.id" :value="city.id">{{
                                                    city.name
                                            }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage name="city_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField class="column " id="user_status_id">
                                    <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.status" v-model="currentUser.status.id">
                                            <VOption value="">Department</VOption>
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
