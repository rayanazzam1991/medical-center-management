<script  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { addUser, getUser, editUser } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCity, City, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { defaultRoom, Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultUser, defaultCreateUpdateUser, User } from '/@src/models/Others/User/user';
import { defaultUserStatus, UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { uservalidationSchema } from '/@src/rules/Others/User/userValidation';
import { useUser } from '/@src/stores/Others/User/userStore';
import sleep from '/@src/utils/sleep';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';

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
        const {t} = useI18n()
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle(t('user.form.page_title'))
        const head = useHead({
            title: t('user.form.page_title'),
        })
        const userStore = useUser()
        const notif = useNotyf() as Notyf
        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('user.form.form_header' , {type : formTypeName});

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
            const { user } = await getUser(userId.value)
            currentUser.value = user != undefined ? user : defaultUser

        }
        const citiesList = ref<City[]>([])
        const roomsList = ref<Room[]>([])
        const statusesList = ref<UserStatus[]>([])
        onMounted(async () => {
            const { cities } = await getCitiesList(defaultCitySearchFilter)
            citiesList.value = cities
            const { rooms } = await getRoomsList(defaultRoomSearchFilter)
            roomsList.value = rooms
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses
        })

        onMounted(() => {
            getCurrentUser()
        }
        )


        const validationSchema = uservalidationSchema
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
            const { user, success, message } = await addUser(userForm)
            if (success) {

                // @ts-ignore
                notif.dismissAll()
                await sleep(200);

                // @ts-ignore

                notif.success(t('toast.success.add'))
                await sleep(500)
                router.push({ path: `/user/${user.id}` })
            }
            else {
                await sleep(200);

                notif.error(message)
            }

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
            const { message, success } = await editUser(userForm)
            if (success) {

                // @ts-ignore

                notif.dismissAll()
                await sleep(200);

                // @ts-ignore

                notif.success(t('toast.success.edit'))
                await sleep(500)
                router.push({ path: `/user/${userData.id}` })
            } else {
                await sleep(200);

                notif.error(message)
            }


        }

        return { t, pageTitle, onSubmit, currentUser, userStore, viewWrapper, backRoute, citiesList, roomsList, statusesList }
    },


})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="userStore?.loading" />
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
                                    <VLabel>{{ t('user.form.first_name') }}</VLabel>
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
                                    <VLabel>{{ t('user.form.last_name') }}</VLabel>
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
                                    <VLabel>{{ t('user.form.birth_date') }} </VLabel>
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
                                    <VLabel>{{ t('user.form.phone_number') }} </VLabel>
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
                                    <VLabel>{{ t('user.form.address') }} </VLabel>
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
                                    <VLabel>{{ t('user.form.gender') }}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" :label="t('gender.male')" name="gender"
                                            color="warning" />

                                        <VRadio v-model="currentUser.gender" value="Female" :label="t('gender.female')" name="gender"
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
                                    <VLabel>{{t('user.form.room')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.room" v-model="currentUser.room.id">
                                            <VOption value="">{{t('user.form.room')}}</VOption>
                                            <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{
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
                                    <VLabel>{{t('user.form.city')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.city" v-model="currentUser.city.id">
                                            <VOption value="">{{t('user.form.city')}}</VOption>
                                            <VOption v-for="city in citiesList" :key="city.id" :value="city.id">{{
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
                                    <VLabel>{{t('user.form.status')}}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser.status" v-model="currentUser.status.id">
                                            <VOption value="">{{t('user.form.status')}}</VOption>
                                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">
                                                {{
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
@import '/@src/scss/styles/formPage.scss';
</style>
