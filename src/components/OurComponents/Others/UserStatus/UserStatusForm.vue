<script  lang="ts">
import { useHead } from "@vueuse/head"
import { ErrorMessage, useForm } from "vee-validate"
import { addUserStatus, editUserStatus, getUserStatus } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { defaultUserStatus, UserStatus } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { userstatusvalidationSchema } from "/@src/rules/Others/UserStatus/userstatusValidation"
import sleep from "/@src/utils/sleep"
import { useUserStatus } from "/@src/stores/Others/UserStatus/userStatusStore"
import { useI18n } from "vue-i18n"

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const {t} = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('user_status.form.page_title'));
        const head = useHead({
            title: t('user_status.form.page_title'),
        });
        const userStatusStore = useUserStatus();
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('user_status.form.form_header' , {type : formTypeName});
        const backRoute = "/userstatus";
        const currentUserStatus = ref(defaultUserStatus);
        const userstatusId = ref(0);
        // @ts-ignore
        userstatusId.value = route.params?.id as number ?? 0;
        const getCurrentUserStatus = async () => {
            if (userstatusId.value === 0) {
                currentUserStatus.value.name = "";
                return;
            }
            const { userStatus } = await getUserStatus(userstatusId.value);
            currentUserStatus.value = userStatus != undefined ? userStatus : defaultUserStatus;
        };
        onMounted(() => {
            getCurrentUserStatus();
        });
        const validationSchema = userstatusvalidationSchema;
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentUserStatus.value.name ?? "",
            } : {
                name: ""
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            }
            else if (method == "Edit") {
                await onSubmitEdit();
            }
            else
                return;
        };
        const onSubmitAdd = handleSubmit(async () => {
            var userstatusData = currentUserStatus.value;
            const { userStatus, message, success } = await addUserStatus(userstatusData);
            if (success) {
                notif.dismissAll();
                await sleep(200);

                notif.success(`${userStatus.name} ${viewWrapper.pageTitle} was added successfully`);
                await sleep(500);
                router.push({ path: `/userstatus/${userStatus.id}` });
            }
            else {
                await sleep(200);

                notif.error(message);
            }
        });
        const onSubmitEdit = handleSubmit(async () => {
            const userstatusData = currentUserStatus.value;
            const { message, success } = await editUserStatus(userstatusData);
            if (success) {
                notif.dismissAll();
                await sleep(200);

                notif.success(`${userstatusData.name} ${viewWrapper.pageTitle} was edited successfully`);
                await sleep(500);
                router.push({ path: `/userstatus/${userstatusData.id}` });
            }
            else {
                await sleep(200);

                notif.error(message);
            }
        });
        return { t, pageTitle, onSubmit, currentUserStatus, viewWrapper, backRoute, userStatusStore };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="userStatusStore?.loading" />
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
                                    <VLabel class="required">{{t('user_status.form.name')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUserStatus.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage class="help is-danger" name="name" />

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
