<script  lang="ts">
import { useHead } from '@vueuse/head'
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultNationality, Nationality, NationalityConsts } from '/@src/models/Others/Nationality/nationality';
import { nationalityvalidationSchema } from '/@src/rules/Others/Nationality/nationalityValidation';
import { getNationality, addNationality, editNationality } from '/@src/services/Others/Nationality/nationalityService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep";
import { useNationality } from '/@src/stores/Others/Nationality/nationalityStore';
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
        viewWrapper.setPageTitle("Nationality");
        const head = useHead({
            title: "Nationality",
        });
        const nationalityStore = useNationality()
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const pageTitle = formType.value + " " + viewWrapper.pageTitle;
        const backRoute = "/nationality";
        const currentNationality = ref(defaultNationality);
        const nationalityId = ref(0);
        // @ts-ignore
        nationalityId.value = route.params?.id as number ?? 0;
        const getCurrentNationality = async () => {
            if (nationalityId.value === 0) {
                currentNationality.value.name = ''
                currentNationality.value.status = 1
                return
            }

            const { nationality } = await getNationality(nationalityId.value);
            currentNationality.value = nationality != undefined ? nationality : defaultNationality;
        };
        onMounted(() => {
            getCurrentNationality();
        });
        const validationSchema = nationalityvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentNationality.value.name ?? "",
                status: currentNationality.value.status ?? 1,
            } : {
                name: "",
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
            var nationalityData = currentNationality.value;
            const { nationality, message, success } = await addNationality(nationalityData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(`${nationality.name} ${viewWrapper.pageTitle} was added successfully`);
                await sleep(500)
                router.push({ path: `/nationality/${nationality.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = handleSubmit(async () => {
            const nationalityData = currentNationality.value;
            const { success, message } = await editNationality(nationalityData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(`${nationalityData.name} ${viewWrapper.pageTitle} was edited successfully`);
                await sleep(500);
                router.push({ path: `/nationality/${nationalityData.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        return { pageTitle, onSubmit, currentNationality, viewWrapper, backRoute, NationalityConsts, nationalityStore };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="nationalityStore?.loading" />
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentNationality.name" type="text" placeholder=""
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
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>

                                    <VControl>

                                        <VRadio v-model="currentNationality.status" :value="NationalityConsts.INACTIVE"
                                            :label="NationalityConsts.showStatusName(0)" name="status"
                                            color="danger" />

                                        <VRadio v-model="currentNationality.status" :value="NationalityConsts.ACTIVE"
                                            :label="NationalityConsts.showStatusName(1)" name="status"
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
