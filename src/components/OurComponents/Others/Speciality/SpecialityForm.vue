<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultSpeciality, Speciality, SpecialityConsts } from '/@src/models/Others/Speciality/speciality';
import { getSpeciality, addSpeciality, editSpeciality } from '/@src/services/Others/Speciality/specialityService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { specialityvalidationSchema } from '/@src/rules/Others/Speciality/specialityValidation';
import sleep from "/@src/utils/sleep";
import { useSpeciality } from "/@src/stores/Others/Speciality/specialityStore";
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';


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
        viewWrapper.setPageTitle(t('speciality.form.page_title'));
        const head = useHead({
            title: t('speciality.form.page_title'),
        });
        const specialityStore = useSpeciality()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('speciality.form.form_header' , {type : formTypeName});

        const backRoute = "/speciality";
        const currentSpeciality = ref(defaultSpeciality);
        const specialityId = ref(0);

        // @ts-ignore
        specialityId.value = route.params?.id as number ?? 0;

        const getCurrentSpeciality = async () => {
            if (specialityId.value === 0) {
                currentSpeciality.value.name = ''
                currentSpeciality.value.status = 1
                return
            }
            const { speciality } = await getSpeciality(specialityId.value);
            currentSpeciality.value = speciality != undefined ? speciality : defaultSpeciality;
        };

        onMounted(() => {
            getCurrentSpeciality();
        });

        const validationSchema = specialityvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentSpeciality?.value?.name ?? "",
                status: currentSpeciality?.value?.status ?? 1,
            } : {
                name: "",
                status: 1,
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            var specialityData = currentSpeciality.value;
            const { success, message, speciality } = await addSpeciality(specialityData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                router.push({ path: `/speciality/${speciality.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            const specialityData = currentSpeciality.value;
            const { message, success } = await editSpeciality(specialityData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.edit'));
                router.push({ path: `/speciality/${specialityData.id}` });
            } else {
                await sleep(200);

                notif.error(message)

            }
        };

        return {t, pageTitle, onSubmit, currentSpeciality, viewWrapper, backRoute, SpecialityConsts, specialityStore };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="specialityStore?.loading" />
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
                                    <VLabel class="required">{{ t('speciality.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSpeciality.name" type="text" placeholder=""
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
                                    <VLabel class="required">{{ t('speciality.form.status') }}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentSpeciality.status" :value="SpecialityConsts.INACTIVE"
                                            :label="SpecialityConsts.showStatusName(0)" name="status" color="danger" />

                                        <VRadio v-model="currentSpeciality.status" :value="SpecialityConsts.ACTIVE"
                                            :label="SpecialityConsts.showStatusName(1)" name="status" color="success" />
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
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
