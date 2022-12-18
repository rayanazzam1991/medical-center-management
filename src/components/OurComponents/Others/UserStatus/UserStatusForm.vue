<script  lang="ts">
import { useHead } from "@vueuse/head"
import { useForm } from "vee-validate"
import { addUserStatus, editUserStatus, getUserStatus } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { defaultUserStatus, UserStatus } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { userstatusvalidationSchema } from "/@src/rules/Others/UserStatus/userstatusValidation"

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: '',
        },
    },

    emits: ['onSubmit'],
    setup(props, context) {
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle('UserStatus')
        const head = useHead({
            title: 'UserStatus',
        })
        const notif = useNotyf()

        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/userstatus'
        const currentUserStatus = ref(defaultUserStatus)
        const userstatusId = ref(0)
        // @ts-ignore
        userstatusId.value = route.params?.id as number ?? 0
        const getCurrentUserStatus = async () => {
            if (userstatusId.value === 0) {
                currentUserStatus.value.name = ''
                return
            }
            const { userStatus } = await getUserStatus(userstatusId.value)
            currentUserStatus.value = userStatus != undefined ? userStatus : defaultUserStatus

        }
        onMounted(() => {
            getCurrentUserStatus()
        })

        const validationSchema = userstatusvalidationSchema

        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: {
                name: currentUserStatus.value.name ?? '',
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

        const onSubmitAdd = async () => {
            var userstatusData = currentUserStatus.value
            const { userStatus, message, success } = await addUserStatus(userstatusData)
            if (success) {

                notif.dismissAll()
                notif.success(`${userStatus.name} ${viewWrapper.pageTitle} was added successfully`)


                router.push({ path: `/userstatus/${userStatus.id}` })

            }
            else {
                notif.error(message)
            }
        }
        const onSubmitEdit = async () => {
            const userstatusData = currentUserStatus.value
            const { message, success } = await editUserStatus(userstatusData)
            if (success) {

                notif.dismissAll()
                notif.success(`${userstatusData.name} ${viewWrapper.pageTitle} was edited successfully`)

                router.push({ path: `/userstatus/${userstatusData.id}` })
            }
            else {
                notif.error(message)
            }


        }

        return { pageTitle, onSubmit, currentUserStatus, viewWrapper, backRoute }
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
                                <VField id="name" v-slot="{ field }">
                                    <VLabel>{{ viewWrapper.pageTitle }} name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUserStatus.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <p v-if="field?.errorMessage" class="help is-danger">
                                            {{ field.errorMessage }}
                                        </p>
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
