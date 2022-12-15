<script  lang="ts">
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { lineIcons } from '/@src/data/icons/lineIcons';
import { defaultSocialMedia, SocialMedia, SocialMediaConsts } from '/@src/models/CRM/SocialMedia/socialMedia';
import { socialmediavalidationSchema } from '../../../../rules/CRM/SocialMedia/socialmediaValidation';
import { getSocialMedia, addSocialMedia, editSocialMedia } from '/@src/services/CRM/SocialMedia/socialMediaService';
import { useViewWrapper } from '/@src/stores/viewWrapper';


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle("Social Media");
        const head = useHead({
            title: "Social Media",
        });
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const pageTitle = formType.value + " " + viewWrapper.pageTitle;
        const backRoute = "/social-media";
        const currentSocialMedia = ref(defaultSocialMedia);
        const socialMediaId = ref(0);
        // @ts-ignore
        socialMediaId.value = route.params?.id as number ?? 0;
        const getCurrentSocialMedia = async () => {
            if (socialMediaId.value === 0) {
                currentSocialMedia.value.name = ''
                currentSocialMedia.value.status = 1
                currentSocialMedia.value.icon = ''
                return
            }

            const socialMedia = await getSocialMedia(socialMediaId.value);
            currentSocialMedia.value = socialMedia != undefined ? socialMedia : defaultSocialMedia;
        };
        onMounted(() => {
            getCurrentSocialMedia();
        });
        const validationSchema = socialmediavalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: {
                name: "",
                icon: "",
                status: 1,
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
        const onSubmitAdd = handleSubmit(async (values) => {
            var socialMediaData = currentSocialMedia.value;
            socialMediaData = await addSocialMedia(socialMediaData) as SocialMedia;
            // @ts-ignore
            notif.dismissAll();
            // @ts-ignore
            notif.success(`${socialMediaData.name} ${viewWrapper.pageTitle} was added successfully`);
            router.push({ path: `/social-media/${socialMediaData.id}` });
        });
        const onSubmitEdit = async () => {
            const socialMediaData = currentSocialMedia.value;
            await editSocialMedia(socialMediaData);
            // @ts-ignore
            notif.dismissAll();
            // @ts-ignore
            notif.success(`${socialMediaData.name} ${viewWrapper.pageTitle} was edited successfully`);
            router.push({ path: `/social-media/${socialMediaData.id}` });
        };
        return { pageTitle, onSubmit, lineIcons, currentSocialMedia, viewWrapper, backRoute, SocialMediaConsts };
    },
    components: { ErrorMessage }
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
                                <VField id="name">
                                    <VLabel>{{ viewWrapper.pageTitle }} name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSocialMedia.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage class="help is-danger" name="name" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="icon">
                                    <VLabel>{{ viewWrapper.pageTitle }} icon</VLabel>
                                    <VControl :icon="currentSocialMedia.icon">
                                        <VSelect v-if="currentSocialMedia" v-model="currentSocialMedia.icon">
                                            <VOption value="">Icon</VOption>
                                            <VOption :value="'lnir lnir-facebook'">facebook</VOption>
                                            <VOption :value="'lnir lnir-instagram'">Instagram</VOption>
                                            <VOption :value="'lnir lnir-whatsapp'">Whatsapp</VOption>
                                            <VOption :value="'lnir lnir-snapchat'">Snapchat</VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="icon" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>

                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status">
                                    <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentSocialMedia.status" :value="SocialMediaConsts.INACTIVE"
                                            :label="SocialMediaConsts.showStatusName(0)" name="status"
                                            color="warning" />

                                        <VRadio v-model="currentSocialMedia.status" :value="SocialMediaConsts.ACTIVE"
                                            :label="SocialMediaConsts.showStatusName(1)" name="status"
                                            color="success" />
                                        <ErrorMessage class="help is-danger" name="status" />

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
